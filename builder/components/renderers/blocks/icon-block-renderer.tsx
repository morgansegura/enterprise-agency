"use client";

import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import * as LucideIcons from "lucide-react";
import { getElementClass } from "@enterprise/tokens";

interface IconBlockData {
  icon: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  text?: string;
  label?: string;
  position?: "top" | "left" | "right" | "bottom";
}

export default function IconBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as IconBlockData;
  const {
    icon = "Star",
    size = "md",
    color,
    text,
    label,
    position = "top",
  } = data;

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const hasStyle = (prop: string) => !!styles?.[prop];
  const elementClass = getElementClass(block._key);

  // Dynamically get the icon component
  const IconComponent = (
    LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>
  )[icon];

  // Update a single field on blur (canvas editing)
  const updateField = (field: keyof IconBlockData, value: string) => {
    if (!onChange) return;
    onChange({
      ...block,
      data: { ...block.data, [field]: value },
    });
  };

  if (!IconComponent) {
    return (
      <div
        className={elementClass}
        data-slot="icon-block"
        data-size={hasStyle("fontSize") ? undefined : size}
      >
        <span data-slot="icon-block-icon" aria-hidden="true">
          {icon}
        </span>
        {isEditing && (
          <input
            type="text"
            defaultValue={icon}
            placeholder="Lucide icon name (e.g. Star)"
            className="ml-2 h-7 px-2 text-xs font-mono bg-(--el-0) border border-(--border-default) rounded outline-none focus:border-(--accent-primary)"
            onClick={(e) => e.stopPropagation()}
            onBlur={(e) => updateField("icon", e.target.value.trim())}
          />
        )}
      </div>
    );
  }

  const displayText = text || label;

  return (
    <div
      className={elementClass}
      data-slot="icon-block"
      data-size={hasStyle("fontSize") ? undefined : size}
      data-position={position}
      style={color && !hasStyle("color") ? { color } : undefined}
    >
      <span data-slot="icon-block-icon" aria-hidden="true">
        <IconComponent />
      </span>
      {(displayText || isEditing) && (
        <span
          data-slot="icon-block-text"
          contentEditable={!!isEditing}
          suppressContentEditableWarning
          onBlur={(e) => {
            const newText = e.currentTarget.textContent ?? "";
            if (newText !== displayText) {
              updateField("text", newText);
            }
          }}
          style={isEditing ? { cursor: "text", outline: "none" } : undefined}
        >
          {displayText || (isEditing ? "Add label..." : "")}
        </span>
      )}
    </div>
  );
}
