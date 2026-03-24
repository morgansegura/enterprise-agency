import { describe, it, expect, beforeEach } from "vitest";
import { useEditorStore } from "./editor-store";
import { useEditorHistory } from "./editor-history";
import type { Section, Container, Block } from "@/lib/types/section";
import type { Page } from "@/lib/hooks/use-pages";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

function makeBlock(
  key = "b1",
  type = "text-block",
  data: Record<string, unknown> = { text: "hello" },
): Block {
  return { _type: type, _key: key, data };
}

function makeContainer(key = "c1", blocks: Block[] = []): Container {
  return {
    _type: "container",
    _key: key,
    layout: { type: "stack" },
    blocks,
  };
}

function makeSection(key = "s1", containers: Container[] = []): Section {
  return {
    _type: "section",
    _key: key,
    containers,
  };
}

function makePage(overrides: Partial<Page> = {}): Page {
  return {
    id: "p1",
    title: "Test Page",
    slug: "test",
    sections: [],
    ...overrides,
  };
}

/** Build a fully populated page for mutation tests */
function makePopulatedPage(): Page {
  return makePage({
    sections: [
      makeSection("s1", [
        makeContainer("c1", [
          makeBlock("b1", "text-block", { text: "hello" }),
          makeBlock("b2", "heading-block", { text: "title", level: "h2" }),
        ]),
        makeContainer("c2", [
          makeBlock("b3", "image-block", { src: "/img.png" }),
        ]),
      ]),
      makeSection("s2", [
        makeContainer("c3", [makeBlock("b4", "text-block", { text: "world" })]),
      ]),
    ],
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resetStores() {
  useEditorHistory.setState({ past: [], future: [], maxSnapshots: 50 });
  useEditorStore.setState({
    page: null,
    isDirty: false,
    isLoading: false,
    isSaving: false,
    error: null,
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("EditorStore", () => {
  beforeEach(() => {
    resetStores();
  });

  // =========================================================================
  // Initial state
  // =========================================================================

  describe("initial state", () => {
    it("should start with page null", () => {
      expect(useEditorStore.getState().page).toBeNull();
    });

    it("should start with isDirty false", () => {
      expect(useEditorStore.getState().isDirty).toBe(false);
    });

    it("should start with isLoading false", () => {
      expect(useEditorStore.getState().isLoading).toBe(false);
    });

    it("should start with isSaving false", () => {
      expect(useEditorStore.getState().isSaving).toBe(false);
    });

    it("should start with error null", () => {
      expect(useEditorStore.getState().error).toBeNull();
    });
  });

  // =========================================================================
  // setPage / updatePageMeta
  // =========================================================================

  describe("setPage", () => {
    it("should set the page", () => {
      const page = makePage();
      useEditorStore.getState().setPage(page);
      expect(useEditorStore.getState().page).toEqual(page);
    });

    it("should reset isDirty to false", () => {
      useEditorStore.setState({ isDirty: true });
      useEditorStore.getState().setPage(makePage());
      expect(useEditorStore.getState().isDirty).toBe(false);
    });

    it("should clear editor history", () => {
      useEditorHistory.getState().pushSnapshot([makeSection("s1")]);
      expect(useEditorHistory.getState().past.length).toBeGreaterThan(0);

      useEditorStore.getState().setPage(makePage());
      expect(useEditorHistory.getState().past).toEqual([]);
      expect(useEditorHistory.getState().future).toEqual([]);
    });

    it("should accept null to clear the page", () => {
      useEditorStore.getState().setPage(makePage());
      useEditorStore.getState().setPage(null);
      expect(useEditorStore.getState().page).toBeNull();
    });
  });

  describe("updatePageMeta", () => {
    it("should update title", () => {
      useEditorStore.getState().setPage(makePage());
      useEditorStore.getState().updatePageMeta({ title: "New Title" });
      expect(useEditorStore.getState().page?.title).toBe("New Title");
    });

    it("should update slug", () => {
      useEditorStore.getState().setPage(makePage());
      useEditorStore.getState().updatePageMeta({ slug: "new-slug" });
      expect(useEditorStore.getState().page?.slug).toBe("new-slug");
    });

    it("should mark isDirty as true", () => {
      useEditorStore.getState().setPage(makePage());
      useEditorStore.getState().updatePageMeta({ title: "Changed" });
      expect(useEditorStore.getState().isDirty).toBe(true);
    });

    it("should do nothing when page is null", () => {
      useEditorStore.getState().updatePageMeta({ title: "Nope" });
      expect(useEditorStore.getState().page).toBeNull();
      expect(useEditorStore.getState().isDirty).toBe(false);
    });

    it("should support partial updates without overwriting other fields", () => {
      useEditorStore.getState().setPage(makePage({ status: "draft" }));
      useEditorStore.getState().updatePageMeta({ title: "Updated" });
      const page = useEditorStore.getState().page;
      expect(page?.title).toBe("Updated");
      expect(page?.status).toBe("draft");
    });
  });

  // =========================================================================
  // setError / clearError
  // =========================================================================

  describe("setError", () => {
    it("should set an error", () => {
      const err = new Error("Something failed");
      useEditorStore.getState().setError(err);
      expect(useEditorStore.getState().error).toBe(err);
    });

    it("should clear error when set to null", () => {
      useEditorStore.getState().setError(new Error("fail"));
      useEditorStore.getState().setError(null);
      expect(useEditorStore.getState().error).toBeNull();
    });
  });

  // =========================================================================
  // Section operations
  // =========================================================================

  describe("addSection", () => {
    it("should append a section to the end", () => {
      useEditorStore.getState().setPage(makePage());
      const section = makeSection("s-new");
      useEditorStore.getState().addSection(section);

      const sections = useEditorStore.getState().page?.sections;
      expect(sections).toHaveLength(1);
      expect(sections?.[0]._key).toBe("s-new");
    });

    it("should insert at a specific index", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      const section = makeSection("s-inserted");
      useEditorStore.getState().addSection(section, 1);

      const sections = useEditorStore.getState().page?.sections;
      expect(sections?.[1]._key).toBe("s-inserted");
      expect(sections).toHaveLength(3);
    });

    it("should mark isDirty as true", () => {
      useEditorStore.getState().setPage(makePage());
      useEditorStore.getState().addSection(makeSection("s1"));
      expect(useEditorStore.getState().isDirty).toBe(true);
    });

    it("should push a history snapshot", () => {
      useEditorStore.getState().setPage(makePage());
      useEditorStore.getState().addSection(makeSection("s1"));
      expect(useEditorHistory.getState().past.length).toBeGreaterThan(0);
    });

    it("should do nothing when page is null", () => {
      useEditorStore.getState().addSection(makeSection("s1"));
      expect(useEditorStore.getState().page).toBeNull();
    });
  });

  describe("updateSection", () => {
    it("should update section properties", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().updateSection("s1", { paddingY: "lg" });
      const section = useEditorStore
        .getState()
        .page?.sections?.find((s) => s._key === "s1");
      expect(section?.paddingY).toBe("lg");
    });

    it("should mark isDirty", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().updateSection("s1", { background: "dark" });
      expect(useEditorStore.getState().isDirty).toBe(true);
    });

    it("should do nothing for a nonexistent section key", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore
        .getState()
        .updateSection("nonexistent", { paddingY: "lg" });
      expect(useEditorStore.getState().isDirty).toBe(false);
    });
  });

  describe("deleteSection", () => {
    it("should remove the section", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().deleteSection("s1");
      const sections = useEditorStore.getState().page?.sections;
      expect(sections).toHaveLength(1);
      expect(sections?.[0]._key).toBe("s2");
    });

    it("should mark isDirty", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().deleteSection("s1");
      expect(useEditorStore.getState().isDirty).toBe(true);
    });

    it("should push a history snapshot", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().deleteSection("s1");
      expect(useEditorHistory.getState().past.length).toBeGreaterThan(0);
    });
  });

  describe("moveSection", () => {
    it("should move a section to a new index", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().moveSection("s2", 0);

      const sections = useEditorStore.getState().page?.sections;
      expect(sections?.[0]._key).toBe("s2");
      expect(sections?.[1]._key).toBe("s1");
    });

    it("should do nothing when moving to the same index", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().moveSection("s1", 0);
      // isDirty should still be false because the move was a no-op
      expect(useEditorStore.getState().isDirty).toBe(false);
    });

    it("should do nothing for a nonexistent section key", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().moveSection("nonexistent", 0);
      expect(useEditorStore.getState().isDirty).toBe(false);
    });
  });

  describe("duplicateSection", () => {
    it("should insert a duplicate after the original", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().duplicateSection("s1");

      const sections = useEditorStore.getState().page?.sections;
      expect(sections).toHaveLength(3);
      // Duplicate inserted at index 1
      expect(sections?.[0]._key).toBe("s1");
      expect(sections?.[2]._key).toBe("s2");
    });

    it("should assign new keys to the duplicated section and its children", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().duplicateSection("s1");

      const sections = useEditorStore.getState().page?.sections;
      const dup = sections?.[1];
      expect(dup?._key).not.toBe("s1");
      // Container keys should differ
      dup?.containers.forEach((c) => {
        expect(c._key).not.toBe("c1");
        expect(c._key).not.toBe("c2");
      });
    });

    it("should mark isDirty", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().duplicateSection("s1");
      expect(useEditorStore.getState().isDirty).toBe(true);
    });

    it("should do nothing for a nonexistent section key", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().duplicateSection("nonexistent");
      expect(useEditorStore.getState().page?.sections).toHaveLength(2);
      expect(useEditorStore.getState().isDirty).toBe(false);
    });
  });

  // =========================================================================
  // Container operations
  // =========================================================================

  describe("addContainer", () => {
    it("should append a container to the section", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      const container = makeContainer("c-new");
      useEditorStore.getState().addContainer("s1", container);

      const section = useEditorStore
        .getState()
        .page?.sections?.find((s) => s._key === "s1");
      expect(section?.containers).toHaveLength(3);
      expect(section?.containers[2]._key).toBe("c-new");
    });

    it("should insert at a specific index", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      const container = makeContainer("c-inserted");
      useEditorStore.getState().addContainer("s1", container, 0);

      const section = useEditorStore
        .getState()
        .page?.sections?.find((s) => s._key === "s1");
      expect(section?.containers[0]._key).toBe("c-inserted");
    });

    it("should mark isDirty", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().addContainer("s1", makeContainer("c-new"));
      expect(useEditorStore.getState().isDirty).toBe(true);
    });

    it("should do nothing for a nonexistent section key", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore
        .getState()
        .addContainer("nonexistent", makeContainer("c-new"));
      expect(useEditorStore.getState().isDirty).toBe(false);
    });
  });

  describe("updateContainer", () => {
    it("should update container properties", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().updateContainer("s1", "c1", {
        layout: { type: "flex", direction: "row" },
      });

      const container = useEditorStore
        .getState()
        .page?.sections?.find((s) => s._key === "s1")
        ?.containers.find((c) => c._key === "c1");
      expect(container?.layout.type).toBe("flex");
    });

    it("should mark isDirty", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().updateContainer("s1", "c1", { paddingX: "lg" });
      expect(useEditorStore.getState().isDirty).toBe(true);
    });

    it("should do nothing for a nonexistent container key", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore
        .getState()
        .updateContainer("s1", "nonexistent", { paddingX: "lg" });
      expect(useEditorStore.getState().isDirty).toBe(false);
    });
  });

  describe("deleteContainer", () => {
    it("should remove the container from the section", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().deleteContainer("s1", "c1");

      const section = useEditorStore
        .getState()
        .page?.sections?.find((s) => s._key === "s1");
      expect(section?.containers).toHaveLength(1);
      expect(section?.containers[0]._key).toBe("c2");
    });

    it("should mark isDirty", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().deleteContainer("s1", "c1");
      expect(useEditorStore.getState().isDirty).toBe(true);
    });
  });

  // =========================================================================
  // Block operations
  // =========================================================================

  describe("addBlock", () => {
    it("should append a block to the container", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      const block = makeBlock("b-new", "text-block", { text: "new" });
      useEditorStore.getState().addBlock("s1", "c1", block);

      const container = useEditorStore
        .getState()
        .page?.sections?.find((s) => s._key === "s1")
        ?.containers.find((c) => c._key === "c1");
      expect(container?.blocks).toHaveLength(3);
      expect(container?.blocks[2]._key).toBe("b-new");
    });

    it("should insert at a specific index", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      const block = makeBlock("b-inserted");
      useEditorStore.getState().addBlock("s1", "c1", block, 0);

      const container = useEditorStore
        .getState()
        .page?.sections?.find((s) => s._key === "s1")
        ?.containers.find((c) => c._key === "c1");
      expect(container?.blocks[0]._key).toBe("b-inserted");
    });

    it("should mark isDirty", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().addBlock("s1", "c1", makeBlock("b-new"));
      expect(useEditorStore.getState().isDirty).toBe(true);
    });

    it("should push a history snapshot", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().addBlock("s1", "c1", makeBlock("b-new"));
      expect(useEditorHistory.getState().past.length).toBeGreaterThan(0);
    });

    it("should do nothing for a nonexistent container key", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore
        .getState()
        .addBlock("s1", "nonexistent", makeBlock("b-new"));
      expect(useEditorStore.getState().isDirty).toBe(false);
    });
  });

  describe("updateBlock", () => {
    it("should update block properties", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().updateBlock("s1", "c1", "b1", {
        _type: "heading-block",
      });

      const block = useEditorStore
        .getState()
        .page?.sections?.find((s) => s._key === "s1")
        ?.containers.find((c) => c._key === "c1")
        ?.blocks.find((b) => b._key === "b1");
      expect(block?._type).toBe("heading-block");
    });

    it("should mark isDirty", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().updateBlock("s1", "c1", "b1", {
        _type: "updated-type",
      });
      expect(useEditorStore.getState().isDirty).toBe(true);
    });

    it("should do nothing for a nonexistent block key", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().updateBlock("s1", "c1", "nonexistent", {
        _type: "nope",
      });
      expect(useEditorStore.getState().isDirty).toBe(false);
    });
  });

  describe("updateBlockData", () => {
    it("should merge data updates into the block", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().updateBlockData("s1", "c1", "b1", {
        text: "updated",
        color: "red",
      });

      const block = useEditorStore
        .getState()
        .page?.sections?.find((s) => s._key === "s1")
        ?.containers.find((c) => c._key === "c1")
        ?.blocks.find((b) => b._key === "b1");
      expect(block?.data.text).toBe("updated");
      expect(block?.data.color).toBe("red");
    });

    it("should preserve existing data fields not in the update", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().updateBlockData("s1", "c1", "b2", {
        text: "new title",
      });

      const block = useEditorStore
        .getState()
        .page?.sections?.find((s) => s._key === "s1")
        ?.containers.find((c) => c._key === "c1")
        ?.blocks.find((b) => b._key === "b2");
      expect(block?.data.text).toBe("new title");
      expect(block?.data.level).toBe("h2");
    });

    it("should mark isDirty", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore
        .getState()
        .updateBlockData("s1", "c1", "b1", { text: "x" });
      expect(useEditorStore.getState().isDirty).toBe(true);
    });
  });

  describe("deleteBlock", () => {
    it("should remove the block from the container", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().deleteBlock("s1", "c1", "b1");

      const container = useEditorStore
        .getState()
        .page?.sections?.find((s) => s._key === "s1")
        ?.containers.find((c) => c._key === "c1");
      expect(container?.blocks).toHaveLength(1);
      expect(container?.blocks[0]._key).toBe("b2");
    });

    it("should mark isDirty", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().deleteBlock("s1", "c1", "b1");
      expect(useEditorStore.getState().isDirty).toBe(true);
    });
  });

  describe("moveBlock", () => {
    it("should move a block within the same container", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().moveBlock(
        "b1",
        {
          sectionKey: "s1",
          containerKey: "c1",
          index: 0,
        },
        {
          sectionKey: "s1",
          containerKey: "c1",
          index: 1,
        },
      );

      const container = useEditorStore
        .getState()
        .page?.sections?.find((s) => s._key === "s1")
        ?.containers.find((c) => c._key === "c1");
      expect(container?.blocks[0]._key).toBe("b2");
      expect(container?.blocks[1]._key).toBe("b1");
    });

    it("should move a block across containers", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().moveBlock(
        "b1",
        {
          sectionKey: "s1",
          containerKey: "c1",
          index: 0,
        },
        {
          sectionKey: "s1",
          containerKey: "c2",
          index: 0,
        },
      );

      const fromContainer = useEditorStore
        .getState()
        .page?.sections?.find((s) => s._key === "s1")
        ?.containers.find((c) => c._key === "c1");
      const toContainer = useEditorStore
        .getState()
        .page?.sections?.find((s) => s._key === "s1")
        ?.containers.find((c) => c._key === "c2");

      expect(fromContainer?.blocks).toHaveLength(1);
      expect(toContainer?.blocks).toHaveLength(2);
      expect(toContainer?.blocks[0]._key).toBe("b1");
    });

    it("should move a block across sections", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().moveBlock(
        "b1",
        {
          sectionKey: "s1",
          containerKey: "c1",
          index: 0,
        },
        {
          sectionKey: "s2",
          containerKey: "c3",
          index: 0,
        },
      );

      const toContainer = useEditorStore
        .getState()
        .page?.sections?.find((s) => s._key === "s2")
        ?.containers.find((c) => c._key === "c3");
      expect(toContainer?.blocks[0]._key).toBe("b1");
      expect(toContainer?.blocks).toHaveLength(2);
    });

    it("should mark isDirty", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().moveBlock(
        "b1",
        {
          sectionKey: "s1",
          containerKey: "c1",
          index: 0,
        },
        {
          sectionKey: "s1",
          containerKey: "c2",
          index: 0,
        },
      );
      expect(useEditorStore.getState().isDirty).toBe(true);
    });
  });

  // =========================================================================
  // findBlock lookup
  // =========================================================================

  describe("findBlock", () => {
    it("should find a block by key and return location info", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      const result = useEditorStore.getState().findBlock("b3");

      expect(result).not.toBeNull();
      expect(result?.sectionKey).toBe("s1");
      expect(result?.containerKey).toBe("c2");
      expect(result?.block._key).toBe("b3");
    });

    it("should return null for a nonexistent block", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      expect(useEditorStore.getState().findBlock("nonexistent")).toBeNull();
    });

    it("should return null when page is null", () => {
      expect(useEditorStore.getState().findBlock("b1")).toBeNull();
    });

    it("should find nested blocks inside container-type blocks", () => {
      const nestedBlock = makeBlock("b-nested", "text-block", {
        text: "nested",
      });
      const parentBlock: Block = {
        _type: "columns-block",
        _key: "b-parent",
        data: {
          blocks: [nestedBlock],
        },
      };
      const page = makePage({
        sections: [makeSection("s1", [makeContainer("c1", [parentBlock])])],
      });
      useEditorStore.getState().setPage(page);

      const result = useEditorStore.getState().findBlock("b-nested");
      expect(result).not.toBeNull();
      expect(result?.block._key).toBe("b-nested");
      expect(result?.sectionKey).toBe("s1");
      expect(result?.containerKey).toBe("c1");
    });
  });

  // =========================================================================
  // Lookups: getSection / getContainer / getBlock
  // =========================================================================

  describe("getSection", () => {
    it("should return the section by key", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      const section = useEditorStore.getState().getSection("s1");
      expect(section?._key).toBe("s1");
    });

    it("should return undefined for a nonexistent key", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      expect(useEditorStore.getState().getSection("nope")).toBeUndefined();
    });
  });

  describe("getContainer", () => {
    it("should return the container by section and container keys", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      const container = useEditorStore.getState().getContainer("s1", "c1");
      expect(container?._key).toBe("c1");
    });

    it("should return undefined for a nonexistent container key", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      expect(
        useEditorStore.getState().getContainer("s1", "nope"),
      ).toBeUndefined();
    });
  });

  describe("getBlock", () => {
    it("should return the block by all three keys", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      const block = useEditorStore.getState().getBlock("s1", "c1", "b1");
      expect(block?._key).toBe("b1");
    });

    it("should return undefined for a nonexistent block key", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      expect(
        useEditorStore.getState().getBlock("s1", "c1", "nope"),
      ).toBeUndefined();
    });
  });

  // =========================================================================
  // isDirty tracking
  // =========================================================================

  describe("isDirty tracking", () => {
    it("should be false after setPage", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      expect(useEditorStore.getState().isDirty).toBe(false);
    });

    it("should be true after addSection", () => {
      useEditorStore.getState().setPage(makePage());
      useEditorStore.getState().addSection(makeSection("s-new"));
      expect(useEditorStore.getState().isDirty).toBe(true);
    });

    it("should be true after deleteBlock", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().deleteBlock("s1", "c1", "b1");
      expect(useEditorStore.getState().isDirty).toBe(true);
    });

    it("should be resettable via setDirty", () => {
      useEditorStore.getState().setPage(makePopulatedPage());
      useEditorStore.getState().addSection(makeSection("s-new"));
      expect(useEditorStore.getState().isDirty).toBe(true);
      useEditorStore.getState().setDirty(false);
      expect(useEditorStore.getState().isDirty).toBe(false);
    });
  });

  // =========================================================================
  // Loading / Saving state helpers
  // =========================================================================

  describe("setLoading / setSaving", () => {
    it("should set isLoading", () => {
      useEditorStore.getState().setLoading(true);
      expect(useEditorStore.getState().isLoading).toBe(true);
      useEditorStore.getState().setLoading(false);
      expect(useEditorStore.getState().isLoading).toBe(false);
    });

    it("should set isSaving", () => {
      useEditorStore.getState().setSaving(true);
      expect(useEditorStore.getState().isSaving).toBe(true);
      useEditorStore.getState().setSaving(false);
      expect(useEditorStore.getState().isSaving).toBe(false);
    });
  });

  // =========================================================================
  // Undo / Redo integration
  // =========================================================================

  describe("undo / redo", () => {
    it("should undo the last structural change", () => {
      useEditorStore.getState().setPage(makePage({ sections: [] }));
      useEditorStore.getState().addSection(makeSection("s1"));

      expect(useEditorStore.getState().page?.sections).toHaveLength(1);

      useEditorStore.getState().undo();

      expect(useEditorStore.getState().page?.sections).toHaveLength(0);
    });

    it("should redo after an undo", () => {
      useEditorStore.getState().setPage(makePage({ sections: [] }));
      useEditorStore.getState().addSection(makeSection("s1"));
      useEditorStore.getState().undo();

      expect(useEditorStore.getState().page?.sections).toHaveLength(0);

      useEditorStore.getState().redo();

      expect(useEditorStore.getState().page?.sections).toHaveLength(1);
    });

    it("should do nothing when there is nothing to undo", () => {
      useEditorStore.getState().setPage(makePage({ sections: [] }));
      useEditorStore.getState().undo();
      expect(useEditorStore.getState().page?.sections).toHaveLength(0);
    });

    it("should do nothing when there is nothing to redo", () => {
      useEditorStore.getState().setPage(makePage({ sections: [] }));
      useEditorStore.getState().redo();
      expect(useEditorStore.getState().page?.sections).toHaveLength(0);
    });

    it("should do nothing when page is null", () => {
      useEditorStore.getState().undo();
      useEditorStore.getState().redo();
      expect(useEditorStore.getState().page).toBeNull();
    });

    it("should support multiple undo/redo cycles", () => {
      useEditorStore.getState().setPage(makePage({ sections: [] }));
      useEditorStore.getState().addSection(makeSection("s1"));
      useEditorStore.getState().addSection(makeSection("s2"));

      expect(useEditorStore.getState().page?.sections).toHaveLength(2);

      // Undo twice
      useEditorStore.getState().undo();
      expect(useEditorStore.getState().page?.sections).toHaveLength(1);

      useEditorStore.getState().undo();
      expect(useEditorStore.getState().page?.sections).toHaveLength(0);

      // Redo twice
      useEditorStore.getState().redo();
      expect(useEditorStore.getState().page?.sections).toHaveLength(1);

      useEditorStore.getState().redo();
      expect(useEditorStore.getState().page?.sections).toHaveLength(2);
    });
  });
});
