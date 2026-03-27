"use client";

import "./size-controls.css";

interface SizeValues {
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
}

interface SizeControlsProps {
  values: SizeValues;
  onChange: (field: string, value: string) => void;
}

export function SizeControls({ values, onChange }: SizeControlsProps) {
  return (
    <div className="size-controls">
      {/* Width / Height */}
      <div className="size-controls-row">
        <div className="size-controls-field">
          <input
            className="size-controls-input"
            value={values.width || ""}
            placeholder="Auto"
            onChange={(e) => onChange("width", e.target.value)}
          />
          <span className="size-controls-label">Width</span>
        </div>
        <div className="size-controls-field">
          <input
            className="size-controls-input"
            value={values.height || ""}
            placeholder="Auto"
            onChange={(e) => onChange("height", e.target.value)}
          />
          <span className="size-controls-label">Height</span>
        </div>
      </div>

      {/* Min Width / Min Height */}
      <div className="size-controls-row">
        <div className="size-controls-field">
          <input
            className="size-controls-input"
            value={values.minWidth || ""}
            placeholder="0"
            onChange={(e) => onChange("minWidth", e.target.value)}
          />
          <span className="size-controls-label">Min W</span>
        </div>
        <div className="size-controls-field">
          <input
            className="size-controls-input"
            value={values.minHeight || ""}
            placeholder="0"
            onChange={(e) => onChange("minHeight", e.target.value)}
          />
          <span className="size-controls-label">Min H</span>
        </div>
      </div>

      {/* Max Width / Max Height */}
      <div className="size-controls-row">
        <div className="size-controls-field">
          <input
            className="size-controls-input"
            value={values.maxWidth || ""}
            placeholder="None"
            onChange={(e) => onChange("maxWidth", e.target.value)}
          />
          <span className="size-controls-label">Max W</span>
        </div>
        <div className="size-controls-field">
          <input
            className="size-controls-input"
            value={values.maxHeight || ""}
            placeholder="None"
            onChange={(e) => onChange("maxHeight", e.target.value)}
          />
          <span className="size-controls-label">Max H</span>
        </div>
      </div>
    </div>
  );
}
