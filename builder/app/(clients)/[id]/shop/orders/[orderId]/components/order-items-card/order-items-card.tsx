import { ImageIcon } from "lucide-react";
import { formatCurrency } from "../../utils";

import "./order-items-card.css";

interface OrderItem {
  id: string;
  name: string;
  sku?: string | null;
  quantity: number;
  price: number;
  total: number;
  fulfilled: boolean;
  product?: {
    images?: string[];
  } | null;
}

interface OrderItemsCardProps {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
}

export function OrderItemsCard({
  items,
  subtotal,
  shipping,
  discount,
  tax,
  total,
}: OrderItemsCardProps) {
  return (
    <div className="order-detail-card">
      <div className="order-detail-card-header">
        <h2 className="order-detail-card-title">Order Items</h2>
        <span className="order-detail-card-title">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="order-detail-card-body">
        <table className="order-items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th className="order-items-col-right">Unit Price</th>
              <th className="order-items-col-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="order-item-product">
                    <div className="order-item-image">
                      {item.product?.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.product.images[0]} alt={item.name} />
                      ) : (
                        <ImageIcon />
                      )}
                    </div>
                    <div>
                      <div className="order-item-name">{item.name}</div>
                      {item.sku && (
                        <div className="order-item-sku">SKU: {item.sku}</div>
                      )}
                      {item.fulfilled ? (
                        <span className="order-item-fulfilled">Fulfilled</span>
                      ) : (
                        <span className="order-item-unfulfilled">
                          Unfulfilled
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="order-item-qty">{item.quantity}</td>
                <td className="order-item-price">
                  {formatCurrency(item.price)}
                </td>
                <td className="order-item-total">
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="order-summary">
          <div className="order-summary-row">
            <span className="order-summary-label">Subtotal</span>
            <span className="order-summary-value">
              {formatCurrency(subtotal)}
            </span>
          </div>
          <div className="order-summary-row">
            <span className="order-summary-label">Shipping</span>
            <span className="order-summary-value">
              {formatCurrency(shipping)}
            </span>
          </div>
          {discount > 0 && (
            <div className="order-summary-row">
              <span className="order-summary-label">Discount</span>
              <span className="order-summary-value">
                -{formatCurrency(discount)}
              </span>
            </div>
          )}
          <div className="order-summary-row">
            <span className="order-summary-label">Tax</span>
            <span className="order-summary-value">{formatCurrency(tax)}</span>
          </div>
          <div className="order-summary-row order-summary-total">
            <span className="order-summary-label">Total</span>
            <span className="order-summary-value">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
