"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  Search,
  Globe,
  FileCode,
  MapPin,
  ArrowRight,
  Plus,
  Trash2,
  Eye,
  BarChart3,
  Code,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface MetaSettings {
  titleTemplate: string;
  titleSeparator: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string[];
  defaultOgImage: string;
  twitterCard: "summary" | "summary_large_image";
  twitterSite: string;
}

export interface SchemaSettings {
  organizationType: "Organization" | "LocalBusiness" | "Corporation" | "ProfessionalService";
  organizationName: string;
  organizationLogo: string;
  telephone: string;
  email: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export interface IndexingSettings {
  sitemapEnabled: boolean;
  sitemapChangeFreq: "daily" | "weekly" | "monthly";
  robotsCustom: string;
  canonicalUrl: string;
}

export interface TrackingSettings {
  googleAnalyticsId: string;
  googleTagManagerId: string;
  facebookPixelId: string;
  customHeadScripts: string;
  customBodyScripts: string;
}

export interface RedirectRule {
  id: string;
  from: string;
  to: string;
  type: 301 | 302;
  enabled: boolean;
}

export interface SEOSettingsData {
  meta: MetaSettings;
  schema: SchemaSettings;
  indexing: IndexingSettings;
  tracking: TrackingSettings;
  redirects: RedirectRule[];
}

interface SEOSettingsPanelProps {
  settings: SEOSettingsData;
  onChange: (settings: SEOSettingsData) => void;
  className?: string;
}

// ============================================================================
// Defaults
// ============================================================================

export const defaultSEOSettings: SEOSettingsData = {
  meta: {
    titleTemplate: "%s | {siteName}",
    titleSeparator: "|",
    defaultTitle: "",
    defaultDescription: "",
    defaultKeywords: [],
    defaultOgImage: "",
    twitterCard: "summary_large_image",
    twitterSite: "",
  },
  schema: {
    organizationType: "Organization",
    organizationName: "",
    organizationLogo: "",
    telephone: "",
    email: "",
    streetAddress: "",
    addressLocality: "",
    addressRegion: "",
    postalCode: "",
    addressCountry: "US",
  },
  indexing: {
    sitemapEnabled: true,
    sitemapChangeFreq: "weekly",
    robotsCustom: "",
    canonicalUrl: "",
  },
  tracking: {
    googleAnalyticsId: "",
    googleTagManagerId: "",
    facebookPixelId: "",
    customHeadScripts: "",
    customBodyScripts: "",
  },
  redirects: [],
};

// ============================================================================
// Collapsible Section
// ============================================================================

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  icon,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 bg-muted/50 hover:bg-muted transition-colors rounded-lg">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 px-1">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

// ============================================================================
// Meta Settings Tab
// ============================================================================

interface MetaSettingsTabProps {
  meta: MetaSettings;
  onChange: (meta: MetaSettings) => void;
}

function MetaSettingsTab({ meta, onChange }: MetaSettingsTabProps) {
  const updateMeta = <K extends keyof MetaSettings>(key: K, value: MetaSettings[K]) => {
    onChange({ ...meta, [key]: value });
  };

  const [keywordInput, setKeywordInput] = React.useState("");

  const addKeyword = () => {
    if (keywordInput.trim() && !meta.defaultKeywords.includes(keywordInput.trim())) {
      updateMeta("defaultKeywords", [...meta.defaultKeywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    updateMeta("defaultKeywords", meta.defaultKeywords.filter((k) => k !== keyword));
  };

  return (
    <div className="space-y-6">
      {/* Title Template */}
      <CollapsibleSection
        title="Title Settings"
        icon={<Search className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Title Template</Label>
              <Input
                value={meta.titleTemplate}
                onChange={(e) => updateMeta("titleTemplate", e.target.value)}
                placeholder="%s | Site Name"
              />
              <p className="text-xs text-muted-foreground">
                Use %s for page title, {"{siteName}"} for site name
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Separator</Label>
              <Select
                value={meta.titleSeparator}
                onValueChange={(v) => updateMeta("titleSeparator", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="|">| (Pipe)</SelectItem>
                  <SelectItem value="-">- (Dash)</SelectItem>
                  <SelectItem value="–">– (En Dash)</SelectItem>
                  <SelectItem value="—">— (Em Dash)</SelectItem>
                  <SelectItem value="•">• (Bullet)</SelectItem>
                  <SelectItem value="/">/ (Slash)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Default Title (Fallback)</Label>
            <Input
              value={meta.defaultTitle}
              onChange={(e) => updateMeta("defaultTitle", e.target.value)}
              placeholder="Your Site Name"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Description & Keywords */}
      <CollapsibleSection
        title="Description & Keywords"
        icon={<FileCode className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Default Meta Description</Label>
              <span className="text-xs text-muted-foreground">
                {meta.defaultDescription.length}/160
              </span>
            </div>
            <Textarea
              value={meta.defaultDescription}
              onChange={(e) => updateMeta("defaultDescription", e.target.value)}
              placeholder="A brief description of your website..."
              className="min-h-[80px]"
              maxLength={160}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Default Keywords</Label>
            <div className="flex gap-2">
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Add keyword..."
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
              />
              <Button size="sm" onClick={addKeyword}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {meta.defaultKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {meta.defaultKeywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="gap-1">
                    {keyword}
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Social / Open Graph */}
      <CollapsibleSection
        title="Social Sharing"
        icon={<Globe className="h-4 w-4 text-muted-foreground" />}
        defaultOpen={false}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Default OG Image URL</Label>
            <Input
              value={meta.defaultOgImage}
              onChange={(e) => updateMeta("defaultOgImage", e.target.value)}
              placeholder="https://example.com/og-image.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Recommended size: 1200x630 pixels
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Twitter Card Type</Label>
              <Select
                value={meta.twitterCard}
                onValueChange={(v) => updateMeta("twitterCard", v as MetaSettings["twitterCard"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Twitter @username</Label>
              <Input
                value={meta.twitterSite}
                onChange={(e) => updateMeta("twitterSite", e.target.value)}
                placeholder="@yourusername"
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}

// ============================================================================
// Schema Settings Tab
// ============================================================================

interface SchemaSettingsTabProps {
  schema: SchemaSettings;
  onChange: (schema: SchemaSettings) => void;
}

function SchemaSettingsTab({ schema, onChange }: SchemaSettingsTabProps) {
  const updateSchema = <K extends keyof SchemaSettings>(key: K, value: SchemaSettings[K]) => {
    onChange({ ...schema, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Organization */}
      <CollapsibleSection
        title="Organization Info"
        icon={<Globe className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Organization Type</Label>
              <Select
                value={schema.organizationType}
                onValueChange={(v) => updateSchema("organizationType", v as SchemaSettings["organizationType"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Organization">Organization</SelectItem>
                  <SelectItem value="LocalBusiness">Local Business</SelectItem>
                  <SelectItem value="Corporation">Corporation</SelectItem>
                  <SelectItem value="ProfessionalService">Professional Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Organization Name</Label>
              <Input
                value={schema.organizationName}
                onChange={(e) => updateSchema("organizationName", e.target.value)}
                placeholder="Your Company Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Logo URL</Label>
            <Input
              value={schema.organizationLogo}
              onChange={(e) => updateSchema("organizationLogo", e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Phone</Label>
              <Input
                value={schema.telephone}
                onChange={(e) => updateSchema("telephone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input
                value={schema.email}
                onChange={(e) => updateSchema("email", e.target.value)}
                placeholder="contact@example.com"
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Address */}
      <CollapsibleSection
        title="Address (Local SEO)"
        icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
        defaultOpen={false}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Street Address</Label>
            <Input
              value={schema.streetAddress}
              onChange={(e) => updateSchema("streetAddress", e.target.value)}
              placeholder="123 Main St, Suite 100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">City</Label>
              <Input
                value={schema.addressLocality}
                onChange={(e) => updateSchema("addressLocality", e.target.value)}
                placeholder="San Francisco"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">State/Region</Label>
              <Input
                value={schema.addressRegion}
                onChange={(e) => updateSchema("addressRegion", e.target.value)}
                placeholder="CA"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Postal Code</Label>
              <Input
                value={schema.postalCode}
                onChange={(e) => updateSchema("postalCode", e.target.value)}
                placeholder="94102"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Country</Label>
              <Input
                value={schema.addressCountry}
                onChange={(e) => updateSchema("addressCountry", e.target.value)}
                placeholder="US"
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}

// ============================================================================
// Analytics Settings Tab
// ============================================================================

interface AnalyticsSettingsTabProps {
  tracking: TrackingSettings;
  onChange: (tracking: TrackingSettings) => void;
}

function AnalyticsSettingsTab({ tracking, onChange }: AnalyticsSettingsTabProps) {
  const updateTracking = <K extends keyof TrackingSettings>(key: K, value: TrackingSettings[K]) => {
    onChange({ ...tracking, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Google */}
      <CollapsibleSection
        title="Google Analytics & Tag Manager"
        icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Google Analytics ID</Label>
              <Input
                value={tracking.googleAnalyticsId}
                onChange={(e) => updateTracking("googleAnalyticsId", e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Google Tag Manager ID</Label>
              <Input
                value={tracking.googleTagManagerId}
                onChange={(e) => updateTracking("googleTagManagerId", e.target.value)}
                placeholder="GTM-XXXXXXX"
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Facebook */}
      <CollapsibleSection
        title="Facebook Pixel"
        icon={<Eye className="h-4 w-4 text-muted-foreground" />}
        defaultOpen={false}
      >
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Facebook Pixel ID</Label>
          <Input
            value={tracking.facebookPixelId}
            onChange={(e) => updateTracking("facebookPixelId", e.target.value)}
            placeholder="1234567890123456"
          />
        </div>
      </CollapsibleSection>

      {/* Custom Scripts */}
      <CollapsibleSection
        title="Custom Scripts"
        icon={<Code className="h-4 w-4 text-muted-foreground" />}
        defaultOpen={false}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Head Scripts (before &lt;/head&gt;)
            </Label>
            <Textarea
              value={tracking.customHeadScripts}
              onChange={(e) => updateTracking("customHeadScripts", e.target.value)}
              placeholder="<!-- Custom scripts for head -->"
              className="min-h-[100px] font-mono text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Body Scripts (before &lt;/body&gt;)
            </Label>
            <Textarea
              value={tracking.customBodyScripts}
              onChange={(e) => updateTracking("customBodyScripts", e.target.value)}
              placeholder="<!-- Custom scripts for body -->"
              className="min-h-[100px] font-mono text-xs"
            />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}

// ============================================================================
// Redirects Tab
// ============================================================================

interface RedirectsTabProps {
  redirects: RedirectRule[];
  onChange: (redirects: RedirectRule[]) => void;
}

function RedirectsTab({ redirects, onChange }: RedirectsTabProps) {
  const addRedirect = () => {
    onChange([
      ...redirects,
      {
        id: crypto.randomUUID(),
        from: "",
        to: "",
        type: 301,
        enabled: true,
      },
    ]);
  };

  const updateRedirect = (id: string, updates: Partial<RedirectRule>) => {
    onChange(redirects.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const removeRedirect = (id: string) => {
    onChange(redirects.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Manage URL redirects for your site
        </p>
        <Button size="sm" onClick={addRedirect}>
          <Plus className="h-4 w-4 mr-1" />
          Add Redirect
        </Button>
      </div>

      {redirects.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
          No redirects configured
        </div>
      ) : (
        <div className="space-y-3">
          {redirects.map((redirect) => (
            <div
              key={redirect.id}
              className={cn(
                "p-3 rounded-lg border bg-card",
                !redirect.enabled && "opacity-50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
                  <Input
                    value={redirect.from}
                    onChange={(e) => updateRedirect(redirect.id, { from: e.target.value })}
                    placeholder="/old-page"
                    className="h-9"
                  />
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Input
                    value={redirect.to}
                    onChange={(e) => updateRedirect(redirect.id, { to: e.target.value })}
                    placeholder="/new-page"
                    className="h-9"
                  />
                </div>
                <Select
                  value={String(redirect.type)}
                  onValueChange={(v) => updateRedirect(redirect.id, { type: Number(v) as 301 | 302 })}
                >
                  <SelectTrigger className="w-20 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="301">301</SelectItem>
                    <SelectItem value="302">302</SelectItem>
                  </SelectContent>
                </Select>
                <Switch
                  checked={redirect.enabled}
                  onCheckedChange={(v) => updateRedirect(redirect.id, { enabled: v })}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive"
                  onClick={() => removeRedirect(redirect.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function SEOSettingsPanel({
  settings,
  onChange,
  className,
}: SEOSettingsPanelProps) {
  const updateMeta = (meta: MetaSettings) => {
    onChange({ ...settings, meta });
  };

  const updateSchema = (schema: SchemaSettings) => {
    onChange({ ...settings, schema });
  };

  const updateTracking = (tracking: TrackingSettings) => {
    onChange({ ...settings, tracking });
  };

  const updateRedirects = (redirects: RedirectRule[]) => {
    onChange({ ...settings, redirects });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="text-lg font-semibold mb-1">SEO & Analytics</h3>
        <p className="text-sm text-muted-foreground">
          Configure search engine optimization, structured data, and tracking.
        </p>
      </div>

      <Tabs defaultValue="meta" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="meta" className="text-xs">Meta & Social</TabsTrigger>
          <TabsTrigger value="schema" className="text-xs">Schema</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
          <TabsTrigger value="redirects" className="text-xs">Redirects</TabsTrigger>
        </TabsList>

        <TabsContent value="meta" className="mt-6">
          <MetaSettingsTab meta={settings.meta} onChange={updateMeta} />
        </TabsContent>

        <TabsContent value="schema" className="mt-6">
          <SchemaSettingsTab schema={settings.schema} onChange={updateSchema} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AnalyticsSettingsTab tracking={settings.tracking} onChange={updateTracking} />
        </TabsContent>

        <TabsContent value="redirects" className="mt-6">
          <RedirectsTab redirects={settings.redirects} onChange={updateRedirects} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
