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
  Layers,
  Palette,
  Move,
  Grid3X3,
  AlignLeft,
  Settings2,
  EyeOff,
  Monitor,
  Tablet,
  Smartphone,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Plus,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  EXTENDED_SPACING_OPTIONS,
  CONTAINER_WIDTH_OPTIONS,
  SECTION_MIN_HEIGHT_OPTIONS,
  OVERFLOW_OPTIONS,
  SECTION_WIDTH_OPTIONS,
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
import { HeadingSettings } from "@/components/settings/element-settings/heading-settings";
import "./settings-panel.css";

// =============================================================================
// Types
// =============================================================================

interface ElementActions {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onAddContainer?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

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
// Breakpoint Indicator - Shows which device size is being edited
// =============================================================================

function BreakpointIndicator() {
  const breakpoint = useCurrentBreakpoint();

  const icons = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone,
  };

  const labels = {
    desktop: "Desktop",
    tablet: "Tablet",
    mobile: "Mobile",
  };

  const Icon = icons[breakpoint];

  return (
    <div
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
        breakpoint === "desktop" && "bg-muted text-muted-foreground",
        breakpoint === "tablet" &&
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        breakpoint === "mobile" &&
          "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      )}
      title={`Editing ${labels[breakpoint]} styles`}
    >
      <Icon className="h-3 w-3" />
      <span>{labels[breakpoint]}</span>
    </div>
  );
}

// =============================================================================
// Actions Bar - Move, Clone, Delete buttons
// =============================================================================

function ActionsBar({
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onAddContainer,
  canMoveUp = true,
  canMoveDown = true,
}: ElementActions) {
  return (
    <div className="flex items-center gap-0.5 px-3 py-2 border-b border-(--border)">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onMoveUp}
            disabled={!canMoveUp || !onMoveUp}
            className="h-7 w-7"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          Move up
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onMoveDown}
            disabled={!canMoveDown || !onMoveDown}
            className="h-7 w-7"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          Move down
        </TooltipContent>
      </Tooltip>
      <div className="w-px h-4 bg-border mx-0.5" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onDuplicate}
            disabled={!onDuplicate}
            className="h-7 w-7"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          Duplicate
        </TooltipContent>
      </Tooltip>
      {onAddContainer && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onAddContainer}
              className="h-7 w-7"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Add container
          </TooltipContent>
        </Tooltip>
      )}
      <div className="flex-1" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onDelete}
            disabled={!onDelete}
            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          Delete
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

// =============================================================================
// Settings Panel Component
// =============================================================================

export function SettingsPanel({
  sections,
  onSectionChange,
  onContainerChange,
  onBlockChange,
  onSectionMoveUp,
  onSectionMoveDown,
  onSectionDuplicate,
  onSectionDelete,
  onAddContainer,
  onContainerDelete,
  onBlockMoveUp,
  onBlockMoveDown,
  onBlockDuplicate,
  onBlockDelete,
}: SettingsPanelProps) {
  const { rightPanelOpen, rightPanelWidth, selectedElement, toggleRightPanel } =
    useUIStore();

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
        {/* Panel Header */}
        <div className="settings-panel-header">
          <div className="settings-panel-selector">
            {icon}
            <span className="settings-panel-selector-name">{title}</span>
          </div>
          <div className="flex items-center gap-1">
            <BreakpointIndicator />
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
            <>
              {/* Actions Bar - Move, Clone, Delete */}
              {selectedElement.type === "section" && (
                <ActionsBar
                  onMoveUp={() =>
                    onSectionMoveUp?.(selectedElement.sectionIndex)
                  }
                  onMoveDown={() =>
                    onSectionMoveDown?.(selectedElement.sectionIndex)
                  }
                  onDuplicate={() =>
                    onSectionDuplicate?.(selectedElement.sectionIndex)
                  }
                  onDelete={() =>
                    onSectionDelete?.(selectedElement.sectionIndex)
                  }
                  canMoveUp={selectedElement.sectionIndex > 0}
                  canMoveDown={
                    selectedElement.sectionIndex < sections.length - 1
                  }
                  onAddContainer={
                    onAddContainer
                      ? () => onAddContainer(selectedElement.sectionIndex)
                      : undefined
                  }
                />
              )}
              {selectedElement.type === "container" && (
                <ActionsBar
                  onDelete={() =>
                    onContainerDelete?.(
                      selectedElement.sectionIndex,
                      selectedElement.containerIndex!,
                    )
                  }
                />
              )}
              {selectedElement.type === "block" && (
                <ActionsBar
                  onMoveUp={() =>
                    onBlockMoveUp?.(
                      selectedElement.sectionIndex,
                      selectedElement.containerIndex!,
                      selectedElement.blockIndex!,
                    )
                  }
                  onMoveDown={() =>
                    onBlockMoveDown?.(
                      selectedElement.sectionIndex,
                      selectedElement.containerIndex!,
                      selectedElement.blockIndex!,
                    )
                  }
                  onDuplicate={() =>
                    onBlockDuplicate?.(
                      selectedElement.sectionIndex,
                      selectedElement.containerIndex!,
                      selectedElement.blockIndex!,
                    )
                  }
                  onDelete={() =>
                    onBlockDelete?.(
                      selectedElement.sectionIndex,
                      selectedElement.containerIndex!,
                      selectedElement.blockIndex!,
                    )
                  }
                  canMoveUp={
                    selectedElement.blockIndex !== undefined &&
                    selectedElement.blockIndex > 0
                  }
                  canMoveDown={
                    selectedElement.blockIndex !== undefined &&
                    selectedElement.containerIndex !== undefined &&
                    sections[selectedElement.sectionIndex]?.containers?.[
                      selectedElement.containerIndex
                    ]?.blocks &&
                    selectedElement.blockIndex <
                      (sections[selectedElement.sectionIndex]?.containers?.[
                        selectedElement.containerIndex
                      ]?.blocks?.length ?? 0) -
                        1
                  }
                />
              )}

              <div className="settings-panel-sections">
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
              </div>
            </>
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
  const borderColor = getValue<string>("borderColor", "");
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
              <span className="text-xs text-muted-foreground">
                {verticalAlign} / {align}
              </span>
            </div>
          </PropertyRow>
        )}
      </PropertySection>

      {/* Spacing */}
      <PropertySection title="Spacing" icon={<Move className="h-3.5 w-3.5" />}>
        <PropertyRow label="Pad Top">
          <PropertySelect
            value={paddingTop}
            options={EXTENDED_SPACING_OPTIONS}
            onChange={(v) => handleChange("paddingTop", v)}
          />
        </PropertyRow>
        <PropertyRow label="Pad Bottom">
          <PropertySelect
            value={paddingBottom}
            options={EXTENDED_SPACING_OPTIONS}
            onChange={(v) => handleChange("paddingBottom", v)}
          />
        </PropertyRow>
        <PropertyRow label="Margin Top">
          <PropertySelect
            value={marginTop}
            options={SPACING_OPTIONS}
            onChange={(v) => handleChange("marginTop", v)}
          />
        </PropertyRow>
        <PropertyRow label="Margin Bot">
          <PropertySelect
            value={marginBottom}
            options={SPACING_OPTIONS}
            onChange={(v) => handleChange("marginBottom", v)}
          />
        </PropertyRow>
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
              <span className="text-xs text-muted-foreground">
                {verticalAlign} / {align}
              </span>
            </div>
          </PropertyRow>
        )}
      </PropertySection>

      {/* Spacing */}
      <PropertySection title="Spacing" icon={<Move className="h-3.5 w-3.5" />}>
        <PropertyRow label="Padding X">
          <PropertySelect
            value={paddingX}
            options={SPACING_OPTIONS}
            onChange={(v) => handleChange("paddingX", v)}
          />
        </PropertyRow>
        <PropertyRow label="Padding Y">
          <PropertySelect
            value={paddingY}
            options={SPACING_OPTIONS}
            onChange={(v) => handleChange("paddingY", v)}
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
      default:
        return <GenericBlockSettings block={block} onChange={onChange} />;
    }
  };

  return (
    <>
      {renderBlockSettings()}

      {/* Block Info */}
      <PropertySection
        title="Block Info"
        icon={<Settings2 className="h-3.5 w-3.5" />}
        defaultOpen={false}
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
    </>
  );
}

// =============================================================================
// Block Type-Specific Settings - Webflow-style
// =============================================================================

/**
 * HeadingBlockSettings - Uses shared HeadingSettings component
 *
 * Typography uses fluid scaling (no per-breakpoint overrides needed).
 * The fluid clamp() tokens in @enterprise/tokens handle responsive sizing.
 */
function HeadingBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  return <HeadingSettings block={block} onChange={onChange} />;
}

function TextBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const breakpoint = useCurrentBreakpoint();
  const data = block.data as Record<string, unknown>;

  // Responsive-aware change handler
  const handleDataChange = (field: string, value: unknown) => {
    const newData = setResponsiveOverride(data, breakpoint, field, value);
    onChange({ ...block, data: newData });
  };

  // Get responsive values for current breakpoint
  const size = getResponsiveValue<string>(data, "size", breakpoint) || "base";
  const align = getResponsiveValue<string>(data, "align", breakpoint) || "left";

  // Alignment options for toggle
  const alignOptions = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
    { value: "justify", label: "Justify" },
  ];

  const sizeOptions = [
    { value: "xs", label: "XS" },
    { value: "sm", label: "SM" },
    { value: "base", label: "Base" },
    { value: "lg", label: "LG" },
    { value: "xl", label: "XL" },
    { value: "2xl", label: "2XL" },
    { value: "3xl", label: "3XL" },
    { value: "4xl", label: "4XL" },
    { value: "5xl", label: "5XL" },
    { value: "6xl", label: "6XL" },
    { value: "7xl", label: "7XL" },
    { value: "8xl", label: "8XL" },
    { value: "9xl", label: "9XL" },
  ];

  return (
    <PropertySection title="Typography" icon={<Type className="h-3.5 w-3.5" />}>
      <PropertyRow label="Size">
        <PropertySelect
          value={size}
          options={sizeOptions}
          onChange={(v) => handleDataChange("size", v)}
        />
      </PropertyRow>
      <PropertyRow label="Align" stacked>
        <PropertyToggle
          value={align}
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
