import Link from "next/link";

import { LogoIcon } from "@/components/layout";
import { Image } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { NewsPost } from "@/data/news";

import "./news-card.css";

type NewsCardProps = {
  className?: string;
  post: NewsPost;
};

export function NewsCard({ className, post }: NewsCardProps) {
  return (
    <article className={cn("news-card", className)}>
      <Link href={`/news/${post.slug}`} className="news-card-link">
        <div
          className="news-card-image-wrap"
          data-fallback={post.image ? undefined : "true"}
        >
          {post.image ? (
            <Image
              src={post.image.src}
              alt={post.image.alt}
              className="news-card-image"
            />
          ) : (
            <LogoIcon className="news-card-image-fallback-logo" />
          )}
        </div>
        <div className="news-card-body">
          <h3 className="news-card-title">{post.title}</h3>
          {post.excerpt ? (
            <p className="news-card-excerpt">{post.excerpt}</p>
          ) : null}
          <span className="news-card-read">Read story →</span>
        </div>
      </Link>
    </article>
  );
}
