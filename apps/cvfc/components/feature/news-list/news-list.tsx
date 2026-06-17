"use client";

import * as React from "react";

import { NewsCard } from "@/components/feature/news-card";
import type { NewsPost } from "@/data/news";
import { cn } from "@/lib/utils";

import "./news-list.css";

type NewsListProps = {
  className?: string;
  posts: NewsPost[];
  /** How many posts to show initially. Default: 12. */
  initialCount?: number;
  /** How many to add per auto-load batch. Default: 12. */
  step?: number;
};

export function NewsList({
  className,
  posts,
  initialCount = 12,
  step = 12,
}: NewsListProps) {
  const [visible, setVisible] = React.useState(initialCount);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (visible >= posts.length) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible((v) => Math.min(v + step, posts.length));
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible, posts.length, step]);

  const shown = posts.slice(0, visible);
  const hasMore = visible < posts.length;

  return (
    <div className={cn("news-list", className)}>
      <ul className="news-list-grid">
        {shown.map((post) => (
          <li key={post.id} className="news-list-item">
            <NewsCard post={post} />
          </li>
        ))}
      </ul>
      {hasMore ? (
        <div
          ref={sentinelRef}
          className="news-list-sentinel"
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}
