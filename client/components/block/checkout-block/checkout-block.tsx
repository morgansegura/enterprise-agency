"use client";

import type { CheckoutBlockData } from "@/lib/blocks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { CreditCard, Package, Lock, ShoppingBag } from "lucide-react";
import "./checkout-block.css";
import { FormItem } from "@/components/ui/form";

// Mock cart item type
type CartItem = {
  id: string;
  name: string;
  variantName?: string;
  price: number;
  quantity: number;
  image?: string;
};

type CheckoutBlockProps = {
  data: CheckoutBlockData;
  items?: CartItem[];
  subtotal?: number;
  shipping?: number;
  tax?: number;
  total?: number;
  onSubmit?: (formData: Record<string, string>) => void;
};

/**
 * CheckoutBlock - Renders checkout form
 * Content block (leaf node) - collects shipping, billing, and payment info
 */
export function CheckoutBlock({
  data,
  items = [],
  subtotal = 0,
  shipping = 0,
  tax = 0,
  total = 0,
  onSubmit,
}: CheckoutBlockProps) {
  const {
    showOrderSummary = true,
    collectShipping = true,
    collectBilling = true,
    allowDifferentBilling = true,
  } = data;

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });
    onSubmit?.(data);
  };

  // Empty checkout state
  if (items.length === 0) {
    return (
      <Card data-slot="checkout-block" data-empty="true">
        <CardContent data-slot="checkout-empty">
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          <p data-slot="checkout-empty-message">
            Your cart is empty. Add some items before checkout.
          </p>
          <Button variant="outline" asChild>
            <Link href="/shop">Browse Products</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div data-slot="checkout-block">
      <form onSubmit={handleSubmit} data-slot="checkout-form">
        {/* Contact Information */}
        <Card data-slot="checkout-section">
          <CardHeader>
            <CardTitle data-slot="checkout-section-title">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent data-slot="checkout-section-content">
            <FormItem data-slot="checkout-field">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
              />
            </FormItem>
            <FormItem data-slot="checkout-field">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(555) 555-5555"
              />
            </FormItem>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        {collectShipping && (
          <Card data-slot="checkout-section">
            <CardHeader>
              <CardTitle data-slot="checkout-section-title">
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent data-slot="checkout-section-content">
              <div data-slot="checkout-field-row">
                <FormItem data-slot="checkout-field">
                  <Label htmlFor="shipping_firstName">First Name</Label>
                  <Input
                    id="shipping_firstName"
                    name="shipping_firstName"
                    required
                  />
                </FormItem>
                <FormItem data-slot="checkout-field">
                  <Label htmlFor="shipping_lastName">Last Name</Label>
                  <Input
                    id="shipping_lastName"
                    name="shipping_lastName"
                    required
                  />
                </FormItem>
              </div>
              <FormItem data-slot="checkout-field">
                <Label htmlFor="shipping_address1">Address</Label>
                <Input
                  id="shipping_address1"
                  name="shipping_address1"
                  placeholder="Street address"
                  required
                />
              </FormItem>
              <FormItem data-slot="checkout-field">
                <Label htmlFor="shipping_address2">
                  Apartment, suite, etc. (optional)
                </Label>
                <Input
                  id="shipping_address2"
                  name="shipping_address2"
                  placeholder="Apt, suite, unit, etc."
                />
              </FormItem>
              <div data-slot="checkout-field-row">
                <FormItem data-slot="checkout-field">
                  <Label htmlFor="shipping_city">City</Label>
                  <Input id="shipping_city" name="shipping_city" required />
                </FormItem>
                <FormItem data-slot="checkout-field">
                  <Label htmlFor="shipping_state">State</Label>
                  <Input
                    id="shipping_state"
                    name="shipping_state"
                    placeholder="CA"
                    required
                  />
                </FormItem>
                <FormItem data-slot="checkout-field">
                  <Label htmlFor="shipping_zip">ZIP Code</Label>
                  <Input
                    id="shipping_zip"
                    name="shipping_zip"
                    placeholder="12345"
                    required
                  />
                </FormItem>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Billing Address */}
        {collectBilling && (
          <Card data-slot="checkout-section">
            <CardHeader>
              <CardTitle data-slot="checkout-section-title">
                Billing Address
              </CardTitle>
            </CardHeader>
            <CardContent data-slot="checkout-section-content">
              {allowDifferentBilling && collectShipping && (
                <FormItem data-slot="checkout-checkbox-field">
                  <Checkbox
                    id="sameAsShipping"
                    checked={sameAsShipping}
                    onCheckedChange={(checked) =>
                      setSameAsShipping(checked === true)
                    }
                  />
                  <Label htmlFor="sameAsShipping">
                    Same as shipping address
                  </Label>
                </FormItem>
              )}

              {(!sameAsShipping || !collectShipping) && (
                <>
                  <div data-slot="checkout-field-row">
                    <FormItem data-slot="checkout-field">
                      <Label htmlFor="billing_firstName">First Name</Label>
                      <Input
                        id="billing_firstName"
                        name="billing_firstName"
                        required={!sameAsShipping}
                      />
                    </FormItem>
                    <FormItem data-slot="checkout-field">
                      <Label htmlFor="billing_lastName">Last Name</Label>
                      <Input
                        id="billing_lastName"
                        name="billing_lastName"
                        required={!sameAsShipping}
                      />
                    </FormItem>
                  </div>
                  <FormItem data-slot="checkout-field">
                    <Label htmlFor="billing_address1">Address</Label>
                    <Input
                      id="billing_address1"
                      name="billing_address1"
                      placeholder="Street address"
                      required={!sameAsShipping}
                    />
                  </FormItem>
                  <FormItem data-slot="checkout-field">
                    <Label htmlFor="billing_address2">
                      Apartment, suite, etc. (optional)
                    </Label>
                    <Input
                      id="billing_address2"
                      name="billing_address2"
                      placeholder="Apt, suite, unit, etc."
                    />
                  </FormItem>
                  <div data-slot="checkout-field-row">
                    <FormItem data-slot="checkout-field">
                      <Label htmlFor="billing_city">City</Label>
                      <Input
                        id="billing_city"
                        name="billing_city"
                        required={!sameAsShipping}
                      />
                    </FormItem>
                    <FormItem data-slot="checkout-field">
                      <Label htmlFor="billing_state">State</Label>
                      <Input
                        id="billing_state"
                        name="billing_state"
                        placeholder="CA"
                        required={!sameAsShipping}
                      />
                    </FormItem>
                    <FormItem data-slot="checkout-field">
                      <Label htmlFor="billing_zip">ZIP Code</Label>
                      <Input
                        id="billing_zip"
                        name="billing_zip"
                        placeholder="12345"
                        required={!sameAsShipping}
                      />
                    </FormItem>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Payment Method */}
        <Card data-slot="checkout-section">
          <CardHeader>
            <CardTitle data-slot="checkout-section-title">
              <CreditCard className="w-5 h-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent data-slot="checkout-section-content">
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              data-slot="checkout-payment-methods"
            >
              <div data-slot="checkout-payment-option">
                <RadioGroupItem value="card" id="payment_card" />
                <Label htmlFor="payment_card">
                  <CreditCard className="w-4 h-4" />
                  Credit / Debit Card
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "card" && (
              <div data-slot="checkout-card-fields">
                <FormItem data-slot="checkout-field">
                  <Label htmlFor="card_number">Card Number</Label>
                  <Input
                    id="card_number"
                    name="card_number"
                    placeholder="4242 4242 4242 4242"
                    required
                  />
                </FormItem>
                <div data-slot="checkout-field-row">
                  <FormItem data-slot="checkout-field">
                    <Label htmlFor="card_expiry">Expiration</Label>
                    <Input
                      id="card_expiry"
                      name="card_expiry"
                      placeholder="MM/YY"
                      required
                    />
                  </FormItem>
                  <FormItem data-slot="checkout-field">
                    <Label htmlFor="card_cvc">CVC</Label>
                    <Input
                      id="card_cvc"
                      name="card_cvc"
                      placeholder="123"
                      required
                    />
                  </FormItem>
                </div>
              </div>
            )}

            <p data-slot="checkout-secure-notice">
              <Lock className="w-4 h-4" />
              Your payment information is encrypted and secure.
            </p>
          </CardContent>
        </Card>

        {/* Submit */}
        <Button type="submit" size="lg" data-slot="checkout-submit">
          <Lock className="w-4 h-4 mr-2" />
          Complete Order - {formatPrice(total)}
        </Button>
      </form>

      {/* Order Summary */}
      {showOrderSummary && (
        <div data-slot="checkout-summary">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent data-slot="checkout-summary-content">
              {/* Items */}
              <div data-slot="checkout-summary-items">
                {items.map((item) => (
                  <div key={item.id} data-slot="checkout-summary-item">
                    <div data-slot="checkout-summary-item-image">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          data-object-fit="cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-muted-foreground" />
                      )}
                      <span data-slot="checkout-summary-item-quantity">
                        {item.quantity}
                      </span>
                    </div>
                    <div data-slot="checkout-summary-item-info">
                      <span data-slot="checkout-summary-item-name">
                        {item.name}
                      </span>
                      {item.variantName && (
                        <span data-slot="checkout-summary-item-variant">
                          {item.variantName}
                        </span>
                      )}
                    </div>
                    <span data-slot="checkout-summary-item-price">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div data-slot="checkout-summary-totals">
                <div data-slot="checkout-summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div data-slot="checkout-summary-row">
                  <span>Shipping</span>
                  <span>{shipping > 0 ? formatPrice(shipping) : "Free"}</span>
                </div>
                {tax > 0 && (
                  <div data-slot="checkout-summary-row">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                )}
                <Separator />
                <div data-slot="checkout-summary-row" data-total="true">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
