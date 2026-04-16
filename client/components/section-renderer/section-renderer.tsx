import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import {
  BlockRenderer,
  resetImagePriority,
} from "@/components/block-renderer/block-renderer";
import type {
  Section as SectionType,
} from "@/lib/types/section";
import type { RootBlock } from "@/lib/blocks";
import { getElementClass } from "@enterprise/tokens";

/** @deprecated Use Section from @/lib/types/section instead */
export type TypedSection = SectionType;

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
        const sectionClass = getElementClass(section._key);
        const Tag = section.as || "section";
        return (
          <Tag
            key={section._key}
            className={cn("section", sectionClass)}
            id={section.anchorId || undefined}
          >
            {section.containers?.map((container) => (
              <Container
                key={container._key}
                className={getElementClass(container._key)}
              >
                <BlockRenderer blocks={container.blocks as RootBlock[]} />
              </Container>
            ))}
          </Tag>
        );
      })}
    </div>
  );
}
