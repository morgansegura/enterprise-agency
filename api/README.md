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

### CRM & Project Management

- **Leads** - Lead intake, scoring, pipeline management
- **Projects** - Client projects with agency phases (discovery → design → dev → launch)
- **Tasks** - Asana-style task management with sections
- **Activities** - Timeline of all interactions (calls, notes, status changes)

### Client Management

- **Tenants** - Client businesses
- **Users** - Agency team and client users
- **Customer Portals** - White-labeled portals for clients

### Content & Commerce

- **Pages/Posts** - Client website content
- **Products/Orders** - E-commerce features
- **Assets** - File storage and management

### Finance

- **Invoices** - Client billing
- **Subscriptions** - Recurring payments
- **Stripe Integration** - Payment processing

### Integrations (Planned)

- **Webflow/Framer** - Site building integration
- **SendGrid/Resend** - Email automation
- **Cal.com** - Meeting scheduling
- **DocuSign/HelloSign** - Contract signing

## Key Features

- **Multi-tenant**: Each tenant (client) has isolated data
- **Clerk Auth**: Enterprise authentication with RBAC
- **Prisma ORM**: Type-safe database access
- **Sentry Monitoring**: Error tracking and performance monitoring
- **Webhook Support**: Receive events from external services

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
│   │   ├── decorators/            # Custom decorators (@TenantId)
│   │   ├── guards/                # Guards (TenantGuard)
│   │   └── middleware/            # Middleware (TenantMiddleware)
│   └── modules/                   # Feature modules
│       └── health/                # Health check module
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
