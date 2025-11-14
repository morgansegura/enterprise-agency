import type { TextBlockData } from "@/lib/blocks";
import { Text } from "@/components/ui/text";

type TextBlockProps = {
  data: TextBlockData;
};

/**
 * TextBlock - Data adapter for Text UI component
 * Content block (leaf node) - cannot have children
 * Wraps ui/Text component with CMS data
 */
export function TextBlock({ data }: TextBlockProps) {
  const { content, size = "base", align = "left", variant = "default" } = data;

  return (
    <Text as="p" size={size} align={align} variant={variant}>
      {content}
    </Text>
  );
}
