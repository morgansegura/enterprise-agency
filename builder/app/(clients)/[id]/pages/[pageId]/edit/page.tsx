"use client";

import * as React from "react";
// import { useRouter } from "next/navigation";
import {
  usePage,
  useUpdatePage,
  usePublishPage,
  useUnpublishPage,
  useCreatePreviewToken,
  usePageVersions,
  useRestorePageVersion,
  type Section,
  type Block,
  type Container,
  type PageSeo,
} from "@/lib/hooks/use-pages";
import { useAutoSave } from "@/lib/hooks/use-auto-save";
import {
  PageEditorLayout,
  PageSettingsDrawer,
  EditableHeader,
  SettingsPanel,
} from "@/components/editor";
import { PageRenderer } from "@/components/renderers/page-renderer";
import { HeaderRenderer } from "@/components/headers";
import { Card, CardContent } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortableBlockItem } from "@/components/blocks/sortable-block-item";
import { SortableSection } from "@/components/editor/sortable-section";
import { ResponsivePreview } from "@/components/editor/responsive-preview";
import { type Breakpoint } from "@/components/editor/breakpoint-selector";
import { blockRegistry } from "@/lib/editor";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { ResponsiveProvider } from "@/lib/responsive/context";
import { useIsBuilder } from "@/lib/hooks/use-tier";
import { usePreviewMode } from "@/lib/context/preview-mode-context";
import { BlockEditorProvider } from "@/components/editor/block-editor-context";
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

/**
 * Create a default container with empty blocks
 */
function createDefaultContainer(): Container {
  return {
    _type: "container",
    _key: `container-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    layout: { type: "stack", gap: "md" },
    blocks: [],
  };
}

/**
 * Create a default section with one container
 */
function createDefaultSection(): Section {
  return {
    _type: "section",
    _key: `section-${Date.now()}`,
    containers: [createDefaultContainer()],
  };
}

/**
 * Get blocks from a specific container in a section
 */
function getContainerBlocks(section: Section, containerIndex: number): Block[] {
  return section.containers?.[containerIndex]?.blocks ?? [];
}

/**
 * Update blocks in a specific container
 */
function updateContainerBlocks(
  section: Section,
  containerIndex: number,
  blocks: Block[],
): Section {
  const containers = section.containers ?? [createDefaultContainer()];
  const newContainers = [...containers];
  if (newContainers[containerIndex]) {
    newContainers[containerIndex] = {
      ...newContainers[containerIndex],
      blocks,
    };
  }
  return { ...section, containers: newContainers };
}

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
  const createPreviewToken = useCreatePreviewToken(id);
  const { data: versions = [] } = usePageVersions(id, pageId);
  const restoreVersion = useRestorePageVersion(id);

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

  // Preview mode from context (controls parent layout visibility)
  const {
    isPreviewMode: previewMode,
    togglePreviewMode,
    setPageContext,
  } = usePreviewMode();

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
    seo: undefined as PageSeo | undefined,
    headerId: null as string | null,
    footerId: null as string | null,
    isHomePage: false,
  });

  // Auto-save hook
  const autoSave = useAutoSave({
    tenantId: id,
    pageId,
    debounceMs: 3000,
    onSaveSuccess: () => {
      toast.success("Changes saved", { duration: 2000 });
    },
    onSaveError: (error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  // Sync sections with page data
  React.useEffect(() => {
    if (page?.content?.sections) {
      setSections(page.content.sections as Section[]);
    } else {
      // Create default section if none exists
      setSections([createDefaultSection()]);
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
        headerId: page.headerId || null,
        footerId: page.footerId || null,
        isHomePage: page.isHomePage || false,
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

  // Track if initial load is complete to avoid auto-saving on mount
  const initialLoadRef = React.useRef(true);

  // Store autoSave functions in refs to avoid stale closures
  const saveRef = React.useRef(autoSave.save);
  const saveNowRef = React.useRef(autoSave.saveNow);
  React.useEffect(() => {
    saveRef.current = autoSave.save;
    saveNowRef.current = autoSave.saveNow;
  }, [autoSave.save, autoSave.saveNow]);

  // Keyboard shortcut: Cmd+S / Ctrl+S to save
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        saveNowRef.current({
          title: localPage.title,
          slug: localPage.slug,
          template: localPage.template,
          seo: localPage.seo,
          headerId: localPage.headerId,
          footerId: localPage.footerId,
          isHomePage: localPage.isHomePage,
          sections,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [localPage, sections]);

  // Trigger auto-save when content changes (after initial load)
  React.useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    // Debounced save of current page state
    saveRef.current({
      title: localPage.title,
      slug: localPage.slug,
      template: localPage.template,
      seo: localPage.seo,
      headerId: localPage.headerId,
      footerId: localPage.footerId,
      isHomePage: localPage.isHomePage,
      sections,
    });
  }, [
    sections,
    localPage.title,
    localPage.slug,
    localPage.template,
    localPage.seo,
    localPage.headerId,
    localPage.footerId,
    localPage.isHomePage,
  ]);

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

      // Add to first section's first container
      setSections((prevSections) => {
        const updatedSections = [...prevSections];
        if (updatedSections.length === 0) {
          const newSection = createDefaultSection();
          newSection.containers[0].blocks = [newBlock];
          updatedSections.push(newSection);
        } else {
          // Add to first section's first container
          const blocks = getContainerBlocks(updatedSections[0], 0);
          updatedSections[0] = updateContainerBlocks(updatedSections[0], 0, [
            ...blocks,
            newBlock,
          ]);
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
    // Use autoSave.saveNow to ensure lastSaved timestamp is updated
    autoSave.saveNow({
      title: localPage.title,
      slug: localPage.slug,
      template: localPage.template,
      seo: localPage.seo,
      headerId: localPage.headerId,
      footerId: localPage.footerId,
      isHomePage: localPage.isHomePage,
      sections,
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
        // Save current changes (don't send status - publish will set it)
        await updatePage.mutateAsync({
          id: pageId,
          data: {
            title: localPage.title,
            slug: localPage.slug,
            template: localPage.template,
            seo: localPage.seo,
            headerId: localPage.headerId,
            footerId: localPage.footerId,
            isHomePage: localPage.isHomePage,
            sections,
          },
        });

        // Then publish (await to ensure it completes)
        await publishPage.mutateAsync(pageId);
        toast.success("Page published successfully!");
      } catch {
        toast.error("Failed to publish page");
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

  const handleUnpublish = () => {
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
  };

  const handleGeneratePreviewLink = async () => {
    // Flush any pending saves first
    autoSave.flush();

    try {
      const result = await createPreviewToken.mutateAsync({
        contentType: "page",
        contentId: pageId,
        expiresInHours: 168, // 7 days
      });

      // Copy to clipboard
      await navigator.clipboard.writeText(result.previewUrl);
      toast.success("Preview link copied to clipboard!");
    } catch {
      toast.error("Failed to generate preview link");
    }
  };

  const handleBlockChange = (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
    updatedBlock: Block,
  ) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const blocks = getContainerBlocks(
        updatedSections[sectionIndex],
        containerIndex,
      );
      const newBlocks = blocks.map((block: Block, idx: number) =>
        idx === blockIndex ? updatedBlock : block,
      );
      updatedSections[sectionIndex] = updateContainerBlocks(
        updatedSections[sectionIndex],
        containerIndex,
        newBlocks,
      );
      return updatedSections;
    });
  };

  const handleBlockDelete = (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
  ) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const blocks = getContainerBlocks(
        updatedSections[sectionIndex],
        containerIndex,
      );
      const newBlocks = blocks.filter(
        (_: Block, idx: number) => idx !== blockIndex,
      );
      updatedSections[sectionIndex] = updateContainerBlocks(
        updatedSections[sectionIndex],
        containerIndex,
        newBlocks,
      );
      return updatedSections;
    });
    setSelectedBlockKey(null);
    toast.success("Block deleted");
  };

  const handleBlockDuplicate = (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
  ) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const blocks = getContainerBlocks(
        updatedSections[sectionIndex],
        containerIndex,
      );
      const block = blocks[blockIndex];
      const duplicatedBlock = {
        ...block,
        _key: `block-${Date.now()}`,
      };
      const newBlocks = [
        ...blocks.slice(0, blockIndex + 1),
        duplicatedBlock,
        ...blocks.slice(blockIndex + 1),
      ];
      updatedSections[sectionIndex] = updateContainerBlocks(
        updatedSections[sectionIndex],
        containerIndex,
        newBlocks,
      );
      return updatedSections;
    });
    toast.success("Block duplicated");
  };

  const handleBlockMoveUp = (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
  ) => {
    if (blockIndex === 0) return;
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const blocks = [
        ...getContainerBlocks(updatedSections[sectionIndex], containerIndex),
      ];
      [blocks[blockIndex - 1], blocks[blockIndex]] = [
        blocks[blockIndex],
        blocks[blockIndex - 1],
      ];
      updatedSections[sectionIndex] = updateContainerBlocks(
        updatedSections[sectionIndex],
        containerIndex,
        blocks,
      );
      return updatedSections;
    });
  };

  const handleBlockMoveDown = (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
  ) => {
    setSections((prevSections) => {
      const blocks = getContainerBlocks(
        prevSections[sectionIndex],
        containerIndex,
      );
      if (blockIndex >= blocks.length - 1) return prevSections;
      const updatedSections = [...prevSections];
      const newBlocks = [...blocks];
      [newBlocks[blockIndex], newBlocks[blockIndex + 1]] = [
        newBlocks[blockIndex + 1],
        newBlocks[blockIndex],
      ];
      updatedSections[sectionIndex] = updateContainerBlocks(
        updatedSections[sectionIndex],
        containerIndex,
        newBlocks,
      );
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

  const handleBlockDragEnd = (
    event: DragEndEvent,
    sectionIndex: number,
    containerIndex: number,
  ) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const blocks = getContainerBlocks(
        updatedSections[sectionIndex],
        containerIndex,
      );

      const oldIndex = blocks.findIndex(
        (block: Block) => block._key === active.id,
      );
      const newIndex = blocks.findIndex(
        (block: Block) => block._key === over.id,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newBlocks = arrayMove(blocks, oldIndex, newIndex);
        updatedSections[sectionIndex] = updateContainerBlocks(
          updatedSections[sectionIndex],
          containerIndex,
          newBlocks,
        );
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

  const handleAddSectionAt = (index: number) => {
    const newSection = createDefaultSection();

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
      // Duplicate all containers with new keys
      const duplicatedContainers = (section.containers ?? []).map(
        (container, idx) => ({
          ...container,
          _key: `container-${Date.now()}-${idx}`,
          blocks: (container.blocks ?? []).map((block: Block) => ({
            ...block,
            _key: `block-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
          })),
        }),
      );
      const duplicated: Section = {
        ...section,
        _key: `section-${Date.now()}`,
        containers: duplicatedContainers,
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

  const handleAddBlockToContainer = (
    sectionIndex: number,
    containerIndex: number,
    blockType: string,
  ) => {
    const newBlock = createDefaultBlock(blockType);
    setSections((prevSections) => {
      const updated = [...prevSections];
      const blocks = getContainerBlocks(updated[sectionIndex], containerIndex);
      updated[sectionIndex] = updateContainerBlocks(
        updated[sectionIndex],
        containerIndex,
        [...blocks, newBlock],
      );
      return updated;
    });
    toast.success("Block added!");
  };

  const handleAddContainerToSection = (sectionIndex: number) => {
    const newContainer = createDefaultContainer();
    setSections((prevSections) => {
      const updated = [...prevSections];
      const containers = updated[sectionIndex].containers ?? [];
      updated[sectionIndex] = {
        ...updated[sectionIndex],
        containers: [...containers, newContainer],
      };
      return updated;
    });
    toast.success("Container added!");
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

        {/* Header */}
        <HeaderRenderer tenantId={id} headerId={localPage.headerId} />

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
        tenantId={id}
        pageId={pageId}
        page={localPage}
        onChange={handlePageChange}
        onSave={handleSave}
      />

      <PageEditorLayout
        pageId={pageId}
        breakpoint={breakpoint}
        onBreakpointChange={setBreakpoint}
        onSave={handleSave}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        onPreview={handlePreview}
        onGeneratePreviewLink={handleGeneratePreviewLink}
        versions={versions}
        onRestoreVersion={(versionId) => {
          restoreVersion.mutate(
            { pageId, versionId },
            {
              onSuccess: () =>
                toast.success("Page restored to previous version"),
              onError: () => toast.error("Failed to restore version"),
            },
          );
        }}
        onViewAllHistory={() => {
          // TODO: Open full history modal/drawer
          toast.info("Full history view coming soon");
        }}
        isSaving={autoSave.isSaving || updatePage.isPending}
        isPublished={localPage.status === "published"}
        hasUnsavedChanges={autoSave.hasUnsavedChanges}
        lastSaved={autoSave.lastSaved}
        rightPanel={
          <SettingsPanel
            sections={sections}
            onSectionChange={handleSectionChange}
            onContainerChange={(sectionIndex, containerIndex, container) => {
              setSections((prevSections) => {
                const updated = [...prevSections];
                const containers = [
                  ...(updated[sectionIndex].containers ?? []),
                ];
                containers[containerIndex] = container;
                updated[sectionIndex] = {
                  ...updated[sectionIndex],
                  containers,
                };
                return updated;
              });
            }}
            onBlockChange={(
              sectionIndex,
              containerIndex,
              blockIndex,
              block,
            ) => {
              handleBlockChange(
                sectionIndex,
                containerIndex,
                blockIndex,
                block,
              );
            }}
          />
        }
      >
        {/* Canvas Content */}
        <BlockEditorProvider>
          <ResponsiveProvider breakpoint={breakpoint} isBuilder={isBuilder}>
            <ResponsivePreview breakpoint={breakpoint} className="h-full">
              <Card
                className="page-editor-canvas-content"
                onClick={handleCanvasClick}
              >
                <CardContent>
                  {/* Editable Header */}
                  <EditableHeader
                    tenantId={id}
                    headerId={localPage.headerId}
                    onHeaderChange={(headerId) =>
                      handlePageChange("headerId", headerId)
                    }
                  />

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
                            sectionIndex={sectionIndex}
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
                            onMoveDown={() =>
                              handleSectionMoveDown(sectionIndex)
                            }
                            onAddContainer={() =>
                              handleAddContainerToSection(sectionIndex)
                            }
                            selectedBlockKey={selectedBlockKey}
                            onSelectBlock={setSelectedBlockKey}
                            hoveredBlockKey={hoveredBlockKey}
                            onHoverBlock={setHoveredBlockKey}
                            isFirst={sectionIndex === 0}
                            isLast={sectionIndex === sections.length - 1}
                            onAddBlockToContainer={(
                              containerIndex: number,
                              blockType: string,
                            ) =>
                              handleAddBlockToContainer(
                                sectionIndex,
                                containerIndex,
                                blockType,
                              )
                            }
                            renderContainerBlocks={(
                              containerIndex: number,
                              container: Container,
                            ) => {
                              const blocks = container.blocks ?? [];
                              if (blocks.length === 0) {
                                return null;
                              }
                              return (
                                <DndContext
                                  sensors={sensors}
                                  collisionDetection={closestCenter}
                                  onDragEnd={(event) =>
                                    handleBlockDragEnd(
                                      event,
                                      sectionIndex,
                                      containerIndex,
                                    )
                                  }
                                >
                                  <SortableContext
                                    items={blocks.map(
                                      (block: Block) => block._key,
                                    )}
                                    strategy={verticalListSortingStrategy}
                                  >
                                    <div className="space-y-4">
                                      {blocks.map(
                                        (block: Block, blockIndex: number) => (
                                          <SortableBlockItem
                                            key={block._key}
                                            block={block}
                                            onChange={(updatedBlock: Block) =>
                                              handleBlockChange(
                                                sectionIndex,
                                                containerIndex,
                                                blockIndex,
                                                updatedBlock,
                                              )
                                            }
                                            onDelete={() =>
                                              handleBlockDelete(
                                                sectionIndex,
                                                containerIndex,
                                                blockIndex,
                                              )
                                            }
                                            onDuplicate={() =>
                                              handleBlockDuplicate(
                                                sectionIndex,
                                                containerIndex,
                                                blockIndex,
                                              )
                                            }
                                            onMoveUp={() =>
                                              handleBlockMoveUp(
                                                sectionIndex,
                                                containerIndex,
                                                blockIndex,
                                              )
                                            }
                                            onMoveDown={() =>
                                              handleBlockMoveDown(
                                                sectionIndex,
                                                containerIndex,
                                                blockIndex,
                                              )
                                            }
                                            tenantId={id}
                                            isSelected={
                                              selectedBlockKey === block._key
                                            }
                                            isHovered={
                                              hoveredBlockKey === block._key
                                            }
                                            onSelect={() =>
                                              setSelectedBlockKey(block._key)
                                            }
                                            isFirst={blockIndex === 0}
                                            isLast={
                                              blockIndex === blocks.length - 1
                                            }
                                          />
                                        ),
                                      )}
                                    </div>
                                  </SortableContext>
                                </DndContext>
                              );
                            }}
                          />
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
        </BlockEditorProvider>
      </PageEditorLayout>
    </>
  );
}
