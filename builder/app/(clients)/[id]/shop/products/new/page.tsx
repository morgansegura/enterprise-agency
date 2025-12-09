"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useCreateProduct,
  useProductCategories,
  type CreateProductDto,
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
import { LayoutHeading } from "@/components/layout/layout-heading";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { FormItem } from "@/components/ui/form";

export default function NewProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const createProduct = useCreateProduct(id);
  const { data: categories } = useProductCategories(id);

  const [formData, setFormData] = React.useState<CreateProductDto>({
    name: "",
    price: 0,
    description: "",
    shortDescription: "",
    sku: "",
    status: "draft",
    inventory: 0,
    lowStockThreshold: 5,
    trackInventory: true,
    allowBackorder: false,
    featured: false,
    images: [],
    tags: [],
  });

  const [imageUrl, setImageUrl] = React.useState("");

  const handleChange = (
    field: keyof CreateProductDto,
    value: string | number | boolean | string[],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (formData.price < 0) {
      toast.error("Price cannot be negative");
      return;
    }

    try {
      const result = await createProduct.mutateAsync(formData);
      toast.success("Product created successfully");
      router.push(`/${id}/shop/products/${result.id}/edit`);
    } catch {
      toast.error("Failed to create product");
    }
  };

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
        title="New Product"
        description="Create a new product for your store"
      />

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content */}
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
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter product name"
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
                    placeholder="Brief product summary"
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
                    placeholder="Detailed product description"
                    rows={5}
                  />
                </FormItem>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
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

                {formData.images && formData.images.length > 0 && (
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
                )}
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
                      value={formData.price}
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
                      value={formData.compareAtPrice || ""}
                      onChange={(e) =>
                        handleChange(
                          "compareAtPrice",
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        )
                      }
                      placeholder="Original price"
                    />
                  </FormItem>

                  <FormItem className="space-y-2">
                    <Label htmlFor="cost">Cost per Item</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.cost || ""}
                      onChange={(e) =>
                        handleChange(
                          "cost",
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        )
                      }
                      placeholder="Your cost"
                    />
                  </FormItem>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormItem className="flex items-center gap-4">
                  <Label className="flex items-center gap-2">
                    <Input
                      type="checkbox"
                      checked={formData.trackInventory}
                      onChange={(e) =>
                        handleChange("trackInventory", e.target.checked)
                      }
                      className="rounded border-gray-300"
                    />
                    Track inventory
                  </Label>

                  <Label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.allowBackorder}
                      onChange={(e) =>
                        handleChange("allowBackorder", e.target.checked)
                      }
                      className="rounded border-gray-300"
                    />
                    Allow backorders
                  </Label>
                </FormItem>

                {formData.trackInventory && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormItem className="space-y-2">
                      <Label htmlFor="inventory">Quantity</Label>
                      <Input
                        id="inventory"
                        type="number"
                        min="0"
                        value={formData.inventory}
                        onChange={(e) =>
                          handleChange(
                            "inventory",
                            parseInt(e.target.value) || 0,
                          )
                        }
                      />
                    </FormItem>

                    <FormItem className="space-y-2">
                      <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
                      <Input
                        id="lowStockThreshold"
                        type="number"
                        min="0"
                        value={formData.lowStockThreshold}
                        onChange={(e) =>
                          handleChange(
                            "lowStockThreshold",
                            parseInt(e.target.value) || 0,
                          )
                        }
                      />
                    </FormItem>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
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
                    checked={formData.featured}
                    onChange={(e) => handleChange("featured", e.target.checked)}
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
                    value={formData.categoryId || ""}
                    onValueChange={(value) =>
                      handleChange("categoryId", value || undefined)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
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
                    placeholder="Stock Keeping Unit"
                  />
                </FormItem>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createProduct.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {createProduct.isPending ? "Creating..." : "Create Product"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
