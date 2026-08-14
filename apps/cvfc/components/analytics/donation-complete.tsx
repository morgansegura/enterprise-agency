"use client";

import * as React from "react";

type FrameWithDataLayer = Window & { dataLayer?: unknown[] };

/**
 * Fires `donation_complete` once, into whichever dataLayer GTM is watching.
 *
 * Zeffy renders its post-donation redirect inside its own embed iframe, so the
 * parent frame — where GTM lives — never sees the donation finish. This page is
 * same-origin with that parent, so it can push straight into
 * `window.parent.dataLayer`. Loaded top-level instead (direct visit, or a
 * whole-window redirect), it pushes locally.
 */
export function DonationComplete() {
  const fired = React.useRef(false);

  React.useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const params = new URLSearchParams(window.location.search);
    const first = (...keys: string[]) => {
      for (const key of keys) {
        const value = params.get(key);
        if (value) return value;
      }
      return undefined;
    };

    const rawValue = first("value", "amount", "total");
    const numericValue = rawValue ? Number(rawValue) : undefined;
    const transactionId = first("transaction_id", "transactionId", "id");

    const embedded = window.self !== window.top;

    // The page is publicly reachable, so a direct visit must not count as a
    // donation — a fake conversion would teach Smart Bidding to chase page
    // loads. Only two things look like a real completion: Zeffy rendering the
    // redirect inside its embed iframe, or a top-level redirect carrying
    // donation params. Someone typing the URL has neither.
    if (!embedded && !transactionId && numericValue === undefined) return;

    const payload: Record<string, unknown> = {
      event: "donation_complete",
      currency: first("currency") ?? "USD",
      page_path: window.location.pathname,
    };
    if (numericValue !== undefined && Number.isFinite(numericValue)) {
      payload.value = numericValue;
    }
    if (transactionId) payload.transaction_id = transactionId;
    const frequency = first("frequency", "recurrence");
    if (frequency) payload.donation_frequency = frequency;

    // Guard against a reload or back-navigation re-firing the conversion.
    // Only possible when Zeffy hands us an id to key on.
    if (transactionId) {
      const key = `cvfc-donation-${transactionId}`;
      try {
        if (window.sessionStorage.getItem(key)) return;
        window.sessionStorage.setItem(key, "1");
      } catch {
        // storage blocked — fall through and fire
      }
    }

    let target: FrameWithDataLayer = window;

    if (embedded) {
      try {
        // Throws if the parent is cross-origin, which means this page is framed
        // by something other than our own site. Fall back to local.
        void window.parent.location.origin;
        target = window.parent;
      } catch {
        target = window;
      }
    }

    target.dataLayer = target.dataLayer ?? [];
    target.dataLayer.push(payload);

    if (target !== window) {
      window.parent.postMessage(
        { source: "chula-vista-fc", type: "donation_complete" },
        window.location.origin,
      );
    }
  }, []);

  return null;
}
