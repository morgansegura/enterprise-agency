"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Grid3X3, Move, AlignLeft, Settings2 } from "lucide-react";
import {
  PropertySection,
  PropertyRow,
  PropertyToggle,
  PropertySelect,
} from "@/components/editor/settings-panel/components";
import { SPACING_OPTIONS, CONTAINER_WIDTH_OPTIONS } from "@/lib/constants";
import type { Container } from "@/lib/types/section";

// =============================================================================
// Types
// =============================================================================

interface ContainerSettingsProps {
  container: Container;
  onChange: (container: Container) => void;
  tab?: "style" | "settings";
}

// =============================================================================
// Options
// =============================================================================

const DISPLAY_OPTIONS = [
  { value: "stack", label: "Stack" },
  { value: "flex", label: "Flex" },
  { value: "grid", label: "Grid" },
];

const DIRECTION_OPTIONS = [
  { value: "row", label: "Row" },
  { value: "column", label: "Column" },
];

const ALIGN_OPTIONS = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
];

const JUSTIFY_OPTIONS = [
  { value: "start", label: "Start" },
  { value: "center", label: "Center" },
  { value: "end", label: "End" },
  { value: "between", label: "Between" },
  { value: "around", label: "Around" },
];

const ALIGN_ITEMS_OPTIONS = [
  { value: "start", label: "Start" },
  { value: "center", label: "Center" },
  { value: "end", label: "End" },
  { value: "stretch", label: "Stretch" },
];

// =============================================================================
// Container Settings Component
// =============================================================================

export function ContainerSettings({
  container,
  onChange,
  tab = "style",
}: ContainerSettingsProps) {
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...container, [field]: value });
  };

  const handleLayoutChange = (field: string, value: unknown) => {
    onChange({
      ...container,
      layout: { ...container.layout, [field]: value },
    });
  };

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
            options={DISPLAY_OPTIONS}
            onChange={(v) => handleLayoutChange("type", v)}
            fullWidth
          />
        </PropertyRow>

        {container.layout?.type === "flex" && (
          <>
            <PropertyRow label="Direction" stacked>
              <PropertyToggle
                value={container.layout?.direction || "column"}
                options={DIRECTION_OPTIONS}
                onChange={(v) => handleLayoutChange("direction", v)}
                fullWidth
              />
            </PropertyRow>
            <PropertyRow label="Justify">
              <PropertySelect
                value={container.layout?.justify || "start"}
                options={JUSTIFY_OPTIONS}
                onChange={(v) => handleLayoutChange("justify", v)}
              />
            </PropertyRow>
            <PropertyRow label="Align">
              <PropertySelect
                value={container.layout?.align || "stretch"}
                options={ALIGN_ITEMS_OPTIONS}
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
            options={ALIGN_OPTIONS}
            onChange={(v) => handleChange("align", v)}
            fullWidth
          />
        </PropertyRow>
      </PropertySection>
    </>
  );
}
