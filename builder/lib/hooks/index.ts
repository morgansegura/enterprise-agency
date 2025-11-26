/**
 * Centralized export for all admin hooks
 *
 * Usage:
 * import { useAdminUsers, useCreateUser, useTenantFeatures } from '@/lib/hooks'
 */

// Query keys
export { queryKeys } from "./query-keys";

// Admin Users
export {
  useAdminUsers,
  useSearchUsers,
  useAdminUser,
  useCreateUser,
  useInviteUser,
  useUpdateUser,
  useDeleteUser,
} from "./use-admin-users";

export type {
  CreateUserDto,
  InviteUserDto,
  UpdateUserDto,
} from "./use-admin-users";

// Features
export {
  useAvailableFeatures,
  useTenantFeatures,
  useUpdateFeatures,
  useToggleFeature,
} from "./use-features";

export type { FeatureDefinition, EnabledFeatures } from "./use-features";

// Projects
export {
  useProjectAssignments,
  useProjectAssignment,
  useCreateAssignment,
  useUpdateAssignment,
  useDeleteAssignment,
} from "./use-projects";

export type {
  CreateProjectAssignmentDto,
  UpdateProjectAssignmentDto,
  ProjectAssignmentFilters,
} from "./use-projects";

// Tenants (Admin)
export {
  useAdminTenants,
  useTenantStats,
  useTenantActivity,
} from "./use-admin-tenants";

export type {
  TenantStats,
  TenantActivity,
  TenantWithStats,
} from "./use-admin-tenants";

// Regular Tenants (Non-Admin)
export {
  useTenants,
  useTenant,
  useCreateTenant,
  useUpdateTenant,
  useDeleteTenant,
} from "./use-tenants";

export type { Tenant, TenantTier } from "./use-tenants";

// Tier Management
export {
  useTier,
  useIsBuilder,
  useIsContentEditor,
  useHasTier,
} from "./use-tier";

// Tenant Design Tokens
export { useTenantTokens, useUpdateTenantTokens } from "./use-tenant-tokens";

export type { TenantTokens } from "./use-tenant-tokens";
