"use client";

import * as React from "react";

import { Section } from "@/components/layout";
import { trackEvent } from "@/lib/analytics";
import {
  DONATE_ANCHOR,
  ZEFFY_FORM_URL,
  ZEFFY_MONTHLY_FORM_URL,
  donationsEnabled,
  type DonateCadence,
} from "@/lib/donate";
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
  monthlyFormUrl?: string;
  /** Render just the iframe, no Section wrapper — for slotting into a hero. */
  bare?: boolean;
};

// Monthly leads: recurring donors give far more over a year than one-time ones.
const CHOICES: { cadence: DonateCadence; label: string; reason: string }[] = [
  {
    cadence: "monthly",
    label: "Give monthly",
    reason: "Keep a player on the field all season long.",
  },
  {
    cadence: "one-time",
    label: "Give once",
    reason: "Cover gear, match fees, or field time today.",
  },
];

/**
 * The Zeffy donation form, inline on the page — the donor never leaves the
 * site. Renders nothing until `NEXT_PUBLIC_ZEFFY_FORM_URL` is set, so the
 * page ships dark until the club's form exists.
 */
export function DonateEmbed({
  className,
  formUrl = ZEFFY_FORM_URL,
  monthlyFormUrl = ZEFFY_MONTHLY_FORM_URL,
  bare = false,
}: DonateEmbedProps) {
  const [measuredHeight, setMeasuredHeight] = React.useState<number | null>(
    null,
  );
  // The form pulls ~3.5MB of third-party JS (Zeffy, Stripe, hCaptcha, Google
  // Pay, reCAPTCHA). Mounting it with the page cost /support a 19.5s LCP and
  // 3.6s of blocking time; deferring to idle fixed the LCP but left the
  // blocking, because idle still runs inside page load. So it now waits for
  // donor intent — a click here, or the #make-a-donation hash that the tier
  // buttons and the header/footer nav link to (that path stays one click).
  const [cadence, setCadence] = React.useState<DonateCadence | null>(null);

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

  // A tier button, or any /support#make-a-donation link, means the donor has
  // already chosen to give — open the form for them rather than making them
  // click twice. Covers deep links too, where the hash is set on arrival.
  React.useEffect(() => {
    const openOnAnchor = () => {
      if (window.location.hash === `#${DONATE_ANCHOR}`) {
        const monthly =
          new URLSearchParams(window.location.search).get("cadence") ===
          "monthly";
        setCadence((current) => current ?? (monthly ? "monthly" : "one-time"));
      }
    };
    openOnAnchor();
    window.addEventListener("hashchange", openOnAnchor);
    return () => window.removeEventListener("hashchange", openOnAnchor);
  }, []);

  if (!donationsEnabled || !formUrl) return null;

  const choose = (next: DonateCadence) => {
    trackEvent("donate_click", {
      donate_cadence: next,
      donate_source: "support_hero",
    });
    setCadence(next);
  };

  const frame = cadence ? (
    <iframe
      src={cadence === "monthly" ? monthlyFormUrl || formUrl : formUrl}
      title="Donate to Chula Vista FC"
      className="donate-embed-frame"
      style={{ height: `${measuredHeight ?? FALLBACK_HEIGHT}px` }}
      allow="payment *"
    />
  ) : (
    <div className="donate-embed-prompt">
      <div className="donate-embed-choices">
        {CHOICES.map((choice) => (
          <button
            key={choice.cadence}
            type="button"
            className="donate-embed-choice"
            data-cadence={choice.cadence}
            onClick={() => choose(choice.cadence)}
          >
            <span className="donate-embed-choice-label">{choice.label}</span>
            <span className="donate-embed-choice-reason">{choice.reason}</span>
          </button>
        ))}
      </div>
      <p className="donate-embed-prompt-note">
        The secure donation form opens right here — you won&rsquo;t leave the
        page.
      </p>
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
