# MH Bible Baptist Church Platform Documentation

**A modern, block-based church website platform built for scale.**

This platform is designed to serve multiple churches with a shared backend and customizable frontends.

---

## 📚 Documentation Index

### [Client (Next.js Frontend)](./client/)
- [Component System](./client/components.md)
- [Block Architecture](./client/blocks.md)
- [Data Model](./client/data-model.md)
- [SEO System](./client/seo-usage.md)
- [Code Generator](./client/generator.md)

### [API (NestJS Backend)](./api/)
*Coming soon - Backend will be built after frontend data model is perfected*
- [Architecture](./api/architecture.md)
- [API Endpoints](./api/endpoints.md)
- [Database Schema](./api/database.md)
- [Multi-Tenancy](./api/multi-tenancy.md)

### [App (Mobile)](./app/)
*Coming soon - Mobile apps will consume the same API*
- [Setup Guide](./app/setup.md)
- [Architecture](./app/architecture.md)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                  Frontend Layer                  │
├─────────────────────────────────────────────────┤
│  Next.js (Web)          React Native (Mobile)   │
│  - Block Renderer       - Block Renderer        │
│  - UI Components        - Native Components     │
│  - SEO System          - Deep Linking           │
└─────────────────┬───────────────────────────────┘
                  │
                  │ REST/GraphQL API
                  │
┌─────────────────▼───────────────────────────────┐
│                 Backend Layer                    │
├─────────────────────────────────────────────────┤
│  NestJS API                                     │
│  - Multi-tenant                                 │
│  - Block Management                             │
│  - Media Management                             │
│  - User Authentication                          │
└─────────────────┬───────────────────────────────┘
                  │
                  │
┌─────────────────▼───────────────────────────────┐
│               Database Layer                     │
├─────────────────────────────────────────────────┤
│  PostgreSQL (Drizzle ORM)                       │
│  - Tenants                                      │
│  - Pages & Blocks                               │
│  - Media Library                                │
│  - Users & Permissions                          │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Current Phase: Frontend with Mock Data

**Strategy:** Build the frontend first with mock data, perfect the data model and UX, then build the backend to match.

**Benefits:**
- ✅ Rapid iteration on UX
- ✅ Perfect the data model before backend constraints
- ✅ Design the API you wish you had
- ✅ Frontend and backend can be developed in parallel later

---

## 🚀 Quick Links

- **Getting Started:** See [client/README.md](./client/)
- **Component Library:** See [client/components.md](./client/components.md)
- **Block System:** See [client/blocks.md](./client/blocks.md)
- **Data Model:** See [client/data-model.md](./client/data-model.md)

---

## 📦 Tech Stack

### Frontend (Current Focus)
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **State:** React Server Components + Client Components
- **Data:** Mock JSON (transitioning to API)

### Backend (Future)
- **Framework:** NestJS
- **Database:** PostgreSQL with Drizzle ORM
- **Auth:** Clerk or custom JWT
- **Storage:** S3/Cloudflare R2
- **Cache:** Redis

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

### ✅ Phase 1: Foundation (Current)
- [x] Next.js setup
- [x] Component system (Heading, Text, Section, Page)
- [x] Global types
- [x] SEO system
- [x] Code generator
- [x] Block architecture (HeadingBlock)

### 🔨 Phase 2: Mock Data & Perfection (In Progress)
- [ ] Mock data structure
- [ ] Block renderer
- [ ] Data model types
- [ ] Multiple block types
- [ ] Admin UI mockup
- [ ] Perfect the UX

### 📋 Phase 3: Backend Development
- [ ] NestJS setup
- [ ] Database schema
- [ ] Multi-tenancy
- [ ] API endpoints
- [ ] Authentication
- [ ] Media uploads

### 🔗 Phase 4: Integration
- [ ] Connect frontend to real API
- [ ] Remove mock data
- [ ] Admin CMS UI
- [ ] Deploy backend
- [ ] Deploy frontend

### 📱 Phase 5: Mobile
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
