import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface CtaBlockData {
  heading: string;
  description?: string;
  primaryCta: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  variant?: "default" | "highlighted" | "minimal";
  align?: "left" | "center";
}

export default function CtaBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as CtaBlockData;
  const {
    heading,
    description,
    primaryCta,
    secondaryCta,
    variant = "default",
    align = "center",
  } = data;

  return (
    <div
      className={cn(
        "w-full rounded-lg px-8 py-10",
        variant === "highlighted"
          ? "bg-[var(--accent-primary)] text-[var(--accent-primary-foreground)]"
          : variant === "minimal"
            ? "border border-border"
            : "bg-[var(--el-100)]/50",
        align === "center" ? "text-center" : "text-left",
      )}
    >
      <h3 className="text-xl font-bold">{heading}</h3>
      {description && (
        <p
          className={cn(
            "mt-2 text-sm",
            variant === "highlighted"
              ? "text-[var(--accent-primary-foreground)]/80"
              : "text-[var(--el-500)]",
          )}
        >
          {description}
        </p>
      )}
      <div
        className={cn(
          "flex gap-3 mt-4",
          align === "center" ? "justify-center" : "",
        )}
      >
        <span
          className={cn(
            "inline-flex items-center px-4 py-2 rounded-md text-sm font-medium",
            variant === "highlighted"
              ? "bg-[var(--el-0)] text-[var(--el-800)]"
              : "bg-[var(--accent-primary)] text-[var(--accent-primary-foreground)]",
          )}
        >
          {primaryCta?.text || "Get Started"}
        </span>
        {secondaryCta && (
          <span
            className={cn(
              "inline-flex items-center px-4 py-2 rounded-md border text-sm font-medium",
              variant === "highlighted"
                ? "border-primary-foreground/30 text-[var(--accent-primary-foreground)]"
                : "border-border",
            )}
          >
            {secondaryCta.text}
          </span>
        )}
      </div>
    </div>
  );
}
