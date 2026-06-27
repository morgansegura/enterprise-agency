/**
 * CVFC transactional email templates. Each returns { subject, html }. Dynamic
 * values are escaped inside the helpers — pass raw strings.
 */

import { BRAND, emailShell, esc, FONT, infoRow } from "./shell";

export type ParentEmailData = {
  parentName: string;
  /** Child's first name — used in the warm, personal greeting. */
  playerFirstName: string;
  /** Optional feedback URL; the "Share your experience" line is omitted if absent. */
  feedbackUrl?: string;
  /** Sign-off name. Defaults to the Academy Director. */
  signerName?: string;
  /** Sign-off role. Defaults to "Academy Director". */
  signerTitle?: string;
};

export type CoachEmailData = {
  coachName?: string;
  playerName: string;
  birthYear: string | number;
  birthMonth?: string;
  gender: string;
  goalkeeper?: boolean | string;
  priorLeagueLevel?: string;
  parentName: string;
  parentEmail: string;
  parentPhone?: string;
};

export type RenderedEmail = { subject: string; html: string };

function heading(text: string): string {
  return `<h1 style="margin:0 0 16px;font-family:${FONT};font-size:23px;line-height:1.25;color:${BRAND.midnight};font-weight:700;letter-spacing:-0.01em;">${esc(text)}</h1>`;
}

/** Paragraph wrapper. Body may contain trusted inline markup (already escaped). */
function p(bodyHtml: string): string {
  return `<p style="margin:0 0 16px;">${bodyHtml}</p>`;
}

/** Parent thank-you — warm, family-first. */
export function parentThankYouEmail(data: ParentEmailData): RenderedEmail {
  const name = esc(data.playerFirstName);
  const signerName = esc(data.signerName ?? "J. Hector Diaz");
  const signerTitle = esc(data.signerTitle ?? "Academy Director");
  const feedbackLine = data.feedbackUrl
    ? p(
        `If you have a minute, we'd love to hear how your experience has been so far — <a href="${esc(data.feedbackUrl)}" target="_blank" style="color:${BRAND.gold};font-weight:bold;text-decoration:underline;">Share your experience</a>.`,
      )
    : "";
  const body = `
        ${heading("Welcome to the CVFC family")}
        ${p(`Hi ${esc(data.parentName)},`)}
        ${p(`Thank you for choosing Chula Vista FC for <strong>${name}</strong> — we're glad your family is here.`)}
        ${p(`What happens next: one of our coaches will reach out about ${name}'s evaluation within 48 hours, so keep an eye on your email and phone.`)}
        ${feedbackLine}
        ${p(`Welcome to the CVFC family,`)}
        ${p(`<strong>${signerName}</strong><br/>${signerTitle}, Chula Vista FC`)}`;

  return {
    subject: "Welcome to Chula Vista FC",
    html: emailShell({
      previewText: "We're glad your family is here — here's what happens next.",
      bodyHtml: body,
    }),
  };
}

/** Coach notification — internal; player + parent contact for the evaluator. */
export function coachNotificationEmail(data: CoachEmailData): RenderedEmail {
  const name = esc(data.playerName);
  const gk =
    typeof data.goalkeeper === "boolean"
      ? data.goalkeeper
        ? "Yes"
        : "No"
      : data.goalkeeper || "—";

  const body = `
        ${heading("New evaluation request")}
        ${p(`Hi ${esc(data.coachName || "Coach")},`)}
        ${p(`A new player just requested an evaluation through the website and may be in your group. Here are their details:`)}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 20px;">
          ${infoRow("Player", String(data.playerName))}
          ${infoRow("Birth year", String(data.birthYear))}
          ${infoRow("Birth month", data.birthMonth || "—")}
          ${infoRow("Gender", data.gender)}
          ${infoRow("Goalkeeper", String(gk))}
          ${data.priorLeagueLevel ? infoRow("Prior league / level", data.priorLeagueLevel) : ""}
          ${infoRow("Parent / guardian", data.parentName)}
          ${infoRow("Email", data.parentEmail)}
          ${infoRow("Phone", data.parentPhone || "—")}
        </table>
        ${p(`Please reach out to the family to schedule ${name}'s evaluation.`)}`;

  return {
    subject: `New evaluation request — ${data.playerName} (${data.birthYear})`,
    html: emailShell({
      previewText: `${data.playerName} just requested an evaluation and may be in your group.`,
      bodyHtml: body,
    }),
  };
}
