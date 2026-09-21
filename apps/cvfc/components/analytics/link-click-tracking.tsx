"use client";

import * as React from "react";

import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/site-config";

const digits = (value: string) => value.replace(/\D/g, "");
const CLUB_PHONE = digits(siteConfig.contact.phone);
const CLUB_EMAIL = siteConfig.contact.email.toLowerCase();

/**
 * Reports `phone_click` / `email_click` for every tel: and mailto: link on the
 * site — hand-coded, menu, and CMS rich text alike — from one delegated
 * listener. Links carrying `data-tracked` already report their own event
 * (`ContactButton`), so they're skipped to avoid a double count. The number or
 * address itself is never sent (GA forbids PII); `contact_target` says whether
 * it was the club line or an individual staff member.
 */
export function LinkClickTracking() {
  React.useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>(
        'a[href^="tel:"], a[href^="mailto:"]',
      );
      if (!link || link.hasAttribute("data-tracked")) return;

      const href = link.getAttribute("href") ?? "";
      const isPhone = href.startsWith("tel:");
      const value = decodeURIComponent(href.slice(isPhone ? 4 : 7));
      const isClub = isPhone
        ? digits(value).endsWith(CLUB_PHONE.slice(-10))
        : value.split("?")[0].toLowerCase() === CLUB_EMAIL;

      trackEvent(isPhone ? "phone_click" : "email_click", {
        contact_target: isClub ? "club" : "staff",
        page_path: window.location.pathname,
      });
    };

    // Capture phase, so a handler that stops propagation can't hide the click.
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
