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
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutHeading } from "@/components/layout/layout-heading";
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
  const { data: stats } = useOrderStats(id);
  const cancelOrder = useCancelOrder(id);
  const fulfillItems = useFulfillOrderItems(id);

  const orders = ordersData?.orders ?? [];
  const total = ordersData?.total ?? 0;

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

  const getStatusBadge = (status: OrderStatus) => {
    const styles: Record<OrderStatus, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  const getPaymentBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status] || styles.pending}`}
      >
        {status}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (isLoading) return <div className="p-6">Loading orders...</div>;
  if (error)
    return <div className="p-6">Error loading orders: {error.message}</div>;

  return (
    <div className="p-6">
      <LayoutHeading
        title="Orders"
        description={total > 0 ? `${total} total orders` : "No orders yet"}
      />

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Orders
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(stats.totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Order</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(stats.averageOrderValue)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-6 mt-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
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
          <SelectTrigger className="w-[150px]">
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

      {orders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ShoppingCart className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No orders found.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Fulfillment</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  #{order.orderNumber}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      order.fulfillmentStatus === "fulfilled"
                        ? "bg-green-100 text-green-800"
                        : order.fulfillmentStatus === "partial"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.fulfillmentStatus}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatPrice(order.total)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
