import type { BrandColor } from "@/data/brand";
import { cn } from "@/lib/utils";

import "./brand-swatches.css";

type BrandSwatchesProps = {
  className?: string;
  colors: BrandColor[];
};

export function BrandSwatches({ className, colors }: BrandSwatchesProps) {
  if (colors.length === 0) return null;

  return (
    <ul className={cn("brand-swatches", className)}>
      {colors.map((color) => (
        <li key={color.id} className="brand-swatch">
          <div
            className="brand-swatch-panel"
            // The one place a literal color belongs: the swatch has to paint the
            // exact value it documents, including the crest-only sky blue.
            style={{ backgroundColor: color.hex }}
          />

          <div className="brand-swatch-body">
            <h3 className="brand-swatch-name">{color.name}</h3>
            <p className="brand-swatch-values">
              {color.hex} · rgb({color.rgb})
              {color.token === "—" ? null : ` · ${color.token}`}
            </p>
            <p className="brand-swatch-role">{color.role}</p>
            {color.contrast ? (
              <p className="brand-swatch-contrast">{color.contrast}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
