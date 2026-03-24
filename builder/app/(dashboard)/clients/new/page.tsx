"use client";

import { useRouter } from "next/navigation";
import { useCreateTenant } from "@/lib/hooks/use-tenants";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ClientForm } from "../components/client-form";
import type { ClientFormValues } from "../components/client-form";

import "./new-client.css";

// =============================================================================
// Component
// =============================================================================

export default function NewClientPage() {
  const router = useRouter();
  const createTenant = useCreateTenant();

  const handleSubmit = async (data: ClientFormValues) => {
    try {
      await createTenant.mutateAsync({
        businessName: data.businessName,
        slug: data.slug,
        businessType: data.businessType,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        tier: data.tier,
        status: data.status,
      });
      toast.success("Client created successfully");
      router.push("/clients");
    } catch {
      toast.error("Failed to create client");
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="new-client-page">
      <PageHeader
        title="New Client"
        icon={BriefcaseBusiness}
        description="Create a new client workspace"
        additionalActions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/clients")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        }
      />

      <ClientForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => router.push("/clients")}
        isPending={createTenant.isPending}
      />
    </div>
  );
}
