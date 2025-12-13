import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { logger } from "../logger";

export interface PageSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  structuredData?: Record<string, unknown>;
}

export interface Section {
  _type: "section";
  _key: string;
  background?: string;
  spacing?: string;
  width?: string;
  align?: string;
  blocks: Block[];
}

export interface Block {
  _type: string;
  _key: string;
  data: Record<string, unknown>;
  [key: string]: unknown;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  sections?: Section[];
  content?: {
    sections?: Section[];
  };
  seo?: PageSeo;
  status?: string;
  template?: string;
  accessibility?: {
    skipToContent?: boolean;
    ariaLandmarks?: boolean;
    focusManagement?: boolean;
    keyboardNav?: boolean;
  };
  performance?: {
    lazyLoadImages?: boolean;
    preloadCritical?: boolean;
    cacheStrategy?: "static" | "dynamic" | "hybrid";
  };
  // Home page and system page fields
  isHomePage?: boolean;
  pageType?: string;
  isSystemPage?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const PAGES_KEY = ["pages"];

export function usePages(tenantId: string) {
  return useQuery<Page[]>({
    queryKey: [...PAGES_KEY, tenantId],
    queryFn: () => apiClient.get<Page[]>("/pages"),
    enabled: !!tenantId,
  });
}

export function usePage(tenantId: string, pageId: string) {
  return useQuery<Page>({
    queryKey: [...PAGES_KEY, tenantId, pageId],
    queryFn: () => apiClient.get<Page>(`/pages/${pageId}`),
    enabled: !!tenantId && !!pageId,
  });
}

export function usePageBySlug(tenantId: string, slug: string) {
  return useQuery<Page>({
    queryKey: [...PAGES_KEY, tenantId, "slug", slug],
    queryFn: () => apiClient.get<Page>(`/pages/slug/${slug}`),
    enabled: !!tenantId && !!slug,
  });
}

export function useCreatePage(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Page>) => apiClient.post<Page>("/pages", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...PAGES_KEY, tenantId] });
      logger.log("Page created successfully");
    },
    onError: (error) => {
      logger.error("Failed to create page", error as Error);
    },
  });
}

export function useUpdatePage(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Page> }) =>
      apiClient.patch<Page>(`/pages/${id}`, data),
    onSuccess: (updatedPage) => {
      queryClient.invalidateQueries({ queryKey: [...PAGES_KEY, tenantId] });
      queryClient.invalidateQueries({
        queryKey: [...PAGES_KEY, tenantId, updatedPage.id],
      });
      logger.log("Page updated successfully");
    },
    onError: (error) => {
      logger.error("Failed to update page", error as Error);
    },
  });
}

export function useDeletePage(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/pages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...PAGES_KEY, tenantId] });
      logger.log("Page deleted successfully");
    },
    onError: (error) => {
      logger.error("Failed to delete page", error as Error);
    },
  });
}

export function usePublishPage(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.post(`/pages/${id}/publish`, {}),
    onSuccess: (_, pageId) => {
      queryClient.invalidateQueries({ queryKey: [...PAGES_KEY, tenantId] });
      queryClient.invalidateQueries({
        queryKey: [...PAGES_KEY, tenantId, pageId],
      });
      logger.log("Page published successfully");
    },
    onError: (error) => {
      logger.error("Failed to publish page", error as Error);
    },
  });
}

export function useUnpublishPage(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.post(`/pages/${id}/unpublish`, {}),
    onSuccess: (_, pageId) => {
      queryClient.invalidateQueries({ queryKey: [...PAGES_KEY, tenantId] });
      queryClient.invalidateQueries({
        queryKey: [...PAGES_KEY, tenantId, pageId],
      });
      logger.log("Page unpublished successfully");
    },
    onError: (error) => {
      logger.error("Failed to unpublish page", error as Error);
    },
  });
}

export function useDuplicatePage(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.post<Page>(`/pages/${id}/duplicate`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...PAGES_KEY, tenantId] });
      logger.log("Page duplicated successfully");
    },
    onError: (error) => {
      logger.error("Failed to duplicate page", error as Error);
    },
  });
}
