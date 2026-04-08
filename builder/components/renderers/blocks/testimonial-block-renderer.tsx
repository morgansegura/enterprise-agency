"use client";
/* eslint-disable @next/next/no-img-element -- dynamic CMS images */

import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { getElementClass } from "@enterprise/tokens";

interface TestimonialItem {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating?: number;
}

interface TestimonialBlockData {
  testimonials: TestimonialItem[];
  layout?: "grid" | "carousel" | "single";
  columns?: 1 | 2 | 3;
  variant?: "default" | "card" | "minimal";
  showRating?: boolean;
}

export default function TestimonialBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as TestimonialBlockData;
  const {
    testimonials = [],
    layout = "grid",
    columns = 2,
    variant = "default",
    showRating = false,
  } = data;

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const hasStyle = (prop: string) => !!styles?.[prop];
  const elementClass = getElementClass(block._key);

  const updateItem = (index: number, field: string, value: string) => {
    if (!onChange) return;
    const updated = [...testimonials];
    updated[index] = { ...updated[index], [field]: value };
    onChange({
      ...block,
      data: { ...block.data, testimonials: updated },
    });
  };

  if (testimonials.length === 0 && !isEditing) return null;

  return (
    <div
      className={elementClass}
      data-slot="testimonial-block"
      data-layout={layout}
      data-columns={hasStyle("gridTemplateColumns") ? undefined : columns}
      data-variant={variant}
    >
      {testimonials.map((t, i) => (
        <div key={i} data-slot="testimonial-block-card">
          {showRating && t.rating ? (
            <div
              data-slot="testimonial-block-rating"
              aria-label={`${t.rating} out of 5 stars`}
            >
              {Array.from({ length: 5 }, (_, s) => (
                <span
                  key={s}
                  data-slot="testimonial-block-star"
                  data-filled={s < t.rating! ? "true" : "false"}
                  aria-hidden="true"
                >
                  ★
                </span>
              ))}
            </div>
          ) : null}

          <blockquote
            data-slot="testimonial-block-quote"
            contentEditable={!!isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              const v = (e.currentTarget.textContent || "").replace(
                /^"|"$/g,
                "",
              );
              if (v !== t.quote) updateItem(i, "quote", v);
            }}
            style={
              isEditing ? { cursor: "text", outline: "none" } : undefined
            }
          >
            {t.quote}
          </blockquote>

          <div data-slot="testimonial-block-author">
            {t.avatar ? (
              <img
                data-slot="testimonial-block-avatar"
                src={t.avatar}
                alt={t.name}
              />
            ) : null}

            <div data-slot="testimonial-block-info">
              <div
                data-slot="testimonial-block-name"
                contentEditable={!!isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const v = e.currentTarget.textContent || "";
                  if (v !== t.name) updateItem(i, "name", v);
                }}
                style={
                  isEditing
                    ? { cursor: "text", outline: "none" }
                    : undefined
                }
              >
                {t.name}
              </div>

              {t.role || t.company || isEditing ? (
                <div
                  data-slot="testimonial-block-role"
                  contentEditable={!!isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const v = e.currentTarget.textContent || "";
                    if (v !== t.role) updateItem(i, "role", v);
                  }}
                  style={
                    isEditing
                      ? { cursor: "text", outline: "none" }
                      : undefined
                  }
                >
                  {[t.role, t.company].filter(Boolean).join(", ") ||
                    (isEditing ? "Role, Company" : "")}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
