"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useProducts,
  useDeleteProduct,
  useDuplicateProduct,
} from "@/lib/hooks";
import { ContentList, type MenuAction } from "@/components/layout/content-list";
import { Package, Archive } from "lucide-react";

// Product type for ContentList
interface ProductItem {
  id: string;
  title: string;
  name: string;
  slug?: string;
  sku?: string;
  status?: string;
  updatedAt?: string;
  price: number;
  images?: string[];
}

export default function ProductsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const { data: productsData, isLoading, error } = useProducts(id);
  const deleteProduct = useDeleteProduct(id);
  const duplicateProduct = useDuplicateProduct(id);

  // Transform products to include title field
  const products = React.useMemo(() => {
    const items = productsData?.products ?? [];
    return items.map((p) => ({ ...p, title: p.name }));
  }, [productsData]);

  const handleCreate = () => {
    router.push(`/${id}/shop/products/new`);
  };

  const handleEdit = (product: ProductItem) => {
    router.push(`/${id}/shop/products/${product.id}/edit`);
  };

  const handleDelete = (product: ProductItem) => {
    if (confirm(`Delete "${product.name}"? This action cannot be undone.`)) {
      deleteProduct.mutate(product.id);
    }
  };

  const handleDuplicate = (product: ProductItem) => {
    duplicateProduct.mutate(product.id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Custom menu actions for products
  const menuActions: MenuAction<ProductItem>[] = [
    {
      label: "Archive",
      icon: Archive,
      onClick: (product) => {
        if (confirm(`Archive "${product.name}"?`)) {
          // archiveProduct.mutate(product.id);
        }
      },
    },
  ];

  return (
    <ContentList<ProductItem>
      title="Products"
      singularName="Product"
      pluralName="products"
      icon={Package}
      items={products}
      isLoading={isLoading}
      error={error}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onDuplicate={handleDuplicate}
      menuActions={menuActions}
      filterOptions={[
        { value: "active", label: "Active" },
        { value: "draft", label: "Draft" },
        { value: "archived", label: "Archived" },
      ]}
      renderThumbnail={(product) =>
        product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Package className="content-card-thumbnail-icon" />
        )
      }
      renderListMeta={(product) => (
        <span className="text-sm font-medium text-(--foreground)">
          {formatPrice(product.price)}
        </span>
      )}
    />
  );
}
