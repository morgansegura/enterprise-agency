import { Permission } from './permissions.enum';

export const TenantRole = {
  SUPERADMIN: 'SUPERADMIN',
  AGENCY_ADMIN: 'AGENCY_ADMIN',
  AGENCY_EDITOR: 'AGENCY_EDITOR',
  CLIENT_ADMIN: 'CLIENT_ADMIN',
  CLIENT_EDITOR: 'CLIENT_EDITOR',
  SUB_CLIENT: 'SUB_CLIENT',
} as const;

export type TenantRole = (typeof TenantRole)[keyof typeof TenantRole];

/**
 * Maps each role to its default permissions.
 * Custom per-user permissions can extend these via TenantUser.permissions JSON field.
 */
export const ROLE_PERMISSIONS: Record<TenantRole, Permission[]> = {
  [TenantRole.SUPERADMIN]: Object.values(Permission),

  [TenantRole.AGENCY_ADMIN]: [
    // Media — full
    Permission.MEDIA_VIEW, Permission.MEDIA_UPLOAD, Permission.MEDIA_EDIT, Permission.MEDIA_DELETE,
    // Pages — full
    Permission.PAGES_VIEW, Permission.PAGES_CREATE, Permission.PAGES_EDIT, Permission.PAGES_DELETE, Permission.PAGES_PUBLISH,
    // Blog — full
    Permission.BLOG_VIEW, Permission.BLOG_CREATE, Permission.BLOG_EDIT, Permission.BLOG_DELETE, Permission.BLOG_PUBLISH,
    // Leads — full
    Permission.LEADS_VIEW, Permission.LEADS_CREATE, Permission.LEADS_EDIT, Permission.LEADS_DELETE, Permission.LEADS_EXPORT,
    // Users — full
    Permission.USERS_VIEW, Permission.USERS_INVITE, Permission.USERS_EDIT, Permission.USERS_DELETE,
    // Tenants — no delete
    Permission.TENANTS_VIEW, Permission.TENANTS_CREATE, Permission.TENANTS_EDIT,
    // Settings — full
    Permission.SETTINGS_VIEW, Permission.SETTINGS_EDIT,
    // Analytics — full
    Permission.ANALYTICS_VIEW, Permission.ANALYTICS_EXPORT,
    // Audit
    Permission.AUDIT_VIEW,
    // SEO — full
    Permission.SEO_VIEW, Permission.SEO_EDIT,
    // Portal — full
    Permission.PORTAL_VIEW, Permission.PORTAL_DOCUMENTS,
    // Site Builder — full
    Permission.HEADERS_VIEW, Permission.HEADERS_CREATE, Permission.HEADERS_EDIT, Permission.HEADERS_DELETE,
    Permission.FOOTERS_VIEW, Permission.FOOTERS_CREATE, Permission.FOOTERS_EDIT, Permission.FOOTERS_DELETE,
    Permission.MENUS_VIEW, Permission.MENUS_CREATE, Permission.MENUS_EDIT, Permission.MENUS_DELETE,
    Permission.LIBRARY_VIEW, Permission.LIBRARY_CREATE, Permission.LIBRARY_EDIT, Permission.LIBRARY_DELETE,
    // E-commerce — full
    Permission.PRODUCTS_VIEW, Permission.PRODUCTS_CREATE, Permission.PRODUCTS_EDIT, Permission.PRODUCTS_DELETE,
    Permission.CATEGORIES_VIEW, Permission.CATEGORIES_CREATE, Permission.CATEGORIES_EDIT, Permission.CATEGORIES_DELETE,
    Permission.ORDERS_VIEW, Permission.ORDERS_CREATE, Permission.ORDERS_EDIT, Permission.ORDERS_DELETE, Permission.ORDERS_FULFILL, Permission.ORDERS_REFUND,
    Permission.CUSTOMERS_VIEW, Permission.CUSTOMERS_CREATE, Permission.CUSTOMERS_EDIT, Permission.CUSTOMERS_DELETE,
    // Webhooks — full
    Permission.WEBHOOKS_VIEW, Permission.WEBHOOKS_CREATE, Permission.WEBHOOKS_EDIT, Permission.WEBHOOKS_DELETE,
  ],

  [TenantRole.AGENCY_EDITOR]: [
    // Media — no delete
    Permission.MEDIA_VIEW, Permission.MEDIA_UPLOAD, Permission.MEDIA_EDIT,
    // Pages — no delete
    Permission.PAGES_VIEW, Permission.PAGES_CREATE, Permission.PAGES_EDIT, Permission.PAGES_PUBLISH,
    // Blog — no delete
    Permission.BLOG_VIEW, Permission.BLOG_CREATE, Permission.BLOG_EDIT, Permission.BLOG_PUBLISH,
    // Leads — view/create
    Permission.LEADS_VIEW, Permission.LEADS_CREATE,
    // SEO — full
    Permission.SEO_VIEW, Permission.SEO_EDIT,
    // Site Builder — no delete
    Permission.HEADERS_VIEW, Permission.HEADERS_CREATE, Permission.HEADERS_EDIT,
    Permission.FOOTERS_VIEW, Permission.FOOTERS_CREATE, Permission.FOOTERS_EDIT,
    Permission.MENUS_VIEW, Permission.MENUS_CREATE, Permission.MENUS_EDIT,
    Permission.LIBRARY_VIEW, Permission.LIBRARY_CREATE, Permission.LIBRARY_EDIT,
    // E-commerce — view/edit, no delete, no refunds
    Permission.PRODUCTS_VIEW, Permission.PRODUCTS_CREATE, Permission.PRODUCTS_EDIT,
    Permission.CATEGORIES_VIEW, Permission.CATEGORIES_CREATE, Permission.CATEGORIES_EDIT,
    Permission.ORDERS_VIEW, Permission.ORDERS_EDIT, Permission.ORDERS_FULFILL,
    Permission.CUSTOMERS_VIEW, Permission.CUSTOMERS_CREATE, Permission.CUSTOMERS_EDIT,
  ],

  [TenantRole.CLIENT_ADMIN]: [
    // Media — full
    Permission.MEDIA_VIEW, Permission.MEDIA_UPLOAD, Permission.MEDIA_EDIT, Permission.MEDIA_DELETE,
    // Pages — full
    Permission.PAGES_VIEW, Permission.PAGES_CREATE, Permission.PAGES_EDIT, Permission.PAGES_DELETE, Permission.PAGES_PUBLISH,
    // Blog — full
    Permission.BLOG_VIEW, Permission.BLOG_CREATE, Permission.BLOG_EDIT, Permission.BLOG_DELETE, Permission.BLOG_PUBLISH,
    // Leads — full
    Permission.LEADS_VIEW, Permission.LEADS_CREATE, Permission.LEADS_EDIT, Permission.LEADS_DELETE, Permission.LEADS_EXPORT,
    // Users — no delete
    Permission.USERS_VIEW, Permission.USERS_INVITE, Permission.USERS_EDIT,
    // Settings — full
    Permission.SETTINGS_VIEW, Permission.SETTINGS_EDIT,
    // Analytics — view
    Permission.ANALYTICS_VIEW,
    // SEO — full
    Permission.SEO_VIEW, Permission.SEO_EDIT,
    // Portal — full
    Permission.PORTAL_VIEW, Permission.PORTAL_DOCUMENTS,
    // Site Builder — full
    Permission.HEADERS_VIEW, Permission.HEADERS_CREATE, Permission.HEADERS_EDIT, Permission.HEADERS_DELETE,
    Permission.FOOTERS_VIEW, Permission.FOOTERS_CREATE, Permission.FOOTERS_EDIT, Permission.FOOTERS_DELETE,
    Permission.MENUS_VIEW, Permission.MENUS_CREATE, Permission.MENUS_EDIT, Permission.MENUS_DELETE,
    Permission.LIBRARY_VIEW, Permission.LIBRARY_CREATE, Permission.LIBRARY_EDIT, Permission.LIBRARY_DELETE,
    // E-commerce — full
    Permission.PRODUCTS_VIEW, Permission.PRODUCTS_CREATE, Permission.PRODUCTS_EDIT, Permission.PRODUCTS_DELETE,
    Permission.CATEGORIES_VIEW, Permission.CATEGORIES_CREATE, Permission.CATEGORIES_EDIT, Permission.CATEGORIES_DELETE,
    Permission.ORDERS_VIEW, Permission.ORDERS_CREATE, Permission.ORDERS_EDIT, Permission.ORDERS_FULFILL, Permission.ORDERS_REFUND,
    Permission.CUSTOMERS_VIEW, Permission.CUSTOMERS_CREATE, Permission.CUSTOMERS_EDIT, Permission.CUSTOMERS_DELETE,
    // Webhooks — full
    Permission.WEBHOOKS_VIEW, Permission.WEBHOOKS_CREATE, Permission.WEBHOOKS_EDIT, Permission.WEBHOOKS_DELETE,
  ],

  [TenantRole.CLIENT_EDITOR]: [
    // Media — full
    Permission.MEDIA_VIEW, Permission.MEDIA_UPLOAD, Permission.MEDIA_EDIT, Permission.MEDIA_DELETE,
    // Pages — full
    Permission.PAGES_VIEW, Permission.PAGES_CREATE, Permission.PAGES_EDIT, Permission.PAGES_DELETE, Permission.PAGES_PUBLISH,
    // Blog — full
    Permission.BLOG_VIEW, Permission.BLOG_CREATE, Permission.BLOG_EDIT, Permission.BLOG_DELETE, Permission.BLOG_PUBLISH,
    // Leads — view/create
    Permission.LEADS_VIEW, Permission.LEADS_CREATE,
    // SEO — full
    Permission.SEO_VIEW, Permission.SEO_EDIT,
    // Site Builder — full
    Permission.HEADERS_VIEW, Permission.HEADERS_CREATE, Permission.HEADERS_EDIT, Permission.HEADERS_DELETE,
    Permission.FOOTERS_VIEW, Permission.FOOTERS_CREATE, Permission.FOOTERS_EDIT, Permission.FOOTERS_DELETE,
    Permission.MENUS_VIEW, Permission.MENUS_CREATE, Permission.MENUS_EDIT, Permission.MENUS_DELETE,
    Permission.LIBRARY_VIEW, Permission.LIBRARY_CREATE, Permission.LIBRARY_EDIT, Permission.LIBRARY_DELETE,
    // E-commerce — content only
    Permission.PRODUCTS_VIEW, Permission.PRODUCTS_CREATE, Permission.PRODUCTS_EDIT, Permission.PRODUCTS_DELETE,
    Permission.CATEGORIES_VIEW, Permission.CATEGORIES_CREATE, Permission.CATEGORIES_EDIT, Permission.CATEGORIES_DELETE,
    Permission.ORDERS_VIEW, Permission.ORDERS_FULFILL,
    Permission.CUSTOMERS_VIEW,
  ],

  [TenantRole.SUB_CLIENT]: [
    Permission.PORTAL_VIEW,
    Permission.PORTAL_DOCUMENTS,
    Permission.MEDIA_VIEW,
  ],
};

export function getRoleLevel(role: TenantRole): number {
  const levels: Record<TenantRole, number> = {
    [TenantRole.SUPERADMIN]: 100,
    [TenantRole.AGENCY_ADMIN]: 80,
    [TenantRole.AGENCY_EDITOR]: 60,
    [TenantRole.CLIENT_ADMIN]: 50,
    [TenantRole.CLIENT_EDITOR]: 40,
    [TenantRole.SUB_CLIENT]: 10,
  };
  return levels[role] ?? 0;
}

export function canManageRole(managerRole: TenantRole, targetRole: TenantRole): boolean {
  if (managerRole === TenantRole.SUPERADMIN) return true;

  if (
    managerRole === TenantRole.AGENCY_ADMIN &&
    (targetRole === TenantRole.CLIENT_ADMIN ||
      targetRole === TenantRole.CLIENT_EDITOR ||
      targetRole === TenantRole.SUB_CLIENT)
  ) {
    return true;
  }

  if (
    managerRole === TenantRole.CLIENT_ADMIN &&
    (targetRole === TenantRole.CLIENT_EDITOR || targetRole === TenantRole.SUB_CLIENT)
  ) {
    return true;
  }

  return false;
}
