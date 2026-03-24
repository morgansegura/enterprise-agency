import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Tag } from "lucide-react";

import "./product-details-card.css";

interface ProductDetailsCardProps {
  formData: {
    name?: string;
    shortDescription?: string;
    description?: string;
    price?: number;
    compareAtPrice?: number;
    cost?: number;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onNumberChange: (name: string, value: string) => void;
}

export function ProductDetailsCard({
  formData,
  onChange,
  onNumberChange,
}: ProductDetailsCardProps) {
  return (
    <>
      <div className="product-form-card">
        <div className="product-form-card-header">
          <h2 className="product-form-card-title">Basic Information</h2>
        </div>
        <div className="product-form-card-body">
          <div className="product-form-field">
            <label htmlFor="name" className="product-form-field-label">
              <Tag />
              Product Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={onChange}
              className="product-form-field-input"
            />
          </div>
          <div className="product-form-field">
            <label
              htmlFor="shortDescription"
              className="product-form-field-label"
            >
              Short Description
            </label>
            <Input
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription || ""}
              onChange={onChange}
              className="product-form-field-input"
            />
          </div>
          <div className="product-form-field">
            <label htmlFor="description" className="product-form-field-label">
              Full Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={onChange}
              rows={5}
              className="product-form-field-textarea"
            />
          </div>
        </div>
      </div>

      <div className="product-form-card">
        <div className="product-form-card-header">
          <h2 className="product-form-card-title">Pricing</h2>
        </div>
        <div className="product-form-card-body">
          <div className="product-form-field-row-3">
            <div className="product-form-field">
              <label htmlFor="price" className="product-form-field-label">
                <DollarSign />
                Price
              </label>
              <div className="relative">
                <span className="product-form-price-prefix">$</span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price ?? ""}
                  onChange={(e) => onNumberChange("price", e.target.value)}
                  className="product-form-field-input product-form-price-input"
                />
              </div>
            </div>
            <div className="product-form-field">
              <label
                htmlFor="compareAtPrice"
                className="product-form-field-label"
              >
                Compare at Price
              </label>
              <div className="relative">
                <span className="product-form-price-prefix">$</span>
                <Input
                  id="compareAtPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.compareAtPrice ?? ""}
                  onChange={(e) =>
                    onNumberChange("compareAtPrice", e.target.value)
                  }
                  className="product-form-field-input product-form-price-input"
                />
              </div>
            </div>
            <div className="product-form-field">
              <label htmlFor="cost" className="product-form-field-label">
                Cost per Item
              </label>
              <div className="relative">
                <span className="product-form-price-prefix">$</span>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost ?? ""}
                  onChange={(e) => onNumberChange("cost", e.target.value)}
                  className="product-form-field-input product-form-price-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
