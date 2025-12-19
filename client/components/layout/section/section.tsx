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
 * Background object for advanced backgrounds (gradient, image)
 */
type SectionBackground = {
  type: "none" | "color" | "gradient" | "image";
  color?: string;
  gradient?: {
    type: "linear" | "radial";
    angle?: number;
    stops: Array<{ color: string; position: number }>;
  };
  image?: {
    src: string;
    alt?: string;
    position?: string;
    size?: "cover" | "contain" | "auto";
    repeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
    overlay?: string;
  };
};

/**
 * Background presets that map to data-background attribute values
 */
const backgroundPresets = [
  "none",
  "white",
  "gray",
  "dark",
  "primary",
  "secondary",
  "muted",
  "accent",
];

/**
 * Generate background styles from SectionBackground object
 */
function getBackgroundStyles(background?: string | SectionBackground): {
  dataBackground: string;
  style: React.CSSProperties;
} {
  if (!background) {
    return { dataBackground: "none", style: {} };
  }

  // Legacy string format - check if it's a preset
  if (typeof background === "string") {
    if (backgroundPresets.includes(background)) {
      return { dataBackground: background, style: {} };
    }
    // Custom color string
    return { dataBackground: "none", style: { backgroundColor: background } };
  }

  // Object format
  switch (background.type) {
    case "none":
      return { dataBackground: "none", style: {} };

    case "color":
      if (background.color && backgroundPresets.includes(background.color)) {
        return { dataBackground: background.color, style: {} };
      }
      return {
        dataBackground: "none",
        style: { backgroundColor: background.color || "transparent" },
      };

    case "gradient":
      if (background.gradient) {
        const { type, angle, stops } = background.gradient;
        const stopStr = stops
          .map((s) => `${s.color} ${s.position}%`)
          .join(", ");
        const gradientCss =
          type === "linear"
            ? `linear-gradient(${angle || 180}deg, ${stopStr})`
            : `radial-gradient(circle, ${stopStr})`;
        return { dataBackground: "none", style: { background: gradientCss } };
      }
      return { dataBackground: "none", style: {} };

    case "image":
      if (background.image?.src) {
        const imageStyle: React.CSSProperties = {
          backgroundImage: `url(${background.image.src})`,
          backgroundSize: background.image.size || "cover",
          backgroundPosition: background.image.position || "center",
          backgroundRepeat: background.image.repeat || "no-repeat",
        };
        return { dataBackground: "none", style: imageStyle };
      }
      return { dataBackground: "none", style: {} };

    default:
      return { dataBackground: "none", style: {} };
  }
}

type SectionProps = {
  children?: React.ReactNode;
  /** The HTML tag to render */
  as?: ContainerElement;
  /** Vertical spacing (padding top/bottom) - used when paddingTop/Bottom not set */
  spacing?: Spacing;
  /** Vertical padding */
  paddingY?: Spacing | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  /** Individual padding top */
  paddingTop?: Spacing | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  /** Individual padding bottom */
  paddingBottom?: Spacing | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  /** Gap between containers */
  gapY?: Spacing | "none";
  /** Background style */
  background?: BackgroundVariant | string | SectionBackground;
  /** Section width constraint */
  width?: Width | "container" | "narrow";
  /** Content alignment */
  align?: Exclude<TextAlign, "justify">;
  /** Border top */
  borderTop?: "none" | "thin" | "medium" | "thick";
  /** Border bottom */
  borderBottom?: "none" | "thin" | "medium" | "thick";
  /** Border color */
  borderColor?: string;
  /** Section shadow */
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "inner";
  /** Min height */
  minHeight?: "none" | "sm" | "md" | "lg" | "xl" | "screen";
  /** Vertical alignment (when minHeight is set) */
  verticalAlign?: "top" | "center" | "bottom";
  /** Anchor ID for in-page linking */
  anchorId?: string;
  /** Inline styles (for custom backgrounds) */
  style?: React.CSSProperties;
  className?: string;
};

/**
 * Section Component - Semantic wrapper for page content
 *
 * All styling is controlled via data-* attributes and CSS custom properties.
 * This ensures WYSIWYG parity between builder preview and client render.
 *
 * Structure:
 * <section data-*>          <- Section wrapper (semantic, background, padding)
 *   {containers/children}   <- Container components with blocks
 * </section>
 */
export function Section({
  children,
  as: Component = "section",
  spacing,
  paddingY,
  paddingTop,
  paddingBottom,
  gapY,
  background = "none",
  width = "full",
  align = "left",
  borderTop = "none",
  borderBottom = "none",
  borderColor,
  shadow = "none",
  minHeight = "none",
  verticalAlign = "top",
  anchorId,
  style,
  className,
}: SectionProps) {
  // Effective padding (paddingY > individual values > spacing)
  const effectivePaddingTop = paddingTop || paddingY || spacing || "md";
  const effectivePaddingBottom = paddingBottom || paddingY || spacing || "md";

  // Get background styles
  const { dataBackground, style: bgStyle } = getBackgroundStyles(background);

  // Build inline style
  const sectionStyle: React.CSSProperties = {
    ...bgStyle,
    ...style,
  };
  if (borderColor) {
    sectionStyle.borderColor = borderColor;
  }

  return (
    <Component
      id={anchorId}
      className={cn("section", className)}
      // Section-level data attributes (all styling via CSS)
      data-padding-top={effectivePaddingTop}
      data-padding-bottom={effectivePaddingBottom}
      data-gap-y={gapY}
      data-background={dataBackground}
      data-width={width}
      data-align={align}
      data-border-top={borderTop}
      data-border-bottom={borderBottom}
      data-shadow={shadow}
      data-min-height={minHeight}
      data-vertical-align={minHeight !== "none" ? verticalAlign : undefined}
      style={Object.keys(sectionStyle).length > 0 ? sectionStyle : undefined}
    >
      {children}
    </Component>
  );
}
