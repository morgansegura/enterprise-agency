import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import "./text.css";

const textVariants = cva("text", {
  variants: {
    size: {
      sm: "text-size-sm",
      base: "text-size-base",
      lg: "text-size-lg",
    },
    tone: {
      default: "text-tone-default",
      muted: "text-tone-muted",
    },
  },
  defaultVariants: { size: "base", tone: "default" },
});

type TextProps = React.ComponentProps<"p"> &
  VariantProps<typeof textVariants> & {
    as?: "p" | "span" | "div";
  };

function Text({ as: Tag = "p", size, tone, className, ...props }: TextProps) {
  return (
    <Tag className={cn(textVariants({ size, tone }), className)} {...props} />
  );
}

export { Text, textVariants };
export type { TextProps };
