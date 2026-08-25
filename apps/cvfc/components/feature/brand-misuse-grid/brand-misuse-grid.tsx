import Image from "next/image";

import type { BrandMisuse } from "@/data/brand";
import { cn } from "@/lib/utils";

import "./brand-misuse-grid.css";

type BrandMisuseGridProps = {
  className?: string;
  items: BrandMisuse[];
};

/** Each panel shows the crest with the violation applied, struck through. */
export function BrandMisuseGrid({ className, items }: BrandMisuseGridProps) {
  if (items.length === 0) return null;

  return (
    <ul className={cn("brand-misuse-grid", className)}>
      {items.map((item) => (
        <li key={item.id} className="brand-misuse">
          <div className="brand-misuse-panel" data-variant={item.variant}>
            <Image
              src="/brand/cvfc-crest.svg"
              alt=""
              width={220}
              height={220}
              unoptimized
              className="brand-misuse-crest"
            />
            <span className="brand-misuse-slash" aria-hidden="true" />
          </div>
          <p className="brand-misuse-caption">{item.caption}</p>
        </li>
      ))}
    </ul>
  );
}
