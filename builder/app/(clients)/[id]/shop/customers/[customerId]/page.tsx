"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useCustomer,
  useUpdateCustomer,
  useCustomerAddresses,
  useCreateCustomerAddress,
  useDeleteCustomerAddress,
  useSetDefaultAddress,
  useOrders,
  type UpdateCustomerDto,
  type CreateCustomerAddressDto,
} from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { CustomerInfoCard } from "./components/customer-info-card";
import { CustomerAddresses } from "./components/customer-addresses";
import { CustomerStats } from "./components/customer-stats";
import { CustomerOrders } from "./components/customer-orders";

import "./customer-detail.css";

// =============================================================================
// Component
// =============================================================================

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string; customerId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id: tenantId, customerId } = resolvedParams;
  const router = useRouter();

  const {
    data: customer,
    isLoading,
    error,
  } = useCustomer(tenantId, customerId);
  const { data: addresses } = useCustomerAddresses(tenantId, customerId);
  const { data: ordersData } = useOrders(tenantId, {
    customerId,
    limit: 10,
  });
  const updateCustomer = useUpdateCustomer(tenantId);
  const createAddress = useCreateCustomerAddress(tenantId, customerId);
  const deleteAddress = useDeleteCustomerAddress(tenantId, customerId);
  const setDefaultAddress = useSetDefaultAddress(tenantId, customerId);

  const [formData, setFormData] = React.useState<UpdateCustomerDto>({});
  const [isDirty, setIsDirty] = React.useState(false);
  const [showAddAddress, setShowAddAddress] = React.useState(false);
  const [newAddress, setNewAddress] = React.useState<CreateCustomerAddressDto>({
    firstName: "",
    lastName: "",
    address1: "",
    city: "",
    country: "US",
    postalCode: "",
  });

  React.useEffect(() => {
    if (customer) {
      setFormData({
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        acceptsMarketing: customer.acceptsMarketing,
        note: customer.note,
      });
    }
  }, [customer]);

  React.useEffect(() => {
    if (error) {
      toast.error("Failed to load customer");
    }
  }, [error]);

  const handleBack = () => router.push(`/${tenantId}/shop/customers`);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleToggleMarketing = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, acceptsMarketing: checked }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      await updateCustomer.mutateAsync({ id: customerId, data: formData });
      toast.success("Customer updated");
      setIsDirty(false);
    } catch {
      toast.error("Failed to update customer");
    }
  };

  const handleReset = () => {
    if (customer) {
      setFormData({
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        acceptsMarketing: customer.acceptsMarketing,
        note: customer.note,
      });
      setIsDirty(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.address1 || !newAddress.city || !newAddress.postalCode) {
      toast.error("Address, city, and postal code are required");
      return;
    }
    try {
      await createAddress.mutateAsync(newAddress);
      toast.success("Address added");
      setShowAddAddress(false);
      setNewAddress({
        firstName: "",
        lastName: "",
        address1: "",
        city: "",
        country: "US",
        postalCode: "",
      });
    } catch {
      toast.error("Failed to add address");
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (confirm("Delete this address?")) {
      try {
        await deleteAddress.mutateAsync(addressId);
        toast.success("Address deleted");
      } catch {
        toast.error("Failed to delete address");
      }
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await setDefaultAddress.mutateAsync(addressId);
      toast.success("Default address updated");
    } catch {
      toast.error("Failed to set default address");
    }
  };

  const orders = ordersData?.orders ?? [];

  // Compute stats
  const totalOrders = customer?._count?.orders || 0;
  const totalSpent = customer?.totalSpent || 0;
  const avgOrder = totalOrders > 0 ? totalSpent / totalOrders : 0;

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (error) {
    return (
      <div className="customer-detail-error">
        <p>Error loading customer: {error.message}</p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Skeleton
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="customer-detail-skeleton">
        <div className="customer-detail-skeleton-header">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="customer-detail-skeleton-columns">
          <div className="customer-detail-main">
            <div className="customer-detail-skeleton-card">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="customer-detail-skeleton-card">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
          <div className="customer-detail-sidebar">
            <div className="customer-detail-skeleton-card">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="customer-detail-skeleton-card">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="customer-detail-error">
        <p>Customer not found</p>
      </div>
    );
  }

  const customerName = customer.firstName
    ? `${customer.firstName} ${customer.lastName || ""}`
    : customer.email;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="customer-detail">
      {/* Header */}
      <div className="customer-detail-header">
        <div className="customer-detail-header-left">
          <button
            type="button"
            className="customer-detail-back"
            onClick={handleBack}
            aria-label="Back to customers"
          >
            <ArrowLeft />
          </button>
          <div className="customer-detail-title-section">
            <h1 className="customer-detail-title">{customerName}</h1>
            <span className="customer-detail-email">{customer.email}</span>
          </div>
        </div>
        <div className="customer-detail-actions">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || updateCustomer.isPending}
          >
            {updateCustomer.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="customer-detail-body">
        <div className="customer-detail-columns">
          {/* Main */}
          <div className="customer-detail-main">
            <CustomerInfoCard
              formData={formData}
              onChange={handleChange}
              onToggleMarketing={handleToggleMarketing}
            />

            <CustomerAddresses
              addresses={addresses}
              showAddForm={showAddAddress}
              onToggleAddForm={() => setShowAddAddress(!showAddAddress)}
              newAddress={newAddress}
              onNewAddressChange={setNewAddress}
              onAddAddress={handleAddAddress}
              onDeleteAddress={handleDeleteAddress}
              onSetDefault={handleSetDefault}
              isAddPending={createAddress.isPending}
            />
          </div>

          {/* Sidebar */}
          <div className="customer-detail-sidebar">
            <CustomerStats
              totalOrders={totalOrders}
              totalSpent={totalSpent}
              avgOrder={avgOrder}
              hasUserAccount={!!customer.userId}
            />

            <CustomerOrders
              orders={orders}
              tenantId={tenantId}
              onViewOrder={(orderId) =>
                router.push(`/${tenantId}/shop/orders/${orderId}`)
              }
            />
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div
        className={`customer-detail-footer ${!isDirty ? "customer-detail-footer-hidden" : ""}`}
      >
        <Button variant="outline" onClick={handleReset} disabled={!isDirty}>
          Reset
        </Button>
        <Button
          onClick={handleSave}
          disabled={!isDirty || updateCustomer.isPending}
        >
          {updateCustomer.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
