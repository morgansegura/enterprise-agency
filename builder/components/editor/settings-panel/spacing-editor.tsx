"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link2, Link2Off } from "lucide-react";
import "./spacing-editor.css";

// =============================================================================
// Types
// =============================================================================

interface SpacingEditorProps {
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  onChange: (property: string, value: string) => void;
  onBatchChange?: (updates: Record<string, string>) => void;
}

type SpacingMode = "presets" | "custom";

// =============================================================================
// Presets
// =============================================================================

const PRESETS = [
  { value: "0", label: "0" },
  { value: "4px", label: "2xs" },
  { value: "8px", label: "xs" },
  { value: "16px", label: "sm" },
  { value: "24px", label: "md" },
  { value: "32px", label: "lg" },
  { value: "48px", label: "xl" },
  { value: "64px", label: "2xl" },
];

const SIDES = ["Top", "Right", "Bottom", "Left"] as const;

/** Find the preset label for a value, or return the raw value */
function presetValueFor(value: string): string {
  if (!value) return "0";
  const match = PRESETS.find((p) => p.value === value);
  return match ? match.value : value;
}

// =============================================================================
// Spacing Group — one section for margin or padding
// =============================================================================

function SpacingGroup({
  label,
  values,
  mode,
  onChange,
  onBatchChange,
}: {
  label: "Margin" | "Padding";
  values: { top: string; right: string; bottom: string; left: string };
  mode: SpacingMode;
  onChange: (property: string, value: string) => void;
  onBatchChange?: (updates: Record<string, string>) => void;
}) {
  const [linked, setLinked] = React.useState(false);
  const prefix = label.toLowerCase();

  const handleChange = (side: string, value: string) => {
    if (linked) {
      const updates = {
        [`${prefix}Top`]: value,
        [`${prefix}Right`]: value,
        [`${prefix}Bottom`]: value,
        [`${prefix}Left`]: value,
      };
      if (onBatchChange) {
        onBatchChange(updates);
      } else {
        Object.entries(updates).forEach(([k, v]) => onChange(k, v));
      }
    } else {
      onChange(side, value);
    }
  };

  const sideValues = {
    Top: values.top,
    Right: values.right,
    Bottom: values.bottom,
    Left: values.left,
  };

  return (
    <div className="spacing-group">
      <div className="spacing-group-header">
        <span className="spacing-group-title">{label}</span>
        <button
          type="button"
          className={`spacing-link-btn ${linked ? "is-linked" : ""}`}
          onClick={() => setLinked(!linked)}
          title={linked ? "Unlink sides" : "Link all sides"}
        >
          {linked ? (
            <Link2 className="size-3" />
          ) : (
            <Link2Off className="size-3" />
          )}
        </button>
      </div>

      {mode === "presets" ? (
        <div className="spacing-preset-grid">
          {SIDES.map((side) => (
            <div key={side} className="spacing-preset-cell">
              <label className="spacing-preset-label">{side}</label>
              <Select
                value={presetValueFor(sideValues[side])}
                onValueChange={(v) =>
                  handleChange(`${prefix}${side}`, v)
                }
              >
                <SelectTrigger className="spacing-preset-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRESETS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      ) : (
        <div className="spacing-custom-stack">
          {SIDES.map((side) => {
            const raw = sideValues[side];
            const num = parseFloat(raw) || 0;
            return (
              <div key={side} className="spacing-custom-row">
                <label className="spacing-custom-label">{side}</label>
                <Slider
                  value={[num]}
                  onValueChange={([v]) => {
                    const unit = raw.match(/[a-z%]+$/)?.[0] || "px";
                    handleChange(
                      `${prefix}${side}`,
                      v === 0 ? "0" : `${v}${unit}`,
                    );
                  }}
                  min={0}
                  max={120}
                  step={1}
                  className="spacing-custom-slider"
                />
                <Input
                  type="text"
                  inputMode="decimal"
                  value={raw ? raw.replace("px", "").replace("rem", "") : ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "" || v === "0") {
                      handleChange(
                        `${prefix}${side}`,
                        v === "" ? "" : "0",
                      );
                      return;
                    }
                    const n = parseFloat(v);
                    if (!isNaN(n)) {
                      handleChange(`${prefix}${side}`, `${n}px`);
                    }
                  }}
                  placeholder="0"
                  className="spacing-custom-input"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SpacingEditor
// =============================================================================

export function SpacingEditor({
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  onChange,
  onBatchChange,
}: SpacingEditorProps) {
  const [mode, setMode] = React.useState<SpacingMode>("presets");

  return (
    <div className="spacing-editor">
      {/* Mode toggle */}
      <div className="spacing-mode-toggle">
        <button
          type="button"
          className={`spacing-mode-btn ${mode === "presets" ? "is-active" : ""}`}
          onClick={() => setMode("presets")}
        >
          Presets
        </button>
        <button
          type="button"
          className={`spacing-mode-btn ${mode === "custom" ? "is-active" : ""}`}
          onClick={() => setMode("custom")}
        >
          Custom
        </button>
      </div>

      <SpacingGroup
        label="Padding"
        values={{
          top: paddingTop,
          right: paddingRight,
          bottom: paddingBottom,
          left: paddingLeft,
        }}
        mode={mode}
        onChange={onChange}
        onBatchChange={onBatchChange}
      />

      <SpacingGroup
        label="Margin"
        values={{
          top: marginTop,
          right: marginRight,
          bottom: marginBottom,
          left: marginLeft,
        }}
        mode={mode}
        onChange={onChange}
        onBatchChange={onBatchChange}
      />
    </div>
  );
}
