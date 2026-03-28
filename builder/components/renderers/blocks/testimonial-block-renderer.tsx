"use client";
/* eslint-disable @next/next/no-img-element -- dynamic CMS images */

import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

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
    columns = 2,
    variant = "default",
    showRating = false,
  } = data;

  const updateItem = (index: number, field: string, value: string) => {
    if (!onChange) return;
    const updated = [...testimonials];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...block, data: { ...block.data, testimonials: updated } });
  };

  if (testimonials.length === 0 && !isEditing) return null;

  return (
    <div
      className={cn(
        "grid gap-6",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {testimonials.map((t, i) => (
        <div
          key={i}
          className={cn(
            "p-5",
            variant === "card" &&
              "bg-[var(--el-0)] border border-[var(--border-default)] rounded-lg shadow-sm",
            variant === "minimal" && "border-l-2 border-[var(--accent-primary)] pl-4",
            variant === "default" && "bg-[var(--el-100)]/30 rounded-lg",
          )}
        >
          {showRating && t.rating && (
            <div className="flex gap-0.5 mb-2">
              {Array.from({ length: 5 }).map((_, s) => (
                <span
                  key={s}
                  className={cn(
                    "text-sm",
                    s < t.rating! ? "text-amber-400" : "text-[var(--el-200)]",
                  )}
                >
                  ★
                </span>
              ))}
            </div>
          )}
          <blockquote
            className="text-sm text-[var(--el-800)] italic"
            contentEditable={!!isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              const v = (e.currentTarget.textContent || "").replace(/^"|"$/g, "");
              if (v !== t.quote) updateItem(i, "quote", v);
            }}
            style={isEditing ? { cursor: "text", outline: "none" } : undefined}
          >
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <div className="mt-3 flex items-center gap-2">
            {t.avatar && (
              <img
                src={t.avatar}
                alt={t.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div>
              <p
                className="text-sm font-medium"
                contentEditable={!!isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const v = e.currentTarget.textContent || "";
                  if (v !== t.name) updateItem(i, "name", v);
                }}
                style={isEditing ? { cursor: "text", outline: "none" } : undefined}
              >
                {t.name}
              </p>
              <p
                className="text-xs text-[var(--el-500)]"
                contentEditable={!!isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const v = e.currentTarget.textContent || "";
                  if (v !== t.role) updateItem(i, "role", v);
                }}
                style={isEditing ? { cursor: "text", outline: "none" } : undefined}
              >
                {[t.role, t.company].filter(Boolean).join(", ") || (isEditing ? "Role, Company" : "")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
