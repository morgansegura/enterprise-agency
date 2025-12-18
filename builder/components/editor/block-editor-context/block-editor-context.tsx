"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Editor } from "@tiptap/core";

interface BlockEditorContextValue {
  /** Currently active TipTap editor for text formatting */
  activeEditor: Editor | null;
  /** Register a TipTap editor as the active one */
  setActiveEditor: (editor: Editor | null) => void;
  /** Check if there's an active selection in the editor */
  hasSelection: boolean;
  /** Update selection state */
  setHasSelection: (hasSelection: boolean) => void;
}

const BlockEditorContext = createContext<BlockEditorContextValue | null>(null);

export function BlockEditorProvider({ children }: { children: ReactNode }) {
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);
  const [hasSelection, setHasSelection] = useState(false);

  return (
    <BlockEditorContext.Provider
      value={{
        activeEditor,
        setActiveEditor,
        hasSelection,
        setHasSelection,
      }}
    >
      {children}
    </BlockEditorContext.Provider>
  );
}

export function useBlockEditor() {
  const context = useContext(BlockEditorContext);
  if (!context) {
    // Return a no-op context if not wrapped in provider
    return {
      activeEditor: null,
      setActiveEditor: () => {},
      hasSelection: false,
      setHasSelection: () => {},
    };
  }
  return context;
}

/**
 * Hook for text formatting commands
 * Returns functions to apply formatting to the active editor
 */
export function useTextFormatting() {
  const { activeEditor, hasSelection } = useBlockEditor();

  const toggleBold = useCallback(() => {
    activeEditor?.chain().focus().toggleBold().run();
  }, [activeEditor]);

  const toggleItalic = useCallback(() => {
    activeEditor?.chain().focus().toggleItalic().run();
  }, [activeEditor]);

  const setLink = useCallback(() => {
    if (!activeEditor) return;

    const previousUrl = activeEditor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl || "https://");

    if (url === null) return;

    if (url === "") {
      activeEditor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    activeEditor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [activeEditor]);

  const removeLink = useCallback(() => {
    activeEditor?.chain().focus().unsetLink().run();
  }, [activeEditor]);

  const isBold = activeEditor?.isActive("bold") ?? false;
  const isItalic = activeEditor?.isActive("italic") ?? false;
  const isLink = activeEditor?.isActive("link") ?? false;

  return {
    canFormat: Boolean(activeEditor) && hasSelection,
    toggleBold,
    toggleItalic,
    setLink,
    removeLink,
    isBold,
    isItalic,
    isLink,
  };
}
