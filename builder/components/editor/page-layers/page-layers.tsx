"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BlockPickerDialog } from "@/components/editor/add-block-popover/block-picker-dialog";
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
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SaveToLibraryDialog } from "@/components/editor/library-picker/save-to-library-dialog";
import { useResolvedTenant } from "@/lib/hooks/use-resolved-tenant";
import type { Section, Container, Block } from "@/lib/hooks/use-pages";
import { cn } from "@/lib/utils";
import { EditableLayerLabel } from "./editable-layer-label";

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

// Label overrides for renamed block types
const LABEL_OVERRIDES: Record<string, string> = {
  "container-block": "Box",
};

// Get a readable label from block data — prefers user's displayName,
// then content excerpt, then formatted type name.
function getBlockLabel(block: Block): string {
  if (block.displayName?.trim()) return block.displayName.trim();
  if (LABEL_OVERRIDES[block._type]) return LABEL_OVERRIDES[block._type];
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

function SortableBlockItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

interface PageLayersProps {
  sections: Section[];
  /**
   * Whether a Header is assigned to this page. If true, render a Header node
   * in the Layers panel even when `headerSections` is empty (so users can
   * click into the node and add their first section).
   */
  hasHeader?: boolean;
  /**
   * Header sections (from Header.sections table). Render above page sections
   * with a "shared" badge. Index space is separate from page sections.
   */
  headerSections?: Section[];
  /** Label for the header group — defaults to "Header". */
  headerLabel?: string;
  /** Whether a Footer is assigned to this page. */
  hasFooter?: boolean;
  /**
   * Footer sections (from Footer.sections table). Render below page sections
   * with a "shared" badge.
   */
  footerSections?: Section[];
  /** Label for the footer group — defaults to "Footer". */
  footerLabel?: string;
  /**
   * Called when user selects the header/footer node itself (not one of its
   * sections). Useful for routing to Header/Footer settings.
   */
  onSelectHeader?: () => void;
  onSelectFooter?: () => void;
  onAddHeaderSection?: () => void;
  onAddFooterSection?: () => void;
  /** Update header sections array (for CRUD on header's sections/containers/blocks) */
  onUpdateHeaderSections?: (sections: Section[]) => void;
  /** Update footer sections array */
  onUpdateFooterSections?: (sections: Section[]) => void;
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
  onAddBlockToBox?: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
    blockType: string,
  ) => void;
  onAddContainer?: (sectionIndex: number) => void;
  onBlockReorder?: (
    sectionIndex: number,
    containerIndex: number,
    fromIndex: number,
    toIndex: number,
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
  // Container-level actions
  onDeleteContainer?: (sectionIndex: number, containerIndex: number) => void;
  onDuplicateContainer?: (sectionIndex: number, containerIndex: number) => void;
  onMoveContainerUp?: (sectionIndex: number, containerIndex: number) => void;
  onMoveContainerDown?: (sectionIndex: number, containerIndex: number) => void;
  // Section-level actions
  onDuplicateSection?: (sectionIndex: number) => void;
  onMoveSectionUp?: (sectionIndex: number) => void;
  onMoveSectionDown?: (sectionIndex: number) => void;
  // Rename handlers — write displayName back to the element
  onRenameSection?: (sectionIndex: number, displayName: string) => void;
  onRenameContainer?: (
    sectionIndex: number,
    containerIndex: number,
    displayName: string,
  ) => void;
  onRenameBlock?: (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
    displayName: string,
  ) => void;
  /** Rename the Header entity (Header.name). */
  onRenameHeader?: (name: string) => void;
  /** Rename the Footer entity (Footer.name). */
  onRenameFooter?: (name: string) => void;
}

/**
 * Get the label for a section — prefers user's displayName, falls back
 * to "Section N".
 */
function getSectionLabel(section: Section, index: number): string {
  return section.displayName?.trim() || `Section ${index + 1}`;
}

/**
 * Get the label for a container — prefers user's displayName, falls back
 * to "Container N".
 */
function getContainerLabel(container: Container, index: number): string {
  return container.displayName?.trim() || `Container ${index + 1}`;
}

export function PageLayers({
  sections,
  hasHeader,
  headerSections,
  headerLabel = "Header",
  hasFooter,
  footerSections,
  footerLabel = "Footer",
  onSelectHeader,
  onSelectFooter,
  onAddHeaderSection,
  onAddFooterSection,
  onUpdateHeaderSections,
  onUpdateFooterSections,
  selectedKey,
  hoveredKey,
  onSelectSection,
  onSelectContainer,
  onSelectBlock,
  onHover,
  onAddSection,
  onDeleteSection,
  onAddBlock,
  onAddBlockToBox,
  onAddContainer,
  onBlockReorder,
  onDeleteBlock,
  onDuplicateBlock,
  onMoveBlockUp,
  onMoveBlockDown,
  onDeleteContainer,
  onDuplicateContainer,
  onMoveContainerUp,
  onMoveContainerDown,
  onDuplicateSection,
  onMoveSectionUp,
  onMoveSectionDown,
  onRenameSection,
  onRenameContainer,
  onRenameBlock,
  onRenameHeader,
  onRenameFooter,
}: PageLayersProps) {
  const { tenantId } = useResolvedTenant();
  const [collapsed, setCollapsed] = React.useState<Set<string>>(new Set());
  // Key of the item currently in rename edit mode (F2 or context menu)
  const [renamingKey, setRenamingKey] = React.useState<string | null>(null);
  // Block picker dialog target — set when user clicks "Add Block" in a
  // container or box context menu. `scope` controls which types the picker
  // offers (box excludes nested container-blocks — box is the last depth).
  // When scope === "box", `blockIndex` identifies which Box in the container
  // should receive the block, so the picker routes to `onAddBlockToBox`
  // instead of `onAddBlock` (which appends into the container).
  const [addBlockTarget, setAddBlockTarget] = React.useState<
    | {
        sectionIndex: number;
        containerIndex: number;
        scope: "container" | "box";
        blockIndex?: number;
      }
    | null
  >(null);

  // F2 on selected item enters rename mode.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "F2") return;
      if (!selectedKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      // Don't fire while editing an input somewhere else on the page
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      setRenamingKey(selectedKey);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedKey]);
  const [saveToLibrary, setSaveToLibrary] = React.useState<{
    section: Section;
    index: number;
  } | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const toggleCollapse = (key: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const headerAssigned = hasHeader || (headerSections || []).length > 0;
  const footerAssigned = hasFooter || (footerSections || []).length > 0;

  if (sections.length === 0 && !headerAssigned && !footerAssigned) {
    return (
      <div className="page-layers">
        <div className="page-layers-empty">
          <Layers className="page-layers-empty-icon" />
          <p>No content yet</p>
          <span>Add a section to get started</span>
          {onAddSection && (
            <button className="layer-add-btn" onClick={onAddSection}>
              Add Page Section
            </button>
          )}
        </div>
      </div>
    );
  }

  // Shared chrome group — renders a Header or Footer node with a "(shared)"
  // badge. Sections inside are read-only in the Layers panel for now —
  // full inline editing lives on the canvas via the section editor.
  const renderSharedGroup = (
    scope: "header" | "footer",
    label: string,
    groupSections: Section[],
    isAssigned: boolean,
    onSelect?: () => void,
    onAddSectionToGroup?: () => void,
    onUpdateSections?: (sections: Section[]) => void,
  ) => {
    if (!isAssigned && groupSections.length === 0) return null;
    const isCollapsed = collapsed.has(scope);
    const onRename = scope === "header" ? onRenameHeader : onRenameFooter;
    return (
      <div
        key={scope}
        className="layer-group layer-group-shared"
        data-scope={scope}
      >
        <div
          className={cn(
            "layer-item layer-item-section layer-item-shared",
            selectedKey === scope && "is-selected",
          )}
          onClick={onSelect}
        >
          {groupSections.length > 0 ? (
            <button
              className="layer-toggle"
              onClick={(e) => {
                e.stopPropagation();
                toggleCollapse(scope);
              }}
            >
              {isCollapsed ? (
                <ChevronRight className="layer-toggle-icon" />
              ) : (
                <ChevronDown className="layer-toggle-icon" />
              )}
            </button>
          ) : (
            <span className="layer-toggle" />
          )}
          <Layers className="layer-type-icon" />
          <EditableLayerLabel
            className="layer-label"
            value={label}
            onCommit={(next) => onRename?.(next)}
            isEditing={renamingKey === scope}
            onEditingChange={(editing) =>
              setRenamingKey(editing ? scope : null)
            }
          />
          <span className="layer-badge-shared">shared</span>
          {groupSections.length > 0 && (
            <span className="layer-badge">{groupSections.length}</span>
          )}
        </div>
        {/* Header/footer IS a section — show containers directly */}
        {!isCollapsed && (() => {
          const section = groupSections[0];
          const containers = section?.containers ?? [];
          return (
            <div className="layer-shared-children">
              {containers.map((container, cIdx) => {
                const cKey = container._key;
                const cCollapsed = collapsed.has(cKey);
                const cBlocks = (container.blocks ?? []) as Block[];
                return (
                  <div key={cKey} className="layer-group">
                    <div
                      className={cn(
                        "layer-item layer-item-container",
                        selectedKey === cKey && "is-selected",
                        hoveredKey === cKey && "is-hovered",
                      )}
                      onClick={() => onSelect?.()}
                      onMouseEnter={() => onHover?.(cKey)}
                      onMouseLeave={() => onHover?.(null)}
                    >
                      {cBlocks.length > 0 ? (
                        <button
                          className="layer-toggle"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCollapse(cKey);
                          }}
                        >
                          {cCollapsed ? (
                            <ChevronRight className="layer-toggle-icon" />
                          ) : (
                            <ChevronDown className="layer-toggle-icon" />
                          )}
                        </button>
                      ) : (
                        <span className="layer-toggle" />
                      )}
                      <LayoutGrid className="layer-type-icon" />
                      <EditableLayerLabel
                        className="layer-label"
                        value={getContainerLabel(container, cIdx)}
                        onCommit={() => {}}
                        isEditing={renamingKey === cKey}
                        onEditingChange={(editing) =>
                          setRenamingKey(editing ? cKey : null)
                        }
                      />
                      <span className="layer-badge">{cBlocks.length}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="layer-action"
                            onClick={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                            title="More actions"
                          >
                            <MoreHorizontal className="size-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onSelect={() => {
                              setAddBlockTarget({
                                sectionIndex: 0,
                                containerIndex: cIdx,
                                scope: "container",
                              });
                            }}
                          >
                            Add Block
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={() => setRenamingKey(cKey)}>
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              if (!section) return;
                              const clone = JSON.parse(JSON.stringify(container));
                              clone._key = `container-${Date.now().toString(36)}`;
                              const updated = [...containers];
                              updated.splice(cIdx + 1, 0, clone);
                              onUpdateSections?.([{ ...section, containers: updated }]);
                            }}
                          >
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            disabled={cIdx === 0}
                            onSelect={() => {
                              if (!section) return;
                              const cs = [...containers];
                              [cs[cIdx - 1], cs[cIdx]] = [cs[cIdx], cs[cIdx - 1]];
                              onUpdateSections?.([{ ...section, containers: cs }]);
                            }}
                          >
                            Move Up
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={cIdx === containers.length - 1}
                            onSelect={() => {
                              if (!section) return;
                              const cs = [...containers];
                              [cs[cIdx + 1], cs[cIdx]] = [cs[cIdx], cs[cIdx + 1]];
                              onUpdateSections?.([{ ...section, containers: cs }]);
                            }}
                          >
                            Move Down
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            disabled={containers.length <= 1}
                            onSelect={() => {
                              if (!section) return;
                              onUpdateSections?.([{
                                ...section,
                                containers: containers.filter((_, i) => i !== cIdx),
                              }]);
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {!cCollapsed &&
                      cBlocks.map((block, bIdx) => {
                        const Icon = blockIcons[block._type] || Box;
                        return (
                          <div
                            key={block._key}
                            className={cn(
                              "layer-item layer-item-block",
                              selectedKey === block._key && "is-selected",
                              hoveredKey === block._key && "is-hovered",
                            )}
                            onClick={() => onSelect?.()}
                            onMouseEnter={() => onHover?.(block._key)}
                            onMouseLeave={() => onHover?.(null)}
                          >
                            <Icon className="layer-type-icon" />
                            <EditableLayerLabel
                              className="layer-label"
                              value={getBlockLabel(block)}
                              onCommit={() => {}}
                              isEditing={renamingKey === block._key}
                              onEditingChange={(editing) =>
                                setRenamingKey(editing ? block._key : null)
                              }
                            />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  className="layer-action"
                                  onClick={(e) => e.stopPropagation()}
                                  onPointerDown={(e) => e.stopPropagation()}
                                  title="More actions"
                                >
                                  <MoreHorizontal className="size-3.5" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem
                                  onSelect={() => setRenamingKey(block._key)}
                                >
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onSelect={() => {
                                    if (!section) return;
                                    const clone = JSON.parse(JSON.stringify(block));
                                    clone._key = `block-${Date.now().toString(36)}`;
                                    const newBlocks = [...cBlocks];
                                    newBlocks.splice(bIdx + 1, 0, clone);
                                    const cs = [...containers];
                                    cs[cIdx] = { ...container, blocks: newBlocks };
                                    onUpdateSections?.([{ ...section, containers: cs }]);
                                  }}
                                >
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  disabled={bIdx === 0}
                                  onSelect={() => {
                                    if (!section) return;
                                    const newBlocks = [...cBlocks];
                                    [newBlocks[bIdx - 1], newBlocks[bIdx]] = [newBlocks[bIdx], newBlocks[bIdx - 1]];
                                    const cs = [...containers];
                                    cs[cIdx] = { ...container, blocks: newBlocks };
                                    onUpdateSections?.([{ ...section, containers: cs }]);
                                  }}
                                >
                                  Move Up
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  disabled={bIdx === cBlocks.length - 1}
                                  onSelect={() => {
                                    if (!section) return;
                                    const newBlocks = [...cBlocks];
                                    [newBlocks[bIdx + 1], newBlocks[bIdx]] = [newBlocks[bIdx], newBlocks[bIdx + 1]];
                                    const cs = [...containers];
                                    cs[cIdx] = { ...container, blocks: newBlocks };
                                    onUpdateSections?.([{ ...section, containers: cs }]);
                                  }}
                                >
                                  Move Down
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onSelect={() => {
                                    if (!section) return;
                                    const cs = [...containers];
                                    cs[cIdx] = { ...container, blocks: cBlocks.filter((_, i) => i !== bIdx) };
                                    onUpdateSections?.([{ ...section, containers: cs }]);
                                  }}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        );
                      })}
                  </div>
                );
              })}
              {onAddSectionToGroup && (
                <div className="my-4 px-10">
                  <button
                    className="layer-add-btn"
                    onClick={onAddSectionToGroup}
                  >
                    Add Container
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    );
  };

  return (
    <div className="page-layers">
      <div className="page-layers-tree">
        {/* Header (shared) — pinned top */}
        {renderSharedGroup(
          "header",
          headerLabel,
          headerSections || [],
          headerAssigned,
          onSelectHeader,
          onAddHeaderSection,
          onUpdateHeaderSections,
        )}

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
                {containers.length > 0 ? (
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
                ) : (
                  <span className="layer-toggle" />
                )}
                <Box className="layer-type-icon" />
                <EditableLayerLabel
                  className="layer-label"
                  value={getSectionLabel(section, sectionIndex)}
                  onCommit={(next) => onRenameSection?.(sectionIndex, next)}
                  isEditing={renamingKey === sectionKey}
                  onEditingChange={(editing) =>
                    setRenamingKey(editing ? sectionKey : null)
                  }
                />
                <span className="layer-badge">
                  {containers.reduce(
                    (sum, c) => sum + (c.blocks?.length ?? 0),
                    0,
                  )}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="layer-action"
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      title="More actions"
                    >
                      <MoreHorizontal className="size-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onSelect={() => onAddContainer?.(sectionIndex)}
                    >
                      Add Container
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => setRenamingKey(sectionKey)}
                    >
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => onDuplicateSection?.(sectionIndex)}
                    >
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      disabled={sectionIndex === 0}
                      onSelect={() => onMoveSectionUp?.(sectionIndex)}
                    >
                      Move Up
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={sectionIndex === sections.length - 1}
                      onSelect={() => onMoveSectionDown?.(sectionIndex)}
                    >
                      Move Down
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() =>
                        setSaveToLibrary({
                          section: sections[sectionIndex],
                          index: sectionIndex,
                        })
                      }
                    >
                      Save to Library
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onSelect={() => onDeleteSection?.(sectionIndex)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                        {blocks.length > 0 ? (
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
                        ) : (
                          <span className="layer-toggle" />
                        )}
                        <LayoutGrid className="layer-type-icon" />
                        <EditableLayerLabel
                          className="layer-label"
                          value={getContainerLabel(container, containerIndex)}
                          onCommit={(next) =>
                            onRenameContainer?.(
                              sectionIndex,
                              containerIndex,
                              next,
                            )
                          }
                          isEditing={renamingKey === containerKey}
                          onEditingChange={(editing) =>
                            setRenamingKey(editing ? containerKey : null)
                          }
                        />
                        <span className="layer-badge">{blocks.length}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="layer-action"
                              onClick={(e) => e.stopPropagation()}
                              onPointerDown={(e) => e.stopPropagation()}
                              title="More actions"
                            >
                              <MoreHorizontal className="size-3.5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              onSelect={() =>
                                setAddBlockTarget({
                                  sectionIndex,
                                  containerIndex,
                                  scope: "container",
                                })
                              }
                            >
                              Add Block
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onSelect={() =>
                                setRenamingKey(containerKey)
                              }
                            >
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() =>
                                onDuplicateContainer?.(
                                  sectionIndex,
                                  containerIndex,
                                )
                              }
                            >
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              disabled={containerIndex === 0}
                              onSelect={() =>
                                onMoveContainerUp?.(
                                  sectionIndex,
                                  containerIndex,
                                )
                              }
                            >
                              Move Up
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={
                                containerIndex === containers.length - 1
                              }
                              onSelect={() =>
                                onMoveContainerDown?.(
                                  sectionIndex,
                                  containerIndex,
                                )
                              }
                            >
                              Move Down
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onSelect={() =>
                                onDeleteContainer?.(
                                  sectionIndex,
                                  containerIndex,
                                )
                              }
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Block rows — sortable via drag and drop */}
                      {!isContainerCollapsed && (
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={(event: DragEndEvent) => {
                            const { active, over } = event;
                            if (!over || active.id === over.id) return;
                            const fromIdx = blocks.findIndex(
                              (b) => b._key === active.id,
                            );
                            const toIdx = blocks.findIndex(
                              (b) => b._key === over.id,
                            );
                            if (fromIdx !== -1 && toIdx !== -1) {
                              onBlockReorder?.(
                                sectionIndex,
                                containerIndex,
                                fromIdx,
                                toIdx,
                              );
                            }
                          }}
                        >
                          <SortableContext
                            items={blocks.map((b) => b._key)}
                            strategy={verticalListSortingStrategy}
                          >
                            {blocks.map((block, blockIndex) => {
                              const Icon = blockIcons[block._type] || Box;
                              const blockData = block.data as
                                | Record<string, unknown>
                                | undefined;
                              const nestedBlocks =
                                ((block.blocks ?? blockData?.blocks) as
                                  | Block[]
                                  | undefined) ?? [];
                              const isBox =
                                block._type === "container-block";
                              const isBoxCollapsed =
                                isBox && collapsed.has(block._key);

                              return (
                                <React.Fragment key={block._key}>
                                  <SortableBlockItem id={block._key}>
                                    <div
                                      className={cn(
                                        "layer-item",
                                        isBox
                                          ? "layer-item-box"
                                          : "layer-item-block",
                                        selectedKey === block._key &&
                                          "is-selected",
                                        hoveredKey === block._key &&
                                          "is-hovered",
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
                                      {isBox && nestedBlocks.length > 0 && (
                                        <button
                                          className="layer-toggle"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleCollapse(block._key);
                                          }}
                                        >
                                          {isBoxCollapsed ? (
                                            <ChevronRight className="layer-toggle-icon" />
                                          ) : (
                                            <ChevronDown className="layer-toggle-icon" />
                                          )}
                                        </button>
                                      )}
                                      <Icon className="layer-type-icon" />
                                      <EditableLayerLabel
                                        className="layer-label"
                                        value={getBlockLabel(block)}
                                        onCommit={(next) =>
                                          onRenameBlock?.(
                                            sectionIndex,
                                            containerIndex,
                                            blockIndex,
                                            next,
                                          )
                                        }
                                        isEditing={renamingKey === block._key}
                                        onEditingChange={(editing) =>
                                          setRenamingKey(
                                            editing ? block._key : null,
                                          )
                                        }
                                      />
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <button
                                            className="layer-action layer-action-overflow"
                                            onClick={(e) => e.stopPropagation()}
                                            title="More actions"
                                          >
                                            <MoreHorizontal className="size-3.5" />
                                          </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                          align="end"
                                          className="w-44"
                                        >
                                          {isBox && (
                                            <>
                                              <DropdownMenuItem
                                                onSelect={() =>
                                                  setAddBlockTarget({
                                                    sectionIndex,
                                                    containerIndex,
                                                    scope: "box",
                                                    blockIndex,
                                                  })
                                                }
                                              >
                                                Add Block
                                              </DropdownMenuItem>
                                              <DropdownMenuSeparator />
                                            </>
                                          )}
                                          <DropdownMenuItem
                                            onSelect={() =>
                                              setRenamingKey(block._key)
                                            }
                                          >
                                            Rename
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onSelect={() =>
                                              onDuplicateBlock?.(
                                                sectionIndex,
                                                containerIndex,
                                                blockIndex,
                                              )
                                            }
                                          >
                                            Duplicate
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem
                      disabled={blockIndex === 0}
                                            onSelect={() =>
                                              onMoveBlockUp?.(
                                                sectionIndex,
                                                containerIndex,
                                                blockIndex,
                                              )
                                            }
                                          >
                                            Move Up
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                      disabled={
                                              blockIndex === blocks.length - 1
                                            }
                                            onSelect={() =>
                                              onMoveBlockDown?.(
                                                sectionIndex,
                                                containerIndex,
                                                blockIndex,
                                              )
                                            }
                                          >
                                            Move Down
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem
                      className="text-red-600"
                                            onSelect={() =>
                                              onDeleteBlock?.(
                                                sectionIndex,
                                                containerIndex,
                                                blockIndex,
                                              )
                                            }
                                          >
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                    {/* Nested blocks (for container-type blocks) — collapsible */}
                                    {nestedBlocks.length > 0 &&
                                      !isBoxCollapsed &&
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
                                            <EditableLayerLabel
                                              className="layer-label"
                                              value={getBlockLabel(childBlock)}
                                              onCommit={(next) =>
                                                onRenameBlock?.(
                                                  sectionIndex,
                                                  containerIndex,
                                                  blockIndex,
                                                  next,
                                                )
                                              }
                                              isEditing={
                                                renamingKey === childBlock._key
                                              }
                                              onEditingChange={(editing) =>
                                                setRenamingKey(
                                                  editing
                                                    ? childBlock._key
                                                    : null,
                                                )
                                              }
                                            />
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <button
                                                  className="layer-action"
                                                  onClick={(e) =>
                                                    e.stopPropagation()
                                                  }
                                                  onPointerDown={(e) =>
                                                    e.stopPropagation()
                                                  }
                                                  title="More actions"
                                                >
                                                  <MoreHorizontal className="size-3.5" />
                                                </button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent
                                                align="end"
                                                className="w-44"
                                              >
                                                <DropdownMenuItem
                                                  onSelect={() =>
                                                    setRenamingKey(
                                                      childBlock._key,
                                                    )
                                                  }
                                                >
                                                  Rename
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                  onSelect={() =>
                                                    onDuplicateBlock?.(
                                                      sectionIndex,
                                                      containerIndex,
                                                      blockIndex,
                                                    )
                                                  }
                                                >
                                                  Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                  disabled={
                                                    nestedBlocks.indexOf(
                                                      childBlock,
                                                    ) === 0
                                                  }
                                                  onSelect={() =>
                                                    onMoveBlockUp?.(
                                                      sectionIndex,
                                                      containerIndex,
                                                      blockIndex,
                                                    )
                                                  }
                                                >
                                                  Move Up
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                  disabled={
                                                    nestedBlocks.indexOf(
                                                      childBlock,
                                                    ) ===
                                                    nestedBlocks.length - 1
                                                  }
                                                  onSelect={() =>
                                                    onMoveBlockDown?.(
                                                      sectionIndex,
                                                      containerIndex,
                                                      blockIndex,
                                                    )
                                                  }
                                                >
                                                  Move Down
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                  className="text-red-600"
                                                  onSelect={() =>
                                                    onDeleteBlock?.(
                                                      sectionIndex,
                                                      containerIndex,
                                                      blockIndex,
                                                    )
                                                  }
                                                >
                                                  Delete
                                                </DropdownMenuItem>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </div>
                                        );
                                      })}
                                  </SortableBlockItem>
                                </React.Fragment>
                              );
                            })}
                          </SortableContext>
                        </DndContext>
                      )}
                    </div>
                  );
                })}
            </div>
          );
        })}
        {onAddSection && (
          <div className="mt-4 px-10">
            <button className="layer-add-btn" onClick={onAddSection}>
              Add Page Section
            </button>
          </div>
        )}

        {/* Footer (shared) — pinned bottom */}
        {renderSharedGroup(
          "footer",
          footerLabel,
          footerSections || [],
          footerAssigned,
          onSelectFooter,
          onAddFooterSection,
          onUpdateFooterSections,
        )}
      </div>

      {/* Save to Library dialog */}
      {tenantId && (
        <SaveToLibraryDialog
          tenantId={tenantId}
          open={!!saveToLibrary}
          onOpenChange={(open) => !open && setSaveToLibrary(null)}
          type="SECTION"
          content={
            saveToLibrary
              ? (saveToLibrary.section as unknown as Record<string, unknown>)
              : {}
          }
          defaultName={
            saveToLibrary ? `Section ${saveToLibrary.index + 1}` : ""
          }
        />
      )}

      <BlockPickerDialog
        open={!!addBlockTarget}
        onOpenChange={(open) => !open && setAddBlockTarget(null)}
        title={
          addBlockTarget?.scope === "box"
            ? "Add a block inside this box"
            : "Add a block to this container"
        }
        excludeTypes={
          addBlockTarget?.scope === "box" ? ["container-block"] : undefined
        }
        onAddBlock={(blockType) => {
          if (!addBlockTarget) return;
          if (
            addBlockTarget.scope === "box" &&
            addBlockTarget.blockIndex !== undefined
          ) {
            onAddBlockToBox?.(
              addBlockTarget.sectionIndex,
              addBlockTarget.containerIndex,
              addBlockTarget.blockIndex,
              blockType,
            );
          } else {
            onAddBlock?.(
              addBlockTarget.sectionIndex,
              addBlockTarget.containerIndex,
              blockType,
            );
          }
          setAddBlockTarget(null);
        }}
      />
    </div>
  );
}
