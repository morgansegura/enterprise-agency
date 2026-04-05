import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPublicApiClient, type BlogPost } from "@/lib/public-api-client";
import { BlockRenderer, resetImagePriority } from "@/components/block-renderer";
import type { RootBlock } from "@/lib/blocks";
import "./post.css";

interface Props {
  params: Promise<{ tenantSlug: string; postSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postSlug } = await params;
  const api = await createPublicApiClient();

  try {
    const post = await api.getPost(postSlug);
    return {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt || "",
      keywords: post.seo?.metaKeywords,
      openGraph: {
        title: post.seo?.metaTitle || post.title,
        description: post.seo?.metaDescription || post.excerpt || "",
        images: post.seo?.ogImage || post.featuredImage
          ? [{ url: post.seo?.ogImage || post.featuredImage || "" }]
          : undefined,
        type: "article",
        publishedTime: post.publishDate,
        authors: post.author ? [post.author] : undefined,
        tags: post.tags,
      },
    };
  } catch {
    return { title: "Post Not Found" };
  }
}

export default async function PostPage({ params }: Props) {
  const { postSlug } = await params;
  const api = await createPublicApiClient();

  let post: BlogPost;
  try {
    post = await api.getPost(postSlug);
  } catch {
    notFound();
  }

  resetImagePriority();

  const sections = post.content?.sections || [];
  const blocks: RootBlock[] = sections.flatMap(
    (s) => {
      const sectionAny = s as unknown as Record<string, unknown>;
      // New architecture: containers → blocks
      const containers = sectionAny.containers as Array<{ blocks?: RootBlock[] }> | undefined;
      if (containers) {
        return containers.flatMap((c) => (c.blocks || []) as RootBlock[]);
      }
      // Legacy: direct blocks
      return (s.blocks || []) as RootBlock[];
    },
  );

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || "",
    image: post.featuredImage,
    author: post.author
      ? { "@type": "Person", name: post.author }
      : undefined,
    datePublished: post.publishDate,
    dateModified: post.updatedAt,
    keywords: post.tags?.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article data-slot="post-page">
        {/* Post header */}
        <header data-slot="post-header">
          {post.categories && post.categories.length > 0 && (
            <div data-slot="post-categories">
              {post.categories.map((cat) => (
                <span key={cat} data-slot="post-category">
                  {cat}
                </span>
              ))}
            </div>
          )}
          <h1 data-slot="post-title">{post.title}</h1>
          {post.excerpt && (
            <p data-slot="post-excerpt">{post.excerpt}</p>
          )}
          <div data-slot="post-meta">
            {post.author && (
              <span data-slot="post-author">{post.author}</span>
            )}
            {post.publishDate && (
              <time data-slot="post-date">
                {new Date(post.publishDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            )}
          </div>
        </header>

        {/* Featured image */}
        {post.featuredImage && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={post.featuredImage}
            alt={post.title}
            data-slot="post-featured-image"
          />
        )}

        {/* Post content — rendered blocks */}
        <div data-slot="post-content">
          <BlockRenderer blocks={blocks} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <footer data-slot="post-footer">
            <div data-slot="post-tags">
              {post.tags.map((tag) => (
                <span key={tag} data-slot="post-tag">
                  {tag}
                </span>
              ))}
            </div>
          </footer>
        )}
      </article>
    </>
  );
}
