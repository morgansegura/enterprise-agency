"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { FieldSchema } from "@/lib/schemas";
import { TextField } from "../text-field";
import { TextareaField } from "../textarea-field";
import { NumberField } from "../number-field";
import { SelectField } from "../select-field";
import { BooleanField } from "../boolean-field";
import { ColorField } from "../color-field";
import { MediaField, type MediaValue } from "../media-field";
import { RichtextField } from "../richtext-field";
import { ArrayField } from "../array-field";

import "./field-renderer.css";

export interface FieldRendererProps {
  schema: FieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  className?: string;
}

/**
 * FieldRenderer - Dynamic field component renderer
 *
 * Renders the appropriate field editor based on the field schema type.
 */
export function FieldRenderer({
  schema,
  value,
  onChange,
  error,
  className,
}: FieldRendererProps) {
  // Check visibility conditions
  // (would need access to all values to implement fully)

  switch (schema.type) {
    case "text":
      return (
        <TextField
          schema={schema}
          value={value as string}
          onChange={onChange}
          error={error}
          className={className}
        />
      );

    case "textarea":
      return (
        <TextareaField
          schema={schema}
          value={value as string}
          onChange={onChange}
          error={error}
          className={className}
        />
      );

    case "number":
      return (
        <NumberField
          schema={schema}
          value={value as number | undefined}
          onChange={onChange}
          error={error}
          className={className}
        />
      );

    case "select":
      return (
        <SelectField
          schema={schema}
          value={value as string | number | undefined}
          onChange={onChange}
          error={error}
          className={className}
        />
      );

    case "boolean":
      return (
        <BooleanField
          schema={schema}
          value={value as boolean}
          onChange={onChange}
          error={error}
          className={className}
        />
      );

    case "color":
      return (
        <ColorField
          schema={schema}
          value={value as string | undefined}
          onChange={onChange}
          error={error}
          className={className}
        />
      );

    case "media":
      return (
        <MediaField
          schema={schema}
          value={value as MediaValue | MediaValue[] | string | undefined}
          onChange={onChange}
          error={error}
          className={className}
        />
      );

    case "richtext":
      return (
        <RichtextField
          schema={schema}
          value={value as string}
          onChange={onChange}
          error={error}
          className={className}
        />
      );

    case "array":
      return (
        <ArrayField
          schema={schema}
          value={value as unknown[]}
          onChange={onChange}
          error={error}
          className={className}
          renderField={FieldRenderer}
        />
      );

    case "relationship":
      return (
        <div className={cn("field-renderer__placeholder", className)}>
          <span className="field-renderer__placeholder-label">
            {schema.label}
          </span>
          <span className="field-renderer__placeholder-type">
            Relationship picker (coming soon)
          </span>
        </div>
      );

    case "json":
      return (
        <div className={cn("field-renderer__placeholder", className)}>
          <span className="field-renderer__placeholder-label">
            {schema.label}
          </span>
          <textarea
            className="field-renderer__json-input"
            value={
              typeof value === "object" ? JSON.stringify(value, null, 2) : ""
            }
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                onChange(parsed);
              } catch {
                // Invalid JSON, don't update
              }
            }}
            rows={5}
          />
        </div>
      );

    default:
      return (
        <div className={cn("field-renderer__unsupported", className)}>
          <span>Unsupported field type: {(schema as FieldSchema).type}</span>
        </div>
      );
  }
}

/**
 * Render multiple fields from a schema array
 */
export interface FieldGroupProps {
  fields: FieldSchema[];
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
  errors?: Record<string, string>;
  className?: string;
}

export function FieldGroup({
  fields,
  values,
  onChange,
  errors = {},
  className,
}: FieldGroupProps) {
  // Helper to get nested value (e.g., "style.backgroundColor")
  const getValue = (name: string): unknown => {
    const parts = name.split(".");
    let current: unknown = values;
    for (const part of parts) {
      if (current && typeof current === "object") {
        current = (current as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }
    return current;
  };

  // Helper to set nested value
  const handleChange = (name: string, value: unknown) => {
    onChange(name, value);
  };

  return (
    <div className={cn("field-group", className)}>
      {fields.map((field) => (
        <FieldRenderer
          key={field.name}
          schema={field}
          value={getValue(field.name)}
          onChange={(val) => handleChange(field.name, val)}
          error={errors[field.name]}
        />
      ))}
    </div>
  );
}
