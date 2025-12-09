"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useOrder,
  useUpdateOrder,
  useCancelOrder,
  useFulfillOrderItems,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LayoutHeading } from "@/components/layout/layout-heading";
import {
  ArrowLeft,
  Package,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  User,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { FormItem } from "@/components/ui/form";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string; orderId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id, orderId } = resolvedParams;
  const router = useRouter();

  const { data: order, isLoading, error } = useOrder(id, orderId);
  const updateOrder = useUpdateOrder(id);
  const cancelOrder = useCancelOrder(id);
  const fulfillItems = useFulfillOrderItems(id);

  const [staffNote, setStaffNote] = React.useState("");

  React.useEffect(() => {
    if (order?.staffNote) {
      setStaffNote(order.staffNote);
    }
  }, [order]);

  const handleStatusChange = async (status: OrderStatus) => {
    try {
      await updateOrder.mutateAsync({
        id: orderId,
        data: { status },
      });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handlePaymentStatusChange = async (paymentStatus: PaymentStatus) => {
    try {
      await updateOrder.mutateAsync({
        id: orderId,
        data: { paymentStatus },
      });
      toast.success("Payment status updated");
    } catch {
      toast.error("Failed to update payment status");
    }
  };

  const handleSaveNote = async () => {
    try {
      await updateOrder.mutateAsync({
        id: orderId,
        data: { staffNote },
      });
      toast.success("Note saved");
    } catch {
      toast.error("Failed to save note");
    }
  };

  const handleFulfillItem = async (itemId: string) => {
    try {
      await fulfillItems.mutateAsync({
        orderId,
        itemIds: [itemId],
      });
      toast.success("Item fulfilled");
    } catch {
      toast.error("Failed to fulfill item");
    }
  };

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
        orderId,
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
        await cancelOrder.mutateAsync(orderId);
        toast.success("Order cancelled");
      } catch {
        toast.error("Failed to cancel order");
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatAddress = (
    address:
      | {
          firstName: string;
          lastName: string;
          company?: string;
          address1: string;
          address2?: string;
          city: string;
          province?: string;
          country: string;
          postalCode: string;
        }
      | undefined,
  ) => {
    if (!address) return null;
    return (
      <div className="text-sm">
        <p className="font-medium">
          {address.firstName} {address.lastName}
        </p>
        {address.company && <p>{address.company}</p>}
        <p>{address.address1}</p>
        {address.address2 && <p>{address.address2}</p>}
        <p>
          {address.city}, {address.province} {address.postalCode}
        </p>
        <p>{address.country}</p>
      </div>
    );
  };

  if (isLoading) return <div className="p-6">Loading order...</div>;
  if (error)
    return <div className="p-6">Error loading order: {error.message}</div>;
  if (!order) return <div className="p-6">Order not found</div>;

  const canCancel =
    order.status !== "cancelled" && order.status !== "delivered";
  const canFulfill =
    order.fulfillmentStatus !== "fulfilled" && order.status !== "cancelled";

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/${id}/shop/orders`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </div>

      <LayoutHeading
        title={`Order #${order.orderNumber}`}
        description={formatDate(order.createdAt)}
        actions={
          <div className="flex gap-2">
            {canFulfill && (
              <Button variant="outline" onClick={handleFulfillAll}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Fulfill All
              </Button>
            )}
            {canCancel && (
              <Button variant="destructive" onClick={handleCancel}>
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Order
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-3 mt-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      {item.product?.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.sku && (
                          <p className="text-sm text-muted-foreground">
                            SKU: {item.sku}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-medium">{formatPrice(item.total)}</p>
                      {item.fulfilled ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Fulfilled
                        </span>
                      ) : canFulfill ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFulfillItem(item.id)}
                        >
                          Fulfill
                        </Button>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          Unfulfilled
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Staff Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Staff Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
                placeholder="Add internal notes about this order..."
                rows={3}
              />
              <Button
                variant="outline"
                onClick={handleSaveNote}
                disabled={updateOrder.isPending}
              >
                Save Note
              </Button>

              {order.customerNote && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Customer Note:</p>
                  <p className="text-sm">{order.customerNote}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormItem className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={order.status}
                  onValueChange={(value) =>
                    handleStatusChange(value as OrderStatus)
                  }
                  disabled={order.status === "cancelled"}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>

              {order.shippingMethod && (
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    Shipping Method:{" "}
                  </span>
                  {order.shippingMethod}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormItem className="space-y-2">
                <Label>Payment Status</Label>
                <Select
                  value={order.paymentStatus}
                  onValueChange={(value) =>
                    handlePaymentStatusChange(value as PaymentStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>

              <div className="text-sm">
                <span className="text-muted-foreground">Currency: </span>
                {order.currency}
              </div>
            </CardContent>
          </Card>

          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">
                {order.customer?.firstName} {order.customer?.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{order.email}</p>
              {order.phone && (
                <p className="text-sm text-muted-foreground">{order.phone}</p>
              )}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() =>
                  router.push(`/${id}/shop/customers/${order.customerId}`)
                }
              >
                View Customer →
              </Button>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>{formatAddress(order.shippingAddress)}</CardContent>
            </Card>
          )}

          {/* Billing Address */}
          {order.billingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Billing Address
                </CardTitle>
              </CardHeader>
              <CardContent>{formatAddress(order.billingAddress)}</CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
