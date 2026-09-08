import type { Metadata } from "next";

import { NewsPostScreen } from "@/components/screen/news-post-screen";
import { NEWS_POSTS, getActiveNews, getPostBySlug } from "@/data/news";
import { getCmsPostBySlug, getCmsPosts, mediaUrl } from "@/lib/cms";
import { cmsPostToNewsPost } from "@/lib/cms-news";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/site.config";

type RouteParams = {
  slug: string;
};

export async function generateStaticParams(): Promise<RouteParams[]> {
  const cms = (await getCmsPosts())
    .map((p) => p.slug)
    .filter((s): s is string => Boolean(s));
  const staticSlugs = getActiveNews(NEWS_POSTS).map((p) => p.slug);
  return [...new Set([...cms, ...staticSlugs])].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cms = await getCmsPostBySlug(slug);
  const post = cms ? cmsPostToNewsPost(cms) : getPostBySlug(NEWS_POSTS, slug);
  if (!post) return { title: "Story not found" };

  // The editor's SEO panel wins, then the post's own fields. Without this the
  // whole SEO group in the CMS was collected and never read.
  const meta = cms?.meta ?? undefined;
  const title = meta?.title?.trim() || post.title;
  const description = meta?.description?.trim() || post.excerpt;
  const image = mediaUrl(meta?.image) ?? post.image?.src;
  const url = absoluteUrl(`/news/${slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    ...(meta?.noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type: "article",
      ...(post.date ? { publishedTime: post.date } : {}),
      ...(image
        ? { images: [{ url: image, alt: post.image?.alt ?? title }] }
        : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  return <NewsPostScreen slug={slug} />;
}
