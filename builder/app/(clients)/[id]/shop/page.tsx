"use client";

import * as React from "react";
import Link from "next/link";
import { useProducts, useOrders, useCustomers } from "@/lib/hooks";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Receipt,
  Users,
  DollarSign,
  ShoppingCart,
  ArrowRight,
  Plus,
  Store,
} from "lucide-react";

export default function ShopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const { data: productsData, isLoading: productsLoading } = useProducts(id);
  const { data: ordersData, isLoading: ordersLoading } = useOrders(id);
  const { data: customersData, isLoading: customersLoading } = useCustomers(id);

  const products = productsData?.products ?? [];
  const orders = Array.isArray(ordersData) ? ordersData : ordersData?.orders ?? [];
  const customers = Array.isArray(customersData) ? customersData : customersData?.customers ?? [];

  // Calculate stats
  let totalRevenue = 0;
  let pendingOrders = 0;
  for (const order of orders) {
    totalRevenue += order.total || 0;
    if (order.status === "pending") pendingOrders++;
  }
  const activeProducts = products.filter((p) => p.status === "active").length;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const isLoading = productsLoading || ordersLoading || customersLoading;

  return (
    <PageLayout
      title="Shop Dashboard"
      icon={Store}
      description="Manage your products, orders, and customers"
      actions={
        <Button asChild>
          <Link href={`/${id}/shop/products/new`}>
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-(--muted-foreground)">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-(--muted-foreground)" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-(--muted-foreground)">
              Products
            </CardTitle>
            <Package className="h-4 w-4 text-(--muted-foreground)" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-(--muted-foreground)">
                  {activeProducts} active
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-(--muted-foreground)">
              Orders
            </CardTitle>
            <Receipt className="h-4 w-4 text-(--muted-foreground)" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-(--muted-foreground)">
                  {pendingOrders} pending
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-(--muted-foreground)">
              Customers
            </CardTitle>
            <Users className="h-4 w-4 text-(--muted-foreground)" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{customers.length}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:border-(--primary) transition-colors cursor-pointer">
          <Link href={`/${id}/shop/products`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-(--primary)/10 rounded-lg">
                  <Package className="h-5 w-5 text-(--primary)" />
                </div>
                <div>
                  <CardTitle className="text-base">Products</CardTitle>
                  <p className="text-sm text-(--muted-foreground)">
                    Manage your product catalog
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-(--muted-foreground)">
                  {products.length} products
                </span>
                <ArrowRight className="h-4 w-4 text-(--muted-foreground)" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:border-(--primary) transition-colors cursor-pointer">
          <Link href={`/${id}/shop/orders`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-(--primary)/10 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-(--primary)" />
                </div>
                <div>
                  <CardTitle className="text-base">Orders</CardTitle>
                  <p className="text-sm text-(--muted-foreground)">
                    View and manage orders
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-(--muted-foreground)">
                  {pendingOrders} pending
                </span>
                <ArrowRight className="h-4 w-4 text-(--muted-foreground)" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:border-(--primary) transition-colors cursor-pointer">
          <Link href={`/${id}/shop/customers`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-(--primary)/10 rounded-lg">
                  <Users className="h-5 w-5 text-(--primary)" />
                </div>
                <div>
                  <CardTitle className="text-base">Customers</CardTitle>
                  <p className="text-sm text-(--muted-foreground)">
                    View customer information
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-(--muted-foreground)">
                  {customers.length} customers
                </span>
                <ArrowRight className="h-4 w-4 text-(--muted-foreground)" />
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/${id}/shop/orders`}>
                View all
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-(--muted)/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">Order #{order.orderNumber}</p>
                    <p className="text-sm text-(--muted-foreground)">
                      {order.customerEmail}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.total || 0)}</p>
                    <p className="text-xs text-(--muted-foreground) capitalize">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </PageLayout>
  );
}
