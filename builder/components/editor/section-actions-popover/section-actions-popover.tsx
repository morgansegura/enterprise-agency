"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Plus,
  Layers,
  Copy,
  Heart,
  ChevronUp,
  ChevronDown,
  Trash2,
  Box,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Section, Block } from "@/lib/hooks/use-pages";
import { SectionSettingsPopover } from "../section-settings-popover";
import { ContainerSettingsPopover } from "../container-settings-popover";
import { AddBlockPopover } from "../add-block-popover";
import { LayersPopover } from "../layers-popover";

import "./section-actions-popover.css";

interface SectionActionsPopoverProps {
  section: Section;
  onSectionChange: (section: Section) => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onAddBlock?: (blockType: string) => void;
  selectedBlockKey?: string | null;
  onSelectBlock?: (key: string | null) => void;
  onHoverBlock?: (key: string | null) => void;
  onOpenChange?: (open: boolean) => void;
  isFirst?: boolean;
  isLast?: boolean;
  children: React.ReactNode;
}

export function SectionActionsPopover({
  section,
  onSectionChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onAddBlock,
  selectedBlockKey,
  onSelectBlock,
  onHoverBlock,
  onOpenChange,
  isFirst = false,
  isLast = false,
  children,
}: SectionActionsPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [containerOpen, setContainerOpen] = React.useState(false);
  const [addBlockOpen, setAddBlockOpen] = React.useState(false);
  const [layersOpen, setLayersOpen] = React.useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    onOpenChange?.(isOpen);
  };

  // Keep popover open while child popovers are open
  const isChildOpen =
    settingsOpen || containerOpen || addBlockOpen || layersOpen;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="section-actions-popover"
        side="left"
        align="start"
        sideOffset={8}
      >
        <div className="section-actions-header">
          <span>Section</span>
        </div>

        <div className="section-actions-content">
          {/* Add Block */}
          {onAddBlock && (
            <AddBlockPopover
              onAddBlock={(blockType) => {
                onAddBlock(blockType);
                setAddBlockOpen(false);
              }}
              open={addBlockOpen}
              onOpenChange={setAddBlockOpen}
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "section-actions-item",
                  addBlockOpen && "is-active",
                )}
              >
                <Plus className="h-4 w-4" />
                <span>Add Block</span>
              </Button>
            </AddBlockPopover>
          )}

          {/* Layers */}
          <LayersPopover
            blocks={section.containers?.[0]?.blocks ?? []}
            selectedBlockKey={selectedBlockKey ?? null}
            onSelectBlock={onSelectBlock ?? (() => {})}
            onHoverBlock={onHoverBlock}
            open={layersOpen}
            onOpenChange={setLayersOpen}
          >
            <Button
              variant="ghost"
              size="sm"
              className={cn("section-actions-item", layersOpen && "is-active")}
            >
              <Layers className="h-4 w-4" />
              <span>Layers</span>
            </Button>
          </LayersPopover>

          {/* Divider */}
          <div className="section-actions-divider" />

          {/* Edit Section */}
          <SectionSettingsPopover
            section={section}
            onChange={onSectionChange}
            open={settingsOpen}
            onOpenChange={setSettingsOpen}
          >
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "section-actions-item",
                settingsOpen && "is-active",
              )}
            >
              <Pencil className="h-4 w-4" />
              <span>Edit Section</span>
            </Button>
          </SectionSettingsPopover>

          {/* Edit Container */}
          <ContainerSettingsPopover
            section={section}
            onChange={onSectionChange}
            open={containerOpen}
            onOpenChange={setContainerOpen}
          >
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "section-actions-item",
                containerOpen && "is-active",
              )}
            >
              <Box className="h-4 w-4" />
              <span>Edit Container</span>
            </Button>
          </ContainerSettingsPopover>

          {/* Divider */}
          <div className="section-actions-divider" />

          {/* Quick Actions Row */}
          <div className="section-actions-row">
            {onDuplicate && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onDuplicate}
                title="Duplicate"
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              title="Save to Library"
              className="opacity-50"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onMoveUp}
              title="Move up"
              disabled={isFirst}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onMoveDown}
              title="Move down"
              disabled={isLast}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Divider */}
          <div className="section-actions-divider" />

          {/* Remove */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="section-actions-item section-actions-delete"
          >
            <Trash2 className="h-4 w-4" />
            <span>Remove</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
