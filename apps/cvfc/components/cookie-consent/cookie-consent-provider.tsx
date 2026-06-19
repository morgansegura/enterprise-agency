"use client";

import { createContext, useContext, useState } from "react";

import { useConsent } from "@/lib/cookie-consent";
import { CookieBanner } from "./cookie-banner";
import { CookiePreferencesModal } from "./cookie-preferences-modal";

type CookieConsentContextValue = { openPreferences: () => void };

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null,
);

/** Re-open the preferences modal from anywhere (e.g. the footer trigger). */
export function useCookieConsentUI(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error(
      "useCookieConsentUI must be used within <CookieConsentProvider>",
    );
  }
  return ctx;
}

export function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const consent = useConsent();
  const [prefsOpen, setPrefsOpen] = useState(false);
  const decided = consent !== null;

  return (
    <CookieConsentContext.Provider
      value={{ openPreferences: () => setPrefsOpen(true) }}
    >
      {children}
      {!decided ? (
        <CookieBanner onCustomize={() => setPrefsOpen(true)} />
      ) : null}
      <CookiePreferencesModal open={prefsOpen} onOpenChange={setPrefsOpen} />
    </CookieConsentContext.Provider>
  );
}
