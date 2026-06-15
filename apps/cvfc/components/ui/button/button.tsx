import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import "./button.css";

// shadcn Button, stripped to named classes — all styling lives in button.css.
const buttonVariants = cva("button", {
  variants: {
    variant: {
      default: "button-default",
      secondary: "button-secondary",
      outline: "button-outline",
      ghost: "button-ghost",
      destructive: "button-destructive",
      link: "button-link",
    },
    size: {
      default: "button-size-default",
      sm: "button-size-sm",
      lg: "button-size-lg",
      icon: "button-size-icon",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
