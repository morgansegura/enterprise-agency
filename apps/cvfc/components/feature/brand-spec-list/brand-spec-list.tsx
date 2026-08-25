import type { BrandSpec } from "@/data/brand";
import { cn } from "@/lib/utils";

import "./brand-spec-list.css";

type BrandSpecListProps = {
  className?: string;
  specs: BrandSpec[];
};

export function BrandSpecList({ className, specs }: BrandSpecListProps) {
  if (specs.length === 0) return null;

  return (
    <dl className={cn("brand-spec-list", className)}>
      {specs.map((spec) => (
        <div key={spec.id} className="brand-spec">
          <dt className="brand-spec-label">{spec.label}</dt>
          <dd className="brand-spec-body">
            <p className="brand-spec-value">{spec.value}</p>
            {spec.note ? <p className="brand-spec-note">{spec.note}</p> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
