"use client";

import * as React from "react";
import { Type, Palette, AlignLeft } from "lucide-react";
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

interface TextSettingsProps {
  block: Block;
  onChange: (block: Block) => void;
}

// =============================================================================
// Options
// =============================================================================

const SIZE_OPTIONS = [
  { value: "xs", label: "XS" },
  { value: "sm", label: "SM" },
  { value: "base", label: "Base" },
  { value: "lg", label: "LG" },
  { value: "xl", label: "XL" },
];

const WEIGHT_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "medium", label: "Medium" },
  { value: "semibold", label: "Semi" },
  { value: "bold", label: "Bold" },
];

const ALIGN_OPTIONS = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
  { value: "justify", label: "Justify" },
];

const COLOR_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "muted", label: "Muted" },
  { value: "accent", label: "Accent" },
];

const LINE_HEIGHT_OPTIONS = [
  { value: "tight", label: "Tight" },
  { value: "normal", label: "Normal" },
  { value: "relaxed", label: "Relaxed" },
  { value: "loose", label: "Loose" },
];

// =============================================================================
// Text Settings Component
// =============================================================================

export function TextSettings({ block, onChange }: TextSettingsProps) {
  const handleDataChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...block.data, [field]: value } });
  };

  return (
    <>
      {/* Typography */}
      <PropertySection
        title="Typography"
        icon={<Type className="h-3.5 w-3.5" />}
      >
        <PropertyRow label="Size">
          <PropertySelect
            value={(block.data?.size as string) || "base"}
            options={SIZE_OPTIONS}
            onChange={(v) => handleDataChange("size", v)}
          />
        </PropertyRow>
        <PropertyRow label="Weight">
          <PropertySelect
            value={(block.data?.weight as string) || "normal"}
            options={WEIGHT_OPTIONS}
            onChange={(v) => handleDataChange("weight", v)}
          />
        </PropertyRow>
        <PropertyRow label="Line Height">
          <PropertySelect
            value={(block.data?.lineHeight as string) || "normal"}
            options={LINE_HEIGHT_OPTIONS}
            onChange={(v) => handleDataChange("lineHeight", v)}
          />
        </PropertyRow>
      </PropertySection>

      {/* Alignment */}
      <PropertySection
        title="Alignment"
        icon={<AlignLeft className="h-3.5 w-3.5" />}
      >
        <PropertyRow label="Text Align" stacked>
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
    </>
  );
}
