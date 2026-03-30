"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpacingBox } from "@/components/editor/style-panel";
import {
  PanelRightOpen,
  Box,
  Layers,
  Palette,
  Move,
  Grid3X3,
  Settings2,
  EyeOff,
  Plus,
} from "lucide-react";
import { useUIStore } from "@/lib/stores/ui-store";
import { useCurrentBreakpoint } from "@/lib/responsive/context";
import { getResponsiveValue, setResponsiveOverride } from "@/lib/responsive";
import type {
  Section,
  Container,
  Block,
  SectionBackground,
} from "@/lib/types/section";
import {
  SPACING_OPTIONS,
  CONTAINER_WIDTH_OPTIONS,
  SECTION_MIN_HEIGHT_OPTIONS,
  OVERFLOW_OPTIONS,
  BORDER_WIDTH_OPTIONS,
  BORDER_RADIUS_OPTIONS,
  SHADOW_OPTIONS,
} from "@/lib/constants";
import { BackgroundEditor } from "@/components/editors";
import { VisibilityToggles } from "@/components/ui/visibility-toggles";
import { PositionPicker } from "@/components/ui/position-picker";
import {
  PropertySection,
  PropertyRow,
  PropertyToggle,
  PropertySelect,
} from "./components";
import {
  HeadingBlockSettings,
  TextBlockSettings,
  ButtonBlockSettings,
  ImageBlockSettings,
  CardBlockSettings,
  QuoteBlockSettings,
  DividerBlockSettings,
  SpacerBlockSettings,
  ListBlockSettings,
  VideoBlockSettings,
  IconBlockSettings,
  StatsBlockSettings,
  MapBlockSettings,
  EmbedBlockSettings,
  AudioBlockSettings,
  HeroBlockSettings,
  CtaBlockSettings,
  TestimonialBlockSettings,
  PricingBlockSettings,
  TeamBlockSettings,
  AccordionBlockSettings,
  TabsBlockSettings,
  ContactFormBlockSettings,
  NewsletterBlockSettings,
  FeatureGridBlockSettings,
  FaqBlockSettings,
  GenericBlockSettings,
} from "./block-settings";
import { BlockStyleTab } from "./block-style-tab";
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
  // Action callbacks for the selected element
  onSectionMoveUp?: (sectionIndex: number) => void;
  onSectionMoveDown?: (sectionIndex: number) => void;
  onSectionDuplicate?: (sectionIndex: number) => void;
  onSectionDelete?: (sectionIndex: number) => void;
  onAddContainer?: (sectionIndex: number) => void;
  onContainerDelete?: (sectionIndex: number, containerIndex: number) => void;
  onBlockMoveUp?: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
  ) => void;
  onBlockMoveDown?: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
  ) => void;
  onBlockDuplicate?: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
  ) => void;
  onBlockDelete?: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
  ) => void;
}



// =============================================================================
// Settings Panel Component
// =============================================================================

export function SettingsPanel({
  sections,
  onSectionChange,
  onContainerChange,
  onBlockChange,
  onSectionMoveUp: _onSectionMoveUp,
  onSectionMoveDown: _onSectionMoveDown,
  onSectionDuplicate: _onSectionDuplicate,
  onSectionDelete: _onSectionDelete,
  onAddContainer: _onAddContainer,
  onContainerDelete: _onContainerDelete,
  onBlockMoveUp: _onBlockMoveUp,
  onBlockMoveDown: _onBlockMoveDown,
  onBlockDuplicate: _onBlockDuplicate,
  onBlockDelete: _onBlockDelete,
}: SettingsPanelProps) {
  const { rightPanelOpen, rightPanelWidth, selectedElement, toggleRightPanel } =
    useUIStore();
  const [panelTab, setPanelTab] = React.useState<
    "style" | "settings" | "interactions"
  >("style");

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

  return (
    <div
      className={cn("settings-panel-wrapper", !rightPanelOpen && "collapsed")}
    >
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
        {/* Style / Settings / Interactions tabs */}
        {selectedElement && selectedData && (
          <div className="settings-panel-tab-bar">
            <button
              type="button"
              className="settings-panel-tab-btn"
              data-active={panelTab === "style" || undefined}
              onClick={() => setPanelTab("style")}
            >
              Style
            </button>
            <button
              type="button"
              className="settings-panel-tab-btn"
              data-active={panelTab === "settings" || undefined}
              onClick={() => setPanelTab("settings")}
            >
              Settings
            </button>
            <button
              type="button"
              className="settings-panel-tab-btn"
              data-active={panelTab === "interactions" || undefined}
              onClick={() => setPanelTab("interactions")}
            >
              Interactions
            </button>
          </div>
        )}

        {/* Panel Content */}
        <div className="settings-panel-content">
          {!selectedElement ? (
            <div className="settings-panel-empty">
              <Layers className="h-10 w-10 text-(--el-500)/30" />
              <p className="text-[14px] text-(--el-500)">
                Select an element to edit
              </p>
            </div>
          ) : selectedData ? (
            <>
              <div className="settings-panel-sections">
                {/* STYLE TAB — visual CSS properties */}
                {panelTab === "style" && (
                  <>
                    {selectedElement.type === "section" && (
                      <SectionStyleSettings
                        section={selectedData.data as Section}
                        onChange={(updated) =>
                          onSectionChange?.(selectedElement.sectionIndex, updated)
                        }
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
                      />
                    )}
                    {selectedElement.type === "block" && (
                      <BlockStyleTab
                        block={selectedData.data as Block}
                        onChange={(updated) =>
                          onBlockChange?.(
                            selectedElement.sectionIndex,
                            selectedElement.containerIndex!,
                            selectedElement.blockIndex!,
                            updated,
                          )
                        }
                      />
                    )}
                  </>
                )}

                {/* SETTINGS TAB — block content fields */}
                {panelTab === "settings" && (
                  <>
                    {selectedElement.type === "section" && (
                      <div className="p-4 text-center text-[14px] text-(--el-500)">
                        Section styling is on the Style tab
                      </div>
                    )}
                    {selectedElement.type === "container" && (
                      <div className="p-4 text-center text-[14px] text-(--el-500)">
                        Container styling is on the Style tab
                      </div>
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
                      />
                    )}
                  </>
                )}

                {panelTab === "interactions" && (
                  <div className="settings-panel-interactions">
                    <div className="settings-panel-interactions-section">
                      <div className="settings-panel-interactions-header">
                        <span>Element trigger</span>
                        <button className="settings-panel-header-btn" title="Add trigger">
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <div className="settings-panel-interactions-empty">
                        <p>Select an element on the canvas, then add a trigger to animate it on hover, click, or scroll.</p>
                      </div>
                    </div>
                    <div className="settings-panel-interactions-section">
                      <div className="settings-panel-interactions-header">
                        <span>Page trigger</span>
                        <button className="settings-panel-header-btn" title="Add trigger">
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <div className="settings-panel-interactions-empty">
                        <p>Add a trigger for page-level events like load, scroll, or resize.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="settings-panel-empty">
              <p className="text-sm text-(--el-500)">Element not found</p>
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
}: {
  section: Section;
  onChange: (section: Section) => void;
}) {
  const breakpoint = useCurrentBreakpoint();
  const sectionData = section as unknown as Record<string, unknown>;

  // Responsive-aware change handler
  const handleChange = (field: string, value: unknown) => {
    const newData = setResponsiveOverride(
      sectionData,
      breakpoint,
      field,
      value,
    );
    onChange(newData as unknown as Section);
  };

  // Helper to get responsive value
  const getValue = <T,>(field: string, defaultValue: T): T => {
    return (
      getResponsiveValue<T>(sectionData, field, breakpoint) ?? defaultValue
    );
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

  // Get responsive values for display
  const width = getValue<string>("width", "wide");
  const minHeight = getValue<string>("minHeight", "none");
  const align = getValue<string>("align", "left");
  const verticalAlign = getValue<string>("verticalAlign", "top");
  const paddingY = getValue<string>("paddingY", "md");
  const paddingTop = getValue<string>("paddingTop", "") || paddingY;
  const paddingBottom = getValue<string>("paddingBottom", "") || paddingY;
  const marginTop = getValue<string>("marginTop", "none");
  const marginBottom = getValue<string>("marginBottom", "none");
  const gapY = getValue<string>("gapY", "md");
  const borderTop = getValue<string>("borderTop", "none");
  const borderBottom = getValue<string>("borderBottom", "none");
  const borderLeft = getValue<string>("borderLeft", "none");
  const borderRight = getValue<string>("borderRight", "none");
  const borderRadius = getValue<string>("borderRadius", "none");
  const shadow = getValue<string>("shadow", "none");

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
            value={width}
            options={widthOptions}
            onChange={(v) => handleChange("width", v)}
            fullWidth
          />
        </PropertyRow>
        <PropertyRow label="Min Height">
          <PropertySelect
            value={minHeight}
            options={SECTION_MIN_HEIGHT_OPTIONS}
            onChange={(v) => handleChange("minHeight", v)}
          />
        </PropertyRow>
        {minHeight !== "none" && (
          <PropertyRow label="Position" stacked>
            <div className="flex items-center gap-3">
              <PositionPicker
                horizontal={align as "left" | "center" | "right"}
                vertical={verticalAlign as "top" | "center" | "bottom"}
                onChange={(h, v) => {
                  handleChange("align", h);
                  handleChange("verticalAlign", v);
                }}
              />
              <span className="text-xs text-(--el-500)">
                {verticalAlign} / {align}
              </span>
            </div>
          </PropertyRow>
        )}
      </PropertySection>

      {/* Spacing */}
      <PropertySection title="Spacing" icon={<Move className="h-3.5 w-3.5" />}>
        <SpacingBox
          values={{
            paddingTop,
            paddingBottom,
            marginTop,
            marginBottom,
          }}
          onChange={(field, value) => handleChange(field, value)}
        />
        <PropertyRow label="Gap">
          <PropertySelect
            value={gapY}
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

      {/* Borders */}
      <PropertySection
        title="Borders"
        icon={<Box className="h-3.5 w-3.5" />}
        defaultOpen={false}
      >
        <PropertyRow label="Top">
          <PropertySelect
            value={borderTop}
            options={BORDER_WIDTH_OPTIONS}
            onChange={(v) => handleChange("borderTop", v)}
          />
        </PropertyRow>
        <PropertyRow label="Bottom">
          <PropertySelect
            value={borderBottom}
            options={BORDER_WIDTH_OPTIONS}
            onChange={(v) => handleChange("borderBottom", v)}
          />
        </PropertyRow>
        <PropertyRow label="Left">
          <PropertySelect
            value={borderLeft}
            options={BORDER_WIDTH_OPTIONS}
            onChange={(v) => handleChange("borderLeft", v)}
          />
        </PropertyRow>
        <PropertyRow label="Right">
          <PropertySelect
            value={borderRight}
            options={BORDER_WIDTH_OPTIONS}
            onChange={(v) => handleChange("borderRight", v)}
          />
        </PropertyRow>
        <PropertyRow label="Radius">
          <PropertySelect
            value={borderRadius}
            options={BORDER_RADIUS_OPTIONS}
            onChange={(v) => handleChange("borderRadius", v)}
          />
        </PropertyRow>
        <PropertyRow label="Shadow">
          <PropertySelect
            value={shadow}
            options={SHADOW_OPTIONS}
            onChange={(v) => handleChange("shadow", v)}
          />
        </PropertyRow>
      </PropertySection>

      {/* Advanced */}
      <PropertySection
        title="Advanced"
        icon={<Settings2 className="h-3.5 w-3.5" />}
        defaultOpen={false}
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
        defaultOpen={false}
      >
        <VisibilityToggles
          hideOn={section.hideOn}
          onChange={(hideOn) => handleChange("hideOn", hideOn)}
        />
      </PropertySection>
    </>
  );
}

// =============================================================================
// Container Style Settings - Webflow-style (matching Section features)
// =============================================================================

function ContainerStyleSettings({
  container,
  onChange,
}: {
  container: Container;
  onChange: (container: Container) => void;
}) {
  const breakpoint = useCurrentBreakpoint();
  const containerData = container as unknown as Record<string, unknown>;

  // Responsive-aware change handler
  const handleChange = (field: string, value: unknown) => {
    const newData = setResponsiveOverride(
      containerData,
      breakpoint,
      field,
      value,
    );
    onChange(newData as unknown as Container);
  };

  // Helper to get responsive value
  const getValue = <T,>(field: string, defaultValue: T): T => {
    return (
      getResponsiveValue<T>(containerData, field, breakpoint) ?? defaultValue
    );
  };

  // Helper to get responsive layout value
  const getLayoutValue = <T,>(field: string, defaultValue: T): T => {
    if (!container.layout) return defaultValue;
    const layoutData = container.layout as unknown as Record<string, unknown>;
    return getResponsiveValue<T>(layoutData, field, breakpoint) ?? defaultValue;
  };

  const handleLayoutChange = (field: string, value: unknown) => {
    const layoutData = (container.layout || {}) as unknown as Record<
      string,
      unknown
    >;
    const newLayoutData = setResponsiveOverride(
      layoutData,
      breakpoint,
      field,
      value,
    );
    onChange({
      ...container,
      layout: newLayoutData as Container["layout"],
    });
  };

  // Get background as object (normalize from string if legacy)
  const getBackground = (): SectionBackground => {
    if (!container.background) return { type: "none" };
    if (typeof container.background === "string") {
      if (
        container.background === "none" ||
        container.background === "transparent"
      )
        return { type: "none" };
      return { type: "color", color: container.background };
    }
    return container.background as SectionBackground;
  };

  const background = getBackground();

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

  // Get responsive layout values
  const layoutType = getLayoutValue<string>("type", "stack");
  const layoutDirection = getLayoutValue<string>("direction", "column");
  const layoutJustify = getLayoutValue<string>("justify", "start");
  const layoutAlign = getLayoutValue<string>("align", "stretch");
  const layoutColumns = getLayoutValue<number>("columns", 2);
  const layoutGap = getLayoutValue<string>("gap", "md");

  // Get responsive container values
  const maxWidth = getValue<string>("maxWidth", "none");
  const minHeight = getValue<string>("minHeight", "none");
  const paddingX = getValue<string>("paddingX", "none");
  const paddingY = getValue<string>("paddingY", "none");
  const align = getValue<string>("align", "left");
  const verticalAlign = getValue<string>("verticalAlign", "top");
  const borderTop = getValue<string>("borderTop", "none");
  const borderBottom = getValue<string>("borderBottom", "none");
  const borderLeft = getValue<string>("borderLeft", "none");
  const borderRight = getValue<string>("borderRight", "none");
  const borderRadius = getValue<string>("borderRadius", "none");
  const shadow = getValue<string>("shadow", "none");

  // Container min height options
  const containerMinHeightOptions = [
    { value: "none", label: "None" },
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
    { value: "xl", label: "X-Large" },
  ];

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
            value={layoutType}
            options={displayOptions}
            onChange={(v) => handleLayoutChange("type", v)}
            fullWidth
          />
        </PropertyRow>

        {layoutType === "flex" && (
          <>
            <PropertyRow label="Direction" stacked>
              <PropertyToggle
                value={layoutDirection}
                options={directionOptions}
                onChange={(v) => handleLayoutChange("direction", v)}
                fullWidth
              />
            </PropertyRow>
            <PropertyRow label="Justify">
              <PropertySelect
                value={layoutJustify}
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
                value={layoutAlign}
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

        {layoutType === "grid" && (
          <PropertyRow label="Columns">
            <Input
              type="number"
              min={1}
              max={12}
              value={layoutColumns}
              onChange={(e) =>
                handleLayoutChange("columns", parseInt(e.target.value) || 2)
              }
              className="settings-input-sm"
            />
          </PropertyRow>
        )}

        <PropertyRow label="Gap">
          <PropertySelect
            value={layoutGap}
            options={SPACING_OPTIONS}
            onChange={(v) => handleLayoutChange("gap", v)}
          />
        </PropertyRow>
        <PropertyRow label="Max Width">
          <PropertySelect
            value={maxWidth}
            options={CONTAINER_WIDTH_OPTIONS}
            onChange={(v) => handleChange("maxWidth", v)}
          />
        </PropertyRow>
        <PropertyRow label="Min Height">
          <PropertySelect
            value={minHeight}
            options={containerMinHeightOptions}
            onChange={(v) => handleChange("minHeight", v)}
          />
        </PropertyRow>
        {minHeight !== "none" && (
          <PropertyRow label="Position" stacked>
            <div className="flex items-center gap-3">
              <PositionPicker
                horizontal={align as "left" | "center" | "right"}
                vertical={verticalAlign as "top" | "center" | "bottom"}
                onChange={(h, v) => {
                  handleChange("align", h);
                  handleChange("verticalAlign", v);
                }}
              />
              <span className="text-xs text-(--el-500)">
                {verticalAlign} / {align}
              </span>
            </div>
          </PropertyRow>
        )}
      </PropertySection>

      {/* Spacing */}
      <PropertySection title="Spacing" icon={<Move className="h-3.5 w-3.5" />}>
        <SpacingBox
          values={{
            paddingLeft: paddingX,
            paddingRight: paddingX,
            paddingTop: paddingY,
            paddingBottom: paddingY,
          }}
          onChange={(field, value) => {
            if (field === "paddingLeft" || field === "paddingRight") {
              handleChange("paddingX", value);
            } else if (field === "paddingTop" || field === "paddingBottom") {
              handleChange("paddingY", value);
            }
          }}
        />
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

      {/* Borders */}
      <PropertySection
        title="Borders"
        icon={<Box className="h-3.5 w-3.5" />}
        defaultOpen={false}
      >
        <PropertyRow label="Top">
          <PropertySelect
            value={borderTop}
            options={BORDER_WIDTH_OPTIONS}
            onChange={(v) => handleChange("borderTop", v)}
          />
        </PropertyRow>
        <PropertyRow label="Bottom">
          <PropertySelect
            value={borderBottom}
            options={BORDER_WIDTH_OPTIONS}
            onChange={(v) => handleChange("borderBottom", v)}
          />
        </PropertyRow>
        <PropertyRow label="Left">
          <PropertySelect
            value={borderLeft}
            options={BORDER_WIDTH_OPTIONS}
            onChange={(v) => handleChange("borderLeft", v)}
          />
        </PropertyRow>
        <PropertyRow label="Right">
          <PropertySelect
            value={borderRight}
            options={BORDER_WIDTH_OPTIONS}
            onChange={(v) => handleChange("borderRight", v)}
          />
        </PropertyRow>
        <PropertyRow label="Radius">
          <PropertySelect
            value={borderRadius}
            options={BORDER_RADIUS_OPTIONS}
            onChange={(v) => handleChange("borderRadius", v)}
          />
        </PropertyRow>
        <PropertyRow label="Shadow">
          <PropertySelect
            value={shadow}
            options={SHADOW_OPTIONS}
            onChange={(v) => handleChange("shadow", v)}
          />
        </PropertyRow>
      </PropertySection>

      {/* Advanced */}
      <PropertySection
        title="Advanced"
        icon={<Settings2 className="h-3.5 w-3.5" />}
        defaultOpen={false}
      >
        <PropertyRow label="Overflow">
          <PropertySelect
            value={container.overflow || "visible"}
            options={OVERFLOW_OPTIONS}
            onChange={(v) => handleChange("overflow", v)}
          />
        </PropertyRow>
        <PropertyRow label="CSS Classes" stacked>
          <Input
            value={container.customClasses || ""}
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
        defaultOpen={false}
      >
        <VisibilityToggles
          hideOn={container.hideOn}
          onChange={(hideOn) => handleChange("hideOn", hideOn)}
        />
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
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  // Component-centric: different settings per block type
  const blockType = block._type;

  // Render type-specific settings with Block Info at the end
  const renderBlockSettings = () => {
    switch (blockType) {
      case "heading-block":
        return <HeadingBlockSettings block={block} onChange={onChange} />;
      case "text-block":
        return <TextBlockSettings block={block} onChange={onChange} />;
      case "button-block":
        return <ButtonBlockSettings block={block} onChange={onChange} />;
      case "image-block":
        return <ImageBlockSettings block={block} onChange={onChange} />;
      case "card-block":
        return <CardBlockSettings block={block} onChange={onChange} />;
      case "quote-block":
        return <QuoteBlockSettings block={block} onChange={onChange} />;
      case "divider-block":
        return <DividerBlockSettings block={block} onChange={onChange} />;
      case "spacer-block":
        return <SpacerBlockSettings block={block} onChange={onChange} />;
      case "list-block":
        return <ListBlockSettings block={block} onChange={onChange} />;
      case "video-block":
        return <VideoBlockSettings block={block} onChange={onChange} />;
      case "icon-block":
        return <IconBlockSettings block={block} onChange={onChange} />;
      case "stats-block":
        return <StatsBlockSettings block={block} onChange={onChange} />;
      case "map-block":
        return <MapBlockSettings block={block} onChange={onChange} />;
      case "embed-block":
        return <EmbedBlockSettings block={block} onChange={onChange} />;
      case "rich-text-block":
        return <TextBlockSettings block={block} onChange={onChange} />;
      case "audio-block":
        return <AudioBlockSettings block={block} onChange={onChange} />;
      case "logo-block":
        return <ImageBlockSettings block={block} onChange={onChange} />;
      case "hero-block":
        return <HeroBlockSettings block={block} onChange={onChange} />;
      case "cta-block":
        return <CtaBlockSettings block={block} onChange={onChange} />;
      case "testimonial-block":
        return <TestimonialBlockSettings block={block} onChange={onChange} />;
      case "pricing-block":
        return <PricingBlockSettings block={block} onChange={onChange} />;
      case "team-block":
        return <TeamBlockSettings block={block} onChange={onChange} />;
      case "accordion-block":
        return <AccordionBlockSettings block={block} onChange={onChange} />;
      case "tabs-block":
        return <TabsBlockSettings block={block} onChange={onChange} />;
      case "contact-form-block":
        return <ContactFormBlockSettings block={block} onChange={onChange} />;
      case "newsletter-block":
        return <NewsletterBlockSettings block={block} onChange={onChange} />;
      case "feature-grid-block":
        return <FeatureGridBlockSettings block={block} onChange={onChange} />;
      case "faq-block":
        return <FaqBlockSettings block={block} onChange={onChange} />;
      case "social-links-block":
      case "logo-bar-block":
      case "columns-block":
      case "container-block":
      case "grid-block":
      case "flex-block":
      case "stack-block":
        return <GenericBlockSettings block={block} onChange={onChange} />;
      default:
        return <GenericBlockSettings block={block} onChange={onChange} />;
    }
  };

  return <>{renderBlockSettings()}</>;
}

