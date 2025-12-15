import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";

// Header behavior types
export type HeaderBehavior =
  | "STATIC"
  | "FIXED"
  | "STICKY"
  | "SCROLL_HIDE"
  | "TRANSPARENT";

// Header zone content
export interface HeaderZone {
  menuId?: string;
  logo?: {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    href?: string;
  };
  blocks?: Record<string, unknown>[];
  alignment?: "left" | "center" | "right";
}

// Header zones layout
export interface HeaderZones {
  left?: HeaderZone;
  center?: HeaderZone;
  right?: HeaderZone;
}

// Header styling options
export interface HeaderStyle {
  // Header Bar (full-width background layer)
  backgroundColor?: string;
  textColor?: string;
  height?: number | "sm" | "md" | "lg" | "xl";
  paddingX?: string;
  paddingY?: string;
  blur?: boolean;

  // Header Bar borders
  borderTop?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRight?: string;

  // Header Bar shadow
  boxShadow?: string;

  // Container (inner wrapper that holds the zones)
  containerWidth?: "full" | "container" | "narrow";
  containerBackground?: string;
  containerBorderRadius?: string;
  containerBorder?: string;
  containerShadow?: string;
  containerMarginX?: string;
  containerMarginY?: string;
  containerPaddingX?: string;
  containerPaddingY?: string;
  containerGap?: string;

  // Scroll state styling (when user scrolls past threshold)
  scrolledBackgroundColor?: string;
  scrolledTextColor?: string;
  scrolledShadow?: string;
  scrolledBorderBottom?: string;
}

// Scroll behavior configuration
export interface ScrollBehavior {
  hideOnScrollDown?: boolean;
  showOnScrollUp?: boolean;
  compactOnScroll?: boolean;
  compactHeight?: number;
  threshold?: number;
}

// Transparent state styling
export interface TransparentStyle {
  backgroundColor?: string;
  textColor?: string;
  logoSrc?: string;
}

// Mobile menu trigger icon configuration
export interface MobileMenuTrigger {
  openIcon?:
    | "hamburger"
    | "menu"
    | "dots-vertical"
    | "dots-horizontal"
    | "grid"
    | "custom";
  openIconCustom?: string;
  closeIcon?: "x" | "arrow-left" | "arrow-right" | "chevron-down" | "custom";
  closeIconCustom?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  style?: "default" | "rounded" | "pill" | "ghost";
}

// Mobile menu configuration
export interface MobileMenu {
  type?:
    | "slide-left"
    | "slide-right"
    | "dropdown"
    | "fullscreen"
    | "bottom-nav";
  breakpoint?: "sm" | "md" | "lg";
  animation?: "none" | "fade" | "slide" | "scale";
  backgroundColor?: string;
  textColor?: string;
  showOverlay?: boolean;
  overlayColor?: string;
  trigger?: MobileMenuTrigger;
  closeOnOutsideClick?: boolean;
  closeOnLinkClick?: boolean;
  includeSearch?: boolean;
  includeSocial?: boolean;
  showLogo?: boolean;
  menuAlignment?: "left" | "center" | "right";
}

// Menu type for header relation
export interface HeaderMenu {
  id: string;
  name: string;
  slug: string;
  type: string;
}

export interface Header {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  behavior: HeaderBehavior;
  scrollThreshold?: number;
  animation: string;
  zones: HeaderZones;
  style: HeaderStyle;
  transparentStyle?: TransparentStyle;
  mobileMenu?: MobileMenu;
  menuId?: string;
  menu?: HeaderMenu | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHeaderInput {
  name: string;
  slug: string;
  behavior?: HeaderBehavior;
  scrollThreshold?: number;
  animation?: string;
  zones?: HeaderZones;
  style?: HeaderStyle;
  transparentStyle?: TransparentStyle;
  mobileMenu?: MobileMenu;
  menuId?: string;
  isDefault?: boolean;
}

export interface UpdateHeaderInput {
  name?: string;
  slug?: string;
  behavior?: HeaderBehavior;
  scrollThreshold?: number;
  animation?: string;
  zones?: HeaderZones;
  style?: HeaderStyle;
  transparentStyle?: TransparentStyle;
  mobileMenu?: MobileMenu;
  menuId?: string;
  isDefault?: boolean;
}

const HEADERS_KEY = ["headers"];

export function useHeaders(tenantId: string) {
  return useQuery<Header[]>({
    queryKey: [...HEADERS_KEY, tenantId],
    queryFn: () => apiClient.get<Header[]>(`/tenants/${tenantId}/headers`),
    enabled: !!tenantId,
  });
}

export function useHeader(tenantId: string, headerId: string) {
  return useQuery<Header>({
    queryKey: [...HEADERS_KEY, tenantId, headerId],
    queryFn: () =>
      apiClient.get<Header>(`/tenants/${tenantId}/headers/${headerId}`),
    enabled: !!tenantId && !!headerId,
  });
}

export function useHeaderBySlug(tenantId: string, slug: string) {
  return useQuery<Header>({
    queryKey: [...HEADERS_KEY, tenantId, "slug", slug],
    queryFn: () =>
      apiClient.get<Header>(`/tenants/${tenantId}/headers/slug/${slug}`),
    enabled: !!tenantId && !!slug,
  });
}

export function useDefaultHeader(tenantId: string) {
  return useQuery<Header | null>({
    queryKey: [...HEADERS_KEY, tenantId, "default"],
    queryFn: () =>
      apiClient.get<Header | null>(`/tenants/${tenantId}/headers/default`),
    enabled: !!tenantId,
  });
}

export function useCreateHeader(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHeaderInput) =>
      apiClient.post<Header>(`/tenants/${tenantId}/headers`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...HEADERS_KEY, tenantId] });
    },
  });
}

export function useUpdateHeader(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHeaderInput }) =>
      apiClient.put<Header>(`/tenants/${tenantId}/headers/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...HEADERS_KEY, tenantId] });
      queryClient.invalidateQueries({
        queryKey: [...HEADERS_KEY, tenantId, variables.id],
      });
    },
  });
}

export function useDeleteHeader(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/tenants/${tenantId}/headers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...HEADERS_KEY, tenantId] });
    },
  });
}

export function useDuplicateHeader(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name?: string }) =>
      apiClient.post<Header>(`/tenants/${tenantId}/headers/${id}/duplicate`, {
        name,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...HEADERS_KEY, tenantId] });
    },
  });
}

export function useSaveHeaderToLibrary(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      name,
      description,
    }: {
      id: string;
      name?: string;
      description?: string;
    }) =>
      apiClient.post(`/tenants/${tenantId}/headers/${id}/save-to-library`, {
        name,
        description,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library", tenantId] });
    },
  });
}
