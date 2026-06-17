import Link from "next/link";

import { Button } from "@/components/ui";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

import "./callout.css";
import { LogoIcon } from "@/components/layout";

type CalloutCta = {
  label: string;
  href: string;
  variant?: "default" | "secondary" | "outline";
  iconToken?: string;
};

type CalloutProps = {
  className?: string;
  eyebrow?: string;
  heading: string;
  body: React.ReactNode;
  cta?: CalloutCta;
  ctaSlot?: React.ReactNode;
  variant?: "midnight" | "bone" | "gold" | "midnight-bright";
  /** Show the decorative LogoIcon (default true). */
  showIcon?: boolean;
  /** Anchor id for in-page navigation. */
  id?: string;
};

export function Callout({
  className,
  eyebrow,
  heading = "Did you know?",
  body = (
    <>
      Even if our tryouts have ended, players can still be evaluated on an
      individual basis. Chula Vista FC offers{" "}
      <strong>individual evaluations</strong> for players who are new to the
      area or missed official tryout dates. Our comprehensive evaluation system
      is tailored to each player&rsquo;s level, style, and needs, with the goal
      of helping every athlete reach their full potential both on and off the
      field.
    </>
  ),
  cta,
  ctaSlot,
  variant = "midnight",
  showIcon = true,
  id,
}: Partial<CalloutProps> & Pick<CalloutProps, never>) {
  return (
    <section
      id={id}
      className={cn("callout", className)}
      data-variant={variant}
    >
      <div className="callout-inner contain">
        {showIcon ? (
          <div className="callout-inner-icon">
            <LogoIcon />
          </div>
        ) : null}
        <div className="callout-content">
          {eyebrow ? (
            <p className="callout-eyebrow">
              <span className="eyebrow-rule" aria-hidden="true" />
              {eyebrow}
            </p>
          ) : null}
          <h2 className="callout-heading">{heading}</h2>
          <div className="callout-body">{body}</div>
          {ctaSlot ? (
            <div className="callout-cta-row">{ctaSlot}</div>
          ) : cta ? (
            <div className="callout-cta-row">
              <Button
                variant={cta.variant ?? "outline"}
                render={<Link href={cta.href} />}
              >
                {cta.iconToken ? (
                  <Icon token={cta.iconToken as never} aria-hidden="true" />
                ) : null}
                <span>{cta.label}</span>
                <Icon token="ri:arrow-right" aria-hidden="true" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
