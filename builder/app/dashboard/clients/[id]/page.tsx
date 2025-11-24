"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTenant, useUpdateTenant } from "@/lib/hooks/use-tenants";
import { LayoutHeading } from "@/components/layout/layout-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";
import { DesignTokensTab } from "@/components/design-tokens";

const clientSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  slug: z.string().min(1, "Slug is required"),
  businessType: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
});

type ClientForm = z.infer<typeof clientSchema>;

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { data: tenant, isLoading, error } = useTenant(id);
  const updateTenant = useUpdateTenant();

  const form = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
    values: tenant
      ? {
          businessName: tenant.businessName || "",
          slug: tenant.slug || "",
          businessType: tenant.businessType || "",
          status: tenant.status || "",
          contactEmail: tenant.contactEmail || "",
          contactPhone: tenant.contactPhone || "",
        }
      : undefined,
  });

  if (isLoading) return <div>Loading client...</div>;
  if (error) return <div>Error loading client: {error.message}</div>;
  if (!tenant) return <div>Client not found</div>;

  const features = (tenant.enabledFeatures as Record<string, boolean>) || {};
  const enabledFeatures = Object.entries(features)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature);

  const onSubmit = (data: ClientForm) => {
    updateTenant.mutate(
      {
        id: id,
        data: {
          businessName: data.businessName,
          slug: data.slug,
          businessType: data.businessType,
          status: data.status,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
        },
      },
      {
        onSuccess: () => {
          router.push("/dashboard/clients");
        },
      },
    );
  };

  return (
    <div>
      <LayoutHeading
        title={tenant.businessName}
        description={`Client ID: ${tenant.id}`}
        back={
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/clients")}
          >
            <ArrowLeft />
          </Button>
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/${id}/pages`)}
          >
            Open Builder
          </Button>
        }
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Tabs defaultValue="business">
            <TabsList>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>

            <TabsContent value="business">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug (URL)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>Services & Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <dt>Enabled Features</dt>
                    <dd>
                      {enabledFeatures.length > 0
                        ? enabledFeatures.join(", ")
                        : "None"}
                    </dd>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design">
              <DesignTokensTab tenantId={id} />
            </TabsContent>

            <TabsContent value="technical">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <dt>Created</dt>
                    <dd>{new Date(tenant.createdAt).toLocaleDateString()}</dd>
                  </div>
                  <div>
                    <dt>Last Updated</dt>
                    <dd>{new Date(tenant.updatedAt).toLocaleDateString()}</dd>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Button type="submit" disabled={updateTenant.isPending}>
            {updateTenant.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
