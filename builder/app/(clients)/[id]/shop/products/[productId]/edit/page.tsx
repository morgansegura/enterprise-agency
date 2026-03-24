"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useProduct,
  useUpdateProduct,
  useProductCategories,
  useProductVariants,
  useCreateProductVariant,
  useDeleteProductVariant,
  useAdjustInventory,
  type UpdateProductDto,
  type ProductVariant,
} from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { ProductDetailsCard } from "../../components/product-details-card";
import { ProductImagesCard } from "../../components/product-images-card";
import { ProductInventoryCard } from "../../components/product-inventory-card";
import { ProductVariantsCard } from "../../components/product-variants-card";
import { ProductSidebar } from "../../components/product-sidebar";

import "../../product-form.css";
import "./edit-product.css";

// =============================================================================
// Helpers
// =============================================================================

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

type TabId = "details" | "images" | "inventory" | "variants";

// =============================================================================
// Component
// =============================================================================

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string; productId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id: tenantId, productId } = resolvedParams;
  const router = useRouter();

  const { data: product, isLoading, error } = useProduct(tenantId, productId);
  const { data: categories } = useProductCategories(tenantId);
  const { data: variants } = useProductVariants(tenantId, productId);
  const updateProduct = useUpdateProduct(tenantId);
  const createVariant = useCreateProductVariant(tenantId, productId);
  const deleteVariant = useDeleteProductVariant(tenantId, productId);
  const adjustInventory = useAdjustInventory(tenantId);

  const [activeTab, setActiveTab] = React.useState<TabId>("details");
  const [formData, setFormData] = React.useState<UpdateProductDto>({});
  const [isDirty, setIsDirty] = React.useState(false);
  const [inventoryAdjustment, setInventoryAdjustment] = React.useState(0);
  const [adjustmentReason, setAdjustmentReason] = React.useState("");

  React.useEffect(() => {
    if (product) {
       
      setFormData({
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        sku: product.sku,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        cost: product.cost,
        images: product.images,
        categoryId: product.categoryId,
        status: product.status,
        inventory: product.inventory,
        lowStockThreshold: product.lowStockThreshold,
        trackInventory: product.trackInventory,
        allowBackorder: product.allowBackorder,
        featured: product.featured,
        tags: product.tags,
      });
    }
  }, [product]);

  React.useEffect(() => {
    if (error) {
      toast.error("Failed to load product");
    }
  }, [error]);

  const handleBack = () => router.push(`/${tenantId}/shop/products`);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleNumberChange = (name: string, value: string) => {
    const num = value === "" ? undefined : parseFloat(value);
    setFormData((prev) => ({ ...prev, [name]: num }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      toast.error("Product name is required");
      return;
    }

    try {
      await updateProduct.mutateAsync({ id: productId, data: formData });
      toast.success("Product updated successfully");
      setIsDirty(false);
    } catch {
      toast.error("Failed to update product");
    }
  };

  const handleReset = () => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        sku: product.sku,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        cost: product.cost,
        images: product.images,
        categoryId: product.categoryId,
        status: product.status,
        inventory: product.inventory,
        lowStockThreshold: product.lowStockThreshold,
        trackInventory: product.trackInventory,
        allowBackorder: product.allowBackorder,
        featured: product.featured,
        tags: product.tags,
      });
      setIsDirty(false);
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
    setIsDirty(true);
  };

  const handleAdjustInventory = async () => {
    if (inventoryAdjustment === 0) return;
    try {
      await adjustInventory.mutateAsync({
        productId,
        adjustment: inventoryAdjustment,
        reason: adjustmentReason || undefined,
      });
      toast.success("Inventory adjusted");
      setInventoryAdjustment(0);
      setAdjustmentReason("");
    } catch {
      toast.error("Failed to adjust inventory");
    }
  };

  const handleAddVariant = async () => {
    try {
      await createVariant.mutateAsync({
        name: "New Variant",
        options: {},
        price: product?.price || 0,
      });
      toast.success("Variant created");
    } catch {
      toast.error("Failed to create variant");
    }
  };

  const handleDeleteVariant = async (variant: ProductVariant) => {
    if (confirm(`Delete variant "${variant.name}"?`)) {
      try {
        await deleteVariant.mutateAsync(variant.id);
        toast.success("Variant deleted");
      } catch {
        toast.error("Failed to delete variant");
      }
    }
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "details", label: "Details" },
    { id: "images", label: "Images" },
    { id: "inventory", label: "Inventory" },
    { id: "variants", label: `Variants (${variants?.length || 0})` },
  ];

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (error) {
    return (
      <div className="edit-product-error">
        <p>Error loading product: {error.message}</p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Skeleton
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="edit-product-skeleton">
        <div className="edit-product-skeleton-header">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-10 w-80" />
        <div className="edit-product-skeleton-columns">
          <div className="edit-product-main">
            <div className="edit-product-skeleton-card">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
          <div className="edit-product-sidebar">
            <div className="edit-product-skeleton-card">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="edit-product-error">
        <p>Product not found</p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="edit-product">
      {/* Header */}
      <div className="edit-product-header">
        <div className="edit-product-header-left">
          <button
            type="button"
            className="edit-product-back"
            onClick={handleBack}
            aria-label="Back to products"
          >
            <ArrowLeft />
          </button>
          <div className="edit-product-title-section">
            <h1 className="edit-product-title">{product.name}</h1>
            <span className="edit-product-slug">/{product.slug}</span>
          </div>
        </div>
        <div className="edit-product-actions">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || updateProduct.isPending}
          >
            {updateProduct.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="edit-product-tabs">
        <div className="edit-product-tab-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`edit-product-tab ${activeTab === tab.id ? "edit-product-tab-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="edit-product-body">
        <div className="edit-product-columns">
          {/* Main */}
          <div className="edit-product-main">
            {activeTab === "details" && (
              <ProductDetailsCard
                formData={formData}
                onChange={handleChange}
                onNumberChange={handleNumberChange}
              />
            )}

            {activeTab === "images" && (
              <ProductImagesCard
                images={formData.images || []}
                onRemove={handleImageRemove}
              />
            )}

            {activeTab === "inventory" && (
              <ProductInventoryCard
                formData={formData}
                onChange={handleChange}
                onNumberChange={handleNumberChange}
                onToggleTrack={(checked) => {
                  setFormData((prev) => ({
                    ...prev,
                    trackInventory: checked,
                  }));
                  setIsDirty(true);
                }}
                currentStock={product.inventory}
                inventoryAdjustment={inventoryAdjustment}
                adjustmentReason={adjustmentReason}
                onAdjustmentChange={setInventoryAdjustment}
                onReasonChange={setAdjustmentReason}
                onAdjustInventory={handleAdjustInventory}
                isAdjustPending={adjustInventory.isPending}
              />
            )}

            {activeTab === "variants" && (
              <ProductVariantsCard
                variants={variants || []}
                onAdd={handleAddVariant}
                onDelete={handleDeleteVariant}
                formatCurrency={formatCurrency}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="edit-product-sidebar">
            <ProductSidebar
              formData={formData}
              categories={categories || []}
              onStatusChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  status: value as "draft" | "active" | "archived",
                }));
                setIsDirty(true);
              }}
              onCategoryChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  categoryId: value === "none" ? undefined : value,
                }));
                setIsDirty(true);
              }}
              onFeaturedChange={(checked) => {
                setFormData((prev) => ({ ...prev, featured: checked }));
                setIsDirty(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div
        className={`edit-product-footer ${!isDirty ? "edit-product-footer-hidden" : ""}`}
      >
        <Button variant="outline" onClick={handleReset} disabled={!isDirty}>
          Reset
        </Button>
        <Button
          onClick={handleSave}
          disabled={!isDirty || updateProduct.isPending}
        >
          {updateProduct.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
