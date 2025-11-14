import type { HeadingBlockData } from "@/lib/blocks";
import { Heading } from "@/components/ui/heading";

type HeadingBlockProps = {
  data: HeadingBlockData;
};

/**
 * HeadingBlock - Data adapter for Heading UI component
 * Content block (leaf node) - cannot have children
 * Wraps ui/Heading component with CMS data
 */
export function HeadingBlock({ data }: HeadingBlockProps) {
  const {
    text,
    level = "h2",
    size,
    align = "left",
    weight,
    variant = "default",
  } = data;

  return (
    <Heading
      as={level}
      size={size}
      align={align}
      weight={weight}
      variant={variant}
    >
      {text}
    </Heading>
  );
}
