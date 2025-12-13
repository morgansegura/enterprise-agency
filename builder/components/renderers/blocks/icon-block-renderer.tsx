"use client";

import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface IconBlockData {
  icon: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "default" | "muted" | "primary" | "secondary";
  align?: "left" | "center" | "right";
  label?: string;
}

const sizeClasses = {
  xs: "w-4 h-4",
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const colorClasses = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  secondary: "text-secondary",
};

const alignClasses = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export default function IconBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as IconBlockData;
  const {
    icon = "Star",
    size = "md",
    color = "default",
    align = "center",
    label,
  } = data;

  // Dynamically get the icon component
  const IconComponent = (
    LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>
  )[icon];

  if (!IconComponent) {
    return (
      <div className="text-muted-foreground text-sm">
        Icon "{icon}" not found
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", alignClasses[align])}>
      <IconComponent className={cn(sizeClasses[size], colorClasses[color])} />
      {label && <span className={colorClasses[color]}>{label}</span>}
    </div>
  );
}
