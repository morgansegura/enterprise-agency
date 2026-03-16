"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SelectFieldSchema } from "@/lib/schemas";

import "./select-field.css";

export interface SelectFieldProps {
  schema: SelectFieldSchema;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  error?: string;
  className?: string;
}

export function SelectField({
  schema,
  value,
  onChange,
  error,
  className,
}: SelectFieldProps) {
  const inputId = React.useId();
  const hasError = !!error;

  return (
    <div className={cn("select-field", className)} data-width={schema.width}>
      <Label htmlFor={inputId} className="select-field__label">
        {schema.label}
        {schema.validation?.required && (
          <span className="select-field__required">*</span>
        )}
      </Label>

      <Select
        value={value?.toString() || ""}
        onValueChange={(val) => {
          const option = schema.options.find((o) => o.value.toString() === val);
          if (option) {
            onChange(option.value);
          }
        }}
      >
        <SelectTrigger
          id={inputId}
          className={cn(
            "select-field__trigger",
            hasError && "select-field__trigger--error",
          )}
        >
          <SelectValue placeholder={schema.placeholder || "Select..."} />
        </SelectTrigger>
        <SelectContent>
          {schema.options.map((option) => (
            <SelectItem
              key={option.value.toString()}
              value={option.value.toString()}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {schema.description && !hasError && (
        <p className="select-field__description">{schema.description}</p>
      )}

      {hasError && <p className="select-field__error">{error}</p>}
    </div>
  );
}
