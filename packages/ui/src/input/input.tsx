import * as React from "react";

import { cn } from "../lib/cn";

import "./input.css";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return <input type={type} className={cn("input", className)} {...props} />;
}

export { Input };
