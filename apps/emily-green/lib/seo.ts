import type { Metadata } from "next";

import { site } from "@/site.config";

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}

/**
 * Whether search engines may index this deployment.
 *
 * Churchill Mortgage requires marketing-compliance approval before an LO site
 * goes live, so production alone is not enough — `CMC_APPROVED` must also be
 * set. A `*.vercel.app` URL gets crawled whether or not a domain points at it,
 * so this gates `robots.ts` and the layout's robots meta together.
 */
export function isPubliclyIndexable(): boolean {
  return (
    process.env.VERCEL_ENV === "production" &&
    process.env.CMC_APPROVED === "true"
  );
}

type PageMetaInput = {
  title: string;
  description?: string;
  path: string;
  /** Explicit OG image. Omit to inherit the dynamic `opengraph-image` route. */
  ogImage?: string;
  type?: "website" | "article";
};

/** Build per-page Metadata (canonical + OG + Twitter) from the site config. */
export function pageMetadata({
  title,
  description = "",
  path,
  ogImage,
  type = "website",
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle =
    path === "/" ? `${site.name} — ${site.tagline}` : `${title} — ${site.name}`;
  const image = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : absoluteUrl(ogImage)
    : undefined;

  return {
    // absolute: fullTitle already includes the site name — skip the layout template.
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      type,
      // When image is undefined, Next auto-fills from app/opengraph-image.
      ...(image
        ? { images: [{ url: image, width: 1200, height: 630, alt: fullTitle }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
