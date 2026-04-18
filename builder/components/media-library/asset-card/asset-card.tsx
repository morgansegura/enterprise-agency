"use client";

import * as React from "react";
import { Check } from "lucide-react";
import type { Asset } from "@/lib/hooks/use-assets";
import { AssetThumbnail } from "../asset-thumbnail";
import { formatBytes, formatDuration, isVideo } from "../utils";
import "./asset-card.css";

interface AssetCardProps {
  asset: Asset;
  selected?: boolean;
  active?: boolean;
  density?: "compact" | "comfortable" | "spacious";
  onSelect?: (event: React.MouseEvent) => void;
  onActivate?: () => void;
  onContextMenu?: (event: React.MouseEvent) => void;
}

export function AssetCard({
  asset,
  selected = false,
  active = false,
  density = "comfortable",
  onSelect,
  onActivate,
  onContextMenu,
}: AssetCardProps) {
  return (
    <button
      type="button"
      data-slot="asset-card"
      data-selected={selected ? "true" : "false"}
      data-active={active ? "true" : "false"}
      data-density={density}
      data-status={asset.status || "ready"}
      onClick={(e) => {
        if (e.shiftKey || e.metaKey || e.ctrlKey) {
          onSelect?.(e);
        } else {
          onActivate?.();
        }
      }}
      onDoubleClick={onActivate}
      onContextMenu={onContextMenu}
      aria-label={asset.altText || asset.fileName}
    >
      <span data-slot="asset-card-preview">
        <AssetThumbnail asset={asset} />
        {isVideo(asset) && asset.duration ? (
          <span data-slot="asset-card-duration">
            {formatDuration(asset.duration)}
          </span>
        ) : null}
        {selected ? (
          <span data-slot="asset-card-check">
            <Check aria-hidden="true" />
          </span>
        ) : null}
      </span>
      <span data-slot="asset-card-meta">
        <span data-slot="asset-card-name" title={asset.fileName}>
          {asset.title || asset.fileName}
        </span>
        <span data-slot="asset-card-sub">
          {asset.width && asset.height
            ? `${asset.width}×${asset.height}`
            : null}
          {asset.width && asset.height && asset.sizeBytes ? " · " : null}
          {formatBytes(asset.sizeBytes)}
        </span>
      </span>
    </button>
  );
}
