"use client";

import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import * as LucideIcons from "lucide-react";

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

  // Dynamically get the icon component
  const IconComponent = (
    LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>
  )[icon];

  if (!IconComponent) {
    return (
      <div data-slot="icon-block" data-size={size}>
        <span data-slot="icon-block-icon" aria-hidden="true">
          {icon}
        </span>
      </div>
    );
  }

  const displayText = text || label;

  return (
    <div
      data-slot="icon-block"
      data-size={size}
      data-position={position}
      style={color ? { color } : undefined}
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
