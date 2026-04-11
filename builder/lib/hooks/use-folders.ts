import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "../api-client";
import { logger } from "../logger";

// =============================================================================
// Types
// =============================================================================

export interface MediaFolder {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  parentId: string | null;
  path: string;
  createdAt: string;
  updatedAt: string;
  children?: MediaFolder[];
  _count?: { assets: number; children: number };
}

export interface CreateFolderInput {
  name: string;
  parentId?: string | null;
}

export interface UpdateFolderInput {
  name?: string;
}

// =============================================================================
// Query keys
// =============================================================================

export const folderKeys = {
  all: ["folders"] as const,
  tree: (tenantId: string) => [...folderKeys.all, tenantId, "tree"] as const,
  list: (tenantId: string, parentId?: string | null) =>
    [...folderKeys.all, tenantId, "list", parentId ?? "root"] as const,
  detail: (tenantId: string, id: string) =>
    [...folderKeys.all, tenantId, "detail", id] as const,
};

// =============================================================================
// Queries
// =============================================================================

/**
 * Get the full folder tree for a tenant.
 */
export function useFolderTree(tenantId: string) {
  return useQuery({
    queryKey: folderKeys.tree(tenantId),
    queryFn: () =>
      apiClient.get<MediaFolder[]>(`/tenants/${tenantId}/media/folders/tree`),
    enabled: !!tenantId,
  });
}

/**
 * List folders at a specific parent (or root if parentId is null).
 */
export function useFolders(tenantId: string, parentId?: string | null) {
  return useQuery({
    queryKey: folderKeys.list(tenantId, parentId),
    queryFn: () => {
      const params = new URLSearchParams();
      if (parentId === null) params.set("parentId", "null");
      else if (parentId) params.set("parentId", parentId);
      const query = params.toString();
      return apiClient.get<MediaFolder[]>(
        `/tenants/${tenantId}/media/folders${query ? `?${query}` : ""}`,
      );
    },
    enabled: !!tenantId,
  });
}

// =============================================================================
// Mutations
// =============================================================================

export function useCreateFolder(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateFolderInput) =>
      apiClient.post<MediaFolder>(
        `/tenants/${tenantId}/media/folders`,
        input,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
      toast.success("Folder created");
    },
    onError: (error) => {
      logger.error("Failed to create folder", error as Error);
      toast.error("Failed to create folder");
    },
  });
}

export function useUpdateFolder(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFolderInput }) =>
      apiClient.patch<MediaFolder>(
        `/tenants/${tenantId}/media/folders/${id}`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
}

export function useDeleteFolder(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      deleteContents,
    }: {
      id: string;
      deleteContents?: boolean;
    }) => {
      const params = new URLSearchParams();
      if (deleteContents) params.set("deleteContents", "true");
      const query = params.toString();
      return apiClient.delete(
        `/tenants/${tenantId}/media/folders/${id}${query ? `?${query}` : ""}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
      toast.success("Folder deleted");
    },
    onError: () => toast.error("Failed to delete folder"),
  });
}

export function useMoveFolder(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      parentId,
    }: {
      id: string;
      parentId: string | null;
    }) =>
      apiClient.patch<MediaFolder>(
        `/tenants/${tenantId}/media/folders/${id}/move`,
        { parentId },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
}
