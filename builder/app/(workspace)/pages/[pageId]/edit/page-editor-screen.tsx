"use client";

import * as React from "react";
import {
  usePage,
  useUpdatePage,
  usePublishPage,
  usePublishToStaging,
  useUnpublishPage,
  useCreatePreviewToken,
  usePageVersions,
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
import { EditableHeader } from "@/components/editor/editable-header";
import { EditableFooter } from "@/components/editor/editable-footer";
import { ResponsivePreview } from "@/components/editor/responsive-preview";
import { type Breakpoint } from "@/components/editor/breakpoint-selector";
import { logger } from "@/lib/logger";
import { AddBlockPopover } from "@/components/editor/add-block-popover/add-block-popover";
import { toast } from "sonner";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveProvider } from "@/lib/responsive/context";
import { useIsBuilder } from "@/lib/hooks/use-tier";
import { useTenant } from "@/lib/hooks/use-tenants";
import { usePreviewMode } from "@/lib/context/preview-mode-context";
import { useUIStore } from "@/lib/stores/ui-store";
import { useTenantTokens } from "@/lib/hooks/use-tenant-tokens";
import { applyTokensToDOM } from "@/lib/tokens/apply-tokens";
import { useEditorStore } from "@/lib/stores/editor-store";
import { SaveToLibraryDialog } from "@/components/editor/library-picker/save-to-library-dialog";
import { generatePageCSS } from "@enterprise/tokens";
import {
  useHeader,
  useDefaultHeader,
  useUpdateHeader,
  useCreateHeader,
} from "@/lib/hooks/use-headers";
import {
  useFooter,
  useDefaultFooter,
  useUpdateFooter,
  useCreateFooter,
} from "@/lib/hooks/use-footers";
import { createDefaultHeader } from "@/lib/defaults";
import { createDefaultFooter } from "@/lib/defaults";

// =============================================================================
// Page Editor
// =============================================================================

interface PageEditorScreenProps {
  tenantId: string;
  pageId: string;
}

export function PageEditorScreen({
  tenantId: id,
  pageId,
}: PageEditorScreenProps) {
  const { data: page, isLoading, error } = usePage(id, pageId);
  const { data: _tenant } = useTenant(id);
  const { data: tenantTokens } = useTenantTokens(id);
  const isBuilder = useIsBuilder(id);
  const updatePage = useUpdatePage(id);
  const publishPage = usePublishPage(id);
  const publishToStaging = usePublishToStaging(id);
  const unpublishPage = useUnpublishPage(id);
  const createPreviewToken = useCreatePreviewToken(id);
  // Versions available for future history UI
  usePageVersions(id, pageId);

  // Section/block operations (extracted hook)
  // Don't use createDefaultSection() as fallback — that creates empty content
  // that gets auto-saved and overwrites real data
  const initialSections = React.useMemo(
    () => (page?.content?.sections as Section[]) ?? [],
    [page],
  );
  const editor = usePageEditor(initialSections);

  // Apply tenant tokens to DOM (theme fonts, colors, etc.)
  React.useEffect(() => {
    if (tenantTokens && Object.keys(tenantTokens).length > 0) {
      applyTokensToDOM(tenantTokens as Record<string, unknown>);
    }
  }, [tenantTokens]);

  // Breakpoint state for responsive preview
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>("desktop");

  // Generated page CSS — visual styles rendered via <style> tag, not inline
  const pageCSS = React.useMemo(
    () => generatePageCSS(editor.sections as never[], breakpoint),
    [editor.sections, breakpoint],
  );

  // Modal states
  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false);
  const [saveToLibrarySection, setSaveToLibrarySection] = React.useState<{
    section: Section;
    index: number;
  } | null>(null);

  // Preview mode from context
  const {
    isPreviewMode: previewMode,
    togglePreviewMode,
    setPageContext,
  } = usePreviewMode();

  // Selection & hover state
  const [selectedBlockKey, setSelectedBlockKey] = React.useState<string | null>(
    null,
  );
  const [hoveredBlockKey, setHoveredBlockKey] = React.useState<string | null>(
    null,
  );

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

  // Sync hover highlight to preview DOM. Only the directly hovered element
  // receives `.is-preview-hovered` — ancestors are intentionally untouched.
  // Walking the tree to tag ancestors forces style invalidation on every
  // parent section/container on each mouse move, which repaints their
  // compositor layers (notably any section with an `::after` gradient
  // overlay and `isolation: isolate`) and produces a visible flicker.
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

  // Right-click context menu
  const [contextMenu, setContextMenu] = React.useState<{
    x: number;
    y: number;
    elementType: "section" | "container" | "block";
    sectionIndex: number;
    containerIndex?: number;
    blockIndex?: number;
  } | null>(null);

  // Close context menu on click anywhere
  React.useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [contextMenu]);

  // UI Store for block selection in sidebar
  const {
    selectBlock,
    selectSection,
    selectContainer,
    selectedElement,
    setSelectedElement,
    setRightPanelOpen,
    clearSelection,
  } = useUIStore();

  // Escape key deselects — shows Page Settings in the right panel
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const target = e.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        )
          return;
        setSelectedBlockKey(null);
        clearSelection();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [clearSelection]);

  // ---------------------------------------------------------------------------
  // Canvas click-to-select with double-click drill-down
  // Single click → select section. Double-click → drill into container/block.
  // ---------------------------------------------------------------------------
  // Canvas click-to-select: single click selects the innermost element you
  // clicked on. Layers panel handles parent selection when needed.
  const handleCanvasClick = React.useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const clicked = target.closest("[data-block-key]") as HTMLElement | null;
      if (!clicked) {
        setSelectedBlockKey(null);
        clearSelection();
        return;
      }

      const key = clicked.getAttribute("data-block-key")!;
      const elementType = clicked.getAttribute("data-element-type");

      // Find indices by walking the hierarchy
      const sectionEl = clicked.closest(
        "[data-element-type='section']",
      ) as HTMLElement | null;
      const sectionKey = sectionEl?.getAttribute("data-block-key");
      const si = editor.sections.findIndex((s) => s._key === sectionKey);

      if (elementType === "block") {
        const containerEl = clicked.closest(
          "[data-element-type='container']",
        ) as HTMLElement | null;
        const containerKey = containerEl?.getAttribute("data-block-key");
        const ci =
          si >= 0
            ? (editor.sections[si].containers ?? []).findIndex(
                (c) => c._key === containerKey,
              )
            : -1;
        const bi =
          si >= 0 && ci >= 0
            ? (editor.sections[si].containers?.[ci]?.blocks ?? []).findIndex(
                (b) => b._key === key,
              )
            : -1;
        if (si >= 0 && ci >= 0 && bi >= 0) {
          setSelectedBlockKey(key);
          selectBlock(si, ci, bi, key);
        }
      } else if (elementType === "container") {
        const ci =
          si >= 0
            ? (editor.sections[si].containers ?? []).findIndex(
                (c) => c._key === key,
              )
            : -1;
        if (si >= 0 && ci >= 0) {
          setSelectedBlockKey(key);
          selectContainer(si, ci, key);
        }
      } else if (elementType === "section" && si >= 0) {
        setSelectedBlockKey(key);
        selectSection(si, key);
      }
    },
    [
      editor.sections,
      selectBlock,
      selectSection,
      selectContainer,
      clearSelection,
    ],
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
    pageId,
    debounceMs: 3000,
    onSaveSuccess: () => {
      toast.success("Saved", {
        duration: 1500,
        id: "auto-save",
        position: "bottom-right",
      });
    },
    onSaveError: (error: unknown) => {
      const msg =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Unknown error";
      toast.error(`Failed to save: ${msg}`);
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

  // Header/footer data for settings panel
  const { data: specificHeader } = useHeader(
    id,
    localPage.headerId && localPage.headerId !== "default"
      ? localPage.headerId
      : "",
  );
  const { data: defaultHeader } = useDefaultHeader(id);
  const activeHeader =
    localPage.headerId === "default" || !localPage.headerId
      ? defaultHeader
      : specificHeader || defaultHeader;
  const updateHeader = useUpdateHeader(id);
  const createHeader = useCreateHeader(id);

  const { data: specificFooter } = useFooter(
    id,
    localPage.footerId && localPage.footerId !== "default"
      ? localPage.footerId
      : "",
  );
  const { data: defaultFooter } = useDefaultFooter(id);
  const activeFooter =
    localPage.footerId === "default" || !localPage.footerId
      ? defaultFooter
      : specificFooter || defaultFooter;
  const updateFooter = useUpdateFooter(id);
  const createFooter = useCreateFooter(id);

  // ---------------------------------------------------------------------------
  // Local state for header/footer sections — same pattern as page body.
  // Changes are instant (local state), then debounce-saved to the API.
  // This prevents 403s and race conditions from breaking the UI.
  // ---------------------------------------------------------------------------
  const [localHeaderSections, setLocalHeaderSections] = React.useState<
    Section[]
  >([]);
  const [localFooterSections, setLocalFooterSections] = React.useState<
    Section[]
  >([]);

  // Sync from API on initial load / refetch
  React.useEffect(() => {
    if (activeHeader?.sections) {
      const s = activeHeader.sections as Section[];
      if (Array.isArray(s) && s.length > 0 && s[0]?._type === "section") {
        setLocalHeaderSections(s);
      }
    }
  }, [activeHeader?.sections]);

  React.useEffect(() => {
    if (activeFooter?.sections) {
      const s = activeFooter.sections as Section[];
      if (Array.isArray(s) && s.length > 0 && s[0]?._type === "section") {
        setLocalFooterSections(s);
      }
    }
  }, [activeFooter?.sections]);

  // Debounced save for header sections
  const headerSaveTimer = React.useRef<NodeJS.Timeout | null>(null);
  const saveHeaderSections = React.useCallback(
    (sections: Section[]) => {
      setLocalHeaderSections(sections);
      if (headerSaveTimer.current) clearTimeout(headerSaveTimer.current);
      headerSaveTimer.current = setTimeout(() => {
        if (activeHeader) {
          updateHeader.mutate({
            id: activeHeader.id,
            data: { sections },
          });
        }
      }, 2000);
    },
    [activeHeader, updateHeader],
  );

  // Debounced save for footer sections
  const footerSaveTimer = React.useRef<NodeJS.Timeout | null>(null);
  const saveFooterSections = React.useCallback(
    (sections: Section[]) => {
      setLocalFooterSections(sections);
      if (footerSaveTimer.current) clearTimeout(footerSaveTimer.current);
      footerSaveTimer.current = setTimeout(() => {
        if (activeFooter) {
          updateFooter.mutate({
            id: activeFooter.id,
            data: { sections },
          });
        }
      }, 2000);
    },
    [activeFooter, updateFooter],
  );

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

  // Trigger debounced auto-save on content changes.
  //
  // Safety invariant: autosave MUST NOT overwrite a non-empty page with
  // zero sections unless the user explicitly cleared the page. We track
  // whether we've ever seen non-empty sections for this page (from the
  // server load or from in-session edits); once true, we refuse to save
  // a 0-section payload and log a warning instead.
  const saveCountRef = React.useRef(0);
  const hasSeenContentRef = React.useRef(false);
  React.useEffect(() => {
    saveCountRef.current++;
    if (saveCountRef.current <= 2) {
      // Skip first 2 renders (initial + hydration)
      return;
    }
    const payload = buildSavePayload();
    if (payload.sections.length > 0) {
      hasSeenContentRef.current = true;
    } else if (hasSeenContentRef.current) {
      logger.warn(
        "autosave: refusing to overwrite non-empty page with 0 sections. " +
          "If you meant to clear the page, remove sections from the layers panel.",
      );
      return;
    }
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

  // Listen for section template additions from BlocksLibrary
  React.useEffect(() => {
    const handleAddSectionTemplate = (event: Event) => {
      const customEvent = event as CustomEvent<{
        name: string;
        section: {
          width: string;
          paddingY: string;
          styles?: Record<string, string>;
          containers: Array<{
            layout?: Record<string, unknown>;
            blocks: Array<{
              _type: string;
              data: Record<string, unknown>;
              styles?: Record<string, string>;
            }>;
          }>;
        };
      }>;
      const template = customEvent.detail;
      const ts = Date.now();

      // Build the section with unique keys
      const newSection = {
        _type: "section" as const,
        _key: `template-section-${ts}`,
        width: template.section.width,
        paddingY: template.section.paddingY,
        styles: template.section.styles,
        containers: template.section.containers.map((container, ci) => ({
          _type: "container" as const,
          _key: `template-container-${ts}-${ci}`,
          layout: container.layout || {
            type: "stack",
            direction: "column",
            gap: "md",
          },
          blocks: container.blocks.map((block, bi) => ({
            _type: block._type,
            _key: `template-block-${ts}-${ci}-${bi}`,
            data: block.data,
            styles: block.styles,
          })),
        })),
      };

      editor.setSections((prev: typeof editor.sections) => [
        ...prev,
        newSection as (typeof editor.sections)[number],
      ]);
    };
    window.addEventListener("add-section-template", handleAddSectionTemplate);
    return () =>
      window.removeEventListener(
        "add-section-template",
        handleAddSectionTemplate,
      );
  }, [editor]);

  // --- Early returns ---

  if (isLoading) {
    return (
      <div className="flex h-full">
        <div className="w-[220px] border-r border-(--border-default) p-3 space-y-3">
          <div className="h-4 w-16 bg-(--el-100) rounded animate-pulse" />
          <div className="h-8 w-full bg-(--el-100) rounded animate-pulse" />
          <div className="h-8 w-3/4 bg-(--el-100) rounded animate-pulse ml-4" />
        </div>
        <div className="flex-1 p-8 space-y-6">
          <div className="h-10 w-1/3 bg-(--el-100) rounded animate-pulse" />
          <div className="h-4 w-full bg-(--el-100) rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-(--el-100) rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-(--el-100) rounded animate-pulse" />
          <div className="h-48 w-full bg-(--el-100) rounded animate-pulse" />
        </div>
        <div className="w-[320px] border-l border-(--border-default) p-3 space-y-3">
          <div className="h-4 w-20 bg-(--el-100) rounded animate-pulse" />
          <div className="h-8 w-full bg-(--el-100) rounded animate-pulse" />
          <div className="h-8 w-full bg-(--el-100) rounded animate-pulse" />
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-[14px] text-(--status-error)">
          Error loading page: {error.message}
        </span>
      </div>
    );
  }
  if (!page) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-[14px] text-(--el-500)">Page not found</span>
      </div>
    );
  }

  // --- Handlers ---

  const handleSave = () => autoSave.saveNow(buildSavePayload());

  const handlePublish = async () => {
    try {
      await updatePage.mutateAsync({ id: pageId, data: buildSavePayload() });
      await publishPage.mutateAsync(pageId);
      toast.success("Published to production");
    } catch {
      toast.error("Failed to publish");
    }
  };

  const handlePublishStaging = async () => {
    try {
      await updatePage.mutateAsync({ id: pageId, data: buildSavePayload() });
      await publishToStaging.mutateAsync(pageId);
      toast.success("Published to staging");
    } catch {
      toast.error("Failed to publish to staging");
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
      <div className="min-h-screen bg-(--el-0)">
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
        pageTitle={localPage.title || "Untitled"}
        breakpoint={breakpoint}
        onBreakpointChange={setBreakpoint}
        onPublish={handlePublish}
        onPublishStaging={handlePublishStaging}
        onUnpublish={handleUnpublish}
        pageStatus={page?.status || "draft"}
        onPreview={handlePreview}
        onGeneratePreviewLink={handleGeneratePreviewLink}
        onCanvasClick={handleCanvasClick}
        leftPanel={
          <EditorSidebar
            layersPanel={
              <PageLayers
                sections={editor.sections}
                hasHeader={true}
                headerSections={localHeaderSections}
                headerLabel={activeHeader?.name ?? "Header"}
                hasFooter={true}
                footerSections={localFooterSections}
                footerLabel={activeFooter?.name ?? "Footer"}
                onAddHeaderSection={() => {
                  const newContainer = {
                    _type: "container" as const,
                    _key: `container-${Date.now().toString(36)}`,
                    layout: {
                      type: "flex" as const,
                      direction: "row" as const,
                      justify: "between" as const,
                      align: "center" as const,
                      gap: "md" as const,
                    },
                    maxWidth: "xl" as const,
                    paddingX: "md" as const,
                    blocks: [],
                  };
                  const existing = localHeaderSections[0];
                  const section =
                    existing && existing._type === "section"
                      ? existing
                      : {
                          _type: "section" as const,
                          _key: `section-${Date.now().toString(36)}`,
                          as: "div" as const,
                          width: "full" as const,
                          containers: [],
                        };
                  const updated = [{
                    ...section,
                    containers: [...(section.containers ?? []), newContainer],
                  }];
                  saveHeaderSections(updated);
                  if (!activeHeader) {
                    const defaults = createDefaultHeader({
                      isDefault: true,
                    });
                    createHeader.mutate(
                      {
                        ...defaults,
                        sections: [{
                          _type: "section",
                          _key: `section-${Date.now().toString(36)}`,
                          as: "div",
                          width: "full",
                          containers: [newContainer],
                        }],
                      },
                      {
                        onSuccess: (h) =>
                          handlePageChange("headerId", h.id),
                      },
                    );
                  }
                }}
                onAddFooterSection={() => {
                  const newContainer = {
                    _type: "container" as const,
                    _key: `container-${Date.now().toString(36)}`,
                    layout: {
                      type: "flex" as const,
                      direction: "row" as const,
                      justify: "between" as const,
                      align: "center" as const,
                      gap: "md" as const,
                    },
                    maxWidth: "xl" as const,
                    paddingX: "md" as const,
                    blocks: [],
                  };
                  const existing = localFooterSections[0];
                  const section =
                    existing && existing._type === "section"
                      ? existing
                      : {
                          _type: "section" as const,
                          _key: `section-${Date.now().toString(36)}`,
                          as: "div" as const,
                          width: "full" as const,
                          containers: [],
                        };
                  const updated = [{
                    ...section,
                    containers: [...(section.containers ?? []), newContainer],
                  }];
                  saveFooterSections(updated);
                  if (!activeFooter) {
                    const defaults = createDefaultFooter({
                      isDefault: true,
                    });
                    createFooter.mutate(
                      {
                        ...defaults,
                        sections: [{
                          _type: "section",
                          _key: `section-${Date.now().toString(36)}`,
                          as: "div",
                          width: "full",
                          containers: [newContainer],
                        }],
                      },
                      {
                        onSuccess: (f) =>
                          handlePageChange("footerId", f.id),
                      },
                    );
                  }
                }}
                onUpdateHeaderSections={saveHeaderSections}
                onUpdateFooterSections={saveFooterSections}
                onSelectHeader={() => {
                  if (activeHeader) {
                    setSelectedBlockKey(null);
                    setSelectedElement({
                      type: "header",
                      key: activeHeader.id,
                      sectionIndex: -1,
                    });
                    setRightPanelOpen(true);
                  }
                }}
                onSelectFooter={() => {
                  if (activeFooter) {
                    setSelectedBlockKey(null);
                    setSelectedElement({
                      type: "footer",
                      key: activeFooter.id,
                      sectionIndex: -1,
                    });
                    setRightPanelOpen(true);
                  }
                }}
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
                onSelectBlock={(
                  sectionIndex,
                  containerIndex,
                  blockIndex,
                  key,
                ) => {
                  setSelectedBlockKey(key);
                  selectBlock(sectionIndex, containerIndex, blockIndex, key);
                }}
                onHover={setHoveredBlockKey}
                onAddSection={() =>
                  editor.handleAddSectionAt(editor.sections.length)
                }
                onDeleteSection={editor.handleSectionDelete}
                onDuplicateSection={editor.handleSectionDuplicate}
                onMoveSectionUp={editor.handleSectionMoveUp}
                onMoveSectionDown={editor.handleSectionMoveDown}
                onAddContainer={editor.handleAddContainerToSection}
                onDuplicateContainer={(si, ci) => {
                  editor.setSections((prev) => {
                    const u = [...prev];
                    const cs = [...(u[si].containers ?? [])];
                    const clone = JSON.parse(JSON.stringify(cs[ci]));
                    clone._key = `container-${Date.now().toString(36)}`;
                    cs.splice(ci + 1, 0, clone);
                    u[si] = { ...u[si], containers: cs };
                    return u;
                  });
                }}
                onDeleteContainer={(si, ci) => {
                  editor.setSections((prev) => {
                    const u = [...prev];
                    u[si] = {
                      ...u[si],
                      containers: (u[si].containers ?? []).filter(
                        (_, i) => i !== ci,
                      ),
                    };
                    return u;
                  });
                }}
                onMoveContainerUp={(si, ci) => {
                  if (ci === 0) return;
                  editor.setSections((prev) => {
                    const u = [...prev];
                    const cs = [...(u[si].containers ?? [])];
                    [cs[ci - 1], cs[ci]] = [cs[ci], cs[ci - 1]];
                    u[si] = { ...u[si], containers: cs };
                    return u;
                  });
                }}
                onMoveContainerDown={(si, ci) => {
                  const cs = editor.sections[si]?.containers ?? [];
                  if (ci >= cs.length - 1) return;
                  editor.setSections((prev) => {
                    const u = [...prev];
                    const containers = [...(u[si].containers ?? [])];
                    [containers[ci + 1], containers[ci]] = [
                      containers[ci],
                      containers[ci + 1],
                    ];
                    u[si] = { ...u[si], containers };
                    return u;
                  });
                }}
                onAddBlock={editor.handleAddBlockToContainer}
                onAddBlockToBox={editor.handleAddBlockToBox}
                onDeleteBlock={editor.handleBlockDelete}
                onDuplicateBlock={editor.handleBlockDuplicate}
                onMoveBlockUp={editor.handleBlockMoveUp}
                onMoveBlockDown={editor.handleBlockMoveDown}
                onBlockReorder={editor.handleBlockReorder}
                onRenameSection={(sectionIndex, displayName) => {
                  const section = editor.sections[sectionIndex];
                  if (section)
                    editor.handleSectionChange(sectionIndex, {
                      ...section,
                      displayName,
                    });
                }}
                onRenameContainer={(si, ci, displayName) => {
                  editor.setSections((prev) => {
                    const updated = [...prev];
                    const containers = [...(updated[si].containers ?? [])];
                    containers[ci] = {
                      ...containers[ci],
                      displayName,
                    };
                    updated[si] = {
                      ...updated[si],
                      containers,
                    };
                    return updated;
                  });
                }}
                onRenameBlock={(si, ci, bi, displayName) => {
                  const block =
                    editor.sections[si]?.containers?.[ci]?.blocks?.[bi];
                  if (block)
                    editor.handleBlockChange(si, ci, bi, {
                      ...block,
                      displayName,
                    });
                }}
                onRenameHeader={(name) => {
                  if (activeHeader) {
                    updateHeader.mutate({
                      id: activeHeader.id,
                      data: { name },
                    });
                  }
                }}
                onRenameFooter={(name) => {
                  if (activeFooter) {
                    updateFooter.mutate({
                      id: activeFooter.id,
                      data: { name },
                    });
                  }
                }}
              />
            }
            blocksPanel={<BlocksLibrary />}
          />
        }
        isSaving={autoSave.isSaving || updatePage.isPending}
        isPublished={localPage.status === "published"}
        hasUnsavedChanges={autoSave.hasUnsavedChanges}
        lastSaved={autoSave.lastSaved}
        rightPanel={
          <SettingsPanel
            sections={editor.sections}
            pageSettings={{
              title: localPage.title,
              slug: localPage.slug,
              seo: {
                metaTitle: page?.seo?.metaTitle,
                metaDescription: page?.seo?.metaDescription,
              },
              headerId: localPage.headerId,
              footerId: localPage.footerId,
              onTitleChange: (title) => setLocalPage((p) => ({ ...p, title })),
              onSlugChange: (slug) => setLocalPage((p) => ({ ...p, slug })),
              onSeoChange: (seo) => {
                autoSave.save({ seo });
              },
              onHeaderChange: (headerId) =>
                setLocalPage((p) => ({ ...p, headerId })),
              onFooterChange: (footerId) =>
                setLocalPage((p) => ({ ...p, footerId })),
              tenantId: id,
            }}
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
              const cs = editor.sections[sectionIndex]?.containers ?? [];
              if (cs.length <= 1) return; // Always keep at least one
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
            headerData={
              (activeHeader as unknown as Record<string, unknown>) ?? null
            }
            onHeaderDataChange={(data) => {
              if (activeHeader) {
                const { style, zones, behavior, animation, mobileMenu } =
                  data as unknown as typeof activeHeader;
                updateHeader.mutate({
                  id: activeHeader.id,
                  data: { style, zones, behavior, animation, mobileMenu },
                });
              }
            }}
            footerData={
              (activeFooter as unknown as Record<string, unknown>) ?? null
            }
            onFooterDataChange={(data) => {
              if (activeFooter) {
                const { style, zones, layout, socialLinks, copyright } =
                  data as unknown as typeof activeFooter;
                updateFooter.mutate({
                  id: activeFooter.id,
                  data: { style, zones, layout, socialLinks, copyright },
                });
              }
            }}
          />
        }
      >
        <ResponsiveProvider breakpoint={breakpoint} isBuilder={isBuilder}>
          <ResponsivePreview breakpoint={breakpoint} className="h-full">
            <div
              className="page-editor-canvas-content design-preview"
              style={{ position: "relative" }}
              onMouseMove={(e) => {
                const target = e.target as HTMLElement;
                const blockEl = target.closest("[data-block-key]");
                const key = blockEl?.getAttribute("data-block-key") ?? null;
                if (key !== hoveredBlockKey) {
                  setHoveredBlockKey(key);
                }
              }}
              onMouseLeave={() => setHoveredBlockKey(null)}
              onContextMenu={(e) => {
                const target = e.target as HTMLElement;
                const blockEl = target.closest("[data-block-key]");
                if (!blockEl) return;
                e.preventDefault();
                const key = blockEl.getAttribute("data-block-key");
                if (!key) return;
                // Find element indices
                for (let si = 0; si < editor.sections.length; si++) {
                  const section = editor.sections[si];
                  if (section._key === key) {
                    setContextMenu({
                      x: e.clientX,
                      y: e.clientY,
                      elementType: "section",
                      sectionIndex: si,
                    });
                    return;
                  }
                  const containers = section.containers ?? [];
                  for (let ci = 0; ci < containers.length; ci++) {
                    if (containers[ci]._key === key) {
                      setContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        elementType: "container",
                        sectionIndex: si,
                        containerIndex: ci,
                      });
                      return;
                    }
                    const blocks = containers[ci].blocks ?? [];
                    for (let bi = 0; bi < blocks.length; bi++) {
                      if (blocks[bi]._key === key) {
                        setContextMenu({
                          x: e.clientX,
                          y: e.clientY,
                          elementType: "block",
                          sectionIndex: si,
                          containerIndex: ci,
                          blockIndex: bi,
                        });
                        return;
                      }
                    }
                  }
                }
              }}
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
                      // Search inside Box blocks (nested children)
                      const nested = (
                        blocks[bi].data as Record<string, unknown>
                      )?.blocks as Array<{ _key: string }> | undefined;
                      if (nested) {
                        for (let ni = 0; ni < nested.length; ni++) {
                          if (nested[ni]._key === key) {
                            setSelectedBlockKey(key);
                            // Select the parent Box — nested blocks edit via the Box
                            selectBlock(si, ci, bi, key);
                            return;
                          }
                        }
                      }
                    }
                  }
                }
              }}
            >
              {/* Generated page styles — visual CSS from element styles */}
              {pageCSS && (
                <style
                  id="page-styles"
                  dangerouslySetInnerHTML={{ __html: pageCSS }}
                />
              )}
              {/* Floating toolbar removed — actions available via right-click
                  context menu and layers panel icons. Text blocks use the
                  TipTap bubble menu for inline formatting instead. */}
              <EditableHeader
                tenantId={id}
                headerId={localPage.headerId}
                overrideSections={localHeaderSections}
                onBlockChange={(si, ci, bi, updatedBlock) => {
                  const sections = [...localHeaderSections];
                  const section = { ...sections[si] };
                  const containers = [...(section.containers ?? [])];
                  const container = { ...containers[ci] };
                  const blocks = [...(container.blocks ?? [])];
                  blocks[bi] = updatedBlock as Section["containers"][0]["blocks"][0];
                  container.blocks = blocks;
                  containers[ci] = container;
                  section.containers = containers;
                  sections[si] = section;
                  saveHeaderSections(sections);
                }}
                onHeaderChange={(headerId) =>
                  handlePageChange("headerId", headerId)
                }
              />
              {editor.sections.every(
                (s) =>
                  !s.containers?.length ||
                  s.containers.every((c) => !c.blocks?.length),
              ) ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
                  <div className="flex flex-col items-center gap-2 text-center max-w-sm">
                    <p className="text-[18px] font-semibold text-(--el-800)">
                      This page is empty
                    </p>
                    <p className="text-[14px] text-(--el-500) leading-relaxed">
                      Add content to start building. You can add headings, text,
                      images, and more from the blocks panel.
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
                    <AddBlockPopover
                      onAddBlock={(blockType) => {
                        if (editor.sections.length === 0) {
                          editor.handleAddSectionAt(0);
                        }
                        setTimeout(() => {
                          editor.handleAddBlockToContainer(0, 0, blockType);
                        }, 0);
                      }}
                    >
                      <Button variant="outline">Choose block…</Button>
                    </AddBlockPopover>
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
                  onBlockChange={(
                    sectionIndex,
                    containerIndex,
                    blockIndex,
                    updatedBlock,
                  ) => {
                    editor.handleBlockChange(
                      sectionIndex,
                      containerIndex,
                      blockIndex,
                      updatedBlock as Section["containers"][0]["blocks"][0],
                    );
                  }}
                  onAddBlockToContainer={(
                    sectionIndex,
                    containerIndex,
                    blockType,
                  ) =>
                    editor.handleAddBlockToContainer(
                      sectionIndex,
                      containerIndex,
                      blockType,
                    )
                  }
                  breakpoint={breakpoint}
                />
              )}
              <EditableFooter
                tenantId={id}
                footerId={localPage.footerId}
                overrideSections={localFooterSections}
                onBlockChange={(si, ci, bi, updatedBlock) => {
                  const sections = [...localFooterSections];
                  const section = { ...sections[si] };
                  const containers = [...(section.containers ?? [])];
                  const container = { ...containers[ci] };
                  const blocks = [...(container.blocks ?? [])];
                  blocks[bi] = updatedBlock as Section["containers"][0]["blocks"][0];
                  container.blocks = blocks;
                  containers[ci] = container;
                  section.containers = containers;
                  sections[si] = section;
                  saveFooterSections(sections);
                }}
                onFooterChange={(footerId) =>
                  handlePageChange("footerId", footerId)
                }
              />
            </div>
          </ResponsivePreview>
        </ResponsiveProvider>
      </PageEditorLayout>

      {/* Right-click context menu */}
      {contextMenu && (
        <div
          className="canvas-context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {contextMenu.elementType === "block" && (
            <>
              <button
                type="button"
                className="canvas-context-menu-item"
                onClick={() => {
                  editor.handleBlockMoveUp(
                    contextMenu.sectionIndex,
                    contextMenu.containerIndex!,
                    contextMenu.blockIndex!,
                  );
                  setContextMenu(null);
                }}
              >
                Move Up
              </button>
              <button
                type="button"
                className="canvas-context-menu-item"
                onClick={() => {
                  editor.handleBlockMoveDown(
                    contextMenu.sectionIndex,
                    contextMenu.containerIndex!,
                    contextMenu.blockIndex!,
                  );
                  setContextMenu(null);
                }}
              >
                Move Down
              </button>
              <div className="canvas-context-menu-divider" />
              <button
                type="button"
                className="canvas-context-menu-item"
                onClick={() => {
                  editor.handleBlockDuplicate(
                    contextMenu.sectionIndex,
                    contextMenu.containerIndex!,
                    contextMenu.blockIndex!,
                  );
                  setContextMenu(null);
                }}
              >
                Duplicate
              </button>
              <button
                type="button"
                className="canvas-context-menu-item canvas-context-menu-item-danger"
                onClick={() => {
                  editor.handleBlockDelete(
                    contextMenu.sectionIndex,
                    contextMenu.containerIndex!,
                    contextMenu.blockIndex!,
                  );
                  setSelectedBlockKey(null);
                  setContextMenu(null);
                }}
              >
                Delete
              </button>
            </>
          )}
          {contextMenu.elementType === "container" &&
            contextMenu.containerIndex !== undefined && (
              <>
                <button
                  type="button"
                  className="canvas-context-menu-item"
                  onClick={() => {
                    editor.handleAddContainerToSection(
                      contextMenu.sectionIndex,
                    );
                    setContextMenu(null);
                  }}
                >
                  Add Container
                </button>
                <div className="canvas-context-menu-divider" />
                <button
                  type="button"
                  className="canvas-context-menu-item canvas-context-menu-item-danger"
                  onClick={() => {
                    const section = editor.sections[contextMenu.sectionIndex];
                    const container =
                      section?.containers?.[contextMenu.containerIndex!];
                    if (section && container) {
                      useEditorStore
                        .getState()
                        .deleteContainer(section._key, container._key);
                    }
                    setSelectedBlockKey(null);
                    setContextMenu(null);
                  }}
                >
                  Delete Container
                </button>
              </>
            )}
          {contextMenu.elementType === "section" && (
            <>
              <button
                type="button"
                className="canvas-context-menu-item"
                onClick={() => {
                  editor.handleSectionMoveUp(contextMenu.sectionIndex);
                  setContextMenu(null);
                }}
              >
                Move Up
              </button>
              <button
                type="button"
                className="canvas-context-menu-item"
                onClick={() => {
                  editor.handleSectionMoveDown(contextMenu.sectionIndex);
                  setContextMenu(null);
                }}
              >
                Move Down
              </button>
              <div className="canvas-context-menu-divider" />
              <button
                type="button"
                className="canvas-context-menu-item"
                onClick={() => {
                  editor.handleSectionDuplicate(contextMenu.sectionIndex);
                  setContextMenu(null);
                }}
              >
                Duplicate
              </button>
              <div className="canvas-context-menu-divider" />
              <button
                type="button"
                className="canvas-context-menu-item"
                onClick={() => {
                  setSaveToLibrarySection({
                    section: editor.sections[contextMenu.sectionIndex],
                    index: contextMenu.sectionIndex,
                  });
                  setContextMenu(null);
                }}
              >
                Save to Library
              </button>
              <button
                type="button"
                className="canvas-context-menu-item canvas-context-menu-item-danger"
                onClick={() => {
                  editor.handleSectionDelete(contextMenu.sectionIndex);
                  setSelectedBlockKey(null);
                  setContextMenu(null);
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}

      {/* Save section to library dialog */}
      <SaveToLibraryDialog
        tenantId={id}
        open={!!saveToLibrarySection}
        onOpenChange={(open) => !open && setSaveToLibrarySection(null)}
        type="SECTION"
        content={
          saveToLibrarySection
            ? (saveToLibrarySection.section as unknown as Record<
                string,
                unknown
              >)
            : {}
        }
        defaultName={
          saveToLibrarySection
            ? `Section ${saveToLibrarySection.index + 1}`
            : ""
        }
      />
    </>
  );
}
