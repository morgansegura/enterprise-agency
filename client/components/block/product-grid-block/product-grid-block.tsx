"use client";

import type { ProductGridBlockData } from "@/lib/blocks";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Package } from "lucide-react";
import "./product-grid-block.css";

// Mock product type - in production this would come from API
type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  shortDescription?: string;
};

type ProductGridBlockProps = {
  data: ProductGridBlockData;
  products?: Product[];
};

/**
 * ProductGridBlock - Renders a grid of products
 * Content block (leaf node) - fetches and displays products
 *
 * Note: In production, products would be fetched server-side
 * based on the block configuration (categoryId, featured, limit)
 */
export function ProductGridBlock({
  data,
  products = [],
}: ProductGridBlockProps) {
  const {
    columns = 4,
    gap = "md",
    showPrice = true,
    showAddToCart = true,
    variant = "default",
  } = data;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getColumnsClass = () => {
    if (typeof columns === "number") {
      return `product-grid-cols-${columns}`;
    }
    // Responsive columns
    const mobile = columns.mobile || 1;
    const tablet = columns.tablet || 2;
    const desktop = columns.desktop || 4;
    return `product-grid-cols-${mobile} md:product-grid-cols-${tablet} lg:product-grid-cols-${desktop}`;
  };

  // Show placeholder if no products
  if (products.length === 0) {
    return (
      <div
        data-slot="product-grid-block"
        data-variant={variant}
        data-gap={gap}
        className={getColumnsClass()}
      >
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} data-slot="product-grid-item" data-placeholder="true">
            <div data-slot="product-grid-image-placeholder">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <CardContent data-slot="product-grid-content">
              <div data-slot="product-grid-placeholder-text">
                <div data-slot="placeholder-title" />
                <div data-slot="placeholder-price" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div
      data-slot="product-grid-block"
      data-variant={variant}
      data-gap={gap}
      className={getColumnsClass()}
    >
      {products.map((product) => (
        <Card key={product.id} data-slot="product-grid-item">
          <Link href={`/shop/product/${product.slug}`}>
            <div data-slot="product-grid-image">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={400}
                  height={400}
                  data-object-fit="cover"
                />
              ) : (
                <div data-slot="product-grid-image-placeholder">
                  <Package className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>
          </Link>

          <CardContent data-slot="product-grid-content">
            <Link href={`/shop/product/${product.slug}`}>
              <h3 data-slot="product-grid-title">{product.name}</h3>
            </Link>

            {variant === "detailed" && product.shortDescription && (
              <p data-slot="product-grid-description">
                {product.shortDescription}
              </p>
            )}

            {showPrice && (
              <div data-slot="product-grid-price">
                <span data-slot="product-grid-current-price">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice &&
                  product.compareAtPrice > product.price && (
                    <span data-slot="product-grid-compare-price">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
              </div>
            )}
          </CardContent>

          {showAddToCart && (
            <CardFooter data-slot="product-grid-footer">
              <Button
                variant="outline"
                size="sm"
                data-slot="product-grid-add-to-cart"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
