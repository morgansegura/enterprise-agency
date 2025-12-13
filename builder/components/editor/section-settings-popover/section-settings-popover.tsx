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
import { FormItem } from "@/components/ui/form";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
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
 * Settings panel for section properties:
 * - Background: none, white, gray, dark, primary, secondary
 * - Spacing: none, xs, sm, md, lg, xl, 2xl
 * - Width: narrow, wide, full
 * - Align: left, center, right
 */
export function SectionSettingsPopover({
  section,
  onChange,
  children,
  open,
  onOpenChange,
}: SectionSettingsPopoverProps) {
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
        <div className="section-settings-content">
          {/* Background */}
          <div className="section-settings-section">
            <h4 className="section-settings-section-title">BACKGROUND</h4>
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
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="gray">Gray</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          </div>

          {/* Spacing */}
          <div className="section-settings-section">
            <h4 className="section-settings-section-title">SPACING</h4>
            <FormItem className="section-settings-field">
              <Select
                value={section.spacing || "md"}
                onValueChange={(value) => handleChange("spacing", value)}
              >
                <SelectTrigger>
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
            </FormItem>
          </div>

          {/* Width */}
          <div className="section-settings-section">
            <h4 className="section-settings-section-title">WIDTH</h4>
            <FormItem className="section-settings-field">
              <Select
                value={section.width || "full"}
                onValueChange={(value) => handleChange("width", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="narrow">Narrow</SelectItem>
                  <SelectItem value="wide">Wide</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          </div>

          {/* Alignment */}
          <div className="section-settings-section">
            <h4 className="section-settings-section-title">ALIGNMENT</h4>
            <FormItem className="section-settings-field">
              <div className="section-settings-button-group">
                <Button
                  variant="outline"
                  size="icon-sm"
                  className={cn(
                    "section-settings-button",
                    (section.align || "left") === "left" && "is-active",
                  )}
                  onClick={() => handleChange("align", "left")}
                  title="Align left"
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className={cn(
                    "section-settings-button",
                    section.align === "center" && "is-active",
                  )}
                  onClick={() => handleChange("align", "center")}
                  title="Align center"
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className={cn(
                    "section-settings-button",
                    section.align === "right" && "is-active",
                  )}
                  onClick={() => handleChange("align", "right")}
                  title="Align right"
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
            </FormItem>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
