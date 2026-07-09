"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import { submitContact } from "@/lib/actions/contact";

import "./contact-form.css";

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
};

function Field({ id, label, type = "text", required }: FieldProps) {
  return (
    <div className="contact-field">
      <label htmlFor={id} className="contact-field-label">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        className="contact-field-input"
      />
    </div>
  );
}

/** Contact form — posts to the `submitContact` server action (Resend email). */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, null);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success(state.message);
      formRef.current?.reset();
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="contact-form">
      {/* Honeypot — hidden from users, catches bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="contact-form-hp"
      />

      <fieldset className="contact-form-name">
        <legend className="contact-field-label contact-form-legend">
          Name (required)
        </legend>
        <div className="contact-form-row">
          <Field id="firstName" label="First Name" required />
          <Field id="lastName" label="Last Name" />
        </div>
      </fieldset>

      <Field id="phone" label="Phone" type="tel" />
      <Field id="email" label="Email (required)" type="email" required />

      <label className="contact-form-check">
        <input
          type="checkbox"
          name="newsletter"
          className="contact-form-checkbox"
        />
        <span>Sign up for news and updates</span>
      </label>

      <Field id="message" label="Describe your interests and needs" />

      <Button type="submit" disabled={pending} className="contact-form-submit">
        {pending ? "Sending…" : "Submit"}
      </Button>
    </form>
  );
}
