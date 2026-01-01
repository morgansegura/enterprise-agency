/**
 * Media Hooks
 *
 * React Query hooks for media CRUD operations.
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
  Media,
  MediaListResponse,
  MediaQueryParams,
  UpdateMediaInput,
  CropMediaInput,
} from "../types";

// ============================================================================
// QUERY KEYS
// ============================================================================

export const mediaKeys = {
  all: ["media"] as const,
  lists: () => [...mediaKeys.all, "list"] as const,
  list: (tenantId: string, params?: MediaQueryParams) =>
    [...mediaKeys.lists(), tenantId, params] as const,
  details: () => [...mediaKeys.all, "detail"] as const,
  detail: (tenantId: string, id: string) =>
    [...mediaKeys.details(), tenantId, id] as const,
};

// ============================================================================
// TYPES
// ============================================================================

export interface MediaApiClient {
  /** Fetch media list */
  list: (
    tenantId: string,
    params?: MediaQueryParams,
  ) => Promise<MediaListResponse>;
  /** Fetch single media item */
  get: (tenantId: string, id: string) => Promise<Media>;
  /** Update media */
  update: (
    tenantId: string,
    id: string,
    data: UpdateMediaInput,
  ) => Promise<Media>;
  /** Delete media */
  delete: (tenantId: string, id: string) => Promise<void>;
  /** Move media to folder */
  move: (
    tenantId: string,
    id: string,
    folderId: string | null,
  ) => Promise<Media>;
  /** Crop media */
  crop: (tenantId: string, id: string, data: CropMediaInput) => Promise<Media>;
}

export interface UseMediaOptions {
  /** API client for media operations */
  apiClient: MediaApiClient;
  /** Tenant ID */
  tenantId: string;
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to fetch paginated media list
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useMediaList({
 *   apiClient,
 *   tenantId: 'tenant-123',
 *   params: { type: 'IMAGE', folderId: 'folder-456' },
 * });
 * ```
 */
export function useMediaList(
  options: UseMediaOptions & {
    params?: MediaQueryParams;
    queryOptions?: Omit<
      UseQueryOptions<MediaListResponse>,
      "queryKey" | "queryFn"
    >;
  },
) {
  const { apiClient, tenantId, params, queryOptions } = options;

  return useQuery({
    queryKey: mediaKeys.list(tenantId, params),
    queryFn: () => apiClient.list(tenantId, params),
    enabled: !!tenantId,
    ...queryOptions,
  });
}

/**
 * Hook to fetch a single media item
 *
 * @example
 * ```tsx
 * const { data: media } = useMedia({
 *   apiClient,
 *   tenantId: 'tenant-123',
 *   mediaId: 'media-456',
 * });
 * ```
 */
export function useMedia(
  options: UseMediaOptions & {
    mediaId: string;
    queryOptions?: Omit<UseQueryOptions<Media>, "queryKey" | "queryFn">;
  },
) {
  const { apiClient, tenantId, mediaId, queryOptions } = options;

  return useQuery({
    queryKey: mediaKeys.detail(tenantId, mediaId),
    queryFn: () => apiClient.get(tenantId, mediaId),
    enabled: !!tenantId && !!mediaId,
    ...queryOptions,
  });
}

/**
 * Hook to update media metadata
 *
 * @example
 * ```tsx
 * const { mutate: updateMedia } = useUpdateMedia({ apiClient, tenantId });
 *
 * updateMedia({ id: 'media-123', data: { title: 'New Title' } });
 * ```
 */
export function useUpdateMedia(
  options: UseMediaOptions & {
    mutationOptions?: Omit<
      UseMutationOptions<Media, Error, { id: string; data: UpdateMediaInput }>,
      "mutationFn"
    >;
  },
) {
  const { apiClient, tenantId, mutationOptions } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMediaInput }) =>
      apiClient.update(tenantId, id, data),
    onSuccess: (updatedMedia) => {
      // Update the detail cache
      queryClient.setQueryData(
        mediaKeys.detail(tenantId, updatedMedia.id),
        updatedMedia,
      );
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
    ...mutationOptions,
  });
}

/**
 * Hook to delete media
 *
 * @example
 * ```tsx
 * const { mutate: deleteMedia } = useDeleteMedia({ apiClient, tenantId });
 *
 * deleteMedia('media-123');
 * ```
 */
export function useDeleteMedia(
  options: UseMediaOptions & {
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
      // Remove from detail cache
      queryClient.removeQueries({
        queryKey: mediaKeys.detail(tenantId, deletedId),
      });
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
    ...mutationOptions,
  });
}

/**
 * Hook to move media to a folder
 *
 * @example
 * ```tsx
 * const { mutate: moveMedia } = useMoveMedia({ apiClient, tenantId });
 *
 * moveMedia({ id: 'media-123', folderId: 'folder-456' });
 * // Or move to root
 * moveMedia({ id: 'media-123', folderId: null });
 * ```
 */
export function useMoveMedia(
  options: UseMediaOptions & {
    mutationOptions?: Omit<
      UseMutationOptions<Media, Error, { id: string; folderId: string | null }>,
      "mutationFn"
    >;
  },
) {
  const { apiClient, tenantId, mutationOptions } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, folderId }: { id: string; folderId: string | null }) =>
      apiClient.move(tenantId, id, folderId),
    onSuccess: (updatedMedia) => {
      queryClient.setQueryData(
        mediaKeys.detail(tenantId, updatedMedia.id),
        updatedMedia,
      );
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
    ...mutationOptions,
  });
}

/**
 * Hook to crop an image
 *
 * @example
 * ```tsx
 * const { mutate: cropMedia } = useCropMedia({ apiClient, tenantId });
 *
 * cropMedia({
 *   id: 'media-123',
 *   data: { x: 0, y: 0, width: 100, height: 100 },
 * });
 * ```
 */
export function useCropMedia(
  options: UseMediaOptions & {
    mutationOptions?: Omit<
      UseMutationOptions<Media, Error, { id: string; data: CropMediaInput }>,
      "mutationFn"
    >;
  },
) {
  const { apiClient, tenantId, mutationOptions } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CropMediaInput }) =>
      apiClient.crop(tenantId, id, data),
    onSuccess: (updatedMedia) => {
      queryClient.setQueryData(
        mediaKeys.detail(tenantId, updatedMedia.id),
        updatedMedia,
      );
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
    ...mutationOptions,
  });
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook to prefetch media data
 */
export function usePrefetchMedia(options: UseMediaOptions) {
  const { apiClient, tenantId } = options;
  const queryClient = useQueryClient();

  return {
    prefetchList: (params?: MediaQueryParams) =>
      queryClient.prefetchQuery({
        queryKey: mediaKeys.list(tenantId, params),
        queryFn: () => apiClient.list(tenantId, params),
      }),
    prefetchDetail: (mediaId: string) =>
      queryClient.prefetchQuery({
        queryKey: mediaKeys.detail(tenantId, mediaId),
        queryFn: () => apiClient.get(tenantId, mediaId),
      }),
  };
}

/**
 * Hook to invalidate media queries
 */
export function useInvalidateMedia(tenantId: string) {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: mediaKeys.all }),
    invalidateLists: () =>
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() }),
    invalidateList: (params?: MediaQueryParams) =>
      queryClient.invalidateQueries({
        queryKey: mediaKeys.list(tenantId, params),
      }),
    invalidateDetail: (mediaId: string) =>
      queryClient.invalidateQueries({
        queryKey: mediaKeys.detail(tenantId, mediaId),
      }),
  };
}
