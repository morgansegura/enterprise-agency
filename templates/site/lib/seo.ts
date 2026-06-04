import type { Metadata } from "next";

import { site } from "@/site.config";

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}

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
