import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface LogoBarBlockData {
  logos: { src: string; alt: string; href?: string }[];
  heading?: string;
  variant?: "default" | "grayscale" | "bordered";
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "max-h-6",
  md: "max-h-10",
  lg: "max-h-14",
};

export default function LogoBarBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as LogoBarBlockData;
  const {
    logos = [],
    heading,
    variant = "default",
    size = "md",
  } = data;

  if (logos.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-[var(--el-500)]">
        No logos added yet
      </div>
    );
  }

  return (
    <div className="w-full">
      {heading && (
        <p className="text-center text-xs font-medium text-[var(--el-500)] uppercase tracking-wider mb-4">
          {heading}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-8">
        {logos.map((logo, i) => (
          <div
            key={i}
            className={cn(
              variant === "bordered" && "border border-border rounded-lg p-3",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.alt}
              className={cn(
                "w-auto object-contain",
                sizeClasses[size],
                variant === "grayscale" &&
                  "grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all",
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
