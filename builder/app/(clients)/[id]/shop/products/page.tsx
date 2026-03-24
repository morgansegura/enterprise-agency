"use client";
/* eslint-disable @next/next/no-img-element -- dynamic CMS images with unknown dimensions */

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useProducts,
  useDeleteProduct,
  useDuplicateProduct,
  useArchiveProduct,
  type Product,
} from "@/lib/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";
import {
  MoreHorizontal,
  Eye,
  Copy,
  Archive,
  Trash2,
  Search,
  Package,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";

import "./products.css";

export default function ProductsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const {
    data: productsData,
    isLoading,
    error,
  } = useProducts(id, {
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });
  const deleteProduct = useDeleteProduct(id);
  const duplicateProduct = useDuplicateProduct(id);
  const archiveProduct = useArchiveProduct(id);

  const products = productsData?.products ?? [];
  const total = productsData?.total ?? 0;

  // Surface errors via toast
  React.useEffect(() => {
    if (error) {
      toast.error("Failed to load products");
    }
  }, [error]);

  const handleEdit = (product: Product) => {
    router.push(`/${id}/shop/products/${product.id}`);
  };

  const handleDelete = async (product: Product) => {
    if (confirm(`Delete "${product.name}"? This action cannot be undone.`)) {
      try {
        await deleteProduct.mutateAsync(product.id);
        toast.success("Product deleted");
      } catch {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleDuplicate = async (product: Product) => {
    try {
      await duplicateProduct.mutateAsync(product.id);
      toast.success("Product duplicated");
    } catch {
      toast.error("Failed to duplicate product");
    }
  };

  const handleArchive = async (product: Product) => {
    if (confirm(`Archive "${product.name}"?`)) {
      try {
        await archiveProduct.mutateAsync(product.id);
        toast.success("Product archived");
      } catch {
        toast.error("Failed to archive product");
      }
    }
  };

  const statusClass: Record<string, string> = {
    active: "products-status-active",
    draft: "products-status-draft",
    archived: "products-status-archived",
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const getStockClass = (product: Product) => {
    if (product.inventory <= 0) return "products-stock-out";
    if (product.inventory <= product.lowStockThreshold)
      return "products-stock-low";
    return "products-stock-normal";
  };

  const getStockLabel = (product: Product) => {
    if (!product.trackInventory) return "Unlimited";
    if (product.inventory <= 0) return "Out of stock";
    return String(product.inventory);
  };

  return (
    <div className="products-page">
      <PageHeader
        title="Products"
        icon={Package}
        count={total}
        singularName="product"
        pluralName="products"
        actionLabel="Add Product"
        actionIcon={PlusCircle}
        onAction={() => router.push(`/${id}/shop/products/new`)}
      />

      {/* Filters */}
      <div className="products-filters">
        <div className="products-search">
          <Search className="products-search-icon" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="products-search-input"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="products-filter-select">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="products-skeleton-row">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-8" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="products-empty">
          <Package className="products-empty-icon" />
          <h3>No products found</h3>
          <p>Create your first product to start selling.</p>
          <Button onClick={() => router.push(`/${id}/shop/products/new`)}>
            <PlusCircle className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      ) : (
        <table className="products-table">
          <thead className="products-table-header">
            <tr>
              <th>Product</th>
              <th className="products-col-price">Price</th>
              <th>Status</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="products-table-body">
            {products.map((product) => (
              <tr
                key={product.id}
                className="products-table-row"
                onClick={() => handleEdit(product)}
              >
                <td>
                  <div className="products-cell-product">
                    <div className="products-thumbnail">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                        />
                      ) : (
                        <Package className="products-thumbnail-placeholder" />
                      )}
                    </div>
                    <div>
                      <div className="products-product-name">
                        {product.name}
                      </div>
                      {product.sku && (
                        <div className="products-product-sku">
                          SKU: {product.sku}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="products-col-price">
                  {formatCurrency(product.price)}
                </td>
                <td>
                  <span
                    className={`products-status-pill ${statusClass[product.status] || "products-status-draft"}`}
                  >
                    {product.status}
                  </span>
                </td>
                <td>
                  <span className={getStockClass(product)}>
                    {getStockLabel(product)}
                  </span>
                </td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="products-actions-trigger"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(product);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View / Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(product);
                        }}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      {product.status !== "archived" && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchive(product);
                          }}
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(product);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
