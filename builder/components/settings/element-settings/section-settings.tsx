"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Grid3X3, Move, Palette, Box, Settings2, EyeOff } from "lucide-react";
import {
  PropertySection,
  PropertyRow,
  PropertyToggle,
  PropertySelect,
} from "@/components/editor/settings-panel/components";
import { BackgroundEditor } from "@/components/editors";
import { BorderEditor, type BorderValues } from "@/components/editors";
import { VisibilityToggles } from "@/components/ui/visibility-toggles";
import { PositionPicker } from "@/components/ui/position-picker";
import {
  SPACING_OPTIONS,
  EXTENDED_SPACING_OPTIONS,
  SECTION_MIN_HEIGHT_OPTIONS,
  OVERFLOW_OPTIONS,
} from "@/lib/constants";
import type { Section, SectionBackground } from "@/lib/types/section";

// =============================================================================
// Types
// =============================================================================

interface SectionSettingsProps {
  section: Section;
  onChange: (section: Section) => void;
  tab?: "style" | "settings";
}

// =============================================================================
// Width Options
// =============================================================================

const WIDTH_OPTIONS = [
  { value: "narrow", label: "Narrow" },
  { value: "container", label: "Container" },
  { value: "wide", label: "Wide" },
  { value: "full", label: "Full" },
];

// =============================================================================
// Section Settings Component
// =============================================================================

export function SectionSettings({
  section,
  onChange,
  tab = "style",
}: SectionSettingsProps) {
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
            options={WIDTH_OPTIONS}
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
              <span className="text-xs text-(--muted-foreground)">
                {section.verticalAlign || "top"} / {section.align || "left"}
              </span>
            </div>
          </PropertyRow>
        )}
      </PropertySection>

      {/* Spacing */}
      <PropertySection title="Spacing" icon={<Move className="h-3.5 w-3.5" />}>
        <PropertyRow label="Padding Top">
          <PropertySelect
            value={section.paddingTop || section.paddingY || "md"}
            options={EXTENDED_SPACING_OPTIONS}
            onChange={(v) => handleChange("paddingTop", v)}
          />
        </PropertyRow>
        <PropertyRow label="Padding Bottom">
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
        <PropertyRow label="Margin Bottom">
          <PropertySelect
            value={section.marginBottom || "none"}
            options={SPACING_OPTIONS}
            onChange={(v) => handleChange("marginBottom", v)}
          />
        </PropertyRow>
        <PropertyRow label="Gap Between Containers">
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
