import { Section } from "@/components/layout/section";
import { BlockRenderer } from "@/components/block-renderer/block-renderer";
import type { BackgroundVariant, Spacing, Width, TextAlign } from "@/lib/types";
import type { RootBlock } from "@/lib/blocks";

/**
 * Section data structure
 * Sections contain blocks and handle all layout concerns
 */
export type TypedSection = {
  _key: string;
  _type: "section";
  /** Background color */
  background?: BackgroundVariant;
  /** Vertical spacing (padding top/bottom) */
  spacing?: Spacing;
  /** Max width constraint */
  width?: Width;
  /** Content alignment */
  align?: Exclude<TextAlign, "justify">;
  /** Blocks to render inside this section */
  blocks: RootBlock[];
};

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
      {sections.map((section) => (
        <Section
          key={section._key}
          background={section.background}
          spacing={section.spacing}
          width={section.width}
          align={section.align}
        >
          <BlockRenderer blocks={section.blocks} />
        </Section>
      ))}
    </div>
  );
}
