"use server";

import { esc, sendEmail } from "@/lib/email/send";

import { CONTACT_TO, isEmail, type FormState } from "./types";

/** Footer newsletter signup → notifies Emily of a new subscriber. */
export async function subscribeNewsletter(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (formData.get("company")) return { ok: true, message: "Subscribed!" };

  const email = String(formData.get("email") ?? "").trim();
  if (!isEmail(email))
    return { ok: false, message: "Please enter a valid email address." };

  try {
    await sendEmail({
      to: CONTACT_TO,
      subject: "New newsletter signup",
      html: `<p>New subscriber: <strong>${esc(email)}</strong></p>`,
    });
    return { ok: true, message: "You’re subscribed — thank you!" };
  } catch {
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}
