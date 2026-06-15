import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import "./heading.css";

const headingVariants = cva("heading", {
  variants: {
    size: {
      xl: "heading-xl",
      lg: "heading-lg",
      md: "heading-md",
      sm: "heading-sm",
    },
  },
  defaultVariants: { size: "lg" },
});

type HeadingProps = React.ComponentProps<"h2"> &
  VariantProps<typeof headingVariants> & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  };

function Heading({ as: Tag = "h2", size, className, ...props }: HeadingProps) {
  return (
    <Tag className={cn(headingVariants({ size }), className)} {...props} />
  );
}

export { Heading, headingVariants };
export type { HeadingProps };
