# API Server (NestJS)

Backend API for the Web And Funnel agency management platform.

## What This Is

An all-in-one agency management API that powers:

- Lead intake and qualification (CRM)
- Project and task management
- Client portals
- Proposal/contract generation
- Integrations with Webflow, Stripe, email services

**NOT** trying to replace Salesforce or HubSpot. **IS** building agency-specific workflows that generic tools don't handle well.

## Architecture

This is a **multi-tenant NestJS API** with modular feature design:

- **Multi-tenant data isolation**: Each client (Tenant) has isolated data
- **Agency-first**: Designed for web agencies managing multiple clients
- **Integration-friendly**: Built to connect with Webflow, Stripe, SendGrid, etc.
- **Monolithic**: Intentionally NOT microservices - simpler to deploy and maintain

## Core Modules

### Admin Management

- **Users** - Create, invite, and manage agency team and client users
- **Features** - Enable/disable features per tenant with granular control
- **Projects** - Assign team members to client projects with role-based permissions
- **Audit Logs** - Track all administrative actions for compliance
- **Roles** - Owner, Admin, Developer, Designer, Content Manager

### Authentication & Authorization

- **Auth** - JWT-based authentication with custom password hashing
- **Guards** - Role-based access control (RBAC) with @Roles() and @SuperAdmin() decorators
- **Multi-level Permissions** - Agency roles + tenant-specific permissions

### Client Management

- **Tenants** - Client businesses with feature gating and usage stats
- **Design Tokens** - Per-tenant design customization (header, menu, footer, section tokens)
- **Site Config** - Header, footer, menus, and logos configuration
- **Project Assignments** - Agency team assignments to client projects

### Content Management

- **Pages** - Multi-section pages with block-based content (4-level max nesting)
- **Posts** - Blog posts and articles
- **Assets** - File storage and management

### Integrations & Monitoring

- **Webhooks** - Event-driven integrations
- **Health Checks** - System health monitoring
- **Audit Logging** - Enterprise-grade activity tracking

## Key Features

- **Multi-tenant**: Each tenant (client) has isolated data
- **Enterprise Admin**: Complete user, feature, and project management
- **Role-Based Access Control**: Agency roles (Owner/Admin/Developer/Designer) with guard-based authorization
- **Feature Gating**: Per-tenant feature flags for controlled access
- **JWT Authentication**: Custom auth with bcrypt password hashing
- **Audit Logging**: Track all administrative actions
- **Prisma ORM**: Type-safe database access with PostgreSQL
- **Custom Logger**: Development-friendly logging with production JSON output
- **Block Validation**: Type-safe content blocks with nesting validation

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Run Development Server

```bash
pnpm dev
```

API runs on **http://localhost:4000**

### Available Scripts

```bash
pnpm dev              # Start with watch mode
pnpm build            # Build for production
pnpm start            # Run production build
pnpm lint             # Lint code
pnpm format           # Format with Prettier
pnpm test             # Run unit tests
pnpm test:e2e         # Run E2E tests
```

## Project Structure

```
/api
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   ├── common/                    # Shared utilities
│   │   ├── decorators/            # Custom decorators (@TenantId, @Roles, @SuperAdmin)
│   │   ├── guards/                # Guards (RolesGuard, JwtAuthGuard)
│   │   ├── middleware/            # Middleware (TenantMiddleware)
│   │   ├── logger/                # Custom logging service
│   │   └── services/              # Shared services (PrismaService)
│   └── modules/                   # Feature modules
│       ├── admin/                 # Admin management (users, features, projects)
│       ├── auth/                  # Authentication (JWT)
│       ├── tenants/               # Tenant management
│       ├── users/                 # User operations
│       ├── pages/                 # Page content with blocks
│       ├── posts/                 # Blog posts
│       ├── assets/                # File management
│       ├── site-config/           # Header/footer/menus/logos config
│       ├── webhooks/              # Webhook handlers
│       └── health/                # Health checks
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── seed.ts                    # Database seeding
├── test/                          # E2E tests
├── nest-cli.json                  # NestJS CLI config
├── tsconfig.json                  # TypeScript config
└── package.json                   # Dependencies & scripts
```

## Multi-Tenant Resolution

The API automatically resolves the tenant from:

1. **Subdomain**: `http://demo.example.com` → tenant = `demo`
2. **Query Parameter**: `http://api.example.com?tenant=demo` → tenant = `demo`

Use the `@TenantId()` decorator in controllers to access the tenant:

```typescript
@Get()
getTenantData(@TenantId() tenantId: string) {
  return this.service.getDataForTenant(tenantId)
}
```

## Design Token Customization

The API supports per-tenant design token overrides stored in the `designTokens` JSONB column:

### Endpoints

- **GET /api/v1/tenants/:id/tokens** - Fetch tenant design token overrides
- **PUT /api/v1/tenants/:id/tokens** - Update tenant design token overrides

### Token Structure

```typescript
{
  header?: { height?: {...}, background?: {...} },
  menu?: { item?: {...}, color?: {...} },
  footer?: { background?: {...}, padding?: {...} },
  section?: { spacing?: {...}, width?: {...}, background?: {...} }
}
```

These tokens override the platform defaults defined in the client application, enabling complete per-client design customization.

## Health Checks

- **GET /api/health** - Full health check (memory, database, etc.)
- **GET /api/health/ready** - Simple readiness probe

## Testing

```bash
pnpm test              # Unit tests
pnpm test:watch        # Watch mode
pnpm test:cov          # With coverage
pnpm test:e2e          # E2E tests
```

## Documentation

See main project documentation in `/docs`:

- [API Design](../docs/api-design.md)
- [Security](../docs/security.md)
- [Implementation Details](../docs/implementation-details.md)
