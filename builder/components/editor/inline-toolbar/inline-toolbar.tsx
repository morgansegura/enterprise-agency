"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronUp,
  ChevronDown,
  Copy,
  Star,
  Settings,
  Trash2,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import "./inline-toolbar.css";

export interface InlineToolbarAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
}

export interface InlineToolbarProps {
  /** Position of the toolbar */
  position?: "top" | "bottom" | "left" | "right";
  /** Show drag handle */
  showDragHandle?: boolean;
  /** Move up action */
  onMoveUp?: () => void;
  canMoveUp?: boolean;
  /** Move down action */
  onMoveDown?: () => void;
  canMoveDown?: boolean;
  /** Clone/duplicate action */
  onClone?: () => void;
  /** Favorite/save as template action */
  onFavorite?: () => void;
  isFavorite?: boolean;
  /** Settings action - opens settings panel/popover */
  onSettings?: () => void;
  /** Delete action */
  onDelete?: () => void;
  /** Additional custom actions */
  customActions?: InlineToolbarAction[];
  /** Label for the element (e.g., "Section", "Container") */
  elementLabel?: string;
  /** Compact mode - icons only, no tooltips */
  compact?: boolean;
  /** Show only on hover */
  showOnHover?: boolean;
  /** Class name for additional styling */
  className?: string;
  /** Drag handle props for DnD */
  dragHandleProps?: Record<string, unknown>;
}

/**
 * InlineToolbar - Reusable toolbar for sections, containers, and blocks
 *
 * Provides consistent actions across all editor elements:
 * - Move up/down
 * - Clone/duplicate
 * - Favorite/save as template
 * - Settings (opens detailed panel)
 * - Delete
 *
 * Can be positioned on any side and supports custom actions.
 */
export function InlineToolbar({
  position = "top",
  showDragHandle = true,
  onMoveUp,
  canMoveUp = true,
  onMoveDown,
  canMoveDown = true,
  onClone,
  onFavorite,
  isFavorite = false,
  onSettings,
  onDelete,
  customActions = [],
  elementLabel,
  compact = false,
  showOnHover = true,
  className,
  dragHandleProps,
}: InlineToolbarProps) {
  const ToolbarButton = ({
    icon,
    label,
    onClick,
    disabled = false,
    variant = "default",
  }: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    variant?: "default" | "destructive";
  }) => {
    const button = (
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        disabled={disabled || !onClick}
        className={cn(
          "inline-toolbar-button",
          variant === "destructive" && "inline-toolbar-button--destructive",
        )}
      >
        {icon}
      </Button>
    );

    if (compact) {
      return button;
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div
      className={cn(
        "inline-toolbar",
        `inline-toolbar--${position}`,
        showOnHover && "inline-toolbar--hover",
        className,
      )}
    >
      {/* Element label */}
      {elementLabel && (
        <span className="inline-toolbar-label">{elementLabel}</span>
      )}

      {/* Drag handle */}
      {showDragHandle && (
        <div
          className="inline-toolbar-drag-handle"
          {...dragHandleProps}
          title="Drag to reorder"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </div>
      )}

      {/* Divider after drag handle */}
      {showDragHandle && <div className="inline-toolbar-divider" />}

      {/* Move actions */}
      {(onMoveUp || onMoveDown) && (
        <>
          <ToolbarButton
            icon={<ChevronUp className="h-3.5 w-3.5" />}
            label="Move up"
            onClick={onMoveUp}
            disabled={!canMoveUp}
          />
          <ToolbarButton
            icon={<ChevronDown className="h-3.5 w-3.5" />}
            label="Move down"
            onClick={onMoveDown}
            disabled={!canMoveDown}
          />
          <div className="inline-toolbar-divider" />
        </>
      )}

      {/* Clone action */}
      {onClone && (
        <ToolbarButton
          icon={<Copy className="h-3.5 w-3.5" />}
          label="Duplicate"
          onClick={onClone}
        />
      )}

      {/* Favorite action */}
      {onFavorite && (
        <ToolbarButton
          icon={
            <Star className={cn("h-3.5 w-3.5", isFavorite && "fill-current")} />
          }
          label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={onFavorite}
        />
      )}

      {/* Custom actions */}
      {customActions.map((action) => (
        <ToolbarButton
          key={action.id}
          icon={action.icon}
          label={action.label}
          onClick={action.onClick}
          disabled={action.disabled}
          variant={action.variant}
        />
      ))}

      {/* Settings action */}
      {onSettings && (
        <>
          <div className="inline-toolbar-divider" />
          <ToolbarButton
            icon={<Settings className="h-3.5 w-3.5" />}
            label="Settings"
            onClick={onSettings}
          />
        </>
      )}

      {/* Delete action */}
      {onDelete && (
        <>
          <div className="inline-toolbar-divider" />
          <ToolbarButton
            icon={<Trash2 className="h-3.5 w-3.5" />}
            label="Delete"
            onClick={onDelete}
            variant="destructive"
          />
        </>
      )}
    </div>
  );
}
