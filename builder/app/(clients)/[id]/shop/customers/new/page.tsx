"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useCreateCustomer, type CreateCustomerDto } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutHeading } from "@/components/layout/layout-heading";
import { ArrowLeft, Save, Mail } from "lucide-react";
import { toast } from "sonner";
import { FormItem } from "@/components/ui/form";

export default function NewCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const createCustomer = useCreateCustomer(id);

  const [formData, setFormData] = React.useState<CreateCustomerDto>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    acceptsMarketing: false,
    note: "",
  });

  const handleChange = (
    field: keyof CreateCustomerDto,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const result = await createCustomer.mutateAsync(formData);
      toast.success("Customer created successfully");
      router.push(`/${id}/shop/customers/${result.id}`);
    } catch {
      toast.error("Failed to create customer");
    }
  };

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
        title="Add Customer"
        description="Create a new customer record"
      />

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormItem className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="customer@example.com"
                  />
                </FormItem>

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
                      onChange={(e) => handleChange("lastName", e.target.value)}
                    />
                  </FormItem>
                </div>

                <FormItem className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
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
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Marketing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormItem>
                  <label className="flex items-start gap-3">
                    <Input
                      type="checkbox"
                      checked={formData.acceptsMarketing}
                      onChange={(e) =>
                        handleChange("acceptsMarketing", e.target.checked)
                      }
                      className="rounded border-gray-300 mt-1"
                    />
                    <div>
                      <span className="font-medium">
                        Accepts marketing emails
                      </span>
                      <p className="text-sm text-muted-foreground">
                        Customer has agreed to receive promotional emails and
                        updates.
                      </p>
                    </div>
                  </label>
                </FormItem>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createCustomer.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {createCustomer.isPending ? "Creating..." : "Create Customer"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
