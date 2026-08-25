import type { BrandFont } from "@/data/brand";
import { cn } from "@/lib/utils";

import "./brand-type-specimen.css";

type BrandTypeSpecimenProps = {
  className?: string;
  fonts: BrandFont[];
};

export function BrandTypeSpecimen({
  className,
  fonts,
}: BrandTypeSpecimenProps) {
  if (fonts.length === 0) return null;

  return (
    <ul className={cn("brand-type-specimen", className)}>
      {fonts.map((font) => (
        <li key={font.id} className="brand-type">
          <div className="brand-type-panel" data-family={font.family}>
            <p className="brand-type-letters">Aa</p>
            <p className="brand-type-sample">{font.sample}</p>
          </div>

          <div className="brand-type-body">
            <h3 className="brand-type-name">{font.name}</h3>
            <p className="brand-type-role">{font.role}</p>
            <p className="brand-type-meta">
              {font.weights} · {font.token}
            </p>
            <a
              className="brand-type-link"
              href={font.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get it on Google Fonts
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
