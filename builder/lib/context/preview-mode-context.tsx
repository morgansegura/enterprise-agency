"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface PreviewModeContextValue {
  isPreviewMode: boolean;
  enterPreviewMode: () => void;
  exitPreviewMode: () => void;
  togglePreviewMode: () => void;
  // Page context for header display
  pageContext: { type: string; title: string } | null;
  setPageContext: (context: { type: string; title: string } | null) => void;
  // Whether the current page has its own toolbar (hides parent header)
  hasCustomToolbar: boolean;
  setHasCustomToolbar: (value: boolean) => void;
}

const PreviewModeContext = createContext<PreviewModeContextValue | null>(null);

export function PreviewModeProvider({ children }: { children: ReactNode }) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [pageContext, setPageContext] = useState<{
    type: string;
    title: string;
  } | null>(null);
  const [hasCustomToolbar, setHasCustomToolbar] = useState(false);

  const enterPreviewMode = useCallback(() => setIsPreviewMode(true), []);
  const exitPreviewMode = useCallback(() => setIsPreviewMode(false), []);
  const togglePreviewMode = useCallback(
    () => setIsPreviewMode((prev) => !prev),
    [],
  );

  return (
    <PreviewModeContext.Provider
      value={{
        isPreviewMode,
        enterPreviewMode,
        exitPreviewMode,
        togglePreviewMode,
        pageContext,
        setPageContext,
        hasCustomToolbar,
        setHasCustomToolbar,
      }}
    >
      {children}
    </PreviewModeContext.Provider>
  );
}

export function usePreviewMode() {
  const context = useContext(PreviewModeContext);
  if (!context) {
    throw new Error("usePreviewMode must be used within a PreviewModeProvider");
  }
  return context;
}

/**
 * Safe hook that returns default values if not within provider
 * Useful for components that may or may not be in preview mode context
 */
export function usePreviewModeOptional(): PreviewModeContextValue {
  const context = useContext(PreviewModeContext);
  return (
    context ?? {
      isPreviewMode: false,
      enterPreviewMode: () => {},
      exitPreviewMode: () => {},
      togglePreviewMode: () => {},
      pageContext: null,
      setPageContext: () => {},
      hasCustomToolbar: false,
      setHasCustomToolbar: () => {},
    }
  );
}
