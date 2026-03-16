/**
 * Editor History — Snapshot-based undo/redo
 *
 * Stores serialized snapshots of page sections before each mutation.
 * Works alongside the editor store by subscribing to mutations.
 */

import { create } from "zustand";
import type { Section } from "@/lib/types/section";

interface HistoryState {
  past: string[];
  future: string[];
  maxSnapshots: number;
}

interface HistoryActions {
  pushSnapshot: (sections: Section[]) => void;
  undo: (
    currentSections: Section[],
    restoreFn: (sections: Section[]) => void,
  ) => void;
  redo: (
    currentSections: Section[],
    restoreFn: (sections: Section[]) => void,
  ) => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clear: () => void;
}

type HistoryStore = HistoryState & HistoryActions;

export const useEditorHistory = create<HistoryStore>()((set, get) => ({
  past: [],
  future: [],
  maxSnapshots: 50,

  pushSnapshot: (sections) => {
    const snapshot = JSON.stringify(sections);
    set((state) => ({
      past: [...state.past.slice(-(state.maxSnapshots - 1)), snapshot],
      future: [],
    }));
  },

  undo: (currentSections, restoreFn) => {
    const { past } = get();
    if (past.length === 0) return;

    const previousSnapshot = past[past.length - 1];
    const currentSnapshot = JSON.stringify(currentSections);

    set((state) => ({
      past: state.past.slice(0, -1),
      future: [currentSnapshot, ...state.future],
    }));

    restoreFn(JSON.parse(previousSnapshot));
  },

  redo: (currentSections, restoreFn) => {
    const { future } = get();
    if (future.length === 0) return;

    const nextSnapshot = future[0];
    const currentSnapshot = JSON.stringify(currentSections);

    set((state) => ({
      past: [...state.past, currentSnapshot],
      future: state.future.slice(1),
    }));

    restoreFn(JSON.parse(nextSnapshot));
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  clear: () => set({ past: [], future: [] }),
}));
