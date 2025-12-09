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
  Trash2,
  Search,
  Users,
  UserCheck,
  Mail,
  TrendingUp,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

export default function CustomersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
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
  const { data: stats } = useCustomerStats(id);
  const deleteCustomer = useDeleteCustomer(id);

  const customers = customersData?.customers ?? [];
  const total = customersData?.total ?? 0;

  const handleView = (customerId: string) => {
    router.push(`/${id}/shop/customers/${customerId}`);
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
    });
  };

  if (isLoading) return <div className="p-6">Loading customers...</div>;
  if (error)
    return <div className="p-6">Error loading customers: {error.message}</div>;

  return (
    <div className="p-6">
      <LayoutHeading
        title="Customers"
        description={
          total > 0 ? `${total} total customers` : "No customers yet"
        }
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/${id}/shop/customers/new`)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        }
      />

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                With Accounts
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.customersWithAccounts}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Marketing Opt-ins
              </CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.marketingOptIns}</div>
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
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={accountFilter} onValueChange={setAccountFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="yes">With Account</SelectItem>
            <SelectItem value="no">No Account</SelectItem>
          </SelectContent>
        </Select>
        <Select value={marketingFilter} onValueChange={setMarketingFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Marketing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="yes">Opted In</SelectItem>
            <SelectItem value="no">Opted Out</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No customers found.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
              <TableHead>Marketing</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="font-medium">
                    {customer.firstName || customer.lastName
                      ? `${customer.firstName || ""} ${customer.lastName || ""}`
                      : "—"}
                  </div>
                  {customer.userId && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                      Has Account
                    </span>
                  )}
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer._count?.orders || 0}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatPrice(customer.totalSpent || 0)}
                </TableCell>
                <TableCell>
                  {customer.acceptsMarketing ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      No
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(customer.createdAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
