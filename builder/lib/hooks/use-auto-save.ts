import { useCallback, useRef, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { logger } from "../logger";
import type { Page } from "./use-pages";

interface AutoSaveOptions {
  tenantId: string;
  pageId: string;
  debounceMs?: number;
  onSaveStart?: () => void;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
}

interface AutoSaveState {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  error: Error | null;
}

export function useAutoSave({
  tenantId,
  pageId,
  debounceMs = 2000,
  onSaveStart,
  onSaveSuccess,
  onSaveError,
}: AutoSaveOptions) {
  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingDataRef = useRef<Partial<Page> | null>(null);

  const [state, setState] = useState<AutoSaveState>({
    isSaving: false,
    lastSaved: null,
    hasUnsavedChanges: false,
    error: null,
  });

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Page>) =>
      apiClient.patch<Page>(`/pages/${pageId}`, data),
    onMutate: () => {
      setState((prev) => ({ ...prev, isSaving: true, error: null }));
      onSaveStart?.();
    },
    onSuccess: () => {
      setState((prev) => ({
        ...prev,
        isSaving: false,
        lastSaved: new Date(),
        hasUnsavedChanges: false,
      }));
      queryClient.invalidateQueries({ queryKey: ["pages", tenantId, pageId] });
      logger.log("Auto-save completed");
      onSaveSuccess?.();
    },
    onError: (error: Error) => {
      setState((prev) => ({
        ...prev,
        isSaving: false,
        error,
      }));
      logger.error("Auto-save failed", error);
      onSaveError?.(error);
    },
  });

  const saveNow = useCallback(
    (data: Partial<Page>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      pendingDataRef.current = null;
      saveMutation.mutate(data);
    },
    [saveMutation],
  );

  const debouncedSave = useCallback(
    (data: Partial<Page>) => {
      pendingDataRef.current = data;
      setState((prev) => ({ ...prev, hasUnsavedChanges: true }));

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (pendingDataRef.current) {
          saveMutation.mutate(pendingDataRef.current);
          pendingDataRef.current = null;
        }
        timeoutRef.current = null;
      }, debounceMs);
    },
    [debounceMs, saveMutation],
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    pendingDataRef.current = null;
    setState((prev) => ({ ...prev, hasUnsavedChanges: false }));
  }, []);

  const flush = useCallback(() => {
    if (pendingDataRef.current) {
      saveNow(pendingDataRef.current);
    }
  }, [saveNow]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Warn on navigation with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [state.hasUnsavedChanges]);

  return {
    ...state,
    save: debouncedSave,
    saveNow,
    cancel,
    flush,
  };
}
