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
import { LayoutGrid, Image as ImageIcon, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColorPicker } from "@/components/ui/color-picker";
import { PositionPicker } from "@/components/ui/position-picker";
import { VisibilityToggles } from "@/components/ui/visibility-toggles";
import { ResponsiveField, useResponsiveChange } from "../responsive-field";
import { useCurrentBreakpoint } from "@/lib/responsive/context";
import { getResponsiveValue } from "@/lib/responsive";
import type { Section, SectionBackground } from "@/lib/hooks/use-pages";

import "./section-settings-popover.css";

type SectionTab = "spacing" | "background" | "border" | "layout" | "advanced";

interface SectionSettingsPopoverProps {
  section: Section;
  onChange: (section: Section) => void;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Spacing size options
const SPACING_OPTIONS = [
  { value: "none", label: "None" },
  { value: "xs", label: "XS" },
  { value: "sm", label: "SM" },
  { value: "md", label: "MD" },
  { value: "lg", label: "LG" },
  { value: "xl", label: "XL" },
  { value: "2xl", label: "2XL" },
  { value: "3xl", label: "3XL" },
];

// Border size options
const BORDER_OPTIONS = [
  { value: "none", label: "None" },
  { value: "thin", label: "Thin" },
  { value: "medium", label: "Medium" },
  { value: "thick", label: "Thick" },
];

// Border radius options
const RADIUS_OPTIONS = [
  { value: "none", label: "None" },
  { value: "sm", label: "SM" },
  { value: "md", label: "MD" },
  { value: "lg", label: "LG" },
  { value: "xl", label: "XL" },
  { value: "2xl", label: "2XL" },
  { value: "full", label: "Full" },
];

// Shadow options
const SHADOW_OPTIONS = [
  { value: "none", label: "None" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "X-Large" },
  { value: "inner", label: "Inner" },
];

// Overflow options
const OVERFLOW_OPTIONS = [
  { value: "visible", label: "Visible" },
  { value: "hidden", label: "Hidden" },
  { value: "scroll", label: "Scroll" },
  { value: "auto", label: "Auto" },
];

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

  const handleBackgroundChange = (bg: Partial<SectionBackground>) => {
    const newBg = { ...background, ...bg };
    onChange({
      ...section,
      background: newBg,
    });
  };

  // Check if any border is set
  const hasBorder =
    (section.borderTop && section.borderTop !== "none") ||
    (section.borderBottom && section.borderBottom !== "none") ||
    (section.borderLeft && section.borderLeft !== "none") ||
    (section.borderRight && section.borderRight !== "none");

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
            <>
              {/* Background Type */}
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">TYPE</h4>
                <div className="section-settings-bg-types">
                  <button
                    className={cn(
                      "section-settings-bg-type",
                      background.type === "none" && "active",
                    )}
                    onClick={() => handleBackgroundChange({ type: "none" })}
                    title="None"
                  >
                    <span className="section-settings-bg-type-icon">∅</span>
                  </button>
                  <button
                    className={cn(
                      "section-settings-bg-type",
                      background.type === "color" && "active",
                    )}
                    onClick={() =>
                      handleBackgroundChange({
                        type: "color",
                        color: background.color || "#f5f5f5",
                      })
                    }
                    title="Color"
                  >
                    <Palette className="h-4 w-4" />
                  </button>
                  <button
                    className={cn(
                      "section-settings-bg-type",
                      background.type === "gradient" && "active",
                    )}
                    onClick={() =>
                      handleBackgroundChange({
                        type: "gradient",
                        gradient: background.gradient || {
                          type: "linear",
                          angle: 180,
                          stops: [
                            { color: "#f5f5f5", position: 0 },
                            { color: "#e5e5e5", position: 100 },
                          ],
                        },
                      })
                    }
                    title="Gradient"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    className={cn(
                      "section-settings-bg-type",
                      background.type === "image" && "active",
                    )}
                    onClick={() =>
                      handleBackgroundChange({
                        type: "image",
                        image: background.image || {
                          src: "",
                          size: "cover",
                          position: "center",
                        },
                      })
                    }
                    title="Image"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Color Background */}
                {background.type === "color" && (
                  <div className="section-settings-field mt-3">
                    <ColorPicker
                      label="Color"
                      value={background.color || "#f5f5f5"}
                      onChange={(value) =>
                        handleBackgroundChange({ color: value })
                      }
                    />
                  </div>
                )}

                {/* Gradient Background */}
                {background.type === "gradient" && background.gradient && (
                  <div className="section-settings-field mt-3 space-y-3">
                    <div className="section-settings-row">
                      <div className="section-settings-field">
                        <Label className="section-settings-label">Type</Label>
                        <Select
                          value={background.gradient.type}
                          onValueChange={(value) =>
                            handleBackgroundChange({
                              gradient: {
                                ...background.gradient!,
                                type: value as "linear" | "radial",
                              },
                            })
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="linear">Linear</SelectItem>
                            <SelectItem value="radial">Radial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {background.gradient.type === "linear" && (
                        <div className="section-settings-field">
                          <Label className="section-settings-label">
                            Angle
                          </Label>
                          <Input
                            type="number"
                            className="h-8"
                            value={background.gradient.angle || 180}
                            onChange={(e) =>
                              handleBackgroundChange({
                                gradient: {
                                  ...background.gradient!,
                                  angle: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                            min={0}
                            max={360}
                          />
                        </div>
                      )}
                    </div>
                    <div className="section-settings-row">
                      <ColorPicker
                        label="Start"
                        value={background.gradient.stops[0]?.color || "#f5f5f5"}
                        onChange={(value) =>
                          handleBackgroundChange({
                            gradient: {
                              ...background.gradient!,
                              stops: [
                                { color: value, position: 0 },
                                background.gradient!.stops[1] || {
                                  color: "#e5e5e5",
                                  position: 100,
                                },
                              ],
                            },
                          })
                        }
                      />
                      <ColorPicker
                        label="End"
                        value={background.gradient.stops[1]?.color || "#e5e5e5"}
                        onChange={(value) =>
                          handleBackgroundChange({
                            gradient: {
                              ...background.gradient!,
                              stops: [
                                background.gradient!.stops[0] || {
                                  color: "#f5f5f5",
                                  position: 0,
                                },
                                { color: value, position: 100 },
                              ],
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Image Background */}
                {background.type === "image" && (
                  <div className="section-settings-field mt-3 space-y-3">
                    <div className="section-settings-field">
                      <Label className="section-settings-label">
                        Image URL
                      </Label>
                      <Input
                        placeholder="https://..."
                        className="h-8"
                        value={background.image?.src || ""}
                        onChange={(e) =>
                          handleBackgroundChange({
                            image: { ...background.image, src: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="section-settings-row">
                      <div className="section-settings-field">
                        <Label className="section-settings-label">Size</Label>
                        <Select
                          value={background.image?.size || "cover"}
                          onValueChange={(value) =>
                            handleBackgroundChange({
                              image: {
                                ...background.image!,
                                size: value as "cover" | "contain" | "auto",
                              },
                            })
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cover">Cover</SelectItem>
                            <SelectItem value="contain">Contain</SelectItem>
                            <SelectItem value="auto">Auto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="section-settings-field">
                        <Label className="section-settings-label">
                          Position
                        </Label>
                        <Select
                          value={background.image?.position || "center"}
                          onValueChange={(value) =>
                            handleBackgroundChange({
                              image: { ...background.image!, position: value },
                            })
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="top">Top</SelectItem>
                            <SelectItem value="bottom">Bottom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <ColorPicker
                      label="Overlay"
                      value={background.image?.overlay || "transparent"}
                      onChange={(value) =>
                        handleBackgroundChange({
                          image: { ...background.image!, overlay: value },
                        })
                      }
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* ===================== BORDER TAB ===================== */}
          {tab === "border" && (
            <>
              {/* Border Sides */}
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">BORDER</h4>
                <div className="section-settings-row">
                  <div className="section-settings-field">
                    <Label className="section-settings-label">Top</Label>
                    <Select
                      value={section.borderTop || "none"}
                      onValueChange={(value) =>
                        handleChange("borderTop", value)
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BORDER_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="section-settings-field">
                    <Label className="section-settings-label">Bottom</Label>
                    <Select
                      value={section.borderBottom || "none"}
                      onValueChange={(value) =>
                        handleChange("borderBottom", value)
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BORDER_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="section-settings-row mt-2">
                  <div className="section-settings-field">
                    <Label className="section-settings-label">Left</Label>
                    <Select
                      value={section.borderLeft || "none"}
                      onValueChange={(value) =>
                        handleChange("borderLeft", value)
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BORDER_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="section-settings-field">
                    <Label className="section-settings-label">Right</Label>
                    <Select
                      value={section.borderRight || "none"}
                      onValueChange={(value) =>
                        handleChange("borderRight", value)
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BORDER_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {hasBorder && (
                  <div className="section-settings-field mt-2">
                    <ColorPicker
                      label="Border Color"
                      value={section.borderColor || "#e5e5e5"}
                      onChange={(value) => handleChange("borderColor", value)}
                    />
                  </div>
                )}
              </div>

              {/* Border Radius */}
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">ROUNDED</h4>
                <Select
                  value={section.borderRadius || "none"}
                  onValueChange={(value) => handleChange("borderRadius", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RADIUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Shadow */}
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">SHADOW</h4>
                <Select
                  value={section.shadow || "none"}
                  onValueChange={(value) => handleChange("shadow", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SHADOW_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
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
                    <SelectItem value="narrow">Narrow (768px)</SelectItem>
                    <SelectItem value="container">
                      Container (1280px)
                    </SelectItem>
                    <SelectItem value="wide">Wide (1536px)</SelectItem>
                    <SelectItem value="full">Full Width</SelectItem>
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
                    <SelectItem value="none">Auto</SelectItem>
                    <SelectItem value="sm">Small (300px)</SelectItem>
                    <SelectItem value="md">Medium (400px)</SelectItem>
                    <SelectItem value="lg">Large (500px)</SelectItem>
                    <SelectItem value="xl">X-Large (600px)</SelectItem>
                    <SelectItem value="screen">Full Screen (100vh)</SelectItem>
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
