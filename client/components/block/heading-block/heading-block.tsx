import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import type {
  HeadingLevel,
  HeadingSize,
  TextAlign,
  HeadingVariant,
  TextSize,
} from "@/lib/types";
import "./heading-block.css";

/**
 * Data structure for HeadingBlock
 * Used in page JSON data
 */
export type HeadingBlockData = {
  /** Main heading text */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Semantic HTML level (h1-h6) */
  level?: HeadingLevel;
  /** Visual size of heading */
  size?: HeadingSize;
  /** Text alignment */
  align?: TextAlign;
  /** Heading color variant */
  variant?: HeadingVariant;
  /** Subtitle size */
  subtitleSize?: TextSize;
  className?: string;
};

/**
 * HeadingBlock - A block component for page headings
 * Composed of Heading and Text UI components
 */
export function HeadingBlock({
  title,
  subtitle,
  level = "h2",
  size = "2xl",
  align = "left",
  variant = "default",
  subtitleSize = "lg",
  className,
}: HeadingBlockData) {
  return (
    <div className={cn("heading-block", className)} data-align={align}>
      <Heading as={level} size={size} align={align} variant={variant}>
        {title}
      </Heading>

      {subtitle && (
        <Text
          variant="muted"
          size={subtitleSize}
          align={align}
          className="heading-block-subtitle"
        >
          {subtitle}
        </Text>
      )}
    </div>
  );
}
