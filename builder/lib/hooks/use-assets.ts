import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { logger } from "../logger";
import { queryKeys } from "./query-keys";

// =============================================================================
// Types
// =============================================================================

export interface Asset {
  id: string;
  tenantId: string;
  uploadedBy?: string;
  fileKey: string;
  fileName: string;
  originalName?: string;
  fileType: string;
  mimeType?: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
  aspectRatio?: string;
  blurHash?: string;
  url: string;
  thumbnailUrl?: string;
  variants?: Record<string, string>;
  title?: string;
  altText?: string;
  caption?: string;
  tags?: string[];
  usageContext?: string;
  folderId?: string | null;
  folder?: { id: string; name: string; path: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

/** Server-side type filter — must match MediaType enum on the API */
export type MediaTypeFilter = "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT";

export interface AssetFilters {
  type?: MediaTypeFilter;
  folderId?: string | null;
  search?: string;
  tags?: string[];
  sortBy?: "createdAt" | "fileName" | "sizeBytes" | "updatedAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface PaginatedAssets {
  items: Asset[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// =============================================================================
// Helpers
// =============================================================================

function buildQueryString(filters?: AssetFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.type) params.append("type", filters.type);
  if (filters.folderId !== undefined && filters.folderId !== null) {
    params.append("folderId", filters.folderId);
  }
  if (filters.search) params.append("search", filters.search);
  if (filters.tags?.length) {
    filters.tags.forEach((t) => params.append("tags", t));
  }
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
  if (filters.page) params.append("page", String(filters.page));
  if (filters.pageSize) params.append("pageSize", String(filters.pageSize));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

// =============================================================================
// Queries
// =============================================================================

/**
 * Returns a flat array of assets — convenience for grid/list views.
 * Use `useAssetsPaginated` if you need pagination metadata.
 */
export function useAssets(tenantId: string, filters?: AssetFilters) {
  return useQuery<Asset[]>({
    queryKey: queryKeys.assets.list(
      tenantId,
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: async () => {
      const queryString = buildQueryString(filters);
      const response = await apiClient.get<PaginatedAssets>(
        `/tenants/${tenantId}/media${queryString}`,
      );
      return response.items ?? [];
    },
    enabled: !!tenantId,
  });
}

/**
 * Returns the full paginated payload (items + total + page metadata).
 */
export function useAssetsPaginated(
  tenantId: string,
  filters?: AssetFilters,
) {
  return useQuery<PaginatedAssets>({
    queryKey: [
      ...queryKeys.assets.list(
        tenantId,
        filters as Record<string, unknown> | undefined,
      ),
      "paginated",
    ],
    queryFn: async () => {
      const queryString = buildQueryString(filters);
      return apiClient.get<PaginatedAssets>(
        `/tenants/${tenantId}/media${queryString}`,
      );
    },
    enabled: !!tenantId,
  });
}

export function useAsset(tenantId: string, assetId: string) {
  return useQuery<Asset>({
    queryKey: queryKeys.assets.detail(tenantId, assetId),
    queryFn: () =>
      apiClient.get<Asset>(`/tenants/${tenantId}/media/${assetId}`),
    enabled: !!tenantId && !!assetId,
  });
}

// =============================================================================
// Mutations
// =============================================================================

export interface UploadAssetVars {
  file: File;
  title?: string;
  altText?: string;
  folderId?: string;
  usageContext?: string;
  /** Optional progress callback (0-100) */
  onProgress?: (percent: number) => void;
}

/**
 * Upload via multipart/form-data. Uses XMLHttpRequest so we can report
 * upload progress to the caller.
 */
export function useUploadAsset(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      title,
      altText,
      folderId,
      usageContext,
      onProgress,
    }: UploadAssetVars) => {
      const formData = new FormData();
      formData.append("file", file);
      if (title) formData.append("title", title);
      if (altText) formData.append("altText", altText);
      if (folderId) formData.append("folderId", folderId);
      if (usageContext) formData.append("usageContext", usageContext);

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const url = `${apiUrl}/api/v1/tenants/${tenantId}/media/upload`;

      return new Promise<Asset>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.withCredentials = true;
        xhr.setRequestHeader("x-tenant-id", tenantId);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            onProgress(Math.round((event.loaded / event.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText) as Asset);
            } catch {
              reject(new Error("Invalid response from server"));
            }
          } else {
            let message = `Upload failed (${xhr.status})`;
            try {
              const data = JSON.parse(xhr.responseText) as {
                message?: string;
              };
              if (data.message) message = data.message;
            } catch {
              /* ignore */
            }
            reject(new Error(message));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(formData);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets.byTenant(tenantId),
      });
      logger.log("Asset uploaded successfully");
    },
    onError: (error) => {
      logger.error("Failed to upload asset", error as Error);
    },
  });
}

export interface UpdateAssetData {
  title?: string;
  altText?: string;
  caption?: string;
  tags?: string[];
  usageContext?: string;
}

export function useUpdateAsset(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAssetData }) =>
      apiClient.patch<Asset>(`/tenants/${tenantId}/media/${id}`, data),
    onSuccess: (updatedAsset) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets.byTenant(tenantId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets.detail(tenantId, updatedAsset.id),
      });
      logger.log("Asset updated successfully");
    },
    onError: (error) => {
      logger.error("Failed to update asset", error as Error);
    },
  });
}

export function useMoveAsset(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, folderId }: { id: string; folderId: string | null }) =>
      apiClient.patch<Asset>(`/tenants/${tenantId}/media/${id}/move`, {
        folderId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets.byTenant(tenantId),
      });
    },
    onError: (error) => {
      logger.error("Failed to move asset", error as Error);
    },
  });
}

export interface CropAssetData {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio?: string;
}

export function useCropAsset(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CropAssetData }) =>
      apiClient.post<Asset>(`/tenants/${tenantId}/media/${id}/crop`, data),
    onSuccess: (updatedAsset) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets.byTenant(tenantId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets.detail(tenantId, updatedAsset.id),
      });
    },
    onError: (error) => {
      logger.error("Failed to crop asset", error as Error);
    },
  });
}

export function useDeleteAsset(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<{ success: boolean; id: string }>(
        `/tenants/${tenantId}/media/${id}`,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets.byTenant(tenantId),
      });
      logger.log("Asset deleted successfully");
    },
    onError: (error) => {
      logger.error("Failed to delete asset", error as Error);
    },
  });
}

// =============================================================================
// Bulk operations
// =============================================================================

export function useBulkMoveAssets(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      mediaIds,
      folderId,
    }: {
      mediaIds: string[];
      folderId: string | null;
    }) =>
      apiClient.post<{ successIds: string[]; failedIds: string[]; total: number }>(
        `/tenants/${tenantId}/media/bulk/move`,
        { mediaIds, folderId },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets.byTenant(tenantId),
      });
    },
    onError: (error) => {
      logger.error("Failed to bulk move assets", error as Error);
    },
  });
}

export function useBulkDeleteAssets(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      apiClient.post<{
        successIds: string[];
        failedIds: { id: string; error: string }[];
        total: number;
      }>(`/tenants/${tenantId}/media/bulk/delete`, { ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets.byTenant(tenantId),
      });
    },
    onError: (error) => {
      logger.error("Failed to bulk delete assets", error as Error);
    },
  });
}

export function useBulkTagAssets(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      mediaIds,
      tags,
    }: {
      mediaIds: string[];
      tags: string[];
    }) =>
      apiClient.post<{ successIds: string[]; failedIds: string[]; total: number }>(
        `/tenants/${tenantId}/media/bulk/tag`,
        { mediaIds, tags },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets.byTenant(tenantId),
      });
    },
  });
}

export function useBulkUntagAssets(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      mediaIds,
      tags,
    }: {
      mediaIds: string[];
      tags: string[];
    }) =>
      apiClient.post<{ successIds: string[]; failedIds: string[]; total: number }>(
        `/tenants/${tenantId}/media/bulk/untag`,
        { mediaIds, tags },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets.byTenant(tenantId),
      });
    },
  });
}
