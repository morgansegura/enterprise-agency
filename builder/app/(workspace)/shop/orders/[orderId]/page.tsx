"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useOrder,
  useUpdateOrder,
  useFulfillOrderItems,
  useCancelOrder,
} from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useResolvedTenant } from "@/lib/hooks/use-resolved-tenant";
import { useParams } from "next/navigation";

import { formatDateTime } from "./utils";
import { OrderItemsCard } from "./components/order-items-card";
import { OrderTimelineCard } from "./components/order-timeline-card";
import { OrderStaffNotes } from "./components/order-staff-notes";
import { OrderSidebar } from "./components/order-sidebar";

import "./order-detail.css";

// =============================================================================
// Component
// =============================================================================

export default function OrderDetailPage() {
  const { tenantId: resolvedTenantId } = useResolvedTenant();
  const tenantId = resolvedTenantId!;
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();

  const { data: order, isLoading, error } = useOrder(tenantId, orderId);
  const updateOrder = useUpdateOrder(tenantId);
  const fulfillItems = useFulfillOrderItems(tenantId);
  const cancelOrder = useCancelOrder(tenantId);

  const [staffNote, setStaffNote] = React.useState("");
  const [notesDirty, setNotesDirty] = React.useState(false);

  React.useEffect(() => {
    if (order?.staffNote) {
      setStaffNote(order.staffNote);
    }
  }, [order?.staffNote]);

  React.useEffect(() => {
    if (error) {
      toast.error("Failed to load order");
    }
  }, [error]);

  const handleBack = () => router.push("/shop/orders");

  const handleFulfillAll = async () => {
    if (!order) return;
    const unfulfilledItems = order.items
      .filter((item) => !item.fulfilled)
      .map((item) => item.id);

    if (unfulfilledItems.length === 0) {
      toast.info("All items already fulfilled");
      return;
    }

    try {
      await fulfillItems.mutateAsync({
        orderId: order.id,
        itemIds: unfulfilledItems,
      });
      toast.success("All items fulfilled");
    } catch {
      toast.error("Failed to fulfill items");
    }
  };

  const handleCancel = async () => {
    if (!order) return;
    if (
      confirm(
        `Cancel order #${order.orderNumber}? This will restore inventory.`,
      )
    ) {
      try {
        await cancelOrder.mutateAsync(order.id);
        toast.success("Order cancelled");
      } catch {
        toast.error("Failed to cancel order");
      }
    }
  };

  const handleSaveNote = async () => {
    if (!order) return;
    try {
      await updateOrder.mutateAsync({
        id: order.id,
        data: { staffNote },
      });
      toast.success("Staff note saved");
      setNotesDirty(false);
    } catch {
      toast.error("Failed to save note");
    }
  };

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (error) {
    return (
      <div className="order-detail-error">
        <p>Error loading order: {error.message}</p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Skeleton
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="order-detail-skeleton">
        <div className="order-detail-skeleton-header">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="order-detail-skeleton-columns">
          <div className="order-detail-main">
            <div className="order-detail-skeleton-card">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-40 w-full" />
            </div>
            <div className="order-detail-skeleton-card">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
          <div className="order-detail-sidebar">
            <div className="order-detail-skeleton-card">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="order-detail-skeleton-card">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="order-detail-skeleton-card">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-error">
        <p>Order not found</p>
      </div>
    );
  }

  // Build timeline
  const timeline = [
    { label: "Order placed", date: order.createdAt, active: true },
    ...(order.status !== "pending" && order.status !== "cancelled"
      ? [{ label: "Order confirmed", date: order.updatedAt, active: true }]
      : []),
    ...(order.paymentStatus === "paid"
      ? [{ label: "Payment received", date: order.updatedAt, active: true }]
      : []),
    ...(order.fulfillmentStatus === "fulfilled"
      ? [{ label: "Fulfilled", date: order.updatedAt, active: true }]
      : []),
    ...(order.status === "shipped"
      ? [{ label: "Shipped", date: order.updatedAt, active: true }]
      : []),
    ...(order.status === "delivered"
      ? [{ label: "Delivered", date: order.updatedAt, active: true }]
      : []),
    ...(order.status === "cancelled"
      ? [{ label: "Cancelled", date: order.updatedAt, active: false }]
      : []),
  ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="order-detail">
      {/* Header */}
      <div className="order-detail-header">
        <div className="order-detail-header-left">
          <button
            type="button"
            className="order-detail-back"
            onClick={handleBack}
            aria-label="Back to orders"
          >
            <ArrowLeft />
          </button>
          <div>
            <h1 className="order-detail-title">Order #{order.orderNumber}</h1>
            <p className="order-detail-date">
              Placed {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="order-detail-actions">
          {order.fulfillmentStatus !== "fulfilled" &&
            order.status !== "cancelled" && (
              <Button
                size="sm"
                onClick={handleFulfillAll}
                disabled={fulfillItems.isPending}
              >
                <CheckCircle className="h-4 w-4" />
                Fulfill All
              </Button>
            )}
          {order.status !== "cancelled" && order.status !== "delivered" && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={cancelOrder.isPending}
            >
              <XCircle className="h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="order-detail-body">
        <div className="order-detail-columns">
          {/* Main */}
          <div className="order-detail-main">
            <OrderItemsCard
              items={order.items}
              subtotal={order.subtotal}
              shipping={order.shipping}
              discount={order.discount}
              tax={order.tax}
              total={order.total}
            />
            <OrderTimelineCard timeline={timeline} />
            <OrderStaffNotes
              staffNote={staffNote}
              onChange={(value) => {
                setStaffNote(value);
                setNotesDirty(true);
              }}
              onSave={handleSaveNote}
              isDirty={notesDirty}
              isPending={updateOrder.isPending}
            />
          </div>

          {/* Sidebar */}
          <div className="order-detail-sidebar">
            <OrderSidebar
              order={order}
              onFulfillAll={handleFulfillAll}
              isFulfillPending={fulfillItems.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
