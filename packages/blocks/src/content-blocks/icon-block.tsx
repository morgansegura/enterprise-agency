"use client";

import { cn } from "@enterprise/tokens";
import * as LucideIcons from "lucide-react";
import type { BlockRendererProps } from "../types";

interface IconBlockData {
  icon: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "default" | "muted" | "primary" | "secondary";
  align?: "left" | "center" | "right";
  label?: string;
}

const iconSizeClasses = {
  xs: "w-4 h-4",
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const iconColorClasses = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  secondary: "text-secondary",
};

const iconAlignClasses = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export function IconBlock({ block }: BlockRendererProps) {
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

  // Cast to any to avoid React type version mismatch issues
  const Icon = IconComponent as React.ComponentType<{ className?: string }>;

  return (
    <div className={cn("flex items-center gap-2", iconAlignClasses[align])}>
      <Icon className={cn(iconSizeClasses[size], iconColorClasses[color])} />
      {label && <span className={iconColorClasses[color]}>{label}</span>}
    </div>
  );
}
