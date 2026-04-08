import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { getElementClass } from "@enterprise/tokens";

interface StatItem {
  label: string;
  value: string;
  description?: string;
  icon?: string;
  trend?: { direction: "up" | "down"; value: string };
}

interface StatsBlockData {
  stats: StatItem[];
  layout?: "horizontal" | "vertical" | "grid";
  variant?: "default" | "bordered" | "cards";
}

export default function StatsBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as StatsBlockData;
  const {
    stats = [],
    layout = "horizontal",
    variant = "default",
  } = data;

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const hasStyle = (prop: string) => !!styles?.[prop];
  const elementClass = getElementClass(block._key);

  // Suppress unused-var lint — hasStyle is available for future style overrides
  void hasStyle;

  return (
    <div
      className={elementClass}
      data-slot="stats-block"
      data-layout={layout}
      data-variant={variant}
    >
      {stats.map((stat, index) => (
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
