"use client";

import * as React from "react";

import { Section } from "@/components/layout";
import { DONATE_ANCHOR, ZEFFY_FORM_URL, donationsEnabled } from "@/lib/donate";
import { cn } from "@/lib/utils";

import "./donate-embed.css";

// Zeffy's own embed script is what normally posts height back to the parent,
// and we deliberately don't load it — so this fallback is what most donors see.
// Sized to the amount-selection step, the tallest thing rendered before a
// donor commits.
const FALLBACK_HEIGHT = 620;
const MIN_HEIGHT = 420;
const MAX_HEIGHT = 1400;

function isZeffyOrigin(origin: string): boolean {
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname;
    return host === "zeffy.com" || host.endsWith(".zeffy.com");
  } catch {
    return false;
  }
}

/** Zeffy posts its content height in a few different shapes. */
function extractHeight(data: unknown): number | null {
  if (typeof data === "number") return data;
  if (typeof data === "string") {
    const m = data.match(/(\d{2,5})/);
    return m ? Number(m[1]) : null;
  }
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (typeof obj.height === "number") return obj.height;
    if (typeof obj.iframeHeight === "number") return obj.iframeHeight;
    const payload = obj.payload as Record<string, unknown> | undefined;
    if (payload && typeof payload.height === "number") return payload.height;
  }
  return null;
}

type DonateEmbedProps = {
  className?: string;
  formUrl?: string;
  /** Render just the iframe, no Section wrapper — for slotting into a hero. */
  bare?: boolean;
};

/**
 * The Zeffy donation form, inline on the page — the donor never leaves the
 * site. Renders nothing until `NEXT_PUBLIC_ZEFFY_FORM_URL` is set, so the
 * page ships dark until the club's form exists.
 */
export function DonateEmbed({
  className,
  formUrl = ZEFFY_FORM_URL,
  bare = false,
}: DonateEmbedProps) {
  const [measuredHeight, setMeasuredHeight] = React.useState<number | null>(
    null,
  );
  // The form pulls ~3.5MB of third-party JS (Zeffy, Stripe, hCaptcha, Google
  // Pay, reCAPTCHA). Mounting it with the page put that on the critical path
  // and took /support to a 19.5s LCP. Deferring to idle keeps the donor's
  // no-click path intact — the form still appears on its own, just after the
  // page has painted.
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!isZeffyOrigin(event.origin)) return;
      const height = extractHeight(event.data);
      if (height && height >= MIN_HEIGHT && height <= MAX_HEIGHT) {
        setMeasuredHeight(height);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  React.useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const schedule = () => {
      const ric = window.requestIdleCallback;
      if (ric) idleId = ric(() => setMounted(true), { timeout: 2500 });
      else timeoutId = window.setTimeout(() => setMounted(true), 800);
    };

    if (document.readyState === "complete") {
      schedule();
      return () => {
        if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
        if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      };
    }

    window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  if (!donationsEnabled || !formUrl) return null;

  const height = measuredHeight ?? FALLBACK_HEIGHT;

  // Reserve the frame's box either way so the deferred mount costs no CLS.
  const frame = mounted ? (
    <iframe
      src={formUrl}
      title="Donate to Chula Vista FC"
      className="donate-embed-frame"
      style={{ height: `${height}px` }}
      allow="payment *"
    />
  ) : (
    <div
      className="donate-embed-placeholder"
      style={{ height: `${height}px` }}
      role="status"
      aria-live="polite"
    >
      <span className="donate-embed-placeholder-label">
        Loading the donation form…
      </span>
    </div>
  );

  if (bare) {
    return (
      <div id={DONATE_ANCHOR} className={cn("donate-embed-bare", className)}>
        {frame}
      </div>
    );
  }

  return (
    <Section
      bg="bone"
      size="default"
      id={DONATE_ANCHOR}
      className={cn("donate-embed", className)}
    >
      {frame}
    </Section>
  );
}
