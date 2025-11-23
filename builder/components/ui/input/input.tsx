import * as React from "react";
import { cn } from "@/lib/utils";
import "./input.css";

function Input({
  className,
  type,
  value,
  ...props
}: React.ComponentProps<"input">) {
  // Only make controlled if value is explicitly provided
  const inputProps = value !== undefined ? { value, ...props } : props;

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(className)}
      {...inputProps}
    />
  );
}

export { Input };
