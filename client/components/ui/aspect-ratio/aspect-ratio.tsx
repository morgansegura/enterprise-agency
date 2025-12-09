"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import "./aspect-ratio.css";

function AspectRatio({
  className,
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return (
    <AspectRatioPrimitive.Root
      data-slot="aspect-ratio"
      className={className}
      {...props}
    />
  );
}

export { AspectRatio };
