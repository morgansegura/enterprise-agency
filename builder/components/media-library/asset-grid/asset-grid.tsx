"use client";

import * as React from "react";
import type { Asset } from "@/lib/hooks/use-assets";
import { AssetCard } from "../asset-card";
import "./asset-grid.css";

export type GridDensity = "compact" | "comfortable" | "spacious";

interface AssetGridProps {
  assets: Asset[];
  activeId?: string | null;
  density?: GridDensity;
  isSelected: (id: string) => boolean;
  onSelect: (id: string, event: React.MouseEvent) => void;
  onActivate: (asset: Asset) => void;
  onContextMenu?: (asset: Asset, event: React.MouseEvent) => void;
}

export function AssetGrid({
  assets,
  activeId,
  density = "comfortable",
  isSelected,
  onSelect,
  onActivate,
  onContextMenu,
}: AssetGridProps) {
  return (
    <div data-slot="asset-grid" data-density={density}>
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          selected={isSelected(asset.id)}
          active={activeId === asset.id}
          density={density}
          onSelect={(e) => onSelect(asset.id, e)}
          onActivate={() => onActivate(asset)}
          onContextMenu={(e) => {
            e.preventDefault();
            onContextMenu?.(asset, e);
          }}
        />
      ))}
    </div>
  );
}
