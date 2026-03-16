"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ColorFieldSchema } from "@/lib/schemas";

import "./color-field.css";

export interface ColorFieldProps {
  schema: ColorFieldSchema;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export function ColorField({
  schema,
  value,
  onChange,
  error,
  className,
}: ColorFieldProps) {
  const inputId = React.useId();
  const colorInputRef = React.useRef<HTMLInputElement>(null);
  const hasError = !!error;
  const presets = schema.presets || [
    "#000000",
    "#ffffff",
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
  ];

  const handlePresetClick = (color: string) => {
    onChange(color);
  };

  const openColorPicker = () => {
    colorInputRef.current?.click();
  };

  return (
    <div className={cn("color-field", className)} data-width={schema.width}>
      <Label htmlFor={inputId} className="color-field__label">
        {schema.label}
        {schema.validation?.required && (
          <span className="color-field__required">*</span>
        )}
      </Label>

      <div className="color-field__controls">
        <div className="color-field__preview-wrapper">
          <button
            type="button"
            className="color-field__preview"
            style={{ backgroundColor: value || "transparent" }}
            onClick={openColorPicker}
            aria-label="Open color picker"
          >
            {!value && <span className="color-field__preview-empty">?</span>}
          </button>
          <input
            ref={colorInputRef}
            type="color"
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="color-field__native-picker"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>

        {schema.allowCustom !== false && (
          <Input
            id={inputId}
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.placeholder || "#000000"}
            className={cn(
              "color-field__input",
              hasError && "color-field__input--error",
            )}
          />
        )}

        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onChange("")}
            className="color-field__clear"
            aria-label="Clear color"
          >
            ×
          </Button>
        )}
      </div>

      {presets.length > 0 && (
        <div className="color-field__presets">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              className={cn(
                "color-field__preset",
                value === preset && "color-field__preset--selected",
              )}
              style={{
                backgroundColor: preset === "transparent" ? undefined : preset,
              }}
              data-transparent={preset === "transparent"}
              onClick={() => handlePresetClick(preset)}
              aria-label={`Select ${preset}`}
            />
          ))}
        </div>
      )}

      {schema.description && !hasError && (
        <p className="color-field__description">{schema.description}</p>
      )}

      {hasError && <p className="color-field__error">{error}</p>}
    </div>
  );
}
