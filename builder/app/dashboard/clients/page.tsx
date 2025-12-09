"use client";

import { useRouter } from "next/navigation";
import { useTenants, useDeleteTenant } from "@/lib/hooks/use-tenants";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LayoutHeading } from "@/components/layout/layout-heading";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export default function ClientsPage() {
  const router = useRouter();
  const { data: tenants, isLoading, error } = useTenants();
  const deleteTenant = useDeleteTenant();

  const handleEdit = (tenantId: string) => {
    router.push(`/dashboard/clients/${tenantId}`);
  };

  const handleDelete = (tenant: { id: string; businessName: string }) => {
    if (confirm(`Delete ${tenant.businessName}?`)) {
      deleteTenant.mutate(tenant.id);
    }
  };

  if (isLoading) return <div>Loading clients...</div>;
  if (error) return <div>Error loading clients: {error.message}</div>;
  if (!tenants || tenants.length === 0) return <div>No clients found</div>;

  const getServiceType = (features: Record<string, boolean>) => {
    const types = [];
    if (features["pages.view"] || features["builder.access"]) types.push("CMS");
    if (features["shop.enabled"]) types.push("SHOP");
    if (features["bookings.enabled"]) types.push("BnB");
    return types.length > 0 ? types.join(", ") : "None";
  };

  return (
    <div>
      <div>
        <LayoutHeading
          title="Manage Clients"
          description={`${tenants.length} total clients`}
          actions={
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push("/dashboard/clients/new")}
            >
              Client Intake
            </Button>
          }
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Services</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell>{tenant.businessName}</TableCell>
              <TableCell>{tenant.slug}</TableCell>
              <TableCell>
                {getServiceType(tenant.enabledFeatures || {})}
              </TableCell>
              <TableCell>{tenant.status}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(tenant.id)}>
                      <Pencil />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(tenant)}>
                      <Trash2 />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
