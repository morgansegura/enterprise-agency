import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";

import "./product-variants-card.css";

interface ProductVariant {
  id: string;
  name: string;
  sku?: string | null;
  price: number;
  inventory: number;
  lowStockThreshold: number;
  isDefault: boolean;
  options: Record<string, string>;
}

interface ProductVariantsCardProps {
  variants: ProductVariant[];
  onAdd: () => void;
  onDelete: (variant: ProductVariant) => void;
  formatCurrency: (amount: number) => string;
}

export function ProductVariantsCard({
  variants,
  onAdd,
  onDelete,
  formatCurrency,
}: ProductVariantsCardProps) {
  return (
    <div className="product-form-card">
      <div className="product-form-card-header">
        <h2 className="product-form-card-title">Product Variants</h2>
        <Button size="sm" variant="outline" onClick={onAdd}>
          <PlusCircle className="h-4 w-4" />
          Add Variant
        </Button>
      </div>
      <div className="product-form-card-body">
        {variants.length === 0 ? (
          <div className="product-form-variants-empty">
            <p>
              No variants yet. Add variants for different sizes, colors, or
              configurations.
            </p>
          </div>
        ) : (
          <table className="product-form-variants-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th className="product-form-variant-col-right">Price</th>
                <th className="product-form-variant-col-right">Inventory</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => (
                <tr key={variant.id}>
                  <td>
                    <span className="product-form-variant-name">
                      {variant.name}
                    </span>
                    {variant.isDefault && (
                      <span className="order-detail-badge order-detail-badge-confirmed ml-2">
                        Default
                      </span>
                    )}
                    {Object.keys(variant.options).length > 0 && (
                      <div className="product-form-variant-options">
                        {Object.entries(variant.options)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")}
                      </div>
                    )}
                  </td>
                  <td>{variant.sku || "\u2014"}</td>
                  <td className="product-form-variant-price">
                    {formatCurrency(variant.price)}
                  </td>
                  <td
                    className={`product-form-variant-inventory ${
                      variant.inventory <= variant.lowStockThreshold
                        ? "product-form-variant-low"
                        : ""
                    }`}
                  >
                    {variant.inventory}
                  </td>
                  <td>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(variant)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
