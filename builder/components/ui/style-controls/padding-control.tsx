"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type PaddingSize = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export interface PaddingControlProps {
  label?: string;
  value: PaddingSize;
  onChange: (value: PaddingSize) => void;
  className?: string;
}

const paddingOptions: { value: PaddingSize; label: string }[] = [
  { value: "none", label: "None" },
  { value: "xs", label: "Extra Small" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
];

export function PaddingControl({
  label = "Padding",
  value,
  onChange,
  className,
}: PaddingControlProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <Select value={value} onValueChange={(v) => onChange(v as PaddingSize)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {paddingOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Utility to convert padding size to Tailwind class
export function getPaddingClass(
  size: PaddingSize,
  axis: "x" | "y" = "x",
): string {
  const prefix = axis === "x" ? "px" : "py";
  const classes: Record<PaddingSize, string> = {
    none: `${prefix}-0`,
    xs: `${prefix}-2`,
    sm: `${prefix}-4`,
    md: `${prefix}-6`,
    lg: `${prefix}-8`,
    xl: `${prefix}-12`,
  };
  return classes[size];
}
