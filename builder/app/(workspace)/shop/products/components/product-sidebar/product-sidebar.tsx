import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import "./product-sidebar.css";

interface ProductCategory {
  id: string;
  name: string;
}

interface ProductSidebarProps {
  formData: {
    status?: string;
    categoryId?: string;
    featured?: boolean;
  };
  categories: ProductCategory[];
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onFeaturedChange: (checked: boolean) => void;
}

export function ProductSidebar({
  formData,
  categories,
  onStatusChange,
  onCategoryChange,
  onFeaturedChange,
}: ProductSidebarProps) {
  return (
    <>
      {/* Status */}
      <div className="product-form-card">
        <div className="product-form-card-header">
          <h2 className="product-form-card-title">Status</h2>
        </div>
        <div className="product-form-card-body">
          <Select value={formData.status} onValueChange={onStatusChange}>
            <SelectTrigger className="product-form-status-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">
                <span className="product-form-status-pill product-form-status-draft">
                  Draft
                </span>
              </SelectItem>
              <SelectItem value="active">
                <span className="product-form-status-pill product-form-status-active">
                  Active
                </span>
              </SelectItem>
              <SelectItem value="archived">
                <span className="product-form-status-pill product-form-status-archived">
                  Archived
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="product-form-field-hint">
            Only active products are visible in the storefront
          </p>
        </div>
      </div>

      {/* Category */}
      <div className="product-form-card">
        <div className="product-form-card-header">
          <h2 className="product-form-card-title">Category</h2>
        </div>
        <div className="product-form-card-body">
          <Select
            value={formData.categoryId || "none"}
            onValueChange={onCategoryChange}
          >
            <SelectTrigger className="product-form-status-select">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Category</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Featured */}
      <div className="product-form-card">
        <div className="product-form-card-header">
          <h2 className="product-form-card-title">Visibility</h2>
        </div>
        <div className="product-form-card-body">
          <div className="product-form-featured-toggle">
            <span className="product-form-toggle-label">Featured Product</span>
            <Switch
              checked={formData.featured ?? false}
              onCheckedChange={onFeaturedChange}
            />
          </div>
          <p className="product-form-field-hint">
            Featured products appear in highlighted sections
          </p>
        </div>
      </div>
    </>
  );
}
