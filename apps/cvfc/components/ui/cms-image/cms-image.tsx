import NextImage, { type ImageProps } from "next/image";

/**
 * next/image wrapper for CMS-sourced images. Uploads on our own hosts (R2 / the
 * Payload host) go through the optimizer; an arbitrary "image by URL" from the
 * CMS would otherwise be REJECTED by `remotePatterns`, so non-allowlisted hosts
 * render unoptimized (raw src) instead of breaking. This keeps the optimizer
 * from being an open proxy while letting any URL display.
 */
const OPTIMIZABLE_HOSTS = [
  "r2.dev",
  "r2.cloudflarestorage.com",
  "webandfunnel.onrender.com",
  "chulavistafc.com",
  "localhost",
];

function isOptimizable(src: ImageProps["src"]): boolean {
  if (typeof src !== "string") return true; // imported/static asset
  try {
    const { hostname } = new URL(src, "http://localhost");
    return OPTIMIZABLE_HOSTS.some(
      (h) => hostname === h || hostname.endsWith(`.${h}`),
    );
  } catch {
    return true;
  }
}

export function CmsImage({ src, ...props }: ImageProps) {
  return <NextImage src={src} unoptimized={!isOptimizable(src)} {...props} />;
}
