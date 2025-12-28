import { Section } from "@/components/layout/section";
import { Container, type ContainerLayout } from "@/components/layout/container";
import { BlockRenderer } from "@/components/block-renderer/block-renderer";
import type { BackgroundVariant, Spacing, Width, TextAlign } from "@/lib/types";
import type { RootBlock } from "@/lib/blocks";

// =============================================================================
// Background Types
// =============================================================================

/**
 * Section background configuration
 * Supports solid colors, gradients, and images
 */
export type SectionBackground =
  | { type: "none" }
  | { type: "color"; color: string }
  | {
      type: "gradient";
      gradient: {
        type: "linear" | "radial";
        angle?: number;
        stops: Array<{ color: string; position: number }>;
      };
    }
  | {
      type: "image";
      image: {
        src: string;
        size?: "cover" | "contain" | "auto";
        position?: string;
        overlay?: string;
        repeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
      };
    };

// =============================================================================
// Container Type
// =============================================================================

/**
 * Container data structure
 * Containers handle layout and contain blocks
 */
export type TypedContainer = {
  _key: string;
  _type: "container";
  // Layout mode
  layout: ContainerLayout;
  // Size
  maxWidth?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "full";
  minHeight?: "none" | "sm" | "md" | "lg" | "xl";
  // Background
  background?: string | SectionBackground;
  // Padding
  paddingX?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  paddingY?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  // Border
  border?: "none" | "thin" | "medium" | "thick";
  borderTop?: "none" | "thin" | "medium" | "thick";
  borderBottom?: "none" | "thin" | "medium" | "thick";
  borderLeft?: "none" | "thin" | "medium" | "thick";
  borderRight?: "none" | "thin" | "medium" | "thick";
  borderColor?: string;
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  // Shadow
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  // Content alignment
  align?: "left" | "center" | "right";
  verticalAlign?: "top" | "center" | "bottom";
  // Blocks
  blocks: RootBlock[];
};

// =============================================================================
// Section Type
// =============================================================================

/**
 * Section data structure
 * Sections are semantic wrappers that contain containers
 */
export type TypedSection = {
  _key: string;
  _type: "section";
  // Semantic HTML element
  as?: "section" | "div" | "article" | "aside" | "header" | "footer";
  // Background
  background?: BackgroundVariant | string | SectionBackground;
  // Spacing - Padding
  paddingY?: Spacing | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  paddingTop?: Spacing | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  paddingBottom?: Spacing | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  // Spacing - Margin
  marginTop?: Spacing | "2xl" | "none";
  marginBottom?: Spacing | "2xl" | "none";
  // Gap between containers
  gapY?: Spacing | "none";
  // Legacy
  spacing?: Spacing;
  // Width
  width?: Width | "container" | "narrow";
  // Border
  borderTop?: "none" | "thin" | "medium" | "thick";
  borderBottom?: "none" | "thin" | "medium" | "thick";
  borderLeft?: "none" | "thin" | "medium" | "thick";
  borderRight?: "none" | "thin" | "medium" | "thick";
  borderColor?: string;
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  // Shadow
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "inner";
  // Min height
  minHeight?: "none" | "sm" | "md" | "lg" | "xl" | "screen";
  verticalAlign?: "top" | "center" | "bottom";
  // Alignment
  align?: Exclude<TextAlign, "justify">;
  // Advanced
  overflow?: "visible" | "hidden" | "scroll" | "auto";
  overflowX?: "visible" | "hidden" | "scroll" | "auto";
  overflowY?: "visible" | "hidden" | "scroll" | "auto";
  // Anchor
  anchorId?: string;
  // Content
  containers: TypedContainer[];
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
 * Normalize background to data attribute and inline style
 */
function normalizeBackground(
  background?: BackgroundVariant | string | SectionBackground,
): {
  dataBackground: BackgroundVariant;
  style?: React.CSSProperties;
} {
  if (!background) {
    return { dataBackground: "none" };
  }

  // Legacy string format
  if (typeof background === "string") {
    if (backgroundPresets.includes(background)) {
      return { dataBackground: background as BackgroundVariant };
    }
    // Custom color string
    return { dataBackground: "none", style: { backgroundColor: background } };
  }

  // New object format
  switch (background.type) {
    case "none":
      return { dataBackground: "none" };
    case "color": {
      if (backgroundPresets.includes(background.color)) {
        return { dataBackground: background.color as BackgroundVariant };
      }
      return {
        dataBackground: "none",
        style: { backgroundColor: background.color },
      };
    }
    case "gradient": {
      const { gradient } = background;
      const stops = gradient.stops
        .map((s) => `${s.color} ${s.position}%`)
        .join(", ");
      const gradientCss =
        gradient.type === "linear"
          ? `linear-gradient(${gradient.angle || 180}deg, ${stops})`
          : `radial-gradient(circle, ${stops})`;
      return {
        dataBackground: "none",
        style: { background: gradientCss },
      };
    }
    case "image": {
      const { image } = background;
      const style: React.CSSProperties = {
        backgroundImage: `url(${image.src})`,
        backgroundSize: image.size || "cover",
        backgroundPosition: image.position || "center",
        backgroundRepeat: image.repeat || "no-repeat",
      };
      return { dataBackground: "none", style };
    }
    default:
      return { dataBackground: "none" };
  }
}

/**
 * Get container background style
 */
function getContainerBackgroundStyle(
  background?: string | SectionBackground,
): React.CSSProperties | undefined {
  if (!background) return undefined;

  if (typeof background === "string") {
    if (background === "none" || background === "transparent") return undefined;
    return { backgroundColor: background };
  }

  if (background.type === "color" && background.color) {
    return { backgroundColor: background.color };
  }

  if (background.type === "gradient" && background.gradient) {
    const { gradient } = background;
    const stops = gradient.stops
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ");
    const gradientCss =
      gradient.type === "linear"
        ? `linear-gradient(${gradient.angle || 180}deg, ${stops})`
        : `radial-gradient(circle, ${stops})`;
    return { background: gradientCss };
  }

  if (background.type === "image" && background.image) {
    return {
      backgroundImage: `url(${background.image.src})`,
      backgroundSize: background.image.size || "cover",
      backgroundPosition: background.image.position || "center",
      backgroundRepeat: background.image.repeat || "no-repeat",
    };
  }

  return undefined;
}

// =============================================================================
// Section Renderer
// =============================================================================

type SectionRendererProps = {
  sections: TypedSection[];
  className?: string;
};

/**
 * SectionRenderer - Renders an array of sections
 *
 * Structure:
 * Section (semantic wrapper)
 * ├── Container 1 (layout wrapper)
 * │   └── Blocks
 * ├── Container 2 (layout wrapper)
 * │   └── Blocks
 * └── ...
 */
export function SectionRenderer({ sections, className }: SectionRendererProps) {
  if (!sections || sections.length === 0) {
    return (
      <div className={className}>
        <p className="text-gray-500 text-center py-8">
          No content yet. Add some sections to get started!
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {sections.map((section) => {
        const { dataBackground, style: sectionStyle } = normalizeBackground(
          section.background,
        );

        // Build section inline style
        const combinedStyle: React.CSSProperties = { ...sectionStyle };
        if (section.borderColor) {
          combinedStyle.borderColor = section.borderColor;
        }

        return (
          <Section
            key={section._key}
            as={section.as}
            // Background
            background={dataBackground}
            style={
              Object.keys(combinedStyle).length > 0 ? combinedStyle : undefined
            }
            // Padding
            paddingY={section.paddingY}
            paddingTop={section.paddingTop}
            paddingBottom={section.paddingBottom}
            spacing={section.spacing}
            // Margin
            marginTop={section.marginTop}
            marginBottom={section.marginBottom}
            // Gap between containers
            gapY={section.gapY}
            // Width
            width={section.width}
            // Borders
            borderTop={section.borderTop}
            borderBottom={section.borderBottom}
            borderLeft={section.borderLeft}
            borderRight={section.borderRight}
            borderColor={section.borderColor}
            borderRadius={section.borderRadius}
            // Shadow
            shadow={section.shadow}
            // Min height
            minHeight={section.minHeight}
            verticalAlign={section.verticalAlign}
            // Alignment
            align={section.align}
            // Overflow
            overflowX={section.overflowX}
            overflowY={section.overflowY}
            // Anchor
            anchorId={section.anchorId}
          >
            {section.containers?.map((container) => (
              <Container
                key={container._key}
                // Layout
                layout={container.layout}
                // Size
                maxWidth={container.maxWidth}
                minHeight={container.minHeight}
                // Padding
                paddingX={container.paddingX}
                paddingY={container.paddingY}
                // Border
                border={container.border}
                borderTop={container.borderTop}
                borderBottom={container.borderBottom}
                borderLeft={container.borderLeft}
                borderRight={container.borderRight}
                borderColor={container.borderColor}
                borderRadius={container.borderRadius}
                // Shadow
                shadow={container.shadow}
                // Alignment
                align={container.align}
                verticalAlign={container.verticalAlign}
                // Background
                style={getContainerBackgroundStyle(container.background)}
              >
                <BlockRenderer blocks={container.blocks} />
              </Container>
            ))}
          </Section>
        );
      })}
    </div>
  );
}
