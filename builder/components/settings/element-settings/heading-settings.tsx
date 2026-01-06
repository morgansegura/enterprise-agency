"use client";

import * as React from "react";
import { Type, Palette, AlignLeft, Settings2 } from "lucide-react";
import {
  PropertySection,
  PropertyRow,
  PropertyToggle,
  PropertySelect,
} from "@/components/editor/settings-panel/components";
import type { Block } from "@/lib/types/section";

// =============================================================================
// Types
// =============================================================================

interface HeadingSettingsProps {
  block: Block;
  onChange: (block: Block) => void;
}

// =============================================================================
// Options
// =============================================================================

const LEVEL_OPTIONS = [
  { value: "h1", label: "H1" },
  { value: "h2", label: "H2" },
  { value: "h3", label: "H3" },
  { value: "h4", label: "H4" },
  { value: "h5", label: "H5" },
  { value: "h6", label: "H6" },
];

// Full size range - fluid scaling built in
const SIZE_OPTIONS = [
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

// Full weight range
const WEIGHT_OPTIONS = [
  { value: "thin", label: "Thin" },
  { value: "extralight", label: "Extra Light" },
  { value: "light", label: "Light" },
  { value: "normal", label: "Normal" },
  { value: "medium", label: "Medium" },
  { value: "semibold", label: "Semibold" },
  { value: "bold", label: "Bold" },
  { value: "extrabold", label: "Extra Bold" },
  { value: "black", label: "Black" },
];

const ALIGN_OPTIONS = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
];

const COLOR_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "muted", label: "Muted" },
  { value: "accent", label: "Accent" },
  { value: "destructive", label: "Destructive" },
];

// Letter spacing (tracking)
const LETTER_SPACING_OPTIONS = [
  { value: "tighter", label: "Tighter" },
  { value: "tight", label: "Tight" },
  { value: "normal", label: "Normal" },
  { value: "wide", label: "Wide" },
  { value: "wider", label: "Wider" },
  { value: "widest", label: "Widest" },
];

// Line height (leading) - override the size default
// Note: "auto" is a sentinel value meaning "use size-specific default"
const LINE_HEIGHT_OPTIONS = [
  { value: "auto", label: "Default" },
  { value: "none", label: "None (1)" },
  { value: "tight", label: "Tight (1.25)" },
  { value: "snug", label: "Snug (1.375)" },
  { value: "normal", label: "Normal (1.5)" },
  { value: "relaxed", label: "Relaxed (1.625)" },
  { value: "loose", label: "Loose (2)" },
];

// =============================================================================
// Heading Settings Component
// =============================================================================

export function HeadingSettings({ block, onChange }: HeadingSettingsProps) {
  const handleDataChange = (field: string, value: unknown) => {
    // If value is "auto" or empty string, remove the field (use default)
    if (value === "" || value === "auto") {
      const newData = { ...block.data };
      delete newData[field];
      onChange({ ...block, data: newData });
    } else {
      onChange({ ...block, data: { ...block.data, [field]: value } });
    }
  };

  return (
    <>
      {/* Typography - Main Settings */}
      <PropertySection title="Typography" icon={<Type className="h-3.5 w-3.5" />}>
        <PropertyRow label="Level" stacked>
          <PropertyToggle
            value={(block.data?.level as string) || "h2"}
            options={LEVEL_OPTIONS}
            onChange={(v) => handleDataChange("level", v)}
            fullWidth
          />
        </PropertyRow>
        <PropertyRow label="Size">
          <PropertySelect
            value={(block.data?.size as string) || "2xl"}
            options={SIZE_OPTIONS}
            onChange={(v) => handleDataChange("size", v)}
          />
        </PropertyRow>
        <PropertyRow label="Weight">
          <PropertySelect
            value={(block.data?.weight as string) || "semibold"}
            options={WEIGHT_OPTIONS}
            onChange={(v) => handleDataChange("weight", v)}
          />
        </PropertyRow>
        <PropertyRow label="Align" stacked>
          <PropertyToggle
            value={(block.data?.align as string) || "left"}
            options={ALIGN_OPTIONS}
            onChange={(v) => handleDataChange("align", v)}
            fullWidth
          />
        </PropertyRow>
      </PropertySection>

      {/* Color */}
      <PropertySection
        title="Color"
        icon={<Palette className="h-3.5 w-3.5" />}
        defaultOpen={false}
      >
        <PropertyRow label="Text Color">
          <PropertySelect
            value={(block.data?.color as string) || "default"}
            options={COLOR_OPTIONS}
            onChange={(v) => handleDataChange("color", v)}
          />
        </PropertyRow>
      </PropertySection>

      {/* Advanced Typography */}
      <PropertySection
        title="Advanced"
        icon={<Settings2 className="h-3.5 w-3.5" />}
        defaultOpen={false}
      >
        <PropertyRow label="Tracking">
          <PropertySelect
            value={(block.data?.letterSpacing as string) || "normal"}
            options={LETTER_SPACING_OPTIONS}
            onChange={(v) => handleDataChange("letterSpacing", v)}
          />
        </PropertyRow>
        <PropertyRow label="Leading">
          <PropertySelect
            value={(block.data?.lineHeight as string) || "auto"}
            options={LINE_HEIGHT_OPTIONS}
            onChange={(v) => handleDataChange("lineHeight", v)}
          />
        </PropertyRow>
      </PropertySection>
    </>
  );
}
