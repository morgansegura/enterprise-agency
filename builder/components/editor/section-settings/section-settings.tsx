"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import type { Section } from "@/lib/hooks/use-pages";
import { FormItem } from "@/components/ui/form";

interface SectionSettingsProps {
  section: Section;
  onChange: (section: Section) => void;
  onClose: () => void;
}

/**
 * Section Settings Editor
 *
 * Allows editing section-level properties:
 * - Background color/style
 * - Vertical spacing (padding top/bottom)
 * - Max width constraint
 * - Content alignment
 *
 * Usage:
 * ```tsx
 * <SectionSettings
 *   section={section}
 *   onChange={handleSectionChange}
 *   onClose={handleClose}
 * />
 * ```
 */
export function SectionSettings({
  section,
  onChange,
  onClose,
}: SectionSettingsProps) {
  const handleChange = (field: keyof Section, value: string) => {
    onChange({
      ...section,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Section Settings</h3>
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Background */}
      <FormItem className="space-y-2">
        <Label htmlFor="section-background">Background</Label>
        <Select
          value={
            typeof section.background === "string"
              ? section.background
              : section.background?.type === "color"
                ? section.background.color || "none"
                : "none"
          }
          onValueChange={(value) => handleChange("background", value)}
        >
          <SelectTrigger id="section-background">
            <SelectValue placeholder="Select background" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="primary">Primary</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
            <SelectItem value="accent">Accent</SelectItem>
            <SelectItem value="muted">Muted</SelectItem>
            <SelectItem value="card">Card</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Background style for this section
        </p>
      </FormItem>

      {/* Spacing */}
      <FormItem className="space-y-2">
        <Label htmlFor="section-spacing">Spacing</Label>
        <Select
          value={section.spacing || "md"}
          onValueChange={(value) => handleChange("spacing", value)}
        >
          <SelectTrigger id="section-spacing">
            <SelectValue placeholder="Select spacing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="xs">XS (Extra Small)</SelectItem>
            <SelectItem value="sm">SM (Small)</SelectItem>
            <SelectItem value="md">MD (Medium)</SelectItem>
            <SelectItem value="lg">LG (Large)</SelectItem>
            <SelectItem value="xl">XL (Extra Large)</SelectItem>
            <SelectItem value="2xl">2XL</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Vertical padding (top/bottom)
        </p>
      </FormItem>

      {/* Width */}
      <FormItem className="space-y-2">
        <Label htmlFor="section-width">Max Width</Label>
        <Select
          value={section.width || "wide"}
          onValueChange={(value) => handleChange("width", value)}
        >
          <SelectTrigger id="section-width">
            <SelectValue placeholder="Select max width" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="narrow">Narrow (720px)</SelectItem>
            <SelectItem value="container">Container (1140px)</SelectItem>
            <SelectItem value="wide">Wide (1320px)</SelectItem>
            <SelectItem value="full">Full Width</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Maximum content width for this section
        </p>
      </FormItem>

      {/* Alignment */}
      <FormItem className="space-y-2">
        <Label htmlFor="section-align">Content Alignment</Label>
        <Select
          value={section.align || "left"}
          onValueChange={(value) => handleChange("align", value)}
        >
          <SelectTrigger id="section-align">
            <SelectValue placeholder="Select alignment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Horizontal alignment of section content
        </p>
      </FormItem>
    </div>
  );
}
