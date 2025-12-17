import { cn } from "@/lib/utils";
import type {
  ContainerElement,
  Spacing,
  BackgroundVariant,
  Width,
  TextAlign,
} from "@/lib/types";
import "@/styles/tokens/section.css";

/**
 * Container settings for inner content
 */
type ContainerSettings = {
  maxWidth?: "narrow" | "container" | "wide" | "full";
  paddingX?: string;
  paddingY?: string;
  paddingTop?: string;
  paddingBottom?: string;
  background?: string;
  borderTop?: "none" | "thin" | "medium" | "thick";
  borderBottom?: "none" | "thin" | "medium" | "thick";
  borderRadius?: string;
  shadow?: string;
  minHeight?: string;
  align?: string;
  verticalAlign?: string;
  layout?: {
    type?: "stack" | "flex" | "grid";
    direction?: "column" | "row";
    gap?: string;
    columns?: number | string;
    justify?: string;
    align?: string;
  };
};

type SectionProps = {
  children?: React.ReactNode;
  /** The HTML tag to render */
  as?: ContainerElement;
  /** Vertical spacing (padding top/bottom) - used when paddingTop/Bottom not set */
  spacing?: Spacing;
  /** Individual padding top */
  paddingTop?: Spacing | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  /** Individual padding bottom */
  paddingBottom?: Spacing | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  /** Background style */
  background?: BackgroundVariant;
  /** Section width constraint */
  width?: Width | "container";
  /** Content alignment */
  align?: Exclude<TextAlign, "justify">;
  /** Border top */
  borderTop?: "none" | "thin" | "medium" | "thick";
  /** Border bottom */
  borderBottom?: "none" | "thin" | "medium" | "thick";
  /** Section shadow */
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "inner";
  /** Min height */
  minHeight?: "none" | "sm" | "md" | "lg" | "xl" | "screen";
  /** Vertical alignment (when minHeight is set) */
  verticalAlign?: "top" | "center" | "bottom";
  /** Container settings */
  container?: ContainerSettings;
  /** Inline styles (for custom backgrounds like gradients/images) */
  style?: React.CSSProperties;
  className?: string;
};

/**
 * Section Component - Token-Driven
 *
 * All styling is controlled via data-* attributes and CSS custom properties.
 * This ensures WYSIWYG parity between builder preview and client render.
 *
 * Structure:
 * <section data-*>          <- Section wrapper (background, padding, border, shadow)
 *   <div.section-container> <- Inner container (max-width, layout, container styles)
 *     {children}
 *   </div>
 * </section>
 */
export function Section({
  children,
  as: Component = "section",
  spacing,
  paddingTop,
  paddingBottom,
  background = "none",
  width = "wide",
  align = "left",
  borderTop = "none",
  borderBottom = "none",
  shadow = "none",
  minHeight = "none",
  verticalAlign = "top",
  container,
  style,
  className,
}: SectionProps) {
  // Effective padding (individual values take precedence over spacing)
  const effectivePaddingTop = paddingTop || spacing || "md";
  const effectivePaddingBottom = paddingBottom || spacing || "md";

  // Build container inline style for custom background
  const containerStyle: React.CSSProperties = {};
  if (container?.background && container.background !== "transparent") {
    containerStyle.backgroundColor = container.background;
  }

  return (
    <Component
      className={cn("section", className)}
      // Section-level data attributes (all styling via CSS)
      data-padding-top={effectivePaddingTop}
      data-padding-bottom={effectivePaddingBottom}
      data-background={background}
      data-width={width}
      data-align={align}
      data-border-top={borderTop}
      data-border-bottom={borderBottom}
      data-shadow={shadow}
      data-min-height={minHeight}
      data-vertical-align={minHeight !== "none" ? verticalAlign : undefined}
      style={style}
    >
      <div
        className="section-container"
        // Container-level data attributes
        data-container-padding-x={container?.paddingX}
        data-container-padding-y={container?.paddingY}
        data-container-padding-top={container?.paddingTop}
        data-container-padding-bottom={container?.paddingBottom}
        data-container-border-top={container?.borderTop}
        data-container-border-bottom={container?.borderBottom}
        data-container-border-radius={container?.borderRadius}
        data-container-shadow={container?.shadow}
        data-container-min-height={container?.minHeight}
        data-container-align={container?.align}
        data-container-vertical-align={container?.verticalAlign}
        // Layout attributes
        data-layout-type={container?.layout?.type || "stack"}
        data-layout-direction={container?.layout?.direction}
        data-layout-gap={container?.layout?.gap}
        data-layout-columns={container?.layout?.columns}
        data-layout-justify={container?.layout?.justify}
        data-layout-align={container?.layout?.align}
        style={
          Object.keys(containerStyle).length > 0 ? containerStyle : undefined
        }
      >
        {children}
      </div>
    </Component>
  );
}
