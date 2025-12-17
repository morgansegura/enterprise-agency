"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ContainerSettings } from "@/lib/hooks/use-pages";

import "./layout-presets-popover.css";

// =============================================================================
// Layout Preset Definitions
// =============================================================================

export interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  container: Partial<ContainerSettings>;
}

const layoutPresets: LayoutPreset[] = [
  {
    id: "stack",
    name: "Stack",
    description: "Vertical stack with gap",
    icon: (
      <svg viewBox="0 0 32 32" className="preset-icon">
        <rect x="6" y="4" width="20" height="6" rx="1" />
        <rect x="6" y="13" width="20" height="6" rx="1" />
        <rect x="6" y="22" width="20" height="6" rx="1" />
      </svg>
    ),
    container: {
      layout: {
        type: "stack",
        gap: "md",
      },
    },
  },
  {
    id: "two-col",
    name: "2 Columns",
    description: "Two equal columns",
    icon: (
      <svg viewBox="0 0 32 32" className="preset-icon">
        <rect x="4" y="4" width="11" height="24" rx="1" />
        <rect x="17" y="4" width="11" height="24" rx="1" />
      </svg>
    ),
    container: {
      layout: {
        type: "grid",
        columns: 2,
        gap: "lg",
      },
    },
  },
  {
    id: "three-col",
    name: "3 Columns",
    description: "Three equal columns",
    icon: (
      <svg viewBox="0 0 32 32" className="preset-icon">
        <rect x="3" y="4" width="7" height="24" rx="1" />
        <rect x="12.5" y="4" width="7" height="24" rx="1" />
        <rect x="22" y="4" width="7" height="24" rx="1" />
      </svg>
    ),
    container: {
      layout: {
        type: "grid",
        columns: 3,
        gap: "lg",
      },
    },
  },
  {
    id: "four-col",
    name: "4 Columns",
    description: "Four equal columns",
    icon: (
      <svg viewBox="0 0 32 32" className="preset-icon">
        <rect x="2" y="4" width="5.5" height="24" rx="1" />
        <rect x="9" y="4" width="5.5" height="24" rx="1" />
        <rect x="16" y="4" width="5.5" height="24" rx="1" />
        <rect x="23" y="4" width="5.5" height="24" rx="1" />
      </svg>
    ),
    container: {
      layout: {
        type: "grid",
        columns: 4,
        gap: "md",
      },
    },
  },
  {
    id: "sidebar-left",
    name: "Sidebar Left",
    description: "Left sidebar with main content",
    icon: (
      <svg viewBox="0 0 32 32" className="preset-icon">
        <rect x="4" y="4" width="8" height="24" rx="1" />
        <rect x="14" y="4" width="14" height="24" rx="1" />
      </svg>
    ),
    container: {
      layout: {
        type: "flex",
        direction: "row",
        gap: "lg",
      },
    },
  },
  {
    id: "sidebar-right",
    name: "Sidebar Right",
    description: "Main content with right sidebar",
    icon: (
      <svg viewBox="0 0 32 32" className="preset-icon">
        <rect x="4" y="4" width="14" height="24" rx="1" />
        <rect x="20" y="4" width="8" height="24" rx="1" />
      </svg>
    ),
    container: {
      layout: {
        type: "flex",
        direction: "row",
        gap: "lg",
      },
    },
  },
  {
    id: "centered",
    name: "Centered",
    description: "Center-aligned content",
    icon: (
      <svg viewBox="0 0 32 32" className="preset-icon">
        <rect x="8" y="6" width="16" height="4" rx="1" />
        <rect x="6" y="12" width="20" height="4" rx="1" />
        <rect x="10" y="18" width="12" height="4" rx="1" />
        <rect x="12" y="24" width="8" height="4" rx="1" />
      </svg>
    ),
    container: {
      layout: {
        type: "stack",
        gap: "md",
      },
    },
  },
  {
    id: "auto-grid",
    name: "Auto Grid",
    description: "Responsive auto-fit grid",
    icon: (
      <svg viewBox="0 0 32 32" className="preset-icon">
        <rect x="4" y="4" width="10" height="10" rx="1" />
        <rect x="18" y="4" width="10" height="10" rx="1" />
        <rect x="4" y="18" width="10" height="10" rx="1" />
        <rect x="18" y="18" width="10" height="10" rx="1" />
      </svg>
    ),
    container: {
      layout: {
        type: "grid",
        columns: "auto-fit",
        gap: "lg",
      },
    },
  },
];

// =============================================================================
// Component
// =============================================================================

export interface LayoutPresetsPopoverProps {
  currentLayout?: ContainerSettings["layout"];
  onSelectPreset: (preset: LayoutPreset) => void;
  children: React.ReactNode;
}

export function LayoutPresetsPopover({
  currentLayout,
  onSelectPreset,
  children,
}: LayoutPresetsPopoverProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (preset: LayoutPreset) => {
    onSelectPreset(preset);
    setOpen(false);
  };

  // Determine which preset is currently active (if any)
  const activePresetId = React.useMemo(() => {
    if (!currentLayout) return "stack";

    if (currentLayout.type === "stack") return "stack";
    if (currentLayout.type === "grid") {
      if (currentLayout.columns === "auto-fit") return "auto-grid";
      if (currentLayout.columns === 2) return "two-col";
      if (currentLayout.columns === 3) return "three-col";
      if (currentLayout.columns === 4) return "four-col";
    }
    if (currentLayout.type === "flex" && currentLayout.direction === "row") {
      return "sidebar-left"; // Default to left, can't distinguish without more info
    }

    return null;
  }, [currentLayout]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="layout-presets-popover"
        side="left"
        align="start"
        sideOffset={8}
        collisionPadding={16}
      >
        <div className="layout-presets-header">
          <h4 className="layout-presets-title">Layout Presets</h4>
          <p className="layout-presets-description">
            Quick-apply a layout configuration to your container
          </p>
        </div>

        <div className="layout-presets-grid">
          {layoutPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={cn(
                "layout-preset-item",
                activePresetId === preset.id && "is-active",
              )}
              onClick={() => handleSelect(preset)}
              title={preset.description}
            >
              <div className="layout-preset-icon">{preset.icon}</div>
              <span className="layout-preset-name">{preset.name}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
