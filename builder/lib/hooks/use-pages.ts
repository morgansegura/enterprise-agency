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

// ===========================================================================
// Version History Hooks
// ===========================================================================

export interface PageVersion {
  id: string;
  version: number;
  title: string;
  createdAt: string;
  changeNote: string | null;
  author: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}

export interface PageVersionFull extends PageVersion {
  content: Record<string, unknown> | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

const VERSION_KEY = "versions";

export function usePageVersions(tenantId: string, pageId: string) {
  return useQuery<PageVersion[]>({
    queryKey: [...PAGES_KEY, tenantId, pageId, VERSION_KEY],
    queryFn: () => apiClient.get<PageVersion[]>(`/pages/${pageId}/versions`),
    enabled: !!tenantId && !!pageId,
  });
}

export function usePageVersion(
  tenantId: string,
  pageId: string,
  versionId: string,
) {
  return useQuery<PageVersionFull>({
    queryKey: [...PAGES_KEY, tenantId, pageId, VERSION_KEY, versionId],
    queryFn: () =>
      apiClient.get<PageVersionFull>(`/pages/${pageId}/versions/${versionId}`),
    enabled: !!tenantId && !!pageId && !!versionId,
  });
}

export function useRestorePageVersion(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageId,
      versionId,
    }: {
      pageId: string;
      versionId: string;
    }) =>
      apiClient.post<Page>(
        `/pages/${pageId}/versions/${versionId}/restore`,
        {},
      ),
    onSuccess: (_, { pageId }) => {
      queryClient.invalidateQueries({ queryKey: [...PAGES_KEY, tenantId] });
      queryClient.invalidateQueries({
        queryKey: [...PAGES_KEY, tenantId, pageId],
      });
      queryClient.invalidateQueries({
        queryKey: [...PAGES_KEY, tenantId, pageId, VERSION_KEY],
      });
      logger.log("Page restored to previous version");
    },
    onError: (error) => {
      logger.error("Failed to restore page version", error as Error);
    },
  });
}

export function useComparePageVersions(
  tenantId: string,
  pageId: string,
  versionIdA: string,
  versionIdB: string,
) {
  return useQuery<{ versionA: PageVersionFull; versionB: PageVersionFull }>({
    queryKey: [
      ...PAGES_KEY,
      tenantId,
      pageId,
      VERSION_KEY,
      "compare",
      versionIdA,
      versionIdB,
    ],
    queryFn: () =>
      apiClient.get(
        `/pages/${pageId}/versions/compare?versionA=${versionIdA}&versionB=${versionIdB}`,
      ),
    enabled: !!tenantId && !!pageId && !!versionIdA && !!versionIdB,
  });
}

// ===========================================================================
// Preview Token Hooks
// ===========================================================================

export interface PreviewToken {
  id: string;
  token: string;
  contentType: string;
  contentId: string;
  expiresAt: string;
  previewUrl: string;
}

export function useCreatePreviewToken(_tenantId: string) {
  return useMutation({
    mutationFn: ({
      contentType,
      contentId,
      expiresInHours = 24,
    }: {
      contentType: "page" | "post";
      contentId: string;
      expiresInHours?: number;
    }) =>
      apiClient.post<PreviewToken>("/preview/generate", {
        contentType,
        contentId,
        expiresInHours,
      }),
    onSuccess: () => {
      logger.log("Preview token generated");
    },
    onError: (error) => {
      logger.error("Failed to generate preview token", error as Error);
    },
  });
}
