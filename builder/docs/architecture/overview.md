# Architecture Overview

## System Architecture

Web & Funnel is a **multi-tenant SaaS platform** with two distinct application contexts:

1. **Agency Platform** - Internal tools for running your web development agency
2. **Client Portal** - White-label website management for individual clients

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cloudflare DNS & Routing                     │
│  *.yourdomain.com → Next.js Application (Edge Functions)       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Next.js Middleware Layer                      │
│  • Subdomain detection                                          │
│  • Route protection (authentication)                            │
│  • Tenant context injection                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
┌───────────────────────────┐  ┌────────────────────────────┐
│   Agency Platform Routes  │  │  Client Portal Routes      │
│   /admin/*                │  │  [slug].yourdomain.com/*   │
│                           │  │                            │
│   Auth: Agency Team       │  │  Auth: Client Users        │
│   Context: Platform Admin │  │  Context: Specific Tenant  │
└───────────────────────────┘  └────────────────────────────┘
                │                           │
                └─────────────┬─────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer (PostgreSQL)                    │
│  • Multi-tenant schema with tenant_id isolation                 │
│  • Prisma ORM with row-level security                           │
│  • Separate tables for agency vs client data                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Application Contexts

### 1. Agency Platform Context (`/admin`)

**Purpose**: Internal tools for agency team to run the business

**Access**:

- URL: `yourdomain.com/admin` or `admin.yourdomain.com`
- Authentication: Clerk (agency staff accounts only)
- Tenant Context: Platform-level (can view/manage all tenants)

**Features**:

- CRM & Project Management
- Client Directory & Health Monitoring
- Client Intake & Onboarding
- Team Management & Permissions
- Billing & Revenue Tracking
- Site Builder (for building client sites)

**User Roles**:

- Owner
- Project Manager
- Designer
- Developer
- Content Editor

### 2. Client Portal Context (`[slug].yourdomain.com`)

**Purpose**: White-label dashboard for clients to manage their business

**Access**:

- URL: `clientslug.yourdomain.com` (e.g., `demostore.yourdomain.com`)
- Authentication: Clerk (client-specific accounts)
- Tenant Context: Single tenant (isolated to their data only)

**Features**:

- Business Dashboard (sales, traffic, orders)
- Content Management (pages, blog posts, media)
- E-commerce (products, orders, customers)
- Bookings (for BnB/service businesses)
- Client Settings

**User Roles**:

- Business Owner
- Manager
- Staff

---

## Routing Strategy

### Agency Platform Routes

```
/admin
├── /                        → Redirect to /admin/crm/dashboard
├── /crm
│   ├── /dashboard           → CRM overview, active projects
│   ├── /projects            → All client projects
│   ├── /projects/[id]       → Project detail with tasks
│   ├── /pipeline            → Sales pipeline (leads → clients)
│   └── /calendar            → Meetings, deadlines, milestones
├── /clients
│   ├── /                    → Client directory (list view)
│   ├── /[id]                → Client profile & details
│   └── /[id]/projects       → Client's project history
├── /intake
│   ├── /                    → Active intake workflows
│   ├── /forms               → Intake form templates
│   └── /[id]                → Specific intake session
├── /billing
│   ├── /dashboard           → Revenue overview
│   ├── /invoices            → All invoices
│   ├── /payments            → Payment tracking
│   └── /reports             → Financial reports
├── /team
│   ├── /members             → Team directory
│   ├── /roles               → Role management
│   └── /permissions         → Permission settings
└── /site/[clientId]
    ├── /builder             → Visual site builder
    ├── /pages               → Page management
    ├── /products            → Product catalog
    ├── /settings            → Site configuration
    └── /deploy              → Deployment management
```

### Client Portal Routes

```
[slug].yourdomain.com
├── /                        → Client dashboard
├── /pages
│   ├── /                    → All pages
│   ├── /[id]                → Edit specific page
│   └── /new                 → Create new page
├── /media                   → Media library
├── /products
│   ├── /                    → Product list
│   ├── /[id]                → Edit product
│   └── /new                 → Create product
├── /orders
│   ├── /                    → Order list
│   └── /[id]                → Order details
├── /customers               → Customer management
├── /analytics               → Business analytics
└── /settings
    ├── /business            → Business info
    ├── /payments            → Payment methods
    └── /team                → Client team members
```

---

## Multi-Tenant Data Isolation

### Database Schema Design

All tenant-specific data includes `tenantId` field for strict isolation:

```prisma
model Tenant {
  id           String   @id @default(cuid())
  slug         String   @unique
  businessName String
  // ... tenant metadata

  // Relations
  products     Product[]
  orders       Order[]
  pages        Page[]
  users        User[]
}

model Product {
  id        String  @id @default(cuid())
  tenantId  String  // 🔒 Tenant isolation
  name      String
  price     Decimal

  tenant    Tenant  @relation(fields: [tenantId], references: [id])

  @@index([tenantId])  // Performance optimization
}
```

### Tenant Context Injection

```typescript
// Middleware extracts tenant from subdomain or route
const tenantId = getTenantFromRequest(req)

// All database queries automatically scoped
const products = await prisma.product.findMany({
  where: { tenantId }, // Auto-injected
})
```

---

## Authentication & Authorization

### Authentication Provider: Clerk

- **Agency Team**: Email-based auth, MFA optional
- **Client Users**: Email or social auth (configurable per tenant)

### Authorization Strategy

```typescript
// Role-based permissions
enum AgencyRole {
  OWNER = 'owner',
  PROJECT_MANAGER = 'project_manager',
  DESIGNER = 'designer',
  DEVELOPER = 'developer',
  CONTENT_EDITOR = 'content_editor',
}

enum ClientRole {
  BUSINESS_OWNER = 'business_owner',
  MANAGER = 'manager',
  STAFF = 'staff',
}

// Permission checks
canAccessAgencyPlatform(user)
canManageClient(user, clientId)
canEditSite(user, siteId)
canManageTeam(user, tenantId)
```

---

## Technology Stack Details

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS with custom design system
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Relational database
- **Clerk** - Authentication & user management

### Infrastructure

- **Cloudflare Pages** - Edge hosting
- **Cloudflare DNS** - Wildcard subdomain routing
- **Vercel** - Alternative hosting option
- **Stripe** - Payment processing (future)
- **S3/Cloudflare R2** - Media storage (future)

---

## Security Considerations

### Data Isolation

- All queries scoped by `tenantId`
- No cross-tenant data access
- Prisma middleware enforces tenant boundaries

### Authentication

- Clerk session management
- JWT tokens with short expiration
- Refresh token rotation

### Authorization

- Route-level protection via middleware
- Component-level permission checks
- API route authorization

### Infrastructure

- HTTPS enforced
- CORS policies configured
- Rate limiting on API routes
- SQL injection prevention (Prisma)
- XSS protection (React)

---

## Performance Optimization

### Edge Computing

- Deployed to Cloudflare Edge
- Reduced latency for global users
- Automatic geographic distribution

### Database

- Indexed tenant queries
- Connection pooling (Prisma)
- Query optimization
- Read replicas (production)

### Caching Strategy

- Static page caching
- API response caching (SWR)
- CDN caching for assets
- Redis for session storage (future)

---

## Scalability

### Horizontal Scaling

- Stateless application design
- Multiple edge instances
- Load balancing via Cloudflare

### Database Scaling

- Connection pooling
- Read replicas for queries
- Sharding by tenant (future, if needed)

### Cost Optimization

- Edge functions (pay-per-execution)
- Efficient database queries
- CDN for static assets
- Image optimization

---

## Deployment Pipeline

```
Development → Staging → Production

┌──────────┐    ┌──────────┐    ┌────────────┐
│   Local  │ →  │  Staging │ →  │ Production │
│   :4001  │    │  .dev    │    │   .com     │
└──────────┘    └──────────┘    └────────────┘
     │               │                 │
     └───────────────┴─────────────────┘
              Git Push Triggers
           Automated CI/CD Pipeline
```

---

## Next Steps

- [Multi-Tenant Implementation Details](./multi-tenant.md)
- [Authentication & Permissions](./auth-permissions.md)
- [Database Schema Design](../development/database-schema.md)
- [API Architecture](../development/api.md)
