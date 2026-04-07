import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import {
  BlockRenderer,
  resetImagePriority,
} from "@/components/block-renderer/block-renderer";
import type { BackgroundVariant } from "@/lib/types";
import type {
  Section as SectionType,
  Container as ContainerType,
} from "@/lib/types/section";
import type { SectionBackground } from "@/lib/types/section";
import type { RootBlock } from "@/lib/blocks";
import { getElementClass } from "@enterprise/tokens";

// Re-export types for external use
export type { SectionBackground };

/** @deprecated Use Section from @/lib/types/section instead */
export type TypedSection = SectionType;

/** @deprecated Use Container from @/lib/types/section instead */
export type TypedContainer = ContainerType;

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
 * Resolve background to a data-background attribute value.
 * Visual styling (colors, gradients, images) is handled by the
 * generated page stylesheet — this only determines the preset
 * attribute for structural concerns like text color.
 */
function normalizeBackground(
  background?: BackgroundVariant | string | SectionBackground,
): { dataBackground: BackgroundVariant } {
  if (!background) {
    return { dataBackground: "none" };
  }

  // String preset: "primary", "dark", etc.
  if (typeof background === "string") {
    if (backgroundPresets.includes(background)) {
      return { dataBackground: background as BackgroundVariant };
    }
    return { dataBackground: "none" };
  }

  // Object format — only "color" presets get a data attribute
  if (background.type === "color" && background.color) {
    if (backgroundPresets.includes(background.color)) {
      return { dataBackground: background.color as BackgroundVariant };
    }
  }

  return { dataBackground: "none" };
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

  // Reset LCP image priority tracker for this page render
  resetImagePriority();

  return (
    <div className={className}>
      {sections.map((section) => {
        // Generated CSS class — visual styles come from <style id="page-styles">
        const sectionClass = getElementClass(section._key);

        // Data-background is only used when there are NO element styles
        // overriding the background. The generated CSS handles both cases,
        // but we keep data-background for structural presets that set text color.
        const hasElementBg = !!(section as SectionType & { styles?: Record<string, string> }).styles?.backgroundColor;
        const { dataBackground } = hasElementBg
          ? { dataBackground: "none" as BackgroundVariant }
          : normalizeBackground(section.background);

        return (
          <Section
            key={section._key}
            as={section.as}
            className={sectionClass}
            // Background preset (structural: sets text color)
            background={dataBackground}
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
            // Borders (structural presets)
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
                className={getElementClass(container._key)}
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
              >
                <BlockRenderer blocks={container.blocks as RootBlock[]} />
              </Container>
            ))}
          </Section>
        );
      })}
    </div>
  );
}
