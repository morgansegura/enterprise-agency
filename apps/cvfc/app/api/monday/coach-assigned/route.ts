import { NextResponse, type NextRequest } from "next/server";

import { sendCoachNotification } from "@/lib/email/send";
import { createLogger } from "@/lib/logger";
import {
  COACH_COLUMN,
  COACH_EMAIL_COLUMN,
  COACH_NOTIFIED_COLUMN,
  SIGNUPS_BOARD,
  findCoachByName,
  getSignupRow,
  markCoachNotified,
  signupColumnId,
} from "@/lib/monday";

/**
 * Monday webhook — fires when the Coach column changes on the CVFC Signups
 * board, i.e. when Isella assigns (or reassigns) a coach by hand. Auto-matched
 * coaches are emailed at signup by `saveSignup`; this covers every assignment
 * made on the board afterwards.
 *
 * The `Coach Notified` column holds the address we last emailed for a player,
 * so the signup-time send and this webhook can't double-notify, while a genuine
 * reassignment still reaches the new coach.
 *
 * Register in Monday (Integrations → Webhooks), event "when a column changes":
 *   POST https://<host>/api/monday/coach-assigned?secret=$MONDAY_WEBHOOK_SECRET
 * Monday verifies the URL first by POSTing a `challenge`, echoed back below.
 */

const log = createLogger("coach-assigned");

const SECRET = process.env.MONDAY_WEBHOOK_SECRET;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type MondayEvent = {
  boardId?: number | string;
  pulseId?: number | string;
  columnId?: string;
  value?: unknown;
};

type MondayPayload = { challenge?: string; event?: MondayEvent };

/** Monday nests the chosen label differently per column type. */
function coachNameFrom(value: unknown, fallback: string): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const v = value as Record<string, unknown>;
    const label = v.label ?? v.text ?? v.value;
    if (typeof label === "string") return label;
    if (label && typeof label === "object") {
      const inner = (label as Record<string, unknown>).text;
      if (typeof inner === "string") return inner;
    }
  }
  return fallback;
}

export async function POST(req: NextRequest) {
  let payload: MondayPayload;
  try {
    payload = (await req.json()) as MondayPayload;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  // Monday's URL-verification handshake — must echo the challenge, unauthed.
  if (payload.challenge) {
    return NextResponse.json({ challenge: payload.challenge });
  }

  if (!SECRET || req.nextUrl.searchParams.get("secret") !== SECRET) {
    log.warn("rejected unauthenticated webhook");
    return new NextResponse("Invalid token", { status: 401 });
  }

  const event = payload.event;
  if (!event?.pulseId) {
    return NextResponse.json({ ok: true, skipped: "no item" });
  }
  if (String(event.boardId ?? "") !== String(SIGNUPS_BOARD)) {
    return NextResponse.json({ ok: true, skipped: "other board" });
  }

  const coachColumnId = await signupColumnId(COACH_COLUMN);
  if (coachColumnId && event.columnId && event.columnId !== coachColumnId) {
    return NextResponse.json({ ok: true, skipped: "other column" });
  }

  const signupId = String(event.pulseId);
  const row = await getSignupRow(signupId);
  if (!row) {
    log.warn("item not found", { signupId });
    return NextResponse.json({ ok: true, skipped: "item not found" });
  }

  const coachName = coachNameFrom(event.value, row[COACH_COLUMN] ?? "").trim();
  if (!coachName) {
    return NextResponse.json({ ok: true, skipped: "coach cleared" });
  }

  // Prefer the row's Coach Email; fall back to the Coaches board by name.
  let coachEmail = (row[COACH_EMAIL_COLUMN] ?? "").trim();
  if (!coachEmail) {
    coachEmail = (await findCoachByName(coachName))?.email ?? "";
  }
  if (!coachEmail) {
    log.error("no email for assigned coach", { signupId, coachName });
    return NextResponse.json({ ok: false, error: "coach email not found" });
  }

  const to = coachEmail.toLowerCase();
  if ((row[COACH_NOTIFIED_COLUMN] ?? "").trim().toLowerCase() === to) {
    return NextResponse.json({ ok: true, skipped: "already notified" });
  }

  const [year, month] = (row["Date of Birth"] ?? "").split("-");

  try {
    await sendCoachNotification(to, {
      coachName,
      playerName: row.Player ?? "",
      birthYear: row["Player Birth Year"] || year || "",
      birthMonth: row["Player Birth Month"] || MONTHS[Number(month) - 1],
      gender: row.Gender ?? "",
      goalkeeper: row.Position === "Goalkeeper",
      priorLeagueLevel: row["Prior League / Level"],
      parentName: row["Parent Name"] ?? "",
      parentEmail: row["Parent Email"] ?? "",
      parentPhone: row["Parent Phone"],
    });
    await markCoachNotified(signupId, to);
    log.info("coach notified", { signupId, coach: to, coachName });
    return NextResponse.json({ ok: true, notified: to });
  } catch (err) {
    log.error("coach notification failed", { signupId, coach: to, err });
    return NextResponse.json({ ok: false, error: "send failed" });
  }
}
