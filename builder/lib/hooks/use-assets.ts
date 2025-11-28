import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { logger } from "../logger";

export interface Asset {
  id: string;
  tenantId: string;
  uploadedBy?: string;
  fileKey: string;
  fileName: string;
  fileType: string;
  mimeType?: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  usageContext?: string;
  createdAt?: string;
  updatedAt?: string;
}

const ASSETS_KEY = ["assets"];

export function useAssets(
  tenantId: string,
  filters?: { fileType?: string; usageContext?: string },
) {
  const params = new URLSearchParams();
  if (filters?.fileType) params.append("fileType", filters.fileType);
  if (filters?.usageContext)
    params.append("usageContext", filters.usageContext);
  const queryString = params.toString();

  return useQuery<Asset[]>({
    queryKey: [...ASSETS_KEY, tenantId, filters],
    queryFn: () =>
      apiClient.get<Asset[]>(`/assets${queryString ? `?${queryString}` : ""}`),
    enabled: !!tenantId,
  });
}

export function useAsset(tenantId: string, assetId: string) {
  return useQuery<Asset>({
    queryKey: [...ASSETS_KEY, tenantId, assetId],
    queryFn: () => apiClient.get<Asset>(`/assets/${assetId}`),
    enabled: !!tenantId && !!assetId,
  });
}

export function useUploadAsset(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      altText,
      usageContext,
    }: {
      file: File;
      altText?: string;
      usageContext?: string;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      if (altText) formData.append("altText", altText);
      if (usageContext) formData.append("usageContext", usageContext);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/assets/upload`,
        {
          method: "POST",
          headers: {
            "x-tenant-id": tenantId,
          },
          credentials: "include",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      return response.json() as Promise<Asset>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ASSETS_KEY, tenantId] });
      logger.log("Asset uploaded successfully");
    },
    onError: (error) => {
      logger.error("Failed to upload asset", error as Error);
    },
  });
}

export function useUpdateAsset(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { fileName?: string; altText?: string; usageContext?: string };
    }) => apiClient.patch<Asset>(`/assets/${id}`, data),
    onSuccess: (updatedAsset) => {
      queryClient.invalidateQueries({ queryKey: [...ASSETS_KEY, tenantId] });
      queryClient.invalidateQueries({
        queryKey: [...ASSETS_KEY, tenantId, updatedAsset.id],
      });
      logger.log("Asset updated successfully");
    },
    onError: (error) => {
      logger.error("Failed to update asset", error as Error);
    },
  });
}

export function useDeleteAsset(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/assets/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ASSETS_KEY, tenantId] });
      logger.log("Asset deleted successfully");
    },
    onError: (error) => {
      logger.error("Failed to delete asset", error as Error);
    },
  });
}
