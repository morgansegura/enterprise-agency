import Image from "next/image";

import type { BrandAsset } from "@/data/brand";
import { cn } from "@/lib/utils";

import "./brand-asset-grid.css";

type BrandAssetGridProps = {
  className?: string;
  assets: BrandAsset[];
};

export function BrandAssetGrid({ className, assets }: BrandAssetGridProps) {
  if (assets.length === 0) return null;

  return (
    <ul className={cn("brand-asset-grid", className)}>
      {assets.map((asset) => (
        <li key={asset.id} className="brand-asset">
          <div className="brand-asset-panel" data-surface={asset.surface}>
            <Image
              src={asset.preview}
              alt={`${asset.name} — Chula Vista FC`}
              width={280}
              height={280}
              // Local, first-party SVGs: served as-is rather than through the
              // optimizer (which rejects SVG without dangerouslyAllowSVG).
              unoptimized={asset.preview.endsWith(".svg")}
              className="brand-asset-image"
            />
          </div>

          <div className="brand-asset-body">
            <h3 className="brand-asset-name">{asset.name}</h3>
            <p className="brand-asset-description">{asset.description}</p>

            <ul className="brand-asset-downloads">
              {asset.downloads.map((file) => (
                <li key={file.href}>
                  <a className="brand-asset-download" href={file.href} download>
                    {file.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}
