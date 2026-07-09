"use server";

import { esc, sendEmail } from "@/lib/email/send";

import { CONTACT_TO, isEmail, type FormState } from "./types";

/** Contact form submission → emails Emily. Honeypot + validation guarded. */
export async function submitContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  // Honeypot — bots fill hidden fields; silently accept and drop.
  if (formData.get("company")) return { ok: true, message: "Thanks!" };

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const newsletter = formData.get("newsletter") === "on";

  if (!firstName)
    return { ok: false, message: "Please enter your first name." };
  if (!isEmail(email))
    return { ok: false, message: "Please enter a valid email address." };

  try {
    await sendEmail({
      to: CONTACT_TO,
      replyTo: email,
      subject: `New inquiry from ${firstName} ${lastName}`.trim(),
      html: `
        <h2>New contact inquiry</h2>
        <p><strong>Name:</strong> ${esc(firstName)} ${esc(lastName)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Phone:</strong> ${esc(phone) || "—"}</p>
        <p><strong>Newsletter:</strong> ${newsletter ? "Yes" : "No"}</p>
        <p><strong>Message:</strong><br/>${esc(message) || "—"}</p>
      `,
    });
    return { ok: true, message: "Thanks — Emily will be in touch soon." };
  } catch {
    return {
      ok: false,
      message: "Something went wrong. Please try again or email us directly.",
    };
  }
}
