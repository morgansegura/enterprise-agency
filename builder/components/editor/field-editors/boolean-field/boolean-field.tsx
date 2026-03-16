"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import type { BooleanFieldSchema } from "@/lib/schemas";

import "./boolean-field.css";

export interface BooleanFieldProps {
  schema: BooleanFieldSchema;
  value: boolean;
  onChange: (value: boolean) => void;
  error?: string;
  className?: string;
}

export function BooleanField({
  schema,
  value,
  onChange,
  error,
  className,
}: BooleanFieldProps) {
  const inputId = React.useId();
  const hasError = !!error;
  const variant = schema.variant || "switch";

  return (
    <div
      className={cn("boolean-field", className)}
      data-width={schema.width}
      data-variant={variant}
    >
      {variant === "switch" ? (
        <div className="boolean-field__switch-container">
          <button
            id={inputId}
            type="button"
            role="switch"
            aria-checked={value}
            onClick={() => onChange(!value)}
            className={cn(
              "boolean-field__switch",
              value && "boolean-field__switch--checked",
            )}
          >
            <span className="boolean-field__switch-thumb" />
          </button>
          <Label htmlFor={inputId} className="boolean-field__switch-label">
            {schema.label}
          </Label>
        </div>
      ) : (
        <div className="boolean-field__checkbox-container">
          <input
            id={inputId}
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            className={cn(
              "boolean-field__checkbox",
              hasError && "boolean-field__checkbox--error",
            )}
          />
          <Label htmlFor={inputId} className="boolean-field__checkbox-label">
            {schema.label}
          </Label>
        </div>
      )}

      {schema.description && !hasError && (
        <p className="boolean-field__description">{schema.description}</p>
      )}

      {hasError && <p className="boolean-field__error">{error}</p>}
    </div>
  );
}
