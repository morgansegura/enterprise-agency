"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useProducts,
  useDeleteProduct,
  useArchiveProduct,
  useDuplicateProduct,
  useProductCategories,
  type Product,
} from "@/lib/hooks";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
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
import { LayoutHeading } from "@/components/layout/layout-heading";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  Archive,
  Search,
  Package,
} from "lucide-react";

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
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");

  const {
    data: productsData,
    isLoading,
    error,
  } = useProducts(id, {
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    categoryId: categoryFilter !== "all" ? categoryFilter : undefined,
  });
  const { data: categories } = useProductCategories(id);
  const deleteProduct = useDeleteProduct(id);
  const archiveProduct = useArchiveProduct(id);
  const duplicateProduct = useDuplicateProduct(id);

  const products = productsData?.products ?? [];
  const total = productsData?.total ?? 0;

  const handleEdit = (productId: string) => {
    router.push(`/${id}/shop/products/${productId}/edit`);
  };

  const handleDelete = (product: Product) => {
    if (confirm(`Delete "${product.name}"? This action cannot be undone.`)) {
      deleteProduct.mutate(product.id);
    }
  };

  const handleArchive = (product: Product) => {
    if (confirm(`Archive "${product.name}"?`)) {
      archiveProduct.mutate(product.id);
    }
  };

  const handleDuplicate = (product: Product) => {
    duplicateProduct.mutate(product.id);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      archived: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status] || styles.draft}`}
      >
        {status}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (isLoading) return <div className="p-6">Loading products...</div>;
  if (error)
    return <div className="p-6">Error loading products: {error.message}</div>;

  return (
    <div className="p-6">
      <LayoutHeading
        title="Products"
        description={total > 0 ? `${total} total products` : "No products yet"}
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/${id}/shop/products/new`)}
          >
            <Package className="mr-2 h-4 w-4" />
            New Product
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex gap-4 mb-6 mt-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No products found. Create your first product to get started.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Inventory</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{product.name}</div>
                      {product.shortDescription && (
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {product.shortDescription}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {product.sku || "—"}
                </TableCell>
                <TableCell>{getStatusBadge(product.status)}</TableCell>
                <TableCell>{product.category?.name || "—"}</TableCell>
                <TableCell className="text-right">
                  {formatPrice(product.price)}
                  {product.compareAtPrice &&
                    product.compareAtPrice > product.price && (
                      <span className="text-muted-foreground line-through ml-2 text-sm">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={
                      product.inventory <= product.lowStockThreshold
                        ? "text-red-600 font-medium"
                        : ""
                    }
                  >
                    {product.trackInventory ? product.inventory : "—"}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDuplicate(product)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {product.status !== "archived" && (
                        <DropdownMenuItem
                          onClick={() => handleArchive(product)}
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleDelete(product)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
