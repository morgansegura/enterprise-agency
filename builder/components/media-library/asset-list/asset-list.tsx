"use client";

import * as React from "react";
import { Check } from "lucide-react";
import type { Asset } from "@/lib/hooks/use-assets";
import { AssetThumbnail } from "../asset-thumbnail";
import {
  formatBytes,
  formatDimensions,
  formatDuration,
  formatRelativeTime,
  isVideo,
} from "../utils";
import "./asset-list.css";

interface AssetListProps {
  assets: Asset[];
  activeId?: string | null;
  isSelected: (id: string) => boolean;
  onSelect: (id: string, event: React.MouseEvent) => void;
  onActivate: (asset: Asset) => void;
  onContextMenu?: (asset: Asset, event: React.MouseEvent) => void;
}

export function AssetList({
  assets,
  activeId,
  isSelected,
  onSelect,
  onActivate,
  onContextMenu,
}: AssetListProps) {
  return (
    <div data-slot="asset-list" role="grid">
      <div data-slot="asset-list-head" role="row">
        <div data-slot="asset-list-cell" data-col="select" />
        <div data-slot="asset-list-cell" data-col="preview" />
        <div data-slot="asset-list-cell" data-col="name">Name</div>
        <div data-slot="asset-list-cell" data-col="dimensions">Size</div>
        <div data-slot="asset-list-cell" data-col="bytes">Bytes</div>
        <div data-slot="asset-list-cell" data-col="updated">Modified</div>
        <div data-slot="asset-list-cell" data-col="type">Type</div>
      </div>
      {assets.map((asset) => (
        <button
          key={asset.id}
          type="button"
          data-slot="asset-list-row"
          data-selected={isSelected(asset.id) ? "true" : "false"}
          data-active={activeId === asset.id ? "true" : "false"}
          role="row"
          onClick={(e) => {
            if (e.shiftKey || e.metaKey || e.ctrlKey) {
              onSelect(asset.id, e);
            } else {
              onActivate(asset);
            }
          }}
          onDoubleClick={() => onActivate(asset)}
          onContextMenu={(e) => {
            e.preventDefault();
            onContextMenu?.(asset, e);
          }}
        >
          <div data-slot="asset-list-cell" data-col="select">
            {isSelected(asset.id) ? (
              <span data-slot="asset-list-check">
                <Check aria-hidden="true" />
              </span>
            ) : null}
          </div>
          <div data-slot="asset-list-cell" data-col="preview">
            <AssetThumbnail asset={asset} size="sm" />
          </div>
          <div data-slot="asset-list-cell" data-col="name">
            <span data-slot="asset-list-name">
              {asset.title || asset.fileName}
            </span>
            {asset.altText ? (
              <span data-slot="asset-list-sub">{asset.altText}</span>
            ) : null}
          </div>
          <div data-slot="asset-list-cell" data-col="dimensions">
            {isVideo(asset) && asset.duration
              ? formatDuration(asset.duration)
              : formatDimensions(asset)}
          </div>
          <div data-slot="asset-list-cell" data-col="bytes">
            {formatBytes(asset.sizeBytes)}
          </div>
          <div data-slot="asset-list-cell" data-col="updated">
            {formatRelativeTime(asset.updatedAt || asset.createdAt)}
          </div>
          <div data-slot="asset-list-cell" data-col="type">
            {asset.mimeType || asset.fileType}
          </div>
        </button>
      ))}
    </div>
  );
}
