"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  BORDER_WIDTH_OPTIONS,
  BORDER_STYLE_OPTIONS,
  BORDER_RADIUS_OPTIONS,
  SHADOW_OPTIONS,
} from "@/lib/constants";

import "./border-editor.css";

// =============================================================================
// Types
// =============================================================================

export interface BorderValues {
  borderTop?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRight?: string;
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: string;
  shadow?: string;
}

export interface BorderEditorProps {
  /** Current border values */
  value: BorderValues;
  /** Called when any border value changes */
  onChange: (values: Partial<BorderValues>) => void;
  /** Optional class name */
  className?: string;
  /** Show all 4 sides or just top/bottom (default: all 4) */
  mode?: "all" | "vertical";
  /** Show shadow control */
  showShadow?: boolean;
  /** Show section titles */
  showTitles?: boolean;
}

// =============================================================================
// Border Editor Component
// =============================================================================

/**
 * BorderEditor
 *
 * Unified border editor supporting:
 * - Individual border sides (top, bottom, left, right)
 * - Border color (shown when any border is set)
 * - Border radius
 * - Shadow (optional)
 *
 * Used by SectionSettingsPopover, ContainerSettingsPopover, and SettingsPanel.
 */
export function BorderEditor({
  value,
  onChange,
  className,
  mode = "all",
  showShadow = true,
  showTitles = true,
}: BorderEditorProps) {
  const {
    borderTop = "none",
    borderBottom = "none",
    borderLeft = "none",
    borderRight = "none",
    borderStyle = "solid",
    borderColor = "#e5e5e5",
    borderRadius = "none",
    shadow = "none",
  } = value;

  // Check if any border is set
  const hasBorder =
    borderTop !== "none" ||
    borderBottom !== "none" ||
    borderLeft !== "none" ||
    borderRight !== "none";

  const handleChange = (field: keyof BorderValues, val: string) => {
    onChange({ [field]: val });
  };

  // Handle "all sides" change for simplified mode
  const handleAllSidesChange = (val: string) => {
    onChange({
      borderTop: val,
      borderBottom: val,
      borderLeft: val,
      borderRight: val,
    });
  };

  return (
    <div className={cn("border-editor", className)}>
      {/* Border Width */}
      <div className="border-editor-section">
        {showTitles && <h4 className="border-editor-title">BORDER</h4>}

        {mode === "all" ? (
          <>
            {/* Top & Bottom row */}
            <div className="border-editor-row">
              <div className="border-editor-field">
                <Label className="border-editor-label">Top</Label>
                <Select
                  value={borderTop}
                  onValueChange={(v) => handleChange("borderTop", v)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BORDER_WIDTH_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="border-editor-field">
                <Label className="border-editor-label">Bottom</Label>
                <Select
                  value={borderBottom}
                  onValueChange={(v) => handleChange("borderBottom", v)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BORDER_WIDTH_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Left & Right row */}
            <div className="border-editor-row mt-2">
              <div className="border-editor-field">
                <Label className="border-editor-label">Left</Label>
                <Select
                  value={borderLeft}
                  onValueChange={(v) => handleChange("borderLeft", v)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BORDER_WIDTH_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="border-editor-field">
                <Label className="border-editor-label">Right</Label>
                <Select
                  value={borderRight}
                  onValueChange={(v) => handleChange("borderRight", v)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BORDER_WIDTH_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        ) : (
          /* Simplified: all sides at once */
          <div className="border-editor-row">
            <div className="border-editor-field">
              <Label className="border-editor-label">All Sides</Label>
              <Select value={borderTop} onValueChange={handleAllSidesChange}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BORDER_WIDTH_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="border-editor-field">
              <Label className="border-editor-label">Radius</Label>
              <Select
                value={borderRadius}
                onValueChange={(v) => handleChange("borderRadius", v)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BORDER_RADIUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Border Style & Color - only when border is set */}
        {hasBorder && (
          <div className="border-editor-row mt-2">
            <div className="border-editor-field">
              <Label className="border-editor-label">Style</Label>
              <Select
                value={borderStyle}
                onValueChange={(v) => handleChange("borderStyle", v)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BORDER_STYLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="border-editor-field">
              <ColorPicker
                label="Color"
                value={borderColor}
                onChange={(v) => handleChange("borderColor", v)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Border Radius - for "all" mode */}
      {mode === "all" && (
        <div className="border-editor-section">
          {showTitles && <h4 className="border-editor-title">ROUNDED</h4>}
          <Select
            value={borderRadius}
            onValueChange={(v) => handleChange("borderRadius", v)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BORDER_RADIUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Shadow */}
      {showShadow && (
        <div className="border-editor-section">
          {showTitles && <h4 className="border-editor-title">SHADOW</h4>}
          <Select
            value={shadow}
            onValueChange={(v) => handleChange("shadow", v)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SHADOW_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
