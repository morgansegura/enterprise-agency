"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";
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
 * SliderInput — shadcn Slider + Input combo.
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
  const parsed = parseFloat(value);
  const numericValue = isNaN(parsed) ? min : parsed;
  const displayValue = isNaN(parsed) ? "" : String(parsed);

  const emit = (num: number) => {
    if (isNaN(num)) {
      onChange("");
      return;
    }
    onChange(unit ? `${num}${unit}` : String(num));
  };

  const handleSlider = (values: number[]) => {
    emit(values[0]);
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
      <Slider
        value={[numericValue]}
        onValueChange={handleSlider}
        min={min}
        max={max}
        step={step}
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
