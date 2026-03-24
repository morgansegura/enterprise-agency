"use client";

import * as React from "react";
import Link from "next/link";
import {
  useProducts,
  useOrders,
  useCustomers,
  useOrderStats,
  type Order,
} from "@/lib/hooks";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  ArrowRight,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";

import "./shop.css";

export default function ShopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const { data: productsData, isLoading: productsLoading, error: productsError } = useProducts(id);
  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useOrders(id, { limit: 5 });
  const { data: customersData, isLoading: customersLoading, error: customersError } = useCustomers(id);
  const { data: stats, isLoading: statsLoading, error: statsError } = useOrderStats(id);

  const products = productsData?.products ?? [];
  const orders = ordersData?.orders ?? [];
  const customers = customersData?.customers ?? [];

  const activeProducts = products.filter((p) => p.status === "active").length;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const isLoading = productsLoading || ordersLoading || customersLoading || statsLoading;

  // Surface errors via toast
  React.useEffect(() => {
    const err = productsError || ordersError || customersError || statsError;
    if (err) {
      toast.error("Failed to load shop data");
    }
  }, [productsError, ordersError, customersError, statsError]);

  return (
    <PageLayout
      title="Shop Dashboard"
      description="Manage your products, orders, and customers"
      actions={
        <Button asChild>
          <Link href={`/${id}/shop/products/new`}>
            <PlusCircle className="h-4 w-4" />
            Add Product
          </Link>
        </Button>
      }
    >
      <div className="shop-dashboard">
        {/* Stats Grid */}
        <div className="shop-stats-grid">
          <div className="shop-stat-card">
            <div className="shop-stat-header">
              <span className="shop-stat-label">Revenue</span>
              <DollarSign className="shop-stat-icon" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="shop-stat-value">
                  {formatCurrency(stats?.totalRevenue ?? 0)}
                </div>
                <div className="shop-stat-subtext">All time</div>
              </>
            )}
          </div>

          <div className="shop-stat-card">
            <div className="shop-stat-header">
              <span className="shop-stat-label">Products</span>
              <Package className="shop-stat-icon" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="shop-stat-value">{products.length}</div>
                <div className="shop-stat-subtext">{activeProducts} active</div>
              </>
            )}
          </div>

          <div className="shop-stat-card">
            <div className="shop-stat-header">
              <span className="shop-stat-label">Orders</span>
              <ShoppingCart className="shop-stat-icon" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="shop-stat-value">{stats?.totalOrders ?? 0}</div>
                <div className="shop-stat-subtext">
                  {stats?.pendingOrders ?? 0} pending
                </div>
              </>
            )}
          </div>

          <div className="shop-stat-card">
            <div className="shop-stat-header">
              <span className="shop-stat-label">Customers</span>
              <Users className="shop-stat-icon" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="shop-stat-value">{customers.length}</div>
                <div className="shop-stat-subtext">Registered accounts</div>
              </>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="shop-links-grid">
          <Link href={`/${id}/shop/products`} className="shop-link-card">
            <div className="shop-link-card-header">
              <div className="shop-link-card-icon">
                <Package />
              </div>
              <div>
                <div className="shop-link-card-title">Products</div>
                <div className="shop-link-card-description">
                  Manage your product catalog
                </div>
              </div>
            </div>
            <div className="shop-link-card-footer">
              <span className="shop-link-card-count">
                {products.length} products
              </span>
              <ArrowRight className="shop-link-card-arrow" />
            </div>
          </Link>

          <Link href={`/${id}/shop/orders`} className="shop-link-card">
            <div className="shop-link-card-header">
              <div className="shop-link-card-icon">
                <ShoppingCart />
              </div>
              <div>
                <div className="shop-link-card-title">Orders</div>
                <div className="shop-link-card-description">
                  View and manage orders
                </div>
              </div>
            </div>
            <div className="shop-link-card-footer">
              <span className="shop-link-card-count">
                {stats?.pendingOrders ?? 0} pending
              </span>
              <ArrowRight className="shop-link-card-arrow" />
            </div>
          </Link>

          <Link href={`/${id}/shop/customers`} className="shop-link-card">
            <div className="shop-link-card-header">
              <div className="shop-link-card-icon">
                <Users />
              </div>
              <div>
                <div className="shop-link-card-title">Customers</div>
                <div className="shop-link-card-description">
                  View customer information
                </div>
              </div>
            </div>
            <div className="shop-link-card-footer">
              <span className="shop-link-card-count">
                {customers.length} customers
              </span>
              <ArrowRight className="shop-link-card-arrow" />
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="shop-recent-orders">
          <div className="shop-recent-orders-header">
            <h3 className="shop-recent-orders-title">Recent Orders</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/${id}/shop/orders`}>
                View all
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          {isLoading ? (
            <div className="shop-recent-orders-body">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="shop-recent-order-row">
                  <div className="shop-recent-order-info">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <div className="shop-recent-order-right">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="shop-empty-orders">No orders yet</div>
          ) : (
            <div className="shop-recent-orders-body">
              {orders.slice(0, 5).map((order: Order) => (
                <Link
                  key={order.id}
                  href={`/${id}/shop/orders/${order.id}`}
                  className="shop-recent-order-row"
                >
                  <div className="shop-recent-order-info">
                    <span className="shop-recent-order-number">
                      Order #{order.orderNumber}
                    </span>
                    <span className="shop-recent-order-email">
                      {order.email}
                    </span>
                  </div>
                  <div className="shop-recent-order-right">
                    <span className="shop-recent-order-total">
                      {formatCurrency(order.total)}
                    </span>
                    <span className="shop-recent-order-status">
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
