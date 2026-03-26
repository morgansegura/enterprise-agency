"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, LayoutTemplate } from "lucide-react";
import { FormItem } from "@/components/ui/form";
import {
  ResponsiveField,
  useResponsiveChange,
} from "@/components/editor/responsive-field";
import {
  useCurrentBreakpoint,
  useCanSetResponsiveOverrides,
} from "@/lib/responsive/context";
import { getResponsiveValue } from "@/lib/responsive";

interface HeroBlockData {
  _key: string;
  _type: "hero-block";
  data: {
    heading: string;
    subheading?: string;
    description?: string;
    primaryCta?: { text: string; href: string };
    secondaryCta?: { text: string; href: string };
    image?: { src: string; alt: string };
    layout?: "centered" | "split-right" | "split-left";
    overlay?: boolean;
    align?: "left" | "center" | "right";
    size?: "sm" | "md" | "lg";
    _responsive?: {
      tablet?: Partial<HeroBlockData["data"]>;
      mobile?: Partial<HeroBlockData["data"]>;
    };
  };
}

interface HeroBlockEditorProps {
  block: HeroBlockData;
  onChange: (block: HeroBlockData) => void;
  onDelete: () => void;
}

export function HeroBlockEditor({
  block,
  onChange,
  onDelete,
}: HeroBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const breakpoint = useCurrentBreakpoint();
  const canSetOverrides = useCanSetResponsiveOverrides();

  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({ ...block, data: newData as HeroBlockData["data"] }),
  );

  const handlePrimaryCtaChange = (field: string, value: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        primaryCta: {
          text: block.data.primaryCta?.text || "",
          href: block.data.primaryCta?.href || "",
          [field]: value,
        },
      },
    });
  };

  const handleSecondaryCtaChange = (field: string, value: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        secondaryCta: {
          text: block.data.secondaryCta?.text || "",
          href: block.data.secondaryCta?.href || "",
          [field]: value,
        },
      },
    });
  };

  const handleImageChange = (field: string, value: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        image: {
          src: block.data.image?.src || "",
          alt: block.data.image?.alt || "",
          [field]: value,
        },
      },
    });
  };

  const layout = block.data.layout || "centered";
  const align = block.data.align || "center";
  const size =
    (getResponsiveValue<string>(block.data, "size", breakpoint) as
      | "sm"
      | "md"
      | "lg") || "md";

  const sizeStyles = {
    sm: "py-8",
    md: "py-16",
    lg: "py-24",
  };

  const alignStyles = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <div
          className={`${sizeStyles[size]} ${alignStyles[align]} px-8 bg-muted/30 rounded-lg`}
        >
          <h2 className="text-2xl font-bold">
            {block.data.heading || "Hero Heading"}
          </h2>
          {block.data.subheading && (
            <p className="text-lg text-muted-foreground mt-1">
              {block.data.subheading}
            </p>
          )}
          {block.data.description && (
            <p className="text-sm text-muted-foreground mt-2">
              {block.data.description}
            </p>
          )}
          {(block.data.primaryCta?.text || block.data.secondaryCta?.text) && (
            <div className="flex gap-2 mt-4 justify-center">
              {block.data.primaryCta?.text && (
                <Button size="sm" className="pointer-events-none">
                  {block.data.primaryCta.text}
                </Button>
              )}
              {block.data.secondaryCta?.text && (
                <Button
                  variant="outline"
                  size="sm"
                  className="pointer-events-none"
                >
                  {block.data.secondaryCta.text}
                </Button>
              )}
            </div>
          )}
        </div>
        <Button
          variant="destructive"
          size="icon-sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="border-2 border-primary rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <LayoutTemplate className="h-4 w-4" />
          Hero Block
          {canSetOverrides && breakpoint !== "desktop" && (
            <span className="text-xs font-normal text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
              Editing {breakpoint}
            </span>
          )}
        </h4>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setIsEditing(false)}>
            Done
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <FormItem>
          <Label htmlFor="hero-heading">Heading</Label>
          <Input
            id="hero-heading"
            value={block.data.heading}
            onChange={(e) => handleDataChange("heading", e.target.value)}
            placeholder="Hero heading"
          />
        </FormItem>

        <FormItem>
          <Label htmlFor="hero-subheading">Subheading</Label>
          <Input
            id="hero-subheading"
            value={block.data.subheading || ""}
            onChange={(e) => handleDataChange("subheading", e.target.value)}
            placeholder="Optional subheading"
          />
        </FormItem>

        <FormItem>
          <Label htmlFor="hero-description">Description</Label>
          <Textarea
            id="hero-description"
            value={block.data.description || ""}
            onChange={(e) => handleDataChange("description", e.target.value)}
            placeholder="Optional description text..."
            rows={3}
          />
        </FormItem>

        <div className="border rounded-lg p-3 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Primary CTA
          </p>
          <div className="grid grid-cols-2 gap-3">
            <FormItem>
              <Label htmlFor="hero-primary-text">Button Text</Label>
              <Input
                id="hero-primary-text"
                value={block.data.primaryCta?.text || ""}
                onChange={(e) =>
                  handlePrimaryCtaChange("text", e.target.value)
                }
                placeholder="Get Started"
              />
            </FormItem>
            <FormItem>
              <Label htmlFor="hero-primary-href">Button URL</Label>
              <Input
                id="hero-primary-href"
                value={block.data.primaryCta?.href || ""}
                onChange={(e) =>
                  handlePrimaryCtaChange("href", e.target.value)
                }
                placeholder="https://example.com"
              />
            </FormItem>
          </div>
        </div>

        <div className="border rounded-lg p-3 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Secondary CTA
          </p>
          <div className="grid grid-cols-2 gap-3">
            <FormItem>
              <Label htmlFor="hero-secondary-text">Button Text</Label>
              <Input
                id="hero-secondary-text"
                value={block.data.secondaryCta?.text || ""}
                onChange={(e) =>
                  handleSecondaryCtaChange("text", e.target.value)
                }
                placeholder="Learn More"
              />
            </FormItem>
            <FormItem>
              <Label htmlFor="hero-secondary-href">Button URL</Label>
              <Input
                id="hero-secondary-href"
                value={block.data.secondaryCta?.href || ""}
                onChange={(e) =>
                  handleSecondaryCtaChange("href", e.target.value)
                }
                placeholder="https://example.com"
              />
            </FormItem>
          </div>
        </div>

        <div className="border rounded-lg p-3 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Background Image
          </p>
          <div className="grid grid-cols-2 gap-3">
            <FormItem>
              <Label htmlFor="hero-image-src">Image URL</Label>
              <Input
                id="hero-image-src"
                value={block.data.image?.src || ""}
                onChange={(e) => handleImageChange("src", e.target.value)}
                placeholder="https://example.com/hero.jpg"
              />
            </FormItem>
            <FormItem>
              <Label htmlFor="hero-image-alt">Alt Text</Label>
              <Input
                id="hero-image-alt"
                value={block.data.image?.alt || ""}
                onChange={(e) => handleImageChange("alt", e.target.value)}
                placeholder="Describe the image"
              />
            </FormItem>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <FormItem>
            <Label htmlFor="hero-layout">Layout</Label>
            <Select
              value={layout}
              onValueChange={(value) => handleDataChange("layout", value)}
            >
              <SelectTrigger id="hero-layout">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="centered">Centered</SelectItem>
                <SelectItem value="split-right">Split Right</SelectItem>
                <SelectItem value="split-left">Split Left</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          <ResponsiveField
            fieldName="size"
            data={block.data}
            onChange={(newData) =>
              onChange({ ...block, data: newData as HeroBlockData["data"] })
            }
            label="Size"
          >
            <Select
              value={size}
              onValueChange={(value) => handleDataChange("size", value)}
            >
              <SelectTrigger id="hero-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </ResponsiveField>

          <FormItem>
            <Label htmlFor="hero-align">Align</Label>
            <Select
              value={align}
              onValueChange={(value) => handleDataChange("align", value)}
            >
              <SelectTrigger id="hero-align">
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

        <div className="flex items-center gap-2">
          <Input
            type="checkbox"
            id="hero-overlay"
            checked={block.data.overlay || false}
            onChange={(e) => handleDataChange("overlay", e.target.checked)}
            className="h-4 w-4"
          />
          <Label htmlFor="hero-overlay" className="cursor-pointer">
            Show overlay on background image
          </Label>
        </div>
      </div>
    </div>
  );
}
