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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LayoutHeading } from "@/components/layout/layout-heading";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Star,
  MapPin,
  ShoppingCart,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";
import { FormItem } from "@/components/ui/form";

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string; customerId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id, customerId } = resolvedParams;
  const router = useRouter();

  const { data: customer, isLoading, error } = useCustomer(id, customerId);
  const { data: addresses } = useCustomerAddresses(id, customerId);
  const { data: ordersData } = useOrders(id, { customerId });
  const updateCustomer = useUpdateCustomer(id);
  const createAddress = useCreateCustomerAddress(id, customerId);
  const deleteAddress = useDeleteCustomerAddress(id, customerId);
  const setDefaultAddress = useSetDefaultAddress(id, customerId);

  const [formData, setFormData] = React.useState<UpdateCustomerDto>({});
  const [isAddressDialogOpen, setIsAddressDialogOpen] = React.useState(false);
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

  const handleChange = (
    field: keyof UpdateCustomerDto,
    value: string | boolean | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateCustomer.mutateAsync({ id: customerId, data: formData });
      toast.success("Customer updated successfully");
    } catch {
      toast.error("Failed to update customer");
    }
  };

  const handleAddAddress = async () => {
    try {
      await createAddress.mutateAsync(newAddress);
      toast.success("Address added successfully");
      setIsAddressDialogOpen(false);
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
        toast.success("Address deleted successfully");
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

  if (isLoading) return <div className="p-6">Loading customer...</div>;
  if (error)
    return <div className="p-6">Error loading customer: {error.message}</div>;
  if (!customer) return <div className="p-6">Customer not found</div>;

  const orders = ordersData?.orders ?? [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/${id}/shop/customers`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
      </div>

      <LayoutHeading
        title={
          customer.firstName
            ? `${customer.firstName} ${customer.lastName || ""}`
            : customer.email
        }
        description={`Customer since ${formatDate(customer.createdAt)}`}
        actions={
          <Button onClick={handleSave} disabled={updateCustomer.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateCustomer.isPending ? "Saving..." : "Save Changes"}
          </Button>
        }
      />

      <Tabs defaultValue="details" className="mt-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="addresses">
            Addresses ({addresses?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormItem className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName || ""}
                        onChange={(e) =>
                          handleChange("firstName", e.target.value)
                        }
                      />
                    </FormItem>
                    <FormItem className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName || ""}
                        onChange={(e) =>
                          handleChange("lastName", e.target.value)
                        }
                      />
                    </FormItem>
                  </div>

                  <FormItem className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </FormItem>

                  <FormItem className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ""}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </FormItem>

                  <FormItem className="space-y-2">
                    <Label htmlFor="note">Notes</Label>
                    <Textarea
                      id="note"
                      value={formData.note || ""}
                      onChange={(e) => handleChange("note", e.target.value)}
                      rows={3}
                      placeholder="Internal notes about this customer..."
                    />
                  </FormItem>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Marketing</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormItem>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.acceptsMarketing ?? false}
                        onChange={(e) =>
                          handleChange("acceptsMarketing", e.target.checked)
                        }
                        className="rounded border-gray-300"
                      />
                      <div>
                        <span className="font-medium">Accepts marketing</span>
                        <p className="text-sm text-muted-foreground">
                          Customer has opted in to receive marketing emails
                        </p>
                      </div>
                    </label>
                  </FormItem>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Orders</span>
                    <span className="font-medium">
                      {customer._count?.orders || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Spent</span>
                    <span className="font-medium">
                      {formatPrice(customer.totalSpent || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Addresses</span>
                    <span className="font-medium">
                      {customer._count?.addresses || 0}
                    </span>
                  </div>
                  {customer.userId && (
                    <div className="pt-2 border-t">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Has User Account
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="addresses" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Addresses
              </CardTitle>
              <Dialog
                open={isAddressDialogOpen}
                onOpenChange={setIsAddressDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Address
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Address</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid gap-4 grid-cols-2">
                      <FormItem className="space-y-2">
                        <Label>First Name</Label>
                        <Input
                          value={newAddress.firstName}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                        />
                      </FormItem>
                      <FormItem className="space-y-2">
                        <Label>Last Name</Label>
                        <Input
                          value={newAddress.lastName}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                        />
                      </FormItem>
                    </div>
                    <FormItem className="space-y-2">
                      <Label>Address Line 1</Label>
                      <Input
                        value={newAddress.address1}
                        onChange={(e) =>
                          setNewAddress((prev) => ({
                            ...prev,
                            address1: e.target.value,
                          }))
                        }
                      />
                    </FormItem>
                    <FormItem className="space-y-2">
                      <Label>Address Line 2</Label>
                      <Input
                        value={newAddress.address2 || ""}
                        onChange={(e) =>
                          setNewAddress((prev) => ({
                            ...prev,
                            address2: e.target.value,
                          }))
                        }
                      />
                    </FormItem>
                    <div className="grid gap-4 grid-cols-2">
                      <FormItem className="space-y-2">
                        <Label>City</Label>
                        <Input
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                        />
                      </FormItem>
                      <FormItem className="space-y-2">
                        <Label>State/Province</Label>
                        <Input
                          value={newAddress.province || ""}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              province: e.target.value,
                            }))
                          }
                        />
                      </FormItem>
                    </div>
                    <div className="grid gap-4 grid-cols-2">
                      <FormItem className="space-y-2">
                        <Label>Postal Code</Label>
                        <Input
                          value={newAddress.postalCode}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              postalCode: e.target.value,
                            }))
                          }
                        />
                      </FormItem>
                      <FormItem className="space-y-2">
                        <Label>Country</Label>
                        <Input
                          value={newAddress.country}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              country: e.target.value,
                            }))
                          }
                        />
                      </FormItem>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleAddAddress}
                      disabled={createAddress.isPending}
                    >
                      {createAddress.isPending ? "Adding..." : "Add Address"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {!addresses || addresses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No addresses saved
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="p-4 border rounded-lg relative"
                    >
                      {address.isDefault && (
                        <span className="absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Star className="mr-1 h-3 w-3" />
                          Default
                        </span>
                      )}
                      <p className="font-medium">
                        {address.firstName} {address.lastName}
                      </p>
                      {address.company && (
                        <p className="text-sm">{address.company}</p>
                      )}
                      <p className="text-sm">{address.address1}</p>
                      {address.address2 && (
                        <p className="text-sm">{address.address2}</p>
                      )}
                      <p className="text-sm">
                        {address.city}, {address.province} {address.postalCode}
                      </p>
                      <p className="text-sm">{address.country}</p>
                      {address.phone && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {address.phone}
                        </p>
                      )}
                      <div className="flex gap-2 mt-3">
                        {!address.isDefault && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSetDefault(address.id)}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No orders yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() =>
                          router.push(`/${id}/shop/orders/${order.id}`)
                        }
                      >
                        <TableCell className="font-medium">
                          #{order.orderNumber}
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              order.paymentStatus === "paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice(order.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
