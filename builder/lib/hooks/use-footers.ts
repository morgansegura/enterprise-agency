import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";

// Footer layout types
export type FooterLayout =
  | "SIMPLE"
  | "COLUMNS"
  | "STACKED"
  | "MINIMAL"
  | "CENTERED";

// Footer zone content
export interface FooterZone {
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

// Footer zones layout
export interface FooterZones {
  left?: FooterZone;
  center?: FooterZone;
  right?: FooterZone;
  column1?: FooterZone;
  column2?: FooterZone;
  column3?: FooterZone;
  column4?: FooterZone;
  bottom?: FooterZone;
}

// Footer styling options
export interface FooterStyle {
  // Footer Wrapper (full-width background layer)
  backgroundColor?: string;
  textColor?: string;
  paddingX?: string;
  paddingY?: string;

  // Footer Wrapper borders
  borderTop?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRight?: string;

  // Footer Wrapper shadow
  boxShadow?: string;

  // Container (inner wrapper that holds zones)
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
}

// Social link configuration
export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
}

// Copyright configuration
export interface CopyrightConfig {
  text?: string;
  showYear?: boolean;
  companyName?: string;
}

// Menu type for footer relation
export interface FooterMenu {
  id: string;
  name: string;
  slug: string;
  type: string;
}

export interface Footer {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  layout: FooterLayout;
  zones: FooterZones;
  style: FooterStyle;
  socialLinks?: SocialLink[];
  copyright?: CopyrightConfig;
  menuId?: string;
  menu?: FooterMenu | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFooterInput {
  name: string;
  slug: string;
  layout?: FooterLayout;
  zones?: FooterZones;
  style?: FooterStyle;
  socialLinks?: SocialLink[];
  copyright?: CopyrightConfig;
  menuId?: string;
  isDefault?: boolean;
}

export interface UpdateFooterInput {
  name?: string;
  slug?: string;
  layout?: FooterLayout;
  zones?: FooterZones;
  style?: FooterStyle;
  socialLinks?: SocialLink[];
  copyright?: CopyrightConfig;
  menuId?: string;
  isDefault?: boolean;
}

const FOOTERS_KEY = ["footers"];

export function useFooters(tenantId: string) {
  return useQuery<Footer[]>({
    queryKey: [...FOOTERS_KEY, tenantId],
    queryFn: () => apiClient.get<Footer[]>(`/tenants/${tenantId}/footers`),
    enabled: !!tenantId,
  });
}

export function useFooter(tenantId: string, footerId: string) {
  return useQuery<Footer>({
    queryKey: [...FOOTERS_KEY, tenantId, footerId],
    queryFn: () =>
      apiClient.get<Footer>(`/tenants/${tenantId}/footers/${footerId}`),
    enabled: !!tenantId && !!footerId,
  });
}

export function useFooterBySlug(tenantId: string, slug: string) {
  return useQuery<Footer>({
    queryKey: [...FOOTERS_KEY, tenantId, "slug", slug],
    queryFn: () =>
      apiClient.get<Footer>(`/tenants/${tenantId}/footers/slug/${slug}`),
    enabled: !!tenantId && !!slug,
  });
}

export function useDefaultFooter(tenantId: string) {
  return useQuery<Footer | null>({
    queryKey: [...FOOTERS_KEY, tenantId, "default"],
    queryFn: () =>
      apiClient.get<Footer | null>(`/tenants/${tenantId}/footers/default`),
    enabled: !!tenantId,
  });
}

export function useCreateFooter(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFooterInput) =>
      apiClient.post<Footer>(`/tenants/${tenantId}/footers`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...FOOTERS_KEY, tenantId] });
    },
  });
}

export function useUpdateFooter(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFooterInput }) =>
      apiClient.put<Footer>(`/tenants/${tenantId}/footers/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...FOOTERS_KEY, tenantId] });
      queryClient.invalidateQueries({
        queryKey: [...FOOTERS_KEY, tenantId, variables.id],
      });
    },
  });
}

export function useDeleteFooter(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/tenants/${tenantId}/footers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...FOOTERS_KEY, tenantId] });
    },
  });
}

export function useDuplicateFooter(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name?: string }) =>
      apiClient.post<Footer>(`/tenants/${tenantId}/footers/${id}/duplicate`, {
        name,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...FOOTERS_KEY, tenantId] });
    },
  });
}

export function useSaveFooterToLibrary(tenantId: string) {
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
      apiClient.post(`/tenants/${tenantId}/footers/${id}/save-to-library`, {
        name,
        description,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library", tenantId] });
    },
  });
}
