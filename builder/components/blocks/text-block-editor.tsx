"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Type } from "lucide-react";

interface TextBlockData {
  _key: string;
  _type: "text-block";
  data: {
    text: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    align?: "left" | "center" | "right" | "justify";
    variant?: "body" | "muted" | "caption";
    maxWidth?: string;
  };
}

interface TextBlockEditorProps {
  block: TextBlockData;
  onChange: (block: TextBlockData) => void;
  onDelete: () => void;
}

/**
 * Text Block Editor
 *
 * Simple paragraph text block with size, alignment, and style options.
 * Foundation block for most written content.
 */
export function TextBlockEditor({
  block,
  onChange,
  onDelete,
}: TextBlockEditorProps) {
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

  // Default values for display
  const size = block.data.size || "md";
  const align = block.data.align || "left";
  const variant = block.data.variant || "body";

  // Map size to font size classes
  const sizeMap = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  // Map align to text align classes
  const alignMap = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };

  // Map variant to color classes
  const variantMap = {
    body: "text-foreground",
    muted: "text-muted-foreground",
    caption: "text-muted-foreground text-sm",
  };

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <p
          className={`${sizeMap[size]} ${alignMap[align]} ${variantMap[variant]}`}
          style={{
            maxWidth: block.data.maxWidth || "none",
            margin: align === "center" ? "0 auto" : undefined,
          }}
        >
          {block.data.text || "Start typing..."}
        </p>
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
          <Type className="h-4 w-4" />
          Text Block
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
        <div>
          <Label htmlFor="text-content">Text Content</Label>
          <Textarea
            id="text-content"
            value={block.data.text}
            onChange={(e) => handleDataChange("text", e.target.value)}
            placeholder="Enter your text here..."
            rows={4}
            className="resize-y"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="text-size">Size</Label>
            <Select
              value={size}
              onValueChange={(value) => handleDataChange("size", value)}
            >
              <SelectTrigger id="text-size">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">Extra Small</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="text-align">Alignment</Label>
            <Select
              value={align}
              onValueChange={(value) => handleDataChange("align", value)}
            >
              <SelectTrigger id="text-align">
                <SelectValue placeholder="Select alignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="justify">Justify</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="text-variant">Variant</Label>
            <Select
              value={variant}
              onValueChange={(value) => handleDataChange("variant", value)}
            >
              <SelectTrigger id="text-variant">
                <SelectValue placeholder="Select variant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="body">Body Text</SelectItem>
                <SelectItem value="muted">Muted (Subtle)</SelectItem>
                <SelectItem value="caption">Caption (Small)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="text-maxwidth">Max Width</Label>
            <Input
              id="text-maxwidth"
              value={block.data.maxWidth || ""}
              onChange={(e) => handleDataChange("maxWidth", e.target.value)}
              placeholder="e.g., 65ch, 600px"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Optional CSS value for readable width
            </p>
          </div>
        </div>

        {/* Visual preview */}
        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
          <p
            className={`${sizeMap[size]} ${alignMap[align]} ${variantMap[variant]}`}
            style={{
              maxWidth: block.data.maxWidth || "none",
              margin: align === "center" ? "0 auto" : undefined,
            }}
          >
            {block.data.text || "Start typing..."}
          </p>
        </div>
      </div>
    </div>
  );
}
