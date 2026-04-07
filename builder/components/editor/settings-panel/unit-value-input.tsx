"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import "./unit-value-input.css";

// =============================================================================
// CSS Value Parser
// =============================================================================

const CSS_VALUE_RE = /^(-?[\d.]+)\s*(px|rem|em|%|vw|vh|vmin|vmax|ch|ex|ms|s|deg|fr)?$/;

export interface ParsedCSSValue {
  value: number | null;
  unit: string;
}

/**
 * Parse a CSS value string into number + unit.
 * "16px" → { value: 16, unit: "px" }
 * "auto" → { value: null, unit: "auto" }
 * ""     → { value: null, unit: defaultUnit }
 */
export function parseCSSValue(
  input: string,
  defaultUnit = "px",
): ParsedCSSValue {
  if (!input || input === "") {
    return { value: null, unit: defaultUnit };
  }

  const trimmed = input.trim();

  // Keywords
  if (
    ["auto", "inherit", "initial", "unset", "none", "normal", "0"].includes(
      trimmed,
    )
  ) {
    if (trimmed === "0") return { value: 0, unit: defaultUnit };
    return { value: null, unit: trimmed };
  }

  const match = trimmed.match(CSS_VALUE_RE);
  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: match[2] || defaultUnit,
    };
  }

  // Can't parse (complex expression like calc, var, etc.)
  return { value: null, unit: "__raw__" };
}

/**
 * Build a CSS value string from number + unit.
 */
export function buildCSSValue(
  value: number | null,
  unit: string,
): string {
  if (unit === "__raw__") return "";
  if (value === null) return unit; // keyword like "auto"
  if (value === 0 && unit !== "%") return "0";
  return `${value}${unit}`;
}

// =============================================================================
// Component
// =============================================================================

const DEFAULT_UNITS = ["px", "rem", "em", "%", "vw", "vh"];

interface UnitValueInputProps {
  /** CSS value string, e.g. "16px", "2rem", "auto" */
  value: string;
  /** Called with the new CSS value string */
  onChange: (value: string) => void;
  /** Available units (default: px, rem, em, %, vw, vh) */
  units?: string[];
  /** Keyword values that hide the number input (e.g. ["auto", "inherit"]) */
  keywords?: string[];
  /** Min numeric value */
  min?: number;
  /** Max numeric value */
  max?: number;
  /** Step for increment/decrement (default: 1) */
  step?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Additional class names */
  className?: string;
  /** Compact mode for tight spaces */
  compact?: boolean;
}

export function UnitValueInput({
  value,
  onChange,
  units = DEFAULT_UNITS,
  keywords = [],
  min,
  max,
  step = 1,
  placeholder = "0",
  className,
  compact = false,
}: UnitValueInputProps) {
  const defaultUnit = units[0] || "px";
  const parsed = parseCSSValue(value, defaultUnit);
  const isKeyword =
    parsed.value === null && parsed.unit !== defaultUnit && parsed.unit !== "__raw__";
  const isRaw = parsed.unit === "__raw__";

  const inputRef = React.useRef<HTMLInputElement>(null);

  // Clamp value
  const clamp = (v: number): number => {
    if (min !== undefined && v < min) return min;
    if (max !== undefined && v > max) return max;
    return v;
  };

  // Emit change
  const emit = (numValue: number | null, unit: string) => {
    if (numValue !== null) {
      onChange(buildCSSValue(clamp(numValue), unit));
    } else {
      onChange(buildCSSValue(null, unit));
    }
  };

  // Handle number input change
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "" || raw === "-") {
      onChange("");
      return;
    }
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      emit(num, parsed.unit === "__raw__" ? defaultUnit : parsed.unit);
    }
  };

  // Handle unit change
  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;

    // Switching to a keyword
    if (keywords.includes(newUnit)) {
      emit(null, newUnit);
      return;
    }

    // Switching from keyword to numeric unit
    if (isKeyword) {
      emit(0, newUnit);
      return;
    }

    // Unit change preserving value
    emit(parsed.value, newUnit);
  };

  // Arrow key / scroll increment
  const increment = (delta: number, shiftKey: boolean) => {
    if (isKeyword || isRaw) return;
    const currentVal = parsed.value ?? 0;
    const actualStep = shiftKey ? step * 10 : step;
    emit(
      Math.round((currentVal + delta * actualStep) * 1000) / 1000,
      parsed.unit,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      increment(1, e.shiftKey);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      increment(-1, e.shiftKey);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (document.activeElement !== inputRef.current) return;
    e.preventDefault();
    increment(e.deltaY < 0 ? 1 : -1, e.shiftKey);
  };

  // Raw mode — just show a text input (for calc(), var(), etc.)
  if (isRaw) {
    return (
      <div
        className={cn(
          "unit-value-input",
          compact && "unit-value-input--compact",
          className,
        )}
      >
        <input
          type="text"
          className="unit-value-input-number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    );
  }

  // All available options for the unit selector
  const allOptions = [...units, ...keywords];

  // Current unit for the selector
  const currentUnit = isKeyword ? parsed.unit : parsed.unit;

  return (
    <div
      className={cn(
        "unit-value-input",
        isKeyword && "unit-value-input--keyword",
        compact && "unit-value-input--compact",
        className,
      )}
    >
      {/* Number input — hidden when keyword is selected */}
      {!isKeyword && (
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          className="unit-value-input-number"
          value={parsed.value !== null ? parsed.value : ""}
          onChange={handleNumberChange}
          onKeyDown={handleKeyDown}
          onWheel={handleWheel}
          placeholder={placeholder}
        />
      )}

      {/* Keyword label — shown when keyword is active */}
      {isKeyword && (
        <span className="unit-value-input-keyword-label">
          {parsed.unit}
        </span>
      )}

      {/* Unit selector */}
      {allOptions.length > 0 && (
        <select
          className="unit-value-input-unit"
          value={currentUnit}
          onChange={handleUnitChange}
        >
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
          {keywords.length > 0 && (
            <>
              <option disabled>──</option>
              {keywords.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </>
          )}
        </select>
      )}
    </div>
  );
}
