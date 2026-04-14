/**
 * Section Renderer for Builder Canvas
 *
 * CRITICAL: This renderer outputs the SAME HTML structure and data-attributes
 * as the client's Section and Container components. Both apps share the same
 * CSS (section.css, container.css, tokens) so the canvas matches the published site.
 *
 * The only additions are: data-block-key, data-block-label, data-element-type
 * for the editor overlay (selection, editing, block toolbar).
 *
 * Every data-attribute and default value here MUST match:
 * - client/components/layout/section/section.tsx
 * - client/components/layout/container/container.tsx
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

// =============================================================================
// Background resolution — mirrors client/components/layout/section/section.tsx
// =============================================================================

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

function resolveBackground(
  background: unknown,
  hasStyleBg: boolean,
): string | undefined {
  // If generated CSS handles background, skip the data-attribute
  if (hasStyleBg) return undefined;

  if (!background) return undefined;

  // String preset
  if (typeof background === "string") {
    if (backgroundPresets.includes(background)) {
      return background !== "none" ? background : undefined;
    }
    return undefined;
  }

  // Object format — only "color" presets get a data attribute
  if (typeof background === "object" && background !== null) {
    const bg = background as Record<string, unknown>;
    if (bg.type === "color" && typeof bg.color === "string") {
      if (backgroundPresets.includes(bg.color)) {
        return bg.color !== "none" ? bg.color : undefined;
      }
    }
  }

  return undefined;
}

// =============================================================================
// Helper: read a property safely
// =============================================================================

function prop(obj: unknown, key: string): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  const val = (obj as Record<string, unknown>)[key];
  if (typeof val === "string" && val && val !== "none") return val;
  return undefined;
}

// =============================================================================
// Section Renderer
// =============================================================================

export function SectionRenderer({
  section,
  breakpoint = "desktop",
  onBlockChange,
  sectionIndex = 0,
  isEditing,
}: SectionRendererProps) {
  const containers = section.containers ?? [];
  const styles = section.styles as Record<string, string> | undefined;
  const sectionAny = section as unknown as Record<string, unknown>;

  // -------------------------------------------------------------------------
  // Section data-attributes — MUST match client Section component defaults
  // -------------------------------------------------------------------------

  // Skip legacy presets when custom CSS styles exist (generated CSS handles it)
  const hasCustomPadding =
    styles?.paddingTop != null ||
    styles?.paddingBottom != null ||
    styles?.paddingLeft != null ||
    styles?.paddingRight != null;

  const hasStyleBg = !!styles?.backgroundColor;

  // Padding: no default — theme CSS variables provide fallback
  const paddingTop = hasCustomPadding
    ? undefined
    : prop(sectionAny, "paddingTop") ||
      prop(sectionAny, "paddingY") ||
      prop(sectionAny, "spacing");
  const paddingBottom = hasCustomPadding
    ? undefined
    : prop(sectionAny, "paddingBottom") ||
      prop(sectionAny, "paddingY") ||
      prop(sectionAny, "spacing");

  // Margin
  const marginTop =
    styles?.marginTop != null
      ? undefined
      : prop(sectionAny, "marginTop");
  const marginBottom =
    styles?.marginBottom != null
      ? undefined
      : prop(sectionAny, "marginBottom");

  // Gap between containers
  const gapY = prop(sectionAny, "gapY");

  // Background
  const background = resolveBackground(sectionAny.background, hasStyleBg);

  // Width — client skips when "container" (default)
  const width = (sectionAny.width as string) || "full";

  // Alignment — client skips when "left" (default)
  const align = prop(sectionAny, "align");

  // Borders
  const borderTop = prop(sectionAny, "borderTop");
  const borderBottom = prop(sectionAny, "borderBottom");
  const borderLeft = prop(sectionAny, "borderLeft");
  const borderRight = prop(sectionAny, "borderRight");
  const borderRadius = prop(sectionAny, "borderRadius");

  // Shadow
  const shadow = prop(sectionAny, "shadow");

  // Min height & vertical align
  const minHeight = prop(sectionAny, "minHeight");
  const verticalAlign = minHeight ? prop(sectionAny, "verticalAlign") : undefined;

  // Overflow
  const overflowX = prop(sectionAny, "overflowX");
  const overflowY = prop(sectionAny, "overflowY");

  // Border color (inline style, same as client)
  const borderColor = sectionAny.borderColor as string | undefined;
  const sectionStyle: React.CSSProperties | undefined = borderColor
    ? { borderColor }
    : undefined;

  return (
    <section
      className={cn("section", getElementClass(section._key))}
      // Editor overlay attributes (builder-only)
      data-block-key={section._key}
      data-block-label={`Section ${sectionIndex + 1}`}
      data-element-type="section"
      // Data-attributes — SAME as client Section component
      data-padding-top={paddingTop}
      data-padding-bottom={paddingBottom}
      data-margin-top={marginTop}
      data-margin-bottom={marginBottom}
      data-gap-y={gapY}
      data-background={background}
      data-width={width !== "container" ? width : undefined}
      data-align={align && align !== "left" ? align : undefined}
      data-border-top={borderTop}
      data-border-bottom={borderBottom}
      data-border-left={borderLeft}
      data-border-right={borderRight}
      data-border-radius={borderRadius}
      data-shadow={shadow}
      data-min-height={minHeight}
      data-vertical-align={verticalAlign}
      data-overflow-x={overflowX}
      data-overflow-y={overflowY}
      style={sectionStyle}
    >
      {containers.map((container, containerIndex) => {
        const containerStyles = container.styles as Record<string, string> | undefined;
        const containerAny = container as unknown as Record<string, unknown>;

        // When custom CSS styles exist, skip legacy data-attributes
        const hasContainerLayout =
          containerStyles?.display ||
          containerStyles?.flexDirection ||
          containerStyles?.gap ||
          containerStyles?.gridTemplateColumns;

        // Container layout from data (legacy preset system)
        const layout = containerAny.layout as Record<string, unknown> | undefined;

        // Container border color (inline style)
        const cBorderColor = containerAny.borderColor as string | undefined;
        const cBackground = containerAny.background as string | undefined;
        const containerStyle: React.CSSProperties = {};
        if (cBorderColor) containerStyle.borderColor = cBorderColor;
        if (cBackground && cBackground !== "transparent" && cBackground !== "none") {
          containerStyle.backgroundColor = cBackground;
        }

        // Resolve border values (all-sides shorthand)
        const cBorder = prop(containerAny, "border");
        const cBorderTop = cBorder || prop(containerAny, "borderTop");
        const cBorderBottom = cBorder || prop(containerAny, "borderBottom");
        const cBorderLeft = cBorder || prop(containerAny, "borderLeft");
        const cBorderRight = cBorder || prop(containerAny, "borderRight");

        return (
          <div
            key={container._key}
            className={cn("container", getElementClass(container._key))}
            // Editor overlay attributes (builder-only)
            data-block-key={container._key}
            data-block-label={`Container ${containerIndex + 1}`}
            data-element-type="container"
            // Layout — SAME as client Container component
            data-layout-type={
              !hasContainerLayout && layout?.type && layout.type !== "stack"
                ? (layout.type as string)
                : undefined
            }
            data-layout-direction={
              !hasContainerLayout ? (layout?.direction as string) || undefined : undefined
            }
            data-layout-wrap={
              !hasContainerLayout ? (layout?.wrap as string) || undefined : undefined
            }
            data-layout-gap={
              !hasContainerLayout ? (layout?.gap as string) || undefined : undefined
            }
            data-layout-columns={
              !hasContainerLayout && layout?.columns
                ? String(layout.columns)
                : undefined
            }
            data-layout-rows={
              !hasContainerLayout && layout?.rows
                ? String(layout.rows)
                : undefined
            }
            data-layout-justify={
              !hasContainerLayout ? (layout?.justify as string) || undefined : undefined
            }
            data-layout-align={
              !hasContainerLayout ? (layout?.align as string) || undefined : undefined
            }
            // Size
            data-max-width={prop(containerAny, "maxWidth")}
            data-min-height={prop(containerAny, "minHeight")}
            // Padding
            data-padding-x={prop(containerAny, "paddingX")}
            data-padding-y={prop(containerAny, "paddingY")}
            // Borders
            data-border-top={cBorderTop}
            data-border-bottom={cBorderBottom}
            data-border-left={cBorderLeft}
            data-border-right={cBorderRight}
            data-border-radius={prop(containerAny, "borderRadius")}
            // Shadow
            data-shadow={prop(containerAny, "shadow")}
            // Alignment
            data-align={prop(containerAny, "align")}
            data-vertical-align={prop(containerAny, "verticalAlign")}
            // Inline styles (background, border color)
            style={
              Object.keys(containerStyle).length > 0
                ? containerStyle
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
