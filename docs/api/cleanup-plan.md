# API Cleanup & Refactoring Plan

## Module Audit

### KEEP - Core CMS Functionality

**✅ auth/** - Authentication & authorization

- JWT strategy
- Login/register/refresh
- Role-based access control
- **Status:** Keep as-is, critical

**✅ tenants/** - Multi-tenant management

- Customer site management
- Theme configuration
- Feature flags
- **Status:** Keep, extend with site config

**✅ users/** - User management

- Agency users
- Customer editors
- Permissions
- **Status:** Keep as-is

**✅ pages/** - Content pages

- CRUD operations
- Block-based content
- SEO metadata
- Publish/draft workflow
- **Status:** Keep, extend with church blocks

**✅ assets/** - Media management

- File uploads
- Image optimization
- Media library
- **Status:** Keep as-is

**✅ health/** - Health checks

- API status
- Database connectivity
- **Status:** Keep as-is

**✅ webhooks/** - Integration webhooks

- Event notifications
- External integrations
- **Status:** Keep for future integrations

**✅ posts/** - Blog/news posts

- Church announcements
- Sermon notes
- News updates
- **Status:** Keep, useful for churches

---

### REMOVE - E-commerce & CRM (Not Needed)

**❌ products/** - E-commerce products

- **Reason:** Churches don't sell products via this CMS
- **Remove:** Yes

**❌ orders/** - E-commerce orders

- **Reason:** No e-commerce functionality needed
- **Remove:** Yes

**❌ cart/** - Shopping cart

- **Reason:** No e-commerce
- **Remove:** Yes

**❌ checkout/** - Checkout flow

- **Reason:** No e-commerce
- **Remove:** Yes

**❌ discount-codes/** - Coupon codes

- **Reason:** No e-commerce
- **Remove:** Yes

**❌ shipping-zones/** - Shipping configuration

- **Reason:** No e-commerce
- **Remove:** Yes

**❌ customers/** - E-commerce customers

- **Reason:** Different from users, e-commerce specific
- **Remove:** Yes

**❌ portals/** - Customer portals for file sharing

- **Reason:** Overly complex for church CMS
- **Remove:** Yes

**❌ leads/** - CRM lead management

- **Reason:** Agency-specific, not for churches
- **Remove:** Yes

**❌ projects/** - Project management

- **Reason:** Agency-specific workflow
- **Remove:** Yes

**❌ tasks/** - Task management

- **Reason:** Agency-specific workflow
- **Remove:** Yes

**❌ activities/** - Activity timeline

- **Reason:** CRM-specific feature
- **Remove:** Yes

**❌ sites/** - Unclear purpose (check before removing)

- **Reason:** Likely duplicate of tenants
- **Action:** Check implementation first

**❌ themes/** - Theme management (check before removing)

- **Reason:** Theme config is in Tenant model
- **Action:** Check if actually used

---

## Removal Steps

### Phase 1: Remove Module Directories

```bash
cd api/src/modules/
rm -rf products orders cart checkout discount-codes shipping-zones
rm -rf customers portals leads projects tasks activities
```

### Phase 2: Remove from app.module.ts

- Remove imports
- Remove from imports array
- Clean up dependencies

### Phase 3: Clean Prisma Schema

- Remove unused models
- Remove unused relations
- Create migration

### Phase 4: Remove Dependencies

- Check package.json for e-commerce specific deps
- Remove if unused elsewhere

---

## What We're Building

### NEW: site-config Module

**Purpose:** Centralized configuration per tenant

**Endpoints:**

```typescript
GET    /api/tenants/:tenantId/config
PUT    /api/tenants/:tenantId/config
GET    /api/tenants/:tenantId/config/header
PUT    /api/tenants/:tenantId/config/header
GET    /api/tenants/:tenantId/config/footer
PUT    /api/tenants/:tenantId/config/footer
GET    /api/tenants/:tenantId/config/menus
PUT    /api/tenants/:tenantId/config/menus
GET    /api/tenants/:tenantId/config/logos
PUT    /api/tenants/:tenantId/config/logos
```

**Data Structure:**

```typescript
{
  headerConfig: {
    template: 'standard' | 'centered' | 'split',
    logo: 'primary',
    navigation: {
      menu: 'main-menu',
      style: 'horizontal',
      variant: 'default'
    },
    actions: { ... },
    behavior: { ... }
  },
  footerConfig: { ... },
  menusConfig: {
    'main-menu': { items: [...] },
    'footer-menu': { items: [...] }
  },
  logosConfig: {
    'primary': { type: 'svg', svg: '...' },
    'icon': { type: 'svg', svg: '...' }
  }
}
```

---

## API Consumer Analysis

### Consumer 1: Client (Customer Frontend)

**Access Pattern:** Read-only, high-volume, cacheable

**Endpoints Needed:**

```typescript
// Pages - Public
GET /api/public/sites/:slug/pages/:pageSlug
GET /api/public/sites/:slug/config
GET /api/public/sites/:slug/posts
GET /api/public/sites/:slug/posts/:postSlug

// Optimizations:
- Aggressive caching (CDN + Redis)
- Only published content
- Lean response (no metadata)
- Fast serialization
```

**Response Format (Optimized):**

```json
{
  "page": {
    "title": "Home",
    "sections": [...],  // Just what's needed to render
    "meta": { ... }     // SEO only
  }
}
```

### Consumer 2: Builder (Admin UI)

**Access Pattern:** Read-write, authenticated, real-time

**Endpoints Needed:**

```typescript
// Pages - Full CRUD
GET    /api/pages?tenantId=...
POST   /api/pages
GET    /api/pages/:id
PATCH  /api/pages/:id
DELETE /api/pages/:id
POST   /api/pages/:id/publish
POST   /api/pages/:id/duplicate

// Site Config - Full CRUD
GET    /api/tenants/:id/config
PUT    /api/tenants/:id/config
PATCH  /api/tenants/:id/config

// Tenants - Management
GET    /api/tenants
POST   /api/tenants
GET    /api/tenants/:id
PATCH  /api/tenants/:id

// Assets - Upload
POST   /api/assets/upload
GET    /api/assets
DELETE /api/assets/:id

// Users - Management
GET    /api/users
POST   /api/users
PATCH  /api/users/:id

// Optimizations:
- Real-time validation
- Full metadata
- Draft support
- Version history (future)
```

**Response Format (Full):**

```json
{
  "page": {
    "id": "...",
    "title": "Home",
    "sections": [...],
    "meta": { ... },
    "audit": {
      "createdAt": "...",
      "updatedAt": "...",
      "authorId": "...",
      "status": "draft"
    }
  }
}
```

---

## API Design Principles

### 1. Separation of Concerns

**Public API** (`/api/public/*`)

- No auth required
- Only published content
- Aggressive caching
- Minimal response size
- Rate limited by IP

**Admin API** (`/api/*`)

- Auth required
- Full CRUD access
- No caching (or short TTL)
- Full response with metadata
- Rate limited by user

### 2. Multi-Tenancy Strategy

**All endpoints scoped by tenant:**

```typescript
// Via header (preferred)
X-Tenant-Id: church-slug

// Via subdomain
church-slug.yourdomain.com

// Via query param (fallback)
?tenantId=church-slug
```

**Database queries always filtered:**

```typescript
this.prisma.page.findMany({
  where: { tenantId }, // ALWAYS present
});
```

### 3. Response Format Standardization

**Success:**

```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

**Error:**

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [{ "field": "title", "message": "Title is required" }]
}
```

### 4. Caching Strategy

**Client (Frontend):**

- CDN cache: 1 hour
- Browser cache: 5 minutes
- Revalidate on publish

**Builder (Admin):**

- No CDN cache
- Browser cache: disabled
- Real-time updates

### 5. Performance Optimization

**Queries:**

- Indexed tenant_id on all tables
- Composite indexes for common queries
- Limit + offset pagination
- Cursor-based for large datasets

**Responses:**

- Gzip compression
- JSON serialization optimization
- Field selection (sparse fieldsets)
- Relation loading strategy

### 6. Security

**Public API:**

- Rate limiting (100 req/min per IP)
- CORS whitelist
- No sensitive data exposure

**Admin API:**

- JWT authentication
- Role-based access (owner/admin/editor)
- Audit logging
- CSRF protection
- Rate limiting (1000 req/min per user)

---

## Database Schema Changes

### Tables to Remove:

```sql
DROP TABLE products;
DROP TABLE orders;
DROP TABLE order_items;
DROP TABLE customers;
DROP TABLE bookings;
DROP TABLE subscriptions;
DROP TABLE invoices;
DROP TABLE leads;
DROP TABLE projects;
DROP TABLE tasks;
DROP TABLE activities;
DROP TABLE customer_portals;
DROP TABLE portal_documents;
```

### Tables to Keep & Modify:

```sql
-- Tenants: Add config columns
ALTER TABLE tenants
ADD COLUMN header_config JSONB,
ADD COLUMN footer_config JSONB,
ADD COLUMN menus_config JSONB,
ADD COLUMN logos_config JSONB;

-- Pages: Already good, just update content validation

-- Posts: Keep for church announcements

-- Assets: Keep as-is

-- Users: Keep as-is

-- Webhooks: Keep for future
```

---

## Migration Plan

### Step 1: Remove Modules (Today)

- Delete unnecessary module directories
- Update app.module.ts
- Test API starts

### Step 2: Update Prisma Schema (Today)

- Remove unused models
- Add config columns to Tenant
- Generate migration
- Run migration

### Step 3: Extend Pages Module (Tomorrow)

- Add church block DTOs
- Update validation
- Test with sample data

### Step 4: Create SiteConfig Module (Tomorrow)

- Build CRUD endpoints
- Add validation
- Test with Builder

### Step 5: Test Integration (Day 3)

- Builder → API → Database
- Client → API → Render
- End-to-end flow

---

## Success Criteria

✅ API starts without errors
✅ Only essential modules present
✅ Clean database schema
✅ Block-based pages working
✅ Site config CRUD working
✅ Client can fetch and render
✅ Builder can create and edit
✅ Multi-tenancy working
✅ Authentication working
✅ Performance acceptable (<200ms avg)

---

**Ready to execute!**
