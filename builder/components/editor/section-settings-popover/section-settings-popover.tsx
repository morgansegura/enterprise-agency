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

type SectionTab = "layout" | "style" | "advanced";

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
 * Three-tab settings panel:
 * - Layout: Width, Min Height, Content Position
 * - Style: Background, Spacing, Border, Shadow
 * - Advanced: Anchor ID, Visibility, Overflow, CSS Classes
 */
export function SectionSettingsPopover({
  section,
  onChange,
  children,
  open,
  onOpenChange,
}: SectionSettingsPopoverProps) {
  const [tab, setTab] = React.useState<SectionTab>("layout");
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
              className={cn("section-popover-tab", tab === "layout" && "active")}
              onClick={() => setTab("layout")}
            >
              Layout
            </button>
            <button
              className={cn("section-popover-tab", tab === "style" && "active")}
              onClick={() => setTab("style")}
            >
              Style
            </button>
            <button
              className={cn("section-popover-tab", tab === "advanced" && "active")}
              onClick={() => setTab("advanced")}
            >
              Advanced
            </button>
          </div>
        </div>

        <div className="section-settings-content">
          {/* ===================== LAYOUT TAB ===================== */}
          {tab === "layout" && (
            <>
              {/* Width */}
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">WIDTH</h4>
                <Select
                  value={section.width || "wide"}
                  onValueChange={(value) => handleChange("width", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="narrow">Narrow (768px)</SelectItem>
                    <SelectItem value="container">Container (1280px)</SelectItem>
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
                    <SelectItem value="xl">Extra Large (600px)</SelectItem>
                    <SelectItem value="screen">Full Screen (100vh)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Content Position */}
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">CONTENT POSITION</h4>
                <div className="section-settings-position-row">
                  <PositionPicker
                    horizontal={(section.align as "left" | "center" | "right") || "left"}
                    vertical={(section.verticalAlign as "top" | "center" | "bottom") || "top"}
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
                      {section.verticalAlign || "top"} {section.align || "left"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ===================== STYLE TAB ===================== */}
          {tab === "style" && (
            <>
              {/* Background Type */}
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">BACKGROUND</h4>
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
                      onChange={(value) => handleBackgroundChange({ color: value })}
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
                          <Label className="section-settings-label">Angle</Label>
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
                      <Label className="section-settings-label">Image URL</Label>
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
                        <Label className="section-settings-label">Position</Label>
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

              {/* Spacing */}
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">SPACING</h4>
                <div className="section-settings-row">
                  <ResponsiveField
                    fieldName="paddingTop"
                    data={sectionData}
                    onChange={(data) => onChange(data as unknown as Section)}
                    label="Top"
                    className="section-settings-field"
                  >
                    <Select
                      value={getFieldValue("paddingTop", section.spacing || "md")}
                      onValueChange={(value) =>
                        handleResponsiveChange("paddingTop", value)
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="xs">XS</SelectItem>
                        <SelectItem value="sm">SM</SelectItem>
                        <SelectItem value="md">MD</SelectItem>
                        <SelectItem value="lg">LG</SelectItem>
                        <SelectItem value="xl">XL</SelectItem>
                        <SelectItem value="2xl">2XL</SelectItem>
                        <SelectItem value="3xl">3XL</SelectItem>
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
                      value={getFieldValue("paddingBottom", section.spacing || "md")}
                      onValueChange={(value) =>
                        handleResponsiveChange("paddingBottom", value)
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="xs">XS</SelectItem>
                        <SelectItem value="sm">SM</SelectItem>
                        <SelectItem value="md">MD</SelectItem>
                        <SelectItem value="lg">LG</SelectItem>
                        <SelectItem value="xl">XL</SelectItem>
                        <SelectItem value="2xl">2XL</SelectItem>
                        <SelectItem value="3xl">3XL</SelectItem>
                      </SelectContent>
                    </Select>
                  </ResponsiveField>
                </div>
              </div>

              {/* Border */}
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">BORDER</h4>
                <div className="section-settings-row">
                  <div className="section-settings-field">
                    <Label className="section-settings-label">Top</Label>
                    <Select
                      value={section.borderTop || "none"}
                      onValueChange={(value) => handleChange("borderTop", value)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="thin">Thin</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="thick">Thick</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="section-settings-field">
                    <Label className="section-settings-label">Bottom</Label>
                    <Select
                      value={section.borderBottom || "none"}
                      onValueChange={(value) => handleChange("borderBottom", value)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="thin">Thin</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="thick">Thick</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {(section.borderTop !== "none" || section.borderBottom !== "none") && (
                  <div className="section-settings-field mt-2">
                    <ColorPicker
                      label="Border Color"
                      value={section.borderColor || "#e5e5e5"}
                      onChange={(value) => handleChange("borderColor", value)}
                    />
                  </div>
                )}
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
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="xl">Extra Large</SelectItem>
                    <SelectItem value="inner">Inner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* ===================== ADVANCED TAB ===================== */}
          {tab === "advanced" && (
            <>
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

              {/* Overflow */}
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">OVERFLOW</h4>
                <Select
                  value={section.overflow || "visible"}
                  onValueChange={(value) => handleChange("overflow", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visible">Visible</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                    <SelectItem value="scroll">Scroll</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom CSS Classes */}
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">CSS CLASSES</h4>
                <Input
                  placeholder="e.g. my-custom-class"
                  className="h-8"
                  value={section.customClasses || ""}
                  onChange={(e) => handleChange("customClasses", e.target.value)}
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
