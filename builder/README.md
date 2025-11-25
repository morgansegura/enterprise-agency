# Web & Funnel Agency Platform

**Enterprise-grade agency management and client website platform**

A comprehensive multi-tenant platform for running a professional web development and digital marketing agency. This platform provides complete agency operations management, client relationship tools, project management, and white-label website builder capabilities.

---

## 🎯 Overview

Web & Funnel is a professional SaaS platform designed for digital agencies to:

- **Manage Agency Operations** - Complete CRM, project management, and team collaboration
- **Client Onboarding** - Structured intake workflows and discovery processes
- **Build Client Websites** - Multi-tenant website builder with e-commerce, bookings, and content management
- **Track Revenue** - Billing, invoicing, and financial reporting
- **Scale Teams** - Role-based permissions for agency staff and clients

---

## 🏗️ Architecture

### Platform Structure

```
/admin                          → Agency Platform (Team Only)
├── /admin/crm                 → CRM & Project Management
├── /admin/clients             → Client Directory & Management
├── /admin/intake              → Client Onboarding Workflows
├── /admin/billing             → Revenue & Invoicing
├── /admin/team                → Team Management & Permissions
└── /admin/site/[clientId]     → Client Site Builder (Agency View)

[slug].yourdomain.com          → Client Portal (Client Login)
├── /dashboard                 → Client's Business Dashboard
├── /pages                     → Content Management
├── /products                  → E-commerce Management
└── /orders                    → Order Management
```

### Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (CSS-first architecture)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk (Multi-tenant RBAC)
- **Hosting**: Cloudflare Pages (Wildcard subdomains)
- **UI Components**: Radix UI primitives with custom design system

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Clerk account (authentication)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd admin

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Access the platform at `http://localhost:4001/admin`

---

## 📚 Documentation

### Core Documentation

- [Architecture Overview](./docs/architecture/overview.md) - System design and structure
- [Agency Platform Features](./docs/features/agency-platform.md) - CRM, intake, billing
- [Multi-Tenant System](./docs/architecture/multi-tenant.md) - Tenant isolation and routing
- [Authentication & Permissions](./docs/architecture/auth-permissions.md) - RBAC and security

### Development Guides

- [Development Setup](./docs/development/setup.md) - Local environment configuration
- [CSS Architecture](./docs/development/css-architecture.md) - Tailwind v4 CSS-first approach
- [Database Schema](./docs/development/database-schema.md) - Prisma models and relationships
- [API Documentation](./docs/development/api.md) - Internal API structure

### Feature Documentation

- [CRM & Project Management](./docs/features/crm.md) - Client projects and pipeline
- [Client Intake System](./docs/features/intake.md) - Onboarding workflows
- [Website Builder](./docs/features/site-builder.md) - Multi-tenant site builder
- [Billing System](./docs/features/billing.md) - Invoicing and revenue tracking

---

## 👥 User Roles

### Agency Team Roles

| Role                | Access                 | Capabilities                                         |
| ------------------- | ---------------------- | ---------------------------------------------------- |
| **Owner**           | Full platform access   | All features, billing, team management               |
| **Project Manager** | Agency platform        | CRM, client management, project tracking             |
| **Designer**        | Assigned projects      | Design assets, brand guidelines, feedback            |
| **Developer**       | Site builder           | Build/edit client websites, technical implementation |
| **Content Editor**  | Site builder (limited) | Edit content, upload media (no structural changes)   |

### Client Roles

| Role               | Access                    | Capabilities                    |
| ------------------ | ------------------------- | ------------------------------- |
| **Business Owner** | Full client portal        | All features for their business |
| **Manager**        | Client portal (limited)   | Content, products, orders       |
| **Staff**          | Client portal (view only) | View-only access to reports     |

---

## 🛠️ Development Roadmap

### Phase 1: Agency Platform Foundation (Current)

- [x] Authentication & multi-tenant architecture
- [x] Design system & CSS architecture
- [ ] Client directory & CRUD
- [ ] Client intake system
- [ ] Basic CRM dashboard

### Phase 2: Project Management

- [ ] Project creation & tracking
- [ ] Task management (Asana-style)
- [ ] Team assignments & workload
- [ ] Calendar & deadlines
- [ ] File attachments & comments

### Phase 3: Billing & Revenue

- [ ] Invoice generation & tracking
- [ ] Payment processing integration
- [ ] Revenue reporting (MRR, project revenue)
- [ ] Expense tracking

### Phase 4: Website Builder

- [x] Design token configuration system
- [ ] Visual page builder
- [ ] Component library
- [ ] Template system
- [ ] Multi-site management

### Phase 5: Client Portal

- [ ] Client authentication (subdomain routing)
- [ ] Client dashboard
- [ ] Content management interface
- [ ] E-commerce features

---

## 🎨 Design System

This platform uses a custom design system with:

- **CSS-first architecture** - Tailwind v4 with dedicated CSS files
- **Component library** - Reusable UI components with consistent styling
- **Design tokens** - Centralized theming and variables
- **App prefix** - All application styles use `app-*` naming convention

See [CSS Architecture Documentation](./docs/development/css-architecture.md) for details.

### Design Token Configuration

The builder includes a comprehensive design token configuration system for per-client website customization:

- **Token Editors** - Form-based UI for customizing header, menu, footer, and section tokens
- **Visual Customization** - Per-tenant overrides for spacing, colors, typography, and layout
- **Live Updates** - Changes apply instantly to client websites
- **Type-Safe** - Full TypeScript support for token schemas

**Available Token Systems:**

- **Header Tokens** - Heights (default, shrunk, mobile), backgrounds, positioning
- **Menu Tokens** - Typography, colors, padding, hover states
- **Section Tokens** - Spacing scale, container widths, background colors
- **Footer Tokens** - Layout, columns, social links (coming soon)

Access token configuration via:
`Dashboard → Clients → [Client Name] → Design Tab`

---

## 🔒 Security

- **Multi-tenant isolation** - Complete data separation between clients
- **Role-based access control** - Granular permissions for all user types
- **Authentication** - Clerk enterprise authentication
- **Environment variables** - Secure credential management
- **API security** - Protected routes with authentication middleware

---

## 📝 License

Proprietary - All Rights Reserved

---

## 🤝 Support

For questions or issues:

- Internal documentation: `/docs`
- Technical lead: [Contact information]
- Project repository: [Repository URL]

---

**Built with excellence for professional agency operations**
