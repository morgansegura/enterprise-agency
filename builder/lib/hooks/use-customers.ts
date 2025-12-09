import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { logger } from "../logger";

// ============================================================================
// Types
// ============================================================================

export interface CustomerAddress {
  id: string;
  customerId: string;
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
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing: boolean;
  note?: string;
  userId?: string;
  addresses?: CustomerAddress[];
  _count?: {
    orders: number;
    addresses: number;
  };
  totalSpent?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerStats {
  totalCustomers: number;
  customersWithAccounts: number;
  marketingOptIns: number;
  averageOrderValue: number;
}

export interface CreateCustomerDto {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
  note?: string;
  userId?: string;
}

export interface UpdateCustomerDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
  note?: string;
  userId?: string;
}

export interface CreateCustomerAddressDto {
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
  isDefault?: boolean;
}

export interface UpdateCustomerAddressDto {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  isDefault?: boolean;
}

export interface CustomerFilters {
  search?: string;
  hasAccount?: boolean;
  acceptsMarketing?: boolean;
  limit?: number;
  offset?: number;
}

// ============================================================================
// Query Keys
// ============================================================================

const CUSTOMERS_KEY = ["customers"];

// ============================================================================
// Customer Hooks
// ============================================================================

export function useCustomers(tenantId: string, filters?: CustomerFilters) {
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.hasAccount !== undefined)
    params.set("hasAccount", String(filters.hasAccount));
  if (filters?.acceptsMarketing !== undefined)
    params.set("acceptsMarketing", String(filters.acceptsMarketing));
  if (filters?.limit) params.set("limit", String(filters.limit));
  if (filters?.offset) params.set("offset", String(filters.offset));

  const queryString = params.toString();

  return useQuery<{ customers: Customer[]; total: number }>({
    queryKey: [...CUSTOMERS_KEY, tenantId, filters],
    queryFn: () =>
      apiClient.get<{ customers: Customer[]; total: number }>(
        `/customers${queryString ? `?${queryString}` : ""}`,
      ),
    enabled: !!tenantId,
  });
}

export function useCustomer(tenantId: string, customerId: string) {
  return useQuery<Customer>({
    queryKey: [...CUSTOMERS_KEY, tenantId, customerId],
    queryFn: () => apiClient.get<Customer>(`/customers/${customerId}`),
    enabled: !!tenantId && !!customerId,
  });
}

export function useCustomerByEmail(tenantId: string, email: string) {
  return useQuery<Customer>({
    queryKey: [...CUSTOMERS_KEY, tenantId, "email", email],
    queryFn: () => apiClient.get<Customer>(`/customers/email/${email}`),
    enabled: !!tenantId && !!email,
  });
}

export function useCustomerStats(tenantId: string) {
  return useQuery<CustomerStats>({
    queryKey: [...CUSTOMERS_KEY, tenantId, "stats"],
    queryFn: () => apiClient.get<CustomerStats>("/customers/stats"),
    enabled: !!tenantId,
  });
}

export function useCreateCustomer(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerDto) =>
      apiClient.post<Customer>("/customers", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...CUSTOMERS_KEY, tenantId] });
      logger.log("Customer created successfully");
    },
    onError: (error) => {
      logger.error("Failed to create customer", error as Error);
    },
  });
}

export function useUpdateCustomer(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerDto }) =>
      apiClient.patch<Customer>(`/customers/${id}`, data),
    onSuccess: (updatedCustomer) => {
      queryClient.invalidateQueries({ queryKey: [...CUSTOMERS_KEY, tenantId] });
      queryClient.invalidateQueries({
        queryKey: [...CUSTOMERS_KEY, tenantId, updatedCustomer.id],
      });
      logger.log("Customer updated successfully");
    },
    onError: (error) => {
      logger.error("Failed to update customer", error as Error);
    },
  });
}

export function useDeleteCustomer(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...CUSTOMERS_KEY, tenantId] });
      logger.log("Customer deleted successfully");
    },
    onError: (error) => {
      logger.error("Failed to delete customer", error as Error);
    },
  });
}

// ============================================================================
// Customer Address Hooks
// ============================================================================

export function useCustomerAddresses(tenantId: string, customerId: string) {
  return useQuery<CustomerAddress[]>({
    queryKey: [...CUSTOMERS_KEY, tenantId, customerId, "addresses"],
    queryFn: () =>
      apiClient.get<CustomerAddress[]>(`/customers/${customerId}/addresses`),
    enabled: !!tenantId && !!customerId,
  });
}

export function useCustomerAddress(
  tenantId: string,
  customerId: string,
  addressId: string,
) {
  return useQuery<CustomerAddress>({
    queryKey: [...CUSTOMERS_KEY, tenantId, customerId, "addresses", addressId],
    queryFn: () =>
      apiClient.get<CustomerAddress>(
        `/customers/${customerId}/addresses/${addressId}`,
      ),
    enabled: !!tenantId && !!customerId && !!addressId,
  });
}

export function useCreateCustomerAddress(tenantId: string, customerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerAddressDto) =>
      apiClient.post<CustomerAddress>(
        `/customers/${customerId}/addresses`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...CUSTOMERS_KEY, tenantId, customerId],
      });
      queryClient.invalidateQueries({
        queryKey: [...CUSTOMERS_KEY, tenantId, customerId, "addresses"],
      });
      logger.log("Customer address created successfully");
    },
    onError: (error) => {
      logger.error("Failed to create customer address", error as Error);
    },
  });
}

export function useUpdateCustomerAddress(tenantId: string, customerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      addressId,
      data,
    }: {
      addressId: string;
      data: UpdateCustomerAddressDto;
    }) =>
      apiClient.patch<CustomerAddress>(
        `/customers/${customerId}/addresses/${addressId}`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...CUSTOMERS_KEY, tenantId, customerId],
      });
      queryClient.invalidateQueries({
        queryKey: [...CUSTOMERS_KEY, tenantId, customerId, "addresses"],
      });
      logger.log("Customer address updated successfully");
    },
    onError: (error) => {
      logger.error("Failed to update customer address", error as Error);
    },
  });
}

export function useDeleteCustomerAddress(tenantId: string, customerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) =>
      apiClient.delete(`/customers/${customerId}/addresses/${addressId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...CUSTOMERS_KEY, tenantId, customerId],
      });
      queryClient.invalidateQueries({
        queryKey: [...CUSTOMERS_KEY, tenantId, customerId, "addresses"],
      });
      logger.log("Customer address deleted successfully");
    },
    onError: (error) => {
      logger.error("Failed to delete customer address", error as Error);
    },
  });
}

export function useSetDefaultAddress(tenantId: string, customerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) =>
      apiClient.post(
        `/customers/${customerId}/addresses/${addressId}/default`,
        {},
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...CUSTOMERS_KEY, tenantId, customerId],
      });
      queryClient.invalidateQueries({
        queryKey: [...CUSTOMERS_KEY, tenantId, customerId, "addresses"],
      });
      logger.log("Default address updated successfully");
    },
    onError: (error) => {
      logger.error("Failed to set default address", error as Error);
    },
  });
}
