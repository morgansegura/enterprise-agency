import { ShoppingCart } from "lucide-react";

import "./customer-orders.css";

interface Order {
  id: string;
  orderNumber: number;
  createdAt: string;
  total: number;
}

interface CustomerOrdersProps {
  orders: Order[];
  tenantId: string;
  onViewOrder: (orderId: string) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export function CustomerOrders({ orders, onViewOrder }: CustomerOrdersProps) {
  return (
    <div className="customer-detail-card">
      <div className="customer-detail-card-header">
        <h2 className="customer-detail-card-title">
          <ShoppingCart className="inline h-4 w-4 mr-1.5" />
          Recent Orders
        </h2>
      </div>
      <div className="customer-detail-card-body">
        {orders.length === 0 ? (
          <div className="customer-orders-empty">
            <p>No orders yet</p>
          </div>
        ) : (
          <table className="customer-orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th className="customer-orders-col-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((order) => (
                <tr key={order.id}>
                  <td>
                    <span
                      className="customer-orders-number"
                      onClick={() => onViewOrder(order.id)}
                    >
                      #{order.orderNumber}
                    </span>
                  </td>
                  <td className="customer-orders-date">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="customer-orders-total">
                    {formatCurrency(order.total)}
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
