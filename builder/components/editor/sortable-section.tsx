"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Pencil,
  LayoutGrid,
  Copy,
  Heart,
  ChevronUp,
  ChevronDown,
  Trash2,
  Layers,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Section } from "@/lib/hooks/use-pages";
import { SectionSettingsPopover } from "./section-settings-popover";
import { AddBlockPopover } from "./add-block-popover";
import { LayersPopover } from "./layers-popover";

import "./sortable-section.css";

// Helper to safely get extended section properties
function getSectionProp<T>(section: Section, key: string, defaultValue: T): T {
  return ((section as unknown as Record<string, unknown>)[key] as T) ?? defaultValue;
}

interface SortableSectionProps {
  section: Section;
  onSectionChange: (section: Section) => void;
  onDelete: () => void;
  onAddSectionAbove?: () => void;
  onAddSectionBelow?: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onAddBlock?: (blockType: string) => void;
  selectedBlockKey?: string | null;
  onSelectBlock?: (key: string) => void;
  hoveredBlockKey?: string | null;
  onHoverBlock?: (key: string | null) => void;
  isFirst?: boolean;
  isLast?: boolean;
  children: React.ReactNode;
}

/**
 * Sortable Section Component
 *
 * Wraps a section with drag-and-drop functionality and section-level controls.
 * Renders content exactly as it will appear on the live site (WYSIWYG).
 *
 * Features:
 * - ADD SECTION buttons above/below on hover (overlaid)
 * - Floating action panel on right side
 * - Settings popover with tabs
 * - Visual feedback during dragging
 */
export function SortableSection({
  section,
  onSectionChange,
  onDelete,
  onAddSectionAbove,
  onAddSectionBelow,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onAddBlock,
  selectedBlockKey,
  onSelectBlock,
  hoveredBlockKey,
  onHoverBlock,
  isFirst = false,
  isLast = false,
  children,
}: SortableSectionProps) {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: section._key,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Map spacing values to CSS classes
  const spacingClasses: Record<string, string> = {
    none: "",
    xs: "py-2",
    sm: "py-4",
    md: "py-8",
    lg: "py-12",
    xl: "py-16",
    "2xl": "py-24",
  };

  // Map width values to CSS classes
  const widthClasses: Record<string, string> = {
    narrow: "max-w-3xl mx-auto px-4",
    container: "max-w-5xl mx-auto px-4",
    wide: "max-w-7xl mx-auto px-4",
    full: "w-full",
  };

  // Map height values to CSS classes
  const heightClasses: Record<string, string> = {
    auto: "",
    sm: "min-h-[200px]",
    md: "min-h-[400px]",
    lg: "min-h-[600px]",
  };

  // Map alignment values to CSS classes
  const alignClasses: Record<string, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  };

  // Map text color values to CSS classes
  const textColorClasses: Record<string, string> = {
    default: "",
    light: "text-white",
    dark: "text-gray-900",
    primary: "text-(--primary)",
    muted: "text-(--muted-foreground)",
  };

  // Map heading color values to CSS classes
  const headingColorClasses: Record<string, string> = {
    default: "",
    light: "[&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white",
    dark: "[&_h1]:text-gray-900 [&_h2]:text-gray-900 [&_h3]:text-gray-900 [&_h4]:text-gray-900",
    primary: "[&_h1]:text-(--primary) [&_h2]:text-(--primary) [&_h3]:text-(--primary) [&_h4]:text-(--primary)",
    accent: "[&_h1]:text-(--accent) [&_h2]:text-(--accent) [&_h3]:text-(--accent) [&_h4]:text-(--accent)",
  };

  // Map link color values to CSS classes
  const linkColorClasses: Record<string, string> = {
    primary: "[&_a]:text-(--primary)",
    secondary: "[&_a]:text-(--secondary)",
    accent: "[&_a]:text-(--accent)",
    inherit: "",
  };

  // Get section properties
  const sectionSpacing = spacingClasses[section.spacing || "md"] || spacingClasses.md;
  const sectionWidth = widthClasses[section.width || "wide"] || "";
  const sectionHeight = heightClasses[getSectionProp(section, "height", "auto")] || "";
  const sectionAlign = alignClasses[getSectionProp(section, "align", "center")] || "";
  const fillScreen = getSectionProp(section, "fillScreen", false);
  const heightValue = getSectionProp(section, "heightValue", 10);

  // Background settings
  const backgroundType = section.background || "none";
  const bgColor = getSectionProp<string>(section, "bgColor", "muted");
  const customBgColor = getSectionProp<string>(section, "customBgColor", "");
  const bgImage = getSectionProp<string>(section, "bgImage", "");
  const bgVideo = getSectionProp<string>(section, "bgVideo", "");
  const overlay = getSectionProp<boolean>(section, "overlay", false);
  const overlayOpacity = getSectionProp<number>(section, "overlayOpacity", 50);

  // Color settings
  const textColor = textColorClasses[getSectionProp(section, "textColor", "default")] || "";
  const headingColor = headingColorClasses[getSectionProp(section, "headingColor", "default")] || "";
  const linkColor = linkColorClasses[getSectionProp(section, "linkColor", "primary")] || "";
  const invertColors = getSectionProp(section, "invertColors", false);

  // Build background class based on type
  const bgColorClasses: Record<string, string> = {
    primary: "bg-(--primary)",
    secondary: "bg-(--secondary)",
    accent: "bg-(--accent)",
    muted: "bg-(--muted)",
    card: "bg-(--card)",
    custom: "",
  };

  const getBackgroundClass = () => {
    if (backgroundType === "color") {
      return bgColorClasses[bgColor] || "";
    }
    return "";
  };

  // Build inline styles for custom backgrounds
  const getBackgroundStyle = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};

    if (backgroundType === "color" && bgColor === "custom" && customBgColor) {
      styles.backgroundColor = customBgColor;
    }

    if (backgroundType === "image" && bgImage) {
      styles.backgroundImage = `url(${bgImage})`;
      styles.backgroundSize = "cover";
      styles.backgroundPosition = "center";
    }

    if (fillScreen) {
      styles.minHeight = `${heightValue}vh`;
    }

    return styles;
  };

  // Check if any block in this section is selected
  const hasSelectedBlock = selectedBlockKey
    ? section.blocks.some((block) => block._key === selectedBlockKey)
    : false;

  // Track when settings popover is open to keep hover state visible
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        ...getBackgroundStyle(),
      }}
      className={cn(
        "sortable-section",
        isDragging && "is-dragging",
        hasSelectedBlock && "has-selected-block",
        settingsOpen && "is-settings-open",
        getBackgroundClass(),
        sectionHeight,
        textColor,
        headingColor,
        linkColor,
        invertColors && "dark",
      )}
    >
      {/* Video Background */}
      {backgroundType === "video" && bgVideo && (
        <video
          className="section-video-bg"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
      )}

      {/* Overlay for image/video backgrounds */}
      {(backgroundType === "image" || backgroundType === "video") && overlay && (
        <div
          className="section-overlay"
          style={{ opacity: overlayOpacity / 100 }}
        />
      )}

      {/* Section Content with border */}
      <div className={cn("section-content", sectionAlign && "flex flex-col", sectionAlign)}>
        {/* Layers Button - Left side (always visible) */}
        <LayersPopover
          blocks={section.blocks}
          selectedBlockKey={selectedBlockKey ?? null}
          onSelectBlock={onSelectBlock ?? (() => {})}
          onHoverBlock={onHoverBlock}
        >
          <button className="section-drag-handle" aria-label="View layers">
            <Layers className="h-5 w-5" />
          </button>
        </LayersPopover>

        {/* Section controls - hidden when a block is selected */}
        {!hasSelectedBlock && (
          <>
            {/* ADD SECTION - Above (overlaid) - hidden for first section */}
            {onAddSectionAbove && !isFirst ? (
              <div className="section-add-above">
                <Button
                  variant="default"
                  size="sm"
                  onClick={onAddSectionAbove}
                  className="section-add-btn"
                >
                  Add Section
                </Button>
              </div>
            ) : null}

            {/* ADD SECTION - Below (overlaid) */}
            {onAddSectionBelow ? (
              <div className="section-add-below">
                <Button
                  variant="default"
                  size="sm"
                  onClick={onAddSectionBelow}
                  className="section-add-btn"
                >
                  Add Section
                </Button>
              </div>
            ) : null}

            {/* Add Block Button - Top left */}
            <div className="section-add-block">
              <AddBlockPopover onAddBlock={onAddBlock ?? (() => {})}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  ADD BLOCK
                </Button>
              </AddBlockPopover>
            </div>

            {/* Floating Action Panel - Right side */}
            <div className="section-panel">
              {/* Edit Section */}
              <SectionSettingsPopover
                section={section}
                onChange={onSectionChange}
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="section-panel-item"
                >
                  <Pencil className="h-4 w-4" />
                  <span>EDIT SECTION</span>
                </Button>
              </SectionSettingsPopover>

              {/* View Layouts */}
              <Button variant="ghost" size="sm" className="section-panel-item">
                <LayoutGrid className="h-4 w-4" />
                <span>VIEW LAYOUTS</span>
              </Button>

              {/* Quick Actions Row */}
              <div className="section-panel-row">
                {onDuplicate && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onDuplicate}
                    title="Duplicate"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon-sm" title="Favorite">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onMoveUp}
                  title="Move up"
                  disabled={isFirst}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onMoveDown}
                  title="Move down"
                  disabled={isLast}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              {/* Remove */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="section-panel-item section-panel-delete"
              >
                <Trash2 className="h-4 w-4" />
                <span>REMOVE</span>
              </Button>
            </div>
          </>
        )}

        {/* Section Inner Content - renders exactly as live site */}
        <div className={cn("section-inner", sectionSpacing, sectionWidth)}>
          {children}
        </div>
      </div>
    </div>
  );
}
