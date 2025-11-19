# Reusable Code from web-and-funnel Project

## Summary

You've already built **90% of what we need** in your `web-and-funnel` project! Instead of building from scratch, we should **adapt and simplify** what you have.

---

## What You Have (That We Need)

### 1. **NestJS API** ✅
**Location:** `/api/src/`

**What's Built:**
- ✅ Pages CRUD with multi-tenancy
- ✅ Tenant management
- ✅ User authentication (JWT-based)
- ✅ Role-based access control
- ✅ Asset/media management
- ✅ Audit logging
- ✅ Webhooks
- ✅ Prisma + PostgreSQL setup

**Pages Module** (`/api/src/modules/pages/`):
```typescript
// Already has:
- POST /api/pages          // Create page
- GET /api/pages           // List pages (with filters)
- GET /api/pages/:id       // Get page
- GET /api/pages/slug/:slug // Get by slug
- PATCH /api/pages/:id     // Update page
- DELETE /api/pages/:id    // Delete page
- POST /api/pages/:id/publish  // Publish
- POST /api/pages/:id/duplicate // Duplicate
```

**Page DTO** (`create-page.dto.ts`):
```typescript
export class ContentBlockDto {
  type: string;  // hero, text, image, etc
  data?: Record<string, unknown>;
  settings?: {
    spacing, background, animation, accessibility
  };
}

export class PageSeoDto {
  metaTitle, metaDescription, keywords
  openGraph, twitter, structuredData
}

export class CreatePageDto {
  slug, title
  blocks: ContentBlockDto[]
  seo: PageSeoDto
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  template, accessibility, performance
}
```

**Database Schema** (`prisma/schema.prisma`):
```prisma
model Tenant {
  id, slug, businessName
  themeConfig (JSONB)
  enabledFeatures (JSONB)
  pages, users, assets...
}

model Page {
  id, tenantId, slug, title
  content (JSONB) ← stores blocks!
  metaTitle, metaDescription
  authorId, status, template
  publishedAt
}

model User {
  id, email, passwordHash
  isSuperAdmin, agencyRole
  tenantUsers (many-to-many)
}

model Asset {
  id, tenantId, fileKey, url
  width, height, altText
}
```

---

### 2. **Next.js Admin (Builder)** ✅
**Location:** `/admin/src/`

**What's Built:**
- ✅ Dashboard layout
- ✅ Pages list UI (`/pages/`)
- ✅ Create page form (`/pages/new`)
- ✅ Edit page UI (`/pages/[id]`)
- ✅ Visual builder route (`/pages/new-visual`)
- ✅ Clients/Tenants management
- ✅ Media library
- ✅ Products, Orders, CRM modules

**Pages UI Structure:**
```
/admin/src/app/(dashboard)/pages/
├── page.tsx           // Pages list
├── new/              // Create page form
├── [id]/             // Edit page
└── new-visual/       // Visual builder (placeholder)
```

**Components:**
```
/admin/src/components/pages/
├── pages-filters.tsx   // Filter pages by status/template
├── pages-table.tsx     // Paginated table
└── (likely more)
```

---

### 3. **Multi-Tenant Client App** ✅
**Location:** `/app/src/`

**What's Built:**
- ✅ Next.js 15 multi-tenant app
- ✅ Fetches from API
- ✅ Dynamic routing per tenant
- ✅ Tailwind CSS 4 setup

---

### 4. **Monorepo Setup** ✅
**What's Built:**
- ✅ pnpm workspace
- ✅ Shared build scripts
- ✅ Coordinated dev servers
- ✅ TypeScript configs

---

## What's Missing (For Church CMS)

### 1. **Block-Based Content System** ⚠️
**Status:** Partially built

**What you have:**
- ✅ `ContentBlockDto` type with `type` and `data`
- ✅ JSONB `content` field in Page model
- ✅ SEO, accessibility, performance settings

**What you need:**
- ❌ Specific block types (heading, text, button, card, stats, etc.)
- ❌ Block editor UI components
- ❌ Container blocks (grid, flex, stack, section)
- ❌ Type-safe block definitions
- ❌ Block preview/rendering logic

**Solution:** Extend your `ContentBlockDto` with our church block system from `/client/lib/blocks/types.ts`

---

### 2. **Visual Block Editor** ❌
**Status:** Placeholder only

**What you have:**
- ✅ Route exists (`/pages/new-visual`)
- ❌ No actual editor implementation

**What you need:**
- Block editor components
- Section/block tree view
- Form-based editors for each block type
- Preview iframe
- Drag-and-drop (later)

**Solution:** Build this using your existing admin UI patterns

---

### 3. **Site Configuration Management** ⚠️
**Status:** Partial

**What you have:**
- ✅ `themeConfig` JSONB in Tenant model
- ✅ `enabledFeatures` JSONB
- ❌ No specific structure for headers, footers, menus, logos

**What you need:**
- Header configuration
- Footer configuration
- Menu system
- Logo registry
- Theme tokens

**Solution:** Extend Tenant model with structured config, similar to `/client/lib/config/types.ts`

---

### 4. **Church-Specific Features** ❌
**Status:** Not built

**What you need:**
- Service times
- Event calendars
- Ministry pages
- Sermon audio/video
- Giving/donations
- Contact forms

**Solution:** Add as block types and page templates

---

## Recommended Approach

### Option 1: Adapt web-and-funnel (FASTEST - 1-2 weeks)

**Week 1:**
1. **Copy web-and-funnel to new project**
   ```bash
   cp -r web-and-funnel mh-bible-baptist-cms
   ```

2. **Simplify the API**
   - Remove unnecessary modules (orders, products, bookings, CRM)
   - Keep: tenants, pages, auth, users, assets
   - Add: site-config module for headers/footers/menus

3. **Update Page schema**
   - Extend `ContentBlockDto` with church block types
   - Add validation for block data
   - Update Prisma schema if needed

4. **Build block editor UI**
   - Create `/admin/src/components/editor/` directory
   - Build block editor forms
   - Build preview system

**Week 2:**
5. **Add site configuration**
   - Header/Footer/Menu/Logo management
   - Theme tokens UI
   - Connect to Tenant model

6. **Update client app**
   - Use existing `/app/` as base
   - Replace with church-specific rendering
   - Connect to updated API

7. **Test & Deploy**
   - Test with real church data
   - Deploy API, Admin, Client

---

### Option 2: Build Fresh (SLOWER - 3-4 weeks)

Start from scratch but reference web-and-funnel for patterns.

**Not recommended** - you're throwing away working code.

---

## What To Reuse Directly

### Copy As-Is:
1. **API Auth Module** (`/api/src/modules/auth/`)
   - JWT strategy
   - Guards and decorators
   - Already works perfectly

2. **API Common Utilities** (`/api/src/common/`)
   - Guards (TenantGuard, RolesGuard)
   - Decorators (@TenantId, @CurrentUser, @Roles)
   - Filters and interceptors

3. **Prisma Base Schema**
   - Tenant model
   - User/TenantUser models
   - Asset model
   - Page model (with minor modifications)

4. **Admin UI Components**
   - Layout/Nav
   - Forms with React Hook Form
   - Tables with pagination
   - Filters
   - Modal patterns

5. **Monorepo Setup**
   - pnpm-workspace.yaml
   - Root package.json scripts
   - TypeScript configs

---

### Modify & Adapt:
1. **Pages Module**
   - Keep controller/service structure
   - Update DTOs for church blocks
   - Add site-config related endpoints

2. **Admin Pages UI**
   - Keep list/create/edit structure
   - Replace form with block editor
   - Add preview system

3. **Client App**
   - Keep multi-tenant routing
   - Replace rendering with church components
   - Add church-specific pages

---

## Migration Plan

### Phase 1: Setup (Day 1-2)
```bash
# 1. Copy project
cp -r web-and-funnel mh-cms

# 2. Clean up unnecessary code
rm -rf api/src/modules/{products,orders,bookings,leads,projects,tasks}
rm -rf admin/src/app/(dashboard)/{products,orders,customers,crm,portals}

# 3. Update package names
# Edit package.json files

# 4. Fresh install
cd mh-cms
pnpm install
```

### Phase 2: Adapt API (Day 3-5)
```typescript
// 1. Update Page DTO with church blocks
// /api/src/modules/pages/dto/create-page.dto.ts

export class HeadingBlockDto {
  @IsString() type: 'heading-block';
  @ValidateNested() data: {
    text: string;
    level: 'h1' | 'h2' | 'h3';
    size: string;
  };
}

export class ContentBlockDto {
  // Union of all block types
}

// 2. Add SiteConfig module
// /api/src/modules/site-config/
// - site-config.controller.ts
// - site-config.service.ts
// - dto/update-site-config.dto.ts

// 3. Update Tenant model
model Tenant {
  // ... existing
  headerConfig Json?
  footerConfig Json?
  menusConfig Json?
  logosConfig Json?
}
```

### Phase 3: Build Block Editor (Day 6-9)
```typescript
// /admin/src/components/editor/
// - block-editor.tsx           // Main editor container
// - section-list.tsx           // List of sections
// - block-list.tsx             // Blocks in a section
// - block-editors/
//   ├── heading-block-editor.tsx
//   ├── text-block-editor.tsx
//   ├── button-block-editor.tsx
//   └── ... (one per block type)
// - preview-frame.tsx          // Preview iframe
```

### Phase 4: Update Client (Day 10-12)
```bash
# Copy church components from /client/
cp -r client/components mh-cms/app/src/
cp -r client/lib mh-cms/app/src/

# Update to fetch from API instead of mock data
```

### Phase 5: Test & Deploy (Day 13-14)
- End-to-end testing
- Deploy to staging
- First church site live

---

## File Comparison

### Your web-and-funnel:
```
/web-and-funnel/
├── api/              ← 90% ready
│   └── src/modules/
│       ├── pages/    ← Need to update DTOs
│       ├── tenants/  ← Add site-config
│       └── auth/     ← Ready!
├── admin/            ← 60% ready
│   └── src/app/(dashboard)/
│       └── pages/    ← Need block editor
└── app/              ← 70% ready
    └── src/          ← Need church components
```

### What you need for mh-bible-baptist:
```
/mh-bible-baptist-cms/
├── api/              ← Simplify + add site-config
├── builder/          ← Rename from admin + add block editor
└── client-template/  ← Adapt app/ with church components
```

---

## Decision Time

### Questions for You:

1. **Do you want to adapt web-and-funnel or start fresh?**
   - Adapt = 1-2 weeks to working system
   - Fresh = 3-4 weeks

2. **What from web-and-funnel should we keep?**
   - All of it and remove what we don't need? (Recommended)
   - Just the auth/API patterns?

3. **Should we work in web-and-funnel or copy to mh-bible-baptist?**
   - Work in web-and-funnel (faster)
   - Copy to new project (cleaner)

4. **What's the priority order?**
   - Get one church live ASAP?
   - Perfect the system first?

---

## My Recommendation

**Copy web-and-funnel → Simplify → Extend → Ship**

1. Copy to `mh-cms/` (keeps web-and-funnel intact)
2. Remove CRM/commerce modules (simplify)
3. Add church blocks to Page DTOs
4. Build block editor UI
5. Add site-config module
6. Test with first church
7. Launch in 2 weeks

**This approach:**
- ✅ Reuses 90% of working code
- ✅ Avoids rebuilding auth/API/admin structure
- ✅ Gets you live fastest
- ✅ Lets you iterate on real church feedback
- ✅ Keeps web-and-funnel separate for other projects

---

## Next Steps

**Tell me:**
1. Should we adapt web-and-funnel?
2. Should we copy it to new project or work in place?
3. Do you want me to start the migration now?

**I can:**
- Create the copy and clean it up
- Show you exact file changes needed
- Build the block editor components
- Get you to a working system in 1-2 weeks

**What do you want to do?**
