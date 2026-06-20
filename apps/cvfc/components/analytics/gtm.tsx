"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __gtmLoaded?: boolean;
  }
}

/**
 * Google Tag Manager — loaded only when `NEXT_PUBLIC_GTM_ID` is set, and
 * **deferred off the critical path**: it injects on the first user interaction
 * or after a short idle, so GTM/GA's ~hundreds of KB of JS don't block initial
 * render / LCP. Consent Mode defaults (set inline in <head>) are already in
 * place, so no analytics fire before consent regardless of when GTM loads.
 */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export function GoogleTagManager() {
  useEffect(() => {
    if (!GTM_ID || window.__gtmLoaded) return;

    const load = () => {
      if (window.__gtmLoaded) return;
      window.__gtmLoaded = true;
      const w = window;
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
      document.head.appendChild(s);
      cleanup();
    };

    const events = ["scroll", "mousemove", "touchstart", "keydown", "click"];
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, load));
    };
    events.forEach((e) =>
      window.addEventListener(e, load, { once: true, passive: true }),
    );
    // Fallback so analytics still fire for no-interaction sessions.
    const idle = window.setTimeout(load, 4000);

    return () => {
      window.clearTimeout(idle);
      cleanup();
    };
  }, []);

  return null;
}

/** GTM <noscript> fallback — render right after <body> opens. */
export function GoogleTagManagerNoscript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
