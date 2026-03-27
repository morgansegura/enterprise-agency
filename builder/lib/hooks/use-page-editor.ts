import * as React from "react";
import {
  type Section,
  type Block,
  type Container,
} from "@/lib/hooks/use-pages";
import { blockRegistry } from "@/lib/editor";
import { logger } from "@/lib/logger";
import { toast } from "sonner";

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

function getContainerBlocks(
  section: Section,
  containerIndex: number,
): Block[] {
  return section.containers?.[containerIndex]?.blocks ?? [];
}

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

function createDefaultBlock(blockType: string): Block {
  const defaultBlock = blockRegistry.createDefault(blockType);
  if (!defaultBlock) {
    logger.warn(
      `Block type "${blockType}" not found in registry, using fallback`,
    );
    return { _key: `block-${Date.now()}`, _type: blockType, data: {} };
  }
  return defaultBlock;
}

// =============================================================================
// Hook
// =============================================================================

export function usePageEditor(initialSections: Section[]) {
  const [sections, setSections] = React.useState<Section[]>(initialSections);
  const serverLoadedRef = React.useRef(false);

  // Sync from server until real page data arrives.
  // Once the server data has loaded (page fetch complete), local state becomes authoritative.
  React.useEffect(() => {
    if (!serverLoadedRef.current) {
      setSections(initialSections);
      // Consider loaded once we get data from the server (has _key from DB, not generated)
      const isFromServer = initialSections.some(
        (s) => s._key && !s._key.startsWith("section-"),
      ) || initialSections.some(
        (s) => s.containers?.some((c) => (c.blocks?.length ?? 0) > 0),
      );
      if (isFromServer) {
        serverLoadedRef.current = true;
      }
    }
  }, [initialSections]);

  // --- Block operations ---

  const handleBlockChange = React.useCallback(
    (
      sectionIndex: number,
      containerIndex: number,
      blockIndex: number,
      updatedBlock: Block,
    ) => {
      setSections((prev) => {
        const updated = [...prev];
        const blocks = getContainerBlocks(updated[sectionIndex], containerIndex);
        const newBlocks = blocks.map((block: Block, idx: number) =>
          idx === blockIndex ? updatedBlock : block,
        );
        updated[sectionIndex] = updateContainerBlocks(
          updated[sectionIndex],
          containerIndex,
          newBlocks,
        );
        return updated;
      });
    },
    [],
  );

  const handleBlockDelete = React.useCallback(
    (sectionIndex: number, containerIndex: number, blockIndex: number) => {
      setSections((prev) => {
        const updated = [...prev];
        const blocks = getContainerBlocks(updated[sectionIndex], containerIndex);
        const newBlocks = blocks.filter(
          (_: Block, idx: number) => idx !== blockIndex,
        );
        updated[sectionIndex] = updateContainerBlocks(
          updated[sectionIndex],
          containerIndex,
          newBlocks,
        );
        return updated;
      });
      toast.success("Block deleted");
    },
    [],
  );

  const handleBlockDuplicate = React.useCallback(
    (sectionIndex: number, containerIndex: number, blockIndex: number) => {
      setSections((prev) => {
        const updated = [...prev];
        const blocks = getContainerBlocks(updated[sectionIndex], containerIndex);
        const block = blocks[blockIndex];
        const duplicated = { ...block, _key: `block-${Date.now()}` };
        const newBlocks = [
          ...blocks.slice(0, blockIndex + 1),
          duplicated,
          ...blocks.slice(blockIndex + 1),
        ];
        updated[sectionIndex] = updateContainerBlocks(
          updated[sectionIndex],
          containerIndex,
          newBlocks,
        );
        return updated;
      });
      toast.success("Block duplicated");
    },
    [],
  );

  const handleBlockMoveUp = React.useCallback(
    (sectionIndex: number, containerIndex: number, blockIndex: number) => {
      if (blockIndex === 0) return;
      setSections((prev) => {
        const updated = [...prev];
        const blocks = [
          ...getContainerBlocks(updated[sectionIndex], containerIndex),
        ];
        [blocks[blockIndex - 1], blocks[blockIndex]] = [
          blocks[blockIndex],
          blocks[blockIndex - 1],
        ];
        updated[sectionIndex] = updateContainerBlocks(
          updated[sectionIndex],
          containerIndex,
          blocks,
        );
        return updated;
      });
    },
    [],
  );

  const handleBlockMoveDown = React.useCallback(
    (sectionIndex: number, containerIndex: number, blockIndex: number) => {
      setSections((prev) => {
        const blocks = getContainerBlocks(prev[sectionIndex], containerIndex);
        if (blockIndex >= blocks.length - 1) return prev;
        const updated = [...prev];
        const newBlocks = [...blocks];
        [newBlocks[blockIndex], newBlocks[blockIndex + 1]] = [
          newBlocks[blockIndex + 1],
          newBlocks[blockIndex],
        ];
        updated[sectionIndex] = updateContainerBlocks(
          updated[sectionIndex],
          containerIndex,
          newBlocks,
        );
        return updated;
      });
    },
    [],
  );

  const handleAddBlockToContainer = React.useCallback(
    (sectionIndex: number, containerIndex: number, blockType: string) => {
      const newBlock = createDefaultBlock(blockType);
      setSections((prev) => {
        const updated = [...prev];
        const blocks = getContainerBlocks(updated[sectionIndex], containerIndex);
        updated[sectionIndex] = updateContainerBlocks(
          updated[sectionIndex],
          containerIndex,
          [...blocks, newBlock],
        );
        return updated;
      });
      toast.success("Block added!");
    },
    [],
  );

  // --- Section operations ---

  const handleSectionChange = React.useCallback(
    (sectionIndex: number, updatedSection: Section) => {
      setSections((prev) => {
        const updated = [...prev];
        updated[sectionIndex] = updatedSection;
        return updated;
      });
    },
    [],
  );

  const handleSectionDelete = React.useCallback((sectionIndex: number) => {
    setSections((prev) => prev.filter((_, idx) => idx !== sectionIndex));
    toast.success("Section deleted");
  }, []);

  const handleAddSectionAt = React.useCallback((index: number) => {
    const newSection = createDefaultSection();
    setSections((prev) => {
      const updated = [...prev];
      updated.splice(index, 0, newSection);
      return updated;
    });
    toast.success("Section added");
  }, []);

  const handleSectionDuplicate = React.useCallback((sectionIndex: number) => {
    setSections((prev) => {
      const section = prev[sectionIndex];
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
      const updated = [...prev];
      updated.splice(sectionIndex + 1, 0, duplicated);
      return updated;
    });
    toast.success("Section duplicated");
  }, []);

  const handleSectionMoveUp = React.useCallback((sectionIndex: number) => {
    if (sectionIndex === 0) return;
    setSections((prev) => {
      const updated = [...prev];
      [updated[sectionIndex - 1], updated[sectionIndex]] = [
        updated[sectionIndex],
        updated[sectionIndex - 1],
      ];
      return updated;
    });
  }, []);

  const handleSectionMoveDown = React.useCallback((sectionIndex: number) => {
    setSections((prev) => {
      if (sectionIndex >= prev.length - 1) return prev;
      const updated = [...prev];
      [updated[sectionIndex], updated[sectionIndex + 1]] = [
        updated[sectionIndex + 1],
        updated[sectionIndex],
      ];
      return updated;
    });
  }, []);

  const handleAddContainerToSection = React.useCallback(
    (sectionIndex: number) => {
      const newContainer = createDefaultContainer();
      setSections((prev) => {
        const updated = [...prev];
        const containers = updated[sectionIndex].containers ?? [];
        updated[sectionIndex] = {
          ...updated[sectionIndex],
          containers: [...containers, newContainer],
        };
        return updated;
      });
      toast.success("Container added!");
    },
    [],
  );

  return {
    sections,
    setSections,
    // Block operations
    handleBlockChange,
    handleBlockDelete,
    handleBlockDuplicate,
    handleBlockMoveUp,
    handleBlockMoveDown,
    handleAddBlockToContainer,
    // Section operations
    handleSectionChange,
    handleSectionDelete,
    handleAddSectionAt,
    handleSectionDuplicate,
    handleSectionMoveUp,
    handleSectionMoveDown,
    handleAddContainerToSection,
  };
}
