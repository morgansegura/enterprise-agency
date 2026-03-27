import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[3px] border px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:ring-offset-1",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--accent-primary)] text-[var(--accent-primary-foreground)] hover:bg-[var(--accent-primary-hover)]",
        secondary:
          "border-transparent bg-[var(--el-100)] text-[var(--el-800)] hover:bg-[var(--el-150)]",
        destructive:
          "border-transparent bg-[var(--status-error)] text-white hover:bg-[var(--status-error)]/80",
        outline: "text-[var(--el-800)]",
        success:
          "border-transparent bg-[var(--status-success-subtle)] text-[var(--status-success)]",
        warning:
          "border-transparent bg-[var(--status-warning-subtle)] text-[var(--status-warning)]",
        info: "border-transparent bg-[var(--status-info-subtle)] text-[var(--status-info)]",
        moved:
          "border-transparent bg-purple-500/15 text-purple-700 dark:text-purple-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
