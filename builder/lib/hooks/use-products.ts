import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { logger } from "../logger";
import { queryKeys } from "./query-keys";

// ============================================================================
// Types
// ============================================================================

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  sortOrder: number;
  parent?: ProductCategory;
  children?: ProductCategory[];
  _count?: {
    products: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku?: string;
  name: string;
  options: Record<string, string>;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  inventory: number;
  lowStockThreshold: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  images: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  images: string[];
  categoryId?: string;
  category?: ProductCategory;
  status: "draft" | "active" | "archived";
  inventory: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  options: Array<{
    name: string;
    values: string[];
  }>;
  tags: string[];
  featured: boolean;
  variants?: ProductVariant[];
  _count?: {
    variants: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductCategoryDto {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  parentId?: string;
  sortOrder?: number;
}

export interface UpdateProductCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  sortOrder?: number;
}

export interface CreateProductDto {
  name: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  images?: string[];
  categoryId?: string;
  status?: "draft" | "active" | "archived";
  inventory?: number;
  lowStockThreshold?: number;
  trackInventory?: boolean;
  allowBackorder?: boolean;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  options?: Array<{
    name: string;
    values: string[];
  }>;
  tags?: string[];
  featured?: boolean;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export interface CreateProductVariantDto {
  productId: string;
  sku?: string;
  name: string;
  options: Record<string, string>;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  inventory?: number;
  lowStockThreshold?: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  images?: string[];
  isDefault?: boolean;
}

export type UpdateProductVariantDto = Partial<Omit<CreateProductVariantDto, "productId">>;

export interface ProductFilters {
  status?: string;
  categoryId?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CategoryFilters {
  parentId?: string | null;
  search?: string;
}

// ============================================================================
// Category Hooks
// ============================================================================

export function useProductCategories(
  tenantId: string,
  filters?: CategoryFilters,
) {
  const params = new URLSearchParams();
  if (filters?.parentId !== undefined) {
    params.set("parentId", filters.parentId ?? "null");
  }
  if (filters?.search) params.set("search", filters.search);

  const queryString = params.toString();

  return useQuery<ProductCategory[]>({
    queryKey: queryKeys.categories.list(tenantId, filters as Record<string, unknown>),
    queryFn: async () => {
      const response = await apiClient.get<{ data: ProductCategory[] } | ProductCategory[]>(
        `/products/categories${queryString ? `?${queryString}` : ""}`,
      );
      return Array.isArray(response) ? response : response.data;
    },
    enabled: !!tenantId,
  });
}

export function useProductCategory(tenantId: string, categoryId: string) {
  return useQuery<ProductCategory>({
    queryKey: queryKeys.categories.detail(tenantId, categoryId),
    queryFn: () =>
      apiClient.get<ProductCategory>(`/products/categories/${categoryId}`),
    enabled: !!tenantId && !!categoryId,
  });
}

export function useCreateProductCategory(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductCategoryDto) =>
      apiClient.post<ProductCategory>("/products/categories", data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.byTenant(tenantId),
      });
      logger.log("Product category created successfully");
    },
    onError: (error) => {
      logger.error("Failed to create product category", error as Error);
    },
  });
}

export function useUpdateProductCategory(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProductCategoryDto;
    }) => apiClient.patch<ProductCategory>(`/products/categories/${id}`, data),
    onSuccess: (updatedCategory) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.byTenant(tenantId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.detail(tenantId, updatedCategory.id),
      });
      logger.log("Product category updated successfully");
    },
    onError: (error) => {
      logger.error("Failed to update product category", error as Error);
    },
  });
}

export function useDeleteProductCategory(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/products/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.byTenant(tenantId),
      });
      logger.log("Product category deleted successfully");
    },
    onError: (error) => {
      logger.error("Failed to delete product category", error as Error);
    },
  });
}

// ============================================================================
// Product Hooks
// ============================================================================

export function useProducts(tenantId: string, filters?: ProductFilters) {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.categoryId) params.set("categoryId", filters.categoryId);
  if (filters?.featured !== undefined)
    params.set("featured", String(filters.featured));
  if (filters?.search) params.set("search", filters.search);
  if (filters?.limit) params.set("limit", String(filters.limit));
  if (filters?.offset) params.set("offset", String(filters.offset));

  const queryString = params.toString();

  return useQuery<{ products: Product[]; total: number }>({
    queryKey: queryKeys.products.list(tenantId, filters as Record<string, unknown>),
    queryFn: async () => {
      const response = await apiClient.get<
        { data: Product[]; total: number } | { products: Product[]; total: number }
      >(`/products${queryString ? `?${queryString}` : ""}`);
      if ("data" in response && Array.isArray(response.data)) {
        return { products: response.data, total: response.total };
      }
      return response as { products: Product[]; total: number };
    },
    enabled: !!tenantId,
  });
}

export function useProduct(tenantId: string, productId: string) {
  return useQuery<Product>({
    queryKey: queryKeys.products.detail(tenantId, productId),
    queryFn: () => apiClient.get<Product>(`/products/${productId}`),
    enabled: !!tenantId && !!productId,
  });
}

export function useProductBySlug(tenantId: string, slug: string) {
  return useQuery<Product>({
    queryKey: queryKeys.products.slug(tenantId, slug),
    queryFn: () => apiClient.get<Product>(`/products/slug/${slug}`),
    enabled: !!tenantId && !!slug,
  });
}

export function useLowStockProducts(tenantId: string) {
  return useQuery<Product[]>({
    queryKey: queryKeys.products.lowStock(tenantId),
    queryFn: () => apiClient.get<Product[]>("/products/low-stock"),
    enabled: !!tenantId,
  });
}

export function useCreateProduct(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) =>
      apiClient.post<Product>("/products", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.byTenant(tenantId) });
      logger.log("Product created successfully");
    },
    onError: (error) => {
      logger.error("Failed to create product", error as Error);
    },
  });
}

export function useUpdateProduct(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      apiClient.patch<Product>(`/products/${id}`, data),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.byTenant(tenantId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(tenantId, updatedProduct.id),
      });
      logger.log("Product updated successfully");
    },
    onError: (error) => {
      logger.error("Failed to update product", error as Error);
    },
  });
}

export function useDeleteProduct(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.byTenant(tenantId) });
      logger.log("Product deleted successfully");
    },
    onError: (error) => {
      logger.error("Failed to delete product", error as Error);
    },
  });
}

export function useArchiveProduct(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.post(`/products/${id}/archive`, {}),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.byTenant(tenantId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(tenantId, productId),
      });
      logger.log("Product archived successfully");
    },
    onError: (error) => {
      logger.error("Failed to archive product", error as Error);
    },
  });
}

export function useDuplicateProduct(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.post<Product>(`/products/${id}/duplicate`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.byTenant(tenantId) });
      logger.log("Product duplicated successfully");
    },
    onError: (error) => {
      logger.error("Failed to duplicate product", error as Error);
    },
  });
}

export function useAdjustInventory(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      adjustment,
      variantId,
      reason,
    }: {
      productId: string;
      adjustment: number;
      variantId?: string;
      reason?: string;
    }) =>
      apiClient.post(`/products/${productId}/inventory`, {
        adjustment,
        variantId,
        reason,
      }),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.byTenant(tenantId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(tenantId, productId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.lowStock(tenantId),
      });
      logger.log("Inventory adjusted successfully");
    },
    onError: (error) => {
      logger.error("Failed to adjust inventory", error as Error);
    },
  });
}

// ============================================================================
// Variant Hooks
// ============================================================================

export function useProductVariants(tenantId: string, productId: string) {
  return useQuery<ProductVariant[]>({
    queryKey: queryKeys.products.variants(tenantId, productId),
    queryFn: () =>
      apiClient.get<ProductVariant[]>(`/products/${productId}/variants`),
    enabled: !!tenantId && !!productId,
  });
}

export function useCreateProductVariant(tenantId: string, productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<CreateProductVariantDto, "productId">) =>
      apiClient.post<ProductVariant>(`/products/${productId}/variants`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(tenantId, productId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.variants(tenantId, productId),
      });
      logger.log("Product variant created successfully");
    },
    onError: (error) => {
      logger.error("Failed to create product variant", error as Error);
    },
  });
}

export function useUpdateProductVariant(tenantId: string, productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      variantId,
      data,
    }: {
      variantId: string;
      data: UpdateProductVariantDto;
    }) =>
      apiClient.patch<ProductVariant>(
        `/products/${productId}/variants/${variantId}`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(tenantId, productId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.variants(tenantId, productId),
      });
      logger.log("Product variant updated successfully");
    },
    onError: (error) => {
      logger.error("Failed to update product variant", error as Error);
    },
  });
}

export function useDeleteProductVariant(tenantId: string, productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variantId: string) =>
      apiClient.delete(`/products/${productId}/variants/${variantId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(tenantId, productId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.variants(tenantId, productId),
      });
      logger.log("Product variant deleted successfully");
    },
    onError: (error) => {
      logger.error("Failed to delete product variant", error as Error);
    },
  });
}
