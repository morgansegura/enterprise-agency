import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "../api-client";
import { logger } from "../logger";
import { queryKeys } from "./query-keys";

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

export function useMenus(tenantId: string) {
  return useQuery<Menu[]>({
    queryKey: queryKeys.menus.byTenant(tenantId),
    queryFn: () => apiClient.get<Menu[]>(`/tenants/${tenantId}/menus`),
    enabled: !!tenantId,
  });
}

export function useMenu(tenantId: string, menuId: string) {
  return useQuery<Menu>({
    queryKey: queryKeys.menus.detail(tenantId, menuId),
    queryFn: () => apiClient.get<Menu>(`/tenants/${tenantId}/menus/${menuId}`),
    enabled: !!tenantId && !!menuId,
  });
}

export function useMenuBySlug(tenantId: string, slug: string) {
  return useQuery<Menu>({
    queryKey: queryKeys.menus.slug(tenantId, slug),
    queryFn: () =>
      apiClient.get<Menu>(`/tenants/${tenantId}/menus/slug/${slug}`),
    enabled: !!tenantId && !!slug,
  });
}

export function useDefaultMenu(tenantId: string) {
  return useQuery<Menu | null>({
    queryKey: queryKeys.menus.default(tenantId),
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.menus.byTenant(tenantId),
      });
    },
    onError: (error: unknown) => {
      logger.error("Failed to create menu", error as Error);
      toast.error("Failed to create menu");
    },
  });
}

export function useUpdateMenu(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuInput }) =>
      apiClient.put<Menu>(`/tenants/${tenantId}/menus/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.menus.byTenant(tenantId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.menus.detail(tenantId, variables.id),
      });
    },
    onError: (error: unknown) => {
      logger.error("Failed to update menu", error as Error);
      toast.error("Failed to update menu");
    },
  });
}

export function useDeleteMenu(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/tenants/${tenantId}/menus/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.menus.byTenant(tenantId),
      });
    },
    onError: (error: unknown) => {
      logger.error("Failed to delete menu", error as Error);
      toast.error("Failed to delete menu");
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.menus.byTenant(tenantId),
      });
    },
    onError: (error: unknown) => {
      logger.error("Failed to duplicate menu", error as Error);
      toast.error("Failed to duplicate menu");
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
    onError: (error: unknown) => {
      logger.error("Failed to save menu to library", error as Error);
      toast.error("Failed to save menu to library");
    },
  });
}
