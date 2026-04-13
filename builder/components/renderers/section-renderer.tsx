/**
 * Section Renderer for Builder Canvas
 *
 * CRITICAL: This renderer outputs the SAME HTML structure and data-attributes
 * as the client's section/container components. Both apps share the same
 * CSS (section.css, container.css) so the canvas matches the published site.
 *
 * The only additions are: data-block-key, data-element-type, and isEditing
 * props for the editor overlay (selection, editing, block toolbar).
 */
import type { Section } from "@/lib/hooks/use-pages";
import { cn } from "@/lib/utils";
import { BlockRenderer } from "./block-renderer";
import { getElementClass } from "@enterprise/tokens";

interface SectionRendererProps {
  section: Section;
  breakpoint?: "desktop" | "tablet" | "mobile";
  onBlockChange?: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
    updatedBlock: Section["containers"][0]["blocks"][0],
  ) => void;
  sectionIndex?: number;
  isEditing?: boolean;
}

/**
 * Normalize background to a data-background value.
 * Matches client/components/section-renderer normalizeBackground().
 */
function getDataBackground(
  background: unknown,
  hasStyleBg: boolean,
): string | undefined {
  if (hasStyleBg) return undefined; // Generated CSS handles it
  if (!background || background === "none") return undefined;
  if (typeof background === "string") return background;
  if (typeof background === "object" && background !== null) {
    const bg = background as Record<string, unknown>;
    if (bg.type === "color" && typeof bg.color === "string") {
      return bg.color;
    }
  }
  return undefined;
}

export function SectionRenderer({
  section,
  breakpoint = "desktop",
  onBlockChange,
  sectionIndex = 0,
  isEditing,
}: SectionRendererProps) {
  const containers = section.containers ?? [];
  const styles = section.styles as Record<string, string> | undefined;

  // Skip legacy data-attribute presets when custom CSS styles exist
  const hasCustomPadding =
    styles?.paddingTop != null ||
    styles?.paddingBottom != null ||
    styles?.paddingLeft != null ||
    styles?.paddingRight != null;

  const hasStyleBg = !!styles?.backgroundColor;

  // Legacy preset values (only used when no custom styles)
  const paddingY = hasCustomPadding ? "none" : (section.paddingY as string) || "md";
  const background = getDataBackground(section.background, hasStyleBg);
  const width = (section.width as string) || "full";
  const align = (section.align as string) || "left";

  return (
    <section
      className={cn("section", getElementClass(section._key))}
      // Editor overlay attributes
      data-block-key={section._key}
      data-block-label={`Section ${sectionIndex + 1}`}
      data-element-type="section"
      // Data-attributes — SAME as client Section component
      data-padding-top={paddingY !== "none" ? paddingY : undefined}
      data-padding-bottom={paddingY !== "none" ? paddingY : undefined}
      data-background={background}
      data-width={width !== "container" ? width : undefined}
      data-align={align !== "left" ? align : undefined}
    >
      {containers.map((container, containerIndex) => {
        const containerStyles = container.styles as Record<string, string> | undefined;
        const hasContainerLayout =
          containerStyles?.display ||
          containerStyles?.flexDirection ||
          containerStyles?.gap ||
          containerStyles?.gridTemplateColumns;

        // Container layout from data (legacy preset system)
        const layout = container.layout as Record<string, unknown> | undefined;
        const layoutType = (layout?.type as string) || "stack";
        const layoutGap = (layout?.gap as string) || "md";

        return (
          <div
            key={container._key}
            className={cn("container", getElementClass(container._key))}
            // Editor overlay attributes
            data-block-key={container._key}
            data-block-label={`Container ${containerIndex + 1}`}
            data-element-type="container"
            // Data-attributes — SAME as client Container component
            // Only set when no custom CSS styles override
            data-layout-type={!hasContainerLayout ? layoutType : undefined}
            data-layout-direction={
              !hasContainerLayout && layout?.direction
                ? (layout.direction as string)
                : undefined
            }
            data-layout-gap={!hasContainerLayout ? layoutGap : undefined}
            data-layout-columns={
              !hasContainerLayout && layout?.columns
                ? String(layout.columns)
                : undefined
            }
            data-layout-justify={
              !hasContainerLayout && layout?.justify
                ? (layout.justify as string)
                : undefined
            }
            data-layout-align={
              !hasContainerLayout && layout?.align
                ? (layout.align as string)
                : undefined
            }
            data-padding-x={
              (container.paddingX as string) &&
              (container.paddingX as string) !== "none"
                ? (container.paddingX as string)
                : undefined
            }
          >
            {container.blocks?.map((block, blockIndex) => (
              <BlockRenderer
                key={block._key}
                block={block}
                breakpoint={breakpoint}
                isEditing={isEditing}
                onChange={
                  onBlockChange
                    ? (updatedBlock) =>
                        onBlockChange(
                          sectionIndex,
                          containerIndex,
                          blockIndex,
                          updatedBlock,
                        )
                    : undefined
                }
              />
            ))}
          </div>
        );
      })}
    </section>
  );
}
