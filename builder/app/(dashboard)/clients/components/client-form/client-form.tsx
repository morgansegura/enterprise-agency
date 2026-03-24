"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Mail, Phone, Link2 } from "lucide-react";

import "./client-form.css";

// =============================================================================
// Schema
// =============================================================================

const clientFormSchema = z.object({
  businessName: z
    .string()
    .min(1, "Business name is required")
    .max(100, "Name is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(60, "Slug is too long")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase alphanumeric with hyphens only",
    ),
  businessType: z.string().optional(),
  contactEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  contactPhone: z.string().optional(),
  tier: z.enum(["CONTENT_EDITOR", "BUILDER"]),
  status: z.enum(["active", "inactive", "suspended"]),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

// =============================================================================
// Helpers
// =============================================================================

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// =============================================================================
// Props
// =============================================================================

export interface ClientFormProps {
  mode: "create" | "edit";
  defaultValues?: ClientFormValues;
  enabledFeatures?: string[];
  meta?: { createdAt: string; updatedAt: string; id: string };
  onSubmit: (data: ClientFormValues) => void;
  onCancel: () => void;
  isPending: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function ClientForm({
  mode,
  defaultValues,
  enabledFeatures,
  meta,
  onSubmit,
  onCancel,
  isPending,
}: ClientFormProps) {
  const [isDirty, setIsDirty] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: defaultValues ?? {
      businessName: "",
      slug: "",
      businessType: "",
      contactEmail: "",
      contactPhone: "",
      tier: "CONTENT_EDITOR",
      status: "active",
    },
  });

  const tier = watch("tier");
  const status = watch("status");

  // Sync form when defaultValues change (edit mode: tenant loaded)
  React.useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
      setIsDirty(false);
    }
  }, [defaultValues, reset]);

  // Track dirty state (edit mode)
  React.useEffect(() => {
    if (mode !== "edit") return;
    const subscription = watch(() => {
      setIsDirty(true);
    });
    return () => subscription.unsubscribe();
  }, [watch, mode]);

  // Auto-generate slug from business name (create mode)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    register("businessName").onChange(e);
    if (mode === "create") {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", slug, { shouldValidate: true });
    }
  };

  const handleFormSubmit = (data: ClientFormValues) => {
    onSubmit(data);
    if (mode === "edit") setIsDirty(false);
  };

  const handleReset = () => {
    if (defaultValues) {
      reset(defaultValues);
      setIsDirty(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Status options differ by mode
  // ---------------------------------------------------------------------------

  const statusOptions =
    mode === "edit"
      ? [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "suspended", label: "Suspended" },
        ]
      : [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="client-form-columns">
        {/* Main Column */}
        <div className="client-form-main">
          {/* Business Information */}
          <div className="client-form-card">
            <div className="client-form-card-header">
              <h2 className="client-form-card-title">Business Information</h2>
              <p className="client-form-card-description">
                Core details about the client workspace
              </p>
            </div>
            <div className="client-form-card-body">
              <div className="client-form-field-row">
                <div className="client-form-field">
                  <label
                    htmlFor="businessName"
                    className="client-form-field-label"
                  >
                    <Building2 />
                    Business Name
                  </label>
                  <Input
                    id="businessName"
                    {...register("businessName")}
                    onChange={handleNameChange}
                    placeholder="Acme Corporation"
                    className="client-form-field-input"
                  />
                  {errors.businessName && (
                    <p className="client-form-field-error">
                      {errors.businessName.message}
                    </p>
                  )}
                </div>
                <div className="client-form-field">
                  <label htmlFor="slug" className="client-form-field-label">
                    <Link2 />
                    URL Slug
                  </label>
                  <Input
                    id="slug"
                    {...register("slug")}
                    placeholder="acme-corporation"
                    className="client-form-field-input"
                  />
                  {errors.slug && (
                    <p className="client-form-field-error">
                      {errors.slug.message}
                    </p>
                  )}
                  {mode === "create" && (
                    <p className="client-form-field-hint">
                      Used in the workspace URL. Lowercase, hyphens only.
                    </p>
                  )}
                </div>
              </div>
              <div className="client-form-field">
                <label
                  htmlFor="businessType"
                  className="client-form-field-label"
                >
                  Business Type
                </label>
                <Input
                  id="businessType"
                  {...register("businessType")}
                  placeholder="e.g., Restaurant, Agency, Retail"
                  className="client-form-field-input"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="client-form-card">
            <div className="client-form-card-header">
              <h2 className="client-form-card-title">Contact Information</h2>
              <p className="client-form-card-description">
                Primary contact details for the client
              </p>
            </div>
            <div className="client-form-card-body">
              <div className="client-form-field-row">
                <div className="client-form-field">
                  <label
                    htmlFor="contactEmail"
                    className="client-form-field-label"
                  >
                    <Mail />
                    Contact Email
                  </label>
                  <Input
                    id="contactEmail"
                    type="email"
                    {...register("contactEmail")}
                    placeholder="contact@example.com"
                    className="client-form-field-input"
                  />
                  {errors.contactEmail && (
                    <p className="client-form-field-error">
                      {errors.contactEmail.message}
                    </p>
                  )}
                </div>
                <div className="client-form-field">
                  <label
                    htmlFor="contactPhone"
                    className="client-form-field-label"
                  >
                    <Phone />
                    Contact Phone
                  </label>
                  <Input
                    id="contactPhone"
                    {...register("contactPhone")}
                    placeholder="+1 (555) 123-4567"
                    className="client-form-field-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Features (edit mode, read-only) */}
          {mode === "edit" && enabledFeatures && enabledFeatures.length > 0 && (
            <div className="client-form-card">
              <div className="client-form-card-header">
                <h2 className="client-form-card-title">Enabled Features</h2>
                <p className="client-form-card-description">
                  Features currently enabled for this client
                </p>
              </div>
              <div className="client-form-card-body">
                <div className="client-form-features">
                  {enabledFeatures.map((feature) => (
                    <span key={feature} className="client-form-feature-tag">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="client-form-sidebar">
          {/* Options */}
          <div className="client-form-card">
            <div className="client-form-card-header">
              <h2 className="client-form-card-title">Options</h2>
            </div>
            <div className="client-form-card-body">
              <div className="client-form-field">
                <label className="client-form-field-label">Tier</label>
                <Select
                  value={tier}
                  onValueChange={(v) => {
                    setValue("tier", v as ClientFormValues["tier"]);
                    if (mode === "edit") setIsDirty(true);
                  }}
                >
                  <SelectTrigger className="client-form-field-input">
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONTENT_EDITOR">
                      Content Editor
                    </SelectItem>
                    <SelectItem value="BUILDER">Builder</SelectItem>
                  </SelectContent>
                </Select>
                <p className="client-form-field-hint">
                  Builder tier gives full page creation access.
                </p>
              </div>
              <div className="client-form-field">
                <label className="client-form-field-label">Status</label>
                <Select
                  value={status}
                  onValueChange={(v) => {
                    setValue("status", v as ClientFormValues["status"]);
                    if (mode === "edit") setIsDirty(true);
                  }}
                >
                  <SelectTrigger className="client-form-field-input">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Create mode: submit buttons in sidebar */}
            {mode === "create" && (
              <div className="client-form-submit-section">
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Creating..." : "Create Client"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Edit mode: meta info */}
            {mode === "edit" && meta && (
              <div className="client-form-meta">
                <div className="client-form-meta-item">
                  <span className="client-form-meta-label">Created</span>
                  <span>{formatDate(meta.createdAt)}</span>
                </div>
                <div className="client-form-meta-item">
                  <span className="client-form-meta-label">Updated</span>
                  <span>{formatDate(meta.updatedAt)}</span>
                </div>
                <div className="client-form-meta-item">
                  <span className="client-form-meta-label">ID</span>
                  <span className="font-mono">{meta.id.slice(0, 8)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit mode: sticky footer bar */}
      {mode === "edit" && (
        <div
          className={`client-form-footer ${!isDirty ? "client-form-footer-hidden" : ""}`}
        >
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={!isDirty}
          >
            Reset
          </Button>
          <Button type="submit" disabled={!isDirty || isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </form>
  );
}
