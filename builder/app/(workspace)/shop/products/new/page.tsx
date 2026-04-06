"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useCreateProduct,
  useProductCategories,
  type CreateProductDto,
} from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useResolvedTenant } from "@/lib/hooks/use-resolved-tenant";

import { ProductDetailsCard } from "../components/product-details-card";
import { ProductImagesCard } from "../components/product-images-card";
import { ProductInventoryCard } from "../components/product-inventory-card";
import { ProductSidebar } from "../components/product-sidebar";

import "../product-form.css";
import "./new-product.css";

// =============================================================================
// Component
// =============================================================================

export default function NewProductPage() {
  const { tenantId: resolvedTenantId } = useResolvedTenant();
  const tenantId = resolvedTenantId!;
  const router = useRouter();

  const createProduct = useCreateProduct(tenantId);
  const { data: categories } = useProductCategories(tenantId);

  const [formData, setFormData] = React.useState<CreateProductDto>({
    name: "",
    description: "",
    shortDescription: "",
    sku: "",
    price: 0,
    compareAtPrice: undefined,
    cost: undefined,
    images: [],
    categoryId: undefined,
    status: "draft",
    inventory: 0,
    lowStockThreshold: 5,
    trackInventory: true,
    featured: false,
    tags: [],
  });

  const handleBack = () => router.push("/shop/products");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name: string, value: string) => {
    const num = value === "" ? undefined : parseFloat(value);
    setFormData((prev) => ({ ...prev, [name]: num }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    try {
      const product = await createProduct.mutateAsync(formData);
      toast.success("Product created successfully");
      router.push(`/shop/products/${product.id}/edit`);
    } catch {
      toast.error("Failed to create product");
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="new-product">
      {/* Header */}
      <div className="new-product-header">
        <div className="new-product-header-left">
          <button
            type="button"
            className="new-product-back"
            onClick={handleBack}
            aria-label="Back to products"
          >
            <ArrowLeft />
          </button>
          <h1 className="new-product-title">Create Product</h1>
        </div>
        <div className="new-product-actions">
          <Button variant="outline" size="sm" onClick={handleBack}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={createProduct.isPending}
          >
            {createProduct.isPending ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="new-product-body">
        <div className="new-product-columns">
          {/* Main */}
          <div className="new-product-main">
            <ProductDetailsCard
              formData={formData}
              onChange={handleChange}
              onNumberChange={handleNumberChange}
            />

            <ProductImagesCard
              images={formData.images || []}
              onRemove={handleImageRemove}
            />

            <ProductInventoryCard
              formData={formData}
              onChange={handleChange}
              onNumberChange={handleNumberChange}
              onToggleTrack={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  trackInventory: checked,
                }))
              }
            />
          </div>

          {/* Sidebar */}
          <div className="new-product-sidebar">
            <ProductSidebar
              formData={formData}
              categories={categories || []}
              onStatusChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  status: value as "draft" | "active" | "archived",
                }))
              }
              onCategoryChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  categoryId: value === "none" ? undefined : value,
                }))
              }
              onFeaturedChange={(checked) =>
                setFormData((prev) => ({ ...prev, featured: checked }))
              }
            />
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="new-product-footer">
        <Button variant="outline" onClick={handleBack}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={createProduct.isPending}>
          {createProduct.isPending ? "Creating..." : "Create Product"}
        </Button>
      </div>
    </div>
  );
}
