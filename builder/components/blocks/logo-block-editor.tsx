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
import { Trash2, ImageIcon } from "lucide-react";
import { FormItem } from "@/components/ui/form";

interface LogoBlockData {
  _key: string;
  _type: "logo-block";
  data: {
    src: string;
    alt: string;
    href?: string;
    size: "sm" | "md" | "lg" | "xl";
    align: "left" | "center" | "right";
    openInNewTab?: boolean;
  };
}

interface LogoBlockEditorProps {
  block: LogoBlockData;
  onChange: (block: LogoBlockData) => void;
  onDelete: () => void;
}

export function LogoBlockEditor({
  block,
  onChange,
  onDelete,
}: LogoBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDataChange = (field: string, value: unknown) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        [field]: value,
      },
    });
  };

  const size = block.data.size || "md";
  const align = block.data.align || "left";

  const sizeClasses = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16",
    xl: "h-24",
  };

  const alignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <div className={`flex ${alignClasses[align]}`}>
          {block.data.src ? (
            <img
              src={block.data.src}
              alt={block.data.alt || "Logo"}
              className={`${sizeClasses[size]} w-auto object-contain`}
            />
          ) : (
            <div
              className={`${sizeClasses[size]} w-24 bg-muted rounded flex items-center justify-center`}
            >
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
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
          <ImageIcon className="h-4 w-4" />
          Logo Block
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
          <Label htmlFor="logo-src">Logo URL</Label>
          <Input
            id="logo-src"
            value={block.data.src}
            onChange={(e) => handleDataChange("src", e.target.value)}
            placeholder="https://example.com/logo.png"
          />
        </FormItem>

        <FormItem>
          <Label htmlFor="logo-alt">Alt Text</Label>
          <Input
            id="logo-alt"
            value={block.data.alt}
            onChange={(e) => handleDataChange("alt", e.target.value)}
            placeholder="Company logo"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Required for accessibility
          </p>
        </FormItem>

        <FormItem>
          <Label htmlFor="logo-href">Link URL (Optional)</Label>
          <Input
            id="logo-href"
            value={block.data.href || ""}
            onChange={(e) => handleDataChange("href", e.target.value)}
            placeholder="https://example.com"
          />
        </FormItem>

        {block.data.href && (
          <FormItem className="flex items-center gap-2">
            <Input
              type="checkbox"
              id="logo-new-tab"
              checked={block.data.openInNewTab || false}
              onChange={(e) =>
                handleDataChange("openInNewTab", e.target.checked)
              }
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="logo-new-tab" className="cursor-pointer">
              Open in new tab
            </Label>
          </FormItem>
        )}

        <div className="grid grid-cols-2 gap-3">
          <FormItem>
            <Label htmlFor="logo-size">Size</Label>
            <Select
              value={size}
              onValueChange={(value) => handleDataChange("size", value)}
            >
              <SelectTrigger id="logo-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          <FormItem>
            <Label htmlFor="logo-align">Alignment</Label>
            <Select
              value={align}
              onValueChange={(value) => handleDataChange("align", value)}
            >
              <SelectTrigger id="logo-align">
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
          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
          <div className={`flex ${alignClasses[align]}`}>
            {block.data.src ? (
              <img
                src={block.data.src}
                alt={block.data.alt || "Logo"}
                className={`${sizeClasses[size]} w-auto object-contain`}
              />
            ) : (
              <div
                className={`${sizeClasses[size]} w-24 bg-muted rounded flex items-center justify-center`}
              >
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
