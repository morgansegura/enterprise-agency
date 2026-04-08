import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { getElementClass } from "@enterprise/tokens";

interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  cta: { text: string; href: string };
  highlighted?: boolean;
}

interface PricingBlockData {
  tiers: PricingTier[];
  heading?: string;
  description?: string;
  variant?: "default" | "bordered" | "elevated";
}

export default function PricingBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as PricingBlockData;
  const {
    tiers = [],
    heading,
    description,
    variant = "default",
  } = data;

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const hasStyle = (prop: string) => !!styles?.[prop];
  const elementClass = getElementClass(block._key);

  // Suppress unused-var lint — hasStyle is available for future style overrides
  void hasStyle;

  if (tiers.length === 0) return null;

  return (
    <div className={elementClass} data-slot="pricing-block" data-variant={variant}>
      {heading || description ? (
        <div data-slot="pricing-block-header">
          {heading || isEditing ? (
            <h2
              data-slot="pricing-block-heading"
              contentEditable={!!isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                const v = e.currentTarget.textContent || "";
                if (v !== heading && onChange)
                  onChange({
                    ...block,
                    data: { ...block.data, heading: v },
                  });
              }}
              style={
                isEditing
                  ? { cursor: "text", outline: "none" }
                  : undefined
              }
            >
              {heading || "Pricing"}
            </h2>
          ) : null}

          {description || isEditing ? (
            <p
              data-slot="pricing-block-description"
              contentEditable={!!isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                const v = e.currentTarget.textContent || "";
                if (v !== description && onChange)
                  onChange({
                    ...block,
                    data: { ...block.data, description: v },
                  });
              }}
              style={
                isEditing
                  ? { cursor: "text", outline: "none" }
                  : undefined
              }
            >
              {description || "Choose the plan that works for you"}
            </p>
          ) : null}
        </div>
      ) : null}

      <div
        data-slot="pricing-block-grid"
        data-count={tiers.length}
      >
        {tiers.map((tier, i) => (
          <div
            key={i}
            data-slot="pricing-block-tier"
            data-highlighted={tier.highlighted ? "true" : undefined}
          >
            <div data-slot="pricing-block-tier-header">
              <div
                data-slot="pricing-block-tier-name"
                contentEditable={!!isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const v = e.currentTarget.textContent || "";
                  if (v !== tier.name && onChange) {
                    const updated = [...tiers];
                    updated[i] = { ...tier, name: v };
                    onChange({
                      ...block,
                      data: { ...block.data, tiers: updated },
                    });
                  }
                }}
                style={
                  isEditing
                    ? { cursor: "text", outline: "none" }
                    : undefined
                }
              >
                {tier.name}
              </div>

              <div data-slot="pricing-block-tier-price">
                <span
                  contentEditable={!!isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const v = e.currentTarget.textContent || "";
                    if (v !== tier.price && onChange) {
                      const updated = [...tiers];
                      updated[i] = { ...tier, price: v };
                      onChange({
                        ...block,
                        data: { ...block.data, tiers: updated },
                      });
                    }
                  }}
                  style={
                    isEditing
                      ? { cursor: "text", outline: "none" }
                      : undefined
                  }
                >
                  {tier.price}
                </span>
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
              {tier.features.map((f, fi) => (
                <li key={fi} data-slot="pricing-block-feature">
                  <span
                    data-slot="pricing-block-feature-check"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <span
              data-slot="pricing-block-cta"
              data-highlighted={
                tier.highlighted ? "true" : undefined
              }
            >
              {tier.cta?.text || "Choose Plan"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
