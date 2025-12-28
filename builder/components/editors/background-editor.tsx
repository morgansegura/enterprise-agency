"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Palette, LayoutGrid, Image as ImageIcon, Ban, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColorPicker } from "@/components/ui/color-picker";
import { TailwindColorPicker } from "@/components/ui/color-picker";
import type { SectionBackground } from "@/lib/types/section";
import {
  BACKGROUND_SIZE_OPTIONS,
  BACKGROUND_POSITION_OPTIONS,
} from "@/lib/constants";

import "./background-editor.css";

// =============================================================================
// Tailwind Gradient Direction Options
// =============================================================================

const GRADIENT_DIRECTION_OPTIONS = [
  { value: "to-t", label: "To Top" },
  { value: "to-tr", label: "To Top Right" },
  { value: "to-r", label: "To Right" },
  { value: "to-br", label: "To Bottom Right" },
  { value: "to-b", label: "To Bottom" },
  { value: "to-bl", label: "To Bottom Left" },
  { value: "to-l", label: "To Left" },
  { value: "to-tl", label: "To Top Left" },
];

// =============================================================================
// Types
// =============================================================================

export interface TailwindGradient {
  direction: string; // 'to-t', 'to-r', 'to-b', 'to-l', 'to-tr', 'to-br', 'to-bl', 'to-tl'
  from: string;      // Tailwind color like 'blue-500'
  via?: string;      // Optional middle color
  to: string;        // Tailwind color like 'pink-500'
}

export interface BackgroundValue {
  type: "none" | "color" | "gradient" | "image";
  color?: string;           // Hex color for solid backgrounds
  gradient?: TailwindGradient;
  image?: {
    src: string;
    size?: "cover" | "contain" | "auto";
    position?: string;
    overlay?: string;
  };
}

export interface BackgroundEditorProps {
  /** Current background value */
  value: BackgroundValue | SectionBackground;
  /** Called when background changes */
  onChange: (background: BackgroundValue) => void;
  /** Optional class name */
  className?: string;
  /** Show section title */
  showTitle?: boolean;
  /** Label for image upload button (for media library integration) */
  onSelectImage?: () => void;
}

// =============================================================================
// Default Values
// =============================================================================

const DEFAULT_COLOR = "#f5f5f5";
const DEFAULT_GRADIENT: TailwindGradient = {
  direction: "to-r",
  from: "blue-500",
  to: "purple-500",
};
const DEFAULT_IMAGE: BackgroundValue["image"] = {
  src: "",
  size: "cover",
  position: "center",
};

// =============================================================================
// Normalize legacy SectionBackground to new BackgroundValue
// =============================================================================

function normalizeBackground(bg: BackgroundValue | SectionBackground | undefined): BackgroundValue {
  if (!bg) return { type: "none" };

  // Already in new format
  if ("gradient" in bg && bg.gradient && "direction" in bg.gradient) {
    return bg as BackgroundValue;
  }

  // Legacy format - convert
  const legacy = bg as SectionBackground;
  if (legacy.type === "gradient" && legacy.gradient) {
    // Convert legacy CSS gradient to Tailwind gradient
    return {
      type: "gradient",
      gradient: {
        direction: "to-b",
        from: "gray-100",
        to: "gray-200",
      },
    };
  }

  return {
    type: legacy.type || "none",
    color: legacy.color,
    image: legacy.image,
  };
}

// =============================================================================
// Background Editor Component
// =============================================================================

/**
 * BackgroundEditor
 *
 * Unified background editor supporting:
 * - None (transparent)
 * - Solid color (hex via ColorPicker)
 * - Tailwind Gradient (bg-gradient-to-*, from-*, via-*, to-*)
 * - Image (with media library integration ready)
 */
export function BackgroundEditor({
  value,
  onChange,
  className,
  showTitle = true,
  onSelectImage,
}: BackgroundEditorProps) {
  const background = normalizeBackground(value);
  const [showVia, setShowVia] = React.useState(!!background.gradient?.via);

  const handleTypeChange = (type: BackgroundValue["type"]) => {
    switch (type) {
      case "none":
        onChange({ type: "none" });
        break;
      case "color":
        onChange({
          type: "color",
          color: background.color || DEFAULT_COLOR,
        });
        break;
      case "gradient":
        onChange({
          type: "gradient",
          gradient: background.gradient || DEFAULT_GRADIENT,
        });
        break;
      case "image":
        onChange({
          type: "image",
          image: background.image || DEFAULT_IMAGE,
        });
        break;
    }
  };

  const handleColorChange = (color: string) => {
    onChange({ ...background, color });
  };

  const handleGradientChange = (updates: Partial<TailwindGradient>) => {
    onChange({
      ...background,
      type: "gradient",
      gradient: { ...(background.gradient || DEFAULT_GRADIENT), ...updates },
    });
  };

  const handleImageChange = (updates: Partial<NonNullable<BackgroundValue["image"]>>) => {
    onChange({
      ...background,
      type: "image",
      image: { ...(background.image || DEFAULT_IMAGE), ...updates },
    });
  };

  const toggleVia = () => {
    if (showVia) {
      // Remove via
      const newGradient = { ...(background.gradient || DEFAULT_GRADIENT) };
      delete newGradient.via;
      onChange({ ...background, gradient: newGradient });
      setShowVia(false);
    } else {
      // Add via
      handleGradientChange({ via: "purple-500" });
      setShowVia(true);
    }
  };

  return (
    <div className={cn("background-editor", className)}>
      {showTitle && <h4 className="background-editor-title">TYPE</h4>}

      {/* Type Selector */}
      <div className="background-editor-types">
        <button
          type="button"
          className={cn(
            "background-editor-type-btn",
            background.type === "none" && "active"
          )}
          onClick={() => handleTypeChange("none")}
          title="None"
        >
          <Ban className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={cn(
            "background-editor-type-btn",
            background.type === "color" && "active"
          )}
          onClick={() => handleTypeChange("color")}
          title="Color"
        >
          <Palette className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={cn(
            "background-editor-type-btn",
            background.type === "gradient" && "active"
          )}
          onClick={() => handleTypeChange("gradient")}
          title="Gradient"
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={cn(
            "background-editor-type-btn",
            background.type === "image" && "active"
          )}
          onClick={() => handleTypeChange("image")}
          title="Image"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Color Editor */}
      {background.type === "color" && (
        <div className="background-editor-section">
          <ColorPicker
            label="Color"
            value={background.color || DEFAULT_COLOR}
            onChange={handleColorChange}
          />
        </div>
      )}

      {/* Tailwind Gradient Editor */}
      {background.type === "gradient" && (
        <div className="background-editor-section space-y-3">
          {/* Direction */}
          <div className="background-editor-field">
            <Label className="background-editor-label">Direction</Label>
            <Select
              value={background.gradient?.direction || "to-r"}
              onValueChange={(v) => handleGradientChange({ direction: v })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GRADIENT_DIRECTION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* From Color */}
          <TailwindColorPicker
            label="From"
            value={background.gradient?.from || "blue-500"}
            onChange={(v) => handleGradientChange({ from: v })}
          />

          {/* Via Color (optional) */}
          {showVia && (
            <div className="background-editor-via-row">
              <TailwindColorPicker
                label="Via"
                value={background.gradient?.via || "purple-500"}
                onChange={(v) => handleGradientChange({ via: v })}
              />
              <Button
                variant="ghost"
                size="icon-sm"
                className="background-editor-remove-via"
                onClick={toggleVia}
                title="Remove middle color"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* To Color */}
          <TailwindColorPicker
            label="To"
            value={background.gradient?.to || "pink-500"}
            onChange={(v) => handleGradientChange({ to: v })}
          />

          {/* Add Via button */}
          {!showVia && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={toggleVia}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Middle Color
            </Button>
          )}

          {/* Preview */}
          <div className="background-editor-gradient-preview">
            <div
              className={cn(
                "background-editor-gradient-swatch",
                `bg-gradient-${background.gradient?.direction || "to-r"}`,
                `from-${background.gradient?.from || "blue-500"}`,
                background.gradient?.via && `via-${background.gradient.via}`,
                `to-${background.gradient?.to || "pink-500"}`
              )}
            />
            <span className="background-editor-gradient-classes">
              bg-gradient-{background.gradient?.direction || "to-r"} from-{background.gradient?.from || "blue-500"}
              {background.gradient?.via && ` via-${background.gradient.via}`} to-{background.gradient?.to || "pink-500"}
            </span>
          </div>
        </div>
      )}

      {/* Image Editor */}
      {background.type === "image" && (
        <div className="background-editor-section space-y-3">
          {/* Image URL / Media Library */}
          <div className="background-editor-field">
            <Label className="background-editor-label">Image</Label>
            {onSelectImage ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={onSelectImage}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                {background.image?.src ? "Change Image" : "Select from Library"}
              </Button>
            ) : (
              <Input
                placeholder="https://..."
                className="h-8"
                value={background.image?.src || ""}
                onChange={(e) => handleImageChange({ src: e.target.value })}
              />
            )}
          </div>

          {/* Image Preview */}
          {background.image?.src && (
            <div
              className="background-editor-image-preview"
              style={{ backgroundImage: `url(${background.image.src})` }}
            />
          )}

          {/* Size & Position */}
          <div className="background-editor-row">
            <div className="background-editor-field">
              <Label className="background-editor-label">Size</Label>
              <Select
                value={background.image?.size || "cover"}
                onValueChange={(v) =>
                  handleImageChange({ size: v as "cover" | "contain" | "auto" })
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BACKGROUND_SIZE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="background-editor-field">
              <Label className="background-editor-label">Position</Label>
              <Select
                value={background.image?.position || "center"}
                onValueChange={(v) => handleImageChange({ position: v })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BACKGROUND_POSITION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Overlay */}
          <ColorPicker
            label="Overlay"
            value={background.image?.overlay || "transparent"}
            onChange={(v) => handleImageChange({ overlay: v })}
          />
        </div>
      )}
    </div>
  );
}
