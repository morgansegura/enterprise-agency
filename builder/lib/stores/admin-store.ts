import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isSuperAdmin: boolean;
  agencyRole: "owner" | "admin" | "developer" | "designer" | "content_manager";
  status: "active" | "inactive" | "pending";
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectAssignment {
  id: string;
  userId: string;
  tenantId: string;
  role: "owner" | "admin" | "developer" | "designer" | "content_manager";
  permissions: Record<string, any>;
  status: "active" | "inactive";
  createdAt: string;
  user?: User;
  tenant?: {
    id: string;
    slug: string;
    businessName: string;
  };
}

export interface AdminFilters {
  userRole?: string;
  tenantId?: string;
  userId?: string;
  status?: string;
}

interface AdminStore {
  // Selected entities
  selectedUser: User | null;
  selectedProject: ProjectAssignment | null;

  // Filters
  filters: AdminFilters;

  // Bulk selection
  bulkSelection: string[];

  // Actions
  selectUser: (user: User | null) => void;
  selectProject: (project: ProjectAssignment | null) => void;
  setFilters: (filters: Partial<AdminFilters>) => void;
  clearFilters: () => void;
  toggleBulkSelect: (id: string) => void;
  clearBulkSelection: () => void;
  selectAll: (ids: string[]) => void;
}

export const useAdminStore = create<AdminStore>()(
  devtools(
    (set) => ({
      // Initial state
      selectedUser: null,
      selectedProject: null,
      filters: {},
      bulkSelection: [],

      // Actions
      selectUser: (user) => set({ selectedUser: user }, false, "selectUser"),

      selectProject: (project) =>
        set({ selectedProject: project }, false, "selectProject"),

      setFilters: (filters) =>
        set(
          (state) => ({
            filters: { ...state.filters, ...filters },
          }),
          false,
          "setFilters",
        ),

      clearFilters: () => set({ filters: {} }, false, "clearFilters"),

      toggleBulkSelect: (id) =>
        set(
          (state) => ({
            bulkSelection: state.bulkSelection.includes(id)
              ? state.bulkSelection.filter((i) => i !== id)
              : [...state.bulkSelection, id],
          }),
          false,
          "toggleBulkSelect",
        ),

      clearBulkSelection: () =>
        set({ bulkSelection: [] }, false, "clearBulkSelection"),

      selectAll: (ids) => set({ bulkSelection: ids }, false, "selectAll"),
    }),
    { name: "AdminStore" },
  ),
);
