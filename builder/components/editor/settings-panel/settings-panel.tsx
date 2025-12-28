"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  PanelRightClose,
  PanelRightOpen,
  LayoutTemplate,
  Box,
  Type,
  X,
} from "lucide-react";
import { useUIStore } from "@/lib/stores/ui-store";
import type { Section, Container, Block } from "@/lib/types/section";
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
    clearSelection,
  } = useUIStore();

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

  // Get icon for selected element type
  const getIcon = () => {
    if (!selectedElement) return null;
    switch (selectedElement.type) {
      case "section":
        return <LayoutTemplate className="h-4 w-4" />;
      case "container":
        return <Box className="h-4 w-4" />;
      case "block":
        return <Type className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Get title for selected element
  const getTitle = () => {
    if (!selectedElement || !selectedData) return "Settings";
    switch (selectedElement.type) {
      case "section":
        return "Section Settings";
      case "container":
        return "Container Settings";
      case "block":
        return `${(selectedData.data as Block)._type.replace("-block", "")} Block`;
      default:
        return "Settings";
    }
  };

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
        <div className="settings-panel-header-title">
          {getIcon()}
          <span>{getTitle()}</span>
        </div>
        <div className="settings-panel-header-actions">
          {selectedElement && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSelection}
              title="Clear selection"
              className="h-7 w-7"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRightPanel}
            title="Close settings panel"
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
            <LayoutTemplate className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Select a section, container, or block to edit its settings
            </p>
          </div>
        ) : selectedData ? (
          <div className="settings-panel-form">
            {selectedElement.type === "section" && (
              <SectionSettings
                section={selectedData.data as Section}
                onChange={(updated) =>
                  onSectionChange?.(selectedElement.sectionIndex, updated)
                }
              />
            )}
            {selectedElement.type === "container" && (
              <ContainerSettings
                container={selectedData.data as Container}
                onChange={(updated) =>
                  onContainerChange?.(
                    selectedElement.sectionIndex,
                    selectedElement.containerIndex!,
                    updated
                  )
                }
              />
            )}
            {selectedElement.type === "block" && (
              <BlockSettings
                block={selectedData.data as Block}
                onChange={(updated) =>
                  onBlockChange?.(
                    selectedElement.sectionIndex,
                    selectedElement.containerIndex!,
                    selectedElement.blockIndex!,
                    updated
                  )
                }
              />
            )}
          </div>
        ) : (
          <div className="settings-panel-empty">
            <p className="text-sm text-muted-foreground">
              Selected element not found
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

// =============================================================================
// Section Settings (placeholder - will import from section-settings-popover)
// =============================================================================

function SectionSettings({
  section,
  onChange: _onChange,
}: {
  section: Section;
  onChange: (section: Section) => void;
}) {
  return (
    <div className="space-y-4 p-4">
      <p className="text-sm text-muted-foreground">
        Section settings will be integrated here.
      </p>
      <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-60">
        {JSON.stringify(section, null, 2)}
      </pre>
    </div>
  );
}

// =============================================================================
// Container Settings (placeholder)
// =============================================================================

function ContainerSettings({
  container,
  onChange: _onChange,
}: {
  container: Container;
  onChange: (container: Container) => void;
}) {
  return (
    <div className="space-y-4 p-4">
      <p className="text-sm text-muted-foreground">
        Container settings will be integrated here.
      </p>
      <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-60">
        {JSON.stringify(container, null, 2)}
      </pre>
    </div>
  );
}

// =============================================================================
// Block Settings (placeholder)
// =============================================================================

function BlockSettings({
  block,
  onChange: _onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  return (
    <div className="space-y-4 p-4">
      <p className="text-sm text-muted-foreground">
        Block settings will be integrated here.
      </p>
      <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-60">
        {JSON.stringify(block, null, 2)}
      </pre>
    </div>
  );
}
