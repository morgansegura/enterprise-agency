import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Tenant type hierarchy
export type TenantType = "AGENCY" | "CLIENT" | "SUB_CLIENT";
export type ClientType = "BUSINESS" | "INDIVIDUAL";

// Access type for tenant switcher
export type TenantAccessType = "member" | "assigned" | "superadmin";

interface ParentTenant {
  id: string;
  slug: string;
  businessName: string;
  tenantType: TenantType;
}

interface ChildTenant {
  id: string;
  slug: string;
  businessName: string;
  tenantType: TenantType;
  clientType?: ClientType | null;
  status: string;
}

export interface Tenant {
  id: string;
  slug: string;
  businessName: string;
  businessType?: string;
  status: string;
  enabledFeatures: Record<string, boolean>;
  contactEmail?: string;
  contactPhone?: string;
  createdAt?: string;
  updatedAt?: string;
  // Hierarchy fields
  parentTenantId?: string | null;
  tenantType: TenantType;
  clientType?: ClientType | null;
  parent?: ParentTenant | null;
  children?: ChildTenant[];
  _count?: {
    children?: number;
    pages?: number;
    posts?: number;
    assets?: number;
  };
}

// Tenant with access info for the tenant switcher
export interface AccessibleTenant extends Tenant {
  accessType: TenantAccessType;
  role: string;
}

interface TenantsState {
  // All tenants (for admin views)
  tenants: Tenant[];
  // Tenants the current user can access (for tenant switcher)
  accessibleTenants: AccessibleTenant[];
  // Currently selected tenant for viewing/editing in admin
  selectedTenant: Tenant | null;
  // Active tenant context (the tenant the user is currently working in)
  activeTenantId: string | null;
  activeTenant: Tenant | null;
  isLoading: boolean;
}

interface TenantsActions {
  setTenants: (tenants: Tenant[]) => void;
  setAccessibleTenants: (tenants: AccessibleTenant[]) => void;
  addTenant: (tenant: Tenant) => void;
  updateTenant: (id: string, updates: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  selectTenant: (tenant: Tenant | null) => void;
  setActiveTenant: (tenant: Tenant | null) => void;
  switchTenant: (tenantId: string) => void;
  setLoading: (isLoading: boolean) => void;
  // Computed getters
  getAgencyTenant: () => Tenant | undefined;
  getClientTenants: () => Tenant[];
  getSubClientTenants: (parentId: string) => Tenant[];
}

type TenantsStore = TenantsState & TenantsActions;

const initialState: TenantsState = {
  tenants: [],
  accessibleTenants: [],
  selectedTenant: null,
  activeTenantId: null,
  activeTenant: null,
  isLoading: false,
};

export const useTenantsStore = create<TenantsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setTenants: (tenants) => set({ tenants }, false, "tenants/setTenants"),

        setAccessibleTenants: (accessibleTenants) =>
          set({ accessibleTenants }, false, "tenants/setAccessibleTenants"),

        addTenant: (tenant) =>
          set(
            (state) => ({
              tenants: [...state.tenants, tenant],
            }),
            false,
            "tenants/addTenant",
          ),

        updateTenant: (id, updates) =>
          set(
            (state) => ({
              tenants: state.tenants.map((t) =>
                t.id === id ? { ...t, ...updates } : t,
              ),
              selectedTenant:
                state.selectedTenant?.id === id
                  ? { ...state.selectedTenant, ...updates }
                  : state.selectedTenant,
              activeTenant:
                state.activeTenant?.id === id
                  ? { ...state.activeTenant, ...updates }
                  : state.activeTenant,
            }),
            false,
            "tenants/updateTenant",
          ),

        deleteTenant: (id) =>
          set(
            (state) => ({
              tenants: state.tenants.filter((t) => t.id !== id),
              accessibleTenants: state.accessibleTenants.filter(
                (t) => t.id !== id,
              ),
              selectedTenant:
                state.selectedTenant?.id === id ? null : state.selectedTenant,
              activeTenant:
                state.activeTenant?.id === id ? null : state.activeTenant,
              activeTenantId:
                state.activeTenantId === id ? null : state.activeTenantId,
            }),
            false,
            "tenants/deleteTenant",
          ),

        selectTenant: (tenant) =>
          set({ selectedTenant: tenant }, false, "tenants/selectTenant"),

        setActiveTenant: (tenant) =>
          set(
            {
              activeTenant: tenant,
              activeTenantId: tenant?.id ?? null,
            },
            false,
            "tenants/setActiveTenant",
          ),

        switchTenant: (tenantId) => {
          const { accessibleTenants, tenants } = get();
          // First look in accessible tenants, then all tenants
          const tenant =
            accessibleTenants.find((t) => t.id === tenantId) ||
            tenants.find((t) => t.id === tenantId);

          if (tenant) {
            set(
              {
                activeTenant: tenant,
                activeTenantId: tenantId,
              },
              false,
              "tenants/switchTenant",
            );
          }
        },

        setLoading: (isLoading) =>
          set({ isLoading }, false, "tenants/setLoading"),

        // Computed getters
        getAgencyTenant: () => {
          const { tenants } = get();
          return tenants.find((t) => t.tenantType === "AGENCY");
        },

        getClientTenants: () => {
          const { tenants } = get();
          return tenants.filter((t) => t.tenantType === "CLIENT");
        },

        getSubClientTenants: (parentId: string) => {
          const { tenants } = get();
          return tenants.filter(
            (t) =>
              t.tenantType === "SUB_CLIENT" && t.parentTenantId === parentId,
          );
        },
      }),
      {
        name: "tenants-store",
        // Only persist the active tenant ID
        partialize: (state) => ({
          activeTenantId: state.activeTenantId,
        }),
      },
    ),
    { name: "TenantsStore" },
  ),
);
