"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Check,
  ChevronsUpDown,
  Users,
  Briefcase,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import {
  useAccessibleTenants,
  useActiveTenant,
  type AccessibleTenant,
  type TenantType,
} from "@/lib/hooks";

import "./tenant-switcher.css";

interface TenantSwitcherProps {
  className?: string;
}

const tenantTypeConfig: Record<
  TenantType,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  AGENCY: { label: "Agency", icon: Building2 },
  CLIENT: { label: "Client", icon: Briefcase },
  SUB_CLIENT: { label: "Sub-Client", icon: Users },
};

export function TenantSwitcher({ className }: TenantSwitcherProps) {
  const router = useRouter();
  const { data: accessibleTenants, isLoading: isLoadingTenants } =
    useAccessibleTenants();
  const { activeTenant, activeTenantId, switchTenant, isLoading } =
    useActiveTenant();

  const handleTenantSwitch = React.useCallback(
    (tenant: AccessibleTenant) => {
      switchTenant(tenant.id);
      // Navigate to the tenant's workspace
      router.push(`/${tenant.id}/dashboard`);
    },
    [switchTenant, router],
  );

  // Group tenants by type
  const groupedTenants = React.useMemo(() => {
    if (!accessibleTenants) return { AGENCY: [], CLIENT: [], SUB_CLIENT: [] };

    return accessibleTenants.reduce(
      (acc, tenant) => {
        const type = tenant.tenantType || "CLIENT";
        if (!acc[type]) acc[type] = [];
        acc[type].push(tenant);
        return acc;
      },
      { AGENCY: [], CLIENT: [], SUB_CLIENT: [] } as Record<
        TenantType,
        AccessibleTenant[]
      >,
    );
  }, [accessibleTenants]);

  const currentTenantConfig = activeTenant?.tenantType
    ? tenantTypeConfig[activeTenant.tenantType]
    : tenantTypeConfig.CLIENT;

  const CurrentIcon = currentTenantConfig.icon;

  if (isLoading || isLoadingTenants) {
    return (
      <SidebarMenuButton size="lg" className={className}>
        <div className="tenant-switcher-icon tenant-switcher-icon--loading">
          <Building2 className="tenant-switcher-icon-svg" />
        </div>
        <div className="tenant-switcher-text">
          <span className="tenant-switcher-name">Loading...</span>
        </div>
      </SidebarMenuButton>
    );
  }

  if (!accessibleTenants || accessibleTenants.length === 0) {
    return (
      <SidebarMenuButton size="lg" className={className}>
        <div className="tenant-switcher-icon">
          <Building2 className="tenant-switcher-icon-svg" />
        </div>
        <div className="tenant-switcher-text">
          <span className="tenant-switcher-name">No tenants</span>
          <span className="tenant-switcher-type">Contact support</span>
        </div>
      </SidebarMenuButton>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className={`tenant-switcher-trigger ${className || ""}`}
        >
          <div
            className={`tenant-switcher-icon tenant-switcher-icon--${activeTenant?.tenantType?.toLowerCase() || "client"}`}
          >
            <CurrentIcon className="tenant-switcher-icon-svg" />
          </div>
          <div className="tenant-switcher-text">
            <span className="tenant-switcher-name">
              {activeTenant?.businessName || "Select Tenant"}
            </span>
            <span className="tenant-switcher-type">
              {currentTenantConfig.label}
            </span>
          </div>
          <ChevronsUpDown className="tenant-switcher-chevron" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="tenant-switcher-content"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        {/* Agency tenants */}
        {groupedTenants.AGENCY.length > 0 && (
          <DropdownMenuGroup>
            <DropdownMenuLabel className="tenant-switcher-group-label">
              <Building2 className="tenant-switcher-group-icon" />
              Agency
            </DropdownMenuLabel>
            {groupedTenants.AGENCY.map((tenant) => (
              <TenantMenuItem
                key={tenant.id}
                tenant={tenant}
                isActive={tenant.id === activeTenantId}
                onClick={() => handleTenantSwitch(tenant)}
              />
            ))}
          </DropdownMenuGroup>
        )}

        {/* Client tenants */}
        {groupedTenants.CLIENT.length > 0 && (
          <>
            {groupedTenants.AGENCY.length > 0 && <DropdownMenuSeparator />}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="tenant-switcher-group-label">
                <Briefcase className="tenant-switcher-group-icon" />
                Clients
              </DropdownMenuLabel>
              {groupedTenants.CLIENT.map((tenant) => (
                <TenantMenuItem
                  key={tenant.id}
                  tenant={tenant}
                  isActive={tenant.id === activeTenantId}
                  onClick={() => handleTenantSwitch(tenant)}
                />
              ))}
            </DropdownMenuGroup>
          </>
        )}

        {/* Sub-client tenants */}
        {groupedTenants.SUB_CLIENT.length > 0 && (
          <>
            {(groupedTenants.AGENCY.length > 0 ||
              groupedTenants.CLIENT.length > 0) && <DropdownMenuSeparator />}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="tenant-switcher-group-label">
                <Users className="tenant-switcher-group-icon" />
                Sub-Clients
              </DropdownMenuLabel>
              {groupedTenants.SUB_CLIENT.map((tenant) => (
                <TenantMenuItem
                  key={tenant.id}
                  tenant={tenant}
                  isActive={tenant.id === activeTenantId}
                  onClick={() => handleTenantSwitch(tenant)}
                />
              ))}
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface TenantMenuItemProps {
  tenant: AccessibleTenant;
  isActive: boolean;
  onClick: () => void;
}

function TenantMenuItem({ tenant, isActive, onClick }: TenantMenuItemProps) {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className={`tenant-switcher-item ${isActive ? "tenant-switcher-item--active" : ""}`}
    >
      <span className="tenant-switcher-item-name">{tenant.businessName}</span>
      <span className="tenant-switcher-item-meta">
        <span
          className={`tenant-switcher-item-access tenant-switcher-item-access--${tenant.accessType}`}
        >
          {tenant.accessType === "member"
            ? tenant.role
            : tenant.accessType === "assigned"
              ? "Assigned"
              : "Admin"}
        </span>
        {isActive && <Check className="tenant-switcher-item-check" />}
      </span>
    </DropdownMenuItem>
  );
}

export default TenantSwitcher;
