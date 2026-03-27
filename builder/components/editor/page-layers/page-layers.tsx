"use client";

import * as React from "react";
import { AddBlockPopover } from "@/components/editor/add-block-popover/add-block-popover";
import {
  ChevronRight,
  ChevronDown,
  Layers,
  Box,
  Type,
  Heading,
  Image,
  MousePointerClick,
  LayoutGrid,
  Minus,
  Space,
  Quote,
  List,
  Video,
  Music,
  Map,
  Code,
  BarChart3,
  Smile,
  CreditCard,
  Columns3,
  Rows3,
  AlignVerticalSpaceAround,
  ShoppingCart,
  Package,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { Section, Block } from "@/lib/hooks/use-pages";
import { cn } from "@/lib/utils";

import "./page-layers.css";

// Block type → icon mapping
const blockIcons: Record<string, React.ElementType> = {
  "heading-block": Heading,
  "text-block": Type,
  "rich-text-block": Type,
  "image-block": Image,
  "button-block": MousePointerClick,
  "card-block": CreditCard,
  "video-block": Video,
  "audio-block": Music,
  "list-block": List,
  "quote-block": Quote,
  "divider-block": Minus,
  "spacer-block": Space,
  "embed-block": Code,
  "icon-block": Smile,
  "stats-block": BarChart3,
  "map-block": Map,
  "logo-block": Image,
  "accordion-block": Rows3,
  "tabs-block": Columns3,
  "container-block": Box,
  "grid-block": LayoutGrid,
  "flex-block": Columns3,
  "stack-block": AlignVerticalSpaceAround,
  "product-grid-block": ShoppingCart,
  "product-detail-block": Package,
  "cart-block": ShoppingCart,
  "checkout-block": CreditCard,
};

// Get a readable label from block data
function getBlockLabel(block: Block): string {
  const data = block.data as Record<string, unknown>;
  if (data?.text && typeof data.text === "string") {
    return data.text.slice(0, 40) || block._type.replace("-block", "");
  }
  if (data?.content && typeof data.content === "string") {
    return data.content.slice(0, 40) || block._type.replace("-block", "");
  }
  return block._type
    .replace("-block", "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface PageLayersProps {
  sections: Section[];
  selectedKey?: string | null;
  hoveredKey?: string | null;
  onSelectSection?: (sectionIndex: number, key: string) => void;
  onSelectContainer?: (
    sectionIndex: number,
    containerIndex: number,
    key: string,
  ) => void;
  onSelectBlock?: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
    key: string,
  ) => void;
  onHover?: (key: string | null) => void;
  // Actions
  onAddSection?: () => void;
  onDeleteSection?: (sectionIndex: number) => void;
  onAddBlock?: (
    sectionIndex: number,
    containerIndex: number,
    blockType: string,
  ) => void;
  onDeleteBlock?: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
  ) => void;
  onDuplicateBlock?: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
  ) => void;
  onMoveBlockUp?: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
  ) => void;
  onMoveBlockDown?: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
  ) => void;
}

export function PageLayers({
  sections,
  selectedKey,
  hoveredKey,
  onSelectSection,
  onSelectContainer,
  onSelectBlock,
  onHover,
  onAddSection,
  onDeleteSection,
  onAddBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onMoveBlockUp,
  onMoveBlockDown,
}: PageLayersProps) {
  const [collapsed, setCollapsed] = React.useState<Set<string>>(new Set());

  const toggleCollapse = (key: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (sections.length === 0) {
    return (
      <div className="page-layers">
        <div className="page-layers-empty">
          <Layers className="page-layers-empty-icon" />
          <p>No content yet</p>
          <span>Add a section to get started</span>
          {onAddSection && (
            <button className="layer-add-btn" onClick={onAddSection}>
              <Plus className="size-3" />
              Add Section
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page-layers">
      <div className="page-layers-tree">
        {sections.map((section, sectionIndex) => {
          const sectionKey = section._key;
          const isSectionCollapsed = collapsed.has(sectionKey);
          const containers = section.containers ?? [];

          return (
            <div key={sectionKey} className="layer-group">
              {/* Section row */}
              <div
                className={cn(
                  "layer-item layer-item-section",
                  selectedKey === sectionKey && "is-selected",
                  hoveredKey === sectionKey && "is-hovered",
                )}
                onClick={() => onSelectSection?.(sectionIndex, sectionKey)}
                onMouseEnter={() => onHover?.(sectionKey)}
                onMouseLeave={() => onHover?.(null)}
              >
                <button
                  className="layer-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCollapse(sectionKey);
                  }}
                >
                  {isSectionCollapsed ? (
                    <ChevronRight className="layer-toggle-icon" />
                  ) : (
                    <ChevronDown className="layer-toggle-icon" />
                  )}
                </button>
                <Box className="layer-type-icon" />
                <span className="layer-label">Section {sectionIndex + 1}</span>
                <span className="layer-badge">
                  {containers.reduce(
                    (sum, c) => sum + (c.blocks?.length ?? 0),
                    0,
                  )}
                </span>
                {selectedKey === sectionKey && onDeleteSection && (
                  <button
                    className="layer-action"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSection(sectionIndex);
                    }}
                    title="Delete section"
                  >
                    <Trash2 className="size-3" />
                  </button>
                )}
              </div>

              {/* Containers and blocks */}
              {!isSectionCollapsed &&
                containers.map((container, containerIndex) => {
                  const containerKey = container._key;
                  const isContainerCollapsed = collapsed.has(containerKey);
                  const blocks = (container.blocks ?? []) as Block[];

                  return (
                    <div key={containerKey} className="layer-group">
                      {/* Container row */}
                      <div
                        className={cn(
                          "layer-item layer-item-container",
                          selectedKey === containerKey && "is-selected",
                          hoveredKey === containerKey && "is-hovered",
                        )}
                        onClick={() =>
                          onSelectContainer?.(
                            sectionIndex,
                            containerIndex,
                            containerKey,
                          )
                        }
                        onMouseEnter={() => onHover?.(containerKey)}
                        onMouseLeave={() => onHover?.(null)}
                      >
                        <button
                          className="layer-toggle"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCollapse(containerKey);
                          }}
                        >
                          {isContainerCollapsed ? (
                            <ChevronRight className="layer-toggle-icon" />
                          ) : (
                            <ChevronDown className="layer-toggle-icon" />
                          )}
                        </button>
                        <LayoutGrid className="layer-type-icon" />
                        <span className="layer-label">
                          Container {containerIndex + 1}
                        </span>
                        <span className="layer-badge">{blocks.length}</span>
                        {onAddBlock && (
                          <AddBlockPopover
                            onAddBlock={(blockType) =>
                              onAddBlock(
                                sectionIndex,
                                containerIndex,
                                blockType,
                              )
                            }
                          >
                            <button
                              className="layer-action"
                              onClick={(e) => e.stopPropagation()}
                              title="Add block"
                            >
                              <Plus className="size-3" />
                            </button>
                          </AddBlockPopover>
                        )}
                      </div>

                      {/* Block rows */}
                      {!isContainerCollapsed &&
                        blocks.map((block, blockIndex) => {
                          const Icon = blockIcons[block._type] || Box;
                          const nestedBlocks = (block.blocks as Block[] | undefined) ?? [];
                          return (
                            <React.Fragment key={block._key}>
                            <div
                              className={cn(
                                "layer-item layer-item-block",
                                selectedKey === block._key && "is-selected",
                                hoveredKey === block._key && "is-hovered",
                              )}
                              onClick={() =>
                                onSelectBlock?.(
                                  sectionIndex,
                                  containerIndex,
                                  blockIndex,
                                  block._key,
                                )
                              }
                              onMouseEnter={() => onHover?.(block._key)}
                              onMouseLeave={() => onHover?.(null)}
                            >
                              <Icon className="layer-type-icon" />
                              <span className="layer-label">
                                {getBlockLabel(block)}
                              </span>
                              {selectedKey === block._key && (
                                <div className="layer-actions">
                                  {onMoveBlockUp && blockIndex > 0 && (
                                    <button
                                      className="layer-action"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onMoveBlockUp(
                                          sectionIndex,
                                          containerIndex,
                                          blockIndex,
                                        );
                                      }}
                                      title="Move up"
                                    >
                                      <ArrowUp className="size-3" />
                                    </button>
                                  )}
                                  {onMoveBlockDown &&
                                    blockIndex < blocks.length - 1 && (
                                      <button
                                        className="layer-action"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onMoveBlockDown(
                                            sectionIndex,
                                            containerIndex,
                                            blockIndex,
                                          );
                                        }}
                                        title="Move down"
                                      >
                                        <ArrowDown className="size-3" />
                                      </button>
                                    )}
                                  {onDuplicateBlock && (
                                    <button
                                      className="layer-action"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDuplicateBlock(
                                          sectionIndex,
                                          containerIndex,
                                          blockIndex,
                                        );
                                      }}
                                      title="Duplicate"
                                    >
                                      <Copy className="size-3" />
                                    </button>
                                  )}
                                  {onDeleteBlock && (
                                    <button
                                      className="layer-action layer-action-danger"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteBlock(
                                          sectionIndex,
                                          containerIndex,
                                          blockIndex,
                                        );
                                      }}
                                      title="Delete"
                                    >
                                      <Trash2 className="size-3" />
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                            {/* Nested blocks (for container-type blocks) */}
                            {nestedBlocks.length > 0 &&
                              nestedBlocks.map((childBlock) => {
                                const ChildIcon =
                                  blockIcons[childBlock._type] || Box;
                                return (
                                  <div
                                    key={childBlock._key}
                                    className={cn(
                                      "layer-item",
                                      selectedKey === childBlock._key &&
                                        "is-selected",
                                      hoveredKey === childBlock._key &&
                                        "is-hovered",
                                    )}
                                    style={{ paddingLeft: "3.5rem" }}
                                    onClick={() =>
                                      onSelectBlock?.(
                                        sectionIndex,
                                        containerIndex,
                                        blockIndex,
                                        childBlock._key,
                                      )
                                    }
                                    onMouseEnter={() =>
                                      onHover?.(childBlock._key)
                                    }
                                    onMouseLeave={() => onHover?.(null)}
                                  >
                                    <ChildIcon className="layer-type-icon" />
                                    <span className="layer-label">
                                      {getBlockLabel(childBlock)}
                                    </span>
                                  </div>
                                );
                              })}
                            </React.Fragment>
                          );
                        })}
                    </div>
                  );
                })}
            </div>
          );
        })}
        {onAddSection && (
          <div className="mt-2 px-1">
            <button className="layer-add-btn" onClick={onAddSection}>
              <Plus className="size-3.5" />
              Add Section
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
