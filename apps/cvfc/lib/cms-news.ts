import type { NewsPost } from "@/data/news";
import { mediaUrl, type PostDoc } from "@/lib/cms";
import { lexicalToHtml } from "@/lib/lexical-to-html";

/** Map a CMS `posts` doc → the FE `NewsPost` shape (body serialized from lexical). */
export function cmsPostToNewsPost(d: PostDoc): NewsPost {
  const img = mediaUrl(d.coverImage);
  return {
    id: String(d.id),
    slug: d.slug ?? "",
    title: d.title ?? "",
    date: (d.publishedAt ?? "").slice(0, 10),
    excerpt: typeof d.excerpt === "string" ? d.excerpt : "",
    body: lexicalToHtml(d.content),
    ...(img ? { image: { src: img, alt: d.title ?? "" } } : {}),
  };
}
