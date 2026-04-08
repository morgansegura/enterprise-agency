"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

interface SliderInputProps {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
}

/**
 * SliderInput — combines a range slider with a numeric text input.
 * Parses numeric value from string (e.g., "24px" → 24),
 * and appends unit back on change.
 */
export function SliderInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "px",
  placeholder,
}: SliderInputProps) {
  // Parse numeric value, defaulting to min for slider position
  const parsed = parseFloat(value);
  const numericValue = isNaN(parsed) ? min : parsed;

  // Display value: just the number, not the full "24px" string
  const displayValue = isNaN(parsed) ? "" : String(parsed);

  const emit = (num: number) => {
    if (isNaN(num)) {
      onChange("");
      return;
    }
    onChange(unit ? `${num}${unit}` : String(num));
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    emit(parseFloat(e.target.value));
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      onChange("");
      return;
    }
    const num = parseFloat(raw);
    if (!isNaN(num)) emit(num);
  };

  return (
    <div className="slider-input">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={numericValue}
        onChange={handleSlider}
        className="slider-input-range"
      />
      <Input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleInput}
        placeholder={placeholder ?? String(min)}
        className="slider-input-text"
      />
    </div>
  );
}
