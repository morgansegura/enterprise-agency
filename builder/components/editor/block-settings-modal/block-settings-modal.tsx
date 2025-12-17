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
import { Settings, Palette, Box, Type, AlignLeft, Link } from "lucide-react";
import type { Block } from "@/lib/hooks/use-pages";

import "./block-settings-modal.css";

interface BlockSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  block: Block;
  onChange: (block: Block) => void;
}

/**
 * Block Settings Modal
 *
 * Provides settings for different block types with tabs:
 * - Content: Block-specific content settings
 * - Style: Typography, colors, spacing
 * - Advanced: ID, classes, visibility
 */
export function BlockSettingsModal({
  open,
  onOpenChange,
  block,
  onChange,
}: BlockSettingsModalProps) {
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

  const handleChange = (field: string, value: unknown) => {
    onChange({
      ...block,
      [field]: value,
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
      "line-block": "Divider",
      "accordion-block": "Accordion",
      "newsletter-block": "Newsletter",
    };
    return typeMap[block._type] || "Block";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="block-settings-modal">
        <DialogHeader>
          <DialogTitle>{getBlockTypeLabel()} Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="content" className="block-settings-modal-tabs">
          <TabsList className="block-settings-modal-tabs-list">
            <TabsTrigger value="content">
              <Type className="h-4 w-4" />
              Content
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

          {/* Content Tab - Block-specific settings */}
          <TabsContent value="content" className="block-settings-modal-content">
            {renderContentSettings()}
          </TabsContent>

          {/* Style Tab */}
          <TabsContent value="style" className="block-settings-modal-content">
            <div className="block-settings-modal-section">
              <h4 className="block-settings-modal-section-title">Typography</h4>

              <div className="grid grid-cols-2 gap-4">
                <FormItem className="block-settings-modal-field">
                  <Label htmlFor="block-font-size">Font Size</Label>
                  <Select
                    value={getBlockData<string>("fontSize", "base")}
                    onValueChange={(value) =>
                      handleDataChange("fontSize", value)
                    }
                  >
                    <SelectTrigger id="block-font-size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xs">XS (12px)</SelectItem>
                      <SelectItem value="sm">SM (14px)</SelectItem>
                      <SelectItem value="base">Base (16px)</SelectItem>
                      <SelectItem value="lg">LG (18px)</SelectItem>
                      <SelectItem value="xl">XL (20px)</SelectItem>
                      <SelectItem value="2xl">2XL (24px)</SelectItem>
                      <SelectItem value="3xl">3XL (30px)</SelectItem>
                      <SelectItem value="4xl">4XL (36px)</SelectItem>
                      <SelectItem value="5xl">5XL (48px)</SelectItem>
                      <SelectItem value="6xl">6XL (60px)</SelectItem>
                      <SelectItem value="7xl">7XL (72px)</SelectItem>
                      <SelectItem value="8xl">8XL (96px)</SelectItem>
                      <SelectItem value="9xl">9XL (128px)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>

                <FormItem className="block-settings-modal-field">
                  <Label htmlFor="block-font-weight">Font Weight</Label>
                  <Select
                    value={getBlockData<string>("fontWeight", "normal")}
                    onValueChange={(value) =>
                      handleDataChange("fontWeight", value)
                    }
                  >
                    <SelectTrigger id="block-font-weight">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thin">Thin (100)</SelectItem>
                      <SelectItem value="extralight">Extra Light (200)</SelectItem>
                      <SelectItem value="light">Light (300)</SelectItem>
                      <SelectItem value="normal">Normal (400)</SelectItem>
                      <SelectItem value="medium">Medium (500)</SelectItem>
                      <SelectItem value="semibold">Semibold (600)</SelectItem>
                      <SelectItem value="bold">Bold (700)</SelectItem>
                      <SelectItem value="extrabold">Extra Bold (800)</SelectItem>
                      <SelectItem value="black">Black (900)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              </div>

              <FormItem className="block-settings-modal-field">
                <Label htmlFor="block-text-align">Text Alignment</Label>
                <Select
                  value={getBlockData<string>("textAlign", "left")}
                  onValueChange={(value) =>
                    handleDataChange("textAlign", value)
                  }
                >
                  <SelectTrigger id="block-text-align">
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

              <div className="grid grid-cols-2 gap-4">
                <FormItem className="block-settings-modal-field">
                  <Label htmlFor="block-letter-spacing">Letter Spacing</Label>
                  <Select
                    value={getBlockData<string>("letterSpacing", "")}
                    onValueChange={(value) =>
                      handleDataChange("letterSpacing", value || undefined)
                    }
                  >
                    <SelectTrigger id="block-letter-spacing">
                      <SelectValue placeholder="Default" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Default</SelectItem>
                      <SelectItem value="tighter">Tighter</SelectItem>
                      <SelectItem value="tight">Tight</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="wide">Wide</SelectItem>
                      <SelectItem value="wider">Wider</SelectItem>
                      <SelectItem value="widest">Widest</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>

                <FormItem className="block-settings-modal-field">
                  <Label htmlFor="block-line-height">Line Height</Label>
                  <Select
                    value={getBlockData<string>("lineHeight", "")}
                    onValueChange={(value) =>
                      handleDataChange("lineHeight", value || undefined)
                    }
                  >
                    <SelectTrigger id="block-line-height">
                      <SelectValue placeholder="Default" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Default</SelectItem>
                      <SelectItem value="none">None (1)</SelectItem>
                      <SelectItem value="tight">Tight (1.25)</SelectItem>
                      <SelectItem value="snug">Snug (1.375)</SelectItem>
                      <SelectItem value="normal">Normal (1.5)</SelectItem>
                      <SelectItem value="relaxed">Relaxed (1.625)</SelectItem>
                      <SelectItem value="loose">Loose (2)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              </div>

              <FormItem className="block-settings-modal-field">
                <Label htmlFor="block-text-color">Text Color</Label>
                <Select
                  value={getBlockData<string>("textColor", "default")}
                  onValueChange={(value) =>
                    handleDataChange("textColor", value)
                  }
                >
                  <SelectTrigger id="block-text-color">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="muted">Muted</SelectItem>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="accent">Accent</SelectItem>
                    <SelectItem value="destructive">Destructive</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>

              {getBlockData<string>("textColor", "default") === "custom" && (
                <FormItem className="block-settings-modal-field">
                  <Label htmlFor="block-custom-color">Custom Color</Label>
                  <Input
                    id="block-custom-color"
                    type="text"
                    value={getBlockData<string>("customColor", "")}
                    onChange={(e) =>
                      handleDataChange("customColor", e.target.value)
                    }
                    placeholder="#000000 or rgb(0,0,0)"
                  />
                </FormItem>
              )}
            </div>

            <div className="block-settings-modal-section">
              <h4 className="block-settings-modal-section-title">Spacing</h4>

              <div className="grid grid-cols-2 gap-4">
                <FormItem className="block-settings-modal-field">
                  <Label htmlFor="block-margin">Margin</Label>
                  <Select
                    value={getBlockData<string>("margin", "none")}
                    onValueChange={(value) => handleDataChange("margin", value)}
                  >
                    <SelectTrigger id="block-margin">
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

                <FormItem className="block-settings-modal-field">
                  <Label htmlFor="block-padding">Padding</Label>
                  <Select
                    value={getBlockData<string>("padding", "none")}
                    onValueChange={(value) =>
                      handleDataChange("padding", value)
                    }
                  >
                    <SelectTrigger id="block-padding">
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
            </div>

            <div className="block-settings-modal-section">
              <h4 className="block-settings-modal-section-title">Background</h4>

              <FormItem className="block-settings-modal-field">
                <Label htmlFor="block-background">Background</Label>
                <Select
                  value={getBlockData<string>("background", "none")}
                  onValueChange={(value) =>
                    handleDataChange("background", value)
                  }
                >
                  <SelectTrigger id="block-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="muted">Muted</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>

              {getBlockData<string>("background", "none") === "custom" && (
                <FormItem className="block-settings-modal-field">
                  <Label htmlFor="block-bg-color">
                    Custom Background Color
                  </Label>
                  <Input
                    id="block-bg-color"
                    type="text"
                    value={getBlockData<string>("bgColor", "")}
                    onChange={(e) =>
                      handleDataChange("bgColor", e.target.value)
                    }
                    placeholder="#ffffff or rgba(0,0,0,0.5)"
                  />
                </FormItem>
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormItem className="block-settings-modal-field">
                  <Label htmlFor="block-border-radius">Border Radius</Label>
                  <Select
                    value={getBlockData<string>("borderRadius", "none")}
                    onValueChange={(value) =>
                      handleDataChange("borderRadius", value)
                    }
                  >
                    <SelectTrigger id="block-border-radius">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>

                <FormItem className="block-settings-modal-field">
                  <Label htmlFor="block-shadow">Shadow</Label>
                  <Select
                    value={getBlockData<string>("shadow", "none")}
                    onValueChange={(value) => handleDataChange("shadow", value)}
                  >
                    <SelectTrigger id="block-shadow">
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
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent
            value="advanced"
            className="block-settings-modal-content"
          >
            <div className="block-settings-modal-section">
              <h4 className="block-settings-modal-section-title">
                Identification
              </h4>

              <FormItem className="block-settings-modal-field">
                <Label htmlFor="block-id">Block ID</Label>
                <Input
                  id="block-id"
                  value={getBlockData<string>("blockId", "")}
                  onChange={(e) => handleDataChange("blockId", e.target.value)}
                  placeholder="my-block"
                />
                <p className="text-xs text-(--muted-foreground) mt-1">
                  Used for anchor links (e.g., #my-block)
                </p>
              </FormItem>

              <FormItem className="block-settings-modal-field">
                <Label htmlFor="block-class">CSS Classes</Label>
                <Input
                  id="block-class"
                  value={getBlockData<string>("className", "")}
                  onChange={(e) =>
                    handleDataChange("className", e.target.value)
                  }
                  placeholder="custom-class another-class"
                />
                <p className="text-xs text-(--muted-foreground) mt-1">
                  Additional CSS classes (space separated)
                </p>
              </FormItem>
            </div>

            <div className="block-settings-modal-section">
              <h4 className="block-settings-modal-section-title">Visibility</h4>

              <FormItem className="block-settings-modal-field flex items-center gap-2">
                <input
                  type="checkbox"
                  id="block-hide-desktop"
                  checked={getBlockData<boolean>("hideOnDesktop", false)}
                  onChange={(e) =>
                    handleDataChange("hideOnDesktop", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-(--border)"
                />
                <Label htmlFor="block-hide-desktop" className="cursor-pointer">
                  Hide on Desktop
                </Label>
              </FormItem>

              <FormItem className="block-settings-modal-field flex items-center gap-2">
                <input
                  type="checkbox"
                  id="block-hide-tablet"
                  checked={getBlockData<boolean>("hideOnTablet", false)}
                  onChange={(e) =>
                    handleDataChange("hideOnTablet", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-(--border)"
                />
                <Label htmlFor="block-hide-tablet" className="cursor-pointer">
                  Hide on Tablet
                </Label>
              </FormItem>

              <FormItem className="block-settings-modal-field flex items-center gap-2">
                <input
                  type="checkbox"
                  id="block-hide-mobile"
                  checked={getBlockData<boolean>("hideOnMobile", false)}
                  onChange={(e) =>
                    handleDataChange("hideOnMobile", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-(--border)"
                />
                <Label htmlFor="block-hide-mobile" className="cursor-pointer">
                  Hide on Mobile
                </Label>
              </FormItem>
            </div>

            <div className="block-settings-modal-section">
              <h4 className="block-settings-modal-section-title">Animation</h4>

              <FormItem className="block-settings-modal-field">
                <Label htmlFor="block-animation">Entrance Animation</Label>
                <Select
                  value={getBlockData<string>("animation", "none")}
                  onValueChange={(value) =>
                    handleDataChange("animation", value)
                  }
                >
                  <SelectTrigger id="block-animation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="fade-in">Fade In</SelectItem>
                    <SelectItem value="slide-up">Slide Up</SelectItem>
                    <SelectItem value="slide-down">Slide Down</SelectItem>
                    <SelectItem value="slide-left">Slide Left</SelectItem>
                    <SelectItem value="slide-right">Slide Right</SelectItem>
                    <SelectItem value="zoom-in">Zoom In</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>

              <FormItem className="block-settings-modal-field">
                <Label htmlFor="block-animation-delay">Animation Delay</Label>
                <Select
                  value={getBlockData<string>("animationDelay", "0")}
                  onValueChange={(value) =>
                    handleDataChange("animationDelay", value)
                  }
                >
                  <SelectTrigger id="block-animation-delay">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    <SelectItem value="100">100ms</SelectItem>
                    <SelectItem value="200">200ms</SelectItem>
                    <SelectItem value="300">300ms</SelectItem>
                    <SelectItem value="500">500ms</SelectItem>
                    <SelectItem value="1000">1s</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>
          </TabsContent>
        </Tabs>

        <div className="block-settings-modal-footer">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

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
      case "code-block":
        return renderCodeSettings();
      case "embed-block":
        return renderEmbedSettings();
      case "line-block":
        return renderLineSettings();
      default:
        return renderDefaultSettings();
    }
  }

  function renderHeadingSettings() {
    return (
      <div className="block-settings-modal-section">
        <h4 className="block-settings-modal-section-title">Heading</h4>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="heading-text">Heading Text</Label>
          <Input
            id="heading-text"
            value={getBlockData<string>("text", "")}
            onChange={(e) => handleDataChange("text", e.target.value)}
            placeholder="Enter heading text"
          />
        </FormItem>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="heading-level">Heading Level</Label>
          <Select
            value={getBlockData<string>("level", "h2")}
            onValueChange={(value) => handleDataChange("level", value)}
          >
            <SelectTrigger id="heading-level">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="h1">H1 - Main Heading</SelectItem>
              <SelectItem value="h2">H2 - Section Heading</SelectItem>
              <SelectItem value="h3">H3 - Subsection</SelectItem>
              <SelectItem value="h4">H4 - Minor Heading</SelectItem>
              <SelectItem value="h5">H5 - Small Heading</SelectItem>
              <SelectItem value="h6">H6 - Smallest</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      </div>
    );
  }

  function renderTextSettings() {
    return (
      <div className="block-settings-modal-section">
        <h4 className="block-settings-modal-section-title">Text Content</h4>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="text-content">Text</Label>
          <textarea
            id="text-content"
            className="flex min-h-[120px] w-full rounded-md border border-(--input) bg-(--background) px-3 py-2 text-sm ring-offset-(--background) placeholder:text-(--muted-foreground) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter your text content..."
            value={getBlockData<string>("text", "")}
            onChange={(e) => handleDataChange("text", e.target.value)}
          />
        </FormItem>
      </div>
    );
  }

  function renderImageSettings() {
    return (
      <div className="block-settings-modal-section">
        <h4 className="block-settings-modal-section-title">Image</h4>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="image-src">Image URL</Label>
          <Input
            id="image-src"
            value={getBlockData<string>("src", "")}
            onChange={(e) => handleDataChange("src", e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </FormItem>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="image-alt">Alt Text</Label>
          <Input
            id="image-alt"
            value={getBlockData<string>("alt", "")}
            onChange={(e) => handleDataChange("alt", e.target.value)}
            placeholder="Describe the image"
          />
        </FormItem>

        <div className="grid grid-cols-2 gap-4">
          <FormItem className="block-settings-modal-field">
            <Label htmlFor="image-width">Width</Label>
            <Input
              id="image-width"
              value={getBlockData<string>("width", "")}
              onChange={(e) => handleDataChange("width", e.target.value)}
              placeholder="auto, 100%, 500px"
            />
          </FormItem>

          <FormItem className="block-settings-modal-field">
            <Label htmlFor="image-height">Height</Label>
            <Input
              id="image-height"
              value={getBlockData<string>("height", "")}
              onChange={(e) => handleDataChange("height", e.target.value)}
              placeholder="auto, 300px"
            />
          </FormItem>
        </div>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="image-fit">Object Fit</Label>
          <Select
            value={getBlockData<string>("objectFit", "cover")}
            onValueChange={(value) => handleDataChange("objectFit", value)}
          >
            <SelectTrigger id="image-fit">
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

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="image-link">Link URL (optional)</Label>
          <Input
            id="image-link"
            value={getBlockData<string>("link", "")}
            onChange={(e) => handleDataChange("link", e.target.value)}
            placeholder="https://example.com"
          />
        </FormItem>
      </div>
    );
  }

  function renderButtonSettings() {
    return (
      <div className="block-settings-modal-section">
        <h4 className="block-settings-modal-section-title">Button</h4>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="button-text">Button Text</Label>
          <Input
            id="button-text"
            value={getBlockData<string>("text", "")}
            onChange={(e) => handleDataChange("text", e.target.value)}
            placeholder="Click me"
          />
        </FormItem>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="button-link">Link URL</Label>
          <Input
            id="button-link"
            value={getBlockData<string>("link", "")}
            onChange={(e) => handleDataChange("link", e.target.value)}
            placeholder="https://example.com"
          />
        </FormItem>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="button-variant">Style</Label>
          <Select
            value={getBlockData<string>("variant", "default")}
            onValueChange={(value) => handleDataChange("variant", value)}
          >
            <SelectTrigger id="button-variant">
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

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="button-size">Size</Label>
          <Select
            value={getBlockData<string>("size", "default")}
            onValueChange={(value) => handleDataChange("size", value)}
          >
            <SelectTrigger id="button-size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>

        <FormItem className="block-settings-modal-field flex items-center gap-2">
          <input
            type="checkbox"
            id="button-new-tab"
            checked={getBlockData<boolean>("openInNewTab", false)}
            onChange={(e) => handleDataChange("openInNewTab", e.target.checked)}
            className="h-4 w-4 rounded border-(--border)"
          />
          <Label htmlFor="button-new-tab" className="cursor-pointer">
            Open in new tab
          </Label>
        </FormItem>
      </div>
    );
  }

  function renderVideoSettings() {
    return (
      <div className="block-settings-modal-section">
        <h4 className="block-settings-modal-section-title">Video</h4>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="video-src">Video URL</Label>
          <Input
            id="video-src"
            value={getBlockData<string>("src", "")}
            onChange={(e) => handleDataChange("src", e.target.value)}
            placeholder="https://youtube.com/watch?v=... or video file URL"
          />
          <p className="text-xs text-(--muted-foreground) mt-1">
            Supports YouTube, Vimeo, or direct video URLs
          </p>
        </FormItem>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="video-poster">Poster Image (optional)</Label>
          <Input
            id="video-poster"
            value={getBlockData<string>("poster", "")}
            onChange={(e) => handleDataChange("poster", e.target.value)}
            placeholder="https://example.com/poster.jpg"
          />
        </FormItem>

        <div className="grid grid-cols-2 gap-4">
          <FormItem className="block-settings-modal-field flex items-center gap-2">
            <input
              type="checkbox"
              id="video-autoplay"
              checked={getBlockData<boolean>("autoplay", false)}
              onChange={(e) => handleDataChange("autoplay", e.target.checked)}
              className="h-4 w-4 rounded border-(--border)"
            />
            <Label htmlFor="video-autoplay" className="cursor-pointer">
              Autoplay
            </Label>
          </FormItem>

          <FormItem className="block-settings-modal-field flex items-center gap-2">
            <input
              type="checkbox"
              id="video-loop"
              checked={getBlockData<boolean>("loop", false)}
              onChange={(e) => handleDataChange("loop", e.target.checked)}
              className="h-4 w-4 rounded border-(--border)"
            />
            <Label htmlFor="video-loop" className="cursor-pointer">
              Loop
            </Label>
          </FormItem>

          <FormItem className="block-settings-modal-field flex items-center gap-2">
            <input
              type="checkbox"
              id="video-muted"
              checked={getBlockData<boolean>("muted", false)}
              onChange={(e) => handleDataChange("muted", e.target.checked)}
              className="h-4 w-4 rounded border-(--border)"
            />
            <Label htmlFor="video-muted" className="cursor-pointer">
              Muted
            </Label>
          </FormItem>

          <FormItem className="block-settings-modal-field flex items-center gap-2">
            <input
              type="checkbox"
              id="video-controls"
              checked={getBlockData<boolean>("controls", true)}
              onChange={(e) => handleDataChange("controls", e.target.checked)}
              className="h-4 w-4 rounded border-(--border)"
            />
            <Label htmlFor="video-controls" className="cursor-pointer">
              Show Controls
            </Label>
          </FormItem>
        </div>
      </div>
    );
  }

  function renderQuoteSettings() {
    return (
      <div className="block-settings-modal-section">
        <h4 className="block-settings-modal-section-title">Quote</h4>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="quote-text">Quote Text</Label>
          <textarea
            id="quote-text"
            className="flex min-h-[100px] w-full rounded-md border border-(--input) bg-(--background) px-3 py-2 text-sm ring-offset-(--background) placeholder:text-(--muted-foreground) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter the quote..."
            value={getBlockData<string>("text", "")}
            onChange={(e) => handleDataChange("text", e.target.value)}
          />
        </FormItem>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="quote-author">Author</Label>
          <Input
            id="quote-author"
            value={getBlockData<string>("author", "")}
            onChange={(e) => handleDataChange("author", e.target.value)}
            placeholder="Author name"
          />
        </FormItem>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="quote-source">Source (optional)</Label>
          <Input
            id="quote-source"
            value={getBlockData<string>("source", "")}
            onChange={(e) => handleDataChange("source", e.target.value)}
            placeholder="Book, website, etc."
          />
        </FormItem>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="quote-style">Quote Style</Label>
          <Select
            value={getBlockData<string>("style", "default")}
            onValueChange={(value) => handleDataChange("style", value)}
          >
            <SelectTrigger id="quote-style">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="bordered">Left Border</SelectItem>
              <SelectItem value="centered">Centered</SelectItem>
              <SelectItem value="large">Large Quote</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      </div>
    );
  }

  function renderCodeSettings() {
    return (
      <div className="block-settings-modal-section">
        <h4 className="block-settings-modal-section-title">Code</h4>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="code-content">Code</Label>
          <textarea
            id="code-content"
            className="flex min-h-[150px] w-full rounded-md border border-(--input) bg-(--background) px-3 py-2 text-sm font-mono ring-offset-(--background) placeholder:text-(--muted-foreground) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="// Enter your code..."
            value={getBlockData<string>("code", "")}
            onChange={(e) => handleDataChange("code", e.target.value)}
          />
        </FormItem>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="code-language">Language</Label>
          <Select
            value={getBlockData<string>("language", "javascript")}
            onValueChange={(value) => handleDataChange("language", value)}
          >
            <SelectTrigger id="code-language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="bash">Bash</SelectItem>
              <SelectItem value="sql">SQL</SelectItem>
              <SelectItem value="plaintext">Plain Text</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>

        <FormItem className="block-settings-modal-field flex items-center gap-2">
          <input
            type="checkbox"
            id="code-line-numbers"
            checked={getBlockData<boolean>("showLineNumbers", true)}
            onChange={(e) =>
              handleDataChange("showLineNumbers", e.target.checked)
            }
            className="h-4 w-4 rounded border-(--border)"
          />
          <Label htmlFor="code-line-numbers" className="cursor-pointer">
            Show line numbers
          </Label>
        </FormItem>
      </div>
    );
  }

  function renderEmbedSettings() {
    return (
      <div className="block-settings-modal-section">
        <h4 className="block-settings-modal-section-title">Embed</h4>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="embed-code">Embed Code</Label>
          <textarea
            id="embed-code"
            className="flex min-h-[150px] w-full rounded-md border border-(--input) bg-(--background) px-3 py-2 text-sm font-mono ring-offset-(--background) placeholder:text-(--muted-foreground) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="<iframe src=..."
            value={getBlockData<string>("embedCode", "")}
            onChange={(e) => handleDataChange("embedCode", e.target.value)}
          />
          <p className="text-xs text-(--muted-foreground) mt-1">
            Paste iframe or embed code from third-party services
          </p>
        </FormItem>

        <div className="grid grid-cols-2 gap-4">
          <FormItem className="block-settings-modal-field">
            <Label htmlFor="embed-width">Width</Label>
            <Input
              id="embed-width"
              value={getBlockData<string>("width", "100%")}
              onChange={(e) => handleDataChange("width", e.target.value)}
              placeholder="100%, 500px"
            />
          </FormItem>

          <FormItem className="block-settings-modal-field">
            <Label htmlFor="embed-height">Height</Label>
            <Input
              id="embed-height"
              value={getBlockData<string>("height", "400px")}
              onChange={(e) => handleDataChange("height", e.target.value)}
              placeholder="400px"
            />
          </FormItem>
        </div>
      </div>
    );
  }

  function renderLineSettings() {
    return (
      <div className="block-settings-modal-section">
        <h4 className="block-settings-modal-section-title">Divider Line</h4>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="line-style">Line Style</Label>
          <Select
            value={getBlockData<string>("lineStyle", "solid")}
            onValueChange={(value) => handleDataChange("lineStyle", value)}
          >
            <SelectTrigger id="line-style">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="dashed">Dashed</SelectItem>
              <SelectItem value="dotted">Dotted</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="line-thickness">Thickness</Label>
          <Select
            value={getBlockData<string>("thickness", "1")}
            onValueChange={(value) => handleDataChange("thickness", value)}
          >
            <SelectTrigger id="line-thickness">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Thin (1px)</SelectItem>
              <SelectItem value="2">Medium (2px)</SelectItem>
              <SelectItem value="4">Thick (4px)</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="line-width">Width</Label>
          <Select
            value={getBlockData<string>("lineWidth", "full")}
            onValueChange={(value) => handleDataChange("lineWidth", value)}
          >
            <SelectTrigger id="line-width">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quarter">25%</SelectItem>
              <SelectItem value="half">50%</SelectItem>
              <SelectItem value="three-quarter">75%</SelectItem>
              <SelectItem value="full">100%</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>

        <FormItem className="block-settings-modal-field">
          <Label htmlFor="line-color">Color</Label>
          <Select
            value={getBlockData<string>("lineColor", "border")}
            onValueChange={(value) => handleDataChange("lineColor", value)}
          >
            <SelectTrigger id="line-color">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="border">Border (default)</SelectItem>
              <SelectItem value="muted">Muted</SelectItem>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      </div>
    );
  }

  function renderDefaultSettings() {
    return (
      <div className="block-settings-modal-section">
        <h4 className="block-settings-modal-section-title">Block Settings</h4>
        <p className="text-sm text-(--muted-foreground)">
          Configure this block using the Style and Advanced tabs.
        </p>
      </div>
    );
  }
}
