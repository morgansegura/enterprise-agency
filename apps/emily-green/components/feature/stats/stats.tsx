import type { StatItem } from "@/data/mocks/landing-screen.mock";
import { cn } from "@/lib/utils";

import "./stats.css";

/** Visual skin: `plain` (light bg), `divider` (top rule per stat), `ghost`
 *  (large, low-contrast — for dark grounds like the hero). */
export type StatsVariant = "plain" | "divider" | "ghost";

type StatsProps = {
  items: StatItem[];
  variant?: StatsVariant;
  className?: string;
};

/** Reusable stat row — `value` + accent `suffix` + `label`. Used by the hero,
 *  image-text, and stats-image blocks. */
export function Stats({ items, variant = "plain", className }: StatsProps) {
  if (!items?.length) return null;

  return (
    <ul className={cn("stats", className)} data-variant={variant}>
      {items.map((stat) => (
        <li key={stat.label} className="stats-item">
          <span className="stats-value">
            {stat.value}
            {stat.suffix ? (
              <span className="stats-suffix">{stat.suffix}</span>
            ) : null}
          </span>
          <span className="stats-label">{stat.label}</span>
        </li>
      ))}
    </ul>
  );
}
