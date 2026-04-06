import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, PlusCircle, Trash2, Star } from "lucide-react";
import type { CreateCustomerAddressDto, CustomerAddress } from "@/lib/hooks";

import "./customer-addresses.css";

interface CustomerAddressesProps {
  addresses: CustomerAddress[] | undefined;
  showAddForm: boolean;
  onToggleAddForm: () => void;
  newAddress: CreateCustomerAddressDto;
  onNewAddressChange: (address: CreateCustomerAddressDto) => void;
  onAddAddress: () => void;
  onDeleteAddress: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
  isAddPending: boolean;
}

export function CustomerAddresses({
  addresses,
  showAddForm,
  onToggleAddForm,
  newAddress,
  onNewAddressChange,
  onAddAddress,
  onDeleteAddress,
  onSetDefault,
  isAddPending,
}: CustomerAddressesProps) {
  return (
    <div className="customer-detail-card">
      <div className="customer-detail-card-header">
        <h2 className="customer-detail-card-title">
          <MapPin className="inline h-4 w-4 mr-1.5" />
          Addresses
        </h2>
        <Button size="sm" variant="outline" onClick={onToggleAddForm}>
          <PlusCircle className="h-4 w-4" />
          Add Address
        </Button>
      </div>
      <div className="customer-detail-card-body">
        {/* Add address form */}
        {showAddForm && (
          <div className="customer-address-card">
            <div className="customer-addresses-field-row">
              <div className="customer-addresses-field">
                <label className="customer-addresses-field-label">
                  First Name
                </label>
                <Input
                  value={newAddress.firstName}
                  onChange={(e) =>
                    onNewAddressChange({
                      ...newAddress,
                      firstName: e.target.value,
                    })
                  }
                  className="customer-addresses-field-input"
                />
              </div>
              <div className="customer-addresses-field">
                <label className="customer-addresses-field-label">
                  Last Name
                </label>
                <Input
                  value={newAddress.lastName}
                  onChange={(e) =>
                    onNewAddressChange({
                      ...newAddress,
                      lastName: e.target.value,
                    })
                  }
                  className="customer-addresses-field-input"
                />
              </div>
            </div>
            <div className="customer-addresses-field">
              <label className="customer-addresses-field-label">Address</label>
              <Input
                value={newAddress.address1}
                onChange={(e) =>
                  onNewAddressChange({
                    ...newAddress,
                    address1: e.target.value,
                  })
                }
                placeholder="Street address"
                className="customer-addresses-field-input"
              />
            </div>
            <div className="customer-addresses-field-row">
              <div className="customer-addresses-field">
                <label className="customer-addresses-field-label">City</label>
                <Input
                  value={newAddress.city}
                  onChange={(e) =>
                    onNewAddressChange({
                      ...newAddress,
                      city: e.target.value,
                    })
                  }
                  className="customer-addresses-field-input"
                />
              </div>
              <div className="customer-addresses-field">
                <label className="customer-addresses-field-label">
                  State / Province
                </label>
                <Input
                  value={newAddress.province || ""}
                  onChange={(e) =>
                    onNewAddressChange({
                      ...newAddress,
                      province: e.target.value,
                    })
                  }
                  className="customer-addresses-field-input"
                />
              </div>
            </div>
            <div className="customer-addresses-field-row">
              <div className="customer-addresses-field">
                <label className="customer-addresses-field-label">
                  Postal Code
                </label>
                <Input
                  value={newAddress.postalCode}
                  onChange={(e) =>
                    onNewAddressChange({
                      ...newAddress,
                      postalCode: e.target.value,
                    })
                  }
                  className="customer-addresses-field-input"
                />
              </div>
              <div className="customer-addresses-field">
                <label className="customer-addresses-field-label">
                  Country
                </label>
                <Input
                  value={newAddress.country}
                  onChange={(e) =>
                    onNewAddressChange({
                      ...newAddress,
                      country: e.target.value,
                    })
                  }
                  className="customer-addresses-field-input"
                />
              </div>
            </div>
            <div className="customer-addresses-field-row">
              <Button size="sm" onClick={onAddAddress} disabled={isAddPending}>
                {isAddPending ? "Adding..." : "Add Address"}
              </Button>
              <Button size="sm" variant="outline" onClick={onToggleAddForm}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Address list */}
        {!addresses || addresses.length === 0 ? (
          <div className="customer-addresses-empty">
            <p>No addresses saved</p>
          </div>
        ) : (
          <div className="customer-addresses-list">
            {addresses.map((address: CustomerAddress) => (
              <div
                key={address.id}
                className={`customer-address-card ${address.isDefault ? "customer-address-card-default" : ""}`}
              >
                <div className="customer-address-card-header">
                  <div>
                    {address.isDefault && (
                      <span className="customer-address-default-badge">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="customer-address-actions">
                    {!address.isDefault && (
                      <button
                        type="button"
                        className="customer-address-action"
                        onClick={() => onSetDefault(address.id)}
                        title="Set as default"
                      >
                        <Star />
                      </button>
                    )}
                    <button
                      type="button"
                      className="customer-address-action customer-address-action-danger"
                      onClick={() => onDeleteAddress(address.id)}
                      title="Delete address"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
                <div className="customer-address-name">
                  {address.firstName} {address.lastName}
                </div>
                <div className="customer-address-line">{address.address1}</div>
                {address.address2 && (
                  <div className="customer-address-line">
                    {address.address2}
                  </div>
                )}
                <div className="customer-address-line">
                  {address.city}, {address.province} {address.postalCode}
                </div>
                <div className="customer-address-line">{address.country}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
