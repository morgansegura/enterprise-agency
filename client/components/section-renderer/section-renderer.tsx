import { Section } from "@/components/layout/section";
import { BlockRenderer } from "@/components/block-renderer/block-renderer";
import type { BackgroundVariant, Spacing, Width, TextAlign } from "@/lib/types";
import type { RootBlock } from "@/lib/blocks";

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
      };
    };

/**
 * Container settings for inner content
 */
export type ContainerSettings = {
  maxWidth?: "narrow" | "container" | "wide" | "full";
  paddingX?: string;
  paddingY?: string;
  background?: string;
  borderRadius?: string;
  shadow?: string;
  layout?: {
    type?: "stack" | "flex" | "grid";
    direction?: "column" | "row";
    gap?: string;
    columns?: number | string;
    justify?: string;
    align?: string;
  };
};

/**
 * Section data structure
 * Sections contain blocks and handle all layout concerns
 */
export type TypedSection = {
  _key: string;
  _type: "section";
  /** Background - can be string (legacy) or object (new) */
  background?: BackgroundVariant | SectionBackground;
  /** Vertical spacing (padding top/bottom) - legacy */
  spacing?: Spacing;
  /** Individual padding top */
  paddingTop?: Spacing | "3xl";
  /** Individual padding bottom */
  paddingBottom?: Spacing | "3xl";
  /** Border top */
  borderTop?: "none" | "thin" | "medium" | "thick";
  /** Border bottom */
  borderBottom?: "none" | "thin" | "medium" | "thick";
  /** Section shadow */
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "inner";
  /** Max width constraint */
  width?: Width;
  /** Content alignment */
  align?: Exclude<TextAlign, "justify">;
  /** Container settings */
  container?: ContainerSettings;
  /** Blocks to render inside this section */
  blocks: RootBlock[];
};

/**
 * Normalize background to data attribute and inline style
 */
function normalizeBackground(
  background?: BackgroundVariant | SectionBackground,
): {
  dataBackground: BackgroundVariant;
  style?: React.CSSProperties;
} {
  if (!background) {
    return { dataBackground: "none" };
  }

  // Legacy string format
  if (typeof background === "string") {
    return { dataBackground: background };
  }

  // New object format
  switch (background.type) {
    case "none":
      return { dataBackground: "none" };
    case "color": {
      // Check if it's a preset color name
      const presetColors: BackgroundVariant[] = [
        "white",
        "gray",
        "dark",
        "primary",
        "secondary",
      ];
      if (presetColors.includes(background.color as BackgroundVariant)) {
        return { dataBackground: background.color as BackgroundVariant };
      }
      // Custom color - use inline style
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
        backgroundRepeat: "no-repeat",
      };
      return { dataBackground: "none", style };
    }
    default:
      return { dataBackground: "none" };
  }
}

/**
 * SectionRenderer - Renders an array of sections
 *
 * Each section is a layout container with:
 * - Background color
 * - Vertical spacing (padding)
 * - Width constraints
 * - Content alignment
 * - Array of blocks to render
 */
type SectionRendererProps = {
  sections: TypedSection[];
  className?: string;
};

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
        const { dataBackground, style } = normalizeBackground(
          section.background,
        );
        // Use individual padding if available, otherwise fallback to spacing
        const effectiveSpacing =
          section.paddingTop || section.paddingBottom
            ? undefined // Will use data-padding-top/bottom instead
            : section.spacing;

        return (
          <Section
            key={section._key}
            background={dataBackground}
            spacing={effectiveSpacing}
            paddingTop={section.paddingTop}
            paddingBottom={section.paddingBottom}
            borderTop={section.borderTop}
            borderBottom={section.borderBottom}
            shadow={section.shadow}
            width={
              (section.container?.maxWidth || section.width) as
                | Width
                | "container"
            }
            align={section.align}
            container={section.container}
            style={style}
          >
            <BlockRenderer blocks={section.blocks} />
          </Section>
        );
      })}
    </div>
  );
}
