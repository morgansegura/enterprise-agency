import * as React from "react";

import { cn } from "../lib/cn";

import "./textarea.css";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn("textarea", className)} {...props} />;
}

export { Textarea };
