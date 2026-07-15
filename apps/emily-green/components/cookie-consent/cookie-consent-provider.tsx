"use client";

import { createContext, useContext, useState } from "react";
import dynamic from "next/dynamic";

import { useConsent } from "@/lib/cookie-consent";
import { CookieBanner } from "./cookie-banner";

// Lazy: the Modal/Switch in the preferences modal only loads on "Customize"
// (or the footer trigger), keeping it out of the initial JS bundle.
const CookiePreferencesModal = dynamic(
  () =>
    import("./cookie-preferences-modal").then((m) => m.CookiePreferencesModal),
  { ssr: false },
);

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
  // Mount the (lazy) modal only after it's first requested.
  const [prefsMounted, setPrefsMounted] = useState(false);
  const decided = consent !== null;

  const open = () => {
    setPrefsMounted(true);
    setPrefsOpen(true);
  };

  return (
    <CookieConsentContext.Provider value={{ openPreferences: open }}>
      {children}
      {!decided ? <CookieBanner onCustomize={open} /> : null}
      {prefsMounted ? (
        <CookiePreferencesModal open={prefsOpen} onOpenChange={setPrefsOpen} />
      ) : null}
    </CookieConsentContext.Provider>
  );
}
