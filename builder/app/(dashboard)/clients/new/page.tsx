"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateTenant } from "@/lib/hooks/use-tenants";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const clientIntakeSchema = z.object({
  // Section 1: General Info & Proposal
  businessName: z.string().min(1, "Business name is required"),
  slug: z.string().min(1, "Slug is required"),
  businessType: z.string().optional(),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  contactPhone: z.string().optional(),

  // Section 2: Meetings
  initialMeetingDate: z.string().optional(),
  meetingNotes: z.string().optional(),

  // Section 3: Client Data
  logoUrl: z.string().optional(),
  brandColors: z.string().optional(),

  // Section 4: Build Details
  projectScope: z.string().optional(),
  timeline: z.string().optional(),

  // Section 5: Maintenance
  maintenancePlan: z.string().optional(),
});

type ClientIntakeForm = z.infer<typeof clientIntakeSchema>;

export default function ClientIntakePage() {
  const router = useRouter();
  const createTenant = useCreateTenant();

  const form = useForm<ClientIntakeForm>({
    resolver: zodResolver(clientIntakeSchema),
    defaultValues: {
      businessName: "",
      slug: "",
      businessType: "",
      contactEmail: "",
      contactPhone: "",
      initialMeetingDate: "",
      meetingNotes: "",
      logoUrl: "",
      brandColors: "",
      projectScope: "",
      timeline: "",
      maintenancePlan: "",
    },
  });

  const onSubmit = (data: ClientIntakeForm) => {
    createTenant.mutate(
      {
        businessName: data.businessName,
        slug: data.slug,
        businessType: data.businessType,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
      },
      {
        onSuccess: () => {
          router.push("/clients");
        },
      },
    );
  };

  return (
    <PageLayout
      title="Client Intake"
      // icon={UserPlus}
      description="Complete all sections to onboard a new client"
      backLabel="Back to Clients"
      onBack={() => router.push("/clients")}
      maxWidth="lg"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. General Info & Proposal</CardTitle>
            </CardHeader>
            <CardContent>
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

          <Card>
            <CardHeader>
              <CardTitle>2. Client Meetings & Meeting Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="initialMeetingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Meeting Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meetingNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Notes</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Client Provided Data</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brandColors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Colors</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Website Build Details</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="projectScope"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Scope</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeline</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Monthly Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="maintenancePlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maintenance Plan</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" disabled={createTenant.isPending}>
            {createTenant.isPending ? "Creating..." : "Create Client"}
          </Button>
        </form>
      </Form>
    </PageLayout>
  );
}
