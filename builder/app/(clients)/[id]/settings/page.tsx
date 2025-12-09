"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTenant, useUpdateTenant } from "@/lib/hooks/use-tenants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ImageIcon, Check, Building2, Mail, Phone, Globe } from "lucide-react";

import "./settings.css";

export default function SettingsPage() {
  const params = useParams();
  const tenantId = params?.id as string;
  const { data: tenant, isLoading, error } = useTenant(tenantId);
  const updateTenant = useUpdateTenant();

  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    contactEmail: "",
    contactPhone: "",
    logoUrl: "",
    metaDescription: "",
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (tenant) {
      setFormData({
        businessName: tenant.businessName || "",
        businessType: tenant.businessType || "",
        contactEmail: tenant.contactEmail || "",
        contactPhone: tenant.contactPhone || "",
        logoUrl: (tenant as { logoUrl?: string }).logoUrl || "",
        metaDescription:
          (tenant as { metaDescription?: string }).metaDescription || "",
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
      setFormData({
        businessName: tenant.businessName || "",
        businessType: tenant.businessType || "",
        contactEmail: tenant.contactEmail || "",
        contactPhone: tenant.contactPhone || "",
        logoUrl: (tenant as { logoUrl?: string }).logoUrl || "",
        metaDescription:
          (tenant as { metaDescription?: string }).metaDescription || "",
      });
      setIsDirty(false);
    }
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

          <div className="settings-field">
            <Label htmlFor="logoUrl" className="settings-field-label">
              Logo URL
            </Label>
            <Input
              id="logoUrl"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
            />
            <p className="settings-field-description">
              Enter a URL to your logo image. Recommended size: 200x200px
            </p>
            {formData.logoUrl && (
              <div className="settings-logo-preview">
                <img
                  src={formData.logoUrl}
                  alt="Logo preview"
                  className="settings-logo-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="settings-logo-info">
                  <div className="settings-logo-name">Logo Preview</div>
                  <div className="settings-logo-size">
                    Make sure the image loads correctly
                  </div>
                </div>
              </div>
            )}
            {!formData.logoUrl && (
              <div className="settings-logo-preview">
                <div className="settings-logo-placeholder">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <div className="settings-logo-info">
                  <div className="settings-logo-name">No logo set</div>
                  <div className="settings-logo-size">Add a logo URL above</div>
                </div>
              </div>
            )}
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
