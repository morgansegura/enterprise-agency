/**
 * Editor Store — Single source of truth for page data
 *
 * Section → Container → Block hierarchy with Zustand + Immer.
 * All structural mutations push a history snapshot for undo/redo.
 *
 * Uses the canonical types from @enterprise/tokens:
 * - Block: { _type, _key, data }
 * - Container: { _type: "container", _key, blocks, layout }
 * - Section: { _type: "section", _key, containers }
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { produce } from "immer";
import type { Block, Container, Section } from "@/lib/types/section";
import type { Page, PageSeo } from "@/lib/hooks/use-pages";
import { useEditorHistory } from "./editor-history";

// =============================================================================
// Helpers
// =============================================================================

function snapshot(state: EditorState) {
  const sections = state.page?.sections;
  if (sections) {
    useEditorHistory.getState().pushSnapshot(sections);
  }
}

function findBlockInContainer(
  blocks: Block[],
  key: string,
): Block | null {
  for (const block of blocks) {
    if (block._key === key) return block;
    // Nested blocks in container-type blocks (grid, flex, stack, columns)
    const children = (block.data?.blocks as Block[] | undefined);
    if (children) {
      const found = findBlockInContainer(children, key);
      if (found) return found;
    }
  }
  return null;
}

// =============================================================================
// Types
// =============================================================================

export interface BlockLocation {
  sectionKey: string;
  containerKey: string;
  index: number;
}

interface EditorState {
  page: Page | null;
  isDirty: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: Error | null;
}

interface EditorActions {
  // Page
  setPage: (page: Page | null) => void;
  updatePageMeta: (
    updates: Partial<
      Pick<Page, "title" | "slug" | "status" | "seo" | "headerId" | "footerId">
    >,
  ) => void;
  setDirty: (dirty: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: Error | null) => void;

  // Sections
  addSection: (section: Section, index?: number) => void;
  updateSection: (sectionKey: string, updates: Partial<Section>) => void;
  deleteSection: (sectionKey: string) => void;
  duplicateSection: (sectionKey: string) => void;
  moveSection: (sectionKey: string, newIndex: number) => void;

  // Containers
  addContainer: (
    sectionKey: string,
    container: Container,
    index?: number,
  ) => void;
  updateContainer: (
    sectionKey: string,
    containerKey: string,
    updates: Partial<Container>,
  ) => void;
  deleteContainer: (sectionKey: string, containerKey: string) => void;

  // Blocks
  addBlock: (
    sectionKey: string,
    containerKey: string,
    block: Block,
    index?: number,
  ) => void;
  updateBlock: (
    sectionKey: string,
    containerKey: string,
    blockKey: string,
    updates: Partial<Block>,
  ) => void;
  updateBlockData: (
    sectionKey: string,
    containerKey: string,
    blockKey: string,
    dataUpdates: Record<string, unknown>,
  ) => void;
  deleteBlock: (
    sectionKey: string,
    containerKey: string,
    blockKey: string,
  ) => void;
  moveBlock: (blockKey: string, from: BlockLocation, to: BlockLocation) => void;

  // Undo/redo
  undo: () => void;
  redo: () => void;

  // Lookups
  getSection: (sectionKey: string) => Section | undefined;
  getContainer: (
    sectionKey: string,
    containerKey: string,
  ) => Container | undefined;
  getBlock: (
    sectionKey: string,
    containerKey: string,
    blockKey: string,
  ) => Block | undefined;
  findBlock: (
    blockKey: string,
  ) => { sectionKey: string; containerKey: string; block: Block } | null;
}

type EditorStore = EditorState & EditorActions;

// =============================================================================
// Store
// =============================================================================

export const useEditorStore = create<EditorStore>()(
  devtools(
    (set, get) => ({
      page: null,
      isDirty: false,
      isLoading: false,
      isSaving: false,
      error: null,

      // Page
      setPage: (page) => {
        useEditorHistory.getState().clear();
        set({ page, isDirty: false }, false, "editor/setPage");
      },

      updatePageMeta: (updates) =>
        set(
          produce((state: EditorState) => {
            if (!state.page) return;
            Object.assign(state.page, updates);
            state.isDirty = true;
          }),
          false,
          "editor/updatePageMeta",
        ),

      setDirty: (isDirty) => set({ isDirty }, false, "editor/setDirty"),
      setLoading: (isLoading) =>
        set({ isLoading }, false, "editor/setLoading"),
      setSaving: (isSaving) => set({ isSaving }, false, "editor/setSaving"),
      setError: (error) => set({ error }, false, "editor/setError"),

      // Sections
      addSection: (section, index) =>
        set(
          produce((state: EditorState) => {
            if (!state.page?.sections) return;
            snapshot(state);
            if (index !== undefined) {
              state.page.sections.splice(index, 0, section);
            } else {
              state.page.sections.push(section);
            }
            state.isDirty = true;
          }),
          false,
          "editor/addSection",
        ),

      updateSection: (sectionKey, updates) =>
        set(
          produce((state: EditorState) => {
            if (!state.page?.sections) return;
            const section = state.page.sections.find(
              (s) => s._key === sectionKey,
            );
            if (section) {
              snapshot(state);
              Object.assign(section, updates);
              state.isDirty = true;
            }
          }),
          false,
          "editor/updateSection",
        ),

      deleteSection: (sectionKey) =>
        set(
          produce((state: EditorState) => {
            if (!state.page?.sections) return;
            snapshot(state);
            state.page.sections = state.page.sections.filter(
              (s) => s._key !== sectionKey,
            );
            state.isDirty = true;
          }),
          false,
          "editor/deleteSection",
        ),

      duplicateSection: (sectionKey) =>
        set(
          produce((state: EditorState) => {
            if (!state.page?.sections) return;
            const idx = state.page.sections.findIndex(
              (s) => s._key === sectionKey,
            );
            if (idx === -1) return;
            snapshot(state);

            const original = state.page.sections[idx];
            const clone = JSON.parse(JSON.stringify(original)) as Section;
            clone._key = crypto.randomUUID();
            for (const container of clone.containers) {
              container._key = crypto.randomUUID();
              container.blocks = container.blocks.map((b) => ({
                ...JSON.parse(JSON.stringify(b)),
                _key: crypto.randomUUID(),
              }));
            }
            state.page.sections.splice(idx + 1, 0, clone);
            state.isDirty = true;
          }),
          false,
          "editor/duplicateSection",
        ),

      moveSection: (sectionKey, newIndex) =>
        set(
          produce((state: EditorState) => {
            if (!state.page?.sections) return;
            const sections = state.page.sections;
            const oldIndex = sections.findIndex(
              (s) => s._key === sectionKey,
            );
            if (oldIndex === -1 || oldIndex === newIndex) return;

            snapshot(state);
            const [section] = sections.splice(oldIndex, 1);
            sections.splice(newIndex, 0, section);
            state.isDirty = true;
          }),
          false,
          "editor/moveSection",
        ),

      // Containers
      addContainer: (sectionKey, container, index) =>
        set(
          produce((state: EditorState) => {
            if (!state.page?.sections) return;
            const section = state.page.sections.find(
              (s) => s._key === sectionKey,
            );
            if (!section) return;

            snapshot(state);
            if (index !== undefined) {
              section.containers.splice(index, 0, container);
            } else {
              section.containers.push(container);
            }
            state.isDirty = true;
          }),
          false,
          "editor/addContainer",
        ),

      updateContainer: (sectionKey, containerKey, updates) =>
        set(
          produce((state: EditorState) => {
            if (!state.page?.sections) return;
            const section = state.page.sections.find(
              (s) => s._key === sectionKey,
            );
            if (!section) return;

            const container = section.containers.find(
              (c) => c._key === containerKey,
            );
            if (container) {
              snapshot(state);
              Object.assign(container, updates);
              state.isDirty = true;
            }
          }),
          false,
          "editor/updateContainer",
        ),

      deleteContainer: (sectionKey, containerKey) =>
        set(
          produce((state: EditorState) => {
            if (!state.page?.sections) return;
            const section = state.page.sections.find(
              (s) => s._key === sectionKey,
            );
            if (!section) return;

            snapshot(state);
            section.containers = section.containers.filter(
              (c) => c._key !== containerKey,
            );
            state.isDirty = true;
          }),
          false,
          "editor/deleteContainer",
        ),

      // Blocks
      addBlock: (sectionKey, containerKey, block, index) =>
        set(
          produce((state: EditorState) => {
            if (!state.page?.sections) return;
            const section = state.page.sections.find(
              (s) => s._key === sectionKey,
            );
            if (!section) return;

            const container = section.containers.find(
              (c) => c._key === containerKey,
            );
            if (!container) return;

            snapshot(state);
            if (index !== undefined) {
              container.blocks.splice(index, 0, block);
            } else {
              container.blocks.push(block);
            }
            state.isDirty = true;
          }),
          false,
          "editor/addBlock",
        ),

      updateBlock: (sectionKey, containerKey, blockKey, updates) =>
        set(
          produce((state: EditorState) => {
            if (!state.page?.sections) return;
            const section = state.page.sections.find(
              (s) => s._key === sectionKey,
            );
            if (!section) return;

            const container = section.containers.find(
              (c) => c._key === containerKey,
            );
            if (!container) return;

            const blockIdx = container.blocks.findIndex(
              (b) => b._key === blockKey,
            );
            if (blockIdx !== -1) {
              snapshot(state);
              Object.assign(container.blocks[blockIdx], updates);
              state.isDirty = true;
            }
          }),
          false,
          "editor/updateBlock",
        ),

      updateBlockData: (sectionKey, containerKey, blockKey, dataUpdates) =>
        set(
          produce((state: EditorState) => {
            if (!state.page?.sections) return;
            const section = state.page.sections.find(
              (s) => s._key === sectionKey,
            );
            if (!section) return;

            const container = section.containers.find(
              (c) => c._key === containerKey,
            );
            if (!container) return;

            const block = container.blocks.find((b) => b._key === blockKey);
            if (block) {
              snapshot(state);
              Object.assign(block.data, dataUpdates);
              state.isDirty = true;
            }
          }),
          false,
          "editor/updateBlockData",
        ),

      deleteBlock: (sectionKey, containerKey, blockKey) =>
        set(
          produce((state: EditorState) => {
            if (!state.page?.sections) return;
            const section = state.page.sections.find(
              (s) => s._key === sectionKey,
            );
            if (!section) return;

            const container = section.containers.find(
              (c) => c._key === containerKey,
            );
            if (!container) return;

            snapshot(state);
            container.blocks = container.blocks.filter(
              (b) => b._key !== blockKey,
            );
            state.isDirty = true;
          }),
          false,
          "editor/deleteBlock",
        ),

      moveBlock: (blockKey, from, to) =>
        set(
          produce((state: EditorState) => {
            if (!state.page?.sections) return;

            const fromSection = state.page.sections.find(
              (s) => s._key === from.sectionKey,
            );
            if (!fromSection) return;

            const fromContainer = fromSection.containers.find(
              (c) => c._key === from.containerKey,
            );
            if (!fromContainer) return;

            const blockIdx = fromContainer.blocks.findIndex(
              (b) => b._key === blockKey,
            );
            if (blockIdx === -1) return;

            const toSection = state.page.sections.find(
              (s) => s._key === to.sectionKey,
            );
            if (!toSection) return;

            const toContainer = toSection.containers.find(
              (c) => c._key === to.containerKey,
            );
            if (!toContainer) return;

            snapshot(state);
            const [block] = fromContainer.blocks.splice(blockIdx, 1);
            toContainer.blocks.splice(to.index, 0, block);
            state.isDirty = true;
          }),
          false,
          "editor/moveBlock",
        ),

      // Undo/redo
      undo: () => {
        const { page } = get();
        if (!page?.sections) return;
        useEditorHistory.getState().undo(page.sections, (sections) => {
          set(
            produce((state: EditorState) => {
              if (state.page) {
                state.page.sections = sections;
                state.isDirty = true;
              }
            }),
            false,
            "editor/undo",
          );
        });
      },

      redo: () => {
        const { page } = get();
        if (!page?.sections) return;
        useEditorHistory.getState().redo(page.sections, (sections) => {
          set(
            produce((state: EditorState) => {
              if (state.page) {
                state.page.sections = sections;
                state.isDirty = true;
              }
            }),
            false,
            "editor/redo",
          );
        });
      },

      // Lookups
      getSection: (sectionKey) => {
        const { page } = get();
        return page?.sections?.find((s) => s._key === sectionKey);
      },

      getContainer: (sectionKey, containerKey) => {
        const section = get().getSection(sectionKey);
        return section?.containers.find((c) => c._key === containerKey);
      },

      getBlock: (sectionKey, containerKey, blockKey) => {
        const container = get().getContainer(sectionKey, containerKey);
        return container?.blocks.find((b) => b._key === blockKey);
      },

      findBlock: (blockKey) => {
        const { page } = get();
        if (!page?.sections) return null;
        for (const section of page.sections) {
          for (const container of section.containers) {
            const found = findBlockInContainer(container.blocks, blockKey);
            if (found) {
              return {
                sectionKey: section._key,
                containerKey: container._key,
                block: found,
              };
            }
          }
        }
        return null;
      },
    }),
    { name: "EditorStore" },
  ),
);
