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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { Header, HeaderStyle } from "@/lib/hooks/use-headers";

import "./header-settings-popover.css";

interface HeaderSettingsPopoverProps {
  header: Header;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onStyleChange: (style: Partial<HeaderStyle>) => void;
  onHeaderChange: (field: string, value: unknown) => void;
  children: React.ReactNode;
}

/**
 * Header Settings Popover
 *
 * Two tabs matching section-style pattern:
 *
 * BAR TAB:
 * - Background: none, white, gray, dark, primary, secondary
 * - Height: sm, md, lg, xl
 * - Position: static, fixed, sticky, scroll-hide, transparent
 * - Shadow: none, sm, md, lg
 * - Border: none, light, medium, dark
 *
 * CONTAINER TAB:
 * - Width: narrow, container, full
 * - Background: none, white, gray, dark, primary, secondary
 * - Radius: none, sm, md, lg, full
 * - Shadow: none, sm, md, lg
 * - Border: none, light, medium, dark
 * - Padding: none, xs, sm, md, lg, xl
 * - Margin: none, xs, sm, md, lg (for floating effect)
 */
export function HeaderSettingsPopover({
  header,
  open,
  onOpenChange,
  onStyleChange,
  onHeaderChange,
  children,
}: HeaderSettingsPopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="header-settings-popover"
        side="bottom"
        align="start"
        sideOffset={8}
      >
        <Tabs defaultValue="bar" className="header-settings-tabs">
          <TabsList className="header-settings-tabs-list">
            <TabsTrigger value="bar">Bar</TabsTrigger>
            <TabsTrigger value="container">Container</TabsTrigger>
          </TabsList>

          {/* Bar Tab */}
          <TabsContent value="bar" className="header-settings-content">
            {/* Background */}
            <div className="header-settings-section">
              <h4 className="header-settings-section-title">BACKGROUND</h4>
              <FormItem className="header-settings-field">
                <Select
                  value={header.style?.backgroundColor || "white"}
                  onValueChange={(value) =>
                    onStyleChange({ backgroundColor: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Transparent)</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="gray">Gray</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            {/* Height */}
            <div className="header-settings-section">
              <h4 className="header-settings-section-title">HEIGHT</h4>
              <FormItem className="header-settings-field">
                <Select
                  value={
                    typeof header.style?.height === "number"
                      ? "md"
                      : header.style?.height || "md"
                  }
                  onValueChange={(value) =>
                    onStyleChange({ height: value as HeaderStyle["height"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small (48px)</SelectItem>
                    <SelectItem value="md">Medium (64px)</SelectItem>
                    <SelectItem value="lg">Large (80px)</SelectItem>
                    <SelectItem value="xl">Extra Large (96px)</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            {/* Position/Behavior */}
            <div className="header-settings-section">
              <h4 className="header-settings-section-title">POSITION</h4>
              <FormItem className="header-settings-field">
                <Select
                  value={header.behavior}
                  onValueChange={(value) => onHeaderChange("behavior", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STATIC">Static</SelectItem>
                    <SelectItem value="FIXED">Fixed</SelectItem>
                    <SelectItem value="STICKY">Sticky</SelectItem>
                    <SelectItem value="SCROLL_HIDE">Hide on Scroll</SelectItem>
                    <SelectItem value="TRANSPARENT">Transparent</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            {/* Shadow */}
            <div className="header-settings-section">
              <h4 className="header-settings-section-title">SHADOW</h4>
              <FormItem className="header-settings-field">
                <Select
                  value={header.style?.boxShadow || "none"}
                  onValueChange={(value) => onStyleChange({ boxShadow: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            {/* Border */}
            <div className="header-settings-section">
              <h4 className="header-settings-section-title">BORDER</h4>
              <FormItem className="header-settings-field">
                <Select
                  value={header.style?.borderBottom || "none"}
                  onValueChange={(value) =>
                    onStyleChange({ borderBottom: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            {/* Blur (for transparent/glass effect) */}
            <div className="header-settings-section">
              <div className="header-settings-toggle-row">
                <Label className="text-xs font-semibold tracking-wide text-(--muted-foreground)">
                  BLUR EFFECT
                </Label>
                <Switch
                  checked={header.style?.blur || false}
                  onCheckedChange={(checked) =>
                    onStyleChange({ blur: checked })
                  }
                />
              </div>
            </div>
          </TabsContent>

          {/* Container Tab */}
          <TabsContent value="container" className="header-settings-content">
            {/* Width */}
            <div className="header-settings-section">
              <h4 className="header-settings-section-title">WIDTH</h4>
              <FormItem className="header-settings-field">
                <Select
                  value={header.style?.containerWidth || "container"}
                  onValueChange={(value) =>
                    onStyleChange({
                      containerWidth: value as HeaderStyle["containerWidth"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="narrow">Narrow (1024px)</SelectItem>
                    <SelectItem value="container">
                      Container (1280px)
                    </SelectItem>
                    <SelectItem value="full">Full Width</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            {/* Background */}
            <div className="header-settings-section">
              <h4 className="header-settings-section-title">BACKGROUND</h4>
              <FormItem className="header-settings-field">
                <Select
                  value={header.style?.containerBackground || "none"}
                  onValueChange={(value) =>
                    onStyleChange({ containerBackground: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Inherit)</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="gray">Gray</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            {/* Border Radius */}
            <div className="header-settings-section">
              <h4 className="header-settings-section-title">RADIUS</h4>
              <FormItem className="header-settings-field">
                <Select
                  value={header.style?.containerBorderRadius || "none"}
                  onValueChange={(value) =>
                    onStyleChange({ containerBorderRadius: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="full">Pill</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            {/* Shadow */}
            <div className="header-settings-section">
              <h4 className="header-settings-section-title">SHADOW</h4>
              <FormItem className="header-settings-field">
                <Select
                  value={header.style?.containerShadow || "none"}
                  onValueChange={(value) =>
                    onStyleChange({ containerShadow: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            {/* Border */}
            <div className="header-settings-section">
              <h4 className="header-settings-section-title">BORDER</h4>
              <FormItem className="header-settings-field">
                <Select
                  value={header.style?.containerBorder || "none"}
                  onValueChange={(value) =>
                    onStyleChange({ containerBorder: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            {/* Padding */}
            <div className="header-settings-section">
              <h4 className="header-settings-section-title">PADDING</h4>
              <FormItem className="header-settings-field">
                <Select
                  value={header.style?.containerPaddingX || "md"}
                  onValueChange={(value) =>
                    onStyleChange({ containerPaddingX: value })
                  }
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
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            {/* Margin (for floating effect) */}
            <div className="header-settings-section">
              <h4 className="header-settings-section-title">MARGIN</h4>
              <FormItem className="header-settings-field">
                <Select
                  value={header.style?.containerMarginY || "none"}
                  onValueChange={(value) =>
                    onStyleChange({
                      containerMarginY: value,
                      containerMarginX: value,
                    })
                  }
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
                  </SelectContent>
                </Select>
              </FormItem>
              <p className="header-settings-hint">
                Add margin to create a floating header effect
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
