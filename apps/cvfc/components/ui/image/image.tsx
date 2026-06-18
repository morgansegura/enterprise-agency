"use client";

import { Image as BaseImage, type ImageProps } from "@wf/ui";

import { LogoIcon } from "@/components/layout";

import "./image.css";

/** Site Image — the shared @wf/ui primitive with the CVFC logo as its fallback. */
export function Image({ fallback, ...props }: ImageProps) {
  return (
    <BaseImage
      fallback={fallback ?? <LogoIcon className="image-fallback-icon" />}
      {...props}
    />
  );
}
