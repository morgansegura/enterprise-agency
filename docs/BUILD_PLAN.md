# Build Plan - Church CMS Platform

Comprehensive plan to build API and Builder from current state to production-ready.

## Current State

### ✅ Completed
- API module cleanup (removed e-commerce/CRM)
- Prisma schema cleanup
- Database migration
- API compiles and runs successfully
- Comprehensive documentation created

### ✅ Already Built
- **Client Frontend:** 24+ block components, full type system, responsive design
- **API Core:** Auth, Tenants, Users, Pages (basic CRUD), Posts, Assets, Health, Webhooks
- **Database:** PostgreSQL + Prisma with multi-tenant architecture

### ⏳ To Build
- API block type validation (24+ block DTOs)
- API SiteConfig module (headers, footers, menus, logos)
- Builder application (completely empty, needs everything)

---

## Phase 1: API Foundation (Week 1)

**Goal:** Complete API with full block validation and SiteConfig module.

### 1.1 Block Type Validation (2-3 days)

**Create DTOs for all 24+ block types:**

```
api/src/modules/pages/dto/blocks/
├── content-blocks/
│   ├── heading-block.dto.ts
│   ├── text-block.dto.ts
│   ├── rich-text-block.dto.ts
│   ├── button-block.dto.ts
│   ├── image-block.dto.ts
│   ├── video-block.dto.ts
│   ├── audio-block.dto.ts
│   ├── card-block.dto.ts
│   ├── list-block.dto.ts
│   ├── quote-block.dto.ts
│   ├── accordion-block.dto.ts
│   ├── tabs-block.dto.ts
│   ├── divider-block.dto.ts
│   ├── spacer-block.dto.ts
│   ├── embed-block.dto.ts
│   ├── icon-block.dto.ts
│   ├── stats-block.dto.ts
│   ├── map-block.dto.ts
│   └── logo-block.dto.ts
│
├── container-blocks/
│   ├── grid-block.dto.ts
│   ├── flex-block.dto.ts
│   ├── stack-block.dto.ts
│   ├── container-block.dto.ts
│   └── columns-block.dto.ts
│
├── content-block.dto.ts        # Discriminated union
├── section.dto.ts              # Section wrapper
└── validators/
    ├── nesting-level.validator.ts
    └── block-key-unique.validator.ts
```

**Tasks:**
- [ ] Create all 24 content block DTOs with `class-validator` decorators
- [ ] Create 5 container block DTOs
- [ ] Build discriminated union validator (`content-block.dto.ts`)
- [ ] Create custom nesting level validator (max 4 levels)
- [ ] Create custom key uniqueness validator
- [ ] Update `CreatePageDto` and `UpdatePageDto` to use new validation
- [ ] Write unit tests for each DTO
- [ ] Test with sample page data

**Acceptance Criteria:**
- All block types validated correctly
- Nesting level enforced (max 4)
- Unique keys enforced
- Clear validation error messages
- Tests pass

---

### 1.2 SiteConfig Module (2-3 days)

**Create new NestJS module for site configuration:**

```
api/src/modules/site-config/
├── site-config.controller.ts
├── site-config.service.ts
├── site-config.module.ts
└── dto/
    ├── header-config.dto.ts
    ├── footer-config.dto.ts
    ├── menus-config.dto.ts
    ├── logos-config.dto.ts
    └── site-config.dto.ts
```

**Endpoints to implement:**
```
GET    /api/tenants/:tenantId/config              # Get all config
PUT    /api/tenants/:tenantId/config              # Update all config
GET    /api/tenants/:tenantId/config/header       # Get header config
PUT    /api/tenants/:tenantId/config/header       # Update header config
GET    /api/tenants/:tenantId/config/footer       # Get footer config
PUT    /api/tenants/:tenantId/config/footer       # Update footer config
GET    /api/tenants/:tenantId/config/menus        # Get menus config
PUT    /api/tenants/:tenantId/config/menus        # Update menus config
GET    /api/tenants/:tenantId/config/logos        # Get logos config
PUT    /api/tenants/:tenantId/config/logos        # Update logos config
```

**Tasks:**
- [ ] Create SiteConfigModule
- [ ] Create SiteConfigController with all endpoints
- [ ] Create SiteConfigService with CRUD logic
- [ ] Create DTOs for header, footer, menus, logos
- [ ] Add validation for all config DTOs
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Test with Postman/Insomnia

**Acceptance Criteria:**
- All endpoints working correctly
- JSONB data validates properly
- Multi-tenancy works (scoped by tenantId)
- Proper error handling
- Tests pass

---

### 1.3 API Documentation & Testing (1-2 days)

**Tasks:**
- [ ] Add Swagger/OpenAPI documentation
- [ ] Create Postman collection
- [ ] Write E2E tests for critical paths
- [ ] Add health check improvements
- [ ] Document all endpoints in README

---

## Phase 2: Builder Foundation (Week 2)

**Goal:** Set up Builder app structure, TanStack Query, Zustand, and basic UI.

### 2.1 Project Setup (1 day)

**Create Builder from scratch:**

**Tasks:**
- [ ] Create `package.json` with dependencies
- [ ] Set up Next.js 15 App Router structure
- [ ] Configure TypeScript (`tsconfig.json`)
- [ ] Set up Tailwind CSS 4
- [ ] Configure environment variables
- [ ] Add `.gitignore`
- [ ] Install core dependencies:
  - `next`, `react`, `react-dom`
  - `@tanstack/react-query`, `@tanstack/react-query-devtools`
  - `zustand`
  - `@radix-ui/*` packages
  - `lucide-react` (icons)
  - `class-variance-authority`, `clsx`, `tailwind-merge`
  - `react-hook-form`, `zod`, `@hookform/resolvers`

**Dependencies (`package.json`):**
```json
{
  "dependencies": {
    "next": "^16.0.2",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "@tanstack/react-query": "^5.59.0",
    "@tanstack/react-query-devtools": "^5.59.0",
    "zustand": "^4.5.0",
    "@radix-ui/react-accordion": "^1.2.2",
    "@radix-ui/react-alert-dialog": "^1.1.4",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-tooltip": "^1.1.6",
    "lucide-react": "^0.462.0",
    "react-hook-form": "^7.54.2",
    "zod": "^3.24.1",
    "@hookform/resolvers": "^3.10.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "date-fns": "^4.1.0"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/react": "^19.0.7",
    "@types/react-dom": "^19.0.3",
    "typescript": "^5.7.3",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20"
  }
}
```

---

### 2.2 App Structure (1 day)

**Create directory structure:**

```
builder/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                  # Dashboard layout
│   │   │   ├── page.tsx                    # Dashboard home
│   │   │   ├── tenants/page.tsx            # Tenant list
│   │   │   ├── pages/
│   │   │   │   ├── page.tsx                # Pages list
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx            # Page view
│   │   │   │       └── edit/page.tsx       # Page editor
│   │   │   ├── posts/page.tsx              # Posts list
│   │   │   ├── assets/page.tsx             # Media library
│   │   │   └── settings/page.tsx           # Settings
│   │   ├── layout.tsx                       # Root layout
│   │   └── providers.tsx                    # React Query provider
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── breadcrumbs.tsx
│   │   └── ui/                              # shadcn components
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   └── client.ts                    # API fetch wrapper
│   │   ├── hooks/
│   │   │   └── use-auth.ts
│   │   ├── stores/
│   │   │   └── ui-store.ts
│   │   └── utils.ts
│   │
│   └── styles/
│       └── globals.css
│
├── public/
├── .env.local
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

**Tasks:**
- [ ] Create all directory structure
- [ ] Set up root layout with providers
- [ ] Create auth layout (login page)
- [ ] Create dashboard layout (sidebar + header)
- [ ] Set up TanStack Query provider
- [ ] Configure environment variables

---

### 2.3 TanStack Query Setup (2 days)

**Create API client and hooks:**

**Tasks:**
- [ ] Create `lib/api/client.ts` (fetch wrapper)
- [ ] Create `lib/api/pages.ts` (Pages API endpoints)
- [ ] Create `lib/api/tenants.ts` (Tenants API endpoints)
- [ ] Create `lib/api/auth.ts` (Auth API endpoints)
- [ ] Create `lib/hooks/use-pages.ts` (Query hooks)
- [ ] Create `lib/hooks/use-tenants.ts` (Query hooks)
- [ ] Create `lib/hooks/use-auth.ts` (Query hooks)
- [ ] Test all hooks with API
- [ ] Add error handling
- [ ] Add loading states

**Files to create:**
```typescript
// lib/api/client.ts
export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T>

// lib/api/pages.ts
export const pagesApi = {
  list: (tenantId: string, filters?: any) => Promise<Page[]>
  getById: (id: string) => Promise<Page>
  create: (data: CreatePageDto) => Promise<Page>
  update: (id: string, data: UpdatePageDto) => Promise<Page>
  delete: (id: string) => Promise<void>
  publish: (id: string) => Promise<Page>
  duplicate: (id: string) => Promise<Page>
}

// lib/hooks/use-pages.ts
export function usePages(tenantId: string, filters?: any)
export function usePage(id: string)
export function useCreatePage()
export function useUpdatePage()
export function useDeletePage()
export function usePublishPage()
export function useDuplicatePage()
```

**Acceptance Criteria:**
- All CRUD operations working via TanStack Query
- Optimistic updates implemented
- Error handling and retry logic
- Loading and success states
- Query invalidation working correctly

---

### 2.4 Basic UI Pages (2-3 days)

**Build essential pages:**

**Tasks:**
- [ ] Login page (authentication)
- [ ] Dashboard home (stats, recent pages)
- [ ] Tenants list page (view all clients)
- [ ] Pages list page (view all pages for a tenant)
- [ ] Page view page (preview page)
- [ ] Basic navigation (sidebar, header)
- [ ] Breadcrumbs
- [ ] Loading states (skeletons)
- [ ] Error boundaries

**Components needed:**
```typescript
// components/layout/sidebar.tsx
- Navigation links
- Tenant switcher
- User menu

// components/layout/header.tsx
- Breadcrumbs
- Search
- User avatar

// components/pages/page-list.tsx
- List/grid view toggle
- Filters (status, search)
- Sort options
- Pagination

// components/pages/page-card.tsx
- Thumbnail
- Title, status
- Actions (edit, duplicate, delete, publish)
```

---

## Phase 3: Block Editor (Week 3-4)

**Goal:** Build complete block editor with canvas, panels, and all features.

### 3.1 Editor Stores (1-2 days)

**Create Zustand stores:**

**Tasks:**
- [ ] Create `editor-store.ts` (blocks, selection, history)
- [ ] Create `ui-store.ts` (panels, preview mode)
- [ ] Create `page-store.ts` (current page metadata)
- [ ] Implement undo/redo logic
- [ ] Add drag & drop state
- [ ] Test store actions

**Store Features:**
```typescript
// editor-store.ts
- sections: Section[]
- selectedBlockKey: string | null
- history: Section[][]
- historyIndex: number
- setSections(), updateBlock(), deleteBlock(), moveBlock()
- undo(), redo()

// ui-store.ts
- leftPanelOpen: boolean
- rightPanelOpen: boolean
- activePanel: 'blocks' | 'layers' | 'settings'
- previewMode: 'desktop' | 'tablet' | 'mobile'
```

---

### 3.2 Editor Canvas (2-3 days)

**Build the main editing surface:**

**Tasks:**
- [ ] Create `components/editor/canvas/editor-canvas.tsx`
- [ ] Create `components/editor/canvas/section-renderer.tsx`
- [ ] Create `components/editor/canvas/block-renderer.tsx`
- [ ] Add click-to-select functionality
- [ ] Add hover effects
- [ ] Add block overlays (selection indicators)
- [ ] Add drop zones for drag & drop
- [ ] Make canvas responsive to preview mode

**Features:**
- Render all sections and blocks
- Visual selection indicators
- Hover states
- Click to select block
- Keyboard navigation (arrow keys)

---

### 3.3 Blocks Panel (1-2 days)

**Build block library panel:**

**Tasks:**
- [ ] Create `components/editor/panels/blocks-panel.tsx`
- [ ] Create block cards (icon + label)
- [ ] Add search/filter
- [ ] Organize by categories (Content, Containers, Media)
- [ ] Add drag-to-canvas functionality
- [ ] Add click-to-add functionality

**Categories:**
- Content (Heading, Text, Button, Card, List, etc.)
- Containers (Grid, Flex, Stack, Container)
- Media (Image, Video, Audio, Embed)
- Special (Stats, Map, Logo, Icon)

---

### 3.4 Settings Panel (2-3 days)

**Build block settings editor:**

**Tasks:**
- [ ] Create `components/editor/panels/settings-panel.tsx`
- [ ] Create block-specific editors for all 24+ block types
- [ ] Use React Hook Form + Zod for validation
- [ ] Create reusable form components (text input, select, color picker, etc.)
- [ ] Add real-time preview updates
- [ ] Add responsive settings (different per breakpoint)

**Block Editors Needed:**
```typescript
// components/editor/blocks/heading-editor.tsx
- Text input
- Level select (H1-H6)
- Size select
- Alignment radio buttons
- Weight select
- Color select

// components/editor/blocks/text-editor.tsx
// components/editor/blocks/button-editor.tsx
// components/editor/blocks/image-editor.tsx
// ... (24+ editors total)
```

---

### 3.5 Toolbar & Actions (1 day)

**Build editor toolbar:**

**Tasks:**
- [ ] Create `components/editor/toolbar/editor-toolbar.tsx`
- [ ] Add undo/redo buttons
- [ ] Add save button (with indicator)
- [ ] Add publish button
- [ ] Add preview mode toggle (desktop/tablet/mobile)
- [ ] Add page settings dialog
- [ ] Show unsaved changes indicator

---

### 3.6 Drag & Drop (2-3 days)

**Implement drag-and-drop reordering:**

**Tasks:**
- [ ] Install `@dnd-kit/core`, `@dnd-kit/sortable`
- [ ] Add drag handles to blocks
- [ ] Implement block reordering within section
- [ ] Implement block movement between sections
- [ ] Add visual feedback during drag
- [ ] Handle nested block dragging
- [ ] Test thoroughly

---

### 3.7 Keyboard Shortcuts (1 day)

**Add keyboard shortcuts:**

**Tasks:**
- [ ] Cmd+Z / Cmd+Shift+Z - Undo/Redo
- [ ] Cmd+S - Save
- [ ] Cmd+P - Publish
- [ ] Delete/Backspace - Delete selected block
- [ ] Arrow keys - Navigate blocks
- [ ] Cmd+C / Cmd+V - Copy/Paste blocks
- [ ] Cmd+D - Duplicate block
- [ ] Escape - Deselect

---

## Phase 4: Polish & Testing (Week 5)

**Goal:** Production-ready application with tests, error handling, and UX improvements.

### 4.1 Error Handling (1-2 days)

**Tasks:**
- [ ] Add error boundaries
- [ ] Create error pages (404, 500)
- [ ] Add toast notifications for errors
- [ ] Add form validation errors
- [ ] Test error scenarios
- [ ] Add loading states everywhere
- [ ] Add empty states

---

### 4.2 Auto-save & Unsaved Changes (1 day)

**Tasks:**
- [ ] Implement debounced auto-save (2 seconds)
- [ ] Add "unsaved changes" indicator
- [ ] Add warning before leaving page with unsaved changes
- [ ] Add conflict resolution (if edited elsewhere)
- [ ] Test auto-save thoroughly

---

### 4.3 Responsive Design (1 day)

**Tasks:**
- [ ] Make Builder responsive (mobile-friendly)
- [ ] Test on different screen sizes
- [ ] Adjust layouts for mobile
- [ ] Hide panels on mobile
- [ ] Add mobile navigation

---

### 4.4 Testing (2-3 days)

**Tasks:**
- [ ] Write unit tests for stores
- [ ] Write unit tests for hooks
- [ ] Write integration tests for editor
- [ ] Write E2E tests for critical paths
- [ ] Test with real API
- [ ] Fix bugs found during testing

---

### 4.5 Performance Optimization (1-2 days)

**Tasks:**
- [ ] Optimize re-renders (React.memo, useMemo, useCallback)
- [ ] Add virtualization for large page lists
- [ ] Optimize bundle size
- [ ] Add code splitting
- [ ] Test performance with large pages (100+ blocks)
- [ ] Add loading skeletons

---

### 4.6 Documentation (1 day)

**Tasks:**
- [ ] Create user guide for Builder
- [ ] Document keyboard shortcuts
- [ ] Create video tutorials
- [ ] Add inline help/tooltips
- [ ] Document deployment process

---

## Phase 5: Deployment (Week 6)

**Goal:** Deploy to production.

### 5.1 Production Setup (1-2 days)

**Tasks:**
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Set up CI/CD pipeline
- [ ] Configure domain/SSL
- [ ] Set up monitoring (Sentry)
- [ ] Set up analytics

---

### 5.2 Deploy API (1 day)

**Tasks:**
- [ ] Deploy to server (Railway, Render, or AWS)
- [ ] Run database migrations
- [ ] Test all endpoints in production
- [ ] Set up database backups
- [ ] Monitor performance

---

### 5.3 Deploy Builder (1 day)

**Tasks:**
- [ ] Deploy to Vercel or similar
- [ ] Configure environment variables
- [ ] Test Builder in production
- [ ] Monitor performance
- [ ] Set up error tracking

---

### 5.4 Deploy Client (1 day)

**Tasks:**
- [ ] Deploy first client site
- [ ] Test full workflow (Builder → API → Client)
- [ ] Verify multi-tenancy works
- [ ] Test on real data

---

## Success Criteria

### API
- ✅ All block types validated correctly
- ✅ SiteConfig module working
- ✅ Multi-tenancy working perfectly
- ✅ All tests passing
- ✅ Swagger documentation complete

### Builder
- ✅ Can create/edit/delete pages
- ✅ Block editor works smoothly
- ✅ All 24+ block types editable
- ✅ Drag & drop works
- ✅ Undo/redo works
- ✅ Auto-save works
- ✅ Keyboard shortcuts work
- ✅ Responsive on all devices
- ✅ Fast performance (60fps)

### Client
- ✅ Renders pages from API correctly
- ✅ All block components work
- ✅ SEO working
- ✅ Performance optimized
- ✅ Mobile responsive

---

## Timeline Summary

- **Week 1:** API Foundation (block validation + SiteConfig)
- **Week 2:** Builder Foundation (setup + TanStack Query + basic UI)
- **Week 3-4:** Block Editor (canvas + panels + drag & drop)
- **Week 5:** Polish & Testing
- **Week 6:** Deployment

**Total:** ~6 weeks to production-ready

---

## What to Build First?

Based on current state, I recommend this order:

1. **API block validation** (2-3 days)
   - Critical for data integrity
   - Needed before Builder can save blocks

2. **API SiteConfig module** (2-3 days)
   - Important for full site management
   - Can be built in parallel with block validation

3. **Builder setup + TanStack Query** (3-4 days)
   - Foundation for everything else
   - Get data fetching working first

4. **Basic Builder UI** (2-3 days)
   - Pages list, simple editor
   - Prove API integration works

5. **Full Block Editor** (7-10 days)
   - Canvas, panels, all block editors
   - Most complex part

Ready to start building? Let me know what you'd like to tackle first!
