import type {
  OrderStatus,
  PaymentStatus,
  FulfillmentStatus,
} from "@/lib/hooks";

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export const statusBadgeClass: Record<OrderStatus, string> = {
  pending: "order-detail-badge-pending",
  confirmed: "order-detail-badge-confirmed",
  processing: "order-detail-badge-processing",
  shipped: "order-detail-badge-shipped",
  delivered: "order-detail-badge-delivered",
  cancelled: "order-detail-badge-cancelled",
  refunded: "order-detail-badge-refunded",
};

export const paymentBadgeClass: Record<PaymentStatus, string> = {
  pending: "order-detail-badge-pending",
  paid: "order-detail-badge-paid",
  failed: "order-detail-badge-failed",
  refunded: "order-detail-badge-refunded",
};

export const fulfillmentBadgeClass: Record<FulfillmentStatus, string> = {
  unfulfilled: "order-detail-badge-unfulfilled",
  partial: "order-detail-badge-partial",
  fulfilled: "order-detail-badge-fulfilled",
};
