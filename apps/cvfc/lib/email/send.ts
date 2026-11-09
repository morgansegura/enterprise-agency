import "server-only";

/**
 * Resend send wrappers — server-only (reads RESEND_API_KEY). Sender + reply-to
 * are env-driven: send from onboarding@resend.dev until chulavistafc.com is
 * verified in Resend, then set RESEND_FROM to noreply@chulavistafc.com.
 */

import {
  coachNotificationEmail,
  parentThankYouEmail,
  tryoutCoachEmail,
  tryoutParentEmail,
  type CoachEmailData,
  type ParentEmailData,
  type TryoutCoachEmailData,
  type TryoutParentEmailData,
} from "./templates";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM =
  process.env.RESEND_FROM ??
  process.env.EMAIL_FROM ??
  "Chula Vista FC <onboarding@resend.dev>";
const REPLY_TO = process.env.RESEND_REPLY_TO ?? process.env.EMAIL_REPLY_TO;
/** Tryout emails can reply to their own inbox; otherwise the site's. */
const TRYOUTS_REPLY_TO = process.env.TRYOUTS_REPLY_TO || REPLY_TO;

type SendArgs = { to: string; subject: string; html: string; replyTo?: string };

async function sendEmail({
  to,
  subject,
  html,
  replyTo = REPLY_TO,
}: SendArgs): Promise<{ id: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not set");

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  const body = (await res.json()) as { id?: string; message?: string };
  if (!res.ok) {
    // Name the sender: a rejection is almost always the FROM domain, and the
    // configured value is the one thing the logs otherwise can't tell you.
    throw new Error(
      `Resend error ${res.status} sending from "${FROM}": ${body.message ?? "unknown"}`,
    );
  }
  return { id: body.id ?? "" };
}

export function sendParentThankYou(to: string, data: ParentEmailData) {
  const { subject, html } = parentThankYouEmail(data);
  return sendEmail({ to, subject, html });
}

export function sendCoachNotification(to: string, data: CoachEmailData) {
  const { subject, html } = coachNotificationEmail(data);
  return sendEmail({ to, subject, html });
}

export function sendTryoutConfirmation(
  to: string,
  data: TryoutParentEmailData,
) {
  const { subject, html } = tryoutParentEmail(data);
  return sendEmail({ to, subject, html, replyTo: TRYOUTS_REPLY_TO });
}

export function sendTryoutCoachNotification(
  to: string,
  data: TryoutCoachEmailData,
) {
  const { subject, html } = tryoutCoachEmail(data);
  return sendEmail({ to, subject, html, replyTo: TRYOUTS_REPLY_TO });
}
