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
  LayoutGrid,
  Copy,
  Heart,
  ChevronUp,
  ChevronDown,
  Trash2,
  Box,
} from "lucide-react";
import type { Section } from "@/lib/hooks/use-pages";
import { SectionSettingsPopover } from "../section-settings-popover";
import { ContainerSettingsPopover } from "../container-settings-popover";

import "./section-actions-popover.css";

interface SectionActionsPopoverProps {
  section: Section;
  onSectionChange: (section: Section) => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
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
  onOpenChange,
  isFirst = false,
  isLast = false,
  children,
}: SectionActionsPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [containerOpen, setContainerOpen] = React.useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    onOpenChange?.(isOpen);
  };

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
          {/* Edit Section */}
          <SectionSettingsPopover
            section={section}
            onChange={onSectionChange}
            open={settingsOpen}
            onOpenChange={setSettingsOpen}
          >
            <Button variant="ghost" size="sm" className="section-actions-item">
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
            <Button variant="ghost" size="sm" className="section-actions-item">
              <Box className="h-4 w-4" />
              <span>Edit Container</span>
            </Button>
          </ContainerSettingsPopover>

          {/* View Layouts */}
          <Button variant="ghost" size="sm" className="section-actions-item">
            <LayoutGrid className="h-4 w-4" />
            <span>View Layouts</span>
          </Button>

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
