"use client";

import type { CartBlockData } from "@/lib/blocks";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Package,
  ArrowRight,
  PlusCircle,
} from "lucide-react";
import "./cart-block.css";

// Mock cart item type - in production this would come from cart context/API
type CartItem = {
  id: string;
  productId: string;
  productSlug: string;
  variantId?: string;
  name: string;
  variantName?: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartBlockProps = {
  data: CartBlockData;
  items?: CartItem[];
  subtotal?: number;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
};

/**
 * CartBlock - Renders the shopping cart
 * Content block (leaf node) - displays cart items with quantity controls
 */
export function CartBlock({
  data,
  items = [],
  subtotal = 0,
  onUpdateQuantity,
  onRemoveItem,
}: CartBlockProps) {
  const {
    compact = false,
    showCheckout = true,
    showContinueShopping = true,
    checkoutButtonText = "Proceed to Checkout",
    emptyMessage = "Your cart is empty",
  } = data;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleQuantityChange = (
    itemId: string,
    delta: number,
    currentQuantity: number,
  ) => {
    const newQuantity = Math.max(0, currentQuantity + delta);
    if (newQuantity === 0) {
      onRemoveItem?.(itemId);
    } else {
      onUpdateQuantity?.(itemId, newQuantity);
    }
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <Card data-slot="cart-block" data-compact={compact} data-empty="true">
        <CardContent data-slot="cart-empty">
          <ShoppingCart className="w-12 h-12 text-muted-foreground" />
          <p data-slot="cart-empty-message">{emptyMessage}</p>
          {showContinueShopping && (
            <Button variant="outline" asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Compact view (for sidebar/header dropdown)
  if (compact) {
    return (
      <div data-slot="cart-block" data-compact="true">
        <div data-slot="cart-items-compact">
          {items.slice(0, 3).map((item) => (
            <div key={item.id} data-slot="cart-item-compact">
              <div data-slot="cart-item-image-compact">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={48}
                    height={48}
                    data-object-fit="cover"
                  />
                ) : (
                  <Package className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div data-slot="cart-item-info-compact">
                <span data-slot="cart-item-name-compact">{item.name}</span>
                <span data-slot="cart-item-meta-compact">
                  {item.quantity} × {formatPrice(item.price)}
                </span>
              </div>
            </div>
          ))}
          {items.length > 3 && (
            <p data-slot="cart-more-items">+{items.length - 3} more items</p>
          )}
        </div>
        <Separator />
        <div data-slot="cart-footer-compact">
          <div data-slot="cart-subtotal-compact">
            <span>Subtotal</span>
            <span data-slot="cart-subtotal-value">{formatPrice(subtotal)}</span>
          </div>
          {showCheckout && (
            <Button asChild size="sm">
              <Link href="/checkout">
                {checkoutButtonText}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Full cart view
  return (
    <div data-slot="cart-block">
      <div data-slot="cart-main">
        {/* Cart Items */}
        <Card data-slot="cart-items-card">
          <CardHeader>
            <CardTitle data-slot="cart-title">
              <ShoppingCart className="w-5 h-5" />
              Shopping Cart ({items.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent data-slot="cart-items">
            {items.map((item, index) => (
              <div key={item.id}>
                {index > 0 && <Separator data-slot="cart-item-separator" />}
                <div data-slot="cart-item">
                  <div data-slot="cart-item-image">
                    {item.image ? (
                      <Link href={`/shop/product/${item.productSlug}`}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={96}
                          height={96}
                          data-object-fit="cover"
                        />
                      </Link>
                    ) : (
                      <div data-slot="cart-item-image-placeholder">
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div data-slot="cart-item-details">
                    <Link href={`/shop/product/${item.productSlug}`}>
                      <h3 data-slot="cart-item-name">{item.name}</h3>
                    </Link>
                    {item.variantName && (
                      <p data-slot="cart-item-variant">{item.variantName}</p>
                    )}
                    <p data-slot="cart-item-price">{formatPrice(item.price)}</p>
                  </div>

                  <div data-slot="cart-item-actions">
                    <div data-slot="cart-item-quantity">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleQuantityChange(item.id, -1, item.quantity)
                        }
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span data-slot="cart-item-quantity-value">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleQuantityChange(item.id, 1, item.quantity)
                        }
                      >
                        <PlusCircle className="w-4 h-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem?.(item.id)}
                      data-slot="cart-item-remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div data-slot="cart-item-total">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Cart Summary */}
      <div data-slot="cart-summary">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent data-slot="cart-summary-content">
            <div data-slot="cart-summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div data-slot="cart-summary-row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <Separator />
            <div data-slot="cart-summary-row" data-total="true">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </CardContent>
          <CardFooter data-slot="cart-summary-footer">
            {showCheckout && (
              <Button asChild size="lg" data-slot="cart-checkout-button">
                <Link href="/checkout">
                  {checkoutButtonText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
            {showContinueShopping && (
              <Button variant="ghost" asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
