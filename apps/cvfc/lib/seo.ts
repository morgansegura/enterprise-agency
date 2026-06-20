import type { Metadata } from "next";

import { site } from "@/site.config";
import { getPage, mediaUrl } from "@/lib/cms";

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}

const trimmed = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;

type PageMetaInput = {
  title: string;
  description?: string;
  path: string;
  ogImage?: string;
  type?: "website" | "article";
};

/** Build per-page Metadata (canonical + OG + Twitter) from the site config. */
export function pageMetadata({
  title,
  description = "",
  path,
  ogImage = "/og-image.png",
  type = "website",
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const image = ogImage.startsWith("http") ? ogImage : absoluteUrl(ogImage);
  const fullTitle = path === "/" ? site.name : `${title} — ${site.name}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      type,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

type PageSeoInput = {
  /** CMS page slug to read SEO overrides from. */
  slug: string;
  /** Route path for the canonical URL, e.g. "/about". */
  path: string;
  /** Fallback title used when the CMS SEO title is empty. */
  title: string;
  /** Fallback description used when the CMS SEO description is empty. */
  description?: string;
  /** Fallback OG image (path or absolute URL). */
  ogImage?: string;
};

/**
 * Per-page Metadata that prefers the page's CMS SEO fields (meta.title /
 * description / image / noindex) and falls back to the route's provided
 * defaults. Lets editors control SEO per page from the CMS without losing the
 * hand-written defaults. The document `<title>` still flows through the root
 * layout's title template (brand suffix); OG/Twitter titles do not.
 */
export async function metadataForPage({
  slug,
  path,
  title,
  description,
  ogImage,
}: PageSeoInput): Promise<Metadata> {
  const page = await getPage(slug);
  const meta = page?.meta ?? undefined;

  const finalTitle = trimmed(meta?.title) ?? title;
  const finalDescription = trimmed(meta?.description) ?? description ?? "";
  const url = absoluteUrl(path);
  const cmsImage = mediaUrl(meta?.image);
  const fallbackImage = ogImage ?? "/og-image.png";
  const image = cmsImage
    ? cmsImage
    : fallbackImage.startsWith("http")
      ? fallbackImage
      : absoluteUrl(fallbackImage);

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: { canonical: url },
    ...(meta?.noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url,
      siteName: site.name,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: finalTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [image],
    },
  };
}
