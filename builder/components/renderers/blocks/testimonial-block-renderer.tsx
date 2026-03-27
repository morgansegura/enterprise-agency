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
}: BlockRendererProps) {
  const data = block.data as unknown as TestimonialBlockData;
  const {
    testimonials = [],
    columns = 2,
    variant = "default",
    showRating = false,
  } = data;

  if (testimonials.length === 0) return null;

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
              "bg-card border border-border rounded-lg shadow-sm",
            variant === "minimal" && "border-l-2 border-primary pl-4",
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
                    s < t.rating! ? "text-amber-400" : "text-muted",
                  )}
                >
                  ★
                </span>
              ))}
            </div>
          )}
          <blockquote className="text-sm text-[var(--el-800)] italic">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <div className="mt-3 flex items-center gap-2">
            {t.avatar && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={t.avatar}
                alt={t.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-sm font-medium">{t.name}</p>
              {(t.role || t.company) && (
                <p className="text-xs text-[var(--el-500)]">
                  {[t.role, t.company].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
