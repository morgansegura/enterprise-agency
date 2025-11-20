# MH Bible Baptist Church Platform Documentation

**A modern, block-based church website platform built for scale.**

This platform is designed to serve multiple churches with a shared backend and customizable frontends.

---

## 📚 Documentation Index

### 🎯 Getting Started
- **[Architecture Overview](./architecture.md)** - System architecture and core concepts
- **[Monorepo Strategy](./MONOREPO_STRATEGY.md)** - How to manage multiple client deployments
- **[Public API Guide](./PUBLIC_API.md)** - Public endpoints for client frontends
- **[Security Recommendations](./SECURITY_RECOMMENDATIONS.md)** - Security best practices & fixes
- **[Testing Permissions](./testing-permissions.md)** - RBAC and permission testing guide

### [Client (Next.js Frontends)](./client/)
- [Component System](./client/components.md)
- [Block Architecture](./client/blocks.md)
- [Data Model](./client/data-model.md)
- [SEO System](./client/seo-usage.md)
- [Code Generator](./client/generator.md)

### [Builder (Admin Panel)](./builder/)
- [Architecture](./builder/architecture.md)
- [README](./builder/README.md)

### [API (NestJS Backend)](./api/)
- [Architecture](./api/architecture.md)
- [Block Types](./api/block-types.md)
- [README](./api/README.md)

### [App (Mobile)](./app/)
*Coming soon - Mobile apps will consume the same API*
- [README](./app/README.md)

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                     WEBFUNNEL PLATFORM                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Builder (4001)           API (4000)          Clients (4002+)    │
│  ┌──────────────┐       ┌──────────┐       ┌────────────────┐  │
│  │ Admin Panel  │◄──────┤ NestJS   │◄──────┤ Client Sites   │  │
│  │              │       │  API     │       │                │  │
│  │ - Auth       │       │          │       │ - Public API   │  │
│  │ - CRUD Pages │       │ Auth API │       │ - No Auth      │  │
│  │ - Manage     │       │ Public API│       │ - Published    │  │
│  │   Users      │       └────┬─────┘       │   Content      │  │
│  └──────────────┘            │             └────────────────┘  │
│                               │                                 │
│                        ┌──────▼──────┐                         │
│                        │ PostgreSQL  │                         │
│                        │  (Prisma)   │                         │
│                        │             │                         │
│                        │ - Tenants   │                         │
│                        │ - Pages     │                         │
│                        │ - Users     │                         │
│                        │ - RBAC      │                         │
│                        └─────────────┘                         │
└──────────────────────────────────────────────────────────────────┘
```

### Key Concepts

- **Builder:** Single admin panel at `builder.webfunnel.com` for agency + clients
- **API:** Multi-tenant backend with authenticated + public endpoints
- **Clients:** Individual deployments per client (not cookie-cutter)
- **Monorepo:** Shared packages for components, isolated customizations

---

## 🎯 Current Phase: Backend Integration & Security

**Status:** Backend API and Builder are functional, need security hardening and public API

**Current State:**
- ✅ NestJS API with multi-tenant architecture
- ✅ Builder admin panel with authentication
- ✅ Enterprise RBAC (agency + tenant roles)
- ✅ HTTP-only cookie JWT auth
- ⏳ Public API for client frontends (in progress)
- ⏳ Security hardening (token revocation, rate limiting)

**Next Steps:**
- Implement public API endpoints
- Fix critical security issues (P0)
- Setup monorepo for client deployments
- Deploy to staging environment

---

## 🚀 Quick Links

### For Developers
- **[Architecture](./architecture.md)** - Understand the system design
- **[Monorepo Strategy](./MONOREPO_STRATEGY.md)** - Managing multiple client deployments
- **[Security Guide](./SECURITY_RECOMMENDATIONS.md)** - Critical fixes before production
- **[Public API](./PUBLIC_API.md)** - Client frontend integration

### For Testing
- **[Testing Permissions](./testing-permissions.md)** - Test RBAC and feature gates
- **[API Documentation](./api/README.md)** - Backend endpoints reference
- **[Builder Guide](./builder/README.md)** - Admin panel usage

---

## 📦 Tech Stack

### Frontend (Current Focus)
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **State:** React Server Components + Client Components
- **Data:** Mock JSON (transitioning to API)

### Backend (Active)
- **Framework:** NestJS 10.x
- **Database:** PostgreSQL 16.x with Prisma ORM
- **Auth:** Custom JWT with HTTP-only cookies
- **Storage:** Local (transitioning to S3/Cloudflare R2)
- **Cache:** Planned (Redis)

### Mobile (Future)
- **Framework:** React Native (Expo)
- **Same API:** Shares backend with web
- **Same Blocks:** Reuses block data model

---

## 🎨 Design System

### Core Principles
1. **Block-based:** Everything is a composable block
2. **Data-driven:** All content comes from data (JSON → API)
3. **Type-safe:** Full TypeScript coverage
4. **Multi-tenant:** One platform, many churches
5. **API-first:** Frontend consumes API (even if mocked initially)

### Component Hierarchy
```
Page Layout (structural)
  ├── Section (layout + spacing)
  │   ├── Container (width constraints)
  │   │   ├── Blocks (content)
  │   │   │   ├── Heading Block
  │   │   │   ├── Text Block
  │   │   │   ├── Hero Block
  │   │   │   └── Custom Blocks
  │   │   └── UI Components (primitives)
  │   │       ├── Heading
  │   │       ├── Text
  │   │       ├── Button
  │   │       └── etc.
```

---

## 🔄 Development Phases

### ✅ Phase 1: Foundation (Completed)
- [x] Next.js client template
- [x] Component system (Heading, Text, Section, Page)
- [x] Global types
- [x] SEO system
- [x] Block architecture

### ✅ Phase 2: Backend Development (Completed)
- [x] NestJS API setup
- [x] Database schema with Prisma
- [x] Multi-tenant architecture
- [x] Authentication (JWT + HTTP-only cookies)
- [x] Enterprise RBAC (agency + tenant roles)
- [x] Pages, Posts, Assets modules
- [x] Site configuration module

### ✅ Phase 3: Builder (Completed)
- [x] Admin panel setup
- [x] Authentication flow
- [x] User management
- [x] Protected routes

### 🔨 Phase 4: Integration & Security (Current)
- [ ] Implement public API endpoints
- [ ] Fix critical security issues (P0)
- [ ] Setup monorepo for client deployments
- [ ] Connect client template to public API
- [ ] Implement rate limiting
- [ ] Add security headers
- [ ] Token revocation mechanism

### 📋 Phase 5: Production Ready (Next)
- [ ] Deploy to staging environment
- [ ] Security penetration testing
- [ ] Performance optimization
- [ ] Setup monitoring & logging
- [ ] Deploy first client site
- [ ] Production launch

### 📱 Phase 6: Mobile (Future)
- [ ] React Native setup
- [ ] Mobile block renderer
- [ ] Native components
- [ ] App store deployment

---

## 🤝 Contributing

This is an internal agency project. All documentation should be kept up-to-date as features are built.

### When Adding Features:
1. Update relevant docs
2. Add examples
3. Update this master index if adding new sections

---

## 📧 Support

Internal agency project - contact development team for questions.

---

**Last Updated:** November 2025
