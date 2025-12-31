"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PanelRightClose,
  PanelRightOpen,
  LayoutTemplate,
  Box,
  Type,
  ChevronDown,
  Layers,
  Palette,
  Move,
  Grid3X3,
  AlignLeft,
  Settings2,
  EyeOff,
} from "lucide-react";
import { useUIStore } from "@/lib/stores/ui-store";
import type {
  Section,
  Container,
  Block,
  SectionBackground,
} from "@/lib/types/section";
import {
  SPACING_OPTIONS,
  EXTENDED_SPACING_OPTIONS,
  CONTAINER_WIDTH_OPTIONS,
  SECTION_MIN_HEIGHT_OPTIONS,
  OVERFLOW_OPTIONS,
  SECTION_WIDTH_OPTIONS,
} from "@/lib/constants";
import { BackgroundEditor } from "@/components/editors";
import { BorderEditor, type BorderValues } from "@/components/editors";
import { VisibilityToggles } from "@/components/ui/visibility-toggles";
import { PositionPicker } from "@/components/ui/position-picker";
import {
  PropertySection,
  PropertyRow,
  PropertyToggle,
  PropertySelect,
} from "./components";
import "./settings-panel.css";

// =============================================================================
// Types
// =============================================================================

interface SettingsPanelProps {
  sections: Section[];
  onSectionChange?: (sectionIndex: number, section: Section) => void;
  onContainerChange?: (
    sectionIndex: number,
    containerIndex: number,
    container: Container,
  ) => void;
  onBlockChange?: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
    block: Block,
  ) => void;
}

type PanelTab = "style" | "settings";

// =============================================================================
// Settings Panel Component
// =============================================================================

export function SettingsPanel({
  sections,
  onSectionChange,
  onContainerChange,
  onBlockChange,
}: SettingsPanelProps) {
  const { rightPanelOpen, rightPanelWidth, selectedElement, toggleRightPanel } =
    useUIStore();

  const [activeTab, setActiveTab] = React.useState<PanelTab>("style");

  // Get the selected element data
  const getSelectedData = React.useCallback(() => {
    if (!selectedElement) return null;

    const section = sections[selectedElement.sectionIndex];
    if (!section) return null;

    if (selectedElement.type === "section") {
      return { type: "section" as const, data: section };
    }

    if (
      selectedElement.type === "container" &&
      selectedElement.containerIndex !== undefined
    ) {
      const container = section.containers?.[selectedElement.containerIndex];
      return container
        ? { type: "container" as const, data: container, section }
        : null;
    }

    if (
      selectedElement.type === "block" &&
      selectedElement.containerIndex !== undefined &&
      selectedElement.blockIndex !== undefined
    ) {
      const container = section.containers?.[selectedElement.containerIndex];
      const block = container?.blocks?.[selectedElement.blockIndex];
      return block
        ? { type: "block" as const, data: block, container, section }
        : null;
    }

    return null;
  }, [sections, selectedElement]);

  const selectedData = getSelectedData();

  // Get icon and title for selected element
  const getElementInfo = () => {
    if (!selectedElement || !selectedData) {
      return { icon: <Layers className="h-4 w-4" />, title: "No Selection" };
    }

    switch (selectedElement.type) {
      case "section":
        return {
          icon: <LayoutTemplate className="h-4 w-4" />,
          title: "Section",
        };
      case "container":
        return { icon: <Box className="h-4 w-4" />, title: "Container" };
      case "block":
        const blockType = (selectedData.data as Block)._type
          .replace("-block", "")
          .replace(/^\w/, (c) => c.toUpperCase());
        return { icon: <Type className="h-4 w-4" />, title: blockType };
      default:
        return { icon: <Layers className="h-4 w-4" />, title: "Element" };
    }
  };

  const { icon, title } = getElementInfo();

  return (
    <div className={cn("settings-panel-wrapper", !rightPanelOpen && "collapsed")}>
      {/* Toggle button when panel is closed */}
      {!rightPanelOpen && (
        <div className="settings-panel-toggle">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRightPanel}
            title="Open settings panel"
          >
            <PanelRightOpen className="h-4 w-4" />
          </Button>
        </div>
      )}

      <aside
        className={cn("settings-panel", rightPanelOpen && "open")}
        style={{ width: rightPanelWidth }}
      >
      {/* Panel Header */}
      <div className="settings-panel-header">
        <div className="settings-panel-selector">
          {icon}
          <span className="settings-panel-selector-name">{title}</span>
          {selectedElement && (
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleRightPanel}
          title="Close panel"
          className="h-7 w-7"
        >
          <PanelRightClose className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="settings-panel-tabs">
        <button
          className={cn(
            "settings-panel-tab",
            activeTab === "style" && "active",
          )}
          onClick={() => setActiveTab("style")}
        >
          Style
        </button>
        <button
          className={cn(
            "settings-panel-tab",
            activeTab === "settings" && "active",
          )}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>

      {/* Panel Content */}
      <div className="settings-panel-content">
        {!selectedElement ? (
          <div className="settings-panel-empty">
            <Layers className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              Select an element to edit
            </p>
          </div>
        ) : selectedData ? (
          <div className="settings-panel-sections">
            {selectedElement.type === "section" && (
              <SectionStyleSettings
                section={selectedData.data as Section}
                onChange={(updated) =>
                  onSectionChange?.(selectedElement.sectionIndex, updated)
                }
                tab={activeTab}
              />
            )}
            {selectedElement.type === "container" && (
              <ContainerStyleSettings
                container={selectedData.data as Container}
                onChange={(updated) =>
                  onContainerChange?.(
                    selectedElement.sectionIndex,
                    selectedElement.containerIndex!,
                    updated,
                  )
                }
                tab={activeTab}
              />
            )}
            {selectedElement.type === "block" && (
              <BlockStyleSettings
                block={selectedData.data as Block}
                onChange={(updated) =>
                  onBlockChange?.(
                    selectedElement.sectionIndex,
                    selectedElement.containerIndex!,
                    selectedElement.blockIndex!,
                    updated,
                  )
                }
                tab={activeTab}
              />
            )}
          </div>
        ) : (
          <div className="settings-panel-empty">
            <p className="text-sm text-muted-foreground">Element not found</p>
          </div>
        )}
      </div>
    </aside>
    </div>
  );
}

// =============================================================================
// Section Style Settings - Webflow-style
// =============================================================================

function SectionStyleSettings({
  section,
  onChange,
  tab,
}: {
  section: Section;
  onChange: (section: Section) => void;
  tab: PanelTab;
}) {
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...section, [field]: value });
  };

  // Get background as object (normalize from string if legacy)
  const getBackground = (): SectionBackground => {
    if (!section.background) return { type: "none" };
    if (typeof section.background === "string") {
      if (section.background === "none") return { type: "none" };
      return { type: "color", color: section.background };
    }
    return section.background;
  };

  const background = getBackground();

  // Width options for toggle
  const widthOptions = [
    { value: "narrow", label: "Narrow" },
    { value: "container", label: "Container" },
    { value: "wide", label: "Wide" },
    { value: "full", label: "Full" },
  ];

  // Settings Tab
  if (tab === "settings") {
    return (
      <>
        {/* Advanced */}
        <PropertySection
          title="Advanced"
          icon={<Settings2 className="h-3.5 w-3.5" />}
        >
          <PropertyRow label="Overflow X">
            <PropertySelect
              value={section.overflowX || section.overflow || "visible"}
              options={OVERFLOW_OPTIONS}
              onChange={(v) => handleChange("overflowX", v)}
            />
          </PropertyRow>
          <PropertyRow label="Overflow Y">
            <PropertySelect
              value={section.overflowY || section.overflow || "visible"}
              options={OVERFLOW_OPTIONS}
              onChange={(v) => handleChange("overflowY", v)}
            />
          </PropertyRow>
          <PropertyRow label="Anchor ID" stacked>
            <Input
              value={section.anchorId || ""}
              onChange={(e) => handleChange("anchorId", e.target.value)}
              placeholder="e.g. hero, features"
              className="settings-input"
            />
          </PropertyRow>
          <PropertyRow label="CSS Classes" stacked>
            <Input
              value={section.customClasses || ""}
              onChange={(e) => handleChange("customClasses", e.target.value)}
              placeholder="e.g. my-class"
              className="settings-input"
            />
          </PropertyRow>
        </PropertySection>

        {/* Visibility */}
        <PropertySection
          title="Visibility"
          icon={<EyeOff className="h-3.5 w-3.5" />}
        >
          <VisibilityToggles
            hideOn={section.hideOn}
            onChange={(hideOn) => handleChange("hideOn", hideOn)}
          />
        </PropertySection>
      </>
    );
  }

  // Style Tab
  return (
    <>
      {/* Layout */}
      <PropertySection
        title="Layout"
        icon={<Grid3X3 className="h-3.5 w-3.5" />}
      >
        <PropertyRow label="Width" stacked>
          <PropertyToggle
            value={section.width || "wide"}
            options={widthOptions}
            onChange={(v) => handleChange("width", v)}
            fullWidth
          />
        </PropertyRow>
        <PropertyRow label="Min Height">
          <PropertySelect
            value={section.minHeight || "none"}
            options={SECTION_MIN_HEIGHT_OPTIONS}
            onChange={(v) => handleChange("minHeight", v)}
          />
        </PropertyRow>
        {section.minHeight && section.minHeight !== "none" && (
          <PropertyRow label="Position" stacked>
            <div className="flex items-center gap-3">
              <PositionPicker
                horizontal={
                  (section.align as "left" | "center" | "right") || "left"
                }
                vertical={
                  (section.verticalAlign as "top" | "center" | "bottom") ||
                  "top"
                }
                onChange={(h, v) => {
                  onChange({
                    ...section,
                    align: h,
                    verticalAlign: v,
                  });
                }}
              />
              <span className="text-xs text-muted-foreground">
                {section.verticalAlign || "top"} / {section.align || "left"}
              </span>
            </div>
          </PropertyRow>
        )}
      </PropertySection>

      {/* Spacing */}
      <PropertySection title="Spacing" icon={<Move className="h-3.5 w-3.5" />}>
        <PropertyRow label="Pad Top">
          <PropertySelect
            value={section.paddingTop || section.paddingY || "md"}
            options={EXTENDED_SPACING_OPTIONS}
            onChange={(v) => handleChange("paddingTop", v)}
          />
        </PropertyRow>
        <PropertyRow label="Pad Bottom">
          <PropertySelect
            value={section.paddingBottom || section.paddingY || "md"}
            options={EXTENDED_SPACING_OPTIONS}
            onChange={(v) => handleChange("paddingBottom", v)}
          />
        </PropertyRow>
        <PropertyRow label="Margin Top">
          <PropertySelect
            value={section.marginTop || "none"}
            options={SPACING_OPTIONS}
            onChange={(v) => handleChange("marginTop", v)}
          />
        </PropertyRow>
        <PropertyRow label="Margin Bot">
          <PropertySelect
            value={section.marginBottom || "none"}
            options={SPACING_OPTIONS}
            onChange={(v) => handleChange("marginBottom", v)}
          />
        </PropertyRow>
        <PropertyRow label="Gap">
          <PropertySelect
            value={section.gapY || "md"}
            options={SPACING_OPTIONS.slice(0, 7)}
            onChange={(v) => handleChange("gapY", v)}
          />
        </PropertyRow>
      </PropertySection>

      {/* Background */}
      <PropertySection
        title="Background"
        icon={<Palette className="h-3.5 w-3.5" />}
        defaultOpen={false}
      >
        <BackgroundEditor
          value={background}
          onChange={(bg) => handleChange("background", bg)}
          showTitle={false}
        />
      </PropertySection>

      {/* Borders & Effects */}
      <PropertySection
        title="Borders"
        icon={<Box className="h-3.5 w-3.5" />}
        defaultOpen={false}
      >
        <BorderEditor
          value={{
            borderTop: section.borderTop,
            borderBottom: section.borderBottom,
            borderLeft: section.borderLeft,
            borderRight: section.borderRight,
            borderColor: section.borderColor,
            borderRadius: section.borderRadius,
            shadow: section.shadow,
          }}
          onChange={(values: Partial<BorderValues>) => {
            Object.entries(values).forEach(([key, value]) => {
              handleChange(key, value);
            });
          }}
          mode="all"
          showShadow={true}
          showTitles={false}
        />
      </PropertySection>
    </>
  );
}

// =============================================================================
// Container Style Settings - Webflow-style
// =============================================================================

function ContainerStyleSettings({
  container,
  onChange,
  tab,
}: {
  container: Container;
  onChange: (container: Container) => void;
  tab: PanelTab;
}) {
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...container, [field]: value });
  };

  const handleLayoutChange = (field: string, value: unknown) => {
    onChange({
      ...container,
      layout: { ...container.layout, [field]: value },
    });
  };

  // Display type options for toggle
  const displayOptions = [
    { value: "stack", label: "Stack" },
    { value: "flex", label: "Flex" },
    { value: "grid", label: "Grid" },
  ];

  // Direction options for toggle
  const directionOptions = [
    { value: "row", label: "Row" },
    { value: "column", label: "Column" },
  ];

  // Alignment options for toggle
  const alignOptions = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
  ];

  // Settings Tab
  if (tab === "settings") {
    return (
      <PropertySection
        title="Advanced"
        icon={<Settings2 className="h-3.5 w-3.5" />}
      >
        <PropertyRow label="Custom Classes" stacked>
          <Input
            value={container.customClasses || ""}
            onChange={(e) => handleChange("customClasses", e.target.value)}
            placeholder="e.g. my-class"
            className="settings-input"
          />
        </PropertyRow>
      </PropertySection>
    );
  }

  // Style Tab
  return (
    <>
      {/* Layout */}
      <PropertySection
        title="Layout"
        icon={<Grid3X3 className="h-3.5 w-3.5" />}
      >
        <PropertyRow label="Display" stacked>
          <PropertyToggle
            value={container.layout?.type || "stack"}
            options={displayOptions}
            onChange={(v) => handleLayoutChange("type", v)}
            fullWidth
          />
        </PropertyRow>

        {container.layout?.type === "flex" && (
          <>
            <PropertyRow label="Direction" stacked>
              <PropertyToggle
                value={container.layout?.direction || "column"}
                options={directionOptions}
                onChange={(v) => handleLayoutChange("direction", v)}
                fullWidth
              />
            </PropertyRow>
            <PropertyRow label="Justify">
              <PropertySelect
                value={container.layout?.justify || "start"}
                options={[
                  { value: "start", label: "Start" },
                  { value: "center", label: "Center" },
                  { value: "end", label: "End" },
                  { value: "between", label: "Between" },
                  { value: "around", label: "Around" },
                ]}
                onChange={(v) => handleLayoutChange("justify", v)}
              />
            </PropertyRow>
            <PropertyRow label="Align">
              <PropertySelect
                value={container.layout?.align || "stretch"}
                options={[
                  { value: "start", label: "Start" },
                  { value: "center", label: "Center" },
                  { value: "end", label: "End" },
                  { value: "stretch", label: "Stretch" },
                ]}
                onChange={(v) => handleLayoutChange("align", v)}
              />
            </PropertyRow>
          </>
        )}

        {container.layout?.type === "grid" && (
          <PropertyRow label="Columns">
            <Input
              type="number"
              min={1}
              max={12}
              value={container.layout?.columns || 2}
              onChange={(e) =>
                handleLayoutChange("columns", parseInt(e.target.value) || 2)
              }
              className="settings-input-sm"
            />
          </PropertyRow>
        )}

        <PropertyRow label="Gap">
          <PropertySelect
            value={container.layout?.gap || "md"}
            options={SPACING_OPTIONS}
            onChange={(v) => handleLayoutChange("gap", v)}
          />
        </PropertyRow>
        <PropertyRow label="Max Width">
          <PropertySelect
            value={container.maxWidth || "none"}
            options={CONTAINER_WIDTH_OPTIONS}
            onChange={(v) => handleChange("maxWidth", v)}
          />
        </PropertyRow>
      </PropertySection>

      {/* Spacing */}
      <PropertySection title="Spacing" icon={<Move className="h-3.5 w-3.5" />}>
        <PropertyRow label="Padding X">
          <PropertySelect
            value={container.paddingX || "none"}
            options={SPACING_OPTIONS}
            onChange={(v) => handleChange("paddingX", v)}
          />
        </PropertyRow>
        <PropertyRow label="Padding Y">
          <PropertySelect
            value={container.paddingY || "none"}
            options={SPACING_OPTIONS}
            onChange={(v) => handleChange("paddingY", v)}
          />
        </PropertyRow>
      </PropertySection>

      {/* Alignment */}
      <PropertySection
        title="Alignment"
        icon={<AlignLeft className="h-3.5 w-3.5" />}
        defaultOpen={false}
      >
        <PropertyRow label="Horizontal" stacked>
          <PropertyToggle
            value={container.align || "left"}
            options={alignOptions}
            onChange={(v) => handleChange("align", v)}
            fullWidth
          />
        </PropertyRow>
      </PropertySection>
    </>
  );
}

// =============================================================================
// Block Style Settings - Webflow-style (Component-centric - different per block type)
// =============================================================================

function BlockStyleSettings({
  block,
  onChange,
  tab,
}: {
  block: Block;
  onChange: (block: Block) => void;
  tab: PanelTab;
}) {
  // Component-centric: different settings per block type
  const blockType = block._type;

  if (tab === "settings") {
    return (
      <PropertySection
        title="Block Info"
        icon={<Settings2 className="h-3.5 w-3.5" />}
      >
        <PropertyRow label="Type">
          <span className="text-sm text-muted-foreground">{blockType}</span>
        </PropertyRow>
        <PropertyRow label="Key">
          <span className="text-xs text-muted-foreground font-mono">
            {block._key}
          </span>
        </PropertyRow>
      </PropertySection>
    );
  }

  // Render type-specific settings
  switch (blockType) {
    case "heading-block":
      return <HeadingBlockSettings block={block} onChange={onChange} />;
    case "text-block":
      return <TextBlockSettings block={block} onChange={onChange} />;
    case "button-block":
      return <ButtonBlockSettings block={block} onChange={onChange} />;
    default:
      return <GenericBlockSettings block={block} onChange={onChange} />;
  }
}

// =============================================================================
// Block Type-Specific Settings - Webflow-style
// =============================================================================

function HeadingBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const handleDataChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...block.data, [field]: value } });
  };

  // Heading level options for toggle
  const levelOptions = [
    { value: "h1", label: "H1" },
    { value: "h2", label: "H2" },
    { value: "h3", label: "H3" },
    { value: "h4", label: "H4" },
    { value: "h5", label: "H5" },
    { value: "h6", label: "H6" },
  ];

  // Alignment options for toggle
  const alignOptions = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
  ];

  return (
    <PropertySection title="Heading" icon={<Type className="h-3.5 w-3.5" />}>
      <PropertyRow label="Level" stacked>
        <PropertyToggle
          value={(block.data?.level as string) || "h2"}
          options={levelOptions}
          onChange={(v) => handleDataChange("level", v)}
          fullWidth
        />
      </PropertyRow>
      <PropertyRow label="Size">
        <PropertySelect
          value={(block.data?.size as string) || "default"}
          options={[
            { value: "xs", label: "XS" },
            { value: "sm", label: "SM" },
            { value: "default", label: "Default" },
            { value: "lg", label: "LG" },
            { value: "xl", label: "XL" },
            { value: "2xl", label: "2XL" },
            { value: "3xl", label: "3XL" },
            { value: "4xl", label: "4XL" },
          ]}
          onChange={(v) => handleDataChange("size", v)}
        />
      </PropertyRow>
      <PropertyRow label="Align" stacked>
        <PropertyToggle
          value={(block.data?.align as string) || "left"}
          options={alignOptions}
          onChange={(v) => handleDataChange("align", v)}
          fullWidth
        />
      </PropertyRow>
    </PropertySection>
  );
}

function TextBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const handleDataChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...block.data, [field]: value } });
  };

  // Alignment options for toggle
  const alignOptions = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
    { value: "justify", label: "Justify" },
  ];

  return (
    <PropertySection title="Text" icon={<Type className="h-3.5 w-3.5" />}>
      <PropertyRow label="Size">
        <PropertySelect
          value={(block.data?.size as string) || "default"}
          options={[
            { value: "xs", label: "XS" },
            { value: "sm", label: "SM" },
            { value: "default", label: "Default" },
            { value: "lg", label: "LG" },
            { value: "xl", label: "XL" },
          ]}
          onChange={(v) => handleDataChange("size", v)}
        />
      </PropertyRow>
      <PropertyRow label="Align" stacked>
        <PropertyToggle
          value={(block.data?.align as string) || "left"}
          options={alignOptions}
          onChange={(v) => handleDataChange("align", v)}
          fullWidth
        />
      </PropertyRow>
    </PropertySection>
  );
}

function ButtonBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const handleDataChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...block.data, [field]: value } });
  };

  // Size options for toggle
  const sizeOptions = [
    { value: "sm", label: "SM" },
    { value: "default", label: "Default" },
    { value: "lg", label: "LG" },
  ];

  return (
    <PropertySection title="Button" icon={<Box className="h-3.5 w-3.5" />}>
      <PropertyRow label="Variant">
        <PropertySelect
          value={(block.data?.variant as string) || "default"}
          options={[
            { value: "default", label: "Default" },
            { value: "secondary", label: "Secondary" },
            { value: "outline", label: "Outline" },
            { value: "ghost", label: "Ghost" },
            { value: "link", label: "Link" },
          ]}
          onChange={(v) => handleDataChange("variant", v)}
        />
      </PropertyRow>
      <PropertyRow label="Size" stacked>
        <PropertyToggle
          value={(block.data?.size as string) || "default"}
          options={sizeOptions}
          onChange={(v) => handleDataChange("size", v)}
          fullWidth
        />
      </PropertyRow>
      <PropertyRow label="URL" stacked>
        <Input
          value={(block.data?.href as string) || ""}
          onChange={(e) => handleDataChange("href", e.target.value)}
          placeholder="https://..."
          className="settings-input"
        />
      </PropertyRow>
    </PropertySection>
  );
}

function GenericBlockSettings({
  block,
  onChange: _onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  return (
    <PropertySection title="Block Data" icon={<Box className="h-3.5 w-3.5" />}>
      <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
        {JSON.stringify(block.data, null, 2)}
      </pre>
    </PropertySection>
  );
}
