import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { logger } from "../logger";

// ============================================================================
// Types
// ============================================================================

export type PaymentProvider = "stripe" | "square";

export interface StripeProviderConfig {
  isConfigured: boolean;
  publishableKey: string | null;
}

export interface SquareProviderConfig {
  isConfigured: boolean;
  applicationId: string | null;
  locationId: string | null;
}

export interface PaymentConfig {
  provider: PaymentProvider | null;
  stripe: StripeProviderConfig;
  square: SquareProviderConfig;
}

export interface UpdateStripeConfigDto {
  publishableKey?: string;
  secretKey?: string;
  webhookSecret?: string;
}

export interface UpdateSquareConfigDto {
  applicationId?: string;
  accessToken?: string;
  locationId?: string;
  webhookSignatureKey?: string;
}

export interface UpdatePaymentConfigDto {
  provider: PaymentProvider;
  stripe?: UpdateStripeConfigDto;
  square?: UpdateSquareConfigDto;
}

export interface CheckoutLineItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CreateCheckoutDto {
  customerId: string;
  items: CheckoutLineItem[];
  successUrl: string;
  cancelUrl: string;
  email?: string;
  shippingAmount?: number;
  taxAmount?: number;
  discountAmount?: number;
  customerNote?: string;
}

export interface CheckoutSession {
  provider: PaymentProvider;
  sessionId: string;
  url: string | null;
}

export interface CreateRefundDto {
  orderId: string;
  amount?: number;
  reason?: string;
}

export interface RefundResult {
  provider: PaymentProvider;
  refundId: string;
  amount: number;
  status: string;
}

export interface StripePaymentDetails {
  provider: "stripe";
  paymentIntentId: string;
  status: string;
  amount: number;
  amountReceived: number;
  currency: string;
  created: string;
}

export interface SquarePaymentDetails {
  provider: "square";
  paymentId: string;
  status: string;
  amount: number;
  currency: string;
  created: string;
}

export type ProviderDetails =
  | StripePaymentDetails
  | SquarePaymentDetails
  | null;

export interface PaymentDetails {
  orderId: string;
  paymentStatus: string;
  paymentMethod: string | null;
  providerDetails: ProviderDetails;
}

// ============================================================================
// Query Keys
// ============================================================================

export const paymentKeys = {
  all: ["payments"] as const,
  config: (tenantId: string) =>
    [...paymentKeys.all, "config", tenantId] as const,
  details: (tenantId: string, orderId: string) =>
    [...paymentKeys.all, "details", tenantId, orderId] as const,
};

// ============================================================================
// Hooks
// ============================================================================

/**
 * Get payment configuration for a tenant (supports Stripe and Square)
 */
export function usePaymentConfig(tenantId: string) {
  return useQuery<PaymentConfig>({
    queryKey: paymentKeys.config(tenantId),
    queryFn: () => apiClient.get<PaymentConfig>("/payments/config"),
    enabled: !!tenantId,
  });
}

/**
 * Update payment configuration (supports Stripe and Square)
 */
export function useUpdatePaymentConfig(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdatePaymentConfigDto) =>
      apiClient.put<PaymentConfig, UpdatePaymentConfigDto>(
        "/payments/config",
        dto,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.config(tenantId) });
      logger.log("Payment configuration updated");
    },
    onError: (error) => {
      logger.error("Failed to update payment configuration", error as Error);
    },
  });
}

/**
 * Create a checkout session (routes to active provider)
 */
export function useCreateCheckout(_tenantId: string) {
  return useMutation({
    mutationFn: (dto: CreateCheckoutDto) =>
      apiClient.post<CheckoutSession, CreateCheckoutDto>(
        "/payments/checkout",
        dto,
      ),
    onSuccess: (data) => {
      logger.log("Checkout session created", {
        provider: data.provider,
        sessionId: data.sessionId,
      });
    },
    onError: (error) => {
      logger.error("Failed to create checkout session", error as Error);
    },
  });
}

/**
 * Create a refund (routes to appropriate provider based on order)
 */
export function useCreateRefund(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateRefundDto) =>
      apiClient.post<RefundResult, CreateRefundDto>("/payments/refund", dto),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: paymentKeys.details(tenantId, variables.orderId),
      });
      // Also invalidate orders list
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      logger.log("Refund created", {
        provider: data.provider,
        refundId: data.refundId,
      });
    },
    onError: (error) => {
      logger.error("Failed to create refund", error as Error);
    },
  });
}

/**
 * Get payment details for an order
 */
export function usePaymentDetails(tenantId: string, orderId: string) {
  return useQuery<PaymentDetails>({
    queryKey: paymentKeys.details(tenantId, orderId),
    queryFn: () => apiClient.get<PaymentDetails>(`/payments/orders/${orderId}`),
    enabled: !!tenantId && !!orderId,
  });
}

// ============================================================================
// Legacy exports for backwards compatibility
// ============================================================================

/** @deprecated Use usePaymentConfig instead */
export const useStripeConfig = usePaymentConfig;

/** @deprecated Use useUpdatePaymentConfig instead */
export function useUpdateStripeConfig(tenantId: string) {
  const updateConfig = useUpdatePaymentConfig(tenantId);

  return {
    ...updateConfig,
    mutateAsync: (dto: UpdateStripeConfigDto) =>
      updateConfig.mutateAsync({
        provider: "stripe",
        stripe: dto,
      }),
    mutate: (dto: UpdateStripeConfigDto) =>
      updateConfig.mutate({
        provider: "stripe",
        stripe: dto,
      }),
  };
}
