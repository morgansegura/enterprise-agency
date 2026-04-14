"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
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

// =============================================================================
// Parse / format helpers
// =============================================================================

function parseValue(raw: string): { num: number; unit: string } {
  if (!raw || raw === "auto") return { num: 0, unit: "px" };
  const match = raw.match(/^(-?\d*\.?\d+)\s*(px|rem|em|%|vw|vh)?$/);
  if (match) return { num: parseFloat(match[1]), unit: match[2] || "px" };
  return { num: 0, unit: "px" };
}

function formatValue(num: number, unit: string): string {
  if (num === 0) return "";
  return `${num}${unit}`;
}

// =============================================================================
// Spacing Group — compact inputs with axis locking
// =============================================================================

function SpacingGroup({
  label,
  values,
  allowAuto = false,
  onChange,
  onBatchChange,
}: {
  label: "Margin" | "Padding";
  values: { Top: string; Right: string; Bottom: string; Left: string };
  allowAuto?: boolean;
  onChange: (property: string, value: string) => void;
  onBatchChange?: (updates: Record<string, string>) => void;
}) {
  const [linkedV, setLinkedV] = React.useState(false);
  const [linkedH, setLinkedH] = React.useState(false);
  const prefix = label.toLowerCase();

  const handleChange = (side: string, value: string) => {
    const updates: Record<string, string> = {};
    updates[`${prefix}${side}`] = value;

    // Vertical lock: Top ↔ Bottom
    if (linkedV && (side === "Top" || side === "Bottom")) {
      updates[`${prefix}Top`] = value;
      updates[`${prefix}Bottom`] = value;
    }

    // Horizontal lock: Left ↔ Right
    if (linkedH && (side === "Left" || side === "Right")) {
      updates[`${prefix}Left`] = value;
      updates[`${prefix}Right`] = value;
    }

    if (onBatchChange && Object.keys(updates).length > 1) {
      onBatchChange(updates);
    } else {
      Object.entries(updates).forEach(([k, v]) => onChange(k, v));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    side: string,
    raw: string,
  ) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    if (raw === "auto") return;
    e.preventDefault();
    const { num, unit } = parseValue(raw);
    const step = e.shiftKey ? 10 : 1;
    const next = e.key === "ArrowUp" ? num + step : num - step;
    handleChange(side, formatValue(next, unit));
  };

  const handleInputChange = (side: string, raw: string, inputVal: string) => {
    // Allow typing "auto" for margin
    if (allowAuto && inputVal.toLowerCase() === "auto") {
      handleChange(side, "auto");
      return;
    }
    if (inputVal === "" || inputVal === "0") {
      handleChange(side, inputVal === "" ? "" : "0");
      return;
    }
    const n = parseFloat(inputVal);
    if (!isNaN(n)) {
      const { unit } = parseValue(raw);
      handleChange(side, `${n}${unit}`);
    }
  };

  const displayValue = (raw: string) => {
    if (raw === "auto") return "auto";
    if (!raw) return "";
    return raw.replace("px", "").replace("rem", "");
  };

  return (
    <div className="spacing-group">
      <span className="spacing-group-title">{label}</span>

      {/* Vertical pair: Top / Bottom */}
      <div className="spacing-axis-row">
        <div className="spacing-input-pair">
          <div className="spacing-input-cell">
            <label className="spacing-input-label">Top</label>
            <Input
              type="text"
              inputMode="decimal"
              value={displayValue(values.Top)}
              onChange={(e) =>
                handleInputChange("Top", values.Top, e.target.value)
              }
              onKeyDown={(e) => handleKeyDown(e, "Top", values.Top)}
              placeholder=""
              className="spacing-input"
            />
          </div>
          <div className="spacing-input-cell">
            <label className="spacing-input-label">Bottom</label>
            <Input
              type="text"
              inputMode="decimal"
              value={displayValue(values.Bottom)}
              onChange={(e) =>
                handleInputChange("Bottom", values.Bottom, e.target.value)
              }
              onKeyDown={(e) => handleKeyDown(e, "Bottom", values.Bottom)}
              placeholder=""
              className="spacing-input"
            />
          </div>
        </div>
        <button
          type="button"
          className={`spacing-link-btn ${linkedV ? "is-linked" : ""}`}
          onClick={() => setLinkedV(!linkedV)}
          title={linkedV ? "Unlink top/bottom" : "Link top/bottom"}
        >
          {linkedV ? (
            <Link2 className="size-3" />
          ) : (
            <Link2Off className="size-3" />
          )}
        </button>
      </div>

      {/* Horizontal pair: Left / Right */}
      <div className="spacing-axis-row">
        <div className="spacing-input-pair">
          <div className="spacing-input-cell">
            <label className="spacing-input-label">Left</label>
            <Input
              type="text"
              inputMode="decimal"
              value={displayValue(values.Left)}
              onChange={(e) =>
                handleInputChange("Left", values.Left, e.target.value)
              }
              onKeyDown={(e) => handleKeyDown(e, "Left", values.Left)}
              placeholder=""
              className="spacing-input"
            />
          </div>
          <div className="spacing-input-cell">
            <label className="spacing-input-label">Right</label>
            <Input
              type="text"
              inputMode="decimal"
              value={displayValue(values.Right)}
              onChange={(e) =>
                handleInputChange("Right", values.Right, e.target.value)
              }
              onKeyDown={(e) => handleKeyDown(e, "Right", values.Right)}
              placeholder=""
              className="spacing-input"
            />
          </div>
        </div>
        <button
          type="button"
          className={`spacing-link-btn ${linkedH ? "is-linked" : ""}`}
          onClick={() => setLinkedH(!linkedH)}
          title={linkedH ? "Unlink left/right" : "Link left/right"}
        >
          {linkedH ? (
            <Link2 className="size-3" />
          ) : (
            <Link2Off className="size-3" />
          )}
        </button>
      </div>
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
  return (
    <div className="spacing-editor">
      <SpacingGroup
        label="Padding"
        values={{
          Top: paddingTop,
          Right: paddingRight,
          Bottom: paddingBottom,
          Left: paddingLeft,
        }}
        onChange={onChange}
        onBatchChange={onBatchChange}
      />

      <SpacingGroup
        label="Margin"
        values={{
          Top: marginTop,
          Right: marginRight,
          Bottom: marginBottom,
          Left: marginLeft,
        }}
        allowAuto
        onChange={onChange}
        onBatchChange={onBatchChange}
      />
    </div>
  );
}
