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

**Builder (Admin) - 35% Complete**

- Next.js 15 app structure
- TanStack Query data fetching
- Authentication flow
- Tenant management UI
- Page list view
- Basic page editor (PageEditorLayout)
- Blocks library with accordion UI
- Button block editor (full CRUD working)
- Tailwind v4 CSS-first architecture
- Token-based component styling established
- **NEW: Tier management hooks (useTier, useIsBuilder, useHasTier)**
- **NEW: TierGate component for conditional rendering**
- **NEW: Toast notifications with Sonner**
- **NEW: All TypeScript errors resolved**

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

### 1.1 Token System Implementation (3-4 weeks)

**Database:**

- Add `designTokens` JSONB field to Tenant model
- Add `useCustomTokens` boolean field
- Create migration

**Platform Tokens:**

- Define complete default token set (colors, typography, spacing, radii, shadows, etc.)
- Create platform-defaults.ts with all token categories
- Color scales (50-950) for primary, secondary, accent, neutral, semantic colors
- Typography scales (fonts, sizes, weights, line heights, letter spacing)
- Spacing scale (0-96)
- Border radii (none-full)
- Shadow system
- Transition timings

**CSS Generation:**

- Build function to generate CSS variables from tokens
- Create middleware to inject tenant tokens into client CSS
- Update all client components to use CSS variables

**Builder UI:**

- Theme manager page (token editor)
- Color scale editor
- Typography selector
- Spacing adjuster
- Live preview iframe
- Save/publish theme

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
- ⏳ Implement content vs structure validation in PagesService (pending)
- ⏳ Protect create/delete endpoints with tier checks (pending)

**Builder Hooks & Components:** ✅ COMPLETE

- ✅ Created useTier hook (builder/lib/hooks/use-tier.ts)
- ✅ Created useIsBuilder, useIsContentEditor helper hooks
- ✅ Created useHasTier for hierarchical tier validation
- ✅ Created TierGate component with upgrade prompts (builder/components/tier/tier-gate.tsx)
- ✅ Exported types (Tenant, TenantTier) from use-tenants.ts

**Builder UI Updates:** ⏳ IN PROGRESS

- ⏳ Hide blocks library for content-editor tier (pending)
- ⏳ Disable block add/remove/rearrange for content-editor (pending)
- ✅ Upgrade prompt component ready (TierGate)
- ⏳ Update page editor with tier-aware UI (pending)

### 1.3 Block Editors ✅ PHASE 1 COMPLETE, IN PROGRESS

**Infrastructure:** ✅ COMPLETE

- ✅ Created BlockRegistry class for centralized block management
- ✅ Created BlockEditorRenderer for dynamic component loading
- ✅ Implemented lazy loading for block editors
- ✅ Created implemented-blocks.ts for registering completed editors
- ✅ Refactored page editor to use registry system

**Progress: 6 of 24 editors complete (25%)**

**Phase 1 - Core Editors (Simple Blocks):** ✅ COMPLETE (5 editors)

- ✅ button-block-editor.tsx - Text, URL, variant, size, fullWidth, openInNewTab
- ✅ spacer-block-editor.tsx - Height selector (xs-2xl)
- ✅ divider-block-editor.tsx - Style, thickness, spacing, color
- ✅ text-block-editor.tsx - Textarea, size, alignment, variant, maxWidth
- ✅ heading-block-editor.tsx - Text, semantic level (h1-h6), visual size (xs-6xl), alignment, weight, color
- ✅ image-block-editor.tsx - URL, alt text, aspect ratio, object fit, caption, optional link

**Phase 2 - Rich Content (5 editors):** ⏳ PENDING

- rich-text-block-editor.tsx - TipTap editor with formatting toolbar
- quote-block-editor.tsx - Quote text, author, source, style
- card-block-editor.tsx - Title, description, image, link, variant
- list-block-editor.tsx - Ordered/unordered, items array, style
- icon-block-editor.tsx - Icon selector (lucide-react), size, color

**Phase 3 - Interactive/Media (6 editors):** ⏳ PENDING

- video-block-editor.tsx - URL, autoplay, controls, aspect ratio
- audio-block-editor.tsx - URL, controls, title
- embed-block-editor.tsx - Embed code, aspect ratio
- accordion-block-editor.tsx - Items array (title, content), default open
- tabs-block-editor.tsx - Tabs array (label, content), default tab
- stats-block-editor.tsx - Stats array (label, value, description, icon)

**Phase 4 - Layout Containers (5 editors):** ⏳ PENDING (requires nested block support)

- container-block-editor.tsx - Max width, padding, background
- stack-block-editor.tsx - Gap, alignment, direction
- flex-block-editor.tsx - Direction, justify, align, gap, wrap
- grid-block-editor.tsx - Columns (responsive), gap, auto-flow
- columns-block-editor.tsx - Column count, gap, responsive breakpoints

**Phase 5 - Specialized (2 editors):** ⏳ PENDING

- logo-block-editor.tsx - Image upload, size, alignment
- map-block-editor.tsx - Location, zoom, markers, style

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

### 2.1 Drag-and-Drop (2-3 weeks)

- Install dnd-kit library
- Add drag handles to blocks
- Implement sortable blocks within sections
- Visual drop zones
- Drag animations
- Reorder state management
- Test thoroughly

### 2.2 Section Management (1-2 weeks)

- Add section functionality
- Remove section
- Rearrange sections
- Section settings (background, padding, max-width)

### 2.3 Responsive Controls (2 weeks)

- Breakpoint selector (desktop/tablet/mobile)
- Preview mode switching
- Responsive iframe
- Per-breakpoint overrides (optional future feature)

### 2.4 Content Features (2-3 weeks)

- Blog post editor (similar to page editor)
- Media library enhancements (upload, organize, search)
- SEO tools (meta tags, og tags, structured data)
- Draft/publish workflow improvements

---

## Phase 3: First Advanced Feature (Months 7-9)

**Goal:** E-Commerce suite for print client

### 3.1 E-Commerce Backend (4-5 weeks)

**New API Modules:**

- Products module (CRUD, categories, variants, inventory)
- Orders module (CRUD, status management)
- Customers module (accounts, addresses)
- Payments module (Stripe integration)

**Feature Flag:**

- Add `shop` feature flag
- Add `products`, `payments.stripe` flags
- Protect routes with FeatureGuard

### 3.2 E-Commerce Builder UI (3-4 weeks)

- Product catalog UI
- Product editor
- Orders dashboard
- Customer management
- Stripe settings

### 3.3 E-Commerce Client Blocks (2 weeks)

- product-grid-block
- product-detail-block
- cart-block
- checkout-block

---

## Phase 4: Scale & Polish (Months 10-12)

**Goal:** Production-ready with client portals and agency tools

### 4.1 Client Portal (3-4 weeks)

- White-label client dashboards
- Per-tenant branding
- Usage analytics
- Self-service upgrades
- Team member management

### 4.2 Agency Tools (2-3 weeks)

- CRM integration
- Project management
- Client health monitoring
- Billing automation

### 4.3 Testing & QA (2 weeks)

- Unit tests for all stores and hooks
- Integration tests for editor
- E2E tests for critical paths
- Performance testing
- Security audit

### 4.4 Documentation & Training (1-2 weeks)

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

### Phase 2 Complete When:

- ✅ Drag-and-drop working smoothly
- ✅ All 23 block editors complete
- ✅ Section management working
- ✅ Responsive preview modes
- ✅ Blog system functional

### Phase 3 Complete When:

- ✅ E-commerce fully functional for print client
- ✅ Stripe payments working
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
5. **Remove CVA dependency from builder and client** - Use data-slot pattern instead
6. **Update API DTO examples to be industry-agnostic** - Remove church-specific examples
7. **Implement TODO features** - Publish logic, audit logs, Sentry integration
8. **Remove console.log statements** - Replace with proper logger calls

---

## Timeline Summary

- **Months 1-3:** Foundation (Tokens + Two-Tier + Block Editors)
- **Months 4-6:** Builder Features (Drag-Drop + Content + Polish)
- **Months 7-9:** E-Commerce Feature (For print client)
- **Months 10-12:** Scale (Client Portals + Agency Tools)

**Total:** ~12 months to fully-featured platform with first advanced feature

**MVP (sellable product):** ~3-4 months (Phases 1-2)

---

**Last Updated:** 2025-01-22
**Status:** Active Development - Phase 1 in Progress
