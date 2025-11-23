/**
 * Centralized export for all Zustand stores
 *
 * Usage:
 * import { useAuthStore, useAdminStore, useUIStore } from '@/lib/stores'
 */

// Auth
export { useAuthStore } from "./auth-store";

// Tenants
export { useTenantsStore } from "./tenants-store";

// UI
export { useUIStore } from "./ui-store";

// Admin
export { useAdminStore } from "./admin-store";
export type { User, ProjectAssignment, AdminFilters } from "./admin-store";
