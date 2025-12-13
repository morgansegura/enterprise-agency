"use client";

import * as React from "react";
// import { useRouter } from "next/navigation";
import {
  usePage,
  useUpdatePage,
  usePublishPage,
  useUnpublishPage,
  type Section,
  type Block,
} from "@/lib/hooks/use-pages";
import { PageEditorLayout, PageSettingsDrawer } from "@/components/editor";
import { PageRenderer } from "@/components/renderers/page-renderer";
import { Card, CardContent } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortableBlockItem } from "@/components/blocks/sortable-block-item";
import { SortableSection } from "@/components/editor/sortable-section";
import { GlobalSettingsDrawer } from "@/components/editor/global-settings-drawer";
import { ResponsivePreview } from "@/components/editor/responsive-preview";
import { type Breakpoint } from "@/components/editor/breakpoint-selector";
import { blockRegistry } from "@/lib/editor";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { ResponsiveProvider } from "@/lib/responsive/context";
import { useIsBuilder } from "@/lib/hooks/use-tier";
import { usePreviewMode } from "@/lib/context/preview-mode-context";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function EditPagePage({
  params,
}: {
  params: Promise<{ id: string; pageId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id, pageId } = resolvedParams;
  // const router = useRouter();
  const { data: page, isLoading, error } = usePage(id, pageId);
  const isBuilder = useIsBuilder(id);
  const updatePage = useUpdatePage(id);
  const publishPage = usePublishPage(id);
  const unpublishPage = useUnpublishPage(id);

  // Drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Initialize sections from page content or create default
  const [sections, setSections] = React.useState<Section[]>([]);

  // Breakpoint state for responsive preview
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>("desktop");

  // Modal states
  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false);
  const [globalSettingsOpen, setGlobalSettingsOpen] = React.useState(false);

  // Preview mode from context (controls parent layout visibility)
  const { isPreviewMode: previewMode, togglePreviewMode, setPageContext } = usePreviewMode();

  // Selection state for WYSIWYG editing
  const [selectedBlockKey, setSelectedBlockKey] = React.useState<string | null>(
    null,
  );

  // Hover state for layers popover
  const [hoveredBlockKey, setHoveredBlockKey] = React.useState<string | null>(
    null,
  );

  // Local page state for editing
  const [localPage, setLocalPage] = React.useState({
    title: "",
    slug: "",
    status: "draft",
    template: "default",
    seo: undefined as import("@/lib/hooks/use-pages").PageSeo | undefined,
  });

  // Sync sections with page data
  React.useEffect(() => {
    if (page?.content?.sections) {
      setSections(page.content.sections as Section[]);
    } else {
      // Create default section if none exists
      setSections([
        {
          _type: "section",
          _key: `section-${Date.now()}`,
          blocks: [],
        },
      ]);
    }
  }, [page]);

  // Sync local page state with fetched page data
  React.useEffect(() => {
    if (page) {
      setLocalPage({
        title: page.title,
        slug: page.slug,
        status: page.status || "draft",
        template: page.template || "default",
        seo: page.seo,
      });
    }
  }, [page]);

  // Set page context for header display
  React.useEffect(() => {
    const title = localPage.title || page?.title || "Untitled";
    setPageContext({ type: "Page", title });

    // Clear context when unmounting
    return () => setPageContext(null);
  }, [localPage.title, page?.title, setPageContext]);

  // Listen for block additions from BlocksLibrary
  React.useEffect(() => {
    const handleAddBlock = (event: Event) => {
      const customEvent = event as CustomEvent<{
        blockId: string;
        blockType: string;
      }>;
      const { blockType } = customEvent.detail;

      // Create new block based on type
      const newBlock = createDefaultBlock(blockType);

      // Add to first section (for now)
      setSections((prevSections) => {
        const updatedSections = [...prevSections];
        if (updatedSections.length === 0) {
          updatedSections.push({
            _type: "section",
            _key: `section-${Date.now()}`,
            blocks: [newBlock],
          });
        } else {
          updatedSections[0] = {
            ...updatedSections[0],
            blocks: [...updatedSections[0].blocks, newBlock],
          };
        }
        return updatedSections;
      });

      toast.success("Block added!");
    };

    window.addEventListener("add-block", handleAddBlock);
    return () => window.removeEventListener("add-block", handleAddBlock);
  }, []);

  if (isLoading) return <div>Loading page...</div>;
  if (error) return <div>Error loading page: {error.message}</div>;
  if (!page) return <div>Page not found</div>;

  const handleSave = () => {
    updatePage.mutate({
      id: pageId,
      data: {
        title: localPage.title,
        slug: localPage.slug,
        status: localPage.status,
        template: localPage.template,
        seo: localPage.seo,
        content: {
          sections,
        },
      },
    });
  };

  const handlePublish = async () => {
    const isCurrentlyPublished = page?.status === "published";

    if (isCurrentlyPublished) {
      // Unpublish
      if (
        confirm("Unpublish this page? It will no longer be visible publicly.")
      ) {
        unpublishPage.mutate(pageId, {
          onSuccess: () => {
            toast.success("Page unpublished");
          },
          onError: () => {
            toast.error("Failed to unpublish page");
          },
        });
      }
    } else {
      // Save first, then publish
      const confirmed = confirm(
        "Publish this page? It will be visible to the public.",
      );
      if (!confirmed) return;

      try {
        // Save current changes
        await updatePage.mutateAsync({
          id: pageId,
          data: {
            title: localPage.title,
            slug: localPage.slug,
            status: localPage.status,
            template: localPage.template,
            seo: localPage.seo,
            content: {
              sections,
            },
          },
        });

        // Then publish
        publishPage.mutate(pageId, {
          onSuccess: () => {
            toast.success("Page published successfully!");
          },
          onError: () => {
            toast.error("Failed to publish page");
          },
        });
      } catch (error) {
        toast.error("Failed to save changes");
      }
    }
  };

  const handlePageChange = (field: string, value: unknown) => {
    setLocalPage((prev) => ({
      ...prev,
      [field]: value,
    }));
    logger.debug("Page field changed", { field, value });
  };

  const handlePreview = () => {
    // Toggle preview mode (hides parent layout chrome via context)
    togglePreviewMode();
    // Clear selection when entering preview mode
    if (!previewMode) {
      setSelectedBlockKey(null);
    }
  };

  const handleBlockChange = (
    sectionIndex: number,
    blockIndex: number,
    updatedBlock: Block,
  ) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        blocks: updatedSections[sectionIndex].blocks.map((block, idx) =>
          idx === blockIndex ? updatedBlock : block,
        ),
      };
      return updatedSections;
    });
  };

  const handleBlockDelete = (sectionIndex: number, blockIndex: number) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        blocks: updatedSections[sectionIndex].blocks.filter(
          (_, idx) => idx !== blockIndex,
        ),
      };
      return updatedSections;
    });
    setSelectedBlockKey(null);
    toast.success("Block deleted");
  };

  const handleBlockDuplicate = (sectionIndex: number, blockIndex: number) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const block = updatedSections[sectionIndex].blocks[blockIndex];
      const duplicatedBlock = {
        ...block,
        _key: `block-${Date.now()}`,
      };
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        blocks: [
          ...updatedSections[sectionIndex].blocks.slice(0, blockIndex + 1),
          duplicatedBlock,
          ...updatedSections[sectionIndex].blocks.slice(blockIndex + 1),
        ],
      };
      return updatedSections;
    });
    toast.success("Block duplicated");
  };

  const handleBlockMoveUp = (sectionIndex: number, blockIndex: number) => {
    if (blockIndex === 0) return;
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const blocks = [...updatedSections[sectionIndex].blocks];
      [blocks[blockIndex - 1], blocks[blockIndex]] = [
        blocks[blockIndex],
        blocks[blockIndex - 1],
      ];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        blocks,
      };
      return updatedSections;
    });
  };

  const handleBlockMoveDown = (sectionIndex: number, blockIndex: number) => {
    setSections((prevSections) => {
      const section = prevSections[sectionIndex];
      if (blockIndex >= section.blocks.length - 1) return prevSections;
      const updatedSections = [...prevSections];
      const blocks = [...section.blocks];
      [blocks[blockIndex], blocks[blockIndex + 1]] = [
        blocks[blockIndex + 1],
        blocks[blockIndex],
      ];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        blocks,
      };
      return updatedSections;
    });
  };

  // Clear selection when clicking on canvas background
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Check if we clicked on a block wrapper or its children
    const target = e.target as HTMLElement;
    const isBlockClick = target.closest(".block-wrapper");
    const isPanelClick = target.closest(".block-wrapper__panel");
    const isDialogClick = target.closest('[role="dialog"]');
    const isPopoverClick = target.closest(
      "[data-radix-popper-content-wrapper]",
    );

    // Only deselect if not clicking on a block, panel, dialog, or popover
    if (!isBlockClick && !isPanelClick && !isDialogClick && !isPopoverClick) {
      setSelectedBlockKey(null);
    }
  };

  const handleBlockDragEnd = (event: DragEndEvent, sectionIndex: number) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const section = updatedSections[sectionIndex];

      const oldIndex = section.blocks.findIndex(
        (block) => block._key === active.id,
      );
      const newIndex = section.blocks.findIndex(
        (block) => block._key === over.id,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        updatedSections[sectionIndex] = {
          ...section,
          blocks: arrayMove(section.blocks, oldIndex, newIndex),
        };
      }

      return updatedSections;
    });
  };

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setSections((prevSections) => {
      const oldIndex = prevSections.findIndex(
        (section) => section._key === active.id,
      );
      const newIndex = prevSections.findIndex(
        (section) => section._key === over.id,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        return arrayMove(prevSections, oldIndex, newIndex);
      }

      return prevSections;
    });
  };

  const handleSectionChange = (
    sectionIndex: number,
    updatedSection: Section,
  ) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections[sectionIndex] = updatedSection;
      return updatedSections;
    });
  };

  const handleSectionDelete = (sectionIndex: number) => {
    setSections((prevSections) =>
      prevSections.filter((_, idx) => idx !== sectionIndex),
    );
    toast.success("Section deleted");
  };

  const handleAddSection = () => {
    const newSection: Section = {
      _type: "section",
      _key: `section-${Date.now()}`,
      blocks: [],
    };

    setSections((prevSections) => [...prevSections, newSection]);
    toast.success("Section added");
  };

  const handleAddSectionAt = (index: number) => {
    const newSection: Section = {
      _type: "section",
      _key: `section-${Date.now()}`,
      blocks: [],
    };

    setSections((prevSections) => {
      const updated = [...prevSections];
      updated.splice(index, 0, newSection);
      return updated;
    });
    toast.success("Section added");
  };

  const handleSectionDuplicate = (sectionIndex: number) => {
    setSections((prevSections) => {
      const section = prevSections[sectionIndex];
      const duplicated: Section = {
        ...section,
        _key: `section-${Date.now()}`,
        blocks: section.blocks.map((block) => ({
          ...block,
          _key: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        })),
      };
      const updated = [...prevSections];
      updated.splice(sectionIndex + 1, 0, duplicated);
      return updated;
    });
    toast.success("Section duplicated");
  };

  const handleSectionMoveUp = (sectionIndex: number) => {
    if (sectionIndex === 0) return;
    setSections((prevSections) => {
      const updated = [...prevSections];
      [updated[sectionIndex - 1], updated[sectionIndex]] = [
        updated[sectionIndex],
        updated[sectionIndex - 1],
      ];
      return updated;
    });
  };

  const handleSectionMoveDown = (sectionIndex: number) => {
    setSections((prevSections) => {
      if (sectionIndex >= prevSections.length - 1) return prevSections;
      const updated = [...prevSections];
      [updated[sectionIndex], updated[sectionIndex + 1]] = [
        updated[sectionIndex + 1],
        updated[sectionIndex],
      ];
      return updated;
    });
  };

  const handleAddBlockToSection = (sectionIndex: number, blockType: string) => {
    const newBlock = createDefaultBlock(blockType);
    setSections((prevSections) => {
      const updated = [...prevSections];
      updated[sectionIndex] = {
        ...updated[sectionIndex],
        blocks: [...updated[sectionIndex].blocks, newBlock],
      };
      return updated;
    });
    toast.success("Block added!");
  };

  function createDefaultBlock(blockType: string): Block {
    // Use block registry to create default block
    const defaultBlock = blockRegistry.createDefault(blockType);

    if (!defaultBlock) {
      // Fallback if block type not registered
      logger.warn(
        `Block type "${blockType}" not found in registry, using fallback`,
      );
      return {
        _key: `block-${Date.now()}`,
        _type: blockType,
        data: {},
      };
    }

    return defaultBlock;
  }

  // Preview mode - show rendered page without any editor chrome
  if (previewMode) {
    return (
      <div className="min-h-screen bg-background">
        {/* Floating exit button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={handlePreview}
          className="fixed top-4 right-4 z-50 shadow-lg"
        >
          <Eye className="h-4 w-4" />
          Exit Preview
        </Button>

        {/* Pure page render */}
        <PageRenderer
          page={{
            id: pageId,
            title: localPage.title,
            slug: localPage.slug,
            sections,
          }}
          breakpoint={breakpoint}
        />
      </div>
    );
  }

  return (
    <>
      {/* Page Settings Drawer */}
      <PageSettingsDrawer
        open={settingsModalOpen}
        onOpenChange={setSettingsModalOpen}
        page={localPage}
        onChange={handlePageChange}
        onSave={handleSave}
      />

      {/* Global Settings Drawer */}
      <GlobalSettingsDrawer
        open={globalSettingsOpen}
        onOpenChange={setGlobalSettingsOpen}
        tenantId={id}
      />

      <PageEditorLayout
        pageId={pageId}
        breakpoint={breakpoint}
        onBreakpointChange={setBreakpoint}
        onSave={handleSave}
        onPublish={handlePublish}
        onPreview={handlePreview}
        isSaving={updatePage.isPending}
      >
        {/* Canvas Content */}
        <ResponsiveProvider breakpoint={breakpoint} isBuilder={isBuilder}>
          <ResponsivePreview breakpoint={breakpoint} className="h-full">
            <Card
              className="page-editor-canvas-content"
              onClick={handleCanvasClick}
            >
              <CardContent>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleSectionDragEnd}
                >
                  <SortableContext
                    items={sections.map((section) => section._key)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div>
                      {sections.map((section, sectionIndex) => (
                        <SortableSection
                          key={section._key}
                          section={section}
                          onSectionChange={(updatedSection) =>
                            handleSectionChange(sectionIndex, updatedSection)
                          }
                          onDelete={() => handleSectionDelete(sectionIndex)}
                          onAddSectionAbove={() =>
                            handleAddSectionAt(sectionIndex)
                          }
                          onAddSectionBelow={() =>
                            handleAddSectionAt(sectionIndex + 1)
                          }
                          onDuplicate={() =>
                            handleSectionDuplicate(sectionIndex)
                          }
                          onMoveUp={() => handleSectionMoveUp(sectionIndex)}
                          onMoveDown={() => handleSectionMoveDown(sectionIndex)}
                          onAddBlock={(blockType) =>
                            handleAddBlockToSection(sectionIndex, blockType)
                          }
                          selectedBlockKey={selectedBlockKey}
                          onSelectBlock={setSelectedBlockKey}
                          hoveredBlockKey={hoveredBlockKey}
                          onHoverBlock={setHoveredBlockKey}
                          isFirst={sectionIndex === 0}
                          isLast={sectionIndex === sections.length - 1}
                        >
                          {section.blocks.length === 0 ? (
                            <div className="min-h-[60px]" />
                          ) : (
                            <DndContext
                              sensors={sensors}
                              collisionDetection={closestCenter}
                              onDragEnd={(event) =>
                                handleBlockDragEnd(event, sectionIndex)
                              }
                            >
                              <SortableContext
                                items={section.blocks.map(
                                  (block) => block._key,
                                )}
                                strategy={verticalListSortingStrategy}
                              >
                                <div className="space-y-4">
                                  {section.blocks.map((block, blockIndex) => (
                                    <SortableBlockItem
                                      key={block._key}
                                      block={block}
                                      onChange={(updatedBlock) =>
                                        handleBlockChange(
                                          sectionIndex,
                                          blockIndex,
                                          updatedBlock,
                                        )
                                      }
                                      onDelete={() =>
                                        handleBlockDelete(
                                          sectionIndex,
                                          blockIndex,
                                        )
                                      }
                                      onDuplicate={() =>
                                        handleBlockDuplicate(
                                          sectionIndex,
                                          blockIndex,
                                        )
                                      }
                                      tenantId={id}
                                      isSelected={
                                        selectedBlockKey === block._key
                                      }
                                      isHovered={hoveredBlockKey === block._key}
                                      onSelect={() =>
                                        setSelectedBlockKey(block._key)
                                      }
                                    />
                                  ))}
                                </div>
                              </SortableContext>
                            </DndContext>
                          )}
                        </SortableSection>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                {/* Debug: Show content data */}
                <details className="fixed bottom-8 left-18 flex">
                  <pre className="absolute bottom-11 left-0 w-screen max-w-6xl mt-2 p-4 bg-muted text-xs overflow-auto max-h-96 rounded-md">
                    {JSON.stringify({ sections }, null, 2)}
                  </pre>
                  <summary className="cursor-pointer text-sm font-medium border p-2 rounded-md">
                    Content Data (Debug)
                  </summary>
                </details>
              </CardContent>
            </Card>
          </ResponsivePreview>
        </ResponsiveProvider>
      </PageEditorLayout>
    </>
  );
}
