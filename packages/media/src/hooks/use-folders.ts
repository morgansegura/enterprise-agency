/**
 * Folder Hooks
 *
 * React Query hooks for folder operations.
 *
 * @module @enterprise/media/hooks
 */

"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type {
  MediaFolder,
  MediaFolderListItem,
  CreateFolderInput,
  UpdateFolderInput,
  MoveFolderInput,
  FolderTreeNode,
} from "../types";

// ============================================================================
// QUERY KEYS
// ============================================================================

export const folderKeys = {
  all: ["folders"] as const,
  lists: () => [...folderKeys.all, "list"] as const,
  list: (tenantId: string) => [...folderKeys.lists(), tenantId] as const,
  trees: () => [...folderKeys.all, "tree"] as const,
  tree: (tenantId: string) => [...folderKeys.trees(), tenantId] as const,
  details: () => [...folderKeys.all, "detail"] as const,
  detail: (tenantId: string, id: string) =>
    [...folderKeys.details(), tenantId, id] as const,
};

// ============================================================================
// TYPES
// ============================================================================

export interface FolderApiClient {
  /** Fetch flat folder list */
  list: (tenantId: string) => Promise<MediaFolderListItem[]>;
  /** Fetch folder tree */
  tree: (tenantId: string) => Promise<FolderTreeNode[]>;
  /** Fetch single folder */
  get: (tenantId: string, id: string) => Promise<MediaFolder>;
  /** Create folder */
  create: (tenantId: string, data: CreateFolderInput) => Promise<MediaFolder>;
  /** Update folder */
  update: (
    tenantId: string,
    id: string,
    data: UpdateFolderInput,
  ) => Promise<MediaFolder>;
  /** Delete folder */
  delete: (tenantId: string, id: string) => Promise<void>;
  /** Move folder */
  move: (
    tenantId: string,
    id: string,
    data: MoveFolderInput,
  ) => Promise<MediaFolder>;
}

export interface UseFoldersOptions {
  /** API client for folder operations */
  apiClient: FolderApiClient;
  /** Tenant ID */
  tenantId: string;
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to fetch flat folder list
 *
 * @example
 * ```tsx
 * const { data: folders } = useFolderList({ apiClient, tenantId });
 * ```
 */
export function useFolderList(
  options: UseFoldersOptions & {
    queryOptions?: Omit<
      UseQueryOptions<MediaFolderListItem[]>,
      "queryKey" | "queryFn"
    >;
  },
) {
  const { apiClient, tenantId, queryOptions } = options;

  return useQuery({
    queryKey: folderKeys.list(tenantId),
    queryFn: () => apiClient.list(tenantId),
    enabled: !!tenantId,
    ...queryOptions,
  });
}

/**
 * Hook to fetch folder tree structure
 *
 * @example
 * ```tsx
 * const { data: tree } = useFolderTree({ apiClient, tenantId });
 * ```
 */
export function useFolderTree(
  options: UseFoldersOptions & {
    queryOptions?: Omit<
      UseQueryOptions<FolderTreeNode[]>,
      "queryKey" | "queryFn"
    >;
  },
) {
  const { apiClient, tenantId, queryOptions } = options;

  return useQuery({
    queryKey: folderKeys.tree(tenantId),
    queryFn: () => apiClient.tree(tenantId),
    enabled: !!tenantId,
    ...queryOptions,
  });
}

/**
 * Hook to fetch a single folder
 *
 * @example
 * ```tsx
 * const { data: folder } = useFolder({
 *   apiClient,
 *   tenantId,
 *   folderId: 'folder-123',
 * });
 * ```
 */
export function useFolder(
  options: UseFoldersOptions & {
    folderId: string;
    queryOptions?: Omit<UseQueryOptions<MediaFolder>, "queryKey" | "queryFn">;
  },
) {
  const { apiClient, tenantId, folderId, queryOptions } = options;

  return useQuery({
    queryKey: folderKeys.detail(tenantId, folderId),
    queryFn: () => apiClient.get(tenantId, folderId),
    enabled: !!tenantId && !!folderId,
    ...queryOptions,
  });
}

/**
 * Hook to create a new folder
 *
 * @example
 * ```tsx
 * const { mutate: createFolder } = useCreateFolder({ apiClient, tenantId });
 *
 * createFolder({ name: 'New Folder', parentId: 'parent-123' });
 * ```
 */
export function useCreateFolder(
  options: UseFoldersOptions & {
    mutationOptions?: Omit<
      UseMutationOptions<MediaFolder, Error, CreateFolderInput>,
      "mutationFn"
    >;
  },
) {
  const { apiClient, tenantId, mutationOptions } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFolderInput) => apiClient.create(tenantId, data),
    onSuccess: (newFolder) => {
      // Add to detail cache
      queryClient.setQueryData(
        folderKeys.detail(tenantId, newFolder.id),
        newFolder,
      );
      // Invalidate list and tree
      queryClient.invalidateQueries({ queryKey: folderKeys.list(tenantId) });
      queryClient.invalidateQueries({ queryKey: folderKeys.tree(tenantId) });
    },
    ...mutationOptions,
  });
}

/**
 * Hook to update a folder
 *
 * @example
 * ```tsx
 * const { mutate: updateFolder } = useUpdateFolder({ apiClient, tenantId });
 *
 * updateFolder({ id: 'folder-123', data: { name: 'Renamed Folder' } });
 * ```
 */
export function useUpdateFolder(
  options: UseFoldersOptions & {
    mutationOptions?: Omit<
      UseMutationOptions<
        MediaFolder,
        Error,
        { id: string; data: UpdateFolderInput }
      >,
      "mutationFn"
    >;
  },
) {
  const { apiClient, tenantId, mutationOptions } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFolderInput }) =>
      apiClient.update(tenantId, id, data),
    onSuccess: (updatedFolder) => {
      queryClient.setQueryData(
        folderKeys.detail(tenantId, updatedFolder.id),
        updatedFolder,
      );
      queryClient.invalidateQueries({ queryKey: folderKeys.list(tenantId) });
      queryClient.invalidateQueries({ queryKey: folderKeys.tree(tenantId) });
    },
    ...mutationOptions,
  });
}

/**
 * Hook to delete a folder
 *
 * @example
 * ```tsx
 * const { mutate: deleteFolder } = useDeleteFolder({ apiClient, tenantId });
 *
 * deleteFolder('folder-123');
 * ```
 */
export function useDeleteFolder(
  options: UseFoldersOptions & {
    mutationOptions?: Omit<
      UseMutationOptions<void, Error, string>,
      "mutationFn"
    >;
  },
) {
  const { apiClient, tenantId, mutationOptions } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(tenantId, id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: folderKeys.detail(tenantId, deletedId),
      });
      queryClient.invalidateQueries({ queryKey: folderKeys.list(tenantId) });
      queryClient.invalidateQueries({ queryKey: folderKeys.tree(tenantId) });
    },
    ...mutationOptions,
  });
}

/**
 * Hook to move a folder
 *
 * @example
 * ```tsx
 * const { mutate: moveFolder } = useMoveFolder({ apiClient, tenantId });
 *
 * // Move to another parent
 * moveFolder({ id: 'folder-123', data: { parentId: 'new-parent-456' } });
 *
 * // Move to root
 * moveFolder({ id: 'folder-123', data: { parentId: null } });
 * ```
 */
export function useMoveFolder(
  options: UseFoldersOptions & {
    mutationOptions?: Omit<
      UseMutationOptions<
        MediaFolder,
        Error,
        { id: string; data: MoveFolderInput }
      >,
      "mutationFn"
    >;
  },
) {
  const { apiClient, tenantId, mutationOptions } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MoveFolderInput }) =>
      apiClient.move(tenantId, id, data),
    onSuccess: (updatedFolder) => {
      queryClient.setQueryData(
        folderKeys.detail(tenantId, updatedFolder.id),
        updatedFolder,
      );
      queryClient.invalidateQueries({ queryKey: folderKeys.list(tenantId) });
      queryClient.invalidateQueries({ queryKey: folderKeys.tree(tenantId) });
    },
    ...mutationOptions,
  });
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook to invalidate folder queries
 */
export function useInvalidateFolders(tenantId: string) {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: folderKeys.all }),
    invalidateList: () =>
      queryClient.invalidateQueries({ queryKey: folderKeys.list(tenantId) }),
    invalidateTree: () =>
      queryClient.invalidateQueries({ queryKey: folderKeys.tree(tenantId) }),
    invalidateDetail: (folderId: string) =>
      queryClient.invalidateQueries({
        queryKey: folderKeys.detail(tenantId, folderId),
      }),
  };
}
