"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useCustomers,
  useCustomerStats,
  useDeleteCustomer,
  type Customer,
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
  Trash2,
  Search,
  Users,
  UserCheck,
  Mail,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useResolvedTenant } from "@/lib/hooks/use-resolved-tenant";

import "./customers.css";

export default function CustomersPage() {
  const { tenantId } = useResolvedTenant();
  const id = tenantId!;
  const router = useRouter();

  const [search, setSearch] = React.useState("");
  const [accountFilter, setAccountFilter] = React.useState<string>("all");
  const [marketingFilter, setMarketingFilter] = React.useState<string>("all");

  const {
    data: customersData,
    isLoading,
    error,
  } = useCustomers(id, {
    search: search || undefined,
    hasAccount: accountFilter !== "all" ? accountFilter === "yes" : undefined,
    acceptsMarketing:
      marketingFilter !== "all" ? marketingFilter === "yes" : undefined,
  });
  const { data: stats, isLoading: statsLoading } = useCustomerStats(id);
  const deleteCustomer = useDeleteCustomer(id);

  const customers = customersData?.customers ?? [];
  const total = customersData?.total ?? 0;

  // Surface errors via toast
  React.useEffect(() => {
    if (error) {
      toast.error("Failed to load customers");
    }
  }, [error]);

  const handleView = (customerId: string) => {
    router.push(`/shop/customers/${customerId}`);
  };

  const handleDelete = async (customer: Customer) => {
    const name = customer.firstName
      ? `${customer.firstName} ${customer.lastName || ""}`
      : customer.email;
    if (
      confirm(`Delete customer "${name}"? This will not delete their orders.`)
    ) {
      try {
        await deleteCustomer.mutateAsync(customer.id);
        toast.success("Customer deleted successfully");
      } catch {
        toast.error("Failed to delete customer");
      }
    }
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
    <div className="customers-page">
      <PageHeader
        title="Customers"
        icon={Users}
        count={total}
        singularName="customer"
        pluralName="customers"
        actionLabel="Add Customer"
        actionIcon={PlusCircle}
        onAction={() => router.push("/shop/customers/new")}
      />

      {/* Stats Row */}
      <div className="customers-stats-row">
        {statsLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="customers-skeleton-stat" />
            ))}
          </>
        ) : stats ? (
          <>
            <div className="customers-stat-card">
              <div className="customers-stat-header">
                <span className="customers-stat-label">Total Customers</span>
                <Users className="customers-stat-icon" />
              </div>
              <div className="customers-stat-value">{stats.totalCustomers}</div>
            </div>
            <div className="customers-stat-card">
              <div className="customers-stat-header">
                <span className="customers-stat-label">With Accounts</span>
                <UserCheck className="customers-stat-icon" />
              </div>
              <div className="customers-stat-value">
                {stats.customersWithAccounts}
              </div>
            </div>
            <div className="customers-stat-card">
              <div className="customers-stat-header">
                <span className="customers-stat-label">Marketing Opt-ins</span>
                <Mail className="customers-stat-icon" />
              </div>
              <div className="customers-stat-value">
                {stats.marketingOptIns}
              </div>
            </div>
            <div className="customers-stat-card">
              <div className="customers-stat-header">
                <span className="customers-stat-label">Avg. Order Value</span>
                <Mail className="customers-stat-icon" />
              </div>
              <div className="customers-stat-value">
                {formatCurrency(stats.averageOrderValue)}
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Filters */}
      <div className="customers-filters">
        <div className="customers-search">
          <Search className="customers-search-icon" />
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="customers-search-input"
          />
        </div>
        <Select value={accountFilter} onValueChange={setAccountFilter}>
          <SelectTrigger className="customers-filter-select">
            <SelectValue placeholder="Account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Accounts</SelectItem>
            <SelectItem value="yes">With Account</SelectItem>
            <SelectItem value="no">No Account</SelectItem>
          </SelectContent>
        </Select>
        <Select value={marketingFilter} onValueChange={setMarketingFilter}>
          <SelectTrigger className="customers-filter-select">
            <SelectValue placeholder="Marketing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Marketing</SelectItem>
            <SelectItem value="yes">Opted In</SelectItem>
            <SelectItem value="no">Opted Out</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="customers-skeleton-row">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-8" />
            </div>
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="customers-empty">
          <Users className="customers-empty-icon" />
          <h3>No customers found</h3>
          <p>
            Customers will appear here when they create accounts or place
            orders.
          </p>
        </div>
      ) : (
        <table className="customers-table">
          <thead className="customers-table-header">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Orders</th>
              <th className="customers-col-spent">Total Spent</th>
              <th>Marketing</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="customers-table-body">
            {customers.map((customer) => (
              <tr key={customer.id} className="customers-table-row">
                <td>
                  <div className="customers-col-name">
                    {customer.firstName || customer.lastName
                      ? `${customer.firstName || ""} ${customer.lastName || ""}`
                      : "\u2014"}
                  </div>
                  {customer.userId && (
                    <span className="customers-account-badge">Has Account</span>
                  )}
                </td>
                <td className="customers-col-email">{customer.email}</td>
                <td className="customers-col-orders">
                  {customer._count?.orders || 0}
                </td>
                <td className="customers-col-spent">
                  {formatCurrency(customer.totalSpent || 0)}
                </td>
                <td>
                  {customer.acceptsMarketing ? (
                    <span className="customers-marketing-pill customers-marketing-yes">
                      Yes
                    </span>
                  ) : (
                    <span className="customers-marketing-pill customers-marketing-no">
                      No
                    </span>
                  )}
                </td>
                <td className="customers-col-date">
                  {formatDate(customer.createdAt)}
                </td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="customers-actions-trigger"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(customer.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(customer)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
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
