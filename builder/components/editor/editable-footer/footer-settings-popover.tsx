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
import type {
  Footer,
  FooterStyle,
  FooterLayout,
} from "@/lib/hooks/use-footers";

import "./footer-settings-popover.css";

interface FooterSettingsPopoverProps {
  footer: Footer;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onStyleChange: (style: Partial<FooterStyle>) => void;
  onFooterChange: (field: string, value: unknown) => void;
  children: React.ReactNode;
}

/**
 * Footer Settings Popover
 *
 * Three tabs matching section/header pattern:
 *
 * LAYOUT TAB:
 * - Layout: simple, columns, stacked, minimal, centered
 *
 * WRAPPER TAB:
 * - Background: none, white, gray, dark, primary, secondary
 * - Padding: none, xs, sm, md, lg, xl
 * - Shadow: none, sm, md, lg
 * - Border Top: none, light, medium, dark
 *
 * CONTAINER TAB:
 * - Width: narrow, container, full
 * - Background: none, white, gray, dark, primary, secondary
 * - Radius: none, sm, md, lg
 * - Shadow: none, sm, md, lg
 * - Border: none, light, medium, dark
 * - Padding: none, xs, sm, md, lg, xl
 */
export function FooterSettingsPopover({
  footer,
  open,
  onOpenChange,
  onStyleChange,
  onFooterChange,
  children,
}: FooterSettingsPopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="footer-settings-popover"
        side="top"
        align="start"
        sideOffset={8}
      >
        <Tabs defaultValue="layout" className="footer-settings-tabs">
          <TabsList className="footer-settings-tabs-list">
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="wrapper">Wrapper</TabsTrigger>
            <TabsTrigger value="container">Container</TabsTrigger>
          </TabsList>

          {/* Layout Tab */}
          <TabsContent value="layout" className="footer-settings-content">
            <div className="footer-settings-section">
              <h4 className="footer-settings-section-title">LAYOUT</h4>
              <FormItem className="footer-settings-field">
                <Select
                  value={footer.layout}
                  onValueChange={(value) =>
                    onFooterChange("layout", value as FooterLayout)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SIMPLE">Simple</SelectItem>
                    <SelectItem value="COLUMNS">Columns</SelectItem>
                    <SelectItem value="STACKED">Stacked</SelectItem>
                    <SelectItem value="MINIMAL">Minimal</SelectItem>
                    <SelectItem value="CENTERED">Centered</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
              <p className="footer-settings-hint">
                Choose a layout structure for your footer
              </p>
            </div>
          </TabsContent>

          {/* Wrapper Tab */}
          <TabsContent value="wrapper" className="footer-settings-content">
            {/* Background */}
            <div className="footer-settings-section">
              <h4 className="footer-settings-section-title">BACKGROUND</h4>
              <FormItem className="footer-settings-field">
                <Select
                  value={footer.style?.backgroundColor || "dark"}
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

            {/* Padding */}
            <div className="footer-settings-section">
              <h4 className="footer-settings-section-title">PADDING</h4>
              <FormItem className="footer-settings-field">
                <Select
                  value={footer.style?.paddingY || "md"}
                  onValueChange={(value) => onStyleChange({ paddingY: value })}
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

            {/* Shadow */}
            <div className="footer-settings-section">
              <h4 className="footer-settings-section-title">SHADOW</h4>
              <FormItem className="footer-settings-field">
                <Select
                  value={footer.style?.boxShadow || "none"}
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

            {/* Border Top */}
            <div className="footer-settings-section">
              <h4 className="footer-settings-section-title">BORDER TOP</h4>
              <FormItem className="footer-settings-field">
                <Select
                  value={footer.style?.borderTop || "none"}
                  onValueChange={(value) => onStyleChange({ borderTop: value })}
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
          </TabsContent>

          {/* Container Tab */}
          <TabsContent value="container" className="footer-settings-content">
            {/* Width */}
            <div className="footer-settings-section">
              <h4 className="footer-settings-section-title">WIDTH</h4>
              <FormItem className="footer-settings-field">
                <Select
                  value={footer.style?.containerWidth || "container"}
                  onValueChange={(value) =>
                    onStyleChange({
                      containerWidth: value as FooterStyle["containerWidth"],
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
            <div className="footer-settings-section">
              <h4 className="footer-settings-section-title">BACKGROUND</h4>
              <FormItem className="footer-settings-field">
                <Select
                  value={footer.style?.containerBackground || "none"}
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
            <div className="footer-settings-section">
              <h4 className="footer-settings-section-title">RADIUS</h4>
              <FormItem className="footer-settings-field">
                <Select
                  value={footer.style?.containerBorderRadius || "none"}
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
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            {/* Shadow */}
            <div className="footer-settings-section">
              <h4 className="footer-settings-section-title">SHADOW</h4>
              <FormItem className="footer-settings-field">
                <Select
                  value={footer.style?.containerShadow || "none"}
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
            <div className="footer-settings-section">
              <h4 className="footer-settings-section-title">BORDER</h4>
              <FormItem className="footer-settings-field">
                <Select
                  value={footer.style?.containerBorder || "none"}
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
            <div className="footer-settings-section">
              <h4 className="footer-settings-section-title">PADDING</h4>
              <FormItem className="footer-settings-field">
                <Select
                  value={footer.style?.containerPaddingX || "md"}
                  onValueChange={(value) =>
                    onStyleChange({
                      containerPaddingX: value,
                      containerPaddingY: value,
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
                    <SelectItem value="xl">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
