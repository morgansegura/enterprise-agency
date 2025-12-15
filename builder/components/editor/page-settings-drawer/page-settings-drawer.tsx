"use client";

import * as React from "react";
import {
  SettingsDrawer,
  SettingsDrawerSidebar,
  SettingsDrawerNav,
  SettingsDrawerContent,
  SettingsSection,
  SettingsForm,
  SettingsField,
  type SettingsNavItem,
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
import { SeoEditor } from "../seo-editor";
import {
  Settings,
  Search,
  Layout,
  Palette,
  FileText,
  Home,
  History,
} from "lucide-react";
import { VersionHistory } from "../version-history";
import { useHeaders } from "@/lib/hooks/use-headers";
import type { PageSeo } from "@/lib/hooks/use-pages";

type SettingsTab = "general" | "seo" | "layout" | "style" | "history";

const navItems: SettingsNavItem<SettingsTab>[] = [
  {
    id: "general",
    label: "General",
    icon: Settings,
    description: "Page details",
  },
  {
    id: "seo",
    label: "SEO",
    icon: Search,
    description: "Search optimization",
  },
  {
    id: "layout",
    label: "Layout",
    icon: Layout,
    description: "Page structure",
  },
  {
    id: "style",
    label: "Style",
    icon: Palette,
    description: "Page styling",
  },
  {
    id: "history",
    label: "History",
    icon: History,
    description: "Version history",
  },
];

interface PageSettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string;
  pageId: string;
  page: {
    title: string;
    slug: string;
    status?: string;
    template?: string;
    seo?: PageSeo;
    isHomePage?: boolean;
    pageType?: string;
    headerId?: string | null;
    footerId?: string | null;
  };
  onChange?: (field: string, value: unknown) => void;
  onSave?: () => void;
}

export function PageSettingsDrawer({
  open,
  onOpenChange,
  tenantId,
  pageId,
  page,
  onChange,
}: PageSettingsDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("general");

  return (
    <SettingsDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Page Settings"
    >
      <SettingsDrawerSidebar
        title="Page Settings"
        description="Configure this page"
        titleIcon={<FileText className="size-4" />}
      >
        <SettingsDrawerNav<SettingsTab>
          items={navItems}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />
      </SettingsDrawerSidebar>

      <SettingsDrawerContent>
        {activeTab === "general" && (
          <GeneralSettings page={page} onChange={onChange} />
        )}
        {activeTab === "seo" && <SeoSettings page={page} onChange={onChange} />}
        {activeTab === "layout" && (
          <LayoutSettings tenantId={tenantId} page={page} onChange={onChange} />
        )}
        {activeTab === "style" && <StyleSettings />}
        {activeTab === "history" && (
          <HistorySettings tenantId={tenantId} pageId={pageId} />
        )}
      </SettingsDrawerContent>
    </SettingsDrawer>
  );
}

interface SettingsPanelProps {
  page: {
    title: string;
    slug: string;
    status?: string;
    template?: string;
    seo?: PageSeo;
    isHomePage?: boolean;
    pageType?: string;
    headerId?: string | null;
    footerId?: string | null;
  };
  onChange?: (field: string, value: unknown) => void;
}

interface LayoutSettingsPanelProps extends SettingsPanelProps {
  tenantId: string;
}

function GeneralSettings({ page, onChange }: SettingsPanelProps) {
  return (
    <SettingsSection
      title="Page Details"
      description="Basic information about this page."
    >
      <SettingsForm>
        <SettingsField>
          <Label htmlFor="page-title">Title</Label>
          <Input
            id="page-title"
            value={page.title}
            onChange={(e) => onChange?.("title", e.target.value)}
          />
        </SettingsField>

        <SettingsField>
          <Label htmlFor="page-slug">Slug</Label>
          <Input
            id="page-slug"
            value={page.slug}
            onChange={(e) => onChange?.("slug", e.target.value)}
          />
        </SettingsField>

        <SettingsField>
          <Label htmlFor="page-status">Status</Label>
          <Select
            value={page.status || "draft"}
            onValueChange={(value) => onChange?.("status", value)}
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
            value={page.template || "default"}
            onValueChange={(value) => onChange?.("template", value)}
          >
            <SelectTrigger id="page-template">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="full-width">Full Width</SelectItem>
              <SelectItem value="landing">Landing Page</SelectItem>
            </SelectContent>
          </Select>
        </SettingsField>

        <SettingsField>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="size-4 text-muted-foreground" />
              <div>
                <Label htmlFor="page-is-home" className="text-sm font-medium">
                  Set as Home Page
                </Label>
                <p className="text-xs text-muted-foreground">
                  This page will be shown when visitors access the site root
                </p>
              </div>
            </div>
            <Switch
              id="page-is-home"
              checked={page.isHomePage || false}
              onCheckedChange={(checked) => onChange?.("isHomePage", checked)}
            />
          </div>
        </SettingsField>
      </SettingsForm>
    </SettingsSection>
  );
}

function SeoSettings({ page, onChange }: SettingsPanelProps) {
  return (
    <SettingsSection
      title="SEO Settings"
      description="Optimize this page for search engines."
    >
      <SeoEditor seo={page.seo} onChange={(seo) => onChange?.("seo", seo)} />
    </SettingsSection>
  );
}

function LayoutSettings({
  tenantId,
  page,
  onChange,
}: LayoutSettingsPanelProps) {
  const { data: headers, isLoading: headersLoading } = useHeaders(tenantId);

  return (
    <SettingsSection
      title="Layout Options"
      description="Configure page layout settings like header, footer, and content width."
    >
      <SettingsForm>
        <SettingsField>
          <Label htmlFor="content-width">Content Width</Label>
          <Select defaultValue="container">
            <SelectTrigger id="content-width">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="container">Container (1200px)</SelectItem>
              <SelectItem value="wide">Wide (1400px)</SelectItem>
              <SelectItem value="full">Full Width</SelectItem>
            </SelectContent>
          </Select>
        </SettingsField>

        <SettingsField>
          <Label htmlFor="page-header">Header</Label>
          <Select
            value={page.headerId || "none"}
            onValueChange={(value) =>
              onChange?.("headerId", value === "none" ? null : value)
            }
            disabled={headersLoading}
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
            value={page.footerId || "none"}
            onValueChange={(value) =>
              onChange?.("footerId", value === "none" ? null : value)
            }
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

function StyleSettings() {
  return (
    <SettingsSection
      title="Page Styling"
      description="Override global styles for this specific page."
    >
      <SettingsForm>
        <SettingsField>
          <Label htmlFor="bg-color">Background Color</Label>
          <Input
            id="bg-color"
            type="text"
            placeholder="#ffffff or transparent"
          />
        </SettingsField>

        <SettingsField>
          <Label htmlFor="text-color">Text Color</Label>
          <Input id="text-color" type="text" placeholder="#000000" />
        </SettingsField>

        <SettingsField>
          <Label htmlFor="custom-css">Custom CSS</Label>
          <textarea
            id="custom-css"
            className="settings-textarea"
            placeholder="/* Custom CSS for this page */"
          />
        </SettingsField>
      </SettingsForm>
    </SettingsSection>
  );
}

interface HistorySettingsProps {
  tenantId: string;
  pageId: string;
}

function HistorySettings({ tenantId, pageId }: HistorySettingsProps) {
  return (
    <SettingsSection
      title="Version History"
      description="View and restore previous versions of this page."
    >
      <VersionHistory tenantId={tenantId} pageId={pageId} />
    </SettingsSection>
  );
}
