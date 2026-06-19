"use client";

import { consentConfig } from "@/lib/consent-config";
import { cn } from "@/lib/utils";

import { useCookieConsentUI } from "./cookie-consent-provider";

import "./cookie-preferences-trigger.css";

export function CookiePreferencesTrigger({
  className,
}: {
  className?: string;
}) {
  const { openPreferences } = useCookieConsentUI();
  return (
    <button
      type="button"
      className={cn("cookie-prefs-trigger", className)}
      onClick={openPreferences}
    >
      {consentConfig.trigger.label}
    </button>
  );
}
