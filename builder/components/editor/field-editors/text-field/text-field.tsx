"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TextFieldSchema } from "@/lib/schemas";

import "./text-field.css";

export interface TextFieldProps {
  schema: TextFieldSchema;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export function TextField({
  schema,
  value,
  onChange,
  error,
  className,
}: TextFieldProps) {
  const inputId = React.useId();
  const hasError = !!error;

  return (
    <div className={cn("text-field", className)} data-width={schema.width}>
      <Label htmlFor={inputId} className="text-field__label">
        {schema.label}
        {schema.validation?.required && (
          <span className="text-field__required">*</span>
        )}
      </Label>

      <div className="text-field__input-wrapper">
        {schema.prefix && (
          <span className="text-field__prefix">{schema.prefix}</span>
        )}
        <Input
          id={inputId}
          type={schema.inputType || "text"}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={schema.placeholder}
          className={cn(
            "text-field__input",
            schema.prefix && "text-field__input--has-prefix",
            schema.suffix && "text-field__input--has-suffix",
            hasError && "text-field__input--error",
          )}
          aria-invalid={hasError}
          aria-describedby={schema.description ? `${inputId}-desc` : undefined}
        />
        {schema.suffix && (
          <span className="text-field__suffix">{schema.suffix}</span>
        )}
      </div>

      {schema.description && !hasError && (
        <p id={`${inputId}-desc`} className="text-field__description">
          {schema.description}
        </p>
      )}

      {hasError && <p className="text-field__error">{error}</p>}
    </div>
  );
}
