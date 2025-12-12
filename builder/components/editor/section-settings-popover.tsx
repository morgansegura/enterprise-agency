"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormItem } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import {
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  MoreHorizontal,
  Grid3X3,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Section } from "@/lib/hooks/use-pages";

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
 * Compact popover for section settings with tabs:
 * - Design: Grid, section height, alignment
 * - Background: Color, image, video
 * - Colors: Theme colors for section
 */
export function SectionSettingsPopover({
  section,
  onChange,
  children,
  open,
  onOpenChange,
}: SectionSettingsPopoverProps) {
  // Helper to safely get extended section properties
  const getSectionProp = <T,>(key: string, defaultValue: T): T => {
    return (
      ((section as unknown as Record<string, unknown>)[key] as T) ??
      defaultValue
    );
  };

  const handleChange = (field: string, value: unknown) => {
    onChange({
      ...section,
      [field]: value,
    });
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="section-settings-popover"
        side="bottom"
        align="start"
        sideOffset={-50}
        alignOffset={-340}
        avoidCollisions={false}
      >
        <Tabs defaultValue="design" className="section-settings-tabs">
          <TabsList className="section-settings-tabs-list">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="background">Background</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
          </TabsList>

          {/* Design Tab */}
          <TabsContent value="design" className="section-settings-content">
            {/* Grid Section */}
            <div className="section-settings-section">
              <h4 className="section-settings-section-title">GRID</h4>

              <FormItem className="section-settings-field">
                <div className="section-settings-field-row">
                  <Label>Row Count</Label>
                  <Input
                    type="number"
                    min={1}
                    max={24}
                    value={getSectionProp<number>("rowCount", 1)}
                    onChange={(e) =>
                      handleChange("rowCount", parseInt(e.target.value) || 1)
                    }
                    className="section-settings-number-input"
                  />
                </div>
              </FormItem>

              <FormItem className="section-settings-field">
                <div className="section-settings-field-row">
                  <Label>Gap</Label>
                  <div className="section-settings-button-group">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      className={cn(
                        "section-settings-button",
                        getSectionProp<string>("gap", "md") === "sm" &&
                          "is-active",
                      )}
                      onClick={() => handleChange("gap", "sm")}
                      title="Small gap"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      className={cn(
                        "section-settings-button",
                        getSectionProp<string>("gap", "md") === "md" &&
                          "is-active",
                      )}
                      onClick={() => handleChange("gap", "md")}
                      title="Medium gap"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => {}}
                      title="More options"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </FormItem>
            </div>

            {/* Section Settings */}
            <div className="section-settings-section">
              <h4 className="section-settings-section-title">SECTION</h4>

              <FormItem className="section-settings-field">
                <div className="section-settings-field-row">
                  <Label>Fill Screen</Label>
                  <Switch
                    checked={getSectionProp<boolean>("fillScreen", false)}
                    onCheckedChange={(checked) =>
                      handleChange("fillScreen", checked)
                    }
                  />
                </div>
              </FormItem>

              <FormItem className="section-settings-field">
                <div className="section-settings-field-row">
                  <Label>Height</Label>
                  <div className="section-settings-button-group">
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "section-settings-size-btn section-settings-button",
                        getSectionProp<string>("height", "auto") === "sm" &&
                          "is-active",
                      )}
                      onClick={() => handleChange("height", "sm")}
                    >
                      S
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "section-settings-size-btn section-settings-button",
                        getSectionProp<string>("height", "auto") === "md" &&
                          "is-active",
                      )}
                      onClick={() => handleChange("height", "md")}
                    >
                      M
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "section-settings-size-btn section-settings-button",
                        getSectionProp<string>("height", "auto") === "lg" &&
                          "is-active",
                      )}
                      onClick={() => handleChange("height", "lg")}
                    >
                      L
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => {}}
                      title="More options"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </FormItem>

              <FormItem className="section-settings-field">
                <div className="section-settings-slider-row">
                  <Slider
                    value={[getSectionProp<number>("heightValue", 10)]}
                    onValueChange={([value]) =>
                      handleChange("heightValue", value)
                    }
                    min={0}
                    max={100}
                    step={1}
                  />
                  <span className="section-settings-slider-value">
                    {getSectionProp<number>("heightValue", 10)}
                  </span>
                </div>
              </FormItem>

              <FormItem className="section-settings-field">
                <div className="section-settings-field-row">
                  <Label>Alignment</Label>
                  <div className="section-settings-button-group">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      className={cn(
                        "section-settings-button",
                        getSectionProp<string>("align", "center") === "start" &&
                          "is-active",
                      )}
                      onClick={() => handleChange("align", "start")}
                      title="Align top"
                    >
                      <AlignVerticalJustifyStart className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      className={cn(
                        "section-settings-button",
                        getSectionProp<string>("align", "center") ===
                          "center" && "is-active",
                      )}
                      onClick={() => handleChange("align", "center")}
                      title="Align center"
                    >
                      <AlignVerticalJustifyCenter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      className={cn(
                        "section-settings-button",
                        getSectionProp<string>("align", "center") === "end" &&
                          "is-active",
                      )}
                      onClick={() => handleChange("align", "end")}
                      title="Align bottom"
                    >
                      <AlignVerticalJustifyEnd className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </FormItem>

              <p className="section-settings-hint">
                Fill screen will expand the background height to fill a portion
                of the user's screen.
              </p>
            </div>

            {/* Styling Link */}
            <div className="section-settings-section">
              <h4 className="section-settings-section-title">STYLING</h4>
              <FormItem className="section-settings-field">
                <div className="section-settings-field-row">
                  <Label>Width</Label>
                  <Select
                    value={section.width || "wide"}
                    onValueChange={(value) => handleChange("width", value)}
                  >
                    <SelectTrigger className="section-settings-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="narrow">Narrow</SelectItem>
                      <SelectItem value="container">Container</SelectItem>
                      <SelectItem value="wide">Wide</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FormItem>

              <FormItem className="section-settings-field">
                <div className="section-settings-field-row">
                  <Label>Spacing</Label>
                  <Select
                    value={section.spacing || "md"}
                    onValueChange={(value) => handleChange("spacing", value)}
                  >
                    <SelectTrigger className="section-settings-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                      <SelectItem value="xl">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FormItem>
            </div>
          </TabsContent>

          {/* Background Tab */}
          <TabsContent value="background" className="section-settings-content">
            <div className="section-settings-section">
              <h4 className="section-settings-section-title">
                BACKGROUND TYPE
              </h4>

              <FormItem className="section-settings-field">
                <Select
                  value={section.background || "none"}
                  onValueChange={(value) => handleChange("background", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select background" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="color">Solid Color</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>

              {section.background === "color" && (
                <FormItem className="section-settings-field">
                  <Label>Color</Label>
                  <Select
                    value={getSectionProp<string>("bgColor", "muted")}
                    onValueChange={(value) => handleChange("bgColor", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="accent">Accent</SelectItem>
                      <SelectItem value="muted">Muted</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}

              {section.background === "color" &&
                getSectionProp<string>("bgColor", "") === "custom" && (
                  <FormItem className="section-settings-field">
                    <Label>Custom Color</Label>
                    <Input
                      type="text"
                      value={getSectionProp<string>("customBgColor", "")}
                      onChange={(e) =>
                        handleChange("customBgColor", e.target.value)
                      }
                      placeholder="#ffffff"
                    />
                  </FormItem>
                )}

              {section.background === "image" && (
                <FormItem className="section-settings-field">
                  <Label>Image URL</Label>
                  <Input
                    type="text"
                    value={getSectionProp<string>("bgImage", "")}
                    onChange={(e) => handleChange("bgImage", e.target.value)}
                    placeholder="https://..."
                  />
                </FormItem>
              )}

              {section.background === "video" && (
                <FormItem className="section-settings-field">
                  <Label>Video URL</Label>
                  <Input
                    type="text"
                    value={getSectionProp<string>("bgVideo", "")}
                    onChange={(e) => handleChange("bgVideo", e.target.value)}
                    placeholder="https://..."
                  />
                </FormItem>
              )}
            </div>

            {(section.background === "image" ||
              section.background === "video") && (
              <div className="section-settings-section">
                <h4 className="section-settings-section-title">OVERLAY</h4>

                <FormItem className="section-settings-field">
                  <div className="section-settings-field-row">
                    <Label>Enable Overlay</Label>
                    <Switch
                      checked={getSectionProp<boolean>("overlay", false)}
                      onCheckedChange={(checked) =>
                        handleChange("overlay", checked)
                      }
                    />
                  </div>
                </FormItem>

                {getSectionProp<boolean>("overlay", false) && (
                  <FormItem className="section-settings-field">
                    <div className="section-settings-slider-row">
                      <Label>Opacity</Label>
                      <Slider
                        value={[getSectionProp<number>("overlayOpacity", 50)]}
                        onValueChange={([value]) =>
                          handleChange("overlayOpacity", value)
                        }
                        min={0}
                        max={100}
                        step={5}
                      />
                      <span className="section-settings-slider-value">
                        {getSectionProp<number>("overlayOpacity", 50)}%
                      </span>
                    </div>
                  </FormItem>
                )}
              </div>
            )}
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="section-settings-content">
            <div className="section-settings-section">
              <h4 className="section-settings-section-title">SECTION COLORS</h4>

              <FormItem className="section-settings-field">
                <Label>Text Color</Label>
                <Select
                  value={getSectionProp<string>("textColor", "default")}
                  onValueChange={(value) => handleChange("textColor", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="muted">Muted</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>

              <FormItem className="section-settings-field">
                <Label>Heading Color</Label>
                <Select
                  value={getSectionProp<string>("headingColor", "default")}
                  onValueChange={(value) => handleChange("headingColor", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="accent">Accent</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>

              <FormItem className="section-settings-field">
                <Label>Link Color</Label>
                <Select
                  value={getSectionProp<string>("linkColor", "primary")}
                  onValueChange={(value) => handleChange("linkColor", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="accent">Accent</SelectItem>
                    <SelectItem value="inherit">Inherit</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            <div className="section-settings-section">
              <h4 className="section-settings-section-title">THEME</h4>

              <FormItem className="section-settings-field">
                <div className="section-settings-field-row">
                  <Label>Invert Colors</Label>
                  <Switch
                    checked={getSectionProp<boolean>("invertColors", false)}
                    onCheckedChange={(checked) =>
                      handleChange("invertColors", checked)
                    }
                  />
                </div>
                <p className="section-settings-hint">
                  Swap light and dark colors for this section
                </p>
              </FormItem>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
