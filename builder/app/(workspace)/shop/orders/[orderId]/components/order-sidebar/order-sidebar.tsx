import { User, CreditCard, Truck, Clock, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatCurrency,
  formatDate,
  statusBadgeClass,
  paymentBadgeClass,
  fulfillmentBadgeClass,
} from "../../utils";

import "./order-sidebar.css";

interface Order {
  id: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  total: number;
  currency: string;
  email: string;
  phone?: string | null;
  shippingMethod?: string | null;
  customerNote?: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: {
    firstName?: string | null;
    lastName?: string | null;
  } | null;
  shippingAddress?: {
    address1: string;
    address2?: string | null;
    city: string;
    province?: string | null;
    postalCode: string;
    country: string;
  } | null;
  billingAddress?: {
    address1: string;
    address2?: string | null;
    city: string;
    province?: string | null;
    postalCode: string;
    country: string;
  } | null;
  items: Array<{
    id: string;
    fulfilled: boolean;
  }>;
}

interface OrderSidebarProps {
  order: Order;
  onFulfillAll: () => void;
  isFulfillPending: boolean;
}

export function OrderSidebar({
  order,
  onFulfillAll,
  isFulfillPending,
}: OrderSidebarProps) {
  return (
    <>
      {/* Customer Info */}
      <div className="order-detail-card">
        <div className="order-detail-card-header">
          <h2 className="order-detail-card-title">
            <User className="inline h-4 w-4 mr-1.5" />
            Customer
          </h2>
        </div>
        <div className="order-detail-card-body">
          <div className="order-detail-info-row">
            <span className="order-detail-info-label">Name</span>
            <span className="order-detail-info-value">
              {order.customer?.firstName || order.customer?.lastName
                ? `${order.customer.firstName || ""} ${order.customer.lastName || ""}`
                : "\u2014"}
            </span>
          </div>
          <div className="order-detail-info-row">
            <span className="order-detail-info-label">Email</span>
            <span className="order-detail-info-value">
              <a href={`mailto:${order.email}`}>{order.email}</a>
            </span>
          </div>
          {order.phone && (
            <div className="order-detail-info-row">
              <span className="order-detail-info-label">Phone</span>
              <span className="order-detail-info-value">{order.phone}</span>
            </div>
          )}
          {order.shippingAddress && (
            <div className="order-detail-info-row">
              <span className="order-detail-info-label">Shipping Address</span>
              <span className="order-detail-info-value">
                {order.shippingAddress.address1}
                {order.shippingAddress.address2 && (
                  <>, {order.shippingAddress.address2}</>
                )}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.province}{" "}
                {order.shippingAddress.postalCode}
                <br />
                {order.shippingAddress.country}
              </span>
            </div>
          )}
          {order.billingAddress && (
            <div className="order-detail-info-row">
              <span className="order-detail-info-label">Billing Address</span>
              <span className="order-detail-info-value">
                {order.billingAddress.address1}
                {order.billingAddress.address2 && (
                  <>, {order.billingAddress.address2}</>
                )}
                <br />
                {order.billingAddress.city}, {order.billingAddress.province}{" "}
                {order.billingAddress.postalCode}
                <br />
                {order.billingAddress.country}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Status */}
      <div className="order-detail-card">
        <div className="order-detail-card-header">
          <h2 className="order-detail-card-title">
            <CreditCard className="inline h-4 w-4 mr-1.5" />
            Payment
          </h2>
          <span
            className={`order-detail-badge ${paymentBadgeClass[order.paymentStatus as keyof typeof paymentBadgeClass]}`}
          >
            {order.paymentStatus}
          </span>
        </div>
        <div className="order-detail-card-body">
          <div className="order-detail-info-row">
            <span className="order-detail-info-label">Amount</span>
            <span className="order-detail-info-value">
              {formatCurrency(order.total)} {order.currency}
            </span>
          </div>
        </div>
      </div>

      {/* Fulfillment Status */}
      <div className="order-detail-card">
        <div className="order-detail-card-header">
          <h2 className="order-detail-card-title">
            <Truck className="inline h-4 w-4 mr-1.5" />
            Fulfillment
          </h2>
          <span
            className={`order-detail-badge ${fulfillmentBadgeClass[order.fulfillmentStatus as keyof typeof fulfillmentBadgeClass]}`}
          >
            {order.fulfillmentStatus}
          </span>
        </div>
        <div className="order-detail-card-body">
          {order.shippingMethod && (
            <div className="order-detail-info-row">
              <span className="order-detail-info-label">Shipping Method</span>
              <span className="order-detail-info-value">
                {order.shippingMethod}
              </span>
            </div>
          )}
          <div className="order-detail-info-row">
            <span className="order-detail-info-label">Items</span>
            <span className="order-detail-info-value">
              {order.items.filter((i) => i.fulfilled).length} of{" "}
              {order.items.length} fulfilled
            </span>
          </div>
          {order.fulfillmentStatus !== "fulfilled" &&
            order.status !== "cancelled" && (
              <Button
                size="sm"
                className="w-full mt-2"
                onClick={onFulfillAll}
                disabled={isFulfillPending}
              >
                <Package className="h-4 w-4" />
                {isFulfillPending ? "Fulfilling..." : "Fulfill Remaining"}
              </Button>
            )}
        </div>
      </div>

      {/* Order Status */}
      <div className="order-detail-card">
        <div className="order-detail-card-header">
          <h2 className="order-detail-card-title">
            <Clock className="inline h-4 w-4 mr-1.5" />
            Order Status
          </h2>
          <span
            className={`order-detail-badge ${statusBadgeClass[order.status as keyof typeof statusBadgeClass]}`}
          >
            {order.status}
          </span>
        </div>
        <div className="order-detail-card-body">
          <div className="order-detail-info-row">
            <span className="order-detail-info-label">Created</span>
            <span className="order-detail-info-value">
              {formatDate(order.createdAt)}
            </span>
          </div>
          <div className="order-detail-info-row">
            <span className="order-detail-info-label">Last Updated</span>
            <span className="order-detail-info-value">
              {formatDate(order.updatedAt)}
            </span>
          </div>
          {order.customerNote && (
            <div className="order-detail-info-row">
              <span className="order-detail-info-label">Customer Note</span>
              <span className="order-detail-info-value">
                {order.customerNote}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
