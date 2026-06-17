"use client";

import * as React from "react";

import { LogoIcon } from "@/components/layout";
import { Image } from "@/components/ui";
import {
  TESTIMONIAL_ROLES,
  type Testimonial,
  type TestimonialRole,
} from "@/data/testimonials";
import { cn } from "@/lib/utils";

import "./testimonial-wall.css";

type TestimonialWallProps = {
  className?: string;
  testimonials: Testimonial[];
};

type Filter = "All" | TestimonialRole;

const FILTERS: Filter[] = ["All", ...TESTIMONIAL_ROLES];

const ROLE_LABELS: Record<TestimonialRole, string> = {
  Parent: "Parents",
  Player: "Players",
  Alumnus: "Alumni",
  Coach: "Coaches",
};

const ROLE_TAG: Record<TestimonialRole, string> = {
  Parent: "Parent",
  Player: "Player",
  Alumnus: "Alumnus",
  Coach: "Coach",
};

export function TestimonialWall({
  className,
  testimonials,
}: TestimonialWallProps) {
  const [filter, setFilter] = React.useState<Filter>("All");

  const counts = React.useMemo(() => {
    const c: Record<Filter, number> = {
      All: testimonials.length,
      Parent: 0,
      Player: 0,
      Alumnus: 0,
      Coach: 0,
    };
    for (const t of testimonials) c[t.role] += 1;
    return c;
  }, [testimonials]);

  const visible = React.useMemo(
    () =>
      filter === "All"
        ? testimonials
        : testimonials.filter((t) => t.role === filter),
    [filter, testimonials],
  );

  return (
    <section className={cn("testimonial-wall", className)}>
      <div className="testimonial-wall-inner contain">
        <div
          className="testimonial-wall-filters"
          role="tablist"
          aria-label="Filter testimonials by role"
        >
          {FILTERS.map((f) => {
            const label = f === "All" ? "All" : ROLE_LABELS[f];
            const isActive = filter === f;
            return (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-active={isActive ? "true" : "false"}
                onClick={() => setFilter(f)}
                className="testimonial-wall-filter"
              >
                <span>{label}</span>
                <span className="testimonial-wall-filter-count">
                  {counts[f]}
                </span>
              </button>
            );
          })}
        </div>

        {visible.length === 0 ? (
          <p className="testimonial-wall-empty">
            No voices in this group yet — check back soon.
          </p>
        ) : (
          <ul className="testimonial-wall-grid">
            {visible.map((t) => (
              <li key={t.id} className="testimonial-wall-item">
                <article className="testimonial-wall-card">
                  <span
                    className="testimonial-wall-role-tag"
                    aria-hidden="true"
                  >
                    {ROLE_TAG[t.role]}
                  </span>
                  <p className="testimonial-wall-quote">
                    <span aria-hidden="true">&ldquo;</span>
                    {t.quote}
                    <span aria-hidden="true">&rdquo;</span>
                  </p>
                  <footer className="testimonial-wall-attribution">
                    <span
                      className="testimonial-wall-avatar"
                      aria-hidden="true"
                    >
                      {t.image ? (
                        <Image
                          src={t.image.src}
                          alt={t.image.alt}
                          className="testimonial-wall-avatar-image"
                        />
                      ) : (
                        <LogoIcon className="testimonial-wall-avatar-fallback" />
                      )}
                    </span>
                    <span className="testimonial-wall-author">
                      <span className="testimonial-wall-author-name">
                        {t.author}
                      </span>
                      {t.context ? (
                        <span className="testimonial-wall-author-context">
                          {t.context}
                        </span>
                      ) : null}
                    </span>
                  </footer>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
