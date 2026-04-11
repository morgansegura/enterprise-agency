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
      data-layout-type={layout?.type && layout.type !== "stack" ? layout.type : undefined}
      data-layout-direction={layout?.direction || undefined}
      data-layout-wrap={layout?.wrap || undefined}
      data-layout-gap={layout?.gap || undefined}
      data-layout-columns={layout?.columns || undefined}
      data-layout-rows={layout?.rows || undefined}
      data-layout-justify={layout?.justify || undefined}
      data-layout-align={layout?.align || undefined}
      data-max-width={maxWidth && maxWidth !== "none" ? maxWidth : undefined}
      data-min-height={minHeight && minHeight !== "none" ? minHeight : undefined}
      data-padding-x={paddingX && paddingX !== "none" ? paddingX : undefined}
      data-padding-y={paddingY && paddingY !== "none" ? paddingY : undefined}
      data-border-top={effectiveBorderTop && effectiveBorderTop !== "none" ? effectiveBorderTop : undefined}
      data-border-bottom={effectiveBorderBottom && effectiveBorderBottom !== "none" ? effectiveBorderBottom : undefined}
      data-border-left={effectiveBorderLeft && effectiveBorderLeft !== "none" ? effectiveBorderLeft : undefined}
      data-border-right={effectiveBorderRight && effectiveBorderRight !== "none" ? effectiveBorderRight : undefined}
      data-border-radius={borderRadius && borderRadius !== "none" ? borderRadius : undefined}
      data-shadow={shadow && shadow !== "none" ? shadow : undefined}
      data-align={align && align !== "left" ? align : undefined}
      data-vertical-align={verticalAlign || undefined}
      style={
        Object.keys(containerStyle).length > 0 ? containerStyle : undefined
      }
    >
      {children}
    </div>
  );
}
