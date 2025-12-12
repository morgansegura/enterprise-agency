"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Type,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";

import "./format-toolbar.css";

interface FormatToolbarProps {
  // Text formatting
  align?: "left" | "center" | "right";
  onAlignChange?: (align: "left" | "center" | "right") => void;

  // Size options
  size?: string;
  sizeOptions?: { value: string; label: string }[];
  onSizeChange?: (size: string) => void;

  // Weight options
  weight?: string;
  weightOptions?: { value: string; label: string }[];
  onWeightChange?: (weight: string) => void;

  // Color options
  color?: string;
  colorOptions?: { value: string; label: string }[];
  onColorChange?: (color: string) => void;

  // Semantic level (for headings)
  level?: string;
  levelOptions?: { value: string; label: string }[];
  onLevelChange?: (level: string) => void;

  className?: string;
}

/**
 * FormatToolbar
 *
 * Floating toolbar for text formatting options.
 * Appears above selected text/heading blocks.
 */
export function FormatToolbar({
  align,
  onAlignChange,
  size,
  sizeOptions,
  onSizeChange,
  weight,
  weightOptions,
  onWeightChange,
  color,
  colorOptions,
  onColorChange,
  level,
  levelOptions,
  onLevelChange,
  className,
}: FormatToolbarProps) {
  return (
    <div className={cn("format-toolbar", className)}>
      {/* Semantic Level (H1-H6) */}
      {levelOptions && onLevelChange && (
        <Select value={level} onValueChange={onLevelChange}>
          <SelectTrigger className="format-toolbar__select format-toolbar__select--level">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {levelOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Size */}
      {sizeOptions && onSizeChange && (
        <Select value={size} onValueChange={onSizeChange}>
          <SelectTrigger className="format-toolbar__select format-toolbar__select--size">
            <Type className="h-3 w-3 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sizeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Alignment */}
      {onAlignChange && (
        <div className="format-toolbar__group">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onAlignChange("left")}
            className={cn(align === "left" && "bg-accent")}
            title="Align left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onAlignChange("center")}
            className={cn(align === "center" && "bg-accent")}
            title="Align center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onAlignChange("right")}
            className={cn(align === "right" && "bg-accent")}
            title="Align right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Weight */}
      {weightOptions && onWeightChange && (
        <Select value={weight} onValueChange={onWeightChange}>
          <SelectTrigger className="format-toolbar__select format-toolbar__select--weight">
            <Bold className="h-3 w-3 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {weightOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Color */}
      {colorOptions && onColorChange && (
        <Select value={color} onValueChange={onColorChange}>
          <SelectTrigger className="format-toolbar__select format-toolbar__select--color">
            <Palette className="h-3 w-3 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {colorOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
