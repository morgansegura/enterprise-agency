import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsPostScreen } from "@/components/screen/news-post-screen";
import { NEWS_POSTS, getActiveNews, getPostBySlug } from "@/data/news";

type RouteParams = {
  slug: string;
};

export async function generateStaticParams(): Promise<RouteParams[]> {
  return getActiveNews(NEWS_POSTS).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(NEWS_POSTS, slug);
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
  const post = getPostBySlug(NEWS_POSTS, slug);
  if (!post) notFound();
  return <NewsPostScreen slug={slug} />;
}
