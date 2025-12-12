"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SeoEditor } from "../seo-editor";
import type { PageSeo } from "@/lib/hooks/use-pages";
import { FormItem } from "@/components/ui/form";

import "./page-settings.css";

interface PageSettingsProps {
  page: {
    title: string;
    slug: string;
    status?: string;
    template?: string;
    seo?: PageSeo;
  };
  onChange?: (field: string, value: unknown) => void;
}

export function PageSettings({ page, onChange }: PageSettingsProps) {
  return (
    <div className="page-settings">
      <div className="page-settings-section">
        <h4 className="page-settings-section-title">General</h4>

        <FormItem className="page-settings-field">
          <Label htmlFor="page-title">Title</Label>
          <Input
            id="page-title"
            value={page.title}
            onChange={(e) => onChange?.("title", e.target.value)}
          />
        </FormItem>

        <FormItem className="page-settings-field">
          <Label htmlFor="page-slug">Slug</Label>
          <Input
            id="page-slug"
            value={page.slug}
            onChange={(e) => onChange?.("slug", e.target.value)}
          />
        </FormItem>

        <FormItem className="page-settings-field">
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
        </FormItem>

        <FormItem className="page-settings-field">
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
        </FormItem>
      </div>

      <Separator />

      <div className="page-settings-section">
        <SeoEditor seo={page.seo} onChange={(seo) => onChange?.("seo", seo)} />
      </div>
    </div>
  );
}
