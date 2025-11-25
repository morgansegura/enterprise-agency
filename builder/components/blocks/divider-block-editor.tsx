"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Minus } from "lucide-react";

interface DividerBlockData {
  _key: string;
  _type: "divider-block";
  data: {
    style?: "solid" | "dashed" | "dotted";
    thickness?: "thin" | "medium" | "thick";
    spacing?: "sm" | "md" | "lg";
    color?: "default" | "muted";
  };
}

interface DividerBlockEditorProps {
  block: DividerBlockData;
  onChange: (block: DividerBlockData) => void;
  onDelete: () => void;
}

/**
 * Divider Block Editor
 *
 * Creates horizontal line separators with customizable style, thickness, spacing, and color.
 * Useful for visually separating content sections.
 */
export function DividerBlockEditor({
  block,
  onChange,
  onDelete,
}: DividerBlockEditorProps) {
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
  const style = block.data.style || "solid";
  const thickness = block.data.thickness || "thin";
  const spacing = block.data.spacing || "md";
  const color = block.data.color || "default";

  // Map thickness to pixels
  const thicknessMap = {
    thin: "1px",
    medium: "2px",
    thick: "4px",
  };

  // Map spacing to padding
  const spacingMap = {
    sm: "1rem",
    md: "2rem",
    lg: "3rem",
  };

  if (!isEditing) {
    return (
      <div
        className="group relative cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
        style={{
          paddingTop: spacingMap[spacing],
          paddingBottom: spacingMap[spacing],
        }}
      >
        <div className="relative">
          <hr
            className={`border-0 ${color === "muted" ? "bg-muted-foreground/30" : "bg-border"}`}
            style={{
              height: thicknessMap[thickness],
              borderStyle: style,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-background px-2 py-1 rounded border text-xs text-muted-foreground flex items-center gap-1">
              <Minus className="h-3 w-3" />
              <span>Divider ({style})</span>
            </div>
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
        <h4 className="font-semibold text-sm">Divider Block</h4>
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
          <Label htmlFor="divider-style">Style</Label>
          <Select
            value={style}
            onValueChange={(value) => handleDataChange("style", value)}
          >
            <SelectTrigger id="divider-style">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solid Line</SelectItem>
              <SelectItem value="dashed">Dashed Line</SelectItem>
              <SelectItem value="dotted">Dotted Line</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="divider-thickness">Thickness</Label>
          <Select
            value={thickness}
            onValueChange={(value) => handleDataChange("thickness", value)}
          >
            <SelectTrigger id="divider-thickness">
              <SelectValue placeholder="Select thickness" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thin">Thin (1px)</SelectItem>
              <SelectItem value="medium">Medium (2px)</SelectItem>
              <SelectItem value="thick">Thick (4px)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="divider-spacing">Vertical Spacing</Label>
          <Select
            value={spacing}
            onValueChange={(value) => handleDataChange("spacing", value)}
          >
            <SelectTrigger id="divider-spacing">
              <SelectValue placeholder="Select spacing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Space above and below the divider
          </p>
        </div>

        <div>
          <Label htmlFor="divider-color">Color</Label>
          <Select
            value={color}
            onValueChange={(value) => handleDataChange("color", value)}
          >
            <SelectTrigger id="divider-color">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default Border</SelectItem>
              <SelectItem value="muted">Muted (Subtle)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Visual preview */}
        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
          <hr
            className={`border-0 ${color === "muted" ? "bg-muted-foreground/30" : "bg-border"}`}
            style={{
              height: thicknessMap[thickness],
              borderStyle: style,
            }}
          />
        </div>
      </div>
    </div>
  );
}
