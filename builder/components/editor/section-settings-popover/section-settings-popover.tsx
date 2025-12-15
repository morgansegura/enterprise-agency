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

  const handleWrapperChange = (field: string, value: unknown) => {
    onChange({
      ...section,
      [field]: value,
    });
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
              <div className="section-settings-field">
                <Label className="section-settings-label">Padding Top</Label>
                <Select
                  value={section.paddingTop || section.spacing || "md"}
                  onValueChange={(value) =>
                    handleWrapperChange("paddingTop", value)
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="xs">Extra Small</SelectItem>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="xl">Extra Large</SelectItem>
                    <SelectItem value="2xl">2X Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="section-settings-field">
                <Label className="section-settings-label">Padding Bottom</Label>
                <Select
                  value={section.paddingBottom || section.spacing || "md"}
                  onValueChange={(value) =>
                    handleWrapperChange("paddingBottom", value)
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="xs">Extra Small</SelectItem>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="xl">Extra Large</SelectItem>
                    <SelectItem value="2xl">2X Large</SelectItem>
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
