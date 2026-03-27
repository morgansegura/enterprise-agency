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
import { Trash2, Megaphone } from "lucide-react";
import { FormItem } from "@/components/ui/form";
import {
  useResponsiveChange,
} from "@/components/editor/responsive-field";
import {
  useCurrentBreakpoint,
  useCanSetResponsiveOverrides,
} from "@/lib/responsive/context";

interface CtaBlockData {
  _key: string;
  _type: "cta-block";
  data: {
    heading: string;
    description?: string;
    primaryCta: { text: string; href: string };
    secondaryCta?: { text: string; href: string };
    variant?: "default" | "highlighted" | "minimal";
    align?: "left" | "center";
    _responsive?: {
      tablet?: Partial<CtaBlockData["data"]>;
      mobile?: Partial<CtaBlockData["data"]>;
    };
  };
}

interface CtaBlockEditorProps {
  block: CtaBlockData;
  onChange: (block: CtaBlockData) => void;
  onDelete: () => void;
}

export function CtaBlockEditor({
  block,
  onChange,
  onDelete,
}: CtaBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const breakpoint = useCurrentBreakpoint();
  const canSetOverrides = useCanSetResponsiveOverrides();

  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({ ...block, data: newData as CtaBlockData["data"] }),
  );

  const handlePrimaryCtaChange = (field: string, value: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        primaryCta: {
          ...block.data.primaryCta,
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

  const variant = block.data.variant || "default";
  const align = block.data.align || "center";

  const variantStyles = {
    default: "bg-[var(--el-100)]/30",
    highlighted: "bg-[var(--accent-primary)]/10 border border-primary/20",
    minimal: "",
  };

  const alignStyles = {
    left: "text-left",
    center: "text-center",
  };

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <div
          className={`${variantStyles[variant]} ${alignStyles[align]} rounded-lg p-8`}
        >
          <h3 className="text-xl font-bold">
            {block.data.heading || "CTA Heading"}
          </h3>
          {block.data.description && (
            <p className="text-sm text-[var(--el-500)] mt-2">
              {block.data.description}
            </p>
          )}
          <div className="flex gap-2 mt-4 justify-center">
            <Button size="sm" className="pointer-events-none">
              {block.data.primaryCta.text || "Primary Action"}
            </Button>
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
          <Megaphone className="h-4 w-4" />
          CTA Block
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
          <Label htmlFor="cta-heading">Heading</Label>
          <Input
            id="cta-heading"
            value={block.data.heading}
            onChange={(e) => handleDataChange("heading", e.target.value)}
            placeholder="CTA heading"
          />
        </FormItem>

        <FormItem>
          <Label htmlFor="cta-description">Description</Label>
          <Textarea
            id="cta-description"
            value={block.data.description || ""}
            onChange={(e) => handleDataChange("description", e.target.value)}
            placeholder="Optional description text..."
            rows={3}
          />
        </FormItem>

        <div className="border rounded-lg p-3 space-y-3">
          <p className="text-xs font-medium text-[var(--el-500)] uppercase">
            Primary CTA
          </p>
          <div className="grid grid-cols-2 gap-3">
            <FormItem>
              <Label htmlFor="cta-primary-text">Button Text</Label>
              <Input
                id="cta-primary-text"
                value={block.data.primaryCta.text}
                onChange={(e) =>
                  handlePrimaryCtaChange("text", e.target.value)
                }
                placeholder="Get Started"
              />
            </FormItem>
            <FormItem>
              <Label htmlFor="cta-primary-href">Button URL</Label>
              <Input
                id="cta-primary-href"
                value={block.data.primaryCta.href}
                onChange={(e) =>
                  handlePrimaryCtaChange("href", e.target.value)
                }
                placeholder="https://example.com"
              />
            </FormItem>
          </div>
        </div>

        <div className="border rounded-lg p-3 space-y-3">
          <p className="text-xs font-medium text-[var(--el-500)] uppercase">
            Secondary CTA
          </p>
          <div className="grid grid-cols-2 gap-3">
            <FormItem>
              <Label htmlFor="cta-secondary-text">Button Text</Label>
              <Input
                id="cta-secondary-text"
                value={block.data.secondaryCta?.text || ""}
                onChange={(e) =>
                  handleSecondaryCtaChange("text", e.target.value)
                }
                placeholder="Learn More"
              />
            </FormItem>
            <FormItem>
              <Label htmlFor="cta-secondary-href">Button URL</Label>
              <Input
                id="cta-secondary-href"
                value={block.data.secondaryCta?.href || ""}
                onChange={(e) =>
                  handleSecondaryCtaChange("href", e.target.value)
                }
                placeholder="https://example.com"
              />
            </FormItem>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormItem>
            <Label htmlFor="cta-variant">Variant</Label>
            <Select
              value={variant}
              onValueChange={(value) => handleDataChange("variant", value)}
            >
              <SelectTrigger id="cta-variant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="highlighted">Highlighted</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          <FormItem>
            <Label htmlFor="cta-align">Align</Label>
            <Select
              value={align}
              onValueChange={(value) => handleDataChange("align", value)}
            >
              <SelectTrigger id="cta-align">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </div>
      </div>
    </div>
  );
}
