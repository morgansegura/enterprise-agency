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
import { PageLayout } from "@/components/layout/page-layout";
import { BriefcaseBusiness, MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";

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

  const getServiceType = (features: Record<string, boolean>) => {
    const types = [];
    if (features["pages.view"] || features["builder.access"]) types.push("CMS");
    if (features["shop.enabled"]) types.push("SHOP");
    if (features["bookings.enabled"]) types.push("BnB");
    return types.length > 0 ? types.join(", ") : "None";
  };

  if (isLoading) {
    return (
      <PageLayout
        title="Manage Clients"
        icon={BriefcaseBusiness}
        description="Loading..."
      >
        <div className="flex items-center justify-center py-12">
          <p className="text-(--muted-foreground)">Loading clients...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title="Manage Clients"
        icon={BriefcaseBusiness}
        description="Error loading clients"
      >
        <div className="flex items-center justify-center py-12">
          <p className="text-(--destructive)">{error.message}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Manage Clients"
      icon={BriefcaseBusiness}
      description={`${tenants?.length || 0} total clients`}
      actions={
        <Button onClick={() => router.push("/dashboard/clients/new")}>
          <Plus className="h-4 w-4" />
          New Client
        </Button>
      }
    >
      {!tenants || tenants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BriefcaseBusiness className="h-16 w-16 text-(--muted-foreground) mb-4" />
          <h3 className="text-lg font-medium mb-2">No clients yet</h3>
          <p className="text-(--muted-foreground) mb-4">
            Create your first client to get started
          </p>
          <Button onClick={() => router.push("/dashboard/clients/new")}>
            <Plus className="h-4 w-4 mr-2" />
            New Client
          </Button>
        </div>
      ) : (
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
      )}
    </PageLayout>
  );
}
