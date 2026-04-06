import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

import "./product-inventory-card.css";

interface ProductInventoryCardProps {
  formData: {
    trackInventory?: boolean;
    inventory?: number;
    lowStockThreshold?: number;
    sku?: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onNumberChange: (name: string, value: string) => void;
  onToggleTrack: (checked: boolean) => void;
  currentStock?: number;
  inventoryAdjustment?: number;
  adjustmentReason?: string;
  onAdjustmentChange?: (value: number) => void;
  onReasonChange?: (value: string) => void;
  onAdjustInventory?: () => void;
  isAdjustPending?: boolean;
}

export function ProductInventoryCard({
  formData,
  onChange,
  onNumberChange,
  onToggleTrack,
  currentStock,
  inventoryAdjustment,
  adjustmentReason,
  onAdjustmentChange,
  onReasonChange,
  onAdjustInventory,
  isAdjustPending,
}: ProductInventoryCardProps) {
  const isEditMode = currentStock !== undefined;

  return (
    <>
      <div className="product-form-card">
        <div className="product-form-card-header">
          <h2 className="product-form-card-title">
            {isEditMode ? "Inventory Settings" : "Inventory"}
          </h2>
        </div>
        <div className="product-form-card-body">
          <div className="product-form-toggle-row">
            <div className="product-form-toggle-info">
              <div className="product-form-toggle-label">Track Inventory</div>
              <div className="product-form-toggle-description">
                Automatically adjust stock when orders are placed
              </div>
            </div>
            <Switch
              checked={formData.trackInventory ?? false}
              onCheckedChange={onToggleTrack}
            />
          </div>
          {formData.trackInventory && (
            <>
              {isEditMode ? (
                <>
                  <div className="product-form-field-row">
                    <div className="product-form-field">
                      <label className="product-form-field-label">
                        Current Stock
                      </label>
                      <p className="text-2xl font-bold">{currentStock}</p>
                    </div>
                    <div className="product-form-field">
                      <label
                        htmlFor="lowStockThreshold"
                        className="product-form-field-label"
                      >
                        Low Stock Threshold
                      </label>
                      <Input
                        id="lowStockThreshold"
                        type="number"
                        min="0"
                        value={formData.lowStockThreshold ?? ""}
                        onChange={(e) =>
                          onNumberChange("lowStockThreshold", e.target.value)
                        }
                        className="product-form-field-input"
                      />
                    </div>
                  </div>
                  <div className="product-form-field">
                    <label htmlFor="sku" className="product-form-field-label">
                      SKU
                    </label>
                    <Input
                      id="sku"
                      name="sku"
                      value={formData.sku || ""}
                      onChange={onChange}
                      className="product-form-field-input"
                    />
                  </div>
                </>
              ) : (
                <div className="product-form-field-row-3">
                  <div className="product-form-field">
                    <label
                      htmlFor="inventory"
                      className="product-form-field-label"
                    >
                      <Package />
                      Quantity
                    </label>
                    <Input
                      id="inventory"
                      type="number"
                      min="0"
                      value={formData.inventory ?? 0}
                      onChange={(e) =>
                        onNumberChange("inventory", e.target.value)
                      }
                      className="product-form-field-input"
                    />
                  </div>
                  <div className="product-form-field">
                    <label
                      htmlFor="lowStockThreshold"
                      className="product-form-field-label"
                    >
                      Low Stock Threshold
                    </label>
                    <Input
                      id="lowStockThreshold"
                      type="number"
                      min="0"
                      value={formData.lowStockThreshold ?? 5}
                      onChange={(e) =>
                        onNumberChange("lowStockThreshold", e.target.value)
                      }
                      className="product-form-field-input"
                    />
                  </div>
                  <div className="product-form-field">
                    <label htmlFor="sku" className="product-form-field-label">
                      SKU
                    </label>
                    <Input
                      id="sku"
                      name="sku"
                      value={formData.sku || ""}
                      onChange={onChange}
                      placeholder="e.g., TSH-BLK-LG"
                      className="product-form-field-input"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {isEditMode &&
        formData.trackInventory &&
        onAdjustInventory &&
        onAdjustmentChange &&
        onReasonChange && (
          <div className="product-form-card">
            <div className="product-form-card-header">
              <h2 className="product-form-card-title">Adjust Inventory</h2>
              <p className="product-form-card-description">
                Positive to add stock, negative to remove
              </p>
            </div>
            <div className="product-form-card-body">
              <div className="product-form-field-row">
                <div className="product-form-field">
                  <label
                    htmlFor="adjustment"
                    className="product-form-field-label"
                  >
                    Adjustment
                  </label>
                  <Input
                    id="adjustment"
                    type="number"
                    value={inventoryAdjustment}
                    onChange={(e) =>
                      onAdjustmentChange(parseInt(e.target.value) || 0)
                    }
                    placeholder="e.g., 10 or -5"
                    className="product-form-field-input"
                  />
                </div>
                <div className="product-form-field">
                  <label htmlFor="reason" className="product-form-field-label">
                    Reason (optional)
                  </label>
                  <Input
                    id="reason"
                    value={adjustmentReason}
                    onChange={(e) => onReasonChange(e.target.value)}
                    placeholder="e.g., Stock count correction"
                    className="product-form-field-input"
                  />
                </div>
              </div>
              <Button
                size="sm"
                onClick={onAdjustInventory}
                disabled={inventoryAdjustment === 0 || isAdjustPending}
              >
                {isAdjustPending ? "Adjusting..." : "Apply Adjustment"}
              </Button>
            </div>
          </div>
        )}
    </>
  );
}
