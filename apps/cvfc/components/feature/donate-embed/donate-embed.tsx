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

  if (!donationsEnabled || !formUrl) return null;

  const frame = (
    <iframe
      src={formUrl}
      title="Donate to Chula Vista FC"
      className="donate-embed-frame"
      style={{ height: `${measuredHeight ?? FALLBACK_HEIGHT}px` }}
      allow="payment *"
    />
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
