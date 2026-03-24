"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlockCard } from "../block-card";
import type { Block, Section } from "@/lib/types/section";

import "./section-group.css";

// =============================================================================
// Types
// =============================================================================

interface SectionGroupProps {
  section: Section;
  sectionIndex: number;
  onUpdateBlock: (
    blockKey: string,
    dataUpdates: Record<string, unknown>,
  ) => void;
  onDeleteBlock: (blockKey: string) => void;
  onDuplicateBlock: (blockKey: string) => void;
  onDeleteSection: (sectionKey: string) => void;
  onOpenBlockPicker: (sectionKey: string, containerKey: string) => void;
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function SectionGroup({
  section,
  sectionIndex,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onDeleteSection,
  onOpenBlockPicker,
  className,
}: SectionGroupProps) {
  const [expanded, setExpanded] = React.useState(true);

  // Gather all blocks from all containers into a flat sortable list
  const allBlocks: {
    block: Block;
    containerKey: string;
    sortableId: string;
  }[] = [];
  for (const container of section.containers) {
    for (const block of container.blocks) {
      allBlocks.push({
        block,
        containerKey: container._key,
        sortableId: `${section._key}:${container._key}:${block._key}`,
      });
    }
  }

  const sortableIds = allBlocks.map((b) => b.sortableId);
  const defaultContainerKey = section.containers[0]?._key;
  const blockCount = allBlocks.length;

  return (
    <div className={cn("section-group", className)}>
      <div className="section-group__header">
        <button
          type="button"
          className="section-group__toggle"
          onClick={() => setExpanded(!expanded)}
        >
          <ChevronDown
            className={cn(
              "section-group__chevron",
              !expanded && "section-group__chevron--collapsed",
            )}
          />
          <span className="section-group__title">
            Section {sectionIndex + 1}
          </span>
          <span className="section-group__count">
            {blockCount} {blockCount === 1 ? "block" : "blocks"}
          </span>
        </button>

        <div className="section-group__actions">
          <Button
            variant="ghost"
            size="icon"
            className="section-group__action-btn"
            onClick={() => onDeleteSection(section._key)}
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="section-group__body">
          {allBlocks.length === 0 ? (
            <div className="section-group__empty">
              <p>No blocks in this section</p>
            </div>
          ) : (
            <SortableContext
              items={sortableIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="section-group__blocks">
                {allBlocks.map(({ block, sortableId }) => (
                  <BlockCard
                    key={block._key}
                    block={block}
                    sortableId={sortableId}
                    onUpdate={(updates) => onUpdateBlock(block._key, updates)}
                    onDelete={() => onDeleteBlock(block._key)}
                    onDuplicate={() => onDuplicateBlock(block._key)}
                  />
                ))}
              </div>
            </SortableContext>
          )}

          {defaultContainerKey && (
            <button
              type="button"
              className="section-group__add-btn"
              onClick={() =>
                onOpenBlockPicker(section._key, defaultContainerKey)
              }
            >
              <Plus className="section-group__add-icon" />
              Add Block
            </button>
          )}
        </div>
      )}
    </div>
  );
}
