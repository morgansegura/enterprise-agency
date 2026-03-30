import type { Metadata } from "next";
import Link from "next/link";
import { createPublicApiClient } from "@/lib/public-api-client";
import "./blog.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog",
    description: "Latest articles and updates",
  };
}

export default async function BlogPage() {
  const api = await createPublicApiClient();
  let posts: Awaited<ReturnType<typeof api.listPosts>> = [];

  try {
    posts = await api.listPosts();
  } catch {
    // No posts or API error — show empty state
  }

  const tenantSlug = api.getSlug();

  return (
    <main data-slot="blog-page">
      <div data-slot="blog-header">
        <h1 data-slot="blog-title">Blog</h1>
        <p data-slot="blog-subtitle">Latest articles and updates</p>
      </div>

      {posts.length === 0 ? (
        <div data-slot="blog-empty">
          <p>No posts published yet.</p>
        </div>
      ) : (
        <div data-slot="blog-grid">
          {posts.map((post) => (
            <article key={post.id} data-slot="blog-card">
              {post.featuredImage && (
                <Link href={`/${tenantSlug}/blog/${post.slug}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    data-slot="blog-card-image"
                    loading="lazy"
                  />
                </Link>
              )}
              <div data-slot="blog-card-content">
                {post.categories && post.categories.length > 0 && (
                  <div data-slot="blog-card-categories">
                    {post.categories.map((cat) => (
                      <span key={cat} data-slot="blog-card-category">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
                <Link
                  href={`/${tenantSlug}/blog/${post.slug}`}
                  data-slot="blog-card-title-link"
                >
                  <h2 data-slot="blog-card-title">{post.title}</h2>
                </Link>
                {post.excerpt && (
                  <p data-slot="blog-card-excerpt">{post.excerpt}</p>
                )}
                <div data-slot="blog-card-meta">
                  {post.author && (
                    <span data-slot="blog-card-author">{post.author}</span>
                  )}
                  {post.publishDate && (
                    <time data-slot="blog-card-date">
                      {new Date(post.publishDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
