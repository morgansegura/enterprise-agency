"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useOrders,
  useOrderStats,
  useCancelOrder,
  useFulfillOrderItems,
  type Order,
  type OrderStatus,
} from "@/lib/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";
import {
  MoreHorizontal,
  Eye,
  XCircle,
  CheckCircle,
  Search,
  ShoppingCart,
  DollarSign,
  Clock,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import "./orders.css";

export default function OrdersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [paymentFilter, setPaymentFilter] = React.useState<string>("all");

  const {
    data: ordersData,
    isLoading,
    error,
  } = useOrders(id, {
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    paymentStatus: paymentFilter !== "all" ? paymentFilter : undefined,
  });
  const { data: stats, isLoading: statsLoading } = useOrderStats(id);
  const cancelOrder = useCancelOrder(id);
  const fulfillItems = useFulfillOrderItems(id);

  const orders = ordersData?.orders ?? [];
  const total = ordersData?.total ?? 0;

  // Surface errors via toast
  React.useEffect(() => {
    if (error) {
      toast.error("Failed to load orders");
    }
  }, [error]);

  const handleView = (orderId: string) => {
    router.push(`/${id}/shop/orders/${orderId}`);
  };

  const handleCancel = async (order: Order) => {
    if (
      confirm(
        `Cancel order #${order.orderNumber}? This will restore inventory.`,
      )
    ) {
      try {
        await cancelOrder.mutateAsync(order.id);
        toast.success("Order cancelled successfully");
      } catch {
        toast.error("Failed to cancel order");
      }
    }
  };

  const handleFulfillAll = async (order: Order) => {
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
      toast.success("Order fulfilled successfully");
    } catch {
      toast.error("Failed to fulfill order");
    }
  };

  const statusClass: Record<OrderStatus, string> = {
    pending: "orders-status-pending",
    confirmed: "orders-status-confirmed",
    processing: "orders-status-processing",
    shipped: "orders-status-shipped",
    delivered: "orders-status-delivered",
    cancelled: "orders-status-cancelled",
    refunded: "orders-status-refunded",
  };

  const paymentClass: Record<string, string> = {
    pending: "orders-payment-pending",
    paid: "orders-payment-paid",
    failed: "orders-payment-failed",
    refunded: "orders-payment-refunded",
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="orders-page">
      <PageHeader
        title="Orders"
        icon={ShoppingCart}
        count={total}
        singularName="order"
        pluralName="orders"
      />

      {/* Stats Row */}
      <div className="orders-stats-row">
        {statsLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="orders-skeleton-stat" />
            ))}
          </>
        ) : stats ? (
          <>
            <div className="orders-stat-card">
              <div className="orders-stat-header">
                <span className="orders-stat-label">Total Orders</span>
                <ShoppingCart className="orders-stat-icon" />
              </div>
              <div className="orders-stat-value">{stats.totalOrders}</div>
            </div>
            <div className="orders-stat-card">
              <div className="orders-stat-header">
                <span className="orders-stat-label">Pending</span>
                <Clock className="orders-stat-icon" />
              </div>
              <div className="orders-stat-value">{stats.pendingOrders}</div>
            </div>
            <div className="orders-stat-card">
              <div className="orders-stat-header">
                <span className="orders-stat-label">Revenue</span>
                <DollarSign className="orders-stat-icon" />
              </div>
              <div className="orders-stat-value">
                {formatCurrency(stats.totalRevenue)}
              </div>
            </div>
            <div className="orders-stat-card">
              <div className="orders-stat-header">
                <span className="orders-stat-label">Avg. Order Value</span>
                <TrendingUp className="orders-stat-icon" />
              </div>
              <div className="orders-stat-value">
                {formatCurrency(stats.averageOrderValue)}
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Filters */}
      <div className="orders-filters">
        <div className="orders-search">
          <Search className="orders-search-icon" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="orders-search-input"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="orders-filter-select">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="orders-filter-select">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="orders-skeleton-row">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-8" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="orders-empty">
          <ShoppingCart className="orders-empty-icon" />
          <h3>No orders found</h3>
          <p>Orders will appear here once customers start purchasing.</p>
        </div>
      ) : (
        <table className="orders-table">
          <thead className="orders-table-header">
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Payment</th>
              <th className="orders-col-total">Total</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="orders-table-body">
            {orders.map((order) => (
              <tr key={order.id} className="orders-table-row">
                <td className="orders-col-order">#{order.orderNumber}</td>
                <td>
                  <div className="orders-col-customer-name">
                    {order.customer?.firstName} {order.customer?.lastName}
                  </div>
                  <div className="orders-col-customer-email">
                    {order.email}
                  </div>
                </td>
                <td>
                  <span
                    className={`orders-status-pill ${statusClass[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  <span
                    className={`orders-payment-pill ${paymentClass[order.paymentStatus] || "orders-payment-pending"}`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="orders-col-total">
                  {formatCurrency(order.total)}
                </td>
                <td className="orders-col-date">
                  {formatDate(order.createdAt)}
                </td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="orders-actions-trigger"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(order.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {order.fulfillmentStatus !== "fulfilled" &&
                        order.status !== "cancelled" && (
                          <DropdownMenuItem
                            onClick={() => handleFulfillAll(order)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Fulfill All
                          </DropdownMenuItem>
                        )}
                      <DropdownMenuSeparator />
                      {order.status !== "cancelled" &&
                        order.status !== "delivered" && (
                          <DropdownMenuItem
                            onClick={() => handleCancel(order)}
                            className="text-red-600"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Order
                          </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
