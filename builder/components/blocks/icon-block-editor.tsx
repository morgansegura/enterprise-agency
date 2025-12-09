"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Sparkles,
  Heart,
  Star,
  Check,
  AlertCircle,
  Info,
  Zap,
  Trophy,
  Target,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
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

interface IconBlockData {
  _key: string;
  _type: "icon-block";
  data: {
    icon: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl";
    color?: "default" | "primary" | "secondary" | "muted";
    label?: string;
    align?: "left" | "center" | "right";
    _responsive?: {
      tablet?: Partial<Omit<IconBlockData["data"], "_responsive">>;
      mobile?: Partial<Omit<IconBlockData["data"], "_responsive">>;
    };
  };
}

interface IconBlockEditorProps {
  block: IconBlockData;
  onChange: (block: IconBlockData) => void;
  onDelete: () => void;
}

export function IconBlockEditor({
  block,
  onChange,
  onDelete,
}: IconBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const breakpoint = useCurrentBreakpoint();
  const canSetOverrides = useCanSetResponsiveOverrides();

  // Handle data changes with responsive support
  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({ ...block, data: newData as IconBlockData["data"] }),
  );

  // Get responsive-aware size
  const size =
    getResponsiveValue<string>(block.data, "size", breakpoint) || "md";
  const color = block.data.color || "default";
  const align = block.data.align || "center";

  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
    "2xl": "h-32 w-32",
  };

  const colorMap = {
    default: "text-foreground",
    primary: "text-primary",
    secondary: "text-secondary",
    muted: "text-muted-foreground",
  };

  const alignMap = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  // Get the icon component dynamically
  const IconComponent =
    (LucideIcons as any)[block.data.icon] || LucideIcons.HelpCircle;

  // Common icon suggestions
  const commonIcons = [
    { name: "Sparkles", component: Sparkles },
    { name: "Heart", component: Heart },
    { name: "Star", component: Star },
    { name: "Check", component: Check },
    { name: "AlertCircle", component: AlertCircle },
    { name: "Info", component: Info },
    { name: "Zap", component: Zap },
    { name: "Trophy", component: Trophy },
    { name: "Target", component: Target },
  ];

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <div className={`flex items-center gap-3 ${alignMap[align]}`}>
          <IconComponent className={`${sizeMap[size]} ${colorMap[color]}`} />
          {block.data.label && (
            <span className="text-sm font-medium">{block.data.label}</span>
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
          <Sparkles className="h-4 w-4" />
          Icon Block
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
          <Label htmlFor="icon-name">Icon Name</Label>
          <Input
            id="icon-name"
            value={block.data.icon}
            onChange={(e) => handleDataChange("icon", e.target.value)}
            placeholder="e.g., Star, Heart, Check"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter a Lucide icon name. See{" "}
            <a
              href="https://lucide.dev/icons"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              lucide.dev
            </a>{" "}
            for all icons.
          </p>
        </FormItem>

        <FormItem>
          <Label className="text-xs text-muted-foreground">Quick Select:</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {commonIcons.map(({ name, component: Icon }) => (
              <Button
                key={name}
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleDataChange("icon", name)}
                className={block.data.icon === name ? "border-primary" : ""}
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </FormItem>

        <FormItem>
          <Label htmlFor="icon-label">Label (Optional)</Label>
          <Input
            id="icon-label"
            value={block.data.label || ""}
            onChange={(e) => handleDataChange("label", e.target.value)}
            placeholder="Optional text label"
          />
        </FormItem>

        <div className="grid grid-cols-3 gap-3">
          {/* Size - Responsive aware */}
          <ResponsiveField
            fieldName="size"
            data={block.data}
            onChange={(newData) =>
              onChange({ ...block, data: newData as IconBlockData["data"] })
            }
            label="Size"
          >
            <Select
              value={size}
              onValueChange={(value) => handleDataChange("size", value)}
            >
              <SelectTrigger id="icon-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
                <SelectItem value="2xl">2XL</SelectItem>
              </SelectContent>
            </Select>
          </ResponsiveField>

          <FormItem>
            <Label htmlFor="icon-color">Color</Label>
            <Select
              value={color}
              onValueChange={(value) => handleDataChange("color", value)}
            >
              <SelectTrigger id="icon-color">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="muted">Muted</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          <FormItem>
            <Label htmlFor="icon-align">Alignment</Label>
            <Select
              value={align}
              onValueChange={(value) => handleDataChange("align", value)}
            >
              <SelectTrigger id="icon-align">
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

        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">
            Preview ({breakpoint}):
          </p>
          <div className={`flex items-center gap-3 ${alignMap[align]}`}>
            <IconComponent className={`${sizeMap[size]} ${colorMap[color]}`} />
            {block.data.label && (
              <span className="text-sm font-medium">{block.data.label}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
