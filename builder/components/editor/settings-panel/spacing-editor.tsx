"use client";

import * as React from "react";
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
  /** Optional batch update for linked sides — applies multiple props in one call */
  onBatchChange?: (updates: Record<string, string>) => void;
}

// =============================================================================
// Inline Value Input (compact, for use on box model sides)
// =============================================================================

function SideInput({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  className: string;
}) {
  const display = value ? value.replace("px", "").replace("rem", "") : "";

  return (
    <div className={`spacing-editor-side ${className}`}>
      <input
        type="text"
        className="spacing-editor-input"
        value={display}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "" || raw === "0") {
            onChange(raw === "" ? "" : "0");
            return;
          }
          // If just a number, append px
          const num = parseFloat(raw);
          if (!isNaN(num) && raw === String(num)) {
            onChange(`${num}px`);
          } else {
            onChange(raw);
          }
        }}
        placeholder="0"
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            const current = parseFloat(value) || 0;
            const step = e.shiftKey ? 10 : 1;
            const delta = e.key === "ArrowUp" ? step : -step;
            const unit = value.match(/[a-z%]+$/)?.[0] || "px";
            onChange(`${current + delta}${unit}`);
          }
        }}
      />
    </div>
  );
}

// =============================================================================
// Presets
// =============================================================================

const PADDING_PRESETS = [
  { value: "0", label: "0" },
  { value: "8px", label: "xs" },
  { value: "16px", label: "sm" },
  { value: "24px", label: "md" },
  { value: "32px", label: "lg" },
  { value: "48px", label: "xl" },
];

// =============================================================================
// Component
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
  const [marginLinked, setMarginLinked] = React.useState(false);
  const [paddingLinked, setPaddingLinked] = React.useState(false);

  const handleMarginChange = (side: string, value: string) => {
    if (marginLinked) {
      if (onBatchChange) {
        onBatchChange({
          marginTop: value,
          marginRight: value,
          marginBottom: value,
          marginLeft: value,
        });
      } else {
        onChange("marginTop", value);
        onChange("marginRight", value);
        onChange("marginBottom", value);
        onChange("marginLeft", value);
      }
    } else {
      onChange(side, value);
    }
  };

  const handlePaddingChange = (side: string, value: string) => {
    if (paddingLinked) {
      if (onBatchChange) {
        onBatchChange({
          paddingTop: value,
          paddingRight: value,
          paddingBottom: value,
          paddingLeft: value,
        });
      } else {
        onChange("paddingTop", value);
        onChange("paddingRight", value);
        onChange("paddingBottom", value);
        onChange("paddingLeft", value);
      }
    } else {
      onChange(side, value);
    }
  };

  // Check if all padding values match for preset highlighting
  const allPaddingSame =
    paddingTop === paddingRight &&
    paddingRight === paddingBottom &&
    paddingBottom === paddingLeft;

  return (
    <div className="spacing-editor">
      {/* Box model diagram */}
      <div className="spacing-editor-box">
        {/* Margin layer */}
        <div className="spacing-editor-margin">
          <span className="spacing-editor-margin-label">MARGIN</span>

          <SideInput
            value={marginTop}
            onChange={(v) => handleMarginChange("marginTop", v)}
            className="spacing-editor-side--margin-top"
          />
          <SideInput
            value={marginRight}
            onChange={(v) => handleMarginChange("marginRight", v)}
            className="spacing-editor-side--margin-right"
          />
          <SideInput
            value={marginBottom}
            onChange={(v) => handleMarginChange("marginBottom", v)}
            className="spacing-editor-side--margin-bottom"
          />
          <SideInput
            value={marginLeft}
            onChange={(v) => handleMarginChange("marginLeft", v)}
            className="spacing-editor-side--margin-left"
          />

          {/* Padding layer */}
          <div className="spacing-editor-padding">
            <span className="spacing-editor-padding-label">PADDING</span>

            <SideInput
              value={paddingTop}
              onChange={(v) => handlePaddingChange("paddingTop", v)}
              className="spacing-editor-side--padding-top"
            />
            <SideInput
              value={paddingRight}
              onChange={(v) => handlePaddingChange("paddingRight", v)}
              className="spacing-editor-side--padding-right"
            />
            <SideInput
              value={paddingBottom}
              onChange={(v) => handlePaddingChange("paddingBottom", v)}
              className="spacing-editor-side--padding-bottom"
            />
            <SideInput
              value={paddingLeft}
              onChange={(v) => handlePaddingChange("paddingLeft", v)}
              className="spacing-editor-side--padding-left"
            />

            {/* Content center */}
            <div className="spacing-editor-content">
              <span className="spacing-editor-content-label">content</span>
            </div>
          </div>
        </div>
      </div>

      {/* Link toggles */}
      <div className="spacing-editor-link-row">
        <button
          type="button"
          className={`spacing-editor-link-btn ${marginLinked ? "is-linked" : ""}`}
          onClick={() => setMarginLinked(!marginLinked)}
          title={
            marginLinked ? "Unlink margin sides" : "Link margin sides"
          }
        >
          {marginLinked ? (
            <Link2 className="h-2.5 w-2.5" />
          ) : (
            <Link2Off className="h-2.5 w-2.5" />
          )}
          Margin
        </button>
        <button
          type="button"
          className={`spacing-editor-link-btn ${paddingLinked ? "is-linked" : ""}`}
          onClick={() => setPaddingLinked(!paddingLinked)}
          title={
            paddingLinked ? "Unlink padding sides" : "Link padding sides"
          }
        >
          {paddingLinked ? (
            <Link2 className="h-2.5 w-2.5" />
          ) : (
            <Link2Off className="h-2.5 w-2.5" />
          )}
          Padding
        </button>
      </div>

      {/* Padding presets */}
      <div className="spacing-editor-presets">
        <span className="spacing-editor-preset-label">Presets</span>
        {PADDING_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className={`spacing-editor-preset-btn ${
              allPaddingSame && paddingTop === preset.value
                ? "is-active"
                : ""
            }`}
            onClick={() => {
              if (onBatchChange) {
                onBatchChange({
                  paddingTop: preset.value,
                  paddingRight: preset.value,
                  paddingBottom: preset.value,
                  paddingLeft: preset.value,
                });
              } else {
                onChange("paddingTop", preset.value);
                onChange("paddingRight", preset.value);
                onChange("paddingBottom", preset.value);
                onChange("paddingLeft", preset.value);
              }
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
