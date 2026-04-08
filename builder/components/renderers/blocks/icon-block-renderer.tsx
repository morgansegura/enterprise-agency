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
  onChange: _onChange,
  isEditing: _isEditing,
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
      </div>
    );
  }

  const displayText = text || label;

  return (
    <div
      className={elementClass}
      data-slot="icon-block"
      data-size={hasStyle("fontSize") ? undefined : size}
      data-color={hasStyle("color") ? undefined : undefined}
      data-position={position}
      style={color && !hasStyle("color") ? { color } : undefined}
    >
      <span data-slot="icon-block-icon" aria-hidden="true">
        <IconComponent />
      </span>
      {displayText ? (
        <span data-slot="icon-block-text">{displayText}</span>
      ) : null}
    </div>
  );
}
