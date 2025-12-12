"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormItem } from "@/components/ui/form";
import { Settings, Layout, Palette, Box } from "lucide-react";
import type { Section } from "@/lib/hooks/use-pages";

import "./section-settings-modal.css";

interface SectionSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: Section;
  onChange: (section: Section) => void;
}

/**
 * Section Settings Modal
 *
 * Comprehensive settings for page sections with tabs:
 * - General: Background, spacing, width, alignment
 * - Layout: Direction, gap, wrap, distribute
 * - Style: Border, shadow, custom CSS
 * - Advanced: ID, classes, visibility
 */
export function SectionSettingsModal({
  open,
  onOpenChange,
  section,
  onChange,
}: SectionSettingsModalProps) {
  // Helper to safely get extended section properties
  const getSectionProp = <T,>(key: string, defaultValue: T): T => {
    return ((section as unknown as Record<string, unknown>)[key] as T) ?? defaultValue;
  };

  const handleChange = (field: string, value: unknown) => {
    onChange({
      ...section,
      [field]: value,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="section-settings-modal">
        <DialogHeader>
          <DialogTitle>Section Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="section-settings-modal-tabs">
          <TabsList className="section-settings-modal-tabs-list">
            <TabsTrigger value="general">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="layout">
              <Layout className="h-4 w-4" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="style">
              <Palette className="h-4 w-4" />
              Style
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Box className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="section-settings-modal-content">
            <div className="section-settings-modal-section">
              <h4 className="section-settings-modal-section-title">Background</h4>

              <FormItem className="section-settings-modal-field">
                <Label htmlFor="section-background">Background Style</Label>
                <Select
                  value={section.background || "none"}
                  onValueChange={(value) => handleChange("background", value)}
                >
                  <SelectTrigger id="section-background">
                    <SelectValue placeholder="Select background" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Transparent)</SelectItem>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="accent">Accent</SelectItem>
                    <SelectItem value="muted">Muted</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="custom">Custom Color</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>

              {section.background === "custom" && (
                <FormItem className="section-settings-modal-field">
                  <Label htmlFor="section-bg-color">Custom Color</Label>
                  <Input
                    id="section-bg-color"
                    type="text"
                    value={getSectionProp<string>("bgColor", "")}
                    onChange={(e) => handleChange("bgColor", e.target.value)}
                    placeholder="#ffffff or rgba(0,0,0,0.5)"
                  />
                </FormItem>
              )}

              <FormItem className="section-settings-modal-field">
                <Label htmlFor="section-bg-image">Background Image URL</Label>
                <Input
                  id="section-bg-image"
                  type="text"
                  value={getSectionProp<string>("bgImage", "")}
                  onChange={(e) => handleChange("bgImage", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </FormItem>
            </div>

            <div className="section-settings-modal-section">
              <h4 className="section-settings-modal-section-title">Spacing</h4>

              <div className="grid grid-cols-2 gap-4">
                <FormItem className="section-settings-modal-field">
                  <Label htmlFor="section-spacing">Vertical Padding</Label>
                  <Select
                    value={section.spacing || "md"}
                    onValueChange={(value) => handleChange("spacing", value)}
                  >
                    <SelectTrigger id="section-spacing">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="xs">XS (8px)</SelectItem>
                      <SelectItem value="sm">SM (16px)</SelectItem>
                      <SelectItem value="md">MD (32px)</SelectItem>
                      <SelectItem value="lg">LG (48px)</SelectItem>
                      <SelectItem value="xl">XL (64px)</SelectItem>
                      <SelectItem value="2xl">2XL (96px)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>

                <FormItem className="section-settings-modal-field">
                  <Label htmlFor="section-width">Max Width</Label>
                  <Select
                    value={section.width || "wide"}
                    onValueChange={(value) => handleChange("width", value)}
                  >
                    <SelectTrigger id="section-width">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="narrow">Narrow (720px)</SelectItem>
                      <SelectItem value="container">Container (1140px)</SelectItem>
                      <SelectItem value="wide">Wide (1320px)</SelectItem>
                      <SelectItem value="full">Full Width</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              </div>

              <FormItem className="section-settings-modal-field">
                <Label htmlFor="section-align">Content Alignment</Label>
                <Select
                  value={section.align || "left"}
                  onValueChange={(value) => handleChange("align", value)}
                >
                  <SelectTrigger id="section-align">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="section-settings-modal-content">
            <div className="section-settings-modal-section">
              <h4 className="section-settings-modal-section-title">Content Layout</h4>

              <FormItem className="section-settings-modal-field">
                <Label htmlFor="section-direction">Direction</Label>
                <Select
                  value={getSectionProp<string>("direction", "column")}
                  onValueChange={(value) => handleChange("direction", value)}
                >
                  <SelectTrigger id="section-direction">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="column">Vertical (Column)</SelectItem>
                    <SelectItem value="row">Horizontal (Row)</SelectItem>
                    <SelectItem value="column-reverse">Vertical Reverse</SelectItem>
                    <SelectItem value="row-reverse">Horizontal Reverse</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>

              <div className="grid grid-cols-2 gap-4">
                <FormItem className="section-settings-modal-field">
                  <Label htmlFor="section-gap">Gap Between Items</Label>
                  <Select
                    value={getSectionProp<string>("gap", "md")}
                    onValueChange={(value) => handleChange("gap", value)}
                  >
                    <SelectTrigger id="section-gap">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="xs">XS (4px)</SelectItem>
                      <SelectItem value="sm">SM (8px)</SelectItem>
                      <SelectItem value="md">MD (16px)</SelectItem>
                      <SelectItem value="lg">LG (24px)</SelectItem>
                      <SelectItem value="xl">XL (32px)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>

                <FormItem className="section-settings-modal-field">
                  <Label htmlFor="section-justify">Justify Content</Label>
                  <Select
                    value={getSectionProp<string>("justify", "start")}
                    onValueChange={(value) => handleChange("justify", value)}
                  >
                    <SelectTrigger id="section-justify">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="start">Start</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="end">End</SelectItem>
                      <SelectItem value="between">Space Between</SelectItem>
                      <SelectItem value="around">Space Around</SelectItem>
                      <SelectItem value="evenly">Space Evenly</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              </div>

              <FormItem className="section-settings-modal-field">
                <Label htmlFor="section-items">Align Items</Label>
                <Select
                  value={getSectionProp<string>("items", "stretch")}
                  onValueChange={(value) => handleChange("items", value)}
                >
                  <SelectTrigger id="section-items">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stretch">Stretch</SelectItem>
                    <SelectItem value="start">Start</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="end">End</SelectItem>
                    <SelectItem value="baseline">Baseline</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>

              <FormItem className="section-settings-modal-field flex items-center gap-2">
                <input
                  type="checkbox"
                  id="section-wrap"
                  checked={getSectionProp<boolean>("wrap", false)}
                  onChange={(e) => handleChange("wrap", e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="section-wrap" className="cursor-pointer">
                  Allow items to wrap to next line
                </Label>
              </FormItem>
            </div>
          </TabsContent>

          {/* Style Tab */}
          <TabsContent value="style" className="section-settings-modal-content">
            <div className="section-settings-modal-section">
              <h4 className="section-settings-modal-section-title">Border & Shadow</h4>

              <div className="grid grid-cols-2 gap-4">
                <FormItem className="section-settings-modal-field">
                  <Label htmlFor="section-border">Border</Label>
                  <Select
                    value={getSectionProp<string>("border", "none")}
                    onValueChange={(value) => handleChange("border", value)}
                  >
                    <SelectTrigger id="section-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="subtle">Subtle</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>

                <FormItem className="section-settings-modal-field">
                  <Label htmlFor="section-rounded">Rounded Corners</Label>
                  <Select
                    value={getSectionProp<string>("rounded", "none")}
                    onValueChange={(value) => handleChange("rounded", value)}
                  >
                    <SelectTrigger id="section-rounded">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                      <SelectItem value="xl">Extra Large</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              </div>

              <FormItem className="section-settings-modal-field">
                <Label htmlFor="section-shadow">Shadow</Label>
                <Select
                  value={getSectionProp<string>("shadow", "none")}
                  onValueChange={(value) => handleChange("shadow", value)}
                >
                  <SelectTrigger id="section-shadow">
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
              </FormItem>
            </div>

            <div className="section-settings-modal-section">
              <h4 className="section-settings-modal-section-title">Custom CSS</h4>

              <FormItem className="section-settings-modal-field">
                <Label htmlFor="section-custom-css">Custom CSS</Label>
                <textarea
                  id="section-custom-css"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                  placeholder="/* Custom CSS for this section */"
                  value={getSectionProp<string>("customCss", "")}
                  onChange={(e) => handleChange("customCss", e.target.value)}
                />
              </FormItem>
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="section-settings-modal-content">
            <div className="section-settings-modal-section">
              <h4 className="section-settings-modal-section-title">Identification</h4>

              <FormItem className="section-settings-modal-field">
                <Label htmlFor="section-id">Section ID</Label>
                <Input
                  id="section-id"
                  value={getSectionProp<string>("sectionId", "")}
                  onChange={(e) => handleChange("sectionId", e.target.value)}
                  placeholder="my-section"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Used for anchor links (e.g., #my-section)
                </p>
              </FormItem>

              <FormItem className="section-settings-modal-field">
                <Label htmlFor="section-class">CSS Classes</Label>
                <Input
                  id="section-class"
                  value={getSectionProp<string>("className", "")}
                  onChange={(e) => handleChange("className", e.target.value)}
                  placeholder="custom-class another-class"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Additional CSS classes (space separated)
                </p>
              </FormItem>
            </div>

            <div className="section-settings-modal-section">
              <h4 className="section-settings-modal-section-title">Visibility</h4>

              <FormItem className="section-settings-modal-field flex items-center gap-2">
                <input
                  type="checkbox"
                  id="section-hide-desktop"
                  checked={getSectionProp<boolean>("hideOnDesktop", false)}
                  onChange={(e) => handleChange("hideOnDesktop", e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="section-hide-desktop" className="cursor-pointer">
                  Hide on Desktop
                </Label>
              </FormItem>

              <FormItem className="section-settings-modal-field flex items-center gap-2">
                <input
                  type="checkbox"
                  id="section-hide-tablet"
                  checked={getSectionProp<boolean>("hideOnTablet", false)}
                  onChange={(e) => handleChange("hideOnTablet", e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="section-hide-tablet" className="cursor-pointer">
                  Hide on Tablet
                </Label>
              </FormItem>

              <FormItem className="section-settings-modal-field flex items-center gap-2">
                <input
                  type="checkbox"
                  id="section-hide-mobile"
                  checked={getSectionProp<boolean>("hideOnMobile", false)}
                  onChange={(e) => handleChange("hideOnMobile", e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="section-hide-mobile" className="cursor-pointer">
                  Hide on Mobile
                </Label>
              </FormItem>
            </div>
          </TabsContent>
        </Tabs>

        <div className="section-settings-modal-footer">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
