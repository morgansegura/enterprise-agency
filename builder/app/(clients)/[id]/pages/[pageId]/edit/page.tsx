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
import {
  usePageEditor,
  createDefaultSection,
} from "@/lib/hooks/use-page-editor";
import {
  PageEditorLayout,
  PageSettingsDrawer,
  SettingsPanel,
} from "@/components/editor";
import { PageLayers } from "@/components/editor/page-layers/page-layers";
import { PageRenderer } from "@/components/renderers/page-renderer";
import { HeaderRenderer } from "@/components/headers";
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
  const initialSections = React.useMemo(
    () =>
      (page?.content?.sections as Section[]) ?? [createDefaultSection()],
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
  const { selectBlock } = useUIStore();

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

  const initialLoadRef = React.useRef(true);
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
  React.useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }
    saveRef.current(buildSavePayload());
  }, [buildSavePayload]);

  // Listen for block additions from BlocksLibrary
  React.useEffect(() => {
    const handleAddBlock = (event: Event) => {
      const customEvent = event as CustomEvent<{
        blockId: string;
        blockType: string;
      }>;
      editor.handleAddBlockToContainer(0, 0, customEvent.detail.blockType);
    };
    window.addEventListener("add-block", handleAddBlock);
    return () => window.removeEventListener("add-block", handleAddBlock);
  }, [editor]);

  // --- Early returns ---

  if (isLoading) return <div>Loading page...</div>;
  if (error) return <div>Error loading page: {error.message}</div>;
  if (!page) return <div>Page not found</div>;

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
      <div className="min-h-screen bg-background">
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
          <PageLayers
            sections={editor.sections}
            selectedKey={selectedBlockKey}
            hoveredKey={hoveredBlockKey}
            onSelectSection={(sectionIndex, key) => {
              setSelectedBlockKey(key);
              selectBlock(sectionIndex, 0, 0, key);
            }}
            onSelectContainer={(sectionIndex, containerIndex, key) => {
              setSelectedBlockKey(key);
              selectBlock(sectionIndex, containerIndex, 0, key);
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
            <div className="page-editor-canvas-content design-preview">
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
          </ResponsivePreview>
        </ResponsiveProvider>
      </PageEditorLayout>
    </>
  );
}
