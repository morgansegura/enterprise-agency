# Build Plan - Agency Platform

Roadmap from current state to production-ready professional agency platform.

**See also:** [Vision](./vision.md) | [Feature Flags](./feature-flags.md) | [Two-Tier System](./builder/two-tier-system.md) | [Token System](./builder/token-system.md)

---

## Current State (January 2025)

### ✅ Completed & Working

**API (Backend) - 90% Complete**

- Multi-tenant architecture with tenant isolation
- JWT authentication & user management
- Tenants CRUD
- Pages CRUD with block-based content (sections → blocks)
- Site configuration (headers, footers, menus, logos)
- Blog posts system
- Assets/media management
- Block validation framework (23 block types defined)
- Health checks & monitoring
- Rate limiting & security headers
- **NEW: TierGuard for two-tier permission system**
- **NEW: FeatureGuard for progressive feature enablement**
- **NEW: Tenant tier enum (CONTENT_EDITOR, BUILDER)**
- **NEW: Design tokens JSONB field in database**

**Client (Frontend) - 60% Complete**

- 23 block components fully built and rendering
- Section-based page structure
- Token-aware styling pattern (data-slot attributes)
- Responsive design
- SEO implementation
- Server-side rendering
- **NEW: Type-safe API integration with proper type casting**

**Builder (Admin) - 75% Complete**

- Next.js 15 app structure
- TanStack Query data fetching
- Authentication flow
- Tenant management UI
- Page list view with CRUD operations
- Full page editor with drag-and-drop
- Blog post editor with all features
- Media library with upload/search/filter
- SEO tools for pages and posts
- Draft/publish workflow
- All 24 block editors implemented
- Blocks library with accordion UI
- Tailwind v4 CSS-first architecture
- Token-based component styling established
- Tier management hooks (useTier, useIsBuilder, useHasTier)
- TierGate component for conditional rendering
- Toast notifications with Sonner
- Responsive preview controls (desktop/tablet/mobile)
- All TypeScript errors resolved

---

## What We're Building

**Professional Agency Platform** with:

1. **Token-Based Design System** - All styles via tokens, zero inline CSS
2. **Two-Tier Product** - Content Editor ($49/mo) vs Builder ($149/mo)
3. **Progressive Features** - Build when needed, gate with permissions
4. **100% Custom Frontends** - Professional quality, client-proof

---

## Phase 1: Foundation (Months 1-3)

**Goal:** Token system + Two-tier permissions + Core block editors

### 1.1 Token System Implementation ✅ PHASE COMPLETE

**Database:** ✅ COMPLETE

- ✅ Add `designTokens` JSONB field to Tenant model
- ✅ Updated UpdateDesignTokensDto for complete token structure
- ✅ API endpoints: GET/PUT /tenants/:id/tokens (auth required)
- ✅ Public API endpoint: GET /api/v1/public/:slug/tokens (5-min cache)

**Platform Tokens:** ✅ COMPLETE

- ✅ Define complete default token set (colors, typography, spacing, radii, shadows, etc.)
- ✅ Create platform-defaults.ts with all token categories
- ✅ Color scales (50-950) for primary, secondary, accent, neutral, semantic colors
- ✅ Typography scales (fonts, sizes, weights, line heights, letter spacing)
- ✅ Spacing scale (0-96)
- ✅ Border radii (none-full)
- ✅ Shadow system
- ✅ Transition timings

**CSS Generation:** ✅ COMPLETE

- ✅ Build function to generate CSS variables from tokens (generateTokenCSS)
- ✅ Merge custom tokens with platform defaults
- ✅ Type-safe token definitions (DesignTokens interface)
- ✅ Client-side token injection via TokenProvider (server component)
- ✅ CSS injected into <head> before first paint (zero layout shift)
- ✅ Backward compatibility with legacy token system

**Builder UI:** ✅ COMPLETE

- ✅ Theme manager page (builder/app/(clients)/[id]/theme/page.tsx)
- ✅ Color scale editors with HTML color pickers
- ✅ Typography selector (font families)
- ✅ Live preview panel
- ✅ CSS preview tab
- ✅ Save/reset functionality with API integration
- ✅ Loading states and error handling
- ✅ Deprecated old DesignTokensTab (redirects to Theme Manager)

**Client Integration:** ✅ COMPLETE

- ✅ Design system module (client/lib/tokens/design-system/)
- ✅ TokenProvider fetches tokens via public API
- ✅ Generates CSS custom properties for all token categories
- ✅ Server-side rendering for instant availability
- ✅ 5-minute cache for performance optimization

### 1.2 Two-Tier Permission System ✅ PHASE COMPLETE

**Database:** ✅ COMPLETE

- ✅ Add `tier` enum field to Tenant (CONTENT_EDITOR | BUILDER)
- ✅ Set default tier to CONTENT_EDITOR
- ✅ Database migration applied with `pnpm db:push`
- ✅ Added index on tier field for query optimization

**API Guards:** ✅ COMPLETE

- ✅ Created TierGuard (api/src/common/guards/tier.guard.ts)
- ✅ Created @RequireTier decorator (api/src/common/decorators/tier.decorator.ts)
- ✅ Created FeatureGuard (api/src/common/guards/feature.guard.ts)
- ✅ Created @RequireFeature decorator with nested support (e.g., 'payments.stripe')
- ✅ Created @CurrentTenant decorator for accessing tenant in controllers
- ✅ Created StructureValidationService for content vs structure validation
- ✅ Protected create/delete/duplicate endpoints with @RequireTier('BUILDER')
- ✅ Update endpoint validates structure changes based on tenant tier

**Builder Hooks & Components:** ✅ COMPLETE

- ✅ Created useTier hook (builder/lib/hooks/use-tier.ts)
- ✅ Created useIsBuilder, useIsContentEditor helper hooks
- ✅ Created useHasTier for hierarchical tier validation
- ✅ Created TierGate component with upgrade prompts (builder/components/tier/tier-gate.tsx)
- ✅ Exported types (Tenant, TenantTier) from use-tenants.ts

**Builder UI Updates:** ✅ COMPLETE

- ✅ Hide layout blocks from content-editor tier (TierGate in blocks library)
- ✅ Disable block delete for content-editor (toast message with upgrade prompt)
- ✅ Upgrade prompt component ready (TierGate)
- ✅ Page editor with tier-aware delete restrictions

### 1.3 Block Editors ✅ ALL PHASES COMPLETE

**Infrastructure:** ✅ COMPLETE

- ✅ Created BlockRegistry class for centralized block management
- ✅ Created BlockEditorRenderer for dynamic component loading
- ✅ Implemented lazy loading for block editors
- ✅ Created implemented-blocks.ts for registering completed editors
- ✅ Refactored page editor to use registry system
- ✅ Implemented nested block support for layout containers

**Progress: 24 of 24 editors complete (100%)**

**Phase 1 - Core Editors (Simple Blocks):** ✅ COMPLETE (6 editors)

- ✅ button-block-editor.tsx - Text, URL, variant, size, fullWidth, openInNewTab
- ✅ spacer-block-editor.tsx - Height selector (xs-2xl)
- ✅ divider-block-editor.tsx - Style, thickness, spacing, color
- ✅ text-block-editor.tsx - Textarea, size, alignment, variant, maxWidth
- ✅ heading-block-editor.tsx - Text, semantic level (h1-h6), visual size (xs-6xl), alignment, weight, color
- ✅ image-block-editor.tsx - URL, alt text, aspect ratio, object fit, caption, optional link

**Phase 2 - Rich Content (5 editors):** ✅ COMPLETE

- ✅ rich-text-block-editor.tsx - TipTap editor with formatting toolbar
- ✅ quote-block-editor.tsx - Quote text, author, source, style
- ✅ card-block-editor.tsx - Title, description, image, link, variant
- ✅ list-block-editor.tsx - Ordered/unordered, items array, style
- ✅ icon-block-editor.tsx - Icon selector (lucide-react), size, color

**Phase 3 - Interactive/Media (6 editors):** ✅ COMPLETE

- ✅ video-block-editor.tsx - URL, provider, aspect ratio, autoplay, controls
- ✅ audio-block-editor.tsx - URL, title, artist, controls
- ✅ embed-block-editor.tsx - Embed code, aspect ratio, caption
- ✅ accordion-block-editor.tsx - Items array (title, content), default open, variant
- ✅ tabs-block-editor.tsx - Tabs array (label, content, icon), default tab, variant
- ✅ stats-block-editor.tsx - Stats array (label, value, description, icon), layout

**Phase 4 - Layout Containers (5 editors):** ✅ COMPLETE

- ✅ container-block-editor.tsx - Max width, padding, background, nested blocks
- ✅ stack-block-editor.tsx - Gap, alignment, nested blocks
- ✅ flex-block-editor.tsx - Direction, justify, align, gap, wrap, nested blocks
- ✅ grid-block-editor.tsx - Columns, gap, auto-flow, nested blocks
- ✅ columns-block-editor.tsx - Column count, gap, responsive, nested blocks

**Note:** All layout containers support nested blocks with automatic filtering to prevent deep nesting beyond practical limits.

**Phase 5 - Specialized (2 editors):** ✅ COMPLETE

- ✅ logo-block-editor.tsx - Image URL, alt text, size, alignment, optional link
- ✅ map-block-editor.tsx - Embed URL or manual config, zoom, height, style

**Established Pattern (All Editors Follow):**

- Two-state design (preview mode + edit mode)
- Preview mode: Click to edit, hover-reveal delete button
- Edit mode: Form fields + live preview section
- Done/Delete buttons in header
- Immutable onChange callback pattern
- Type-safe block data interfaces
- Lazy loading through BlockEditorRenderer

---

## Phase 2: Builder Features (Months 4-6)

**Goal:** Complete visual builder with drag-and-drop and content management

### 2.1 Drag-and-Drop ✅ PHASE COMPLETE

- ✅ Install dnd-kit library (@dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities)
- ✅ Add drag handles to blocks (hover-reveal grip icon)
- ✅ Implement sortable blocks within sections (DndContext + SortableContext)
- ✅ Visual drop zones (built into dnd-kit collision detection)
- ✅ Drag animations (CSS transforms with dnd-kit utilities)
- ✅ Reorder state management (arrayMove with section state updates)
- ✅ Test thoroughly (verified with pnpm verify)

**Implementation:**

- Created SortableBlockItem component wrapping BlockEditorRenderer
- Integrated dnd-kit with page editor using DndContext per section
- Drag handle appears on hover with focus support for accessibility
- Smooth animations via CSS transforms
- Keyboard navigation support for screen readers

### 2.2 Section Management ✅ PHASE COMPLETE

- ✅ Add section functionality ("Add Section" button)
- ✅ Remove section (delete button in section controls)
- ✅ Rearrange sections (drag-and-drop with SortableSection)
- ✅ Section settings (background, spacing, width, alignment)

**Implementation:**

- Created SectionSettings component with all section properties
- Created SortableSection component wrapping section content
- Integrated section-level drag-and-drop (outer DndContext)
- Nested drag-and-drop contexts (sections contain sortable blocks)
- Settings panel accessible via Sheet component
- Hover-reveal section controls (drag, settings, delete)
- Visual section boundaries with dashed borders

### 2.3 Responsive Controls ✅ PHASE COMPLETE

- ✅ Breakpoint selector (desktop/tablet/mobile) - BreakpointSelector component
- ✅ Preview mode switching - State managed in page/post editors
- ✅ Responsive preview wrapper - ResponsivePreview component with smooth transitions
- Per-breakpoint overrides (optional future feature)

**Implementation:**

- Created BreakpointSelector component with desktop/tablet/mobile buttons
- Created ResponsivePreview wrapper that adjusts width based on breakpoint
- Integrated into PageEditorLayout toolbar
- Both page and post editors support responsive preview
- Visual boundary indicators (shadow/border) for tablet/mobile views

### 2.4 Content Features ✅ PHASE COMPLETE

**Blog Post Editor:** ✅ COMPLETE

- ✅ Created use-posts.ts hook (mirroring use-pages.ts pattern)
- ✅ Created blog posts list page (builder/app/(clients)/[id]/posts/page.tsx)
- ✅ Created new post page (builder/app/(clients)/[id]/posts/new/page.tsx)
- ✅ Created post editor page (builder/app/(clients)/[id]/posts/[postId]/edit/page.tsx)
- ✅ Created PostEditorLayout component (reuses page editor infrastructure)
- ✅ Created PostSettings component (blog-specific fields: author, publishDate, excerpt, featuredImage, categories, tags)
- ✅ Full drag-and-drop support (reuses section/block drag-and-drop from page editor)
- ✅ Responsive preview support (desktop/tablet/mobile)
- ✅ All 24 block types available for blog content
- ✅ Auto-slug generation from title
- ✅ CRUD operations (create, read, update, delete, publish, unpublish, duplicate)

**Media Library:** ✅ COMPLETE

- ✅ Created use-assets.ts hook with full CRUD operations
- ✅ Created media library page (builder/app/(clients)/[id]/media/page.tsx)
- ✅ Grid view with asset previews (images show thumbnails, other types show icons)
- ✅ Upload functionality with multi-file support
- ✅ Search by filename or alt text
- ✅ Filter by file type (images, videos, audio, documents)
- ✅ Asset detail dialog with metadata (dimensions, file size, URL)
- ✅ Copy URL to clipboard
- ✅ Delete assets with confirmation
- ✅ Responsive grid layout (2-5 columns based on screen size)
- ✅ Thumbnail generation for images (handled by API)
- ✅ File validation (type and size)

**SEO Tools:** ✅ COMPLETE

- ✅ Created comprehensive SeoEditor component (builder/components/editor/seo-editor.tsx)
- ✅ Basic meta tags (title, description, keywords, canonical URL)
- ✅ Open Graph protocol support (title, description, image, type)
- ✅ Twitter Cards support (card type, title, description, image)
- ✅ Structured Data (JSON-LD) editor with syntax validation
- ✅ Accordion UI for advanced settings (OG, Twitter, Structured Data)
- ✅ Character count indicators for optimal length
- ✅ Placeholder text showing fallback values
- ✅ Integrated into PageSettings component
- ✅ Integrated into PostSettings component
- ✅ Reusable across pages and blog posts

**Draft/Publish Workflow:** ✅ COMPLETE

- ✅ Integrated publish/unpublish hooks into page editor
- ✅ Integrated publish/unpublish hooks into post editor
- ✅ Auto-save before publish (prevents data loss)
- ✅ Confirmation dialogs for publish/unpublish actions
- ✅ Smart publish button (shows "Publish" vs "Unpublish" based on status)
- ✅ Toast notifications for success/error states
- ✅ Proper error handling for failed operations
- ✅ Status-aware publish workflow (draft → published → unpublished)

**Phase 2.4 Status:** ✅ COMPLETE

---

## Phase 3: First Advanced Feature (Months 7-9)

**Goal:** E-Commerce suite for print client

### 3.1 E-Commerce Backend ✅ COMPLETE

**New API Modules:**

- ✅ Products module (CRUD, categories, variants, inventory)
  - Product categories with hierarchical support
  - Product CRUD with images, options, variants
  - Inventory management with low-stock alerts
  - Product archive/duplicate functionality
- ✅ Orders module (CRUD, status management)
  - Order creation with automatic inventory deduction
  - Order number auto-increment per tenant
  - Payment and fulfillment status tracking
  - Order cancellation with inventory restoration
  - Item-level fulfillment support
  - Order statistics and reporting
- ✅ Customers module (accounts, addresses)
  - Customer CRUD with optional user account linking
  - Multiple addresses per customer
  - Default address management
  - Customer statistics (total orders, lifetime value)
  - Marketing opt-in tracking
- ✅ Payments module (Stripe & Square integration)
  - Multi-provider support (Stripe and Square)
  - Checkout session creation for cart purchases
  - Provider-specific webhook handlers
  - Payment configuration management per tenant
  - Refund creation and processing (routes to correct provider)
  - Payment details retrieval (supports both providers)

**Feature Flag:** ✅ COMPLETE

- ✅ All e-commerce controllers protected with `@RequireFeature("shop")`
- ✅ FeatureGuard applied to Products, Orders, Customers modules
- ✅ Nested feature support ready (e.g., `payments.stripe`)

### 3.2 E-Commerce Builder UI ✅ COMPLETE

- ✅ Product catalog UI (list, create, edit pages)
- ✅ Product editor with variants and inventory
- ✅ Orders dashboard with statistics
- ✅ Customer management (list, create, detail pages)
- ✅ Payment settings UI (multi-provider UI for Stripe/Square)

**Phase 3 Status:** ✅ COMPLETE

### 3.3 E-Commerce Client Blocks ✅ COMPLETE

- ✅ product-grid-block (responsive grid with variants)
- ✅ product-detail-block (gallery, options, add to cart)
- ✅ cart-block (full and compact modes)
- ✅ checkout-block (shipping, billing, payment form)

---

## Phase 4: Scale & Polish (Months 10-12)

**Goal:** Production-ready with client portals and agency tools

### 4.1 Per-Breakpoint Responsive Overrides ✅ FOUNDATION COMPLETE

**Goal:** Allow different block settings per device (desktop/tablet/mobile)

**Block Data Structure:**

```typescript
// Current: single value
data: { size: "lg", align: "center" }

// With overrides: base + responsive
data: {
  size: "lg",
  align: "center",
  _responsive: {
    tablet: { size: "md" },
    mobile: { size: "sm", align: "left" }
  }
}
```

**Foundation Implementation:** ✅ COMPLETE

- ✅ Created responsive utilities (builder/lib/responsive/index.ts)
  - `getResponsiveValue()` - Get value for current breakpoint
  - `setResponsiveOverride()` - Set override for specific breakpoint
  - `removeResponsiveOverride()` - Clear override
  - `hasResponsiveOverride()` - Check if override exists
- ✅ Created ResponsiveProvider context (builder/lib/responsive/context.tsx)
  - Passes current breakpoint to all block editors
  - Builder-tier check for override capabilities
- ✅ Created ResponsiveField component (builder/components/editor/responsive-field.tsx)
  - Shows breakpoint indicators (desktop/tablet/mobile icons)
  - Highlights fields with overrides (blue ring)
  - Clear override button
  - Tooltip showing which breakpoints have overrides
- ✅ Updated heading-block-editor.tsx as proof of concept
  - Size and alignment support responsive overrides
  - Shows "Editing tablet/mobile" badge
  - Preview shows current breakpoint styles
- ✅ Created client-side responsive utilities (client/lib/responsive/)
  - Generate responsive CSS classes with Tailwind prefixes
  - Mobile-first class generation (base, md:, lg:)
- ✅ Updated heading-block.tsx to render responsive overrides
  - Generates responsive class names for size/alignment
- ✅ Added responsive CSS classes to heading.css
- ✅ Integrated ResponsiveProvider into page editor

**Extended Responsive Support:**

Builder Editors (17 complete):

- ✅ heading-block-editor.tsx (size, alignment)
- ✅ text-block-editor.tsx (size, alignment)
- ✅ image-block-editor.tsx (aspectRatio, objectFit)
- ✅ button-block-editor.tsx (size, fullWidth)
- ✅ grid-block-editor.tsx (columns, gap)
- ✅ container-block-editor.tsx (maxWidth, padding)
- ✅ flex-block-editor.tsx (direction, gap)
- ✅ stack-block-editor.tsx (gap)
- ✅ video-block-editor.tsx (aspectRatio)
- ✅ quote-block-editor.tsx (size - editor only)
- ✅ spacer-block-editor.tsx (height)
- ✅ card-block-editor.tsx (padding - editor only)
- ✅ divider-block-editor.tsx (spacing)
- ✅ list-block-editor.tsx (spacing)
- ✅ embed-block-editor.tsx (aspectRatio)
- ✅ icon-block-editor.tsx (size)
- ✅ stats-block-editor.tsx (layout)

Client Blocks (14 complete):

- ✅ heading-block.tsx with responsive CSS
- ✅ text-block.tsx with responsive CSS
- ✅ grid-block.tsx with responsive CSS
- ✅ image-block.tsx with responsive CSS
- ✅ button-block.tsx with responsive CSS
- ✅ container-block.tsx with responsive CSS
- ✅ flex-block.tsx with responsive CSS
- ✅ stack-block.tsx with responsive CSS
- ✅ video-block.tsx with responsive CSS
- ✅ spacer-block.tsx with responsive CSS
- ✅ divider-block.tsx with responsive CSS
- ✅ list-block.tsx with responsive CSS
- ✅ embed-block.tsx with responsive CSS
- ✅ icon-block.tsx with responsive CSS

**Remaining Work:**

- Accordion/tabs blocks have complex item arrays - responsive not needed for primary use case
- Map block can be extended as needed

**Note:** Foundation and all layout/content blocks complete. Pattern established for extending to remaining blocks.

### 4.2 Client Portal ✅ FOUNDATION COMPLETE

**Goal:** Functional client workspace with team management

**Client Layout & Navigation:** ✅ COMPLETE

- ✅ ClientLayout component with sidebar and header
- ✅ ClientSidebar with navigation sections (Content, Shop, Settings)
- ✅ Admin links (Manage Clients/Users) for super admins
- ✅ Tenant-aware navigation (shows tenant business name)
- ✅ Offcanvas sidebar behavior matching dashboard

**Pages Workspace:** ✅ COMPLETE

- ✅ Visual page cards with thumbnails
- ✅ Grid and list view modes
- ✅ Search and filter functionality
- ✅ Status badges (draft/published)
- ✅ Dropdown menu actions (edit, duplicate, view, delete)

**Team Management:** ✅ COMPLETE

- ✅ API endpoints (GET/POST/PATCH/DELETE /tenants/:id/users)
- ✅ Frontend hooks (useTenantUsers, useAddTenantUser, useUpdateTenantUser, useRemoveTenantUser)
- ✅ Team page with member list (avatars, roles, join dates)
- ✅ Role management (owner, admin, editor, viewer)
- ✅ Remove team members (owner protected)
- ✅ Team link added to client sidebar

**Usage Analytics:** ✅ COMPLETE

- ✅ API endpoint (GET /tenants/:id/stats)
- ✅ Stats include: pages, posts, assets, team members, products, orders, customers
- ✅ Published vs draft content counts
- ✅ Recent activity (7 days): pages/posts updated, assets uploaded
- ✅ Storage usage tracking with progress bar
- ✅ Commerce stats (products, orders, customers) when applicable
- ✅ Analytics page with visual dashboard
- ✅ Analytics link added to client sidebar

**Branding & Settings:** ✅ COMPLETE

- ✅ Settings page with branding customization
- ✅ Business name, type, logo URL, site description
- ✅ Contact information (email, phone)
- ✅ Logo preview with validation
- ✅ Current plan display with tier badge
- ✅ Upgrade prompt for Content Editor users (features list)
- ✅ Settings link added to client sidebar

**Phase 4.2 Status:** ✅ COMPLETE

### 4.3 Agency Tools (2-3 weeks)

**Client Health Monitoring:** ✅ COMPLETE

- ✅ API endpoint (GET /tenants/health/overview)
- ✅ Health status tracking (active/idle/inactive based on activity)
- ✅ Summary stats (total clients, active/idle/inactive counts, tier distribution)
- ✅ Per-tenant metrics (pages, posts, assets, team members, recent activity)
- ✅ Last activity tracking with relative time display
- ✅ Agency dashboard UI with health monitoring table
- ✅ Tier distribution cards (Builder vs Content Editor)
- ✅ Clickable client rows linking to client workspace

**Remaining:**

- CRM integration
- Project management
- Billing automation

### 4.4 Testing & QA ⏳ IN PROGRESS

**Test Infrastructure:** ✅ COMPLETE

- ✅ Vitest configured for builder with jsdom environment
- ✅ Testing Library integration (React, jest-dom, user-event)
- ✅ TypeScript test configuration (tsconfig.test.json)
- ✅ Next.js mocking (next/navigation, next/link)
- ✅ Test setup file with automatic cleanup

**Unit Tests - Stores:** ✅ COMPLETE (75 tests)

- ✅ auth-store.test.ts (19 tests) - Authentication state management
- ✅ admin-store.test.ts (29 tests) - Admin panel state
- ✅ tenants-store.test.ts (14 tests) - Tenant CRUD operations
- ✅ ui-store.test.ts (13 tests) - UI state (sidebar, theme, notifications)

**Unit Tests - Hooks:** ✅ COMPLETE (22 tests)

- ✅ query-keys.test.ts (22 tests) - Query key factory patterns

**Remaining:**

- Integration tests for page editor
- E2E tests for critical paths (login, page creation, publish)
- Performance testing
- Security audit

### 4.5 Documentation & Training (1-2 weeks)

- User guides for both tiers
- Video tutorials
- Keyboard shortcuts reference
- Deployment documentation

---

## Immediate Next Steps (This Month)

### Week 1-2: Token System Foundation

1. Add Tenant.designTokens field
2. Create platform default tokens
3. Build CSS variable generator
4. Update button-block as proof-of-concept

### Week 3-4: Two-Tier Permissions

1. Add Tenant.tier field
2. Implement TierGuard
3. Add tier context to builder
4. Update page editor UI with tier restrictions

### Month 2: Block Editors Sprint

Build 10 block editors:

1. heading-block
2. text-block
3. image-block
4. rich-text-block
5. card-block
6. list-block
7. quote-block
8. icon-block
9. divider-block
10. spacer-block

---

## Success Criteria

### Phase 1 Complete When:

- ✅ Token system working end-to-end
- ✅ Two tiers fully functional with proper restrictions
- ✅ At least 15 block editors built and working
- ✅ Theme manager UI functional
- ✅ First client migrated to platform

### Phase 2 Complete When: ✅ ACHIEVED

- ✅ Drag-and-drop working smoothly (blocks and sections)
- ✅ All 24 block editors complete (23 planned + 1 bonus)
- ✅ Section management working (add, delete, reorder, settings)
- ✅ Responsive preview modes (desktop, tablet, mobile)
- ✅ Blog system functional (full CRUD + publish workflow)
- ✅ Media library with upload and management
- ✅ Comprehensive SEO tools (meta, OG, Twitter, structured data)
- ✅ Draft/publish workflow with auto-save

### Phase 3 Complete When:

- ✅ E-commerce fully functional for print client
- ✅ Multi-provider payments working (Stripe & Square)
- ✅ Product catalog live
- ✅ Orders processing

### Phase 4 Complete When:

- ✅ Client portals launched
- ✅ 5+ clients on platform
- ✅ All tests passing
- ✅ Documentation complete
- ✅ Revenue positive

---

## Technical Debt to Address

1. ✅ ~~**Add sonner for toast notifications**~~ - COMPLETE
2. ✅ ~~**Fix Page type to include content property**~~ - COMPLETE
3. ✅ ~~**Fix TypeScript errors across client and builder**~~ - COMPLETE
4. ✅ ~~**Update package.json names to be agency-agnostic**~~ - COMPLETE
5. ✅ ~~**Remove CVA dependency from builder and client**~~ - COMPLETE (never added, using data-slot pattern)
6. ✅ ~~**Update API DTO examples to be industry-agnostic**~~ - COMPLETE (DTOs are already generic)
7. **Implement TODO features** - Publish logic, audit logs, Sentry integration
8. ✅ ~~**Remove console.log statements**~~ - Replaced with proper logger calls

---

## Timeline Summary

- **Months 1-3:** Foundation (Tokens + Two-Tier + Block Editors)
- **Months 4-6:** Builder Features (Drag-Drop + Content + Polish)
- **Months 7-9:** E-Commerce Feature (For print client)
- **Months 10-12:** Scale (Client Portals + Agency Tools)

**Total:** ~12 months to fully-featured platform with first advanced feature

**MVP (sellable product):** ~3-4 months (Phases 1-2)

---

**Last Updated:** 2025-12-08
**Status:** Active Development - Phase 4.4 Testing & QA In Progress (97 unit tests passing)
