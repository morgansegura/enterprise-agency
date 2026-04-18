"use client";
/* eslint-disable @next/next/no-img-element -- CMS images with unknown dimensions */

import * as React from "react";
import { Blurhash } from "react-blurhash";
import { FileVideo, FileAudio, FileText, File as FileIcon } from "lucide-react";
import type { Asset } from "@/lib/hooks/use-assets";
import { isImage, isVideo, isAudio, pickThumbnailUrl } from "../utils";
import "./asset-thumbnail.css";

interface AssetThumbnailProps {
  asset: Asset;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AssetThumbnail({
  asset,
  size = "md",
  className,
}: AssetThumbnailProps) {
  const [loaded, setLoaded] = React.useState(false);
  const src = pickThumbnailUrl(asset);
  const hasBlurHash = Boolean(asset.blurHash);

  return (
    <div
      data-slot="asset-thumbnail"
      data-size={size}
      data-kind={asset.fileType}
      data-dominant={asset.dominantColor ? "true" : "false"}
      style={
        asset.dominantColor
          ? { backgroundColor: asset.dominantColor }
          : undefined
      }
      className={className}
    >
      {isImage(asset) && src ? (
        <>
          {hasBlurHash && !loaded && asset.blurHash ? (
            <Blurhash
              hash={asset.blurHash}
              width="100%"
              height="100%"
              resolutionX={32}
              resolutionY={32}
              punch={1}
            />
          ) : null}
          <img
            src={src}
            alt={asset.altText || asset.fileName}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            data-loaded={loaded ? "true" : "false"}
          />
        </>
      ) : isVideo(asset) ? (
        <VideoPreview asset={asset} src={src} />
      ) : isAudio(asset) ? (
        <AudioIcon />
      ) : (
        <DocumentIcon />
      )}
    </div>
  );
}

function VideoPreview({
  asset,
  src,
}: {
  asset: Asset;
  src: string | null;
}) {
  return (
    <>
      {src ? (
        <img
          src={src}
          alt={asset.altText || asset.fileName}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <FileVideo aria-hidden="true" />
      )}
      <span data-slot="asset-thumbnail-badge">
        <FileVideo aria-hidden="true" />
      </span>
    </>
  );
}

function AudioIcon() {
  return <FileAudio aria-hidden="true" />;
}

function DocumentIcon() {
  return <FileText aria-hidden="true" />;
}

export { FileIcon };
