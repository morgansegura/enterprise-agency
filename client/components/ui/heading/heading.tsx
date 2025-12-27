import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type {
  HeadingLevel,
  HeadingSize,
  FontWeight,
  TextAlign,
  HeadingVariant,
} from "@/lib/types";
import "./heading.css";

type LetterSpacing =
  | "tighter"
  | "tight"
  | "normal"
  | "wide"
  | "wider"
  | "widest";
type LineHeight = "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";
type FontStyle = "normal" | "italic";
type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";
type TextDecoration = "none" | "underline" | "line-through";
type WhiteSpace = "normal" | "nowrap" | "pre-wrap";
type MaxWidthPreset =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "prose"
  | "none";
type OpacityPreset = "10" | "25" | "50" | "75" | "90" | "100";
type ColorPreset =
  | "default"
  | "primary"
  | "secondary"
  | "muted"
  | "accent"
  | "destructive";

type HeadingProps = {
  children?: React.ReactNode;
  /** The HTML tag to render (h1-h6) - semantic level */
  as?: HeadingLevel;
  /** Visual size - can differ from semantic level */
  size?: HeadingSize;
  /** Font weight */
  weight?: FontWeight;
  /** Text alignment */
  align?: TextAlign;
  /** Text color variant */
  variant?: HeadingVariant;
  /** Letter spacing */
  letterSpacing?: LetterSpacing;
  /** Line height */
  lineHeight?: LineHeight;
  /** Font style */
  fontStyle?: FontStyle;
  /** Text transform */
  textTransform?: TextTransform;
  /** Text decoration */
  textDecoration?: TextDecoration;
  /** White space handling */
  whiteSpace?: WhiteSpace;
  /** Max width preset */
  maxWidth?: MaxWidthPreset;
  /** Opacity preset */
  opacity?: OpacityPreset;
  /** Color preset (overrides variant) */
  color?: ColorPreset;
  className?: string;
  style?: CSSProperties;
};

export function Heading({
  children,
  as: Component = "h2",
  size = "lg",
  weight = "bold",
  align = "left",
  variant = "default",
  letterSpacing,
  lineHeight,
  fontStyle,
  textTransform,
  textDecoration,
  whiteSpace,
  maxWidth,
  opacity,
  color,
  className,
  style,
}: HeadingProps) {
  return (
    <Component
      className={cn("heading", className)}
      data-size={size}
      data-weight={weight}
      data-align={align}
      data-variant={variant}
      data-letter-spacing={letterSpacing}
      data-line-height={lineHeight}
      data-font-style={fontStyle}
      data-text-transform={textTransform}
      data-text-decoration={textDecoration}
      data-white-space={whiteSpace}
      data-max-width={maxWidth}
      data-opacity={opacity}
      data-color={color}
      style={style}
    >
      {children}
    </Component>
  );
}
