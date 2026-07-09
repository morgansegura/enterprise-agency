import "server-only";

/**
 * Resend send wrapper — server-only (reads RESEND_API_KEY). Sender is env-driven:
 * send from `onboarding@resend.dev` until the brand domain is verified in Resend,
 * then set RESEND_FROM to e.g. `noreply@emilygreen.com`.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const FROM = process.env.RESEND_FROM ?? "Emily Green <onboarding@resend.dev>";

export type SendArgs = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendArgs): Promise<{ id: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not set");

  const reply = replyTo ?? process.env.RESEND_REPLY_TO;

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
      ...(reply ? { reply_to: reply } : {}),
    }),
  });

  const body = (await res.json()) as { id?: string; message?: string };
  if (!res.ok) {
    throw new Error(`Resend error ${res.status}: ${body.message ?? "unknown"}`);
  }
  return { id: body.id ?? "" };
}

/** Minimal HTML escape for user-supplied values. */
export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
