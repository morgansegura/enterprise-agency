"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { THEME_PRESETS, type ThemePreset } from "@/lib/theme/theme-presets";
import "./theme-preset-picker.css";

interface ThemePresetPickerProps {
  /** Called with the full preset when user selects one */
  onApply: (preset: ThemePreset) => void;
  /** ID of the currently active preset (if any) */
  activePresetId?: string;
}

/**
 * ThemePresetPicker — grid of theme presets users can apply with one click.
 * Each preset shows a 4-color swatch preview and the preset name.
 */
export function ThemePresetPicker({
  onApply,
  activePresetId,
}: ThemePresetPickerProps) {
  return (
    <div className="theme-preset-picker">
      <div className="theme-preset-picker-header">
        <h4 className="theme-preset-picker-title">Theme Presets</h4>
        <p className="theme-preset-picker-description">
          One-click theme. You can override any color below.
        </p>
      </div>
      <div className="theme-preset-picker-grid">
        {THEME_PRESETS.map((preset) => {
          const isActive = preset.id === activePresetId;
          return (
            <button
              key={preset.id}
              type="button"
              className={`theme-preset-card ${isActive ? "is-active" : ""}`}
              onClick={() => onApply(preset)}
              title={preset.description}
            >
              {/* Preview swatches */}
              <div className="theme-preset-swatches">
                <div
                  className="theme-preset-swatch"
                  style={{ backgroundColor: preset.colors.primary }}
                />
                <div
                  className="theme-preset-swatch"
                  style={{ backgroundColor: preset.colors.accent }}
                />
                <div
                  className="theme-preset-swatch"
                  style={{ backgroundColor: preset.colors.background }}
                />
                <div
                  className="theme-preset-swatch"
                  style={{ backgroundColor: preset.colors.foreground }}
                />
              </div>
              <div className="theme-preset-meta">
                <span className="theme-preset-name">{preset.name}</span>
                <span className="theme-preset-category">
                  {preset.category}
                </span>
              </div>
              {isActive && (
                <div className="theme-preset-check">
                  <Check className="size-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
