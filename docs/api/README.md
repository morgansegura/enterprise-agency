# API Documentation

NestJS backend API serving all customer sites with multi-tenant architecture.

## Overview

- **Framework:** NestJS 10.x
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT-based authentication
- **Multi-tenancy:** Tenant-scoped data isolation
- **Port:** 4000 (development)

## Quick Start

```bash
# From project root
pnpm dev:api

# Or directly
cd api
pnpm dev
```

## Project Structure

```
api/
├── src/
│   ├── main.ts                    # App entry point
│   ├── app.module.ts              # Root module
│   ├── modules/
│   │   ├── auth/                  # Authentication
│   │   ├── pages/                 # Page management
│   │   ├── tenants/               # Multi-tenant management
│   │   ├── users/                 # User management
│   │   └── assets/                # Media/file management
│   ├── common/
│   │   ├── guards/                # Auth & role guards
│   │   ├── decorators/            # Custom decorators
│   │   └── filters/               # Exception filters
│   └── types/                     # Shared types
└── prisma/
    └── schema.prisma              # Database schema
```

## Key Modules

### Pages Module

Manages content pages for all customer sites.

**Endpoints:**

```
POST   /api/pages                 # Create page
GET    /api/pages                 # List pages (filtered by tenant)
GET    /api/pages/:id             # Get page by ID
GET    /api/pages/slug/:slug      # Get page by slug
PATCH  /api/pages/:id             # Update page
DELETE /api/pages/:id             # Delete page
POST   /api/pages/:id/publish     # Publish page
POST   /api/pages/:id/unpublish   # Unpublish page
POST   /api/pages/:id/duplicate   # Duplicate page
```

**Page Structure:**

```typescript
{
  id: string;
  tenantId: string;
  slug: string;
  title: string;
  content: {
    sections: [
      {
        _key: string;
        _type: "section";
        blocks: ContentBlock[];
      }
    ]
  };
  metaTitle?: string;
  metaDescription?: string;
  status: "draft" | "published" | "scheduled" | "archived";
  template?: string;
  publishedAt?: Date;
}
```

### Tenants Module

Manages customer sites (tenants).

**Endpoints:**

```
POST   /api/tenants               # Create tenant
GET    /api/tenants               # List tenants
GET    /api/tenants/:id           # Get tenant
PATCH  /api/tenants/:id           # Update tenant
DELETE /api/tenants/:id           # Delete tenant
```

**Tenant Structure:**

```typescript
{
  id: string;
  slug: string;
  businessName: string;
  status: "active" | "inactive";
  themeConfig: object;           # Theme tokens
  enabledFeatures: object;       # Feature flags
  headerConfig?: object;         # Header configuration (TO ADD)
  footerConfig?: object;         # Footer configuration (TO ADD)
  menusConfig?: object;          # Menu configurations (TO ADD)
  logosConfig?: object;          # Logo registry (TO ADD)
}
```

### Auth Module

JWT-based authentication.

**Endpoints:**

```
POST   /api/auth/login            # Login
POST   /api/auth/register         # Register
POST   /api/auth/refresh          # Refresh token
POST   /api/auth/logout           # Logout
GET    /api/auth/me               # Get current user
```

### Assets Module

Media and file management.

**Endpoints:**

```
POST   /api/assets/upload         # Upload file
GET    /api/assets                # List assets
GET    /api/assets/:id            # Get asset
DELETE /api/assets/:id            # Delete asset
```

## Authentication

### JWT Strategy

All protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Guards

**TenantGuard:**

- Extracts `tenantId` from request
- Validates tenant access
- Injects tenant context

**RolesGuard:**

- Checks user role permissions
- Enforces RBAC

### Decorators

**@TenantId():** Extract tenant ID from request

```typescript
@Get()
findAll(@TenantId() tenantId: string) {
  // tenantId automatically injected
}
```

**@CurrentUser():** Extract current user

```typescript
@Get()
getProfile(@CurrentUser() user: User) {
  // user automatically injected
}
```

**@Roles():** Require specific roles

```typescript
@Roles('owner', 'admin', 'editor')
@Post()
create() {
  // Only owner, admin, or editor can access
}
```

## Multi-Tenancy

### How It Works

1. **Tenant Identification**
   - Via custom header: `X-Tenant-Id`
   - Via subdomain: `{tenant}.yourdomain.com`
   - Via request context

2. **Data Isolation**
   - All queries scoped by `tenantId`
   - Prisma automatically filters by tenant
   - No cross-tenant data leaks

3. **Row-Level Security**
   ```typescript
   // All queries automatically scoped
   this.prisma.page.findMany({
     where: { tenantId }, // Always required
   });
   ```

## Database

### Schema Overview

**Core Tables:**

- `tenants` - Customer sites
- `pages` - Content pages
- `users` - All users (agency + customers)
- `tenant_users` - User-to-tenant relationships
- `assets` - Files and media

**JSONB Fields:**

- `page.content` - Block-based page content
- `tenant.themeConfig` - Design tokens

### Migrations

```bash
# Create migration
pnpm db:migrate

# Push schema changes (dev only)
pnpm db:push

# Open Prisma Studio
pnpm db:studio

# Reset database (destructive!)
pnpm db:reset
```

## Environment Variables

Create `.env` file in `/api/`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/church_cms"

# JWT
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=4000
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"

# File Upload
MAX_FILE_SIZE_MB=10
UPLOAD_PATH="./uploads"
```

## Development

### Running the API

```bash
# Development (with hot reload)
pnpm dev

# Build
pnpm build

# Production
pnpm start
```

## Next Tasks

### To Add:

1. ✅ Pages CRUD (done)
2. ✅ Tenants CRUD (done)
3. ✅ Auth system (done)
4. ⏳ **Church block types** to Page DTO
5. ⏳ **Site Config module** (headers, footers, menus, logos)
6. ⏳ Clean unnecessary modules (products, orders, CRM)

See [blocks.md](./blocks.md) for block type definitions.
See [site-config.md](./site-config.md) for configuration structure.
