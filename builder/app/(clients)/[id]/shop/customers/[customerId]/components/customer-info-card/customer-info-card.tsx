import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { User, Mail, Phone } from "lucide-react";
import type { UpdateCustomerDto } from "@/lib/hooks";

import "./customer-info-card.css";

interface CustomerInfoCardProps {
  formData: UpdateCustomerDto;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onToggleMarketing: (checked: boolean) => void;
}

export function CustomerInfoCard({
  formData,
  onChange,
  onToggleMarketing,
}: CustomerInfoCardProps) {
  return (
    <div className="customer-detail-card">
      <div className="customer-detail-card-header">
        <h2 className="customer-detail-card-title">Customer Information</h2>
      </div>
      <div className="customer-detail-card-body">
        <div className="customer-info-field-row">
          <div className="customer-info-field">
            <label htmlFor="firstName" className="customer-info-field-label">
              <User />
              First Name
            </label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName || ""}
              onChange={onChange}
              className="customer-info-field-input"
            />
          </div>
          <div className="customer-info-field">
            <label htmlFor="lastName" className="customer-info-field-label">
              Last Name
            </label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName || ""}
              onChange={onChange}
              className="customer-info-field-input"
            />
          </div>
        </div>
        <div className="customer-info-field-row">
          <div className="customer-info-field">
            <label htmlFor="email" className="customer-info-field-label">
              <Mail />
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={onChange}
              className="customer-info-field-input"
            />
          </div>
          <div className="customer-info-field">
            <label htmlFor="phone" className="customer-info-field-label">
              <Phone />
              Phone
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone || ""}
              onChange={onChange}
              className="customer-info-field-input"
            />
          </div>
        </div>
        <div className="customer-info-field">
          <label htmlFor="note" className="customer-info-field-label">
            Notes
          </label>
          <Textarea
            id="note"
            name="note"
            value={formData.note || ""}
            onChange={onChange}
            rows={3}
            placeholder="Internal notes about this customer..."
          />
        </div>
        <div className="customer-info-toggle-row">
          <div className="customer-info-toggle-info">
            <div className="customer-info-toggle-label">Accepts Marketing</div>
            <div className="customer-info-toggle-description">
              Customer has opted in to receive marketing emails
            </div>
          </div>
          <Switch
            checked={formData.acceptsMarketing ?? false}
            onCheckedChange={onToggleMarketing}
          />
        </div>
      </div>
    </div>
  );
}
