"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTenantTokens } from "@/lib/hooks/use-tenant-tokens";
import { useParams } from "next/navigation";
import "./color-picker.css";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

/** Parse any color string to { hex, alpha } */
function parseColor(value: string): { hex: string; r: number; g: number; b: number; alpha: number } {
  if (!value || value === "transparent") return { hex: "#000000", r: 0, g: 0, b: 0, alpha: 0 };

  const rgbaMatch = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    return { hex, r, g, b, alpha: parseFloat(rgbaMatch[4] ?? "1") };
  }

  // Hex
  let hex = value;
  if (hex.length === 4) hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  return { hex, r, g, b, alpha: 1 };
}

function buildColor(hex: string, alpha: number): string {
  if (alpha === 1) return hex;
  if (alpha === 0) return "transparent";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Common presets
const PRESET_COLORS = [
  "#000000", "#ffffff", "#f8f9fa", "#e9ecef", "#dee2e6",
  "#adb5bd", "#6c757d", "#495057", "#343a40", "#212529",
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
];

/**
 * ColorPicker — custom color picker with:
 * - Hex input
 * - Alpha/opacity slider
 * - Theme color swatches
 * - Preset color swatches
 * - Transparent button
 */
export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const params = useParams();
  const tenantId = params?.id as string;
  const { data: tokens } = useTenantTokens(tenantId);
  const parsed = parseColor(value);

  // Extract theme colors
  const themeColors = React.useMemo(() => {
    const colors: Array<{ name: string; hex: string }> = [];
    const t = (tokens?.colors ?? {}) as Record<string, unknown>;
    if (t.primaryHex) colors.push({ name: "Primary", hex: t.primaryHex as string });
    if (t.accentHex) colors.push({ name: "Accent", hex: t.accentHex as string });
    if (t.background) colors.push({ name: "BG", hex: t.background as string });
    if (t.foreground) colors.push({ name: "FG", hex: t.foreground as string });
    if (t.borderColor) colors.push({ name: "Border", hex: t.borderColor as string });
    return colors;
  }, [tokens]);

  return (
    <div className="color-picker-field">
      {label && <span className="color-picker-label">{label}</span>}
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="color-picker-trigger">
            <div
              className="color-picker-swatch"
              style={{ backgroundColor: value || "transparent" }}
            />
            <span className="color-picker-value">
              {value || "none"}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="color-picker-popover" sideOffset={4}>
          {/* Color preview + hex input */}
          <div className="color-picker-hex-row">
            <div
              className="color-picker-preview"
              style={{ backgroundColor: value || "transparent" }}
            />
            <Input
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 h-7 text-xs font-mono"
            />
          </div>

          {/* Alpha slider */}
          <div className="color-picker-alpha">
            <span className="color-picker-alpha-label">Opacity</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={parsed.alpha}
              onChange={(e) => onChange(buildColor(parsed.hex, parseFloat(e.target.value)))}
              className="color-picker-alpha-slider"
            />
            <span className="color-picker-alpha-value">
              {Math.round(parsed.alpha * 100)}%
            </span>
          </div>

          {/* Theme colors */}
          {themeColors.length > 0 && (
            <div className="color-picker-section">
              <span className="color-picker-section-label">Theme</span>
              <div className="color-picker-swatches">
                {themeColors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    className="color-picker-swatch-btn"
                    style={{ backgroundColor: c.hex }}
                    onClick={() => onChange(c.hex)}
                    title={`${c.name}: ${c.hex}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Preset colors */}
          <div className="color-picker-section">
            <span className="color-picker-section-label">Presets</span>
            <div className="color-picker-swatches">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="color-picker-swatch-btn"
                  style={{ backgroundColor: c }}
                  onClick={() => onChange(buildColor(c, parsed.alpha))}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Transparent */}
          <button
            type="button"
            className="color-picker-transparent"
            onClick={() => onChange("transparent")}
          >
            Set transparent
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
