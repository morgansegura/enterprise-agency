"use client";

import * as React from "react";
import {
  SettingsSection,
  SettingsForm,
  SettingsField,
} from "@/components/ui/settings-drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Home } from "lucide-react";
import { useHeaders } from "@/lib/hooks/use-headers";
import type { EditRouteContext, CreateRouteContext } from "@/lib/settings";

// =============================================================================
// Types
// =============================================================================

export interface PageSettingsData {
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  template: string;
  isHomePage: boolean;
  metaTitle?: string;
  metaDescription?: string;
  headerId?: string | null;
  footerId?: string | null;
}

interface PageSettingsPanelProps {
  context: EditRouteContext | CreateRouteContext;
  data: Partial<PageSettingsData>;
  onChange: (field: keyof PageSettingsData, value: unknown) => void;
  isLoading?: boolean;
  activeTab?: string;
}

// =============================================================================
// Component
// =============================================================================

export function PageSettingsPanel({
  context,
  data,
  onChange,
  isLoading,
  activeTab = "general",
}: PageSettingsPanelProps) {
  const isEditMode = context.mode === "edit";

  return (
    <>
      {activeTab === "general" && (
        <SettingsSection
          title="General"
          description="Basic page information and configuration."
        >
          <SettingsForm>
            <SettingsField>
              <Label htmlFor="page-title">Title</Label>
              <Input
                id="page-title"
                value={data.title || ""}
                onChange={(e) => onChange("title", e.target.value)}
                placeholder="Page title"
                disabled={isLoading}
              />
            </SettingsField>

            <SettingsField>
              <Label htmlFor="page-slug">Slug</Label>
              <Input
                id="page-slug"
                value={data.slug || ""}
                onChange={(e) => onChange("slug", e.target.value)}
                placeholder="page-url-slug"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                The URL path for this page
              </p>
            </SettingsField>

            <SettingsField>
              <Label htmlFor="page-status">Status</Label>
              <Select
                value={data.status || "draft"}
                onValueChange={(value) => onChange("status", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="page-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </SettingsField>

            <SettingsField>
              <Label htmlFor="page-template">Template</Label>
              <Select
                value={data.template || "default"}
                onValueChange={(value) => onChange("template", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="page-template">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="full-width">Full Width</SelectItem>
                  <SelectItem value="landing">Landing Page</SelectItem>
                  <SelectItem value="sidebar">With Sidebar</SelectItem>
                </SelectContent>
              </Select>
            </SettingsField>

            {isEditMode && (
              <SettingsField>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Home className="size-4 text-muted-foreground" />
                    <div>
                      <Label
                        htmlFor="page-is-home"
                        className="text-sm font-medium"
                      >
                        Set as Home Page
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        This page will be shown at the site root
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="page-is-home"
                    checked={data.isHomePage || false}
                    onCheckedChange={(checked) =>
                      onChange("isHomePage", checked)
                    }
                    disabled={isLoading}
                  />
                </div>
              </SettingsField>
            )}
          </SettingsForm>
        </SettingsSection>
      )}

      {activeTab === "seo" && (
        <SettingsSection
          title="SEO"
          description="Search engine optimization settings."
        >
          <SettingsForm>
            <SettingsField>
              <Label htmlFor="meta-title">Meta Title</Label>
              <Input
                id="meta-title"
                value={data.metaTitle || ""}
                onChange={(e) => onChange("metaTitle", e.target.value)}
                placeholder="SEO title (defaults to page title)"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {data.metaTitle?.length || 0}/60 characters
              </p>
            </SettingsField>

            <SettingsField>
              <Label htmlFor="meta-description">Meta Description</Label>
              <Textarea
                id="meta-description"
                value={data.metaDescription || ""}
                onChange={(e) => onChange("metaDescription", e.target.value)}
                placeholder="Brief description for search results"
                rows={3}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {data.metaDescription?.length || 0}/160 characters
              </p>
            </SettingsField>
          </SettingsForm>
        </SettingsSection>
      )}

      {activeTab === "layout" && (
        <LayoutSettings
          tenantId={context.tenantId}
          data={data}
          onChange={onChange}
          isLoading={isLoading}
        />
      )}

      {activeTab === "style" && (
        <SettingsSection
          title="Style"
          description="Override default styling for this page."
        >
          <SettingsForm>
            <p className="text-sm text-muted-foreground">
              Style settings coming soon. This will include custom CSS and theme
              overrides.
            </p>
          </SettingsForm>
        </SettingsSection>
      )}
    </>
  );
}

// =============================================================================
// Layout Settings Sub-component
// =============================================================================

interface LayoutSettingsProps {
  tenantId: string;
  data: Partial<PageSettingsData>;
  onChange: (field: keyof PageSettingsData, value: unknown) => void;
  isLoading?: boolean;
}

function LayoutSettings({
  tenantId,
  data,
  onChange,
  isLoading,
}: LayoutSettingsProps) {
  const { data: headers, isLoading: headersLoading } = useHeaders(tenantId);

  return (
    <SettingsSection
      title="Layout"
      description="Configure page layout settings like header and footer."
    >
      <SettingsForm>
        <SettingsField>
          <Label htmlFor="page-header">Header</Label>
          <Select
            value={data.headerId || "none"}
            onValueChange={(value) =>
              onChange("headerId", value === "none" ? null : value)
            }
            disabled={isLoading || headersLoading}
          >
            <SelectTrigger id="page-header">
              <SelectValue placeholder="Select a header" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Header</SelectItem>
              <SelectItem value="default">Use Default Header</SelectItem>
              {headers?.map((header) => (
                <SelectItem key={header.id} value={header.id}>
                  {header.name} ({header.behavior.toLowerCase()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Choose a specific header or use the tenant default
          </p>
        </SettingsField>

        <SettingsField>
          <Label htmlFor="page-footer">Footer</Label>
          <Select
            value={data.footerId || "none"}
            onValueChange={(value) =>
              onChange("footerId", value === "none" ? null : value)
            }
            disabled={isLoading}
          >
            <SelectTrigger id="page-footer">
              <SelectValue placeholder="Select a footer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Footer</SelectItem>
              <SelectItem value="default">Use Default Footer</SelectItem>
              {/* Footer options will be added when Footer API is built */}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Choose a specific footer or use the tenant default
          </p>
        </SettingsField>
      </SettingsForm>
    </SettingsSection>
  );
}
