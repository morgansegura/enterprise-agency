import * as React from "react";
import { cn } from "@/lib/utils";
import "./lozenge.css";

export type LozengeAppearance =
  | "default"
  | "success"
  | "removed"
  | "inprogress"
  | "new"
  | "moved";

interface LozengeProps extends React.ComponentProps<"span"> {
  appearance?: LozengeAppearance;
  isBold?: boolean;
  maxWidth?: number;
}

function Lozenge({
  appearance = "default",
  isBold = false,
  maxWidth = 200,
  className,
  children,
  ...props
}: LozengeProps) {
  return (
    <span
      data-slot="lozenge"
      data-appearance={appearance}
      data-bold={isBold || undefined}
      className={cn(className)}
      style={{ maxWidth }}
      {...props}
    >
      {children}
    </span>
  );
}

export { Lozenge };
