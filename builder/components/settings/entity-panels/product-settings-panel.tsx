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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { EditRouteContext, CreateRouteContext } from "@/lib/settings";

// =============================================================================
// Types
// =============================================================================

export interface ProductSettingsData {
  name: string;
  slug: string;
  sku?: string;
  status: "draft" | "active" | "archived";
  price: number;
  compareAtPrice?: number;
  costPerItem?: number;
  trackInventory: boolean;
  quantity?: number;
  allowBackorder: boolean;
  weight?: number;
  weightUnit: "lb" | "kg" | "oz" | "g";
  metaTitle?: string;
  metaDescription?: string;
}

interface ProductSettingsPanelProps {
  context: EditRouteContext | CreateRouteContext;
  data: Partial<ProductSettingsData>;
  onChange: (field: keyof ProductSettingsData, value: unknown) => void;
  isLoading?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function ProductSettingsPanel({
  context,
  data,
  onChange,
  isLoading,
}: ProductSettingsPanelProps) {
  const formatPrice = (value: number | undefined) => {
    if (value === undefined) return "";
    return value.toFixed(2);
  };

  const parsePrice = (value: string) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  return (
    <>
      <SettingsSection
        title="General"
        description="Basic product information."
      >
        <SettingsForm>
          <SettingsField>
            <Label htmlFor="product-name">Product Name</Label>
            <Input
              id="product-name"
              value={data.name || ""}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Product name"
              disabled={isLoading}
            />
          </SettingsField>

          <SettingsField>
            <Label htmlFor="product-slug">Slug</Label>
            <Input
              id="product-slug"
              value={data.slug || ""}
              onChange={(e) => onChange("slug", e.target.value)}
              placeholder="product-url-slug"
              disabled={isLoading}
            />
          </SettingsField>

          <SettingsField>
            <Label htmlFor="product-sku">SKU</Label>
            <Input
              id="product-sku"
              value={data.sku || ""}
              onChange={(e) => onChange("sku", e.target.value)}
              placeholder="Stock keeping unit"
              disabled={isLoading}
            />
          </SettingsField>

          <SettingsField>
            <Label htmlFor="product-status">Status</Label>
            <Select
              value={data.status || "draft"}
              onValueChange={(value) => onChange("status", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="product-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </SettingsField>
        </SettingsForm>
      </SettingsSection>

      <SettingsSection
        title="Pricing"
        description="Product pricing and cost information."
      >
        <SettingsForm>
          <SettingsField>
            <Label htmlFor="product-price">Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                value={formatPrice(data.price)}
                onChange={(e) => onChange("price", parsePrice(e.target.value))}
                className="pl-7"
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
          </SettingsField>

          <SettingsField>
            <Label htmlFor="compare-price">Compare at Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="compare-price"
                type="number"
                step="0.01"
                min="0"
                value={formatPrice(data.compareAtPrice)}
                onChange={(e) => onChange("compareAtPrice", parsePrice(e.target.value))}
                className="pl-7"
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Original price for showing discounts
            </p>
          </SettingsField>

          <SettingsField>
            <Label htmlFor="cost-per-item">Cost per Item</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="cost-per-item"
                type="number"
                step="0.01"
                min="0"
                value={formatPrice(data.costPerItem)}
                onChange={(e) => onChange("costPerItem", parsePrice(e.target.value))}
                className="pl-7"
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              For profit calculations (not shown to customers)
            </p>
          </SettingsField>
        </SettingsForm>
      </SettingsSection>

      <SettingsSection
        title="Inventory"
        description="Stock tracking and availability."
      >
        <SettingsForm>
          <SettingsField>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="track-inventory" className="text-sm font-medium">
                  Track Inventory
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enable stock quantity tracking
                </p>
              </div>
              <Switch
                id="track-inventory"
                checked={data.trackInventory || false}
                onCheckedChange={(checked) => onChange("trackInventory", checked)}
                disabled={isLoading}
              />
            </div>
          </SettingsField>

          {data.trackInventory && (
            <SettingsField>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={data.quantity || 0}
                onChange={(e) => onChange("quantity", parseInt(e.target.value) || 0)}
                disabled={isLoading}
              />
            </SettingsField>
          )}

          <SettingsField>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allow-backorder" className="text-sm font-medium">
                  Allow Backorder
                </Label>
                <p className="text-xs text-muted-foreground">
                  Continue selling when out of stock
                </p>
              </div>
              <Switch
                id="allow-backorder"
                checked={data.allowBackorder || false}
                onCheckedChange={(checked) => onChange("allowBackorder", checked)}
                disabled={isLoading}
              />
            </div>
          </SettingsField>
        </SettingsForm>
      </SettingsSection>

      <SettingsSection
        title="Shipping"
        description="Weight for shipping calculations."
      >
        <SettingsForm>
          <div className="grid grid-cols-2 gap-4">
            <SettingsField>
              <Label htmlFor="product-weight">Weight</Label>
              <Input
                id="product-weight"
                type="number"
                step="0.01"
                min="0"
                value={data.weight || ""}
                onChange={(e) => onChange("weight", parseFloat(e.target.value) || undefined)}
                placeholder="0.00"
                disabled={isLoading}
              />
            </SettingsField>

            <SettingsField>
              <Label htmlFor="weight-unit">Unit</Label>
              <Select
                value={data.weightUnit || "lb"}
                onValueChange={(value) => onChange("weightUnit", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="weight-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lb">lb</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="oz">oz</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                </SelectContent>
              </Select>
            </SettingsField>
          </div>
        </SettingsForm>
      </SettingsSection>

      <SettingsSection
        title="SEO"
        description="Search engine optimization."
      >
        <SettingsForm>
          <SettingsField>
            <Label htmlFor="product-meta-title">Meta Title</Label>
            <Input
              id="product-meta-title"
              value={data.metaTitle || ""}
              onChange={(e) => onChange("metaTitle", e.target.value)}
              placeholder="SEO title"
              disabled={isLoading}
            />
          </SettingsField>

          <SettingsField>
            <Label htmlFor="product-meta-description">Meta Description</Label>
            <Textarea
              id="product-meta-description"
              value={data.metaDescription || ""}
              onChange={(e) => onChange("metaDescription", e.target.value)}
              placeholder="SEO description"
              rows={3}
              disabled={isLoading}
            />
          </SettingsField>
        </SettingsForm>
      </SettingsSection>
    </>
  );
}
