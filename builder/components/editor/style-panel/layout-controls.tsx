"use client";

import {
  ArrowRight,
  ArrowDown,
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  Minus,
} from "lucide-react";
import "./layout-controls.css";

type DisplayMode = "block" | "flex" | "grid" | "none";
type FlexDirection = "row" | "column";
type FlexJustify = "start" | "center" | "end" | "between";
type FlexAlign = "start" | "center" | "end" | "stretch";

interface LayoutValues {
  display?: DisplayMode;
  flexDirection?: FlexDirection;
  justifyContent?: FlexJustify;
  alignItems?: FlexAlign;
  gap?: string;
  gridColumns?: string;
  flexWrap?: boolean;
}

interface LayoutControlsProps {
  values: LayoutValues;
  onChange: (field: string, value: unknown) => void;
}

export function LayoutControls({ values, onChange }: LayoutControlsProps) {
  const display = values.display || "block";

  return (
    <div className="layout-controls">
      {/* Display mode */}
      <div className="layout-mode-toggle">
        {(["block", "flex", "grid", "none"] as DisplayMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            className="layout-mode-btn"
            data-active={display === mode || undefined}
            onClick={() => onChange("display", mode)}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Flex controls */}
      {display === "flex" && (
        <>
          {/* Direction */}
          <div>
            <div className="layout-gap-label" style={{ marginBottom: 4 }}>
              Direction
            </div>
            <div className="layout-direction-toggle">
              <button
                type="button"
                className="layout-direction-btn"
                data-active={
                  (values.flexDirection || "row") === "row" || undefined
                }
                onClick={() => onChange("flexDirection", "row")}
                title="Row"
              >
                <ArrowRight />
              </button>
              <button
                type="button"
                className="layout-direction-btn"
                data-active={values.flexDirection === "column" || undefined}
                onClick={() => onChange("flexDirection", "column")}
                title="Column"
              >
                <ArrowDown />
              </button>
            </div>
          </div>

          {/* Justify */}
          <div>
            <div className="layout-gap-label" style={{ marginBottom: 4 }}>
              Justify
            </div>
            <div className="layout-align-toggle">
              {(
                [
                  { value: "start", icon: AlignStartHorizontal },
                  { value: "center", icon: AlignCenterHorizontal },
                  { value: "end", icon: AlignEndHorizontal },
                  { value: "between", icon: Minus },
                ] as const
              ).map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  className="layout-align-btn"
                  data-active={
                    (values.justifyContent || "start") === value || undefined
                  }
                  onClick={() => onChange("justifyContent", value)}
                  title={value}
                >
                  <Icon />
                </button>
              ))}
            </div>
          </div>

          {/* Align */}
          <div>
            <div className="layout-gap-label" style={{ marginBottom: 4 }}>
              Align
            </div>
            <div className="layout-align-toggle">
              {(
                [
                  { value: "start", icon: AlignStartVertical },
                  { value: "center", icon: AlignCenterVertical },
                  { value: "end", icon: AlignEndVertical },
                  { value: "stretch", icon: Minus },
                ] as const
              ).map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  className="layout-align-btn"
                  data-active={
                    (values.alignItems || "stretch") === value || undefined
                  }
                  onClick={() => onChange("alignItems", value)}
                  title={value}
                >
                  <Icon />
                </button>
              ))}
            </div>
          </div>

          {/* Gap */}
          <div className="layout-gap-row">
            <span className="layout-gap-label">Gap</span>
            <input
              className="layout-gap-input"
              value={values.gap || ""}
              placeholder="0"
              onChange={(e) => onChange("gap", e.target.value)}
            />
          </div>
        </>
      )}

      {/* Grid controls */}
      {display === "grid" && (
        <>
          <div className="layout-gap-row">
            <span className="layout-gap-label">Columns</span>
            <input
              className="layout-gap-input"
              value={values.gridColumns || ""}
              placeholder="2"
              onChange={(e) => onChange("gridColumns", e.target.value)}
            />
          </div>
          <div className="layout-gap-row">
            <span className="layout-gap-label">Gap</span>
            <input
              className="layout-gap-input"
              value={values.gap || ""}
              placeholder="0"
              onChange={(e) => onChange("gap", e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
}
