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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LayoutHeading } from "@/components/layout/layout-heading";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FormItem } from "@/components/ui/form";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string; productId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id, productId } = resolvedParams;
  const router = useRouter();

  const { data: product, isLoading, error } = useProduct(id, productId);
  const { data: categories } = useProductCategories(id);
  const { data: variants } = useProductVariants(id, productId);
  const updateProduct = useUpdateProduct(id);
  const createVariant = useCreateProductVariant(id, productId);
  const deleteVariant = useDeleteProductVariant(id, productId);
  const adjustInventory = useAdjustInventory(id);

  const [formData, setFormData] = React.useState<UpdateProductDto>({});
  const [imageUrl, setImageUrl] = React.useState("");
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

  const handleChange = (
    field: keyof UpdateProductDto,
    value: string | number | boolean | string[] | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      handleChange("images", [...(formData.images || []), imageUrl.trim()]);
      setImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    handleChange("images", newImages);
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      toast.error("Product name is required");
      return;
    }

    try {
      await updateProduct.mutateAsync({ id: productId, data: formData });
      toast.success("Product updated successfully");
    } catch {
      toast.error("Failed to update product");
    }
  };

  const handleAdjustInventory = async () => {
    if (inventoryAdjustment === 0) return;

    try {
      await adjustInventory.mutateAsync({
        productId,
        adjustment: inventoryAdjustment,
        reason: adjustmentReason || undefined,
      });
      toast.success("Inventory adjusted successfully");
      setInventoryAdjustment(0);
      setAdjustmentReason("");
    } catch {
      toast.error("Failed to adjust inventory");
    }
  };

  const handleDeleteVariant = async (variant: ProductVariant) => {
    if (confirm(`Delete variant "${variant.name}"?`)) {
      try {
        await deleteVariant.mutateAsync(variant.id);
        toast.success("Variant deleted successfully");
      } catch {
        toast.error("Failed to delete variant");
      }
    }
  };

  const handleAddVariant = async () => {
    try {
      await createVariant.mutateAsync({
        name: "New Variant",
        options: {},
        price: product?.price || 0,
      });
      toast.success("Variant created successfully");
    } catch {
      toast.error("Failed to create variant");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (isLoading) return <div className="p-6">Loading product...</div>;
  if (error)
    return <div className="p-6">Error loading product: {error.message}</div>;
  if (!product) return <div className="p-6">Product not found</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/${id}/shop/products`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>

      <LayoutHeading
        title={product.name}
        description={`Edit product details and manage inventory`}
        actions={
          <Button onClick={handleSave} disabled={updateProduct.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateProduct.isPending ? "Saving..." : "Save Changes"}
          </Button>
        }
      />

      <Tabs defaultValue="details" className="mt-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="variants">
            Variants ({variants?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormItem className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </FormItem>

                  <FormItem className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description</Label>
                    <Input
                      id="shortDescription"
                      value={formData.shortDescription || ""}
                      onChange={(e) =>
                        handleChange("shortDescription", e.target.value)
                      }
                    />
                  </FormItem>

                  <FormItem className="space-y-2">
                    <Label htmlFor="description">Full Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ""}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      rows={5}
                    />
                  </FormItem>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormItem className="space-y-2">
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price ?? ""}
                        onChange={(e) =>
                          handleChange("price", parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormItem>

                    <FormItem className="space-y-2">
                      <Label htmlFor="compareAtPrice">Compare at Price</Label>
                      <Input
                        id="compareAtPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.compareAtPrice ?? ""}
                        onChange={(e) =>
                          handleChange(
                            "compareAtPrice",
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          )
                        }
                      />
                    </FormItem>

                    <FormItem className="space-y-2">
                      <Label htmlFor="cost">Cost per Item</Label>
                      <Input
                        id="cost"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.cost ?? ""}
                        onChange={(e) =>
                          handleChange(
                            "cost",
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          )
                        }
                      />
                    </FormItem>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleChange(
                        "status",
                        value as "draft" | "active" | "archived",
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>

                  <Label className="flex items-center gap-2">
                    <Input
                      type="checkbox"
                      checked={formData.featured ?? false}
                      onChange={(e) =>
                        handleChange("featured", e.target.checked)
                      }
                      className="rounded border-gray-300"
                    />
                    Featured product
                  </Label>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormItem className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.categoryId || "none"}
                      onValueChange={(value) =>
                        handleChange(
                          "categoryId",
                          value === "none" ? undefined : value,
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No category</SelectItem>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>

                  <FormItem className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku || ""}
                      onChange={(e) => handleChange("sku", e.target.value)}
                    />
                  </FormItem>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="images" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormItem className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddImage}
                >
                  Add
                </Button>
              </FormItem>

              {formData.images && formData.images.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Product ${index + 1}`}
                        className="w-full aspect-square object-cover rounded"
                      />
                      <Button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No images added yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormItem className="flex items-center gap-4">
                  <Label className="flex items-center gap-2">
                    <Input
                      type="checkbox"
                      checked={formData.trackInventory ?? false}
                      onChange={(e) =>
                        handleChange("trackInventory", e.target.checked)
                      }
                      className="rounded border-gray-300"
                    />
                    Track inventory
                  </Label>

                  <Label className="flex items-center gap-2">
                    <Input
                      type="checkbox"
                      checked={formData.allowBackorder ?? false}
                      onChange={(e) =>
                        handleChange("allowBackorder", e.target.checked)
                      }
                      className="rounded border-gray-300"
                    />
                    Allow backorders
                  </Label>
                </FormItem>

                <div className="space-y-2">
                  <Label>Current Stock</Label>
                  <div className="text-2xl font-bold">
                    {product.trackInventory ? product.inventory : "Not tracked"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    min="0"
                    value={formData.lowStockThreshold ?? ""}
                    onChange={(e) =>
                      handleChange(
                        "lowStockThreshold",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {formData.trackInventory && (
              <Card>
                <CardHeader>
                  <CardTitle>Adjust Inventory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormItem className="space-y-2">
                    <Label htmlFor="adjustment">Adjustment</Label>
                    <Input
                      id="adjustment"
                      type="number"
                      value={inventoryAdjustment}
                      onChange={(e) =>
                        setInventoryAdjustment(parseInt(e.target.value) || 0)
                      }
                      placeholder="e.g., 10 or -5"
                    />
                    <p className="text-sm text-muted-foreground">
                      Positive to add, negative to remove
                    </p>
                  </FormItem>

                  <FormItem className="space-y-2">
                    <Label htmlFor="reason">Reason (optional)</Label>
                    <Input
                      id="reason"
                      value={adjustmentReason}
                      onChange={(e) => setAdjustmentReason(e.target.value)}
                      placeholder="e.g., Stock count correction"
                    />
                  </FormItem>

                  <Button
                    onClick={handleAdjustInventory}
                    disabled={
                      inventoryAdjustment === 0 || adjustInventory.isPending
                    }
                  >
                    {adjustInventory.isPending
                      ? "Adjusting..."
                      : "Apply Adjustment"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="variants" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Product Variants</CardTitle>
              <Button size="sm" variant="outline" onClick={handleAddVariant}>
                <Plus className="mr-2 h-4 w-4" />
                Add Variant
              </Button>
            </CardHeader>
            <CardContent>
              {!variants || variants.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No variants. Add variants for different sizes, colors, etc.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Inventory</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {variants.map((variant) => (
                      <TableRow key={variant.id}>
                        <TableCell className="font-medium">
                          {variant.name}
                          {variant.isDefault && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{variant.sku || "—"}</TableCell>
                        <TableCell className="text-right">
                          {formatPrice(variant.price)}
                        </TableCell>
                        <TableCell className="text-right">
                          {variant.inventory}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteVariant(variant)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
