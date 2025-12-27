import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type {
  TextElement,
  TextSize,
  FontWeight,
  TextAlign,
  TextVariant,
} from "@/lib/types";
import "./text.css";

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
type Columns = 1 | 2 | 3 | 4;
type ColumnGap = "sm" | "md" | "lg" | "xl";
type OpacityPreset = "10" | "25" | "50" | "75" | "90" | "100";
type ColorPreset =
  | "default"
  | "primary"
  | "secondary"
  | "muted"
  | "accent"
  | "destructive";

type TextProps = {
  children?: React.ReactNode;
  /** The HTML tag to render */
  as?: TextElement;
  /** Text size */
  size?: TextSize;
  /** Font weight */
  weight?: FontWeight;
  /** Text alignment */
  align?: TextAlign;
  /** Text variant/style */
  variant?: TextVariant;
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
  /** Number of columns */
  columns?: Columns;
  /** Column gap */
  columnGap?: ColumnGap;
  /** Opacity preset */
  opacity?: OpacityPreset;
  /** Color preset (overrides variant) */
  color?: ColorPreset;
  /** Enable drop cap styling */
  dropCap?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function Text({
  children,
  as: Component = "p",
  size = "base",
  weight = "normal",
  align = "left",
  variant = "default",
  letterSpacing,
  lineHeight,
  fontStyle,
  textTransform,
  textDecoration,
  whiteSpace,
  maxWidth,
  columns,
  columnGap,
  opacity,
  color,
  dropCap,
  className,
  style,
}: TextProps) {
  return (
    <Component
      className={cn("text", className)}
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
      data-columns={columns}
      data-column-gap={columnGap}
      data-opacity={opacity}
      data-color={color}
      data-drop-cap={dropCap}
      style={style}
    >
      {children}
    </Component>
  );
}
