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
  // Tenant hierarchy
  useAgencyTenant,
  useAccessibleTenants,
  useTenantsByType,
  useChildTenants,
  useTenantHierarchy,
  useTenantAccess,
  useActiveTenant,
} from "./use-tenants";

export type {
  Tenant,
  TenantTier,
  TenantType,
  ClientType,
  AccessibleTenant,
  TenantHierarchy,
  TenantAccess,
} from "./use-tenants";

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

// E-Commerce: Products
export {
  useProductCategories,
  useProductCategory,
  useCreateProductCategory,
  useUpdateProductCategory,
  useDeleteProductCategory,
  useProducts,
  useProduct,
  useProductBySlug,
  useLowStockProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useArchiveProduct,
  useDuplicateProduct,
  useAdjustInventory,
  useProductVariants,
  useCreateProductVariant,
  useUpdateProductVariant,
  useDeleteProductVariant,
} from "./use-products";

export type {
  ProductCategory,
  ProductVariant,
  Product,
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
  CreateProductDto,
  UpdateProductDto,
  CreateProductVariantDto,
  UpdateProductVariantDto,
  ProductFilters,
  CategoryFilters,
} from "./use-products";

// E-Commerce: Orders
export {
  useOrders,
  useOrder,
  useOrderByNumber,
  useOrderStats,
  useCreateOrder,
  useUpdateOrder,
  useCancelOrder,
  useFulfillOrderItems,
} from "./use-orders";

export type {
  Order,
  OrderItem,
  OrderAddress,
  OrderStats,
  OrderStatus,
  PaymentStatus,
  FulfillmentStatus,
  CreateOrderDto,
  CreateOrderItemDto,
  UpdateOrderDto,
  OrderFilters,
} from "./use-orders";

// E-Commerce: Customers
export {
  useCustomers,
  useCustomer,
  useCustomerByEmail,
  useCustomerStats,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  useCustomerAddresses,
  useCustomerAddress,
  useCreateCustomerAddress,
  useUpdateCustomerAddress,
  useDeleteCustomerAddress,
  useSetDefaultAddress,
} from "./use-customers";

export type {
  Customer,
  CustomerAddress,
  CustomerStats,
  CreateCustomerDto,
  UpdateCustomerDto,
  CreateCustomerAddressDto,
  UpdateCustomerAddressDto,
  CustomerFilters,
} from "./use-customers";

// Tags (derived from posts)
export {
  useTags,
  useTagsWithCounts,
  useRenameTag,
  useDeleteTag,
} from "./use-tags";

export type { Tag } from "./use-tags";

// Pages
export {
  usePages,
  usePage,
  usePageBySlug,
  useCreatePage,
  useUpdatePage,
  useDeletePage,
  usePublishPage,
  useUnpublishPage,
  useDuplicatePage,
  // Version History
  usePageVersions,
  usePageVersion,
  useRestorePageVersion,
  useComparePageVersions,
  // Preview
  useCreatePreviewToken,
} from "./use-pages";

export type {
  Page,
  Section,
  Block,
  PageSeo,
  PageVersion,
  PageVersionFull,
  PreviewToken,
} from "./use-pages";

// Auto-Save
export { useAutoSave } from "./use-auto-save";

// E-Commerce: Payments
export {
  usePaymentConfig,
  useUpdatePaymentConfig,
  useCreateCheckout,
  useCreateRefund,
  usePaymentDetails,
  paymentKeys,
  // Legacy exports
  useStripeConfig,
  useUpdateStripeConfig,
} from "./use-payments";

export type {
  PaymentProvider,
  PaymentConfig,
  StripeProviderConfig,
  SquareProviderConfig,
  UpdateStripeConfigDto,
  UpdateSquareConfigDto,
  UpdatePaymentConfigDto,
  CheckoutLineItem,
  CreateCheckoutDto,
  CheckoutSession,
  CreateRefundDto,
  RefundResult,
  PaymentDetails,
  StripePaymentDetails,
  SquarePaymentDetails,
  ProviderDetails,
} from "./use-payments";
