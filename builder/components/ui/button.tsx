import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[3px] transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5 shrink-0 [&_svg]:shrink-0 [&_svg]:text-current outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/50 focus-visible:ring-offset-1 font-medium text-[14px]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent-primary)] text-[var(--accent-primary-foreground)] hover:bg-[var(--accent-primary-hover)]",
        destructive:
          "bg-[var(--status-error)] text-white hover:bg-[var(--status-error)]/90 focus-visible:ring-[var(--status-error)]/20",
        outline:
          "border bg-[var(--el-0)] text-[var(--el-800)] shadow-xs hover:bg-[var(--accent-primary-subtle)] hover:text-[var(--el-800)]",
        secondary:
          "bg-[var(--el-100)] text-[var(--el-800)] hover:bg-[var(--el-150)]",
        ghost:
          "text-[var(--el-600)] hover:bg-[var(--accent-primary-subtle)] hover:text-[var(--el-800)]",
        link: "text-[var(--accent-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-3 py-1.5 has-[>svg]:px-2.5",
        sm: "h-6 rounded-[3px] gap-1 px-2 has-[>svg]:px-1.5 text-[12px]",
        lg: "h-10 rounded-[3px] px-4 has-[>svg]:px-3",
        icon: "size-8",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
