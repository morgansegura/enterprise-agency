import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

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

export default function PricingBlockRenderer({ block, onChange, isEditing }: BlockRendererProps) {
  const data = block.data as unknown as PricingBlockData;
  const { tiers = [], heading, description, variant = "default" } = data;

  if (tiers.length === 0) return null;

  return (
    <div className="w-full">
      {(heading || description) && (
        <div className="text-center mb-8">
          {(heading || isEditing) && (
            <h3
              className="text-xl font-bold"
              contentEditable={!!isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                const v = e.currentTarget.textContent || "";
                if (v !== heading && onChange) onChange({ ...block, data: { ...block.data, heading: v } });
              }}
              style={isEditing ? { cursor: "text", outline: "none" } : undefined}
            >
              {heading || "Pricing"}
            </h3>
          )}
          {(description || isEditing) && (
            <p
              className="text-sm text-[var(--el-500)] mt-1"
              contentEditable={!!isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                const v = e.currentTarget.textContent || "";
                if (v !== description && onChange) onChange({ ...block, data: { ...block.data, description: v } });
              }}
              style={isEditing ? { cursor: "text", outline: "none" } : undefined}
            >
              {description || "Choose the plan that works for you"}
            </p>
          )}
        </div>
      )}
      <div
        className={cn(
          "grid gap-6",
          tiers.length === 1 && "grid-cols-1 max-w-sm mx-auto",
          tiers.length === 2 && "grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto",
          tiers.length >= 3 && "grid-cols-1 md:grid-cols-3",
        )}
      >
        {tiers.map((tier, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col p-6 rounded-lg",
              variant === "elevated" && "shadow-md",
              tier.highlighted
                ? "border-2 border-primary ring-1 ring-primary/20"
                : "border border-border",
            )}
          >
            <h4
              className="text-base font-semibold"
              contentEditable={!!isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                const v = e.currentTarget.textContent || "";
                if (v !== tier.name && onChange) {
                  const updated = [...tiers];
                  updated[i] = { ...tier, name: v };
                  onChange({ ...block, data: { ...block.data, tiers: updated } });
                }
              }}
              style={isEditing ? { cursor: "text", outline: "none" } : undefined}
            >
              {tier.name}
            </h4>
            <div className="mt-2 flex items-baseline gap-1">
              <span
                className="text-3xl font-bold"
                contentEditable={!!isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const v = e.currentTarget.textContent || "";
                  if (v !== tier.price && onChange) {
                    const updated = [...tiers];
                    updated[i] = { ...tier, price: v };
                    onChange({ ...block, data: { ...block.data, tiers: updated } });
                  }
                }}
                style={isEditing ? { cursor: "text", outline: "none" } : undefined}
              >
                {tier.price}
              </span>
              {tier.period && (
                <span className="text-sm text-[var(--el-500)]">
                  {tier.period}
                </span>
              )}
            </div>
            {tier.description && (
              <p className="text-xs text-[var(--el-500)] mt-2">
                {tier.description}
              </p>
            )}
            <ul className="mt-4 flex-1 space-y-2">
              {tier.features.map((f, fi) => (
                <li
                  key={fi}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="text-[var(--accent-primary)] mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <span
                className={cn(
                  "inline-flex w-full justify-center items-center px-4 py-2 rounded-md text-sm font-medium",
                  tier.highlighted
                    ? "bg-[var(--accent-primary)] text-[var(--accent-primary-foreground)]"
                    : "bg-[var(--el-100)] text-[var(--el-800)]",
                )}
              >
                {tier.cta?.text || "Choose Plan"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
