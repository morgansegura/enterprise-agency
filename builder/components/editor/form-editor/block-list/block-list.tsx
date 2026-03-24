"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionGroup } from "../section-group";
import type { Section } from "@/lib/types/section";
import type { BlockLocation } from "@/lib/stores/editor-store";

import "./block-list.css";

// =============================================================================
// Types
// =============================================================================

interface BlockListProps {
  sections: Section[];
  onUpdateBlock: (
    blockKey: string,
    dataUpdates: Record<string, unknown>,
  ) => void;
  onDeleteBlock: (blockKey: string) => void;
  onDuplicateBlock: (blockKey: string) => void;
  onMoveBlock: (
    blockKey: string,
    from: BlockLocation,
    to: BlockLocation,
  ) => void;
  onDeleteSection: (sectionKey: string) => void;
  onAddSection: () => void;
  onOpenBlockPicker: (sectionKey: string, containerKey: string) => void;
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function BlockList({
  sections,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onMoveBlock,
  onDeleteSection,
  onAddSection,
  onOpenBlockPicker,
  className,
}: BlockListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Parse sortable IDs: "sectionKey:containerKey:blockKey"
    const [fromSectionKey, fromContainerKey, blockKey] = (
      active.id as string
    ).split(":");
    const [toSectionKey, toContainerKey] = (over.id as string).split(":");

    // Find the destination index
    let toIndex = 0;
    for (const section of sections) {
      if (section._key === toSectionKey) {
        for (const container of section.containers) {
          if (container._key === toContainerKey) {
            toIndex = container.blocks.findIndex(
              (b) => b._key === (over.id as string).split(":")[2],
            );
            if (toIndex === -1) toIndex = container.blocks.length;
            break;
          }
        }
        break;
      }
    }

    onMoveBlock(
      blockKey,
      { sectionKey: fromSectionKey, containerKey: fromContainerKey, index: 0 },
      {
        sectionKey: toSectionKey,
        containerKey: toContainerKey,
        index: toIndex,
      },
    );
  };

  return (
    <div className={cn("block-list", className)}>
      <div className="block-list__content">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="block-list__sections">
            {sections.map((section, index) => (
              <SectionGroup
                key={section._key}
                section={section}
                sectionIndex={index}
                onUpdateBlock={onUpdateBlock}
                onDeleteBlock={onDeleteBlock}
                onDuplicateBlock={onDuplicateBlock}
                onDeleteSection={onDeleteSection}
                onOpenBlockPicker={onOpenBlockPicker}
              />
            ))}
          </div>
        </DndContext>

        <Button
          variant="outline"
          onClick={onAddSection}
          className="block-list__add-section"
        >
          <Plus className="block-list__add-icon" />
          Add Section
        </Button>
      </div>
    </div>
  );
}
