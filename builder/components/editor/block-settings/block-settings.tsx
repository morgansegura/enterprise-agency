"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBlockSchema, getFieldsByGroup } from "@/lib/schemas";
import { FieldGroup } from "@/components/editor/field-editors";
import type { Block } from "@/lib/types/section";

import "./block-settings.css";

// =============================================================================
// Types
// =============================================================================

export interface BlockSettingsProps {
  block: Block;
  onUpdate: (dataUpdates: Record<string, unknown>) => void;
  className?: string;
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Set a deeply nested value using dot-notation path.
 * e.g., setNestedValue({}, ["style", "backgroundColor"], "#fff")
 *       → { style: { backgroundColor: "#fff" } }
 */
function setNestedValue(
  obj: Record<string, unknown>,
  path: string[],
  value: unknown,
): Record<string, unknown> {
  if (path.length === 1) {
    return { ...obj, [path[0]]: value };
  }
  const [head, ...rest] = path;
  return {
    ...obj,
    [head]: setNestedValue(
      (obj[head] as Record<string, unknown>) || {},
      rest,
      value,
    ),
  };
}

/**
 * Get a deeply nested value using dot-notation.
 */
function _getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === "object") {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return current;
}

// =============================================================================
// Component
// =============================================================================

const TAB_LABELS: Record<string, string> = {
  content: "Content",
  style: "Style",
  advanced: "Advanced",
};

/**
 * BlockSettings — Schema-driven settings panel for any block type.
 *
 * Reads the block schema from the registry, groups fields into
 * Content / Style / Advanced tabs, and renders each field via FieldGroup.
 */
export function BlockSettings({
  block,
  onUpdate,
  className,
}: BlockSettingsProps) {
  const schema = getBlockSchema(block._type);
  const fieldGroups = getFieldsByGroup(block._type);

  if (!schema) {
    return (
      <div className={cn("block-settings__empty", className)}>
        <p>No schema found for block type: {block._type}</p>
      </div>
    );
  }

  // Only show tabs that have fields
  const visibleGroups = Object.entries(fieldGroups).filter(
    ([, fields]) => fields.length > 0,
  );

  if (visibleGroups.length === 0) {
    return (
      <div className={cn("block-settings__empty", className)}>
        <p>No configurable fields for this block.</p>
      </div>
    );
  }

  const defaultTab = visibleGroups[0][0];

  // Build current values from block.data, supporting dot notation
  const values = block.data || {};

  const handleFieldChange = (name: string, value: unknown) => {
    const parts = name.split(".");
    if (parts.length === 1) {
      onUpdate({ [name]: value });
    } else {
      // Build nested update: "style.backgroundColor" → { style: { ...existing, backgroundColor } }
      const rootKey = parts[0];
      const existing = (values[rootKey] as Record<string, unknown>) || {};
      const nested = setNestedValue(existing, parts.slice(1), value);
      onUpdate({ [rootKey]: nested });
    }
  };

  // Single tab — skip tab UI entirely
  if (visibleGroups.length === 1) {
    const [, fields] = visibleGroups[0];
    return (
      <div className={cn("block-settings", className)}>
        <FieldGroup
          fields={fields}
          values={values}
          onChange={handleFieldChange}
        />
      </div>
    );
  }

  return (
    <div className={cn("block-settings", className)}>
      <Tabs defaultValue={defaultTab} className="block-settings__tabs">
        <TabsList className="block-settings__tabs-list">
          {visibleGroups.map(([group]) => (
            <TabsTrigger
              key={group}
              value={group}
              className="block-settings__tab"
            >
              {TAB_LABELS[group] || group}
            </TabsTrigger>
          ))}
        </TabsList>

        {visibleGroups.map(([group, fields]) => (
          <TabsContent
            key={group}
            value={group}
            className="block-settings__tab-content"
          >
            <FieldGroup
              fields={fields}
              values={values}
              onChange={handleFieldChange}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
