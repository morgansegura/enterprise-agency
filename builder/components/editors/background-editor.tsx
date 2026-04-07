"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Palette,
  LayoutGrid,
  Image as ImageIcon,
  Ban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ColorPicker } from "@/components/ui/color-picker";
import { GradientBuilder } from "@/components/editors/gradient-builder";
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
  /** CSS gradient string (e.g. "linear-gradient(180deg, #000 0%, #fff 100%)") */
  gradientCSS?: string;
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
const DEFAULT_GRADIENT_CSS =
  "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)";
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
  showTitle: _showTitle = true,
  onSelectImage,
}: BackgroundEditorProps) {
  const background = normalizeBackground(value);

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
          gradientCSS:
            background.gradientCSS || DEFAULT_GRADIENT_CSS,
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

  const handleGradientCSSChange = (css: string) => {
    onChange({ ...background, type: "gradient", gradientCSS: css });
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

      {/* CSS Gradient Editor */}
      {background.type === "gradient" && (
        <GradientBuilder
          value={background.gradientCSS || DEFAULT_GRADIENT_CSS}
          onChange={handleGradientCSSChange}
        />
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
