"use client";

import type * as React from "react";

import { Button } from "@/components/ui";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/site-config";

type ContactButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "render"
> & {
  /** Inquiry type, reported as `contact_topic`. */
  topic: string;
  /** Optional qualifier (e.g. a sponsorship tier), reported as `contact_detail`. */
  detail?: string;
  /** Mailto subject line, pre-filled so the inquiry arrives pre-routed. */
  subject: string;
};

/**
 * Mailto CTA that reports a `contact_click` before handing off to the mail
 * client. Screens using it stay server components.
 */
export function ContactButton({
  topic,
  detail,
  subject,
  children,
  ...props
}: ContactButtonProps) {
  const href = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(subject)}`;

  return (
    <Button
      {...props}
      render={<a href={href} />}
      onClick={() =>
        trackEvent("contact_click", {
          contact_topic: topic,
          ...(detail ? { contact_detail: detail } : {}),
        })
      }
    >
      {children}
    </Button>
  );
}
