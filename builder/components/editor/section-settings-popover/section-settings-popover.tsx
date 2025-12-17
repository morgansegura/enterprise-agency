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
import { ResponsiveField, useResponsiveChange } from "../responsive-field";
import { useCurrentBreakpoint } from "@/lib/responsive/context";
import { getResponsiveValue } from "@/lib/responsive";
import type { Section, SectionBackground } from "@/lib/hooks/use-pages";

import "./section-settings-popover.css";

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
 * Wrapper/Section settings:
 * - Background (color/gradient/image)
 * - Spacing (paddingY top/bottom)
 */
export function SectionSettingsPopover({
  section,
  onChange,
  children,
  open,
  onOpenChange,
}: SectionSettingsPopoverProps) {
  const breakpoint = useCurrentBreakpoint();

  // Get background as object (normalize from string if legacy)
  const getBackground = (): SectionBackground => {
    if (!section.background) return { type: "none" };
    if (typeof section.background === "string") {
      // Legacy string format - convert to object
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

  const handleWrapperChange = (field: string, value: unknown) => {
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
        {/* Header */}
        <div className="section-popover-header">
          <span className="text-xs font-semibold text-(--muted-foreground) uppercase tracking-wide">
            Section
          </span>
        </div>

        <div className="section-settings-content">
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
                  label="Background Color"
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
                    placeholder="https://... or select from media"
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
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <ColorPicker
                  label="Overlay Color"
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
                label="Padding Top"
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
                    <SelectItem value="none">None (0)</SelectItem>
                    <SelectItem value="xs">XS (8px)</SelectItem>
                    <SelectItem value="sm">SM (16px)</SelectItem>
                    <SelectItem value="md">MD (32px)</SelectItem>
                    <SelectItem value="lg">LG (48px)</SelectItem>
                    <SelectItem value="xl">XL (64px)</SelectItem>
                    <SelectItem value="2xl">2XL (96px)</SelectItem>
                    <SelectItem value="3xl">3XL (128px)</SelectItem>
                    <SelectItem value="4xl">4XL (160px)</SelectItem>
                    <SelectItem value="5xl">5XL (192px)</SelectItem>
                    <SelectItem value="6xl">6XL (224px)</SelectItem>
                    <SelectItem value="7xl">7XL (256px)</SelectItem>
                  </SelectContent>
                </Select>
              </ResponsiveField>
              <ResponsiveField
                fieldName="paddingBottom"
                data={sectionData}
                onChange={(data) => onChange(data as unknown as Section)}
                label="Padding Bottom"
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
                    <SelectItem value="none">None (0)</SelectItem>
                    <SelectItem value="xs">XS (8px)</SelectItem>
                    <SelectItem value="sm">SM (16px)</SelectItem>
                    <SelectItem value="md">MD (32px)</SelectItem>
                    <SelectItem value="lg">LG (48px)</SelectItem>
                    <SelectItem value="xl">XL (64px)</SelectItem>
                    <SelectItem value="2xl">2XL (96px)</SelectItem>
                    <SelectItem value="3xl">3XL (128px)</SelectItem>
                    <SelectItem value="4xl">4XL (160px)</SelectItem>
                    <SelectItem value="5xl">5XL (192px)</SelectItem>
                    <SelectItem value="6xl">6XL (224px)</SelectItem>
                    <SelectItem value="7xl">7XL (256px)</SelectItem>
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
                  onValueChange={(value) =>
                    handleWrapperChange("borderTop", value)
                  }
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
                  onValueChange={(value) =>
                    handleWrapperChange("borderBottom", value)
                  }
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
          </div>

          {/* Shadow */}
          <div className="section-settings-section">
            <h4 className="section-settings-section-title">SHADOW</h4>
            <div className="section-settings-field">
              <Select
                value={section.shadow || "none"}
                onValueChange={(value) => handleWrapperChange("shadow", value)}
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
          </div>

          {/* Width */}
          <div className="section-settings-section">
            <h4 className="section-settings-section-title">WIDTH</h4>
            <div className="section-settings-field">
              <Select
                value={section.width || "wide"}
                onValueChange={(value) => handleWrapperChange("width", value)}
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
          </div>

          {/* Min Height */}
          <div className="section-settings-section">
            <h4 className="section-settings-section-title">MIN HEIGHT</h4>
            <div className="section-settings-field">
              <Select
                value={section.minHeight || "none"}
                onValueChange={(value) =>
                  handleWrapperChange("minHeight", value)
                }
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
                  <SelectItem value="screen">Full Screen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content Alignment */}
          <div className="section-settings-section">
            <h4 className="section-settings-section-title">ALIGNMENT</h4>
            <div className="section-settings-row">
              <div className="section-settings-field">
                <Label className="section-settings-label">Horizontal</Label>
                <Select
                  value={section.align || "left"}
                  onValueChange={(value) => handleWrapperChange("align", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="section-settings-field">
                <Label className="section-settings-label">Vertical</Label>
                <Select
                  value={section.verticalAlign || "top"}
                  onValueChange={(value) =>
                    handleWrapperChange("verticalAlign", value)
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
