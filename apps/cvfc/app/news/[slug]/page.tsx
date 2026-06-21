import type { Metadata } from "next";

import { NewsPostScreen } from "@/components/screen/news-post-screen";
import { NEWS_POSTS, getActiveNews, getPostBySlug } from "@/data/news";
import { getCmsPostBySlug, getCmsPosts } from "@/lib/cms";
import { cmsPostToNewsPost } from "@/lib/cms-news";

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
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: post.image
      ? {
          title: post.title,
          description: post.excerpt,
          images: [{ url: post.image.src, alt: post.image.alt }],
        }
      : { title: post.title, description: post.excerpt },
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
