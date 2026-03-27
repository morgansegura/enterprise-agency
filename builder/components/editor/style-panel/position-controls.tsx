"use client";

import "./position-controls.css";

type PositionType = "static" | "relative" | "absolute" | "fixed" | "sticky";
type OverflowType = "visible" | "hidden" | "scroll" | "auto";

interface PositionValues {
  position?: PositionType;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: string;
  overflow?: OverflowType;
}

interface PositionControlsProps {
  values: PositionValues;
  onChange: (field: string, value: string) => void;
}

export function PositionControls({ values, onChange }: PositionControlsProps) {
  const position = values.position || "static";
  const showOffsets = position !== "static";

  return (
    <div className="position-controls">
      {/* Position type */}
      <div className="position-type-toggle">
        {(["static", "relative", "absolute", "fixed", "sticky"] as PositionType[]).map(
          (type) => (
            <button
              key={type}
              type="button"
              className="position-type-btn"
              data-active={position === type || undefined}
              onClick={() => onChange("position", type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1, 4)}
            </button>
          ),
        )}
      </div>

      {/* Offset inputs — only when not static */}
      {showOffsets && (
        <div className="position-offsets">
          <div className="position-offset-row">
            <div className="position-offset-field">
              <input
                className="position-offset-input"
                value={values.top || ""}
                placeholder="—"
                onChange={(e) => onChange("top", e.target.value)}
              />
              <span className="position-offset-label">Top</span>
            </div>
          </div>
          <div className="position-offset-middle">
            <div className="position-offset-field">
              <input
                className="position-offset-input"
                value={values.left || ""}
                placeholder="—"
                onChange={(e) => onChange("left", e.target.value)}
              />
              <span className="position-offset-label">Left</span>
            </div>
            <div className="position-offset-field">
              <input
                className="position-offset-input"
                value={values.right || ""}
                placeholder="—"
                onChange={(e) => onChange("right", e.target.value)}
              />
              <span className="position-offset-label">Right</span>
            </div>
          </div>
          <div className="position-offset-row">
            <div className="position-offset-field">
              <input
                className="position-offset-input"
                value={values.bottom || ""}
                placeholder="—"
                onChange={(e) => onChange("bottom", e.target.value)}
              />
              <span className="position-offset-label">Bottom</span>
            </div>
          </div>
        </div>
      )}

      {/* Z-Index */}
      <div className="position-row">
        <span className="position-label">Z-Index</span>
        <input
          className="position-input"
          value={values.zIndex || ""}
          placeholder="auto"
          onChange={(e) => onChange("zIndex", e.target.value)}
        />
      </div>

      {/* Overflow */}
      <div>
        <span className="position-label" style={{ marginBottom: 4, display: "block" }}>Overflow</span>
        <div className="position-type-toggle">
          {(["visible", "hidden", "scroll", "auto"] as OverflowType[]).map(
            (type) => (
              <button
                key={type}
                type="button"
                className="position-type-btn"
                data-active={(values.overflow || "visible") === type || undefined}
                onClick={() => onChange("overflow", type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1, 4)}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
