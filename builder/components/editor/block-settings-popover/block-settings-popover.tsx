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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormItem } from "@/components/ui/form";
import { Type, Palette, Box } from "lucide-react";
import type { Block } from "@/lib/hooks/use-pages";

import "./block-settings-popover.css";

interface BlockSettingsPopoverProps {
  block: Block;
  onChange: (block: Block) => void;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Block Settings Popover
 *
 * Lightweight popover for quick block settings with tabs:
 * - Content: Block-specific content settings (uses actual block data props)
 * - Style: Typography, colors, spacing
 * - Advanced: ID, classes, visibility
 */
export function BlockSettingsPopover({
  block,
  onChange,
  children,
  open,
  onOpenChange,
}: BlockSettingsPopoverProps) {
  // Helper to safely get block data properties
  const getBlockData = <T,>(key: string, defaultValue: T): T => {
    return (block.data?.[key] as T) ?? defaultValue;
  };

  const handleDataChange = (field: string, value: unknown) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        [field]: value,
      },
    });
  };

  // Get block type label for display
  const getBlockTypeLabel = () => {
    const typeMap: Record<string, string> = {
      "text-block": "Text",
      "heading-block": "Heading",
      "image-block": "Image",
      "button-block": "Button",
      "video-block": "Video",
      "quote-block": "Quote",
      "code-block": "Code",
      "embed-block": "Embed",
      "form-block": "Form",
      "map-block": "Map",
      "divider-block": "Divider",
      "spacer-block": "Spacer",
      "accordion-block": "Accordion",
      "tabs-block": "Tabs",
      "list-block": "List",
      "card-block": "Card",
      "stats-block": "Stats",
      "icon-block": "Icon",
      "rich-text-block": "Rich Text",
    };
    return typeMap[block._type] || "Block";
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="block-settings-popover"
        side="left"
        align="start"
        sideOffset={8}
        collisionPadding={16}
      >
        <div className="block-settings-header">
          <span className="block-settings-title">
            {getBlockTypeLabel()} Settings
          </span>
        </div>

        <Tabs defaultValue="content" className="block-settings-tabs">
          <TabsList className="block-settings-tabs-list">
            <TabsTrigger value="content">
              <Type className="h-3.5 w-3.5" />
              Content
            </TabsTrigger>
            <TabsTrigger value="style">
              <Palette className="h-3.5 w-3.5" />
              Style
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Box className="h-3.5 w-3.5" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* Content Tab - Block-specific settings */}
          <TabsContent value="content" className="block-settings-content">
            {renderContentSettings()}
          </TabsContent>

          {/* Style Tab */}
          <TabsContent value="style" className="block-settings-content">
            {renderStyleSettings()}
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="block-settings-content">
            <div className="block-settings-section">
              <FormItem className="block-settings-field">
                <Label>Max Width</Label>
                <Input
                  value={getBlockData<string>("maxWidth", "")}
                  onChange={(e) => handleDataChange("maxWidth", e.target.value)}
                  placeholder="none, 600px, 50%"
                />
              </FormItem>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );

  // Render style settings based on block type
  function renderStyleSettings() {
    // Common style settings for text-based blocks
    if (
      [
        "text-block",
        "heading-block",
        "quote-block",
        "rich-text-block",
      ].includes(block._type)
    ) {
      return (
        <div className="block-settings-section">
          <h4 className="block-settings-section-title">Typography</h4>

          <FormItem className="block-settings-field">
            <Label>Size</Label>
            <Select
              value={getBlockData<string>("size", "base")}
              onValueChange={(value) => handleDataChange("size", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2xs">2XS</SelectItem>
                <SelectItem value="xs">XS</SelectItem>
                <SelectItem value="sm">SM</SelectItem>
                <SelectItem value="base">Base</SelectItem>
                <SelectItem value="lg">LG</SelectItem>
                <SelectItem value="xl">XL</SelectItem>
                <SelectItem value="2xl">2XL</SelectItem>
                <SelectItem value="3xl">3XL</SelectItem>
                <SelectItem value="4xl">4XL</SelectItem>
                <SelectItem value="5xl">5XL</SelectItem>
                <SelectItem value="6xl">6XL</SelectItem>
                <SelectItem value="7xl">7XL</SelectItem>
                <SelectItem value="8xl">8XL</SelectItem>
                <SelectItem value="9xl">9XL</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          <FormItem className="block-settings-field">
            <Label>Alignment</Label>
            <Select
              value={getBlockData<string>("align", "left")}
              onValueChange={(value) => handleDataChange("align", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="justify">Justify</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          {block._type === "text-block" && (
            <FormItem className="block-settings-field">
              <Label>Variant</Label>
              <Select
                value={getBlockData<string>("variant", "body")}
                onValueChange={(value) => handleDataChange("variant", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="body">Body</SelectItem>
                  <SelectItem value="muted">Muted</SelectItem>
                  <SelectItem value="caption">Caption</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}

          {block._type === "heading-block" && (
            <>
              <FormItem className="block-settings-field">
                <Label>Weight</Label>
                <Select
                  value={getBlockData<string>("weight", "semibold")}
                  onValueChange={(value) => handleDataChange("weight", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="semibold">Semibold</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>

              <FormItem className="block-settings-field">
                <Label>Color</Label>
                <Select
                  value={getBlockData<string>("color", "default")}
                  onValueChange={(value) => handleDataChange("color", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="muted">Muted</SelectItem>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="accent">Accent</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </>
          )}
        </div>
      );
    }

    // Button style settings
    if (block._type === "button-block") {
      return (
        <div className="block-settings-section">
          <FormItem className="block-settings-field">
            <Label>Variant</Label>
            <Select
              value={getBlockData<string>("variant", "default")}
              onValueChange={(value) => handleDataChange("variant", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
                <SelectItem value="destructive">Destructive</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          <FormItem className="block-settings-field">
            <Label>Size</Label>
            <Select
              value={getBlockData<string>("size", "default")}
              onValueChange={(value) => handleDataChange("size", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          <FormItem className="block-settings-field block-settings-checkbox">
            <input
              type="checkbox"
              id="fullWidth"
              checked={getBlockData<boolean>("fullWidth", false)}
              onChange={(e) => handleDataChange("fullWidth", e.target.checked)}
            />
            <Label htmlFor="fullWidth">Full Width</Label>
          </FormItem>
        </div>
      );
    }

    // Image style settings
    if (block._type === "image-block") {
      return (
        <div className="block-settings-section">
          <FormItem className="block-settings-field">
            <Label>Aspect Ratio</Label>
            <Select
              value={getBlockData<string>("aspectRatio", "16/9")}
              onValueChange={(value) => handleDataChange("aspectRatio", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1/1">Square (1:1)</SelectItem>
                <SelectItem value="4/3">Standard (4:3)</SelectItem>
                <SelectItem value="16/9">Widescreen (16:9)</SelectItem>
                <SelectItem value="21/9">Ultra Wide (21:9)</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          <FormItem className="block-settings-field">
            <Label>Object Fit</Label>
            <Select
              value={getBlockData<string>("objectFit", "cover")}
              onValueChange={(value) => handleDataChange("objectFit", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contain">Contain</SelectItem>
                <SelectItem value="cover">Cover</SelectItem>
                <SelectItem value="fill">Fill</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          <FormItem className="block-settings-field block-settings-checkbox">
            <input
              type="checkbox"
              id="rounded"
              checked={getBlockData<boolean>("rounded", false)}
              onChange={(e) => handleDataChange("rounded", e.target.checked)}
            />
            <Label htmlFor="rounded">Rounded Corners</Label>
          </FormItem>
        </div>
      );
    }

    // Divider style settings
    if (block._type === "divider-block") {
      return (
        <div className="block-settings-section">
          <FormItem className="block-settings-field">
            <Label>Style</Label>
            <Select
              value={getBlockData<string>("style", "solid")}
              onValueChange={(value) => handleDataChange("style", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          <FormItem className="block-settings-field">
            <Label>Thickness</Label>
            <Select
              value={getBlockData<string>("thickness", "thin")}
              onValueChange={(value) => handleDataChange("thickness", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thin">Thin</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="thick">Thick</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          <FormItem className="block-settings-field">
            <Label>Spacing</Label>
            <Select
              value={getBlockData<string>("spacing", "md")}
              onValueChange={(value) => handleDataChange("spacing", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </div>
      );
    }

    // Spacer style settings
    if (block._type === "spacer-block") {
      return (
        <div className="block-settings-section">
          <FormItem className="block-settings-field">
            <Label>Height</Label>
            <Select
              value={getBlockData<string>("height", "md")}
              onValueChange={(value) => handleDataChange("height", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">XS (8px)</SelectItem>
                <SelectItem value="sm">SM (16px)</SelectItem>
                <SelectItem value="md">MD (32px)</SelectItem>
                <SelectItem value="lg">LG (48px)</SelectItem>
                <SelectItem value="xl">XL (64px)</SelectItem>
                <SelectItem value="2xl">2XL (96px)</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </div>
      );
    }

    return (
      <div className="block-settings-section">
        <p className="text-sm text-(--muted-foreground)">
          No style options for this block type.
        </p>
      </div>
    );
  }

  // Render content settings based on block type
  function renderContentSettings() {
    switch (block._type) {
      case "heading-block":
        return renderHeadingSettings();
      case "text-block":
        return renderTextSettings();
      case "image-block":
        return renderImageSettings();
      case "button-block":
        return renderButtonSettings();
      case "video-block":
        return renderVideoSettings();
      case "quote-block":
        return renderQuoteSettings();
      case "divider-block":
      case "spacer-block":
        return (
          <div className="block-settings-section">
            <p className="text-sm text-(--muted-foreground)">
              Use the Style tab to adjust this block.
            </p>
          </div>
        );
      default:
        return renderDefaultSettings();
    }
  }

  function renderHeadingSettings() {
    return (
      <div className="block-settings-section">
        <FormItem className="block-settings-field">
          <Label>Heading Text</Label>
          <Input
            value={getBlockData<string>("text", "")}
            onChange={(e) => handleDataChange("text", e.target.value)}
            placeholder="Enter heading"
          />
        </FormItem>

        <FormItem className="block-settings-field">
          <Label>Level</Label>
          <Select
            value={getBlockData<string>("level", "h2")}
            onValueChange={(value) => handleDataChange("level", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="h1">H1 - Main</SelectItem>
              <SelectItem value="h2">H2 - Section</SelectItem>
              <SelectItem value="h3">H3 - Subsection</SelectItem>
              <SelectItem value="h4">H4 - Minor</SelectItem>
              <SelectItem value="h5">H5 - Small</SelectItem>
              <SelectItem value="h6">H6 - Smallest</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      </div>
    );
  }

  function renderTextSettings() {
    return (
      <div className="block-settings-section">
        <FormItem className="block-settings-field">
          <Label>Text</Label>
          <textarea
            className="block-settings-textarea"
            placeholder="Enter text..."
            value={getBlockData<string>("text", "")}
            onChange={(e) => handleDataChange("text", e.target.value)}
          />
        </FormItem>
      </div>
    );
  }

  function renderImageSettings() {
    return (
      <div className="block-settings-section">
        <FormItem className="block-settings-field">
          <Label>Image URL</Label>
          <Input
            value={getBlockData<string>("src", "")}
            onChange={(e) => handleDataChange("src", e.target.value)}
            placeholder="https://..."
          />
        </FormItem>

        <FormItem className="block-settings-field">
          <Label>Alt Text</Label>
          <Input
            value={getBlockData<string>("alt", "")}
            onChange={(e) => handleDataChange("alt", e.target.value)}
            placeholder="Image description"
          />
        </FormItem>
      </div>
    );
  }

  function renderButtonSettings() {
    return (
      <div className="block-settings-section">
        <FormItem className="block-settings-field">
          <Label>Button Text</Label>
          <Input
            value={getBlockData<string>("text", "")}
            onChange={(e) => handleDataChange("text", e.target.value)}
            placeholder="Click me"
          />
        </FormItem>

        <FormItem className="block-settings-field">
          <Label>Link URL</Label>
          <Input
            value={getBlockData<string>("href", "")}
            onChange={(e) => handleDataChange("href", e.target.value)}
            placeholder="https://..."
          />
        </FormItem>

        <FormItem className="block-settings-field block-settings-checkbox">
          <input
            type="checkbox"
            id="openInNewTab"
            checked={getBlockData<boolean>("openInNewTab", false)}
            onChange={(e) => handleDataChange("openInNewTab", e.target.checked)}
          />
          <Label htmlFor="openInNewTab">Open in new tab</Label>
        </FormItem>
      </div>
    );
  }

  function renderVideoSettings() {
    return (
      <div className="block-settings-section">
        <FormItem className="block-settings-field">
          <Label>Video URL</Label>
          <Input
            value={getBlockData<string>("url", "")}
            onChange={(e) => handleDataChange("url", e.target.value)}
            placeholder="YouTube, Vimeo, or direct URL"
          />
        </FormItem>

        <FormItem className="block-settings-field">
          <Label>Provider</Label>
          <Select
            value={getBlockData<string>("provider", "youtube")}
            onValueChange={(value) => handleDataChange("provider", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="vimeo">Vimeo</SelectItem>
              <SelectItem value="direct">Direct URL</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>

        <div className="block-settings-row">
          <FormItem className="block-settings-field block-settings-checkbox">
            <input
              type="checkbox"
              id="autoplay"
              checked={getBlockData<boolean>("autoplay", false)}
              onChange={(e) => handleDataChange("autoplay", e.target.checked)}
            />
            <Label htmlFor="autoplay">Autoplay</Label>
          </FormItem>

          <FormItem className="block-settings-field block-settings-checkbox">
            <input
              type="checkbox"
              id="loop"
              checked={getBlockData<boolean>("loop", false)}
              onChange={(e) => handleDataChange("loop", e.target.checked)}
            />
            <Label htmlFor="loop">Loop</Label>
          </FormItem>

          <FormItem className="block-settings-field block-settings-checkbox">
            <input
              type="checkbox"
              id="muted"
              checked={getBlockData<boolean>("muted", false)}
              onChange={(e) => handleDataChange("muted", e.target.checked)}
            />
            <Label htmlFor="muted">Muted</Label>
          </FormItem>
        </div>
      </div>
    );
  }

  function renderQuoteSettings() {
    return (
      <div className="block-settings-section">
        <FormItem className="block-settings-field">
          <Label>Quote</Label>
          <textarea
            className="block-settings-textarea"
            placeholder="Enter quote..."
            value={getBlockData<string>("text", "")}
            onChange={(e) => handleDataChange("text", e.target.value)}
          />
        </FormItem>

        <FormItem className="block-settings-field">
          <Label>Variant</Label>
          <Select
            value={getBlockData<string>("variant", "default")}
            onValueChange={(value) => handleDataChange("variant", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="bordered">Bordered</SelectItem>
              <SelectItem value="highlighted">Highlighted</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      </div>
    );
  }

  function renderDefaultSettings() {
    return (
      <div className="block-settings-section">
        <p className="text-sm text-(--muted-foreground)">
          Edit this block inline or use the Style tab.
        </p>
      </div>
    );
  }
}
