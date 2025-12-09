"use client";

import type { ProductDetailBlockData } from "@/lib/blocks";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useState } from "react";
import {
  ShoppingCart,
  Minus,
  Plus,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./product-detail-block.css";
import { FormItem } from "@/components/ui/form";

// Mock product type - in production this would come from API
type ProductVariant = {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  options: Record<string, string>;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  description?: string;
  shortDescription?: string;
  variants: ProductVariant[];
  options: { name: string; values: string[] }[];
};

type ProductDetailBlockProps = {
  data: ProductDetailBlockData;
  product?: Product;
};

/**
 * ProductDetailBlock - Renders a single product detail view
 * Content block (leaf node) - displays product info with gallery and purchase options
 */
export function ProductDetailBlock({ data, product }: ProductDetailBlockProps) {
  const {
    layout = "horizontal",
    showGallery = true,
    showVariants = true,
    showQuantity = true,
    showAddToCart = true,
    showDescription = true,
  } = data;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handlePreviousImage = () => {
    if (product && product.images.length > 0) {
      setSelectedImage((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1,
      );
    }
  };

  const handleNextImage = () => {
    if (product && product.images.length > 0) {
      setSelectedImage((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  // Show placeholder if no product
  if (!product) {
    return (
      <div data-slot="product-detail-block" data-layout={layout}>
        <div data-slot="product-detail-gallery">
          <div data-slot="product-detail-main-image" data-placeholder="true">
            <Package className="w-16 h-16 text-muted-foreground" />
          </div>
        </div>
        <div data-slot="product-detail-info">
          <div data-slot="product-detail-placeholder">
            <div data-slot="placeholder-title" />
            <div data-slot="placeholder-price" />
            <div data-slot="placeholder-description" />
            <div data-slot="placeholder-button" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-slot="product-detail-block" data-layout={layout}>
      {/* Image Gallery */}
      {showGallery && (
        <div data-slot="product-detail-gallery">
          <div data-slot="product-detail-main-image">
            {product.images[selectedImage] ? (
              <>
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  width={600}
                  height={600}
                  data-object-fit="contain"
                />
                {product.images.length > 1 && (
                  <>
                    <Button
                      onClick={handlePreviousImage}
                      data-slot="product-detail-nav-button"
                      data-direction="prev"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      onClick={handleNextImage}
                      data-slot="product-detail-nav-button"
                      data-direction="next"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}
              </>
            ) : (
              <div data-slot="product-detail-image-placeholder">
                <Package className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Thumbnail gallery */}
          {product.images.length > 1 && (
            <div data-slot="product-detail-thumbnails">
              {product.images.map((image, index) => (
                <Button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  data-slot="product-detail-thumbnail"
                  data-selected={index === selectedImage}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    width={80}
                    height={80}
                    data-object-fit="cover"
                  />
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product Info */}
      <div data-slot="product-detail-info">
        <h1 data-slot="product-detail-title">{product.name}</h1>

        <div data-slot="product-detail-price">
          <span data-slot="product-detail-current-price">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span data-slot="product-detail-compare-price">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {showDescription && product.shortDescription && (
          <p data-slot="product-detail-short-description">
            {product.shortDescription}
          </p>
        )}

        {/* Variant Options */}
        {showVariants && product.options && product.options.length > 0 && (
          <div data-slot="product-detail-options">
            {product.options.map((option) => (
              <FormItem key={option.name} data-slot="product-detail-option">
                <Label>{option.name}</Label>
                <Select
                  value={selectedOptions[option.name] || ""}
                  onValueChange={(value) =>
                    handleOptionChange(option.name, value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${option.name}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {option.values.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            ))}
          </div>
        )}

        {/* Quantity & Add to Cart */}
        <div data-slot="product-detail-actions">
          {showQuantity && (
            <FormItem data-slot="product-detail-quantity">
              <Label>Quantity</Label>
              <div data-slot="product-detail-quantity-controls">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span data-slot="product-detail-quantity-value">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </FormItem>
          )}

          {showAddToCart && (
            <Button size="lg" data-slot="product-detail-add-to-cart">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
          )}
        </div>

        {/* Full Description */}
        {showDescription && product.description && (
          <Card data-slot="product-detail-description-card">
            <CardContent>
              <div
                data-slot="product-detail-description"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
