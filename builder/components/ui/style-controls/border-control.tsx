"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPicker } from "@/components/ui/color-picker";
import { cn } from "@/lib/utils";

import "./border-control.css";

export type BorderStyle = "none" | "solid" | "dashed" | "dotted";

export interface BorderValue {
  width: number;
  style: BorderStyle;
  color: string;
}

export interface BorderControlProps {
  label?: string;
  value: BorderValue;
  onChange: (value: BorderValue) => void;
  className?: string;
}

const borderStyleOptions: { value: BorderStyle; label: string }[] = [
  { value: "none", label: "None" },
  { value: "solid", label: "Solid" },
  { value: "dashed", label: "Dashed" },
  { value: "dotted", label: "Dotted" },
];

export function BorderControl({
  label = "Border",
  value,
  onChange,
  className,
}: BorderControlProps) {
  const updateValue = (updates: Partial<BorderValue>) => {
    onChange({ ...value, ...updates });
  };

  return (
    <div className={cn("border-control", className)}>
      {label && <Label className="border-control-label">{label}</Label>}
      <div className="border-control-row">
        <div className="border-control-width">
          <Input
            type="number"
            min={0}
            max={10}
            value={value.width}
            onChange={(e) =>
              updateValue({ width: parseInt(e.target.value) || 0 })
            }
            className="border-control-width-input"
          />
          <span className="border-control-unit">px</span>
        </div>
        <Select
          value={value.style}
          onValueChange={(v) => updateValue({ style: v as BorderStyle })}
        >
          <SelectTrigger className="border-control-style">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {borderStyleOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ColorPicker
          value={value.color}
          onChange={(color) => updateValue({ color })}
          className="border-control-color"
        />
      </div>
    </div>
  );
}

// Utility to convert border value to CSS string
export function getBorderCss(border: BorderValue): string {
  if (border.style === "none" || border.width === 0) {
    return "none";
  }
  return `${border.width}px ${border.style} ${border.color}`;
}

// Utility to parse CSS border string to BorderValue
export function parseBorderCss(css: string): BorderValue {
  if (!css || css === "none") {
    return { width: 0, style: "none", color: "#e5e5e5" };
  }

  const parts = css.split(" ");
  const width = parseInt(parts[0]) || 1;
  const style = (parts[1] as BorderStyle) || "solid";
  const color = parts[2] || "#e5e5e5";

  return { width, style, color };
}
