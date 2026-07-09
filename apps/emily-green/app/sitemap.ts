import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

/** Real, indexable routes only. Add legal + content routes as they ship. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
