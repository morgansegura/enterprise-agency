"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Palette,
  LayoutGrid,
  Image as ImageIcon,
  Ban,
  X,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ColorPicker } from "@/components/ui/color-picker";
import { TailwindColorPicker } from "@/components/ui/color-picker";
import type { SectionBackground } from "@/lib/types/section";
import {
  BACKGROUND_SIZE_OPTIONS,
  BACKGROUND_POSITION_OPTIONS,
} from "@/lib/constants";
import {
  PropertyRow,
  PropertySelect,
} from "@/components/editor/settings-panel/components";

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
  direction: string;
  from: string;
  via?: string;
  to: string;
}

export interface BackgroundValue {
  type: "none" | "color" | "gradient" | "image";
  color?: string;
  gradient?: TailwindGradient;
  image?: {
    src: string;
    size?: "cover" | "contain" | "auto";
    position?: string;
    overlay?: string;
  };
}

export interface BackgroundEditorProps {
  value: BackgroundValue | SectionBackground;
  onChange: (background: BackgroundValue) => void;
  className?: string;
  showTitle?: boolean;
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

function normalizeBackground(
  bg: BackgroundValue | SectionBackground | undefined,
): BackgroundValue {
  if (!bg) return { type: "none" };

  if ("gradient" in bg && bg.gradient && "direction" in bg.gradient) {
    return bg as BackgroundValue;
  }

  const legacy = bg as SectionBackground;
  if (legacy.type === "gradient" && legacy.gradient) {
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

  const handleImageChange = (
    updates: Partial<NonNullable<BackgroundValue["image"]>>,
  ) => {
    onChange({
      ...background,
      type: "image",
      image: { ...(background.image || DEFAULT_IMAGE), ...updates },
    });
  };

  const toggleVia = () => {
    if (showVia) {
      const newGradient = { ...(background.gradient || DEFAULT_GRADIENT) };
      delete newGradient.via;
      onChange({ ...background, gradient: newGradient });
      setShowVia(false);
    } else {
      handleGradientChange({ via: "purple-500" });
      setShowVia(true);
    }
  };

  return (
    <div className={cn("background-editor", className)}>
      {/* Type Selector */}
      <div className="background-editor-types">
        <button
          type="button"
          className={cn(
            "background-editor-type-btn",
            background.type === "none" && "active",
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
            background.type === "color" && "active",
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
            background.type === "gradient" && "active",
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
            background.type === "image" && "active",
          )}
          onClick={() => handleTypeChange("image")}
          title="Image"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Color Editor */}
      {background.type === "color" && (
        <PropertyRow label="Color">
          <ColorPicker
            value={background.color || DEFAULT_COLOR}
            onChange={handleColorChange}
          />
        </PropertyRow>
      )}

      {/* Tailwind Gradient Editor */}
      {background.type === "gradient" && (
        <>
          <PropertyRow label="Direction">
            <PropertySelect
              value={background.gradient?.direction || "to-r"}
              options={GRADIENT_DIRECTION_OPTIONS}
              onChange={(v) => handleGradientChange({ direction: v })}
            />
          </PropertyRow>

          <PropertyRow label="From">
            <TailwindColorPicker
              value={background.gradient?.from || "blue-500"}
              onChange={(v) => handleGradientChange({ from: v })}
            />
          </PropertyRow>

          {showVia && (
            <PropertyRow label="Via">
              <div className="flex items-center gap-1 w-full">
                <TailwindColorPicker
                  value={background.gradient?.via || "purple-500"}
                  onChange={(v) => handleGradientChange({ via: v })}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={toggleVia}
                  title="Remove"
                  className="h-6 w-6 shrink-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </PropertyRow>
          )}

          <PropertyRow label="To">
            <TailwindColorPicker
              value={background.gradient?.to || "pink-500"}
              onChange={(v) => handleGradientChange({ to: v })}
            />
          </PropertyRow>

          {!showVia && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-muted-foreground"
              onClick={toggleVia}
            >
              <PlusCircle className="h-3 w-3 mr-1" />
              Add Via
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
                `to-${background.gradient?.to || "pink-500"}`,
              )}
            />
          </div>
        </>
      )}

      {/* Image Editor */}
      {background.type === "image" && (
        <>
          <PropertyRow label="URL" stacked>
            {onSelectImage ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={onSelectImage}
              >
                <ImageIcon className="h-4 w-4 mr-1" />
                {background.image?.src ? "Change" : "Select"}
              </Button>
            ) : (
              <Input
                placeholder="https://..."
                className="h-8 text-xs"
                value={background.image?.src || ""}
                onChange={(e) => handleImageChange({ src: e.target.value })}
              />
            )}
          </PropertyRow>

          {background.image?.src && (
            <div
              className="background-editor-image-preview"
              style={{ backgroundImage: `url(${background.image.src})` }}
            />
          )}

          <PropertyRow label="Size">
            <PropertySelect
              value={background.image?.size || "cover"}
              options={BACKGROUND_SIZE_OPTIONS}
              onChange={(v) =>
                handleImageChange({ size: v as "cover" | "contain" | "auto" })
              }
            />
          </PropertyRow>

          <PropertyRow label="Position">
            <PropertySelect
              value={background.image?.position || "center"}
              options={BACKGROUND_POSITION_OPTIONS}
              onChange={(v) => handleImageChange({ position: v })}
            />
          </PropertyRow>

          <PropertyRow label="Overlay">
            <ColorPicker
              value={background.image?.overlay || "transparent"}
              onChange={(v) => handleImageChange({ overlay: v })}
            />
          </PropertyRow>
        </>
      )}
    </div>
  );
}
