import type { StatsBlockData } from "@/lib/blocks";
import "./stats-block.css";

type StatsBlockProps = {
  data: StatsBlockData;
};

/**
 * StatsBlock - Renders statistics with labels and optional trends
 * Content block (leaf node) - cannot have children
 */
export function StatsBlock({ data }: StatsBlockProps) {
  const { value, label, description, icon, trend, variant = "default" } = data;

  return (
    <div data-slot="stats-block" data-variant={variant}>
      <div data-slot="stats-block-header">
        {icon ? (
          <span data-slot="stats-block-icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <div data-slot="stats-block-value">{value}</div>
      </div>
      <div data-slot="stats-block-meta">
        <div data-slot="stats-block-label">{label}</div>
        {description ? (
          <div data-slot="stats-block-description">{description}</div>
        ) : null}
        {trend ? (
          <div
            data-slot="stats-block-trend"
            data-direction={trend.direction}
            aria-label={`Trend ${trend.direction} ${trend.value}`}
          >
            <span aria-hidden="true">
              {trend.direction === "up" ? "�" : "�"}
            </span>
            {trend.value}
          </div>
        ) : null}
      </div>
    </div>
  );
}
