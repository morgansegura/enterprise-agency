"use client";
/* eslint-disable @next/next/no-img-element -- CMS images */

import * as React from "react";
import {
  Copy,
  Crop,
  Download,
  ExternalLink,
  FileText,
  Pencil,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea/textarea";
import { toast } from "sonner";
import type { Asset } from "@/lib/hooks/use-assets";
import { useAssetReferences } from "@/lib/hooks/use-assets";
import { FocalPointPicker } from "../focal-point-picker";
import {
  formatBytes,
  formatDimensions,
  formatDuration,
  formatRelativeTime,
  isImage,
  isVideo,
} from "../utils";
import "./asset-detail-drawer.css";

interface AssetDetailDrawerProps {
  tenantId: string;
  asset: Asset | null;
  onClose: () => void;
  onSave: (patch: {
    title?: string;
    altText?: string;
    caption?: string;
    tags?: string[];
    focalX?: number;
    focalY?: number;
  }) => void;
  onCrop?: (asset: Asset) => void;
  onDelete?: (asset: Asset) => void;
}

export function AssetDetailDrawer({
  tenantId,
  asset,
  onClose,
  onSave,
  onCrop,
  onDelete,
}: AssetDetailDrawerProps) {
  const [draft, setDraft] = React.useState({
    title: "",
    altText: "",
    caption: "",
    tags: "",
  });
  const [focal, setFocal] = React.useState<{ x: number; y: number } | null>(
    null,
  );

  React.useEffect(() => {
    if (!asset) return;
    setDraft({
      title: asset.title ?? "",
      altText: asset.altText ?? "",
      caption: asset.caption ?? "",
      tags: (asset.tags ?? []).join(", "),
    });
    setFocal(
      typeof asset.focalX === "number" && typeof asset.focalY === "number"
        ? { x: asset.focalX, y: asset.focalY }
        : null,
    );
  }, [asset]);

  const references = useAssetReferences(tenantId, asset?.id ?? null);

  if (!asset) return null;

  const handleSave = () => {
    onSave({
      title: draft.title || undefined,
      altText: draft.altText || undefined,
      caption: draft.caption || undefined,
      tags: draft.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      focalX: focal?.x,
      focalY: focal?.y,
    });
  };

  const handleFocalCommit = (value: { x: number; y: number }) => {
    onSave({ focalX: value.x, focalY: value.y });
  };

  const copy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  return (
    <aside data-slot="asset-detail-drawer" aria-label="Asset details">
      <header data-slot="asset-detail-header">
        <span data-slot="asset-detail-title">Details</span>
        <button
          type="button"
          data-slot="asset-detail-close"
          onClick={onClose}
          aria-label="Close details"
        >
          <X aria-hidden="true" />
        </button>
      </header>

      <div data-slot="asset-detail-preview">
        {isImage(asset) ? (
          <img src={asset.url} alt={asset.altText || asset.fileName} />
        ) : isVideo(asset) ? (
          <video src={asset.url} controls preload="metadata" />
        ) : (
          <div data-slot="asset-detail-doc">
            <FileText aria-hidden="true" />
            <span>{asset.fileName}</span>
          </div>
        )}
      </div>

      <div data-slot="asset-detail-actions">
        {isImage(asset) && onCrop ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCrop(asset)}
            data-slot="asset-detail-action"
          >
            <Crop aria-hidden="true" />
            Crop
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="sm"
          asChild
          data-slot="asset-detail-action"
        >
          <a href={asset.url} target="_blank" rel="noreferrer">
            <ExternalLink aria-hidden="true" />
            Open
          </a>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          asChild
          data-slot="asset-detail-action"
        >
          <a href={asset.url} download={asset.fileName}>
            <Download aria-hidden="true" />
            Download
          </a>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copy(asset.url)}
          data-slot="asset-detail-action"
        >
          <Copy aria-hidden="true" />
          URL
        </Button>
        {onDelete ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(asset)}
            data-slot="asset-detail-action"
            data-variant="destructive"
          >
            <Trash2 aria-hidden="true" />
            Delete
          </Button>
        ) : null}
      </div>

      <section data-slot="asset-detail-section">
        <h4>Metadata</h4>
        <label data-slot="asset-detail-field">
          <span>Title</span>
          <Input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder={asset.fileName}
          />
        </label>
        <label data-slot="asset-detail-field">
          <span>Alt text</span>
          <Input
            value={draft.altText}
            onChange={(e) => setDraft({ ...draft, altText: e.target.value })}
            placeholder="Describe the image for screen readers"
          />
        </label>
        <label data-slot="asset-detail-field">
          <span>Caption</span>
          <Textarea
            value={draft.caption}
            onChange={(e) => setDraft({ ...draft, caption: e.target.value })}
            rows={2}
          />
        </label>
        <label data-slot="asset-detail-field">
          <span>Tags</span>
          <Input
            value={draft.tags}
            onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
            placeholder="comma, separated, tags"
          />
        </label>
        <Button
          size="sm"
          onClick={handleSave}
          data-slot="asset-detail-save"
        >
          <Pencil aria-hidden="true" />
          Save changes
        </Button>
      </section>

      <section data-slot="asset-detail-section">
        <h4>File</h4>
        <dl data-slot="asset-detail-props">
          <dt>File name</dt>
          <dd title={asset.fileName}>{asset.fileName}</dd>
          <dt>Type</dt>
          <dd>{asset.mimeType || asset.fileType}</dd>
          <dt>Size</dt>
          <dd>{formatBytes(asset.sizeBytes)}</dd>
          {isImage(asset) || isVideo(asset) ? (
            <>
              <dt>Dimensions</dt>
              <dd>{formatDimensions(asset)}</dd>
            </>
          ) : null}
          {asset.aspectRatio ? (
            <>
              <dt>Aspect</dt>
              <dd>{asset.aspectRatio}</dd>
            </>
          ) : null}
          {isVideo(asset) && asset.duration ? (
            <>
              <dt>Duration</dt>
              <dd>{formatDuration(asset.duration)}</dd>
            </>
          ) : null}
          {asset.storageProvider ? (
            <>
              <dt>Storage</dt>
              <dd>{asset.storageProvider}</dd>
            </>
          ) : null}
          <dt>Created</dt>
          <dd>{formatRelativeTime(asset.createdAt)}</dd>
          {asset.updatedAt ? (
            <>
              <dt>Modified</dt>
              <dd>{formatRelativeTime(asset.updatedAt)}</dd>
            </>
          ) : null}
        </dl>
      </section>

      {isImage(asset) ? (
        <section data-slot="asset-detail-section">
          <h4>Focal point</h4>
          <p data-slot="asset-detail-hint">
            Click to set the focus area — smart crops will keep it centered.
          </p>
          <FocalPointPicker
            src={asset.thumbnailUrl || asset.url}
            alt={asset.altText || asset.fileName}
            value={focal}
            onChange={setFocal}
            onCommit={handleFocalCommit}
          />
        </section>
      ) : null}

      {asset.palette && asset.palette.length > 0 ? (
        <section data-slot="asset-detail-section">
          <h4>Color</h4>
          <div data-slot="asset-detail-palette">
            {asset.dominantColor ? (
              <button
                type="button"
                data-slot="asset-detail-swatch"
                data-dominant="true"
                onClick={() => copy(asset.dominantColor!)}
                title={asset.dominantColor}
              >
                <span
                  style={{ backgroundColor: asset.dominantColor }}
                  data-slot="asset-detail-swatch-color"
                />
                <span data-slot="asset-detail-swatch-label">
                  {asset.dominantColor}
                </span>
              </button>
            ) : null}
            {asset.palette
              .filter((c) => c !== asset.dominantColor)
              .map((color) => (
                <button
                  key={color}
                  type="button"
                  data-slot="asset-detail-swatch"
                  onClick={() => copy(color)}
                  title={color}
                >
                  <span
                    style={{ backgroundColor: color }}
                    data-slot="asset-detail-swatch-color"
                  />
                </button>
              ))}
          </div>
        </section>
      ) : null}

      {asset.exif && Object.keys(asset.exif).length > 0 ? (
        <section data-slot="asset-detail-section">
          <h4>EXIF</h4>
          <dl data-slot="asset-detail-props">
            {Object.entries(asset.exif).map(([key, value]) => (
              <React.Fragment key={key}>
                <dt>{formatExifKey(key)}</dt>
                <dd>{formatExifValue(value)}</dd>
              </React.Fragment>
            ))}
          </dl>
        </section>
      ) : null}

      <section data-slot="asset-detail-section">
        <h4>Used in</h4>
        {references.isLoading ? (
          <p data-slot="asset-detail-empty">Loading references…</p>
        ) : (references.data?.pages.length ?? 0) === 0 &&
          (references.data?.posts.length ?? 0) === 0 ? (
          <p data-slot="asset-detail-empty">Not referenced yet</p>
        ) : (
          <ul data-slot="asset-detail-refs">
            {references.data?.pages.map((page) => (
              <li key={`page-${page.id}`}>
                <Tag aria-hidden="true" />
                <span data-slot="asset-detail-ref-label">Page</span>
                <span>{page.title}</span>
                <span data-slot="asset-detail-ref-status">{page.status}</span>
              </li>
            ))}
            {references.data?.posts.map((post) => (
              <li key={`post-${post.id}`}>
                <Tag aria-hidden="true" />
                <span data-slot="asset-detail-ref-label">Post</span>
                <span>{post.title}</span>
                <span data-slot="asset-detail-ref-status">{post.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}

function formatExifKey(key: string): string {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();
}

function formatExifValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
  }
  return String(value);
}
