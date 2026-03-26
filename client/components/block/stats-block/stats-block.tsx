import type { StatItem, StatsBlockData } from "@/lib/blocks";
import "./stats-block.css";

type StatsBlockProps = {
  data: StatsBlockData;
};

/**
 * StatsBlock - Renders a collection of statistics with labels and optional trends
 * Content block (leaf node) - cannot have children
 */
export function StatsBlock({ data }: StatsBlockProps) {
  const {
    stats = [],
    layout = "horizontal",
    variant = "default",
  } = data;

  if (stats.length === 0) {
    return null;
  }

  return (
    <div
      data-slot="stats-block"
      data-layout={layout}
      data-variant={variant}
    >
      {stats.map((stat: StatItem, index: number) => (
        <div key={index} data-slot="stats-block-item">
          <div data-slot="stats-block-header">
            {stat.icon ? (
              <span data-slot="stats-block-icon" aria-hidden="true">
                {stat.icon}
              </span>
            ) : null}
            <div data-slot="stats-block-value">{stat.value}</div>
          </div>
          <div data-slot="stats-block-meta">
            <div data-slot="stats-block-label">{stat.label}</div>
            {stat.description ? (
              <div data-slot="stats-block-description">
                {stat.description}
              </div>
            ) : null}
            {stat.trend ? (
              <div
                data-slot="stats-block-trend"
                data-direction={stat.trend.direction}
                aria-label={`Trend ${stat.trend.direction} ${stat.trend.value}`}
              >
                <span aria-hidden="true">
                  {stat.trend.direction === "up" ? "\u2191" : "\u2193"}
                </span>
                {stat.trend.value}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
