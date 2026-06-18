import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

import "./button.css";

const buttonVariants = cva("button", {
  variants: {
    variant: {
      default: "button-default",
      outline: "button-outline",
      secondary: "button-secondary",
      ghost: "button-ghost",
      destructive: "button-destructive",
      link: "button-link",
    },
    size: {
      default: "button-size-default",
      xs: "button-size-xs",
      sm: "button-size-sm",
      lg: "button-size-lg",
      icon: "button-icon-default",
      "icon-xs": "button-icon-xs",
      "icon-sm": "button-icon-sm",
      "icon-lg": "button-icon-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

function Button({
  className,
  variant = "default",
  size = "default",
  render,
  nativeButton,
  ...props
}: Omit<ButtonPrimitive.Props, "size"> & VariantProps<typeof buttonVariants>) {
  // Base UI warns about lost semantics when `render` swaps in a non-<button>
  // element (e.g. <a>) — infer nativeButton={false} in that case.
  const inferredNativeButton =
    nativeButton ??
    (!render ||
      (React.isValidElement(render) &&
        (render as React.ReactElement).type === "button"));

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        "group/button",
        buttonVariants({ variant, size, className }),
      )}
      render={render}
      nativeButton={inferredNativeButton}
      {...props}
    />
  );
}

export { Button, buttonVariants };
