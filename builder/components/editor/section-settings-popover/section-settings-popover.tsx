"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PositionPicker } from "@/components/ui/position-picker";
import { VisibilityToggles } from "@/components/ui/visibility-toggles";
import { ResponsiveField, useResponsiveChange } from "../responsive-field";
import { useCurrentBreakpoint } from "@/lib/responsive/context";
import { getResponsiveValue } from "@/lib/responsive";
import type { Section, SectionBackground } from "@/lib/hooks/use-pages";
import { BackgroundEditor } from "@/components/editors";
import { BorderEditor, type BorderValues } from "@/components/editors";
import {
  SPACING_OPTIONS,
  OVERFLOW_OPTIONS,
  SECTION_WIDTH_OPTIONS,
  SECTION_MIN_HEIGHT_OPTIONS,
} from "@/lib/constants";

import "./section-settings-popover.css";

type SectionTab = "spacing" | "background" | "border" | "layout" | "advanced";

interface SectionSettingsPopoverProps {
  section: Section;
  onChange: (section: Section) => void;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Section Settings Popover
 *
 * Five-tab settings panel:
 * - Spacing: Padding, Margin, Gap
 * - Background: Color, Gradient, Image
 * - Border: Sides, Color, Radius, Shadow
 * - Layout: Width, Min Height, Content Position
 * - Advanced: Overflow, Anchor ID, Visibility, CSS Classes
 */
export function SectionSettingsPopover({
  section,
  onChange,
  children,
  open,
  onOpenChange,
}: SectionSettingsPopoverProps) {
  const [tab, setTab] = React.useState<SectionTab>("spacing");
  const breakpoint = useCurrentBreakpoint();

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

  // Section data for responsive handling
  const sectionData = section as unknown as Record<string, unknown>;

  // Responsive change handler
  const handleResponsiveChange = useResponsiveChange(sectionData, (data) => {
    onChange(data as unknown as Section);
  });

  const handleChange = (field: string, value: unknown) => {
    onChange({
      ...section,
      [field]: value,
    });
  };

  // Get responsive value for a field
  const getFieldValue = <T,>(field: string, defaultValue: T): T => {
    return (
      getResponsiveValue<T>(sectionData, field, breakpoint) ?? defaultValue
    );
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="section-settings-popover"
        side="left"
        align="start"
        sideOffset={8}
        collisionPadding={16}
      >
        {/* Tabs */}
        <div className="section-popover-header">
          <div className="section-popover-tabs">
            <button
              className={cn(
                "section-popover-tab",
                tab === "spacing" && "active",
              )}
              onClick={() => setTab("spacing")}
            >
              Spacing
            </button>
            <button
              className={cn(
                "section-popover-tab",
                tab === "background" && "active",
              )}
              onClick={() => setTab("background")}
            >
              BG
            </button>
            <button
              className={cn(
                "section-popover-tab",
                tab === "border" && "active",
              )}
              onClick={() => setTab("border")}
            >
              Border
            </button>
            <button
              className={cn(
                "section-popover-tab",
                tab === "layout" && "active",
              )}
              onClick={() => setTab("layout")}
            >
              Layout
            </button>
            <button
              className={cn(
                "section-popover-tab",
                tab === "advanced" && "active",
              )}
              onClick={() => setTab("advanced")}
            >
              Adv
            </button>
          </div>
        </div>

        <div className="section-settings-content">
          {/* ===================== SPACING TAB ===================== */}
          {tab === "spacing" && (
            <>
              {/* Padding */}
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">PADDING</h4>
                <div className="section-settings-row">
                  <ResponsiveField
                    fieldName="paddingTop"
                    data={sectionData}
                    onChange={(data) => onChange(data as unknown as Section)}
                    label="Top"
                    className="section-settings-field"
                  >
                    <Select
                      value={getFieldValue(
                        "paddingTop",
                        section.spacing || "md",
                      )}
                      onValueChange={(value) =>
                        handleResponsiveChange("paddingTop", value)
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SPACING_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </ResponsiveField>
                  <ResponsiveField
                    fieldName="paddingBottom"
                    data={sectionData}
                    onChange={(data) => onChange(data as unknown as Section)}
                    label="Bottom"
                    className="section-settings-field"
                  >
                    <Select
                      value={getFieldValue(
                        "paddingBottom",
                        section.spacing || "md",
                      )}
                      onValueChange={(value) =>
                        handleResponsiveChange("paddingBottom", value)
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SPACING_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </ResponsiveField>
                </div>
              </div>

              {/* Margin */}
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">MARGIN</h4>
                <div className="section-settings-row">
                  <ResponsiveField
                    fieldName="marginTop"
                    data={sectionData}
                    onChange={(data) => onChange(data as unknown as Section)}
                    label="Top"
                    className="section-settings-field"
                  >
                    <Select
                      value={getFieldValue("marginTop", "none")}
                      onValueChange={(value) =>
                        handleResponsiveChange("marginTop", value)
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SPACING_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </ResponsiveField>
                  <ResponsiveField
                    fieldName="marginBottom"
                    data={sectionData}
                    onChange={(data) => onChange(data as unknown as Section)}
                    label="Bottom"
                    className="section-settings-field"
                  >
                    <Select
                      value={getFieldValue("marginBottom", "none")}
                      onValueChange={(value) =>
                        handleResponsiveChange("marginBottom", value)
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SPACING_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </ResponsiveField>
                </div>
              </div>

              {/* Gap */}
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">
                  GAP (BETWEEN CONTAINERS)
                </h4>
                <Select
                  value={section.gapY || "md"}
                  onValueChange={(value) => handleChange("gapY", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SPACING_OPTIONS.slice(0, 7).map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* ===================== BACKGROUND TAB ===================== */}
          {tab === "background" && (
            <div className="section-settings-section">
              <BackgroundEditor
                value={background}
                onChange={(bg) => handleChange("background", bg)}
                showTitle={true}
              />
            </div>
          )}

          {/* ===================== BORDER TAB ===================== */}
          {tab === "border" && (
            <div className="section-settings-section">
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
                showTitles={true}
              />
            </div>
          )}

          {/* ===================== LAYOUT TAB ===================== */}
          {tab === "layout" && (
            <>
              {/* Width */}
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">MAX WIDTH</h4>
                <Select
                  value={section.width || "wide"}
                  onValueChange={(value) => handleChange("width", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTION_WIDTH_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Min Height */}
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">MIN HEIGHT</h4>
                <Select
                  value={section.minHeight || "none"}
                  onValueChange={(value) => handleChange("minHeight", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTION_MIN_HEIGHT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Content Position - only show when minHeight is set */}
              {section.minHeight && section.minHeight !== "none" && (
                <div className="section-settings-section">
                  <h4 className="section-settings-section-title">
                    CONTENT POSITION
                  </h4>
                  <div className="section-settings-position-row">
                    <PositionPicker
                      horizontal={
                        (section.align as "left" | "center" | "right") || "left"
                      }
                      vertical={
                        (section.verticalAlign as
                          | "top"
                          | "center"
                          | "bottom") || "top"
                      }
                      onChange={(h, v) => {
                        onChange({
                          ...section,
                          align: h,
                          verticalAlign: v,
                        });
                      }}
                    />
                    <div className="section-settings-position-labels">
                      <span className="text-xs text-(--builder-muted-foreground)">
                        {section.verticalAlign || "top"}{" "}
                        {section.align || "left"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ===================== ADVANCED TAB ===================== */}
          {tab === "advanced" && (
            <>
              {/* Overflow */}
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">OVERFLOW</h4>
                <div className="section-settings-row">
                  <div className="section-settings-field">
                    <Label className="section-settings-label">X</Label>
                    <Select
                      value={section.overflowX || section.overflow || "visible"}
                      onValueChange={(value) =>
                        handleChange("overflowX", value)
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OVERFLOW_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="section-settings-field">
                    <Label className="section-settings-label">Y</Label>
                    <Select
                      value={section.overflowY || section.overflow || "visible"}
                      onValueChange={(value) =>
                        handleChange("overflowY", value)
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OVERFLOW_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Anchor ID */}
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">ANCHOR ID</h4>
                <Input
                  placeholder="e.g. hero, features, contact"
                  className="h-8"
                  value={section.anchorId || ""}
                  onChange={(e) => handleChange("anchorId", e.target.value)}
                />
                <p className="section-settings-help">
                  Use for in-page links: #{section.anchorId || "anchor"}
                </p>
              </div>

              {/* Visibility */}
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">VISIBILITY</h4>
                <p className="section-settings-help mb-2">
                  Click to hide on specific breakpoints
                </p>
                <VisibilityToggles
                  hideOn={section.hideOn}
                  onChange={(hideOn) => handleChange("hideOn", hideOn)}
                />
              </div>

              {/* Custom CSS Classes */}
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">CSS CLASSES</h4>
                <Input
                  placeholder="e.g. my-custom-class"
                  className="h-8"
                  value={section.customClasses || ""}
                  onChange={(e) =>
                    handleChange("customClasses", e.target.value)
                  }
                />
                <p className="section-settings-help">
                  Add custom Tailwind or CSS classes
                </p>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
