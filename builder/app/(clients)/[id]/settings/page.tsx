"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  useTenant,
  useUpdateTenant,
  useMarkAsTemplate,
} from "@/lib/hooks/use-tenants";
import { useUploadAsset } from "@/lib/hooks/use-assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { BrandingUpload } from "@/components/ui/branding-upload";
import { toast } from "sonner";
import {
  Check,
  Building2,
  Mail,
  Phone,
  Globe,
  Zap,
  Layers,
  Palette,
  Headphones,
  LayoutTemplate,
} from "lucide-react";

import "./settings.css";

// =============================================================================
// Settings Page
// =============================================================================

export default function SettingsPage() {
  const params = useParams();
  const tenantId = params?.id as string;
  const { data: tenant, isLoading, error } = useTenant(tenantId);
  const updateTenant = useUpdateTenant();
  const markAsTemplate = useMarkAsTemplate();
  const uploadAsset = useUploadAsset(tenantId);

  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    contactEmail: "",
    contactPhone: "",
    iconUrl: "",
    logoUrl: "",
    faviconUrl: "",
    metaDescription: "",
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (tenant) {
      const extendedTenant = tenant as {
        iconUrl?: string;
        logoUrl?: string;
        faviconUrl?: string;
        metaDescription?: string;
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing form state from server data
      setFormData({
        businessName: tenant.businessName || "",
        businessType: tenant.businessType || "",
        contactEmail: tenant.contactEmail || "",
        contactPhone: tenant.contactPhone || "",
        iconUrl: extendedTenant.iconUrl || "",
        logoUrl: extendedTenant.logoUrl || "",
        faviconUrl: extendedTenant.faviconUrl || "",
        metaDescription: extendedTenant.metaDescription || "",
      });
    }
  }, [tenant]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      await updateTenant.mutateAsync({
        id: tenantId,
        data: formData,
      });
      toast.success("Settings saved successfully");
      setIsDirty(false);
    } catch {
      toast.error("Failed to save settings");
    }
  };

  const handleReset = () => {
    if (tenant) {
      const extendedTenant = tenant as {
        iconUrl?: string;
        logoUrl?: string;
        faviconUrl?: string;
        metaDescription?: string;
      };
      setFormData({
        businessName: tenant.businessName || "",
        businessType: tenant.businessType || "",
        contactEmail: tenant.contactEmail || "",
        contactPhone: tenant.contactPhone || "",
        iconUrl: extendedTenant.iconUrl || "",
        logoUrl: extendedTenant.logoUrl || "",
        faviconUrl: extendedTenant.faviconUrl || "",
        metaDescription: extendedTenant.metaDescription || "",
      });
      setIsDirty(false);
    }
  };

  const handleBrandingChange = (
    field: keyof typeof formData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleUpload = async (file: File, usageContext: string) => {
    const result = await uploadAsset.mutateAsync({
      file,
      usageContext,
      altText: `${formData.businessName || "Company"} ${usageContext}`,
    });
    return { url: result.url };
  };

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (error) {
    return (
      <div className="settings-error">
        <p>Error loading settings: {error.message}</p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Loading skeleton
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="settings-skeleton">
        <div className="settings-skeleton-header">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="settings-skeleton-columns">
          <div className="settings-page-main">
            <div className="settings-skeleton-card">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="settings-skeleton-card">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="settings-skeleton-card">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="settings-page-sidebar">
            <div className="settings-skeleton-card">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Plan features
  // ---------------------------------------------------------------------------

  const planFeatures =
    tenant?.tier === "BUILDER"
      ? [
          { icon: Layers, label: "Create and manage unlimited pages" },
          { icon: Palette, label: "Advanced theme customization" },
          { icon: Zap, label: "Layout blocks (Grid, Flex, Columns)" },
          { icon: Headphones, label: "Priority support" },
        ]
      : [
          { icon: Layers, label: "Edit existing page content" },
          { icon: Palette, label: "Basic branding settings" },
        ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-page-header">
        <h1>Settings</h1>
        <p>Manage your workspace branding and contact information</p>
      </div>

      {/* Body */}
      <div className="settings-page-body">
        <div className="settings-page-columns">
          {/* Main Column (66%) */}
          <div className="settings-page-main">
            {/* Business Info */}
            <div className="settings-card">
              <div className="settings-card-header">
                <h2 className="settings-card-title">Business Information</h2>
                <p className="settings-card-description">
                  Core details about your workspace
                </p>
              </div>
              <div className="settings-card-body">
                <div className="settings-field-row">
                  <div className="settings-field">
                    <label
                      htmlFor="businessName"
                      className="settings-field-label"
                    >
                      <Building2 />
                      Business Name
                    </label>
                    <Input
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Your Business Name"
                      className="settings-field-input"
                    />
                  </div>
                  <div className="settings-field">
                    <label
                      htmlFor="businessType"
                      className="settings-field-label"
                    >
                      Business Type
                    </label>
                    <Input
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      placeholder="e.g., Restaurant, Agency, Retail"
                      className="settings-field-input"
                    />
                  </div>
                </div>
                <div className="settings-field">
                  <label
                    htmlFor="metaDescription"
                    className="settings-field-label"
                  >
                    <Globe />
                    Site Description
                  </label>
                  <Textarea
                    id="metaDescription"
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleChange}
                    placeholder="A brief description of your site for search engines"
                    rows={3}
                    className="settings-field-textarea"
                  />
                  <p className="settings-field-hint">
                    Used as the default meta description for SEO
                  </p>
                </div>
              </div>
            </div>

            {/* Branding */}
            <div className="settings-card">
              <div className="settings-card-header">
                <h2 className="settings-card-title">Branding</h2>
                <p className="settings-card-description">
                  Customize how your workspace appears to visitors
                </p>
              </div>
              <div className="settings-card-body">
                <div className="settings-field">
                  <label className="settings-field-label">Brand Assets</label>
                  <div className="settings-branding-row">
                    <BrandingUpload
                      label="Icon"
                      description="Square icon (SVG recommended). Used as favicon and in compact layouts."
                      value={formData.iconUrl}
                      onChange={(url) => handleBrandingChange("iconUrl", url)}
                      onUpload={(file) => handleUpload(file, "brand-icon")}
                      accept="image/svg+xml,image/png"
                      aspectRatio="square"
                      maxSizeKB={100}
                    />
                    <BrandingUpload
                      label="Full Logo"
                      description="Wide logo for headers and branding. SVG or PNG recommended."
                      value={formData.logoUrl}
                      onChange={(url) => handleBrandingChange("logoUrl", url)}
                      onUpload={(file) => handleUpload(file, "brand-logo")}
                      accept="image/svg+xml,image/png,image/jpeg,image/webp"
                      aspectRatio="wide"
                      maxSizeKB={500}
                    />
                  </div>
                  <p className="settings-field-hint">
                    The icon will automatically be used as your site&apos;s
                    favicon.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="settings-card">
              <div className="settings-card-header">
                <h2 className="settings-card-title">Contact Information</h2>
                <p className="settings-card-description">
                  Public contact details for your business
                </p>
              </div>
              <div className="settings-card-body">
                <div className="settings-field-row">
                  <div className="settings-field">
                    <label
                      htmlFor="contactEmail"
                      className="settings-field-label"
                    >
                      <Mail />
                      Contact Email
                    </label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      placeholder="contact@example.com"
                      className="settings-field-input"
                    />
                  </div>
                  <div className="settings-field">
                    <label
                      htmlFor="contactPhone"
                      className="settings-field-label"
                    >
                      <Phone />
                      Contact Phone
                    </label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="settings-field-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column (33%) */}
          <div className="settings-page-sidebar">
            {/* Current Plan */}
            <div className="settings-plan-card">
              <div className="settings-plan-header">
                <h2 className="settings-plan-title">Current Plan</h2>
                <span
                  className={`settings-tier-pill ${
                    tenant?.tier === "BUILDER"
                      ? "settings-tier-pill-builder"
                      : "settings-tier-pill-content-editor"
                  }`}
                >
                  {tenant?.tier === "BUILDER" ? "Builder" : "Content Editor"}
                </span>
              </div>
              <div className="settings-plan-body">
                <p className="settings-field-hint">
                  {tenant?.tier === "BUILDER"
                    ? "Full access to all features"
                    : "Content editing capabilities"}
                </p>

                <div className="settings-plan-features">
                  {planFeatures.map((feature) => (
                    <div key={feature.label} className="settings-plan-feature">
                      <Check />
                      <span>{feature.label}</span>
                    </div>
                  ))}
                </div>

                {tenant?.tier !== "BUILDER" && (
                  <div className="settings-upgrade-section">
                    <h3 className="settings-upgrade-heading">
                      Upgrade to Builder
                    </h3>
                    <p className="settings-upgrade-text">
                      Get full control over your site with advanced features
                    </p>
                    <Button disabled className="w-full">
                      Contact Us to Upgrade
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Template */}
            <div className="settings-card">
              <div className="settings-card-header">
                <h2 className="settings-card-title">
                  <LayoutTemplate className="inline h-4 w-4 mr-1.5" />
                  Template
                </h2>
                <p className="settings-card-description">
                  Make this site cloneable for new clients
                </p>
              </div>
              <div className="settings-card-body">
                {(tenant as { isTemplate?: boolean })?.isTemplate ? (
                  <div className="flex flex-col gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded w-fit">
                      <Check className="h-3 w-3" />
                      Active Template
                    </span>
                    <p className="text-xs text-muted-foreground">
                      This site appears in the Templates gallery and can be
                      cloned to create new client sites.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          await markAsTemplate.mutateAsync({
                            tenantId,
                          });
                          toast.success("Template status removed");
                        } catch {
                          toast.error("Failed to update template status");
                        }
                      }}
                      disabled={markAsTemplate.isPending}
                    >
                      Remove Template
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="text-xs text-muted-foreground">
                      Mark this site as a template to make it available for
                      cloning in the Templates gallery.
                    </p>
                    <Button
                      size="sm"
                      onClick={async () => {
                        try {
                          await markAsTemplate.mutateAsync({
                            tenantId,
                            templateName: tenant?.businessName,
                          });
                          toast.success("Marked as template");
                        } catch {
                          toast.error("Failed to mark as template");
                        }
                      }}
                      disabled={markAsTemplate.isPending}
                    >
                      <LayoutTemplate className="h-3.5 w-3.5" />
                      Mark as Template
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer Bar */}
      <div
        className={`settings-footer ${!isDirty ? "settings-footer-hidden" : ""}`}
      >
        <Button variant="outline" onClick={handleReset} disabled={!isDirty}>
          Reset
        </Button>
        <Button
          onClick={handleSave}
          disabled={!isDirty || updateTenant.isPending}
        >
          {updateTenant.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
