"use client";

import "./spacing-box.css";

interface SpacingValues {
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
}

interface SpacingBoxProps {
  values: SpacingValues;
  onChange: (field: string, value: string) => void;
}

export function SpacingBox({ values, onChange }: SpacingBoxProps) {
  const handleChange = (field: string, rawValue: string) => {
    // Accept empty, "auto", or numeric values
    const cleaned = rawValue.trim();
    onChange(field, cleaned);
  };

  return (
    <div className="spacing-box">
      {/* Margin layer */}
      <div className="spacing-box-margin">
        <span className="spacing-box-label spacing-box-label-margin">
          Margin
        </span>
      </div>

      {/* Padding layer */}
      <div className="spacing-box-padding">
        <span className="spacing-box-label spacing-box-label-padding">
          Padding
        </span>
      </div>

      {/* Content center */}
      <div className="spacing-box-content" />

      {/* Margin inputs */}
      <input
        className="spacing-box-input spacing-box-input-mt"
        value={values.marginTop || ""}
        placeholder="0"
        onChange={(e) => handleChange("marginTop", e.target.value)}
      />
      <input
        className="spacing-box-input spacing-box-input-mr"
        value={values.marginRight || ""}
        placeholder="0"
        onChange={(e) => handleChange("marginRight", e.target.value)}
      />
      <input
        className="spacing-box-input spacing-box-input-mb"
        value={values.marginBottom || ""}
        placeholder="0"
        onChange={(e) => handleChange("marginBottom", e.target.value)}
      />
      <input
        className="spacing-box-input spacing-box-input-ml"
        value={values.marginLeft || ""}
        placeholder="0"
        onChange={(e) => handleChange("marginLeft", e.target.value)}
      />

      {/* Padding inputs */}
      <input
        className="spacing-box-input spacing-box-input-pt"
        value={values.paddingTop || ""}
        placeholder="0"
        onChange={(e) => handleChange("paddingTop", e.target.value)}
      />
      <input
        className="spacing-box-input spacing-box-input-pr"
        value={values.paddingRight || ""}
        placeholder="0"
        onChange={(e) => handleChange("paddingRight", e.target.value)}
      />
      <input
        className="spacing-box-input spacing-box-input-pb"
        value={values.paddingBottom || ""}
        placeholder="0"
        onChange={(e) => handleChange("paddingBottom", e.target.value)}
      />
      <input
        className="spacing-box-input spacing-box-input-pl"
        value={values.paddingLeft || ""}
        placeholder="0"
        onChange={(e) => handleChange("paddingLeft", e.target.value)}
      />
    </div>
  );
}
