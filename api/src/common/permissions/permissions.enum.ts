/**
 * Atomic permissions for the enterprise permission system.
 * Format: resource:action
 */
export enum Permission {
  // Media
  MEDIA_VIEW = "media:view",
  MEDIA_UPLOAD = "media:upload",
  MEDIA_EDIT = "media:edit",
  MEDIA_DELETE = "media:delete",

  // Pages
  PAGES_VIEW = "pages:view",
  PAGES_CREATE = "pages:create",
  PAGES_EDIT = "pages:edit",
  PAGES_DELETE = "pages:delete",
  PAGES_PUBLISH = "pages:publish",

  // Blog
  BLOG_VIEW = "blog:view",
  BLOG_CREATE = "blog:create",
  BLOG_EDIT = "blog:edit",
  BLOG_DELETE = "blog:delete",
  BLOG_PUBLISH = "blog:publish",

  // Leads
  LEADS_VIEW = "leads:view",
  LEADS_CREATE = "leads:create",
  LEADS_EDIT = "leads:edit",
  LEADS_DELETE = "leads:delete",
  LEADS_EXPORT = "leads:export",

  // User Management
  USERS_VIEW = "users:view",
  USERS_INVITE = "users:invite",
  USERS_EDIT = "users:edit",
  USERS_DELETE = "users:delete",

  // Tenant Management
  TENANTS_VIEW = "tenants:view",
  TENANTS_CREATE = "tenants:create",
  TENANTS_EDIT = "tenants:edit",
  TENANTS_DELETE = "tenants:delete",

  // Settings
  SETTINGS_VIEW = "settings:view",
  SETTINGS_EDIT = "settings:edit",

  // Portal (sub-clients)
  PORTAL_VIEW = "portal:view",
  PORTAL_DOCUMENTS = "portal:documents",

  // Analytics
  ANALYTICS_VIEW = "analytics:view",
  ANALYTICS_EXPORT = "analytics:export",

  // Audit Log
  AUDIT_VIEW = "audit:view",

  // SEO
  SEO_VIEW = "seo:view",
  SEO_EDIT = "seo:edit",

  // Site Builder: Headers
  HEADERS_VIEW = "headers:view",
  HEADERS_CREATE = "headers:create",
  HEADERS_EDIT = "headers:edit",
  HEADERS_DELETE = "headers:delete",

  // Site Builder: Footers
  FOOTERS_VIEW = "footers:view",
  FOOTERS_CREATE = "footers:create",
  FOOTERS_EDIT = "footers:edit",
  FOOTERS_DELETE = "footers:delete",

  // Site Builder: Menus
  MENUS_VIEW = "menus:view",
  MENUS_CREATE = "menus:create",
  MENUS_EDIT = "menus:edit",
  MENUS_DELETE = "menus:delete",

  // Library (reusable components)
  LIBRARY_VIEW = "library:view",
  LIBRARY_CREATE = "library:create",
  LIBRARY_EDIT = "library:edit",
  LIBRARY_DELETE = "library:delete",

  // E-Commerce: Products
  PRODUCTS_VIEW = "products:view",
  PRODUCTS_CREATE = "products:create",
  PRODUCTS_EDIT = "products:edit",
  PRODUCTS_DELETE = "products:delete",

  // E-Commerce: Categories
  CATEGORIES_VIEW = "categories:view",
  CATEGORIES_CREATE = "categories:create",
  CATEGORIES_EDIT = "categories:edit",
  CATEGORIES_DELETE = "categories:delete",

  // E-Commerce: Orders
  ORDERS_VIEW = "orders:view",
  ORDERS_CREATE = "orders:create",
  ORDERS_EDIT = "orders:edit",
  ORDERS_DELETE = "orders:delete",
  ORDERS_FULFILL = "orders:fulfill",
  ORDERS_REFUND = "orders:refund",

  // E-Commerce: Customers
  CUSTOMERS_VIEW = "customers:view",
  CUSTOMERS_CREATE = "customers:create",
  CUSTOMERS_EDIT = "customers:edit",
  CUSTOMERS_DELETE = "customers:delete",

  // Webhooks
  WEBHOOKS_VIEW = "webhooks:view",
  WEBHOOKS_CREATE = "webhooks:create",
  WEBHOOKS_EDIT = "webhooks:edit",
  WEBHOOKS_DELETE = "webhooks:delete",
}
