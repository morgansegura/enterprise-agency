/** Result of a form server action, consumed via `useActionState`. */
export type FormState = { ok: boolean; message: string } | null;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export const isEmail = (value: string) => EMAIL_RE.test(value);

/** Where inquiries/subscriptions are emailed. */
export const CONTACT_TO = process.env.CONTACT_TO ?? "hello@emilygreen.example";
