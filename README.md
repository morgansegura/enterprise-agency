# Professional Web Agency Platform

A token-based, multi-tenant website builder for delivering cutting-edge custom frontends across multiple industries. Built for agencies, not DIY users.

## 🎯 Vision

**We're building a professional web platform that enables our agency to:**

- Deliver 100% custom frontends with zero compromise on quality
- Manage multiple clients from a single admin platform
- Build features progressively as clients need them
- Monetize through two-tier pricing (Content Editor vs Builder)
- Maintain complete control via token-based design system

**Not Webflow. Not WordPress. A purpose-built agency platform.**

[Read Full Vision →](./docs/vision.md)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 16+

### Installation

```bash
# Install all dependencies
pnpm install

# Set up database
pnpm db:push

# Start all services
pnpm dev
```

## 🌐 Application Ports

The platform runs on the following ports:

- **API (NestJS):** `http://localhost:4000`
- **Builder (Admin UI):** `http://localhost:4001`
- **Client (Frontend):** `http://localhost:4002`

### Individual Services

```bash
# Start API only
pnpm dev:api

# Start Builder only
pnpm dev:builder

# Start Client only
pnpm dev:client
```

## 📁 Project Structure

```
├── api/              # NestJS Backend API (Port 4000)
├── builder/          # Next.js Admin UI (Port 4001)
├── client/           # Next.js Frontend (Port 4002)
└── docs/             # Documentation
```

## 🛠️ Development

### Database Setup

```bash
# Push schema to database (development)
pnpm db:push

# Create migration (production)
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio

# Seed database
pnpm db:seed
```

### Code Quality

```bash
# Format all code
pnpm format

# Lint all projects
pnpm lint

# Type check all projects
pnpm typecheck

# Run all checks
pnpm verify
```

### Building

```bash
# Build all projects
pnpm build

# Build individual projects
pnpm build:api
pnpm build:builder
pnpm build:client
```

## 🏗️ Architecture

### API (Backend)

- **Framework:** NestJS 10
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT-based authentication
- **Multi-tenancy:** Tenant-scoped data isolation

**Key Modules:**

- `auth` - Authentication & authorization
- `tenants` - Multi-tenant management
- `pages` - Content pages with block-based structure
- `site-config` - Headers, footers, menus, logos
- `posts` - Blog posts and announcements
- `assets` - Media management
- `users` - User management

### Builder (Admin)

- **Framework:** Next.js 15
- **State:** TanStack Query + Zustand
- **UI:** Radix UI + Tailwind CSS 4
- **Forms:** React Hook Form + Zod

**Features:**

- Tenant management
- Visual block editor
- Site configuration UI
- Media library
- User management

### Client (Frontend)

- **Framework:** Next.js 16
- **Styling:** Tailwind CSS 4
- **Rendering:** Server Components + ISR
- **Blocks:** 24+ content and layout blocks

**Block Types:**

- Content: Heading, Text, Button, Image, Logo, Rich Text
- Containers: Grid, Flex, Stack
- Sections: Background, spacing, width controls

## 📚 Documentation

Comprehensive documentation is available in `/docs`:

### Product & Strategy

- **[Vision & Product Strategy](./docs/vision.md)** - Our platform vision and competitive positioning
- **[Feature Flags System](./docs/feature-flags.md)** - Progressive feature development & monetization
- [Build Plan](./docs/build-plan.md) - Development roadmap
- [Architecture Overview](./docs/architecture.md) - System architecture

### Builder (Admin Platform)

- [Builder Documentation](./docs/builder/readme.md) - Admin platform overview
- **[Two-Tier System](./docs/builder/two-tier-system.md)** - Content Editor vs Builder tiers
- **[Token System](./docs/builder/token-system.md)** - Design tokens for professional frontends
- [CSS Architecture](./docs/builder/css-architecture.md) - Tailwind v4 CSS-first approach
- [Agency Platform](./docs/builder/agency-platform.md) - CRM & project management features

### API & Client

- [API Documentation](./docs/api/readme.md) - Backend API reference
- [Client Documentation](./docs/client/readme.md) - Frontend implementation

## 🔐 Environment Variables

### API (`api/.env`)

```env
PORT=4000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
APP_URL=http://localhost:4002
ADMIN_URL=http://localhost:4001
```

### Builder (`builder/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_API_VERSION=v1
```

### Client (`client/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_NAME=Your Church Name
NEXT_PUBLIC_SITE_URL=http://localhost:4002
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific project
pnpm test:api
pnpm test:builder
pnpm test:client
```

## 📝 API Endpoints

### Health Check

```
GET http://localhost:4000/api/v1/health
```

### Authentication

```
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/auth/refresh
```

### Site Configuration

```
GET    /api/v1/tenants/:id/config
PUT    /api/v1/tenants/:id/config/header
PUT    /api/v1/tenants/:id/config/footer
PUT    /api/v1/tenants/:id/config/menus
PUT    /api/v1/tenants/:id/config/logos
```

### Pages

```
GET    /api/v1/pages
POST   /api/v1/pages
GET    /api/v1/pages/:id
PATCH  /api/v1/pages/:id
DELETE /api/v1/pages/:id
POST   /api/v1/pages/:id/publish
```

## 🚢 Deployment

### API

- Platform: Railway, Render, or AWS
- Database: Managed PostgreSQL
- Environment: Set all production env vars

### Builder & Client

- Platform: Vercel, Netlify, or Cloudflare Pages
- Build command: `pnpm build`
- Output: `.next` directory

## 🤝 Contributing

This is an internal project. All changes should follow enterprise coding standards.

## 📄 License

UNLICENSED - Private/Proprietary

---

**Built with enterprise standards**
