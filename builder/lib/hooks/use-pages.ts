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

// =============================================================================
// Section Background Types
// =============================================================================

export type BackgroundType = "none" | "color" | "gradient" | "image";

export interface SectionBackground {
  type: BackgroundType;
  // Color background
  color?: string;
  // Gradient background
  gradient?: {
    type: "linear" | "radial";
    angle?: number; // for linear gradients
    stops: Array<{ color: string; position: number }>;
  };
  // Image background
  image?: {
    src: string;
    alt?: string;
    position?: string; // "center", "top", "bottom", etc.
    size?: "cover" | "contain" | "auto";
    repeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
    overlay?: string; // overlay color with opacity
  };
}

// =============================================================================
// Container Settings (inside section wrapper)
// =============================================================================

export interface ContainerSettings {
  // Background (same as section - color, gradient, or image)
  background?: string | SectionBackground;
  // Padding
  paddingTop?: string;
  paddingBottom?: string;
  paddingX?: string;
  paddingY?: string;
  // Border
  borderTop?: "none" | "thin" | "medium" | "thick";
  borderBottom?: "none" | "thin" | "medium" | "thick";
  borderRadius?: string;
  // Shadow
  shadow?: string;
  // Min height
  minHeight?: "none" | "sm" | "md" | "lg" | "xl";
  // Content alignment
  align?: "left" | "center" | "right";
  verticalAlign?: "top" | "center" | "bottom";
  // Layout
  layout?: {
    type: "stack" | "flex" | "grid";
    // Flex options
    direction?: "row" | "column";
    wrap?: boolean;
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
    align?: "start" | "center" | "end" | "stretch" | "baseline";
    // Grid options
    columns?: number | string; // number or "auto-fit"
    rows?: number | string;
    // Shared
    gap?: string;
  };
}

// =============================================================================
// Section (Wrapper) Interface
// =============================================================================

export interface Section {
  _type: "section";
  _key: string;
  // Wrapper settings
  background?: string | SectionBackground; // string for legacy support
  paddingTop?: string;
  paddingBottom?: string;
  spacing?: string; // legacy - maps to paddingY
  // Border settings
  borderTop?: "none" | "thin" | "medium" | "thick";
  borderBottom?: "none" | "thin" | "medium" | "thick";
  // Shadow
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "inner";
  // Width
  width?: "narrow" | "container" | "wide" | "full";
  // Min height (for hero sections)
  minHeight?: "none" | "sm" | "md" | "lg" | "xl" | "screen";
  // Content alignment
  align?: "left" | "center" | "right";
  verticalAlign?: "top" | "center" | "bottom";
  // Container settings
  container?: ContainerSettings;
  // Blocks
  blocks: Block[];
}

export interface Block {
  _type: string;
  _key: string;
  data: Record<string, unknown>;
  [key: string]: unknown;
}

// Simplified header/footer info returned with pages
export interface PageHeader {
  id: string;
  name: string;
  slug: string;
  behavior: string;
}

export interface PageFooter {
  id: string;
  name: string;
  slug: string;
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
  // Header/Footer assignment
  headerId?: string | null;
  footerId?: string | null;
  header?: PageHeader | null;
  footer?: PageFooter | null;
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
