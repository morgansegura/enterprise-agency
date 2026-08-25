import { Icon } from "@/components/icon";
import type { BrandRule } from "@/data/brand";
import { cn } from "@/lib/utils";

import "./brand-rules.css";

type BrandRulesProps = {
  className?: string;
  doTitle?: string;
  dontTitle?: string;
  /** Rules to follow. */
  allowed: BrandRule[];
  /** Rules that break the brand. */
  forbidden: BrandRule[];
};

export function BrandRules({
  className,
  doTitle = "Do",
  dontTitle = "Don't",
  allowed,
  forbidden,
}: BrandRulesProps) {
  return (
    <div className={cn("brand-rules", className)}>
      <section className="brand-rules-column" data-kind="do">
        <h3 className="brand-rules-title">{doTitle}</h3>
        <ul className="brand-rules-list">
          {allowed.map((rule) => (
            <li key={rule.id} className="brand-rules-item">
              <Icon token="ri:check" aria-hidden="true" />
              <span>{rule.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="brand-rules-column" data-kind="dont">
        <h3 className="brand-rules-title">{dontTitle}</h3>
        <ul className="brand-rules-list">
          {forbidden.map((rule) => (
            <li key={rule.id} className="brand-rules-item">
              <Icon token="ri:xmark" aria-hidden="true" />
              <span>{rule.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
