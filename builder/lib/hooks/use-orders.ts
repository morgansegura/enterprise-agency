import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { logger } from "../logger";
import { queryKeys } from "./query-keys";

// ============================================================================
// Types
// ============================================================================

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type FulfillmentStatus = "unfulfilled" | "partial" | "fulfilled";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  name: string;
  sku?: string;
  quantity: number;
  price: number;
  total: number;
  options?: Record<string, string>;
  fulfilled: boolean;
  product?: {
    id: string;
    name: string;
    slug: string;
    images: string[];
  };
}

export interface OrderAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  country: string;
  postalCode: string;
  phone?: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  customerId: string;
  customer?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  email: string;
  phone?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress?: OrderAddress;
  billingAddress?: OrderAddress;
  shippingMethod?: string;
  customerNote?: string;
  staffNote?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface CreateOrderItemDto {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CreateOrderDto {
  customerId: string;
  email: string;
  phone?: string;
  items: CreateOrderItemDto[];
  shippingAddress?: OrderAddress;
  billingAddress?: OrderAddress;
  tax?: number;
  shipping?: number;
  discount?: number;
  currency?: string;
  shippingMethod?: string;
  customerNote?: string;
  staffNote?: string;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  shippingAddress?: OrderAddress;
  billingAddress?: OrderAddress;
  shippingMethod?: string;
  customerNote?: string;
  staffNote?: string;
}

export interface OrderFilters {
  status?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  customerId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

// ============================================================================
// Order Hooks
// ============================================================================

export function useOrders(tenantId: string, filters?: OrderFilters) {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.paymentStatus)
    params.set("paymentStatus", filters.paymentStatus);
  if (filters?.fulfillmentStatus)
    params.set("fulfillmentStatus", filters.fulfillmentStatus);
  if (filters?.customerId) params.set("customerId", filters.customerId);
  if (filters?.search) params.set("search", filters.search);
  if (filters?.startDate) params.set("startDate", filters.startDate);
  if (filters?.endDate) params.set("endDate", filters.endDate);
  if (filters?.limit) params.set("limit", String(filters.limit));
  if (filters?.offset) params.set("offset", String(filters.offset));

  const queryString = params.toString();

  return useQuery<{ orders: Order[]; total: number }>({
    queryKey: queryKeys.orders.list(tenantId, filters as Record<string, unknown>),
    queryFn: async () => {
      const response = await apiClient.get<
        { data: Order[]; total: number } | { orders: Order[]; total: number }
      >(`/orders${queryString ? `?${queryString}` : ""}`);
      if ("data" in response && Array.isArray(response.data)) {
        return { orders: response.data, total: response.total };
      }
      return response as { orders: Order[]; total: number };
    },
    enabled: !!tenantId,
  });
}

export function useOrder(tenantId: string, orderId: string) {
  return useQuery<Order>({
    queryKey: queryKeys.orders.detail(tenantId, orderId),
    queryFn: () => apiClient.get<Order>(`/orders/${orderId}`),
    enabled: !!tenantId && !!orderId,
  });
}

export function useOrderByNumber(tenantId: string, orderNumber: number) {
  return useQuery<Order>({
    queryKey: queryKeys.orders.number(tenantId, orderNumber),
    queryFn: () => apiClient.get<Order>(`/orders/number/${orderNumber}`),
    enabled: !!tenantId && !!orderNumber,
  });
}

export function useOrderStats(
  tenantId: string,
  startDate?: string,
  endDate?: string,
) {
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  const queryString = params.toString();

  return useQuery<OrderStats>({
    queryKey: queryKeys.orders.stats(tenantId, { startDate, endDate }),
    queryFn: () =>
      apiClient.get<OrderStats>(
        `/orders/stats${queryString ? `?${queryString}` : ""}`,
      ),
    enabled: !!tenantId,
  });
}

export function useCreateOrder(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderDto) =>
      apiClient.post<Order>("/orders", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.byTenant(tenantId) });
      logger.log("Order created successfully");
    },
    onError: (error) => {
      logger.error("Failed to create order", error as Error);
    },
  });
}

export function useUpdateOrder(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderDto }) =>
      apiClient.patch<Order>(`/orders/${id}`, data),
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.byTenant(tenantId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(tenantId, updatedOrder.id),
      });
      logger.log("Order updated successfully");
    },
    onError: (error) => {
      logger.error("Failed to update order", error as Error);
    },
  });
}

export function useCancelOrder(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.post(`/orders/${id}/cancel`, {}),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.byTenant(tenantId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(tenantId, orderId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.stats(tenantId),
      });
      logger.log("Order cancelled successfully");
    },
    onError: (error) => {
      logger.error("Failed to cancel order", error as Error);
    },
  });
}

export function useFulfillOrderItems(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      itemIds,
    }: {
      orderId: string;
      itemIds: string[];
    }) => apiClient.post(`/orders/${orderId}/fulfill`, { itemIds }),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.byTenant(tenantId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(tenantId, orderId),
      });
      logger.log("Order items fulfilled successfully");
    },
    onError: (error) => {
      logger.error("Failed to fulfill order items", error as Error);
    },
  });
}
