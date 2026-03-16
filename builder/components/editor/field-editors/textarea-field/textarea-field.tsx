"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TextareaFieldSchema } from "@/lib/schemas";

import "./textarea-field.css";

export interface TextareaFieldProps {
  schema: TextareaFieldSchema;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export function TextareaField({
  schema,
  value,
  onChange,
  error,
  className,
}: TextareaFieldProps) {
  const inputId = React.useId();
  const hasError = !!error;
  const charCount = (value || "").length;
  const maxLength = schema.validation?.maxLength;

  return (
    <div className={cn("textarea-field", className)} data-width={schema.width}>
      <Label htmlFor={inputId} className="textarea-field__label">
        {schema.label}
        {schema.validation?.required && (
          <span className="textarea-field__required">*</span>
        )}
      </Label>

      <Textarea
        id={inputId}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={schema.placeholder}
        rows={schema.rows || 3}
        className={cn(
          "textarea-field__input",
          hasError && "textarea-field__input--error",
        )}
        maxLength={maxLength}
        aria-invalid={hasError}
        aria-describedby={schema.description ? `${inputId}-desc` : undefined}
      />

      <div className="textarea-field__footer">
        {schema.description && !hasError && (
          <p id={`${inputId}-desc`} className="textarea-field__description">
            {schema.description}
          </p>
        )}

        {hasError && <p className="textarea-field__error">{error}</p>}

        {schema.showCharCount && (
          <span
            className={cn(
              "textarea-field__char-count",
              maxLength &&
                charCount > maxLength * 0.9 &&
                "textarea-field__char-count--warn",
            )}
          >
            {charCount}
            {maxLength && ` / ${maxLength}`}
          </span>
        )}
      </div>
    </div>
  );
}
