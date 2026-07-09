"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { Button } from "@wf/ui";

import { subscribeNewsletter } from "@/lib/actions/newsletter";
import { cn } from "@/lib/utils";

import "./newsletter-form.css";

/** Footer newsletter signup — email field + "Refer a Friend" submit. */
export function NewsletterForm({ className }: { className?: string }) {
  const [state, formAction, pending] = useActionState(
    subscribeNewsletter,
    null,
  );
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
    <form
      ref={formRef}
      action={formAction}
      className={cn("newsletter-form", className)}
    >
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="newsletter-form-hp"
      />
      <div className="newsletter-form-row">
        <input
          type="email"
          name="email"
          required
          placeholder="you@email.com"
          aria-label="Email address"
          className="newsletter-form-input"
        />
        <Button
          type="submit"
          disabled={pending}
          className="newsletter-form-submit"
        >
          {pending ? "Sending…" : "Refer a Friend"}
        </Button>
      </div>
    </form>
  );
}
