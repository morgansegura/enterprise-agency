import { cn } from "@/lib/utils";
import type {
  ContainerLayout,
  ContainerMaxWidth,
  BorderSize,
  BorderRadius,
  ShadowSize,
  HorizontalAlign,
  VerticalAlign,
  Spacing,
} from "@/lib/types/section";
import "./container.css";

// Re-export ContainerLayout for external use
export type { ContainerLayout };

// =============================================================================
// Container Props
// =============================================================================

export interface ContainerProps {
  children?: React.ReactNode;
  className?: string;
  /** Layout mode configuration */
  layout?: ContainerLayout;
  /** Max width constraint */
  maxWidth?: ContainerMaxWidth;
  /** Min height */
  minHeight?: "none" | "sm" | "md" | "lg" | "xl";
  /** Horizontal padding */
  paddingX?: Spacing;
  /** Vertical padding */
  paddingY?: Spacing;
  /** All borders */
  border?: BorderSize;
  /** Individual border sides */
  borderTop?: BorderSize;
  borderBottom?: BorderSize;
  borderLeft?: BorderSize;
  borderRight?: BorderSize;
  /** Border color */
  borderColor?: string;
  /** Border radius */
  borderRadius?: BorderRadius;
  /** Box shadow */
  shadow?: ShadowSize;
  /** Content horizontal alignment */
  align?: HorizontalAlign;
  /** Content vertical alignment */
  verticalAlign?: VerticalAlign;
  /** Background color */
  background?: string;
  /** Inline styles for custom backgrounds */
  style?: React.CSSProperties;
}

/**
 * Container Component - Layout wrapper inside Section
 *
 * Handles layout mode (stack/flex/grid) and styling.
 * Used inside Section to create multiple layout regions.
 *
 * Structure:
 * <div.container data-*>
 *   {children}
 * </div>
 */
export function Container({
  children,
  className,
  layout,
  maxWidth = "none",
  minHeight = "none",
  paddingX,
  paddingY,
  border,
  borderTop,
  borderBottom,
  borderLeft,
  borderRight,
  borderColor,
  borderRadius = "none",
  shadow = "none",
  align = "left",
  verticalAlign = "top",
  background,
  style,
}: ContainerProps) {
  // Build inline styles for custom background
  const containerStyle: React.CSSProperties = { ...style };
  if (background && background !== "transparent" && background !== "none") {
    containerStyle.backgroundColor = background;
  }
  if (borderColor) {
    containerStyle.borderColor = borderColor;
  }

  // Resolve border values (all-sides shorthand takes precedence if set)
  const effectiveBorderTop = border || borderTop || "none";
  const effectiveBorderBottom = border || borderBottom || "none";
  const effectiveBorderLeft = border || borderLeft || "none";
  const effectiveBorderRight = border || borderRight || "none";

  return (
    <div
      className={cn("container", className)}
      // Layout attributes
      data-layout-type={layout?.type || "stack"}
      data-layout-direction={layout?.direction}
      data-layout-wrap={layout?.wrap}
      data-layout-gap={layout?.gap}
      data-layout-columns={layout?.columns}
      data-layout-rows={layout?.rows}
      data-layout-justify={layout?.justify}
      data-layout-align={layout?.align}
      // Size attributes
      data-max-width={maxWidth}
      data-min-height={minHeight}
      // Padding attributes
      data-padding-x={paddingX}
      data-padding-y={paddingY}
      // Border attributes
      data-border-top={effectiveBorderTop}
      data-border-bottom={effectiveBorderBottom}
      data-border-left={effectiveBorderLeft}
      data-border-right={effectiveBorderRight}
      data-border-radius={borderRadius}
      // Shadow
      data-shadow={shadow}
      // Content alignment
      data-align={align}
      data-vertical-align={verticalAlign}
      style={
        Object.keys(containerStyle).length > 0 ? containerStyle : undefined
      }
    >
      {children}
    </div>
  );
}
