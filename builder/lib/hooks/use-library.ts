import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "../api-client";
import { logger } from "../logger";
import { queryKeys } from "./query-keys";

// =============================================================================
// Types
// =============================================================================

export type LibraryItemType =
  | "SECTION"
  | "BLOCK"
  | "HEADER"
  | "FOOTER"
  | "MENU";

export interface LibraryItem {
  id: string;
  tenantId: string | null;
  name: string;
  slug: string;
  description: string | null;
  scope: "TENANT" | "GLOBAL";
  type: LibraryItemType;
  content: Record<string, unknown>;
  category: string | null;
  tags: string[];
  thumbnailUrl: string | null;
  usageCount: number;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLibraryItemInput {
  name: string;
  description?: string;
  type: LibraryItemType;
  content: Record<string, unknown>;
  category?: string;
  tags?: string[];
  thumbnailUrl?: string;
}

export interface UpdateLibraryItemInput {
  name?: string;
  description?: string;
  category?: string;
  tags?: string[];
  isFavorite?: boolean;
  thumbnailUrl?: string;
}

// =============================================================================
// Queries
// =============================================================================

/**
 * List library items for a tenant. Filters: type, category, search.
 */
export function useLibraryItems(
  tenantId: string,
  filters?: {
    type?: LibraryItemType;
    category?: string;
    search?: string;
    scope?: "TENANT" | "GLOBAL" | "ALL";
  },
) {
  return useQuery({
    queryKey: queryKeys.library.list(tenantId, filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.type) params.set("type", filters.type);
      if (filters?.category) params.set("category", filters.category);
      if (filters?.search) params.set("search", filters.search);
      if (filters?.scope) params.set("scope", filters.scope);
      const query = params.toString();
      return apiClient.get<LibraryItem[]>(
        `/tenants/${tenantId}/library${query ? `?${query}` : ""}`,
      );
    },
    enabled: !!tenantId,
  });
}

/**
 * Get a single library item.
 */
export function useLibraryItem(tenantId: string, id: string) {
  return useQuery({
    queryKey: queryKeys.library.detail(tenantId, id),
    queryFn: () =>
      apiClient.get<LibraryItem>(`/tenants/${tenantId}/library/${id}`),
    enabled: !!tenantId && !!id,
  });
}

// =============================================================================
// Mutations
// =============================================================================

/**
 * Save an element (section, container, or block) to the library.
 */
export function useCreateLibraryItem(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateLibraryItemInput) =>
      apiClient.post<LibraryItem>(`/tenants/${tenantId}/library`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.library.lists() });
      toast.success("Saved to library");
    },
    onError: (error) => {
      logger.error("Failed to save to library", error as Error);
      toast.error("Failed to save to library");
    },
  });
}

/**
 * Update library item metadata.
 */
export function useUpdateLibraryItem(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateLibraryItemInput;
    }) => apiClient.patch<LibraryItem>(`/tenants/${tenantId}/library/${id}`, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.library.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.library.detail(tenantId, id),
      });
    },
  });
}

/**
 * Delete a library item.
 */
export function useDeleteLibraryItem(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/tenants/${tenantId}/library/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.library.lists() });
      toast.success("Deleted from library");
    },
    onError: () => toast.error("Failed to delete library item"),
  });
}

/**
 * Increment usage count when a library item is inserted.
 */
export function useUseLibraryItem(tenantId: string) {
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.post(`/tenants/${tenantId}/library/${id}/use`),
  });
}

/**
 * Toggle favorite on a library item.
 */
export function useToggleFavorite(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.post<LibraryItem>(
        `/tenants/${tenantId}/library/${id}/favorite`,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.library.lists() });
    },
  });
}
