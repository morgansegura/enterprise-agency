import { describe, it, expect, beforeEach } from "vitest";
import { useEditorHistory } from "./editor-history";
import type { Section } from "@/lib/types/section";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Minimal valid section factory */
function makeSection(key: string, blockCount = 0): Section {
  return {
    _type: "section",
    _key: key,
    containers: [
      {
        _type: "container",
        _key: `${key}-c1`,
        layout: { type: "stack" },
        blocks: Array.from({ length: blockCount }, (_, i) => ({
          _type: "text-block",
          _key: `${key}-b${i}`,
          data: { text: `block-${i}` },
        })),
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("EditorHistory", () => {
  beforeEach(() => {
    useEditorHistory.setState({ past: [], future: [], maxSnapshots: 50 });
  });

  // -------------------------------------------------------------------------
  // Initial state
  // -------------------------------------------------------------------------

  describe("initial state", () => {
    it("should start with empty past and future arrays", () => {
      const { past, future } = useEditorHistory.getState();
      expect(past).toEqual([]);
      expect(future).toEqual([]);
    });

    it("should have maxSnapshots set to 50", () => {
      const { maxSnapshots } = useEditorHistory.getState();
      expect(maxSnapshots).toBe(50);
    });

    it("should report canUndo as false", () => {
      expect(useEditorHistory.getState().canUndo()).toBe(false);
    });

    it("should report canRedo as false", () => {
      expect(useEditorHistory.getState().canRedo()).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // pushSnapshot
  // -------------------------------------------------------------------------

  describe("pushSnapshot", () => {
    it("should add a serialized snapshot to past", () => {
      const sections: Section[] = [makeSection("s1")];
      useEditorHistory.getState().pushSnapshot(sections);

      const { past } = useEditorHistory.getState();
      expect(past).toHaveLength(1);
      expect(JSON.parse(past[0])).toEqual(sections);
    });

    it("should clear the future when a new snapshot is pushed", () => {
      const s1: Section[] = [makeSection("s1")];
      const s2: Section[] = [makeSection("s2")];

      // Push two snapshots, then undo to create a future entry
      useEditorHistory.getState().pushSnapshot(s1);
      useEditorHistory.getState().pushSnapshot(s2);
      useEditorHistory.getState().undo(s2, () => {});

      expect(useEditorHistory.getState().future.length).toBeGreaterThan(0);

      // A new push should wipe the future
      useEditorHistory.getState().pushSnapshot([makeSection("s3")]);
      expect(useEditorHistory.getState().future).toEqual([]);
    });

    it("should accumulate multiple snapshots", () => {
      for (let i = 0; i < 5; i++) {
        useEditorHistory.getState().pushSnapshot([makeSection(`s${i}`)]);
      }
      expect(useEditorHistory.getState().past).toHaveLength(5);
    });

    it("should enforce the maxSnapshots limit", () => {
      // Lower limit for testing
      useEditorHistory.setState({ maxSnapshots: 5 });

      for (let i = 0; i < 10; i++) {
        useEditorHistory.getState().pushSnapshot([makeSection(`s${i}`)]);
      }

      const { past } = useEditorHistory.getState();
      expect(past).toHaveLength(5);

      // The oldest snapshots should have been evicted; the last push was s9
      const newest = JSON.parse(past[past.length - 1]) as Section[];
      expect(newest[0]._key).toBe("s9");
    });

    it("should respect the default 50 snapshot limit", () => {
      for (let i = 0; i < 55; i++) {
        useEditorHistory.getState().pushSnapshot([makeSection(`s${i}`)]);
      }
      expect(useEditorHistory.getState().past).toHaveLength(50);
    });
  });

  // -------------------------------------------------------------------------
  // undo
  // -------------------------------------------------------------------------

  describe("undo", () => {
    it("should do nothing when past is empty", () => {
      const restoreFn = vi.fn();
      useEditorHistory.getState().undo([], restoreFn);

      expect(restoreFn).not.toHaveBeenCalled();
      expect(useEditorHistory.getState().past).toEqual([]);
      expect(useEditorHistory.getState().future).toEqual([]);
    });

    it("should restore the most recent snapshot", () => {
      const original: Section[] = [makeSection("s1")];
      const modified: Section[] = [makeSection("s1"), makeSection("s2")];

      useEditorHistory.getState().pushSnapshot(original);

      let restored: Section[] | null = null;
      useEditorHistory.getState().undo(modified, (sections) => {
        restored = sections;
      });

      expect(restored).toEqual(original);
    });

    it("should move the current state to future", () => {
      const original: Section[] = [makeSection("s1")];
      const current: Section[] = [makeSection("s2")];

      useEditorHistory.getState().pushSnapshot(original);
      useEditorHistory.getState().undo(current, () => {});

      const { future } = useEditorHistory.getState();
      expect(future).toHaveLength(1);
      expect(JSON.parse(future[0])).toEqual(current);
    });

    it("should remove the last entry from past", () => {
      useEditorHistory.getState().pushSnapshot([makeSection("s1")]);
      useEditorHistory.getState().pushSnapshot([makeSection("s2")]);

      expect(useEditorHistory.getState().past).toHaveLength(2);

      useEditorHistory.getState().undo([makeSection("s3")], () => {});

      expect(useEditorHistory.getState().past).toHaveLength(1);
    });

    it("should allow multiple consecutive undos", () => {
      const states: Section[][] = [
        [makeSection("s1")],
        [makeSection("s2")],
        [makeSection("s3")],
      ];

      states.forEach((s) => useEditorHistory.getState().pushSnapshot(s));

      let lastRestored: Section[] = [];
      // Undo 3 times (current is s4)
      useEditorHistory.getState().undo([makeSection("s4")], (s) => {
        lastRestored = s;
      });
      expect(lastRestored[0]._key).toBe("s3");

      useEditorHistory.getState().undo(lastRestored, (s) => {
        lastRestored = s;
      });
      expect(lastRestored[0]._key).toBe("s2");

      useEditorHistory.getState().undo(lastRestored, (s) => {
        lastRestored = s;
      });
      expect(lastRestored[0]._key).toBe("s1");

      // Past should now be empty, future should have 3 entries
      expect(useEditorHistory.getState().past).toHaveLength(0);
      expect(useEditorHistory.getState().future).toHaveLength(3);
    });
  });

  // -------------------------------------------------------------------------
  // redo
  // -------------------------------------------------------------------------

  describe("redo", () => {
    it("should do nothing when future is empty", () => {
      const restoreFn = vi.fn();
      useEditorHistory.getState().redo([], restoreFn);

      expect(restoreFn).not.toHaveBeenCalled();
    });

    it("should restore the next future snapshot", () => {
      const original: Section[] = [makeSection("s1")];
      const afterMutation: Section[] = [makeSection("s2")];

      useEditorHistory.getState().pushSnapshot(original);
      // Undo to populate future with afterMutation
      useEditorHistory.getState().undo(afterMutation, () => {});

      let restored: Section[] | null = null;
      useEditorHistory.getState().redo(original, (sections) => {
        restored = sections;
      });

      expect(restored).toEqual(afterMutation);
    });

    it("should move current state back to past on redo", () => {
      const s1: Section[] = [makeSection("s1")];
      const s2: Section[] = [makeSection("s2")];

      useEditorHistory.getState().pushSnapshot(s1);
      // Undo consumes s1 from past and moves s2 (current) to future
      useEditorHistory.getState().undo(s2, () => {});

      // Past is now empty, future has [s2]
      expect(useEditorHistory.getState().past).toHaveLength(0);

      // Redo: pushes current (s1, the restored state) to past, removes s2 from future
      useEditorHistory.getState().redo(s1, () => {});

      const { past } = useEditorHistory.getState();
      // Past should now have 1 entry (the current state we passed to redo)
      expect(past).toHaveLength(1);
      expect(JSON.parse(past[0])).toEqual(s1);
    });

    it("should remove the first entry from future", () => {
      const s1: Section[] = [makeSection("s1")];
      const s2: Section[] = [makeSection("s2")];
      const s3: Section[] = [makeSection("s3")];

      useEditorHistory.getState().pushSnapshot(s1);
      useEditorHistory.getState().pushSnapshot(s2);
      // Undo twice to populate future
      useEditorHistory.getState().undo(s3, () => {});
      useEditorHistory.getState().undo(s2, () => {});

      expect(useEditorHistory.getState().future).toHaveLength(2);

      useEditorHistory.getState().redo(s1, () => {});

      expect(useEditorHistory.getState().future).toHaveLength(1);
    });
  });

  // -------------------------------------------------------------------------
  // canUndo / canRedo
  // -------------------------------------------------------------------------

  describe("canUndo / canRedo", () => {
    it("canUndo should be true after a push", () => {
      useEditorHistory.getState().pushSnapshot([makeSection("s1")]);
      expect(useEditorHistory.getState().canUndo()).toBe(true);
    });

    it("canUndo should be false after undoing all snapshots", () => {
      useEditorHistory.getState().pushSnapshot([makeSection("s1")]);
      useEditorHistory.getState().undo([makeSection("s2")], () => {});
      expect(useEditorHistory.getState().canUndo()).toBe(false);
    });

    it("canRedo should be true after an undo", () => {
      useEditorHistory.getState().pushSnapshot([makeSection("s1")]);
      useEditorHistory.getState().undo([makeSection("s2")], () => {});
      expect(useEditorHistory.getState().canRedo()).toBe(true);
    });

    it("canRedo should be false after redoing all snapshots", () => {
      useEditorHistory.getState().pushSnapshot([makeSection("s1")]);
      useEditorHistory.getState().undo([makeSection("s2")], () => {});
      useEditorHistory.getState().redo([makeSection("s1")], () => {});
      expect(useEditorHistory.getState().canRedo()).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // clear
  // -------------------------------------------------------------------------

  describe("clear", () => {
    it("should empty both past and future", () => {
      useEditorHistory.getState().pushSnapshot([makeSection("s1")]);
      useEditorHistory.getState().pushSnapshot([makeSection("s2")]);
      useEditorHistory.getState().undo([makeSection("s3")], () => {});

      // Verify something exists before clearing
      expect(useEditorHistory.getState().past.length).toBeGreaterThan(0);
      expect(useEditorHistory.getState().future.length).toBeGreaterThan(0);

      useEditorHistory.getState().clear();

      expect(useEditorHistory.getState().past).toEqual([]);
      expect(useEditorHistory.getState().future).toEqual([]);
    });

    it("should be safe to call when already empty", () => {
      useEditorHistory.getState().clear();
      expect(useEditorHistory.getState().past).toEqual([]);
      expect(useEditorHistory.getState().future).toEqual([]);
    });

    it("canUndo and canRedo should be false after clear", () => {
      useEditorHistory.getState().pushSnapshot([makeSection("s1")]);
      useEditorHistory.getState().undo([makeSection("s2")], () => {});
      useEditorHistory.getState().clear();

      expect(useEditorHistory.getState().canUndo()).toBe(false);
      expect(useEditorHistory.getState().canRedo()).toBe(false);
    });
  });
});
