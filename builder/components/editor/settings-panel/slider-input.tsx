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
 * SliderInput — combines a range slider with a text input.
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
  placeholder = "0",
}: SliderInputProps) {
  const numericValue = parseFloat(value) || 0;

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(e.target.value);
    onChange(num === 0 ? "" : `${num}${unit}`);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
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
        value={value}
        onChange={handleInput}
        placeholder={placeholder}
        className="slider-input-text"
      />
    </div>
  );
}
