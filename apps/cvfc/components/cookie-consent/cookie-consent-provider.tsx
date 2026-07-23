"use client";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";
import dynamic from "next/dynamic";

import { useConsent } from "@/lib/cookie-consent";
import { CookieBanner } from "./cookie-banner";

// Lazy: the radix Dialog/Switch in the preferences modal only loads on "Customize"
// (or the footer trigger), keeping it out of the initial JS bundle.
const CookiePreferencesModal = dynamic(
  () =>
    import("./cookie-preferences-modal").then((m) => m.CookiePreferencesModal),
  { ssr: false },
);

// Hydration flag via useSyncExternalStore (no setState-in-effect): false on the
// server + first client paint, true once hydrated — so the banner never renders
// during the paint where the consent snapshot is still null.
const noopSubscribe = () => () => {};
function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

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
  // Gate the banner on hydration so it never renders during SSR / the first
  // paint (when the store snapshot is still null). Returning visitors who
  // already consented never see a flash; new visitors get a smooth entrance.
  const hydrated = useHydrated();
  const decided = consent !== null;

  const open = () => {
    setPrefsMounted(true);
    setPrefsOpen(true);
  };

  return (
    <CookieConsentContext.Provider value={{ openPreferences: open }}>
      {children}
      {hydrated && !decided ? <CookieBanner onCustomize={open} /> : null}
      {prefsMounted ? (
        <CookiePreferencesModal open={prefsOpen} onOpenChange={setPrefsOpen} />
      ) : null}
    </CookieConsentContext.Provider>
  );
}
