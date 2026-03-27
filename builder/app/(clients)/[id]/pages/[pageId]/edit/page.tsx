"use client";

import * as React from "react";
import {
  usePage,
  useUpdatePage,
  usePublishPage,
  useUnpublishPage,
  useCreatePreviewToken,
  usePageVersions,
  useRestorePageVersion,
  type Section,
  type PageSeo,
} from "@/lib/hooks/use-pages";
import { useAutoSave } from "@/lib/hooks/use-auto-save";
import { usePageEditor } from "@/lib/hooks/use-page-editor";
import {
  PageEditorLayout,
  PageSettingsDrawer,
  SettingsPanel,
} from "@/components/editor";
import { PageLayers } from "@/components/editor/page-layers/page-layers";
import { EditorSidebar } from "@/components/editor/editor-sidebar";
import { BlocksLibrary } from "@/components/editor/blocks-library";
import { PageRenderer } from "@/components/renderers/page-renderer";
import { HeaderRenderer } from "@/components/headers";
import { FooterRenderer } from "@/components/editor/footer-renderer";
import { ResponsivePreview } from "@/components/editor/responsive-preview";
import { type Breakpoint } from "@/components/editor/breakpoint-selector";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveProvider } from "@/lib/responsive/context";
import { useIsBuilder } from "@/lib/hooks/use-tier";
import { useTenant } from "@/lib/hooks/use-tenants";
import { usePreviewMode } from "@/lib/context/preview-mode-context";
import { useUIStore } from "@/lib/stores/ui-store";

// =============================================================================
// Page Editor
// =============================================================================

export default function EditPagePage({
  params,
}: {
  params: Promise<{ id: string; pageId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id, pageId } = resolvedParams;
  const { data: page, isLoading, error } = usePage(id, pageId);
  const { data: tenant } = useTenant(id);
  const isBuilder = useIsBuilder(id);
  const updatePage = useUpdatePage(id);
  const publishPage = usePublishPage(id);
  const unpublishPage = useUnpublishPage(id);
  const createPreviewToken = useCreatePreviewToken(id);
  const { data: versions = [] } = usePageVersions(id, pageId);
  const restoreVersion = useRestorePageVersion(id);

  // Section/block operations (extracted hook)
  // Don't use createDefaultSection() as fallback — that creates empty content
  // that gets auto-saved and overwrites real data
  const initialSections = React.useMemo(
    () => (page?.content?.sections as Section[]) ?? [],
    [page],
  );
  const editor = usePageEditor(initialSections);

  // Breakpoint state for responsive preview
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>("desktop");

  // Modal states
  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false);

  // Preview mode from context
  const {
    isPreviewMode: previewMode,
    togglePreviewMode,
    setPageContext,
  } = usePreviewMode();

  // Selection & hover state
  const [selectedBlockKey, setSelectedBlockKey] = React.useState<
    string | null
  >(null);
  const [hoveredBlockKey, setHoveredBlockKey] = React.useState<
    string | null
  >(null);

  // Sync selection highlight to preview DOM
  React.useEffect(() => {
    const prev = document.querySelector("[data-block-key].is-preview-selected");
    prev?.classList.remove("is-preview-selected");
    if (selectedBlockKey) {
      const el = document.querySelector(
        `[data-block-key="${selectedBlockKey}"]`,
      );
      el?.classList.add("is-preview-selected");
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedBlockKey]);

  // Sync hover highlight to preview DOM
  React.useEffect(() => {
    const prev = document.querySelector("[data-block-key].is-preview-hovered");
    prev?.classList.remove("is-preview-hovered");
    if (hoveredBlockKey && hoveredBlockKey !== selectedBlockKey) {
      const el = document.querySelector(
        `[data-block-key="${hoveredBlockKey}"]`,
      );
      el?.classList.add("is-preview-hovered");
    }
  }, [hoveredBlockKey, selectedBlockKey]);

  // UI Store for block selection in sidebar
  const { selectBlock, selectSection, selectContainer, selectedElement } = useUIStore();

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
    pageId,
    debounceMs: 3000,
    onSaveSuccess: () => {
      toast("Saved", { duration: 1500, id: "auto-save", position: "bottom-right" });
    },
    onSaveError: (error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

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
    return () => setPageContext(null);
  }, [localPage.title, page?.title, setPageContext]);

  // --- Auto-save wiring ---

  const saveRef = React.useRef(autoSave.save);
  const saveNowRef = React.useRef(autoSave.saveNow);
  React.useEffect(() => {
    saveRef.current = autoSave.save;
    saveNowRef.current = autoSave.saveNow;
  }, [autoSave.save, autoSave.saveNow]);

  const buildSavePayload = React.useCallback(
    () => ({
      title: localPage.title,
      slug: localPage.slug,
      template: localPage.template,
      seo: localPage.seo,
      headerId: localPage.headerId,
      footerId: localPage.footerId,
      isHomePage: localPage.isHomePage,
      sections: editor.sections,
    }),
    [localPage, editor.sections],
  );

  // Keyboard shortcut: Cmd+S / Ctrl+S
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        saveNowRef.current(buildSavePayload());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [buildSavePayload]);

  // Trigger debounced auto-save on content changes
  const saveCountRef = React.useRef(0);
  React.useEffect(() => {
    saveCountRef.current++;
    if (saveCountRef.current <= 2) {
      // Skip first 2 renders (initial + hydration)
      return;
    }
    const payload = buildSavePayload();
    saveRef.current(payload);
  }, [buildSavePayload]);

  // Listen for block additions from BlocksLibrary
  React.useEffect(() => {
    const handleAddBlock = (event: Event) => {
      const customEvent = event as CustomEvent<{
        blockId: string;
        blockType: string;
      }>;
      // Add to currently selected section/container, or first one
      const si = selectedElement?.sectionIndex ?? 0;
      const ci = selectedElement?.containerIndex ?? 0;
      // Ensure section exists
      if (editor.sections.length === 0) {
        editor.handleAddSectionAt(0);
        setTimeout(() => {
          editor.handleAddBlockToContainer(0, 0, customEvent.detail.blockType);
        }, 0);
        return;
      }
      editor.handleAddBlockToContainer(si, ci, customEvent.detail.blockType);
    };
    window.addEventListener("add-block", handleAddBlock);
    return () => window.removeEventListener("add-block", handleAddBlock);
  }, [editor, selectedElement?.sectionIndex, selectedElement?.containerIndex]);

  // --- Early returns ---

  if (isLoading) {
    return (
      <div className="flex h-full">
        <div className="w-[220px] border-r border-[var(--border-default)] p-3 space-y-3">
          <div className="h-4 w-16 bg-[var(--el-100)] rounded animate-pulse" />
          <div className="h-8 w-full bg-[var(--el-100)] rounded animate-pulse" />
          <div className="h-8 w-3/4 bg-[var(--el-100)] rounded animate-pulse ml-4" />
        </div>
        <div className="flex-1 p-8 space-y-6">
          <div className="h-10 w-1/3 bg-[var(--el-100)] rounded animate-pulse" />
          <div className="h-4 w-full bg-[var(--el-100)] rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-[var(--el-100)] rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-[var(--el-100)] rounded animate-pulse" />
          <div className="h-48 w-full bg-[var(--el-100)] rounded animate-pulse" />
        </div>
        <div className="w-[280px] border-l border-[var(--border-default)] p-3 space-y-3">
          <div className="h-4 w-20 bg-[var(--el-100)] rounded animate-pulse" />
          <div className="h-8 w-full bg-[var(--el-100)] rounded animate-pulse" />
          <div className="h-8 w-full bg-[var(--el-100)] rounded animate-pulse" />
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-[14px] text-[var(--status-error)]">
          Error loading page: {error.message}
        </span>
      </div>
    );
  }
  if (!page) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-[14px] text-[var(--el-500)]">Page not found</span>
      </div>
    );
  }

  // --- Handlers ---

  const handleSave = () => autoSave.saveNow(buildSavePayload());

  const handlePublish = async () => {
    const isCurrentlyPublished = page?.status === "published";
    if (isCurrentlyPublished) {
      if (
        confirm("Unpublish this page? It will no longer be visible publicly.")
      ) {
        unpublishPage.mutate(pageId, {
          onSuccess: () => toast.success("Page unpublished"),
          onError: () => toast.error("Failed to unpublish page"),
        });
      }
    } else {
      if (!confirm("Publish this page? It will be visible to the public."))
        return;
      try {
        await updatePage.mutateAsync({ id: pageId, data: buildSavePayload() });
        await publishPage.mutateAsync(pageId);
        toast.success("Page published successfully!");
      } catch {
        toast.error("Failed to publish page");
      }
    }
  };

  const handleUnpublish = () => {
    if (
      confirm("Unpublish this page? It will no longer be visible publicly.")
    ) {
      unpublishPage.mutate(pageId, {
        onSuccess: () => toast.success("Page unpublished"),
        onError: () => toast.error("Failed to unpublish page"),
      });
    }
  };

  const handlePreview = () => {
    togglePreviewMode();
    if (!previewMode) setSelectedBlockKey(null);
  };

  const handleGeneratePreviewLink = async () => {
    autoSave.flush();
    try {
      const result = await createPreviewToken.mutateAsync({
        contentType: "page",
        contentId: pageId,
        expiresIn: "7d",
      });
      await navigator.clipboard.writeText(result.previewUrl);
      toast.success("Preview link copied to clipboard!");
    } catch {
      toast.error("Failed to generate preview link");
    }
  };

  const handlePageChange = (field: string, value: unknown) => {
    setLocalPage((prev) => ({ ...prev, [field]: value }));
    logger.debug("Page field changed", { field, value });
  };

  // --- Preview mode render ---

  if (previewMode) {
    return (
      <div className="min-h-screen bg-[var(--el-0)]">
        <Button
          variant="secondary"
          size="sm"
          onClick={handlePreview}
          className="fixed top-4 right-4 z-50 shadow-lg"
        >
          <Eye className="h-4 w-4" />
          Exit Preview
        </Button>
        <HeaderRenderer tenantId={id} headerId={localPage.headerId} />
        <PageRenderer
          page={{
            id: pageId,
            title: localPage.title,
            slug: localPage.slug,
            sections: editor.sections,
          }}
          breakpoint={breakpoint}
        />
      </div>
    );
  }

  // --- Editor render ---

  return (
    <>
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
        pageSlug={localPage.slug}
        tenantSlug={tenant?.slug}
        leftPanel={
          <EditorSidebar
            layersPanel={
              <PageLayers
                sections={editor.sections}
                selectedKey={selectedBlockKey}
                hoveredKey={hoveredBlockKey}
                onSelectSection={(sectionIndex, key) => {
                  setSelectedBlockKey(key);
                  selectSection(sectionIndex, key);
                }}
                onSelectContainer={(sectionIndex, containerIndex, key) => {
                  setSelectedBlockKey(key);
                  selectContainer(sectionIndex, containerIndex, key);
                }}
                onSelectBlock={(sectionIndex, containerIndex, blockIndex, key) => {
                  setSelectedBlockKey(key);
                  selectBlock(sectionIndex, containerIndex, blockIndex, key);
                }}
                onHover={setHoveredBlockKey}
                onAddSection={() =>
                  editor.handleAddSectionAt(editor.sections.length)
                }
                onDeleteSection={editor.handleSectionDelete}
                onAddBlock={editor.handleAddBlockToContainer}
                onDeleteBlock={editor.handleBlockDelete}
                onDuplicateBlock={editor.handleBlockDuplicate}
                onMoveBlockUp={editor.handleBlockMoveUp}
                onMoveBlockDown={editor.handleBlockMoveDown}
              />
            }
            blocksPanel={<BlocksLibrary />}
          />
        }
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
        onViewAllHistory={undefined}
        isSaving={autoSave.isSaving || updatePage.isPending}
        isPublished={localPage.status === "published"}
        hasUnsavedChanges={autoSave.hasUnsavedChanges}
        lastSaved={autoSave.lastSaved}
        rightPanel={
          <SettingsPanel
            sections={editor.sections}
            onSectionChange={editor.handleSectionChange}
            onContainerChange={(sectionIndex, containerIndex, container) => {
              editor.setSections((prevSections) => {
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
            onBlockChange={editor.handleBlockChange}
            onSectionMoveUp={editor.handleSectionMoveUp}
            onSectionMoveDown={editor.handleSectionMoveDown}
            onSectionDuplicate={editor.handleSectionDuplicate}
            onSectionDelete={editor.handleSectionDelete}
            onContainerDelete={(sectionIndex, containerIndex) => {
              editor.setSections((prevSections) => {
                const updated = [...prevSections];
                const containers = [
                  ...(updated[sectionIndex].containers ?? []),
                ];
                containers.splice(containerIndex, 1);
                updated[sectionIndex] = {
                  ...updated[sectionIndex],
                  containers,
                };
                return updated;
              });
            }}
            onAddContainer={editor.handleAddContainerToSection}
            onBlockMoveUp={editor.handleBlockMoveUp}
            onBlockMoveDown={editor.handleBlockMoveDown}
            onBlockDuplicate={editor.handleBlockDuplicate}
            onBlockDelete={editor.handleBlockDelete}
          />
        }
      >
        <ResponsiveProvider breakpoint={breakpoint} isBuilder={isBuilder}>
          <ResponsivePreview breakpoint={breakpoint} className="h-full">
            <div
              className="page-editor-canvas-content design-preview"
              onMouseMove={(e) => {
                const target = e.target as HTMLElement;
                const blockEl = target.closest("[data-block-key]");
                const key = blockEl?.getAttribute("data-block-key") ?? null;
                if (key !== hoveredBlockKey) {
                  setHoveredBlockKey(key);
                }
              }}
              onMouseLeave={() => setHoveredBlockKey(null)}
              onClick={(e) => {
                // Find the closest block element
                const target = e.target as HTMLElement;
                const blockEl = target.closest("[data-block-key]");
                if (!blockEl) {
                  // Clicked empty space — deselect
                  setSelectedBlockKey(null);
                  return;
                }
                const key = blockEl.getAttribute("data-block-key");
                if (!key || key === selectedBlockKey) return;

                // Find which section/container/block this key belongs to
                for (let si = 0; si < editor.sections.length; si++) {
                  const section = editor.sections[si];
                  if (section._key === key) {
                    setSelectedBlockKey(key);
                    selectSection(si, key);
                    return;
                  }
                  const containers = section.containers ?? [];
                  for (let ci = 0; ci < containers.length; ci++) {
                    const container = containers[ci];
                    if (container._key === key) {
                      setSelectedBlockKey(key);
                      selectContainer(si, ci, key);
                      return;
                    }
                    const blocks = container.blocks ?? [];
                    for (let bi = 0; bi < blocks.length; bi++) {
                      if (blocks[bi]._key === key) {
                        setSelectedBlockKey(key);
                        selectBlock(si, ci, bi, key);
                        return;
                      }
                    }
                  }
                }
              }}
            >
              <HeaderRenderer tenantId={id} headerId={localPage.headerId} />
              {editor.sections.every(
                (s) =>
                  !s.containers?.length ||
                  s.containers.every((c) => !c.blocks?.length),
              ) ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
                  <div className="flex flex-col items-center gap-2 text-center max-w-sm">
                    <p className="text-[18px] font-semibold text-[var(--el-800)]">
                      This page is empty
                    </p>
                    <p className="text-[14px] text-[var(--el-500)] leading-relaxed">
                      Add content to start building. You can add headings,
                      text, images, and more from the blocks panel.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      onClick={() => {
                        if (editor.sections.length === 0) {
                          editor.handleAddSectionAt(0);
                        }
                        // Use setTimeout to let the section state update
                        setTimeout(() => {
                          editor.handleAddBlockToContainer(0, 0, "heading");
                          editor.handleAddBlockToContainer(0, 0, "rich-text");
                        }, 0);
                      }}
                    >
                      Add starter content
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (editor.sections.length === 0) {
                          editor.handleAddSectionAt(0);
                        }
                        setTimeout(() => {
                          editor.handleAddBlockToContainer(0, 0, "heading");
                        }, 0);
                      }}
                    >
                      Add empty block
                    </Button>
                  </div>
                </div>
              ) : (
                <PageRenderer
                  page={{
                    id: pageId,
                    title: localPage.title,
                    slug: localPage.slug,
                    sections: editor.sections,
                  }}
                  isEditing
                  onBlockChange={(sectionIndex, containerIndex, blockIndex, updatedBlock) => {
                    editor.handleBlockChange(sectionIndex, containerIndex, blockIndex, updatedBlock as Section["containers"][0]["blocks"][0]);
                  }}
                  breakpoint={breakpoint}
                />
              )}
              <FooterRenderer tenantId={id} footerId={localPage.footerId} />
            </div>
          </ResponsivePreview>
        </ResponsiveProvider>
      </PageEditorLayout>
    </>
  );
}
