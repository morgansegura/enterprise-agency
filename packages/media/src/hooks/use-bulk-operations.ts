/**
 * Bulk Operations Hooks
 *
 * React Query hooks for bulk media operations.
 *
 * @module @enterprise/media/hooks
 */

"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { BulkMoveMediaInput, BulkTagMediaInput } from "../types";
import { mediaKeys } from "./use-media";
import { folderKeys } from "./use-folders";

// ============================================================================
// TYPES
// ============================================================================

export interface BulkOperationResult {
  /** Successfully processed IDs */
  successIds: string[];
  /** Failed IDs with errors */
  failedIds: { id: string; error: string }[];
  /** Total processed */
  total: number;
}

export interface BulkApiClient {
  /** Move multiple media items to a folder */
  bulkMove: (
    tenantId: string,
    data: BulkMoveMediaInput,
  ) => Promise<BulkOperationResult>;
  /** Delete multiple media items */
  bulkDelete: (tenantId: string, ids: string[]) => Promise<BulkOperationResult>;
  /** Add tags to multiple media items */
  bulkTag: (
    tenantId: string,
    data: BulkTagMediaInput,
  ) => Promise<BulkOperationResult>;
  /** Remove tags from multiple media items */
  bulkUntag?: (
    tenantId: string,
    data: BulkTagMediaInput,
  ) => Promise<BulkOperationResult>;
}

export interface UseBulkOperationsOptions {
  /** API client for bulk operations */
  apiClient: BulkApiClient;
  /** Tenant ID */
  tenantId: string;
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook for bulk moving media to a folder
 *
 * @example
 * ```tsx
 * const { mutate: bulkMove } = useBulkMove({ apiClient, tenantId });
 *
 * bulkMove({
 *   mediaIds: ['media-1', 'media-2', 'media-3'],
 *   folderId: 'folder-123',
 * });
 * ```
 */
export function useBulkMove(
  options: UseBulkOperationsOptions & {
    mutationOptions?: Omit<
      UseMutationOptions<BulkOperationResult, Error, BulkMoveMediaInput>,
      "mutationFn"
    >;
  },
) {
  const { apiClient, tenantId, mutationOptions } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkMoveMediaInput) =>
      apiClient.bulkMove(tenantId, data),
    onSuccess: () => {
      // Invalidate all media queries since items moved
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
      // Invalidate folder counts
      queryClient.invalidateQueries({ queryKey: folderKeys.lists() });
    },
    ...mutationOptions,
  });
}

/**
 * Hook for bulk deleting media
 *
 * @example
 * ```tsx
 * const { mutate: bulkDelete } = useBulkDelete({ apiClient, tenantId });
 *
 * bulkDelete(['media-1', 'media-2', 'media-3']);
 * ```
 */
export function useBulkDelete(
  options: UseBulkOperationsOptions & {
    mutationOptions?: Omit<
      UseMutationOptions<BulkOperationResult, Error, string[]>,
      "mutationFn"
    >;
  },
) {
  const { apiClient, tenantId, mutationOptions } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => apiClient.bulkDelete(tenantId, ids),
    onSuccess: (result) => {
      // Remove deleted items from detail cache
      result.successIds.forEach((id) => {
        queryClient.removeQueries({ queryKey: mediaKeys.detail(tenantId, id) });
      });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
      // Invalidate folder counts
      queryClient.invalidateQueries({ queryKey: folderKeys.lists() });
    },
    ...mutationOptions,
  });
}

/**
 * Hook for bulk adding tags to media
 *
 * @example
 * ```tsx
 * const { mutate: bulkTag } = useBulkTag({ apiClient, tenantId });
 *
 * bulkTag({
 *   mediaIds: ['media-1', 'media-2'],
 *   tags: ['product', 'featured'],
 * });
 * ```
 */
export function useBulkTag(
  options: UseBulkOperationsOptions & {
    mutationOptions?: Omit<
      UseMutationOptions<BulkOperationResult, Error, BulkTagMediaInput>,
      "mutationFn"
    >;
  },
) {
  const { apiClient, tenantId, mutationOptions } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkTagMediaInput) => apiClient.bulkTag(tenantId, data),
    onSuccess: (result) => {
      // Invalidate updated items
      result.successIds.forEach((id) => {
        queryClient.invalidateQueries({
          queryKey: mediaKeys.detail(tenantId, id),
        });
      });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
    ...mutationOptions,
  });
}

/**
 * Hook for bulk removing tags from media
 *
 * @example
 * ```tsx
 * const { mutate: bulkUntag } = useBulkUntag({ apiClient, tenantId });
 *
 * bulkUntag({
 *   mediaIds: ['media-1', 'media-2'],
 *   tags: ['deprecated'],
 * });
 * ```
 */
export function useBulkUntag(
  options: UseBulkOperationsOptions & {
    mutationOptions?: Omit<
      UseMutationOptions<BulkOperationResult, Error, BulkTagMediaInput>,
      "mutationFn"
    >;
  },
) {
  const { apiClient, tenantId, mutationOptions } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkTagMediaInput) => {
      if (!apiClient.bulkUntag) {
        throw new Error("bulkUntag not implemented");
      }
      return apiClient.bulkUntag(tenantId, data);
    },
    onSuccess: (result) => {
      result.successIds.forEach((id) => {
        queryClient.invalidateQueries({
          queryKey: mediaKeys.detail(tenantId, id),
        });
      });
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
    ...mutationOptions,
  });
}

// ============================================================================
// COMBINED HOOK
// ============================================================================

/**
 * Combined hook for all bulk operations
 *
 * @example
 * ```tsx
 * const {
 *   bulkMove,
 *   bulkDelete,
 *   bulkTag,
 *   isPending,
 * } = useBulkOperations({ apiClient, tenantId });
 * ```
 */
export function useBulkOperations(options: UseBulkOperationsOptions) {
  const bulkMove = useBulkMove(options);
  const bulkDelete = useBulkDelete(options);
  const bulkTag = useBulkTag(options);
  const bulkUntag = useBulkUntag(options);

  return {
    bulkMove: bulkMove.mutate,
    bulkMoveAsync: bulkMove.mutateAsync,
    isBulkMovePending: bulkMove.isPending,

    bulkDelete: bulkDelete.mutate,
    bulkDeleteAsync: bulkDelete.mutateAsync,
    isBulkDeletePending: bulkDelete.isPending,

    bulkTag: bulkTag.mutate,
    bulkTagAsync: bulkTag.mutateAsync,
    isBulkTagPending: bulkTag.isPending,

    bulkUntag: bulkUntag.mutate,
    bulkUntagAsync: bulkUntag.mutateAsync,
    isBulkUntagPending: bulkUntag.isPending,

    isPending:
      bulkMove.isPending ||
      bulkDelete.isPending ||
      bulkTag.isPending ||
      bulkUntag.isPending,
  };
}
