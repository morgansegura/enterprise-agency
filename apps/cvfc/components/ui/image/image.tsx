"use client";

import * as React from "react";

import { LogoIcon } from "@/components/layout";
import { cn } from "@/lib/utils";

import "./image.css";

type ImageState = "idle" | "loading" | "loaded" | "error";

type ImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  /** Override fallback (defaults to centered CVFC LogoIcon). */
  fallback?: React.ReactNode;
};

export function Image({
  src,
  alt,
  className,
  imageClassName,
  loading = "lazy",
  fetchPriority,
  fallback,
}: ImageProps) {
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [state, setState] = React.useState<ImageState>(
    src ? "loading" : "idle",
  );

  // Reset state when src changes — adjust state during render (React's
  // recommended alternative to calling setState inside an effect).
  const [prevSrc, setPrevSrc] = React.useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setState(src ? "loading" : "idle");
  }

  // Cached-image race fix: if the browser already has the image, the `load`
  // event may fire before React attaches the listener — so check `complete`
  // (and naturalWidth) on mount/src-change and immediately mark loaded.
  React.useEffect(() => {
    const img = imgRef.current;
    if (!src || !img) return;
    if (img.complete && img.naturalWidth > 0) {
      setState("loaded");
    }
  }, [src]);

  const showFallback = !src || state === "loading" || state === "error";

  return (
    <span className={cn("image", className)} data-state={state}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          className={cn("image-img", imageClassName)}
          onLoad={() => setState("loaded")}
          onError={() => setState("error")}
        />
      ) : null}
      {showFallback ? (
        <span className="image-fallback" aria-hidden="true">
          {fallback ?? <LogoIcon className="image-fallback-icon" />}
        </span>
      ) : null}
    </span>
  );
}
