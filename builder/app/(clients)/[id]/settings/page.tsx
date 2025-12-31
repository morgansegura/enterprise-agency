"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTenant, useUpdateTenant } from "@/lib/hooks/use-tenants";
import { useUploadAsset } from "@/lib/hooks/use-assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { BrandingUpload } from "@/components/ui/branding-upload";
import { toast } from "sonner";
import { Check, Building2, Mail, Phone, Globe } from "lucide-react";

import "./settings.css";

export default function SettingsPage() {
  const params = useParams();
  const tenantId = params?.id as string;
  const { data: tenant, isLoading, error } = useTenant(tenantId);
  const updateTenant = useUpdateTenant();
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

  const handleBrandingChange = (field: keyof typeof formData, value: string) => {
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

  if (error) {
    return (
      <div className="settings-error">
        <p>Error loading settings: {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="settings-container">
        <div className="settings-header">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="settings-loading">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your workspace branding and contact information</p>
      </div>

      {/* Branding Section */}
      <div className="settings-section">
        <h2 className="settings-section-title">Branding</h2>
        <p className="settings-section-description">
          Customize how your workspace appears to visitors
        </p>

        <div className="settings-form">
          <div className="settings-field">
            <Label htmlFor="businessName" className="settings-field-label">
              <Building2 className="inline h-4 w-4 mr-1" />
              Business Name
            </Label>
            <Input
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Your Business Name"
            />
          </div>

          <div className="settings-field">
            <Label htmlFor="businessType" className="settings-field-label">
              Business Type
            </Label>
            <Input
              id="businessType"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              placeholder="e.g., Restaurant, Agency, Retail"
            />
          </div>

          {/* Logo Uploads */}
          <div className="settings-field">
            <Label className="settings-field-label mb-3 block">
              Brand Assets
            </Label>
            <div className="flex flex-wrap gap-6">
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
            <p className="text-xs text-muted-foreground mt-3">
              The icon will automatically be used as your site's favicon.
            </p>
          </div>

          <div className="settings-field">
            <Label htmlFor="metaDescription" className="settings-field-label">
              <Globe className="inline h-4 w-4 mr-1" />
              Site Description
            </Label>
            <Textarea
              id="metaDescription"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              placeholder="A brief description of your site for search engines"
              rows={3}
            />
            <p className="settings-field-description">
              Used as the default meta description for SEO
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="settings-section">
        <h2 className="settings-section-title">Contact Information</h2>
        <p className="settings-section-description">
          Public contact details for your business
        </p>

        <div className="settings-form">
          <div className="settings-field">
            <Label htmlFor="contactEmail" className="settings-field-label">
              <Mail className="inline h-4 w-4 mr-1" />
              Contact Email
            </Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="contact@example.com"
            />
          </div>

          <div className="settings-field">
            <Label htmlFor="contactPhone" className="settings-field-label">
              <Phone className="inline h-4 w-4 mr-1" />
              Contact Phone
            </Label>
            <Input
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
      </div>

      {/* Plan Section */}
      <div className="settings-section">
        <h2 className="settings-section-title">Current Plan</h2>

        <div className="flex items-center gap-3 mb-4">
          <span
            className={`settings-tier-badge ${
              tenant?.tier === "BUILDER"
                ? "settings-tier-badge-builder"
                : "settings-tier-badge-content-editor"
            }`}
          >
            {tenant?.tier === "BUILDER" ? "Builder" : "Content Editor"}
          </span>
          <span className="text-sm text-(--muted-foreground)">
            {tenant?.tier === "BUILDER"
              ? "Full access to all features"
              : "Content editing capabilities"}
          </span>
        </div>

        {tenant?.tier !== "BUILDER" && (
          <div className="settings-upgrade-card">
            <h3 className="settings-upgrade-title">Upgrade to Builder</h3>
            <p className="settings-upgrade-description">
              Get full control over your site with advanced features
            </p>
            <div className="settings-upgrade-features">
              <div className="settings-upgrade-feature">
                <Check className="settings-upgrade-feature-icon" />
                <span>Create and delete pages</span>
              </div>
              <div className="settings-upgrade-feature">
                <Check className="settings-upgrade-feature-icon" />
                <span>Layout blocks (Grid, Flex, Columns)</span>
              </div>
              <div className="settings-upgrade-feature">
                <Check className="settings-upgrade-feature-icon" />
                <span>Advanced theme customization</span>
              </div>
              <div className="settings-upgrade-feature">
                <Check className="settings-upgrade-feature-icon" />
                <span>Priority support</span>
              </div>
            </div>
            <Button disabled>Contact Us to Upgrade</Button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="settings-actions">
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
