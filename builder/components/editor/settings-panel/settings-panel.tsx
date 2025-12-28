"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import { useUIStore } from "@/lib/stores/ui-store";
import type { Section, Container, Block } from "@/lib/types/section";
import {
  SPACING_OPTIONS,
  EXTENDED_SPACING_OPTIONS,
  BACKGROUND_PRESET_OPTIONS,
  BORDER_WIDTH_OPTIONS,
  BORDER_RADIUS_OPTIONS,
  SHADOW_OPTIONS,
  CONTAINER_WIDTH_OPTIONS,
  SECTION_MIN_HEIGHT_OPTIONS,
} from "@/lib/constants";
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
    container: Container
  ) => void;
  onBlockChange?: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
    block: Block
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
  const {
    rightPanelOpen,
    rightPanelWidth,
    selectedElement,
    toggleRightPanel,
  } = useUIStore();

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
        return { icon: <LayoutTemplate className="h-4 w-4" />, title: "Section" };
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

  // Toggle button when panel is closed
  if (!rightPanelOpen) {
    return (
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
    );
  }

  return (
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
          className={cn("settings-panel-tab", activeTab === "style" && "active")}
          onClick={() => setActiveTab("style")}
        >
          Style
        </button>
        <button
          className={cn("settings-panel-tab", activeTab === "settings" && "active")}
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
                    updated
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
                    updated
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
  );
}

// =============================================================================
// Collapsible Section Component
// =============================================================================

interface SettingsSectionProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function SettingsSection({
  title,
  icon,
  defaultOpen = true,
  children,
}: SettingsSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="settings-section">
      <CollapsibleTrigger className="settings-section-trigger">
        <div className="settings-section-trigger-left">
          {icon}
          <span>{title}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="settings-section-content">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// =============================================================================
// Inline Select Component (Label + Select in row)
// =============================================================================

interface InlineSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function InlineSelect({ label, value, options, onChange }: InlineSelectProps) {
  return (
    <div className="settings-row">
      <Label className="settings-label">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="settings-select">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// =============================================================================
// Toggle Button Group (Webflow-style)
// =============================================================================

interface ToggleGroupProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function ToggleGroup({ value, options, onChange }: ToggleGroupProps) {
  return (
    <div className="toggle-group">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={cn("toggle-group-btn", value === opt.value && "active")}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// =============================================================================
// Section Style Settings
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

  if (tab === "settings") {
    return (
      <SettingsSection title="Advanced" icon={<Settings2 className="h-4 w-4" />}>
        <div className="settings-row-full">
          <Label className="settings-label">Anchor ID</Label>
          <Input
            value={section.anchorId || ""}
            onChange={(e) => handleChange("anchorId", e.target.value)}
            placeholder="section-id"
            className="settings-input"
          />
        </div>
        <div className="settings-row-full">
          <Label className="settings-label">Custom Classes</Label>
          <Input
            value={section.customClasses || ""}
            onChange={(e) => handleChange("customClasses", e.target.value)}
            placeholder="my-class another-class"
            className="settings-input"
          />
        </div>
      </SettingsSection>
    );
  }

  return (
    <>
      {/* Layout */}
      <SettingsSection title="Layout" icon={<Grid3X3 className="h-4 w-4" />}>
        <div className="settings-row">
          <Label className="settings-label">Width</Label>
          <ToggleGroup
            value={section.width || "full"}
            options={[
              { value: "narrow", label: "Narrow" },
              { value: "container", label: "Container" },
              { value: "wide", label: "Wide" },
              { value: "full", label: "Full" },
            ]}
            onChange={(v) => handleChange("width", v)}
          />
        </div>
        <InlineSelect
          label="Min Height"
          value={section.minHeight || "none"}
          options={SECTION_MIN_HEIGHT_OPTIONS}
          onChange={(v) => handleChange("minHeight", v)}
        />
        {section.minHeight && section.minHeight !== "none" && (
          <div className="settings-row">
            <Label className="settings-label">Vertical Align</Label>
            <ToggleGroup
              value={section.verticalAlign || "top"}
              options={[
                { value: "top", label: "Top" },
                { value: "center", label: "Center" },
                { value: "bottom", label: "Bottom" },
              ]}
              onChange={(v) => handleChange("verticalAlign", v)}
            />
          </div>
        )}
      </SettingsSection>

      {/* Spacing */}
      <SettingsSection title="Spacing" icon={<Move className="h-4 w-4" />}>
        <InlineSelect
          label="Padding Top"
          value={section.paddingTop || section.paddingY || "md"}
          options={EXTENDED_SPACING_OPTIONS}
          onChange={(v) => handleChange("paddingTop", v)}
        />
        <InlineSelect
          label="Padding Bottom"
          value={section.paddingBottom || section.paddingY || "md"}
          options={EXTENDED_SPACING_OPTIONS}
          onChange={(v) => handleChange("paddingBottom", v)}
        />
        <InlineSelect
          label="Margin Top"
          value={section.marginTop || "none"}
          options={SPACING_OPTIONS}
          onChange={(v) => handleChange("marginTop", v)}
        />
        <InlineSelect
          label="Margin Bottom"
          value={section.marginBottom || "none"}
          options={SPACING_OPTIONS}
          onChange={(v) => handleChange("marginBottom", v)}
        />
        <InlineSelect
          label="Gap Y"
          value={section.gapY || "none"}
          options={SPACING_OPTIONS}
          onChange={(v) => handleChange("gapY", v)}
        />
      </SettingsSection>

      {/* Background */}
      <SettingsSection title="Background" icon={<Palette className="h-4 w-4" />} defaultOpen={false}>
        <InlineSelect
          label="Preset"
          value={typeof section.background === "string" ? section.background : "none"}
          options={BACKGROUND_PRESET_OPTIONS}
          onChange={(v) => handleChange("background", v)}
        />
      </SettingsSection>

      {/* Borders */}
      <SettingsSection title="Borders" icon={<Box className="h-4 w-4" />} defaultOpen={false}>
        <InlineSelect
          label="Top"
          value={section.borderTop || "none"}
          options={BORDER_WIDTH_OPTIONS}
          onChange={(v) => handleChange("borderTop", v)}
        />
        <InlineSelect
          label="Bottom"
          value={section.borderBottom || "none"}
          options={BORDER_WIDTH_OPTIONS}
          onChange={(v) => handleChange("borderBottom", v)}
        />
        <InlineSelect
          label="Radius"
          value={section.borderRadius || "none"}
          options={BORDER_RADIUS_OPTIONS}
          onChange={(v) => handleChange("borderRadius", v)}
        />
        <InlineSelect
          label="Shadow"
          value={section.shadow || "none"}
          options={SHADOW_OPTIONS}
          onChange={(v) => handleChange("shadow", v)}
        />
      </SettingsSection>
    </>
  );
}

// =============================================================================
// Container Style Settings
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

  if (tab === "settings") {
    return (
      <SettingsSection title="Advanced" icon={<Settings2 className="h-4 w-4" />}>
        <div className="settings-row-full">
          <Label className="settings-label">Custom Classes</Label>
          <Input
            value={container.customClasses || ""}
            onChange={(e) => handleChange("customClasses", e.target.value)}
            placeholder="my-class"
            className="settings-input"
          />
        </div>
      </SettingsSection>
    );
  }

  return (
    <>
      {/* Layout */}
      <SettingsSection title="Layout" icon={<Grid3X3 className="h-4 w-4" />}>
        <div className="settings-row">
          <Label className="settings-label">Display</Label>
          <ToggleGroup
            value={container.layout?.type || "stack"}
            options={[
              { value: "stack", label: "Stack" },
              { value: "flex", label: "Flex" },
              { value: "grid", label: "Grid" },
            ]}
            onChange={(v) => handleLayoutChange("type", v)}
          />
        </div>

        {container.layout?.type === "flex" && (
          <>
            <div className="settings-row">
              <Label className="settings-label">Direction</Label>
              <ToggleGroup
                value={container.layout?.direction || "column"}
                options={[
                  { value: "row", label: "Row" },
                  { value: "column", label: "Column" },
                ]}
                onChange={(v) => handleLayoutChange("direction", v)}
              />
            </div>
            <InlineSelect
              label="Justify"
              value={container.layout?.justify || "start"}
              options={[
                { value: "start", label: "Start" },
                { value: "center", label: "Center" },
                { value: "end", label: "End" },
                { value: "between", label: "Space Between" },
                { value: "around", label: "Space Around" },
              ]}
              onChange={(v) => handleLayoutChange("justify", v)}
            />
            <InlineSelect
              label="Align"
              value={container.layout?.align || "stretch"}
              options={[
                { value: "start", label: "Start" },
                { value: "center", label: "Center" },
                { value: "end", label: "End" },
                { value: "stretch", label: "Stretch" },
              ]}
              onChange={(v) => handleLayoutChange("align", v)}
            />
          </>
        )}

        {container.layout?.type === "grid" && (
          <div className="settings-row">
            <Label className="settings-label">Columns</Label>
            <Input
              type="number"
              min={1}
              max={12}
              value={container.layout?.columns || 2}
              onChange={(e) => handleLayoutChange("columns", parseInt(e.target.value) || 2)}
              className="settings-input-sm"
            />
          </div>
        )}

        <InlineSelect
          label="Gap"
          value={container.layout?.gap || "md"}
          options={SPACING_OPTIONS}
          onChange={(v) => handleLayoutChange("gap", v)}
        />
        <InlineSelect
          label="Max Width"
          value={container.maxWidth || "none"}
          options={CONTAINER_WIDTH_OPTIONS}
          onChange={(v) => handleChange("maxWidth", v)}
        />
      </SettingsSection>

      {/* Spacing */}
      <SettingsSection title="Spacing" icon={<Move className="h-4 w-4" />}>
        <InlineSelect
          label="Padding X"
          value={container.paddingX || "none"}
          options={SPACING_OPTIONS}
          onChange={(v) => handleChange("paddingX", v)}
        />
        <InlineSelect
          label="Padding Y"
          value={container.paddingY || "none"}
          options={SPACING_OPTIONS}
          onChange={(v) => handleChange("paddingY", v)}
        />
      </SettingsSection>

      {/* Alignment */}
      <SettingsSection title="Alignment" icon={<AlignLeft className="h-4 w-4" />} defaultOpen={false}>
        <div className="settings-row">
          <Label className="settings-label">Horizontal</Label>
          <ToggleGroup
            value={container.align || "left"}
            options={[
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ]}
            onChange={(v) => handleChange("align", v)}
          />
        </div>
      </SettingsSection>
    </>
  );
}

// =============================================================================
// Block Style Settings (Component-centric - different per block type)
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
      <SettingsSection title="Block Info" icon={<Settings2 className="h-4 w-4" />}>
        <div className="settings-row">
          <Label className="settings-label">Type</Label>
          <span className="text-sm text-muted-foreground">{blockType}</span>
        </div>
        <div className="settings-row">
          <Label className="settings-label">Key</Label>
          <span className="text-xs text-muted-foreground font-mono">{block._key}</span>
        </div>
      </SettingsSection>
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
// Block Type-Specific Settings
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

  return (
    <SettingsSection title="Heading" icon={<Type className="h-4 w-4" />}>
      <InlineSelect
        label="Level"
        value={(block.data?.level as string) || "h2"}
        options={[
          { value: "h1", label: "H1" },
          { value: "h2", label: "H2" },
          { value: "h3", label: "H3" },
          { value: "h4", label: "H4" },
          { value: "h5", label: "H5" },
          { value: "h6", label: "H6" },
        ]}
        onChange={(v) => handleDataChange("level", v)}
      />
      <InlineSelect
        label="Size"
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
      <InlineSelect
        label="Align"
        value={(block.data?.align as string) || "left"}
        options={[
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" },
        ]}
        onChange={(v) => handleDataChange("align", v)}
      />
    </SettingsSection>
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

  return (
    <SettingsSection title="Text" icon={<Type className="h-4 w-4" />}>
      <InlineSelect
        label="Size"
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
      <InlineSelect
        label="Align"
        value={(block.data?.align as string) || "left"}
        options={[
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" },
          { value: "justify", label: "Justify" },
        ]}
        onChange={(v) => handleDataChange("align", v)}
      />
    </SettingsSection>
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

  return (
    <SettingsSection title="Button" icon={<Box className="h-4 w-4" />}>
      <InlineSelect
        label="Variant"
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
      <InlineSelect
        label="Size"
        value={(block.data?.size as string) || "default"}
        options={[
          { value: "sm", label: "Small" },
          { value: "default", label: "Default" },
          { value: "lg", label: "Large" },
        ]}
        onChange={(v) => handleDataChange("size", v)}
      />
      <div className="settings-row-full">
        <Label className="settings-label">URL</Label>
        <Input
          value={(block.data?.href as string) || ""}
          onChange={(e) => handleDataChange("href", e.target.value)}
          placeholder="https://..."
          className="settings-input"
        />
      </div>
    </SettingsSection>
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
    <SettingsSection title="Block Data" icon={<Box className="h-4 w-4" />}>
      <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
        {JSON.stringify(block.data, null, 2)}
      </pre>
    </SettingsSection>
  );
}
