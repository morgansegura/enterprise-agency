import type { PricingTier, PricingBlockData } from "@/lib/blocks";
import "./pricing-block.css";

type PricingBlockProps = {
  data: PricingBlockData;
};

/**
 * PricingBlock - Renders a pricing table with tier comparison
 * Content block (leaf node) - cannot have children
 */
export function PricingBlock({ data }: PricingBlockProps) {
  const {
    tiers = [],
    heading,
    description,
    variant = "default",
  } = data;

  if (tiers.length === 0) {
    return null;
  }

  return (
    <div data-slot="pricing-block" data-variant={variant}>
      {heading || description ? (
        <div data-slot="pricing-block-header">
          {heading ? (
            <h2 data-slot="pricing-block-heading">{heading}</h2>
          ) : null}
          {description ? (
            <p data-slot="pricing-block-description">{description}</p>
          ) : null}
        </div>
      ) : null}
      <div
        data-slot="pricing-block-grid"
        data-count={tiers.length}
      >
        {tiers.map((tier: PricingTier, index: number) => (
          <div
            key={index}
            data-slot="pricing-block-tier"
            data-highlighted={tier.highlighted ? "true" : undefined}
          >
            <div data-slot="pricing-block-tier-header">
              <div data-slot="pricing-block-tier-name">
                {tier.name}
              </div>
              <div data-slot="pricing-block-tier-price">
                {tier.price}
                {tier.period ? (
                  <span data-slot="pricing-block-tier-period">
                    /{tier.period}
                  </span>
                ) : null}
              </div>
              {tier.description ? (
                <div data-slot="pricing-block-tier-description">
                  {tier.description}
                </div>
              ) : null}
            </div>
            <ul data-slot="pricing-block-features">
              {tier.features.map((feature: string, featureIndex: number) => (
                <li key={featureIndex} data-slot="pricing-block-feature">
                  <span
                    data-slot="pricing-block-feature-check"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <a
              data-slot="pricing-block-cta"
              href={tier.cta.href}
              data-highlighted={tier.highlighted ? "true" : undefined}
            >
              {tier.cta.text}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
