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

// =============================================================================
// Types
// =============================================================================

export interface WebsiteGlobalSettingsData {
  // General
  siteName: string;
  tagline: string;
  siteUrl: string;
  timezone: string;
  dateFormat: string;

  // Branding
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  accentColor?: string;

  // SEO Defaults
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;

  // Social
  facebookUrl?: string;
  twitterHandle?: string;
  instagramUrl?: string;
  linkedInUrl?: string;
  youtubeUrl?: string;

  // Technical
  robotsIndexing: boolean;
  xmlSitemapEnabled: boolean;
  maintenanceMode: boolean;
  maintenanceMessage?: string;

  // Contact
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: string;
}

interface WebsiteGlobalSettingsProps {
  data: Partial<WebsiteGlobalSettingsData>;
  onChange: (field: keyof WebsiteGlobalSettingsData, value: unknown) => void;
  isLoading?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function WebsiteGlobalSettings({
  data,
  onChange,
  isLoading,
}: WebsiteGlobalSettingsProps) {
  return (
    <>
      <SettingsSection title="General" description="Basic website information.">
        <SettingsForm>
          <SettingsField>
            <Label htmlFor="site-name">Site Name</Label>
            <Input
              id="site-name"
              value={data.siteName || ""}
              onChange={(e) => onChange("siteName", e.target.value)}
              placeholder="My Website"
              disabled={isLoading}
            />
          </SettingsField>

          <SettingsField>
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={data.tagline || ""}
              onChange={(e) => onChange("tagline", e.target.value)}
              placeholder="Your site's tagline"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Brief description of your site
            </p>
          </SettingsField>

          <SettingsField>
            <Label htmlFor="site-url">Site URL</Label>
            <Input
              id="site-url"
              type="url"
              value={data.siteUrl || ""}
              onChange={(e) => onChange("siteUrl", e.target.value)}
              placeholder="https://example.com"
              disabled={isLoading}
            />
          </SettingsField>

          <SettingsField>
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={data.timezone || "America/New_York"}
              onValueChange={(value) => onChange("timezone", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">
                  Eastern Time (ET)
                </SelectItem>
                <SelectItem value="America/Chicago">
                  Central Time (CT)
                </SelectItem>
                <SelectItem value="America/Denver">
                  Mountain Time (MT)
                </SelectItem>
                <SelectItem value="America/Los_Angeles">
                  Pacific Time (PT)
                </SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
              </SelectContent>
            </Select>
          </SettingsField>

          <SettingsField>
            <Label htmlFor="date-format">Date Format</Label>
            <Select
              value={data.dateFormat || "MMM d, yyyy"}
              onValueChange={(value) => onChange("dateFormat", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="date-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MMM d, yyyy">Jan 1, 2024</SelectItem>
                <SelectItem value="MMMM d, yyyy">January 1, 2024</SelectItem>
                <SelectItem value="MM/dd/yyyy">01/01/2024</SelectItem>
                <SelectItem value="dd/MM/yyyy">01/01/2024 (DD/MM)</SelectItem>
                <SelectItem value="yyyy-MM-dd">2024-01-01 (ISO)</SelectItem>
              </SelectContent>
            </Select>
          </SettingsField>
        </SettingsForm>
      </SettingsSection>

      <SettingsSection
        title="Branding"
        description="Visual identity and colors."
      >
        <SettingsForm>
          <SettingsField>
            <Label htmlFor="logo-url">Logo URL</Label>
            <Input
              id="logo-url"
              value={data.logoUrl || ""}
              onChange={(e) => onChange("logoUrl", e.target.value)}
              placeholder="/images/logo.svg"
              disabled={isLoading}
            />
          </SettingsField>

          <SettingsField>
            <Label htmlFor="favicon-url">Favicon URL</Label>
            <Input
              id="favicon-url"
              value={data.faviconUrl || ""}
              onChange={(e) => onChange("faviconUrl", e.target.value)}
              placeholder="/favicon.ico"
              disabled={isLoading}
            />
          </SettingsField>

          <div className="grid grid-cols-2 gap-4">
            <SettingsField>
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={data.primaryColor || "#000000"}
                  onChange={(e) => onChange("primaryColor", e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                  disabled={isLoading}
                />
                <Input
                  value={data.primaryColor || "#000000"}
                  onChange={(e) => onChange("primaryColor", e.target.value)}
                  placeholder="#000000"
                  disabled={isLoading}
                  className="flex-1"
                />
              </div>
            </SettingsField>

            <SettingsField>
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex gap-2">
                <Input
                  id="accent-color"
                  type="color"
                  value={data.accentColor || "#0066cc"}
                  onChange={(e) => onChange("accentColor", e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                  disabled={isLoading}
                />
                <Input
                  value={data.accentColor || "#0066cc"}
                  onChange={(e) => onChange("accentColor", e.target.value)}
                  placeholder="#0066cc"
                  disabled={isLoading}
                  className="flex-1"
                />
              </div>
            </SettingsField>
          </div>
        </SettingsForm>
      </SettingsSection>

      <SettingsSection
        title="SEO Defaults"
        description="Default meta tags and analytics."
      >
        <SettingsForm>
          <SettingsField>
            <Label htmlFor="default-meta-title">Default Meta Title</Label>
            <Input
              id="default-meta-title"
              value={data.defaultMetaTitle || ""}
              onChange={(e) => onChange("defaultMetaTitle", e.target.value)}
              placeholder="Site Name | Tagline"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Used when pages don't specify their own title
            </p>
          </SettingsField>

          <SettingsField>
            <Label htmlFor="default-meta-description">
              Default Meta Description
            </Label>
            <Textarea
              id="default-meta-description"
              value={data.defaultMetaDescription || ""}
              onChange={(e) =>
                onChange("defaultMetaDescription", e.target.value)
              }
              placeholder="A brief description of your website..."
              rows={3}
              disabled={isLoading}
            />
          </SettingsField>

          <SettingsField>
            <Label htmlFor="ga-id">Google Analytics ID</Label>
            <Input
              id="ga-id"
              value={data.googleAnalyticsId || ""}
              onChange={(e) => onChange("googleAnalyticsId", e.target.value)}
              placeholder="G-XXXXXXXXXX"
              disabled={isLoading}
            />
          </SettingsField>

          <SettingsField>
            <Label htmlFor="gtm-id">Google Tag Manager ID</Label>
            <Input
              id="gtm-id"
              value={data.googleTagManagerId || ""}
              onChange={(e) => onChange("googleTagManagerId", e.target.value)}
              placeholder="GTM-XXXXXXX"
              disabled={isLoading}
            />
          </SettingsField>
        </SettingsForm>
      </SettingsSection>

      <SettingsSection
        title="Social Links"
        description="Connect your social media profiles."
      >
        <SettingsForm>
          <SettingsField>
            <Label htmlFor="facebook-url">Facebook</Label>
            <Input
              id="facebook-url"
              type="url"
              value={data.facebookUrl || ""}
              onChange={(e) => onChange("facebookUrl", e.target.value)}
              placeholder="https://facebook.com/yourpage"
              disabled={isLoading}
            />
          </SettingsField>

          <SettingsField>
            <Label htmlFor="twitter-handle">Twitter/X Handle</Label>
            <Input
              id="twitter-handle"
              value={data.twitterHandle || ""}
              onChange={(e) => onChange("twitterHandle", e.target.value)}
              placeholder="@yourhandle"
              disabled={isLoading}
            />
          </SettingsField>

          <SettingsField>
            <Label htmlFor="instagram-url">Instagram</Label>
            <Input
              id="instagram-url"
              type="url"
              value={data.instagramUrl || ""}
              onChange={(e) => onChange("instagramUrl", e.target.value)}
              placeholder="https://instagram.com/yourprofile"
              disabled={isLoading}
            />
          </SettingsField>

          <SettingsField>
            <Label htmlFor="linkedin-url">LinkedIn</Label>
            <Input
              id="linkedin-url"
              type="url"
              value={data.linkedInUrl || ""}
              onChange={(e) => onChange("linkedInUrl", e.target.value)}
              placeholder="https://linkedin.com/company/yourcompany"
              disabled={isLoading}
            />
          </SettingsField>

          <SettingsField>
            <Label htmlFor="youtube-url">YouTube</Label>
            <Input
              id="youtube-url"
              type="url"
              value={data.youtubeUrl || ""}
              onChange={(e) => onChange("youtubeUrl", e.target.value)}
              placeholder="https://youtube.com/@yourchannel"
              disabled={isLoading}
            />
          </SettingsField>
        </SettingsForm>
      </SettingsSection>

      <SettingsSection
        title="Technical"
        description="Search engine and site availability settings."
      >
        <SettingsForm>
          <SettingsField>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Search Engine Indexing
                </Label>
                <p className="text-xs text-muted-foreground">
                  Allow search engines to index your site
                </p>
              </div>
              <Switch
                checked={data.robotsIndexing ?? true}
                onCheckedChange={(checked) =>
                  onChange("robotsIndexing", checked)
                }
                disabled={isLoading}
              />
            </div>
          </SettingsField>

          <SettingsField>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">XML Sitemap</Label>
                <p className="text-xs text-muted-foreground">
                  Generate an XML sitemap for search engines
                </p>
              </div>
              <Switch
                checked={data.xmlSitemapEnabled ?? true}
                onCheckedChange={(checked) =>
                  onChange("xmlSitemapEnabled", checked)
                }
                disabled={isLoading}
              />
            </div>
          </SettingsField>

          <SettingsField>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Maintenance Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Show maintenance page to visitors
                </p>
              </div>
              <Switch
                checked={data.maintenanceMode ?? false}
                onCheckedChange={(checked) =>
                  onChange("maintenanceMode", checked)
                }
                disabled={isLoading}
              />
            </div>
          </SettingsField>

          {data.maintenanceMode && (
            <SettingsField>
              <Label htmlFor="maintenance-message">Maintenance Message</Label>
              <Textarea
                id="maintenance-message"
                value={data.maintenanceMessage || ""}
                onChange={(e) => onChange("maintenanceMessage", e.target.value)}
                placeholder="We're currently undergoing maintenance. Please check back soon."
                rows={3}
                disabled={isLoading}
              />
            </SettingsField>
          )}
        </SettingsForm>
      </SettingsSection>

      <SettingsSection
        title="Contact Information"
        description="Business contact details."
      >
        <SettingsForm>
          <SettingsField>
            <Label htmlFor="business-email">Email</Label>
            <Input
              id="business-email"
              type="email"
              value={data.businessEmail || ""}
              onChange={(e) => onChange("businessEmail", e.target.value)}
              placeholder="contact@example.com"
              disabled={isLoading}
            />
          </SettingsField>

          <SettingsField>
            <Label htmlFor="business-phone">Phone</Label>
            <Input
              id="business-phone"
              type="tel"
              value={data.businessPhone || ""}
              onChange={(e) => onChange("businessPhone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              disabled={isLoading}
            />
          </SettingsField>

          <SettingsField>
            <Label htmlFor="business-address">Address</Label>
            <Textarea
              id="business-address"
              value={data.businessAddress || ""}
              onChange={(e) => onChange("businessAddress", e.target.value)}
              placeholder="123 Main St, City, State 12345"
              rows={2}
              disabled={isLoading}
            />
          </SettingsField>
        </SettingsForm>
      </SettingsSection>
    </>
  );
}
