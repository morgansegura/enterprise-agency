"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormItem } from "@/components/ui/form";
import { SeoEditor } from "../seo-editor";
import { Settings, Search, Layout, Palette } from "lucide-react";
import type { PageSeo } from "@/lib/hooks/use-pages";

import "./page-settings-modal.css";

interface PageSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: {
    title: string;
    slug: string;
    status?: string;
    template?: string;
    seo?: PageSeo;
  };
  onChange?: (field: string, value: unknown) => void;
  onSave?: () => void;
}

export function PageSettingsModal({
  open,
  onOpenChange,
  page,
  onChange,
  onSave,
}: PageSettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="page-settings-modal">
        <DialogHeader>
          <DialogTitle>Page Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="page-settings-modal-tabs">
          <TabsList className="page-settings-modal-tabs-list">
            <TabsTrigger value="general">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="seo">
              <Search className="h-4 w-4" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="layout">
              <Layout className="h-4 w-4" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="style">
              <Palette className="h-4 w-4" />
              Style
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="page-settings-modal-content">
            <div className="page-settings-modal-section">
              <h4 className="page-settings-modal-section-title">
                Page Details
              </h4>

              <FormItem className="page-settings-modal-field">
                <Label htmlFor="modal-page-title">Title</Label>
                <Input
                  id="modal-page-title"
                  value={page.title}
                  onChange={(e) => onChange?.("title", e.target.value)}
                />
              </FormItem>

              <FormItem className="page-settings-modal-field">
                <Label htmlFor="modal-page-slug">Slug</Label>
                <Input
                  id="modal-page-slug"
                  value={page.slug}
                  onChange={(e) => onChange?.("slug", e.target.value)}
                />
              </FormItem>

              <FormItem className="page-settings-modal-field">
                <Label htmlFor="modal-page-status">Status</Label>
                <Select
                  value={page.status || "draft"}
                  onValueChange={(value) => onChange?.("status", value)}
                >
                  <SelectTrigger id="modal-page-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>

              <FormItem className="page-settings-modal-field">
                <Label htmlFor="modal-page-template">Template</Label>
                <Select
                  value={page.template || "default"}
                  onValueChange={(value) => onChange?.("template", value)}
                >
                  <SelectTrigger id="modal-page-template">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="full-width">Full Width</SelectItem>
                    <SelectItem value="landing">Landing Page</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="page-settings-modal-content">
            <SeoEditor
              seo={page.seo}
              onChange={(seo) => onChange?.("seo", seo)}
            />
          </TabsContent>

          <TabsContent value="layout" className="page-settings-modal-content">
            <div className="page-settings-modal-section">
              <h4 className="page-settings-modal-section-title">
                Layout Options
              </h4>
              <p className="text-sm text-muted-foreground">
                Configure page layout settings like header, footer, and content
                width.
              </p>

              <FormItem className="page-settings-modal-field">
                <Label htmlFor="modal-content-width">Content Width</Label>
                <Select defaultValue="container">
                  <SelectTrigger id="modal-content-width">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="container">
                      Container (1200px)
                    </SelectItem>
                    <SelectItem value="wide">Wide (1400px)</SelectItem>
                    <SelectItem value="full">Full Width</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>

              <FormItem className="page-settings-modal-field">
                <Label htmlFor="modal-header-style">Header</Label>
                <Select defaultValue="default">
                  <SelectTrigger id="modal-header-style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="transparent">Transparent</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>

              <FormItem className="page-settings-modal-field">
                <Label htmlFor="modal-footer-style">Footer</Label>
                <Select defaultValue="default">
                  <SelectTrigger id="modal-footer-style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>
          </TabsContent>

          <TabsContent value="style" className="page-settings-modal-content">
            <div className="page-settings-modal-section">
              <h4 className="page-settings-modal-section-title">
                Page Styling
              </h4>
              <p className="text-sm text-muted-foreground">
                Override global styles for this specific page.
              </p>

              <FormItem className="page-settings-modal-field">
                <Label htmlFor="modal-bg-color">Background Color</Label>
                <Input
                  id="modal-bg-color"
                  type="text"
                  placeholder="#ffffff or transparent"
                />
              </FormItem>

              <FormItem className="page-settings-modal-field">
                <Label htmlFor="modal-text-color">Text Color</Label>
                <Input
                  id="modal-text-color"
                  type="text"
                  placeholder="#000000"
                />
              </FormItem>

              <FormItem className="page-settings-modal-field">
                <Label htmlFor="modal-custom-css">Custom CSS</Label>
                <textarea
                  id="modal-custom-css"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                  placeholder="/* Custom CSS for this page */"
                />
              </FormItem>
            </div>
          </TabsContent>
        </Tabs>

        <div className="page-settings-modal-footer">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave?.();
              onOpenChange(false);
            }}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
