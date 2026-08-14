"use client";

import Link from "next/link";

import { Button } from "@/components/ui";
import { trackEvent } from "@/lib/analytics";
import { DONATE_ANCHOR, type DonationTier } from "@/lib/donate";
import { cn } from "@/lib/utils";

import "./donation-tiers.css";

type DonationTiersProps = {
  tiers: DonationTier[];
  /** Which ladder this is — lands on the dataLayer event for reporting. */
  cadence: "monthly" | "one-time";
  className?: string;
};

/**
 * A donation ladder. Buttons scroll to the Zeffy embed rather than deep-linking
 * a preset amount — Zeffy's embed doesn't take an amount parameter, so the
 * donor picks in the form. Each click fires `donate_click`, which is a
 * meaningful on-domain conversion in its own right and works before the
 * donation form itself is live.
 */
export function DonationTiers({
  tiers,
  cadence,
  className,
}: DonationTiersProps) {
  return (
    <ul className={cn("donation-tiers", className)}>
      {tiers.map((tier) => (
        <li key={tier.label} className="donation-tiers-item">
          <article
            className="donation-tiers-card"
            data-custom={tier.custom ? "true" : "false"}
            data-cadence={cadence}
          >
            <p className="donation-tiers-amount">{tier.amount}</p>
            <h3 className="donation-tiers-label">{tier.label}</h3>
            <p className="donation-tiers-body">{tier.body}</p>
            <Button
              variant={cadence === "monthly" ? "default" : "outline"}
              className="donation-tiers-button"
              render={<Link href={`#${DONATE_ANCHOR}`} />}
              onClick={() =>
                trackEvent("donate_click", {
                  donate_cadence: cadence,
                  donate_tier: tier.label,
                  donate_amount: tier.amount,
                })
              }
            >
              <span>
                {tier.custom
                  ? "Choose an amount"
                  : cadence === "monthly"
                    ? `Give ${tier.amount}`
                    : `Give ${tier.amount}`}
              </span>
            </Button>
          </article>
        </li>
      ))}
    </ul>
  );
}
