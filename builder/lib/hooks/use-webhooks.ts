import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "../api-client";
import { logger } from "../logger";
import { queryKeys } from "./query-keys";

// ============================================================================
// Types
// ============================================================================

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  url: string;
  requestHeaders: Record<string, string>;
  requestBody: Record<string, unknown>;
  responseStatus: number | null;
  responseBody: string | null;
  success: boolean;
  duration: number | null;
  error: string | null;
  createdAt: string;
}

export interface Webhook {
  id: string;
  tenantId: string;
  url: string;
  secret: string;
  events: string[];
  isActive: boolean;
  description?: string;
  headers?: Record<string, string>;
  retryCount: number;
  timeoutMs: number;
  lastDeliveredAt?: string;
  lastStatusCode?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWebhookInput {
  url: string;
  events: string[];
  description?: string;
  headers?: Record<string, string>;
  isActive?: boolean;
  retryCount?: number;
  timeoutMs?: number;
}

export interface UpdateWebhookInput {
  url?: string;
  events?: string[];
  description?: string;
  headers?: Record<string, string>;
  isActive?: boolean;
  retryCount?: number;
  timeoutMs?: number;
}

// ============================================================================
// Query Hooks
// ============================================================================

export function useWebhooks(tenantId: string) {
  return useQuery<Webhook[]>({
    queryKey: queryKeys.webhooks.list(tenantId),
    queryFn: () => apiClient.get<Webhook[]>(`/tenants/${tenantId}/webhooks`),
    enabled: !!tenantId,
  });
}

export function useWebhook(id: string) {
  return useQuery<Webhook>({
    queryKey: queryKeys.webhooks.detail(id),
    queryFn: () => apiClient.get<Webhook>(`/webhooks/${id}`),
    enabled: !!id,
  });
}

export function useWebhookDeliveries(webhookId: string) {
  return useQuery<WebhookDelivery[]>({
    queryKey: queryKeys.webhooks.deliveries(webhookId),
    queryFn: () =>
      apiClient.get<WebhookDelivery[]>(`/webhooks/${webhookId}/deliveries`),
    enabled: !!webhookId,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

export function useCreateWebhook(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWebhookInput) =>
      apiClient.post<Webhook>(`/tenants/${tenantId}/webhooks`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.webhooks.list(tenantId),
      });
    },
    onError: (error: unknown) => {
      logger.error("Failed to create webhook", error as Error);
      toast.error("Failed to create webhook");
    },
  });
}

export function useUpdateWebhook(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWebhookInput }) =>
      apiClient.put<Webhook>(`/webhooks/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.webhooks.list(tenantId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.webhooks.detail(variables.id),
      });
    },
    onError: (error: unknown) => {
      logger.error("Failed to update webhook", error as Error);
      toast.error("Failed to update webhook");
    },
  });
}

export function useDeleteWebhook(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/webhooks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.webhooks.list(tenantId),
      });
    },
    onError: (error: unknown) => {
      logger.error("Failed to delete webhook", error as Error);
      toast.error("Failed to delete webhook");
    },
  });
}

export function useTestWebhook() {
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.post<{ success: boolean; statusCode: number; duration: number }>(
        `/webhooks/${id}/test`,
      ),
    onError: (error: unknown) => {
      logger.error("Failed to test webhook", error as Error);
      toast.error("Failed to test webhook");
    },
  });
}
