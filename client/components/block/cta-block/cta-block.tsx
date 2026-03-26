import type { CtaBlockData } from "@/lib/blocks";
import Link from "next/link";
import "./cta-block.css";

type CtaBlockProps = {
  data: CtaBlockData;
};

/**
 * CtaBlock - Renders a call-to-action banner with heading,
 * description, and CTA buttons.
 * Content block (leaf node) - cannot have children
 */
export function CtaBlock({ data }: CtaBlockProps) {
  const {
    heading,
    description,
    primaryCta,
    secondaryCta,
    variant = "default",
    align = "center",
  } = data;

  return (
    <section
      data-slot="cta-block"
      data-variant={variant}
      data-align={align}
    >
      <div data-slot="cta-block-content">
        <h2 data-slot="cta-block-heading">{heading}</h2>

        {description ? (
          <p data-slot="cta-block-description">{description}</p>
        ) : null}
      </div>

      <div data-slot="cta-block-actions">
        <Link
          href={primaryCta.href}
          data-slot="cta-block-primary-cta"
        >
          {primaryCta.text}
        </Link>

        {secondaryCta ? (
          <Link
            href={secondaryCta.href}
            data-slot="cta-block-secondary-cta"
          >
            {secondaryCta.text}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
