"use client";

import { useSyncExternalStore } from "react";

import { consentConfig } from "@/lib/consent-config";

/**
 * Cookie-consent state — versioned localStorage + Google Consent Mode v2 wiring.
 * Read via `useConsent()` (an external store, so no setState-in-effect / no
 * hydration mismatch). Writing pushes a `gtag('consent','update', …)`.
 */

export type ConsentChoices = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export type ConsentState = {
  version: number;
  timestamp: number;
  choices: ConsentChoices;
} | null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const VERSION = 1;
const KEY = `${consentConfig.storagePrefix}-cookie-consent-v${VERSION}`;

export const GRANT_ALL: ConsentChoices = {
  necessary: true,
  analytics: true,
  marketing: true,
};
export const DENY_ALL: ConsentChoices = {
  necessary: true,
  analytics: false,
  marketing: false,
};

// --- external store -------------------------------------------------------

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedState: ConsentState = null;

function parse(raw: string | null): ConsentState {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as ConsentState;
    if (!data || data.version !== VERSION) return null;
    return data;
  } catch {
    return null;
  }
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): ConsentState {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (raw === cachedRaw) return cachedState; // stable ref while unchanged
  cachedRaw = raw;
  cachedState = parse(raw);
  return cachedState;
}

function getServerSnapshot(): ConsentState {
  return null;
}

function emit() {
  for (const cb of listeners) cb();
}

// --- public API -----------------------------------------------------------

/** Current consent state (null = no decision yet → show the banner). */
export function useConsent(): ConsentState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Persist a decision and push it to Google Consent Mode. */
export function setConsent(choices: ConsentChoices): void {
  if (typeof window === "undefined") return;
  const state: ConsentState = {
    version: VERSION,
    timestamp: Date.now(),
    choices,
  };
  window.localStorage.setItem(KEY, JSON.stringify(state));
  pushConsentUpdate(choices);
  emit();
}

/** Map choices → Consent Mode v2 signals and push the update. */
export function pushConsentUpdate(choices: ConsentChoices): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function")
    return;
  window.gtag("consent", "update", {
    analytics_storage: choices.analytics ? "granted" : "denied",
    ad_storage: choices.marketing ? "granted" : "denied",
    ad_user_data: choices.marketing ? "granted" : "denied",
    ad_personalization: choices.marketing ? "granted" : "denied",
  });
}
