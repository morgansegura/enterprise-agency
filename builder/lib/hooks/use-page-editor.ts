import * as React from "react";
import {
  type Section,
  type Block,
  type Container,
} from "@/lib/hooks/use-pages";
import { blockRegistry } from "@/lib/editor";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { useEditorStore } from "@/lib/stores/editor-store";
import { useEditorHistory } from "@/lib/stores/editor-history";

// =============================================================================
// Helpers
// =============================================================================

function createDefaultContainer(): Container {
  return {
    _type: "container",
    _key: `container-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    layout: { type: "stack", gap: "md" },
    paddingX: "md",
    blocks: [],
  };
}

export function createDefaultSection(): Section {
  return {
    _type: "section",
    _key: `section-${Date.now()}`,
    width: "container",
    paddingTop: "lg",
    paddingBottom: "lg",
    containers: [createDefaultContainer()],
  };
}

function createDefaultBlock(blockType: string): Block {
  const normalizedType = blockType.endsWith("-block")
    ? blockType
    : `${blockType}-block`;

  const defaultBlock = blockRegistry.createDefault(normalizedType);
  if (!defaultBlock) {
    logger.warn(
      `Block type "${normalizedType}" not found in registry, using fallback`,
    );
    return { _key: `block-${Date.now()}`, _type: normalizedType, data: {} };
  }
  return defaultBlock;
}

// =============================================================================
// Hook — Zustand-backed adapter with index-based API for legacy components
// =============================================================================

const EMPTY_SECTIONS: Section[] = [];

export function usePageEditor(initialSections: Section[]) {
  // Subscribe to sections from Zustand store (single source of truth)
  // Use a stable empty array to avoid infinite re-renders from getSnapshot
  const sections = useEditorStore(
    (s) => (s.page?.sections as Section[] | undefined) ?? EMPTY_SECTIONS,
  );

  // Store actions
  const storeAddSection = useEditorStore((s) => s.addSection);
  const storeUpdateSection = useEditorStore((s) => s.updateSection);
  const storeDeleteSection = useEditorStore((s) => s.deleteSection);
  const storeDuplicateSection = useEditorStore((s) => s.duplicateSection);
  const storeMoveSection = useEditorStore((s) => s.moveSection);
  const storeAddContainer = useEditorStore((s) => s.addContainer);
  const storeAddBlock = useEditorStore((s) => s.addBlock);
  const storeUpdateBlock = useEditorStore((s) => s.updateBlock);
  const storeDeleteBlock = useEditorStore((s) => s.deleteBlock);
  const storeMoveBlock = useEditorStore((s) => s.moveBlock);
  const storeUndo = useEditorStore((s) => s.undo);
  const storeRedo = useEditorStore((s) => s.redo);

  // History reactivity for canUndo/canRedo
  const historyVersion = useEditorHistory((h) => h.past.length + h.future.length);
  const canUndo = useEditorHistory((h) => h.past.length > 0);
  const canRedo = useEditorHistory((h) => h.future.length > 0);
  // historyVersion subscription forces re-render when history changes
  React.useEffect(() => {
    void historyVersion;
  }, [historyVersion]);

  // Initialize the store with the loaded page sections (one-time per page)
  const serverLoadedRef = React.useRef(false);
  React.useEffect(() => {
    if (!serverLoadedRef.current) {
      const isFromServer =
        initialSections.some(
          (s) => s._key && !s._key.startsWith("section-"),
        ) ||
        initialSections.some(
          (s) => s.containers?.some((c) => (c.blocks?.length ?? 0) > 0),
        );

      // Always sync to store on mount; mark loaded once we have real server data
      const currentPage = useEditorStore.getState().page;
      const newPage =
        currentPage ??
        ({
          id: "local-page",
          title: "",
          slug: "",
          status: "draft",
          sections: initialSections,
        } as never);

      useEditorStore.getState().setPage({
        ...newPage,
        sections: initialSections,
      } as never);

      if (isFromServer) {
        serverLoadedRef.current = true;
      }
    }
  }, [initialSections]);

  // Keyboard shortcuts: Cmd/Ctrl+Z (undo), Cmd/Ctrl+Shift+Z or Ctrl+Y (redo)
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod) return;
      const target = e.target as HTMLElement;
      const tag = target.tagName?.toLowerCase();
      const isEditable =
        tag === "input" ||
        tag === "textarea" ||
        target.isContentEditable ||
        target.closest("[contenteditable='true']");
      if (isEditable) return;

      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        storeUndo();
      } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        e.preventDefault();
        storeRedo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [storeUndo, storeRedo]);

  // ==========================================================================
  // setSections — for components that need to do bulk updates
  // ==========================================================================

  const setSections = React.useCallback(
    (action: React.SetStateAction<Section[]>) => {
      const current =
        (useEditorStore.getState().page?.sections as Section[] | undefined) ??
        [];
      const next =
        typeof action === "function"
          ? (action as (p: Section[]) => Section[])(current)
          : action;
      const page = useEditorStore.getState().page;
      if (page) {
        useEditorStore.getState().setPage({
          ...page,
          sections: next,
        } as never);
      }
    },
    [],
  );

  // ==========================================================================
  // Index-based handlers — wrap key-based store actions
  // Looks up the section/container/block by index, then calls store with keys
  // ==========================================================================

  const getKeys = React.useCallback(
    (
      sectionIndex: number,
      containerIndex?: number,
      blockIndex?: number,
    ): {
      sectionKey?: string;
      containerKey?: string;
      blockKey?: string;
    } => {
      const current =
        (useEditorStore.getState().page?.sections as Section[] | undefined) ??
        [];
      const section = current[sectionIndex];
      if (!section) return {};
      const sectionKey = section._key;
      if (containerIndex === undefined) return { sectionKey };
      const container = section.containers?.[containerIndex];
      if (!container) return { sectionKey };
      const containerKey = container._key;
      if (blockIndex === undefined) return { sectionKey, containerKey };
      const block = container.blocks?.[blockIndex];
      return { sectionKey, containerKey, blockKey: block?._key };
    },
    [],
  );

  // --- Block operations ---

  const handleBlockChange = React.useCallback(
    (
      sectionIndex: number,
      containerIndex: number,
      blockIndex: number,
      updatedBlock: Block,
    ) => {
      const { sectionKey, containerKey, blockKey } = getKeys(
        sectionIndex,
        containerIndex,
        blockIndex,
      );
      if (!sectionKey || !containerKey || !blockKey) return;
      storeUpdateBlock(sectionKey, containerKey, blockKey, updatedBlock);
    },
    [getKeys, storeUpdateBlock],
  );

  const handleBlockDelete = React.useCallback(
    (sectionIndex: number, containerIndex: number, blockIndex: number) => {
      const { sectionKey, containerKey, blockKey } = getKeys(
        sectionIndex,
        containerIndex,
        blockIndex,
      );
      if (!sectionKey || !containerKey || !blockKey) return;
      storeDeleteBlock(sectionKey, containerKey, blockKey);
      toast.success("Block deleted");
    },
    [getKeys, storeDeleteBlock],
  );

  const handleBlockDuplicate = React.useCallback(
    (sectionIndex: number, containerIndex: number, blockIndex: number) => {
      const { sectionKey, containerKey, blockKey } = getKeys(
        sectionIndex,
        containerIndex,
        blockIndex,
      );
      if (!sectionKey || !containerKey || !blockKey) return;
      const block = useEditorStore
        .getState()
        .getBlock(sectionKey, containerKey, blockKey);
      if (!block) return;
      const duplicated: Block = {
        ...block,
        _key: `block-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      };
      storeAddBlock(sectionKey, containerKey, duplicated, blockIndex + 1);
      toast.success("Block duplicated");
    },
    [getKeys, storeAddBlock],
  );

  const handleBlockMoveUp = React.useCallback(
    (sectionIndex: number, containerIndex: number, blockIndex: number) => {
      if (blockIndex === 0) return;
      const { sectionKey, containerKey, blockKey } = getKeys(
        sectionIndex,
        containerIndex,
        blockIndex,
      );
      if (!sectionKey || !containerKey || !blockKey) return;
      storeMoveBlock(
        blockKey,
        { sectionKey, containerKey, index: blockIndex },
        { sectionKey, containerKey, index: blockIndex - 1 },
      );
    },
    [getKeys, storeMoveBlock],
  );

  const handleBlockMoveDown = React.useCallback(
    (sectionIndex: number, containerIndex: number, blockIndex: number) => {
      const { sectionKey, containerKey, blockKey } = getKeys(
        sectionIndex,
        containerIndex,
        blockIndex,
      );
      if (!sectionKey || !containerKey || !blockKey) return;
      storeMoveBlock(
        blockKey,
        { sectionKey, containerKey, index: blockIndex },
        { sectionKey, containerKey, index: blockIndex + 1 },
      );
    },
    [getKeys, storeMoveBlock],
  );

  const handleBlockReorder = React.useCallback(
    (
      sectionIndex: number,
      containerIndex: number,
      fromIndex: number,
      toIndex: number,
    ) => {
      const { sectionKey, containerKey, blockKey } = getKeys(
        sectionIndex,
        containerIndex,
        fromIndex,
      );
      if (!sectionKey || !containerKey || !blockKey) return;
      storeMoveBlock(
        blockKey,
        { sectionKey, containerKey, index: fromIndex },
        { sectionKey, containerKey, index: toIndex },
      );
    },
    [getKeys, storeMoveBlock],
  );

  const handleAddBlockToContainer = React.useCallback(
    (sectionIndex: number, containerIndex: number, blockType: string) => {
      const { sectionKey, containerKey } = getKeys(
        sectionIndex,
        containerIndex,
      );
      if (!sectionKey || !containerKey) return;
      const newBlock = createDefaultBlock(blockType);
      storeAddBlock(sectionKey, containerKey, newBlock);
      toast.success("Block added!");
    },
    [getKeys, storeAddBlock],
  );

  // --- Section operations ---

  const handleSectionChange = React.useCallback(
    (sectionIndex: number, updatedSection: Section) => {
      const { sectionKey } = getKeys(sectionIndex);
      if (!sectionKey) return;
      storeUpdateSection(sectionKey, updatedSection);
    },
    [getKeys, storeUpdateSection],
  );

  const handleSectionDelete = React.useCallback(
    (sectionIndex: number) => {
      const { sectionKey } = getKeys(sectionIndex);
      if (!sectionKey) return;
      storeDeleteSection(sectionKey);
      toast.success("Section deleted");
    },
    [getKeys, storeDeleteSection],
  );

  const handleAddSectionAt = React.useCallback(
    (index: number) => {
      const newSection = createDefaultSection();
      storeAddSection(newSection, index);
      toast.success("Section added");
    },
    [storeAddSection],
  );

  const handleSectionDuplicate = React.useCallback(
    (sectionIndex: number) => {
      const { sectionKey } = getKeys(sectionIndex);
      if (!sectionKey) return;
      storeDuplicateSection(sectionKey);
      toast.success("Section duplicated");
    },
    [getKeys, storeDuplicateSection],
  );

  const handleSectionMoveUp = React.useCallback(
    (sectionIndex: number) => {
      if (sectionIndex === 0) return;
      const { sectionKey } = getKeys(sectionIndex);
      if (!sectionKey) return;
      storeMoveSection(sectionKey, sectionIndex - 1);
    },
    [getKeys, storeMoveSection],
  );

  const handleSectionMoveDown = React.useCallback(
    (sectionIndex: number) => {
      const { sectionKey } = getKeys(sectionIndex);
      if (!sectionKey) return;
      storeMoveSection(sectionKey, sectionIndex + 1);
    },
    [getKeys, storeMoveSection],
  );

  const handleSectionReorder = React.useCallback(
    (fromIndex: number, toIndex: number) => {
      const { sectionKey } = getKeys(fromIndex);
      if (!sectionKey) return;
      storeMoveSection(sectionKey, toIndex);
    },
    [getKeys, storeMoveSection],
  );

  const handleAddContainerToSection = React.useCallback(
    (sectionIndex: number) => {
      const { sectionKey } = getKeys(sectionIndex);
      if (!sectionKey) return;
      const newContainer = createDefaultContainer();
      storeAddContainer(sectionKey, newContainer);
      toast.success("Container added!");
    },
    [getKeys, storeAddContainer],
  );

  return {
    sections,
    setSections,
    // History
    undo: storeUndo,
    redo: storeRedo,
    canUndo,
    canRedo,
    // Block operations
    handleBlockChange,
    handleBlockDelete,
    handleBlockDuplicate,
    handleBlockMoveUp,
    handleBlockMoveDown,
    handleBlockReorder,
    handleAddBlockToContainer,
    // Section operations
    handleSectionChange,
    handleSectionDelete,
    handleAddSectionAt,
    handleSectionDuplicate,
    handleSectionMoveUp,
    handleSectionMoveDown,
    handleSectionReorder,
    handleAddContainerToSection,
  };
}
