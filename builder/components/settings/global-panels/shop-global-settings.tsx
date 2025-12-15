"use client";

import {
  SettingsSection,
  SettingsForm,
  SettingsField,
} from "@/components/ui/settings-drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

// =============================================================================
// Types
// =============================================================================

export interface ShopGlobalSettingsData {
  // General
  storeName: string;
  storeEmail: string;
  currency: string;
  weightUnit: "lb" | "kg" | "oz" | "g";

  // Checkout
  guestCheckout: boolean;
  requirePhone: boolean;
  termsRequired: boolean;
  termsPageUrl?: string;

  // Payments
  stripeEnabled: boolean;
  stripePublicKey?: string;
  squareEnabled: boolean;
  squareApplicationId?: string;

  // Shipping
  freeShippingThreshold?: number;
  flatRateShipping?: number;

  // Tax
  taxEnabled: boolean;
  taxRate?: number;
  taxIncludedInPrices: boolean;

  // Inventory
  lowStockThreshold: number;
  outOfStockBehavior: "hide" | "show" | "backorder";
}

export type ShopTabId =
  | "store"
  | "checkout"
  | "payments"
  | "shipping"
  | "tax"
  | "inventory";

interface ShopGlobalSettingsProps {
  activeTab: ShopTabId;
  data: Partial<ShopGlobalSettingsData>;
  onChange: (field: keyof ShopGlobalSettingsData, value: unknown) => void;
  isLoading?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function ShopGlobalSettings({
  activeTab,
  data,
  onChange,
  isLoading,
}: ShopGlobalSettingsProps) {
  return (
    <>
      {activeTab === "store" && (
        <SettingsSection
          title="Store Information"
          description="Basic store details and preferences."
        >
          <SettingsForm>
            <SettingsField>
              <Label htmlFor="store-name">Store Name</Label>
              <Input
                id="store-name"
                value={data.storeName || ""}
                onChange={(e) => onChange("storeName", e.target.value)}
                placeholder="My Store"
                disabled={isLoading}
              />
            </SettingsField>

            <SettingsField>
              <Label htmlFor="store-email">Store Email</Label>
              <Input
                id="store-email"
                type="email"
                value={data.storeEmail || ""}
                onChange={(e) => onChange("storeEmail", e.target.value)}
                placeholder="orders@example.com"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Used for order notifications
              </p>
            </SettingsField>

            <SettingsField>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={data.currency || "USD"}
                onValueChange={(value) => onChange("currency", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </SettingsField>

            <SettingsField>
              <Label htmlFor="weight-unit">Weight Unit</Label>
              <Select
                value={data.weightUnit || "lb"}
                onValueChange={(value) => onChange("weightUnit", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="weight-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lb">Pounds (lb)</SelectItem>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="oz">Ounces (oz)</SelectItem>
                  <SelectItem value="g">Grams (g)</SelectItem>
                </SelectContent>
              </Select>
            </SettingsField>
          </SettingsForm>
        </SettingsSection>
      )}

      {activeTab === "checkout" && (
        <SettingsSection
          title="Checkout"
          description="Configure checkout behavior and requirements."
        >
          <SettingsForm>
            <SettingsField>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Guest Checkout</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow customers to checkout without an account
                  </p>
                </div>
                <Switch
                  checked={data.guestCheckout ?? true}
                  onCheckedChange={(checked) =>
                    onChange("guestCheckout", checked)
                  }
                  disabled={isLoading}
                />
              </div>
            </SettingsField>

            <SettingsField>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    Require Phone Number
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Make phone number required at checkout
                  </p>
                </div>
                <Switch
                  checked={data.requirePhone || false}
                  onCheckedChange={(checked) =>
                    onChange("requirePhone", checked)
                  }
                  disabled={isLoading}
                />
              </div>
            </SettingsField>

            <SettingsField>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    Terms & Conditions
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Require acceptance before checkout
                  </p>
                </div>
                <Switch
                  checked={data.termsRequired || false}
                  onCheckedChange={(checked) =>
                    onChange("termsRequired", checked)
                  }
                  disabled={isLoading}
                />
              </div>
            </SettingsField>

            {data.termsRequired && (
              <SettingsField>
                <Label htmlFor="terms-url">Terms Page URL</Label>
                <Input
                  id="terms-url"
                  value={data.termsPageUrl || ""}
                  onChange={(e) => onChange("termsPageUrl", e.target.value)}
                  placeholder="/terms"
                  disabled={isLoading}
                />
              </SettingsField>
            )}
          </SettingsForm>
        </SettingsSection>
      )}

      {activeTab === "payments" && (
        <SettingsSection
          title="Payment Providers"
          description="Configure payment processing."
        >
          <SettingsForm>
            <SettingsField>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div>
                    <Label className="text-sm font-medium">Stripe</Label>
                    <p className="text-xs text-muted-foreground">
                      Accept cards via Stripe
                    </p>
                  </div>
                </div>
                <Switch
                  checked={data.stripeEnabled || false}
                  onCheckedChange={(checked) =>
                    onChange("stripeEnabled", checked)
                  }
                  disabled={isLoading}
                />
              </div>
            </SettingsField>

            {data.stripeEnabled && (
              <SettingsField>
                <Label htmlFor="stripe-key">Stripe Publishable Key</Label>
                <Input
                  id="stripe-key"
                  value={data.stripePublicKey || ""}
                  onChange={(e) => onChange("stripePublicKey", e.target.value)}
                  placeholder="pk_live_..."
                  disabled={isLoading}
                />
                <Button
                  variant="link"
                  size="sm"
                  className="px-0 h-auto mt-1"
                  asChild
                >
                  <a
                    href="https://dashboard.stripe.com/apikeys"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get API keys <ExternalLink className="ml-1 size-3" />
                  </a>
                </Button>
              </SettingsField>
            )}

            <SettingsField>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Square</Label>
                  <p className="text-xs text-muted-foreground">
                    Accept payments via Square
                  </p>
                </div>
                <Switch
                  checked={data.squareEnabled || false}
                  onCheckedChange={(checked) =>
                    onChange("squareEnabled", checked)
                  }
                  disabled={isLoading}
                />
              </div>
            </SettingsField>

            {data.squareEnabled && (
              <SettingsField>
                <Label htmlFor="square-app-id">Square Application ID</Label>
                <Input
                  id="square-app-id"
                  value={data.squareApplicationId || ""}
                  onChange={(e) =>
                    onChange("squareApplicationId", e.target.value)
                  }
                  placeholder="sq0idp-..."
                  disabled={isLoading}
                />
              </SettingsField>
            )}
          </SettingsForm>
        </SettingsSection>
      )}

      {activeTab === "shipping" && (
        <SettingsSection
          title="Shipping"
          description="Configure shipping rates and options."
        >
          <SettingsForm>
            <SettingsField>
              <Label htmlFor="free-shipping">Free Shipping Threshold</Label>
              <Input
                id="free-shipping"
                type="number"
                min="0"
                step="0.01"
                value={data.freeShippingThreshold ?? ""}
                onChange={(e) =>
                  onChange(
                    "freeShippingThreshold",
                    e.target.value ? parseFloat(e.target.value) : undefined,
                  )
                }
                placeholder="0.00"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Orders above this amount get free shipping (leave empty to
                disable)
              </p>
            </SettingsField>

            <SettingsField>
              <Label htmlFor="flat-rate">Flat Rate Shipping</Label>
              <Input
                id="flat-rate"
                type="number"
                min="0"
                step="0.01"
                value={data.flatRateShipping ?? ""}
                onChange={(e) =>
                  onChange(
                    "flatRateShipping",
                    e.target.value ? parseFloat(e.target.value) : undefined,
                  )
                }
                placeholder="0.00"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Default shipping cost for all orders
              </p>
            </SettingsField>
          </SettingsForm>
        </SettingsSection>
      )}

      {activeTab === "tax" && (
        <SettingsSection title="Tax" description="Configure tax calculation.">
          <SettingsForm>
            <SettingsField>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Enable Tax</Label>
                  <p className="text-xs text-muted-foreground">
                    Calculate tax on orders
                  </p>
                </div>
                <Switch
                  checked={data.taxEnabled || false}
                  onCheckedChange={(checked) => onChange("taxEnabled", checked)}
                  disabled={isLoading}
                />
              </div>
            </SettingsField>

            {data.taxEnabled && (
              <>
                <SettingsField>
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={data.taxRate || ""}
                    onChange={(e) =>
                      onChange("taxRate", parseFloat(e.target.value) || 0)
                    }
                    placeholder="0.00"
                    disabled={isLoading}
                  />
                </SettingsField>

                <SettingsField>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">
                        Tax Included in Prices
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Product prices already include tax
                      </p>
                    </div>
                    <Switch
                      checked={data.taxIncludedInPrices || false}
                      onCheckedChange={(checked) =>
                        onChange("taxIncludedInPrices", checked)
                      }
                      disabled={isLoading}
                    />
                  </div>
                </SettingsField>
              </>
            )}
          </SettingsForm>
        </SettingsSection>
      )}

      {activeTab === "inventory" && (
        <SettingsSection
          title="Inventory"
          description="Stock management settings."
        >
          <SettingsForm>
            <SettingsField>
              <Label htmlFor="low-stock">Low Stock Threshold</Label>
              <Input
                id="low-stock"
                type="number"
                min="0"
                value={data.lowStockThreshold ?? 5}
                onChange={(e) =>
                  onChange("lowStockThreshold", parseInt(e.target.value) || 0)
                }
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get notified when stock falls below this number
              </p>
            </SettingsField>

            <SettingsField>
              <Label htmlFor="out-of-stock">Out of Stock Behavior</Label>
              <Select
                value={data.outOfStockBehavior || "show"}
                onValueChange={(value) => onChange("outOfStockBehavior", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="out-of-stock">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hide">Hide product</SelectItem>
                  <SelectItem value="show">Show as out of stock</SelectItem>
                  <SelectItem value="backorder">Allow backorders</SelectItem>
                </SelectContent>
              </Select>
            </SettingsField>
          </SettingsForm>
        </SettingsSection>
      )}
    </>
  );
}
