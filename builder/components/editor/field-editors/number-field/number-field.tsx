"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { NumberFieldSchema } from "@/lib/schemas";

import "./number-field.css";

export interface NumberFieldProps {
  schema: NumberFieldSchema;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  error?: string;
  className?: string;
}

export function NumberField({
  schema,
  value,
  onChange,
  error,
  className,
}: NumberFieldProps) {
  const inputId = React.useId();
  const hasError = !!error;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      onChange(undefined);
    } else {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        onChange(num);
      }
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(e.target.value);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  return (
    <div className={cn("number-field", className)} data-width={schema.width}>
      <Label htmlFor={inputId} className="number-field__label">
        {schema.label}
        {schema.validation?.required && (
          <span className="number-field__required">*</span>
        )}
      </Label>

      <div className="number-field__input-wrapper">
        <Input
          id={inputId}
          type="number"
          value={value ?? ""}
          onChange={handleChange}
          placeholder={schema.placeholder}
          min={schema.min}
          max={schema.max}
          step={schema.step || 1}
          className={cn(
            "number-field__input",
            schema.unit && "number-field__input--has-unit",
            hasError && "number-field__input--error",
          )}
          aria-invalid={hasError}
          aria-describedby={schema.description ? `${inputId}-desc` : undefined}
        />
        {schema.unit && (
          <span className="number-field__unit">{schema.unit}</span>
        )}
      </div>

      {schema.showSlider &&
        schema.min !== undefined &&
        schema.max !== undefined && (
          <div className="number-field__slider-wrapper">
            <input
              type="range"
              min={schema.min}
              max={schema.max}
              step={schema.step || 1}
              value={value ?? schema.min}
              onChange={handleSliderChange}
              className="number-field__slider"
            />
            <div className="number-field__slider-labels">
              <span>{schema.min}</span>
              <span>{schema.max}</span>
            </div>
          </div>
        )}

      {schema.description && !hasError && (
        <p id={`${inputId}-desc`} className="number-field__description">
          {schema.description}
        </p>
      )}

      {hasError && <p className="number-field__error">{error}</p>}
    </div>
  );
}
