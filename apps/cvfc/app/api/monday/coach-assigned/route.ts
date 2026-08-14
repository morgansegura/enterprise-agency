import { NextResponse, type NextRequest } from "next/server";

import { sendCoachNotification } from "@/lib/email/send";
import { createLogger } from "@/lib/logger";
import {
  COACH_COLUMN,
  COACH_NOTIFIED_COLUMN,
  SIGNUPS_BOARD,
  findCoachByName,
  getCoachByItemId,
  getSignupRow,
  markCoachNotified,
  signupColumnId,
} from "@/lib/monday";

/**
 * Monday webhook — fires when the Coach column changes on the CVFC Signups
 * board. This is the ONLY thing that emails a coach: signup itself creates the
 * row with no coach and only thanks the parent, so a coach hears from us
 * exactly when someone assigns them the player.
 *
 * The `Coach Notified` column holds the address we last emailed for a player,
 * so repeated edits can't double-notify while a genuine reassignment still
 * reaches the new coach.
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
};

type MondayPayload = { challenge?: string; event?: MondayEvent };

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

  const coachName = row.coachName.trim();
  if (!coachName && !row.coachItemId) {
    return NextResponse.json({ ok: true, skipped: "no coach assigned" });
  }

  // The "Coach Email" mirror is the fast path; fall back to reading the linked
  // coach off the Coaches board, then to a name lookup.
  let coachEmail = row.coachEmail;
  if (!coachEmail && row.coachItemId) {
    coachEmail = (await getCoachByItemId(row.coachItemId))?.email ?? "";
  }
  if (!coachEmail && coachName) {
    coachEmail = (await findCoachByName(coachName))?.email ?? "";
  }
  if (!coachEmail) {
    log.error("no email for assigned coach", {
      signupId,
      coachName,
      coachItemId: row.coachItemId,
    });
    return NextResponse.json({ ok: false, error: "coach email not found" });
  }

  const to = coachEmail.toLowerCase();
  const v = row.values;
  if ((v[COACH_NOTIFIED_COLUMN] ?? "").trim().toLowerCase() === to) {
    return NextResponse.json({ ok: true, skipped: "already notified" });
  }

  const [year, month] = (v["Date of Birth"] ?? "").split("-");

  try {
    await sendCoachNotification(to, {
      coachName,
      playerName: v.Player ?? "",
      birthYear: v["Player Birth Year"] || year || "",
      birthMonth: v["Player Birth Month"] || MONTHS[Number(month) - 1],
      gender: v.Gender ?? "",
      goalkeeper: v.Position === "Goalkeeper",
      priorLeagueLevel: v["Prior League / Level"],
      parentName: v["Parent Name"] ?? "",
      parentEmail: v["Parent Email"] ?? "",
      parentPhone: v["Parent Phone"],
    });
    await markCoachNotified(signupId, to);
    log.info("coach notified", { signupId, coach: to, coachName });
    return NextResponse.json({ ok: true, notified: to });
  } catch (err) {
    log.error("coach notification failed", { signupId, coach: to, err });
    return NextResponse.json({ ok: false, error: "send failed" });
  }
}
