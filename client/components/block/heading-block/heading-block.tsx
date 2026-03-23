import type { HeadingBlockData } from "@/lib/blocks";
import { Heading } from "@/components/ui/heading";

type HeadingBlockProps = {
  data: HeadingBlockData;
};

// Map opacity number to preset string
function getOpacityPreset(opacity: number | undefined): string | undefined {
  if (opacity === undefined) return undefined;
  if (opacity <= 10) return "10";
  if (opacity <= 25) return "25";
  if (opacity <= 50) return "50";
  if (opacity <= 75) return "75";
  if (opacity <= 90) return "90";
  return "100";
}

/**
 * HeadingBlock - Data adapter for Heading UI component
 *
 * Uses data-attributes for ALL styling (no CSS classes).
 * This ensures clean semantic output matching the builder.
 *
 * TODO: Add responsive support via data-size-md, data-size-lg attributes
 */
export function HeadingBlock({ data }: HeadingBlockProps) {
  const {
    text,
    level = "h2",
    size = "2xl",
    align = "left",
    weight = "semibold",
    variant = "default",
    letterSpacing,
    lineHeight,
    fontStyle,
    textTransform,
    textDecoration,
    color,
    maxWidth,
    whiteSpace,
    opacity,
  } = data;

  const opacityPreset = getOpacityPreset(opacity);

  return (
    <Heading
      as={level}
      size={size}
      align={align}
      weight={weight}
      variant={variant}
      letterSpacing={letterSpacing}
      lineHeight={lineHeight}
      fontStyle={fontStyle}
      textTransform={textTransform}
      textDecoration={textDecoration}
      color={
        color as
          | "default"
          | "primary"
          | "secondary"
          | "muted"
          | "accent"
          | "destructive"
          | undefined
      }
      maxWidth={
        maxWidth as
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "prose"
          | "none"
          | undefined
      }
      whiteSpace={whiteSpace}
      opacity={
        opacityPreset as "10" | "25" | "50" | "75" | "90" | "100" | undefined
      }
    >
      {text}
    </Heading>
  );
}
