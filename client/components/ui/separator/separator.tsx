"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import "./separator.css";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={className}
      {...props}
    />
  );
}

export { Separator };
