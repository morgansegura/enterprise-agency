"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { PageSeo } from "@/lib/hooks/use-pages";
import { FormItem } from "@/components/ui/form";

interface SeoEditorProps {
  seo?: PageSeo;
  onChange: (seo: PageSeo) => void;
}

/**
 * SEO Editor Component
 *
 * Comprehensive SEO settings editor supporting:
 * - Basic meta tags (title, description, keywords, canonical)
 * - Open Graph protocol (for Facebook, LinkedIn, etc.)
 * - Twitter Cards
 * - Structured Data (JSON-LD)
 *
 * Designed to be reused in both page and post editors.
 *
 * Usage:
 * ```tsx
 * <SeoEditor
 *   seo={page.seo}
 *   onChange={(seo) => handlePageChange('seo', seo)}
 * />
 * ```
 */
export function SeoEditor({ seo = {}, onChange }: SeoEditorProps) {
  const updateSeo = (updates: Partial<PageSeo>) => {
    onChange({ ...seo, ...updates });
  };

  const updateOpenGraph = (updates: Partial<PageSeo["openGraph"]>) => {
    onChange({
      ...seo,
      openGraph: { ...seo.openGraph, ...updates },
    });
  };

  const updateTwitter = (updates: Partial<PageSeo["twitter"]>) => {
    onChange({
      ...seo,
      twitter: { ...seo.twitter, ...updates },
    });
  };

  const handleKeywordsChange = (value: string) => {
    const keywords = value
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
    updateSeo({ keywords });
  };

  const handleStructuredDataChange = (value: string) => {
    try {
      const parsed = value ? JSON.parse(value) : undefined;
      updateSeo({ structuredData: parsed });
    } catch (error) {
      // Invalid JSON, don't update
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Meta Tags */}
      <div className="space-y-4">
        <FormItem>
          <Label htmlFor="seo-meta-title">Meta Title</Label>
          <Input
            id="seo-meta-title"
            value={seo.metaTitle || ""}
            onChange={(e) => updateSeo({ metaTitle: e.target.value })}
            placeholder="SEO-optimized title (50-60 characters)"
            maxLength={60}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {seo.metaTitle?.length || 0}/60 characters
          </p>
        </FormItem>

        <FormItem>
          <Label htmlFor="seo-meta-description">Meta Description</Label>
          <Textarea
            id="seo-meta-description"
            value={seo.metaDescription || ""}
            onChange={(e) => updateSeo({ metaDescription: e.target.value })}
            placeholder="Brief description for search results (150-160 characters)"
            rows={3}
            maxLength={160}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {seo.metaDescription?.length || 0}/160 characters
          </p>
        </FormItem>

        <FormItem>
          <Label htmlFor="seo-keywords">Keywords</Label>
          <Input
            id="seo-keywords"
            value={seo.keywords?.join(", ") || ""}
            onChange={(e) => handleKeywordsChange(e.target.value)}
            placeholder="keyword1, keyword2, keyword3"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Comma-separated list of relevant keywords
          </p>
        </FormItem>

        <FormItem>
          <Label htmlFor="seo-canonical">Canonical URL</Label>
          <Input
            id="seo-canonical"
            type="url"
            value={seo.canonicalUrl || ""}
            onChange={(e) => updateSeo({ canonicalUrl: e.target.value })}
            placeholder="https://example.com/page"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Specify the preferred URL for this content
          </p>
        </FormItem>
      </div>

      <Separator />

      {/* Advanced Settings - Accordion */}
      <Accordion type="multiple" className="w-full">
        {/* Open Graph */}
        <AccordionItem value="open-graph">
          <AccordionTrigger>Open Graph (Facebook, LinkedIn)</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <FormItem>
              <Label htmlFor="og-title">OG Title</Label>
              <Input
                id="og-title"
                value={seo.openGraph?.title || ""}
                onChange={(e) => updateOpenGraph({ title: e.target.value })}
                placeholder={seo.metaTitle || "Page title"}
              />
            </FormItem>

            <FormItem>
              <Label htmlFor="og-description">OG Description</Label>
              <Textarea
                id="og-description"
                value={seo.openGraph?.description || ""}
                onChange={(e) =>
                  updateOpenGraph({ description: e.target.value })
                }
                placeholder={seo.metaDescription || "Page description"}
                rows={2}
              />
            </FormItem>

            <FormItem>
              <Label htmlFor="og-image">OG Image URL</Label>
              <Input
                id="og-image"
                type="url"
                value={seo.openGraph?.image || ""}
                onChange={(e) => updateOpenGraph({ image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: 1200×630px
              </p>
            </FormItem>

            <FormItem>
              <Label htmlFor="og-type">OG Type</Label>
              <Select
                value={seo.openGraph?.type || "website"}
                onValueChange={(value) => updateOpenGraph({ type: value })}
              >
                <SelectTrigger id="og-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          </AccordionContent>
        </AccordionItem>

        {/* Twitter Cards */}
        <AccordionItem value="twitter">
          <AccordionTrigger>Twitter Cards</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <FormItem>
              <Label htmlFor="twitter-card">Card Type</Label>
              <Select
                value={seo.twitter?.card || "summary"}
                onValueChange={(value) => updateTwitter({ card: value })}
              >
                <SelectTrigger id="twitter-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="summary_large_image">
                    Summary Large Image
                  </SelectItem>
                  <SelectItem value="app">App</SelectItem>
                  <SelectItem value="player">Player</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>

            <FormItem>
              <Label htmlFor="twitter-title">Twitter Title</Label>
              <Input
                id="twitter-title"
                value={seo.twitter?.title || ""}
                onChange={(e) => updateTwitter({ title: e.target.value })}
                placeholder={
                  seo.openGraph?.title || seo.metaTitle || "Page title"
                }
              />
            </FormItem>

            <FormItem>
              <Label htmlFor="twitter-description">Twitter Description</Label>
              <Textarea
                id="twitter-description"
                value={seo.twitter?.description || ""}
                onChange={(e) => updateTwitter({ description: e.target.value })}
                placeholder={
                  seo.openGraph?.description ||
                  seo.metaDescription ||
                  "Page description"
                }
                rows={2}
              />
            </FormItem>

            <FormItem>
              <Label htmlFor="twitter-image">Twitter Image URL</Label>
              <Input
                id="twitter-image"
                type="url"
                value={seo.twitter?.image || ""}
                onChange={(e) => updateTwitter({ image: e.target.value })}
                placeholder={
                  seo.openGraph?.image || "https://example.com/image.jpg"
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: 1200×600px for large cards
              </p>
            </FormItem>
          </AccordionContent>
        </AccordionItem>

        {/* Structured Data */}
        <AccordionItem value="structured-data">
          <AccordionTrigger>Structured Data (JSON-LD)</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <FormItem>
              <Label htmlFor="structured-data">JSON-LD Schema</Label>
              <Textarea
                id="structured-data"
                value={
                  seo.structuredData
                    ? JSON.stringify(seo.structuredData, null, 2)
                    : ""
                }
                onChange={(e) => handleStructuredDataChange(e.target.value)}
                placeholder='{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Page title"\n}'
                rows={10}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Add structured data for rich search results
              </p>
            </FormItem>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
