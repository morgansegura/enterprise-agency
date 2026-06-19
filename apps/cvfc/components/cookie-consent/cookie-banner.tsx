"use client";

import Link from "next/link";

import { Button } from "@wf/ui";

import { consentConfig } from "@/lib/consent-config";
import { DENY_ALL, GRANT_ALL, setConsent } from "@/lib/cookie-consent";

import "./cookie-banner.css";

export function CookieBanner({ onCustomize }: { onCustomize: () => void }) {
  const { banner, policyHref } = consentConfig;

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-label={banner.title}
      aria-live="polite"
    >
      <div className="cookie-banner-inner">
        <div className="cookie-banner-text">
          <p className="cookie-banner-title">{banner.title}</p>
          <p className="cookie-banner-body">
            {banner.body}{" "}
            <Link href={policyHref} className="cookie-banner-link">
              Cookie Policy
            </Link>
          </p>
        </div>
        <div className="cookie-banner-actions">
          <Button variant="ghost" onClick={onCustomize}>
            {banner.customize}
          </Button>
          <Button variant="outline" onClick={() => setConsent(DENY_ALL)}>
            {banner.rejectAll}
          </Button>
          <Button onClick={() => setConsent(GRANT_ALL)}>
            {banner.acceptAll}
          </Button>
        </div>
      </div>
    </div>
  );
}
