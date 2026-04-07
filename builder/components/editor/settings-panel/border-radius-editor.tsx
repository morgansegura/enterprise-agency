"use client";

import * as React from "react";
import { Link2, Link2Off } from "lucide-react";
import { UnitValueInput } from "./unit-value-input";
import "./border-radius-editor.css";

// =============================================================================
// Types
// =============================================================================

interface BorderRadiusEditorProps {
  borderRadius: string;
  borderTopLeftRadius: string;
  borderTopRightRadius: string;
  borderBottomRightRadius: string;
  borderBottomLeftRadius: string;
  onChange: (property: string, value: string) => void;
}

// =============================================================================
// Component
// =============================================================================

export function BorderRadiusEditor({
  borderRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomRightRadius,
  borderBottomLeftRadius,
  onChange,
}: BorderRadiusEditorProps) {
  const [linked, setLinked] = React.useState(true);

  const handleChange = (corner: string, value: string) => {
    if (linked) {
      // Update all corners + shorthand
      onChange("borderRadius", value);
      onChange("borderTopLeftRadius", value);
      onChange("borderTopRightRadius", value);
      onChange("borderBottomRightRadius", value);
      onChange("borderBottomLeftRadius", value);
    } else {
      // Clear shorthand, set individual corner
      onChange("borderRadius", "");
      onChange(corner, value);
    }
  };

  // Get the effective value for each corner
  const tl = linked
    ? borderRadius || borderTopLeftRadius
    : borderTopLeftRadius || borderRadius;
  const tr = linked
    ? borderRadius || borderTopRightRadius
    : borderTopRightRadius || borderRadius;
  const br = linked
    ? borderRadius || borderBottomRightRadius
    : borderBottomRightRadius || borderRadius;
  const bl = linked
    ? borderRadius || borderBottomLeftRadius
    : borderBottomLeftRadius || borderRadius;

  // Build the preview border-radius
  const previewRadius = linked
    ? borderRadius || "0px"
    : `${tl || "0px"} ${tr || "0px"} ${br || "0px"} ${bl || "0px"}`;

  return (
    <div className="border-radius-editor">
      <div className="border-radius-editor-grid">
        {/* 4-corner inputs */}
        <div className="border-radius-editor-corners">
          <div className="border-radius-editor-corner">
            <span className="border-radius-editor-corner-label">TL</span>
            <UnitValueInput
              value={tl}
              onChange={(v) =>
                handleChange("borderTopLeftRadius", v)
              }
              units={["px", "rem", "%"]}
              min={0}
              max={999}
              compact
              className="w-16"
            />
          </div>
          <div className="border-radius-editor-corner">
            <span className="border-radius-editor-corner-label">TR</span>
            <UnitValueInput
              value={tr}
              onChange={(v) =>
                handleChange("borderTopRightRadius", v)
              }
              units={["px", "rem", "%"]}
              min={0}
              max={999}
              compact
              className="w-16"
            />
          </div>
          <div className="border-radius-editor-corner">
            <span className="border-radius-editor-corner-label">BL</span>
            <UnitValueInput
              value={bl}
              onChange={(v) =>
                handleChange("borderBottomLeftRadius", v)
              }
              units={["px", "rem", "%"]}
              min={0}
              max={999}
              compact
              className="w-16"
            />
          </div>
          <div className="border-radius-editor-corner">
            <span className="border-radius-editor-corner-label">BR</span>
            <UnitValueInput
              value={br}
              onChange={(v) =>
                handleChange("borderBottomRightRadius", v)
              }
              units={["px", "rem", "%"]}
              min={0}
              max={999}
              compact
              className="w-16"
            />
          </div>
        </div>

        {/* Live preview */}
        <div className="border-radius-editor-preview-wrap">
          <div
            className="border-radius-editor-preview"
            style={{ borderRadius: previewRadius }}
          />
        </div>
      </div>

      {/* Link toggle */}
      <div className="border-radius-editor-link">
        <button
          type="button"
          className={`border-radius-editor-link-btn ${linked ? "is-linked" : ""}`}
          onClick={() => setLinked(!linked)}
          title={linked ? "Unlink corners" : "Link all corners"}
        >
          {linked ? (
            <Link2 className="h-2.5 w-2.5" />
          ) : (
            <Link2Off className="h-2.5 w-2.5" />
          )}
          {linked ? "All corners linked" : "Individual corners"}
        </button>
      </div>
    </div>
  );
}
