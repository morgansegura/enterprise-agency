"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface PropertySelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Styled select dropdown for property values.
 * Compact height matching other property controls.
 */
export function PropertySelect({
  value,
  options,
  onChange,
  placeholder = "Select...",
  className,
}: PropertySelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("property-select", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.description ? (
              <span className="property-select-option">
                <span>{option.label}</span>
                <span className="property-select-description">
                  {option.description}
                </span>
              </span>
            ) : (
              option.label
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
