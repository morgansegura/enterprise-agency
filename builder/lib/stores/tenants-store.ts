import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Tenant {
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
}

interface TenantsState {
  tenants: Tenant[];
  selectedTenant: Tenant | null;
  isLoading: boolean;
}

interface TenantsActions {
  setTenants: (tenants: Tenant[]) => void;
  addTenant: (tenant: Tenant) => void;
  updateTenant: (id: string, updates: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  selectTenant: (tenant: Tenant | null) => void;
  setLoading: (isLoading: boolean) => void;
}

type TenantsStore = TenantsState & TenantsActions;

const initialState: TenantsState = {
  tenants: [],
  selectedTenant: null,
  isLoading: false,
};

export const useTenantsStore = create<TenantsStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setTenants: (tenants) => set({ tenants }, false, "tenants/setTenants"),

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
          }),
          false,
          "tenants/updateTenant",
        ),

      deleteTenant: (id) =>
        set(
          (state) => ({
            tenants: state.tenants.filter((t) => t.id !== id),
            selectedTenant:
              state.selectedTenant?.id === id ? null : state.selectedTenant,
          }),
          false,
          "tenants/deleteTenant",
        ),

      selectTenant: (tenant) =>
        set({ selectedTenant: tenant }, false, "tenants/selectTenant"),

      setLoading: (isLoading) =>
        set({ isLoading }, false, "tenants/setLoading"),
    }),
    { name: "TenantsStore" },
  ),
);
