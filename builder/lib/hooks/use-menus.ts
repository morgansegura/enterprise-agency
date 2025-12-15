import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";

// Menu item for nested structure
export interface MenuItem {
  id: string;
  label: string;
  url: string;
  icon?: string;
  target?: "_self" | "_blank";
  children?: MenuItem[];
  megaContent?: Record<string, unknown>;
  highlight?: boolean;
}

// Menu styling options
export interface MenuStyle {
  // Layout
  spacing?: "compact" | "comfortable" | "spacious";
  alignment?: "left" | "center" | "right" | "spread";

  // Typography
  fontSize?: "sm" | "md" | "lg";
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  textTransform?: "none" | "uppercase" | "capitalize";

  // Hover effects
  hoverStyle?:
    | "none"
    | "underline"
    | "background"
    | "border"
    | "scale"
    | "color"
    | "glow";
  hoverAnimation?: "none" | "fade" | "slide" | "bounce";
  hoverColor?: string;

  // Dropdown/Mega settings
  dropdownTrigger?: "hover" | "click";
  dropdownAnimation?: "none" | "fade" | "slide" | "scale";
  dropdownShadow?: "none" | "sm" | "md" | "lg";
  dropdownRadius?: "none" | "sm" | "md" | "lg" | "full";
  dropdownBackground?: string;

  // Active state
  activeStyle?: "none" | "underline" | "background" | "bold" | "color";
  activeColor?: string;
}

export type MenuType = "horizontal" | "vertical" | "dropdown" | "mega";

export interface Menu {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  type: MenuType;
  items: MenuItem[];
  style: MenuStyle;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuInput {
  name: string;
  slug: string;
  type?: MenuType;
  items?: MenuItem[];
  style?: MenuStyle;
  isDefault?: boolean;
}

export interface UpdateMenuInput {
  name?: string;
  slug?: string;
  type?: MenuType;
  items?: MenuItem[];
  style?: MenuStyle;
  isDefault?: boolean;
}

const MENUS_KEY = ["menus"];

export function useMenus(tenantId: string) {
  return useQuery<Menu[]>({
    queryKey: [...MENUS_KEY, tenantId],
    queryFn: () => apiClient.get<Menu[]>(`/tenants/${tenantId}/menus`),
    enabled: !!tenantId,
  });
}

export function useMenu(tenantId: string, menuId: string) {
  return useQuery<Menu>({
    queryKey: [...MENUS_KEY, tenantId, menuId],
    queryFn: () => apiClient.get<Menu>(`/tenants/${tenantId}/menus/${menuId}`),
    enabled: !!tenantId && !!menuId,
  });
}

export function useMenuBySlug(tenantId: string, slug: string) {
  return useQuery<Menu>({
    queryKey: [...MENUS_KEY, tenantId, "slug", slug],
    queryFn: () =>
      apiClient.get<Menu>(`/tenants/${tenantId}/menus/slug/${slug}`),
    enabled: !!tenantId && !!slug,
  });
}

export function useDefaultMenu(tenantId: string) {
  return useQuery<Menu | null>({
    queryKey: [...MENUS_KEY, tenantId, "default"],
    queryFn: () =>
      apiClient.get<Menu | null>(`/tenants/${tenantId}/menus/default`),
    enabled: !!tenantId,
  });
}

export function useCreateMenu(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMenuInput) =>
      apiClient.post<Menu>(`/tenants/${tenantId}/menus`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...MENUS_KEY, tenantId] });
    },
  });
}

export function useUpdateMenu(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuInput }) =>
      apiClient.put<Menu>(`/tenants/${tenantId}/menus/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...MENUS_KEY, tenantId] });
      queryClient.invalidateQueries({
        queryKey: [...MENUS_KEY, tenantId, variables.id],
      });
    },
  });
}

export function useDeleteMenu(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/tenants/${tenantId}/menus/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...MENUS_KEY, tenantId] });
    },
  });
}

export function useDuplicateMenu(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name?: string }) =>
      apiClient.post<Menu>(`/tenants/${tenantId}/menus/${id}/duplicate`, {
        name,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...MENUS_KEY, tenantId] });
    },
  });
}

export function useSaveMenuToLibrary(tenantId: string) {
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
      apiClient.post(`/tenants/${tenantId}/menus/${id}/save-to-library`, {
        name,
        description,
      }),
    onSuccess: () => {
      // Invalidate library components query when implemented
      queryClient.invalidateQueries({ queryKey: ["library", tenantId] });
    },
  });
}
