# Enterprise Agency Platform - Complete Roadmap

A premium, enterprise-grade web application platform for building and managing client websites.

---

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [Architecture](#architecture)
3. [MVP Definition](#mvp-definition)
4. [Feature Roadmap](#feature-roadmap)
5. [Quality Standards](#quality-standards)
6. [Implementation Phases](#implementation-phases)

---

## Platform Overview

### Vision

Build a **premium agency platform** that enables:
- Rapid webapp development for clients
- Professional, enterprise-grade output
- Self-service client portals
- Comprehensive marketing & analytics
- Revenue of $2,000+/month per client

### Three Applications

| App | Purpose | Port | Status |
|-----|---------|------|--------|
| **API** | NestJS backend, multi-tenant | 4000 | 90% |
| **Builder** | Admin/editing interface | 4001 | 60% |
| **Client** | Public-facing websites | 4002 | 50% |

### Tech Stack

- **Backend:** NestJS, Prisma, PostgreSQL
- **Frontend:** Next.js 15, React 19, TailwindCSS 4
- **State:** Zustand, TanStack Query
- **Packages:** @enterprise/tokens (shared design system)

---

## Architecture

### Settings Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                     GLOBAL SETTINGS                          │
│  (Platform defaults, tenant overrides)                       │
│  Colors, Typography, Animations, Components, Loading, SEO    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      PAGE SETTINGS                           │
│  (Per-page overrides)                                        │
│  SEO, Layout, Header/Footer, Custom CSS                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    SECTION SETTINGS                          │
│  (Visual sections on page)                                   │
│  Background, Spacing, Width, Effects, Visibility             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   CONTAINER SETTINGS                         │
│  (Layout containers within sections)                         │
│  Layout, Gap, Alignment, Responsive behavior                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   COMPONENT SETTINGS                         │
│  (Individual blocks/components)                              │
│  Content, Styling, Behavior, Responsive overrides            │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Tenant Tokens (DB) → CSS Variables → Components → Rendered Output
                  ↑
         Builder UI (Settings Panels)
```

---

## MVP Definition

**Goal:** Ship a working webapp builder that clients can use

### MVP Checklist

#### API (Backend)
- [x] Multi-tenant architecture
- [x] Authentication (JWT)
- [x] Pages CRUD
- [x] Posts CRUD
- [x] Assets CRUD
- [x] Site configuration
- [x] Design tokens API
- [x] Public API for client rendering
- [ ] **Fix:** TypeScript errors in tokens package

#### Builder (Admin)
- [x] Authentication flow
- [x] Tenant management
- [x] Page editor with blocks
- [x] Post editor
- [x] Media library
- [x] Basic SEO tools
- [ ] **Global Settings** (in progress)
  - [x] Colors panel
  - [x] Typography panel
  - [x] Animation panel
  - [x] Component panel
  - [x] Loading panel
  - [x] SEO panel
  - [ ] Wire settings to CSS variables
- [ ] **Core Editor Features**
  - [ ] Undo/Redo
  - [ ] Keyboard shortcuts
  - [ ] Copy/paste blocks
- [ ] **Usability**
  - [ ] Command palette
  - [ ] Layers panel
  - [ ] History panel

#### Client (Frontend)
- [x] Page rendering
- [x] Section/block system
- [x] Token-based styling
- [x] SEO metadata
- [x] Responsive design
- [ ] **Blog rendering** (posts list, post detail)
- [ ] **Token integration** (CSS variables from API)

### MVP Success Criteria

1. **Can create a page** with multiple sections and blocks
2. **Can publish** and see it live on client app
3. **Can customize** colors, typography via settings
4. **Can add blog posts** and see them on client
5. **Can upload media** and use in pages
6. **Undo mistakes** with Ctrl+Z
7. **No crashes** or data loss

---

## Feature Roadmap

### Phase 1: Foundation (Current)

#### 1.1 Global Settings System
**Status:** In Progress

| Setting Panel | Purpose | Status |
|--------------|---------|--------|
| Colors | Brand & UI colors | ✅ Built |
| Typography | Fonts, scales, roles | ✅ Built |
| Animations | Motion, transitions | ✅ Built |
| Components | Dropdowns, modals, drawers | ✅ Built |
| Loading | Skeletons, loaders, placeholders | ✅ Built |
| SEO | Meta, schema, analytics, redirects | ✅ Built |
| Site | Pages, navigation, branding | 🔄 Partial |
| Buttons | Button styles per size | 🔄 Partial |
| Inputs | Form input styles | 🔄 Partial |
| Cards | Card component styles | 🔄 Partial |

**Remaining Work:**
- Wire all settings to CSS variable generation
- Ensure settings persist and load correctly
- Add reset to defaults functionality
- Add import/export settings

#### 1.2 Page-Level Settings
**Status:** Planned

| Setting | Description |
|---------|-------------|
| SEO | Title, description, OG, Twitter, schema |
| Layout | Header style, footer style, sidebar |
| Spacing | Page padding, content width |
| Background | Color, image, gradient |
| Custom CSS | Page-specific styles |
| Visibility | Draft, published, password protected |
| Scheduling | Publish date, unpublish date |

#### 1.3 Section Settings
**Status:** Partial (needs expansion)

| Setting | Description |
|---------|-------------|
| Background | Color, gradient, image, video, overlay |
| Spacing | Padding top/bottom, margin |
| Width | Full, contained, narrow |
| Height | Auto, viewport, fixed |
| Alignment | Content position (9-point grid) |
| Effects | Shadow, border, rounded corners |
| Visibility | Show/hide per breakpoint |
| Animation | Entrance animation, scroll effects |
| Anchor | ID for navigation links |

#### 1.4 Container Settings
**Status:** Partial

| Setting | Description |
|---------|-------------|
| Layout | Stack, flex, grid |
| Direction | Row, column (for flex) |
| Columns | Number of columns (for grid) |
| Gap | Spacing between items |
| Alignment | Justify, align items |
| Wrap | Wrap behavior |
| Responsive | Per-breakpoint overrides |

#### 1.5 Component Settings
**Status:** Partial (per-block editors exist)

Each block type needs:
- Content editing
- Style overrides
- Responsive settings
- Animation settings
- Visibility settings

---

### Phase 2: Core Editor Experience

#### 2.1 Undo/Redo System
**Priority:** Critical

```typescript
interface HistoryStore {
  past: PageState[];
  present: PageState;
  future: PageState[];

  push: (state: PageState) => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;

  canUndo: boolean;
  canRedo: boolean;
}
```

**Features:**
- Cmd/Ctrl+Z to undo
- Cmd/Ctrl+Shift+Z to redo
- Toolbar buttons with state
- Group related changes (batch)
- Persist across session (optional)

#### 2.2 Keyboard Shortcuts
**Priority:** Critical

| Category | Shortcuts |
|----------|-----------|
| **File** | Save (Cmd+S), Publish (Cmd+Shift+P) |
| **Edit** | Undo, Redo, Copy, Paste, Duplicate, Delete |
| **Navigation** | Command palette (Cmd+K), Layers (Cmd+L) |
| **View** | Preview (Cmd+E), Responsive (Cmd+1/2/3) |
| **Blocks** | Add block (Cmd+/), Search blocks |

**Implementation:**
- Central keyboard handler
- User-configurable shortcuts
- Shortcut hints in UI
- Cheat sheet modal (Cmd+?)

#### 2.3 Clipboard (Copy/Paste)
**Priority:** High

- Copy block (Cmd+C)
- Cut block (Cmd+X)
- Paste block (Cmd+V)
- Duplicate block (Cmd+D)
- Copy section
- Copy across pages
- Paste as reference (linked)
- Paste style only

#### 2.4 Command Palette
**Priority:** High

```
┌─────────────────────────────────────────────┐
│ 🔍 Type a command or search...              │
├─────────────────────────────────────────────┤
│ RECENT                                      │
│   ↵ Add Heading block                       │
│   ↵ Open SEO settings                       │
├─────────────────────────────────────────────┤
│ ACTIONS                                     │
│   ↵ Save page                    ⌘S         │
│   ↵ Publish page                 ⌘⇧P        │
│   ↵ Preview page                 ⌘E         │
├─────────────────────────────────────────────┤
│ BLOCKS                                      │
│   ↵ Add Heading                             │
│   ↵ Add Text                                │
│   ↵ Add Image                               │
├─────────────────────────────────────────────┤
│ SETTINGS                                    │
│   ↵ Page settings                           │
│   ↵ SEO settings                            │
│   ↵ Global settings                         │
└─────────────────────────────────────────────┘
```

#### 2.5 Layers Panel
**Priority:** High

- Tree view of page structure
- Section → Container → Block hierarchy
- Drag to reorder
- Click to select/focus
- Eye icon to hide/show
- Lock icon to prevent editing
- Right-click context menu
- Search/filter

#### 2.6 History Panel
**Priority:** Medium

- List of all changes
- Timestamp for each
- Action description
- Click to restore
- Mark save points
- Compare versions

---

### Phase 3: Advanced Editor Features

#### 3.1 Multi-Select
- Shift+click for range
- Cmd+click for individual
- Drag to box select
- Select all (Cmd+A)
- Bulk delete/move/duplicate
- Group selection

#### 3.2 Zoom Controls
- Zoom slider (25% - 200%)
- Fit to screen
- Zoom to selection
- Mouse wheel zoom
- Keyboard shortcuts (+/-)

#### 3.3 Grid & Guides
- Show grid overlay
- Snap to grid
- Alignment guides
- Spacing indicators
- Ruler display

#### 3.4 Templates
- Save block as template
- Save section as template
- Save page as template
- Template library browser
- Starter templates
- Industry-specific templates

#### 3.5 Autosave & Drafts
- Autosave every 30 seconds
- Manual save
- Draft versions
- Conflict resolution
- Offline support

---

### Phase 4: Content Management

#### 4.1 Blog System
**Status:** Editor done, client rendering missing

**Builder:**
- [x] Post list page
- [x] Post create/edit
- [x] Post settings (author, date, excerpt, categories, tags)
- [x] Featured image
- [x] Publish/unpublish
- [ ] Categories management UI
- [ ] Tags management UI
- [ ] Author profiles

**Client:**
- [ ] Blog list page (/blog)
- [ ] Post detail page (/blog/[slug])
- [ ] Category pages (/blog/category/[slug])
- [ ] Tag pages (/blog/tag/[slug])
- [ ] Author pages (/blog/author/[slug])
- [ ] Search/filter
- [ ] Pagination
- [ ] Related posts
- [ ] Comments (optional)

#### 4.2 Media Library Enhancements
- [ ] Folders/organization
- [ ] Bulk upload
- [ ] Image editing (crop, resize)
- [ ] Alt text management
- [ ] Usage tracking (where is image used)
- [ ] CDN integration
- [ ] Lazy loading optimization

#### 4.3 Navigation Builder
- [ ] Menu management
- [ ] Drag-and-drop menu items
- [ ] Nested menus
- [ ] Mega menus
- [ ] Mobile menu settings
- [ ] Multiple menu locations

#### 4.4 Forms System
- [ ] Form builder
- [ ] Field types (text, email, phone, select, etc.)
- [ ] Validation rules
- [ ] Submission handling
- [ ] Email notifications
- [ ] Spam protection
- [ ] Submission management
- [ ] Integrations (CRM, email marketing)

---

### Phase 5: E-Commerce (Existing)

**Status:** API complete, builder UI complete

- [x] Products CRUD
- [x] Categories
- [x] Variants
- [x] Inventory
- [x] Orders management
- [x] Customer management
- [x] Stripe integration
- [x] Square integration
- [ ] Client-side shop blocks
- [ ] Cart functionality
- [ ] Checkout flow

---

### Phase 6: Marketing & Analytics

See: [Marketing Platform Documentation](./marketing-platform.md)

#### 6.1 Analytics
- [ ] Page view tracking
- [ ] Visitor sessions
- [ ] Traffic sources
- [ ] Device/browser stats
- [ ] Real-time dashboard
- [ ] Goal tracking
- [ ] Funnel analysis
- [ ] Event tracking

#### 6.2 SEO Suite
- [ ] SEO audit/scoring
- [ ] Keyword tracking
- [ ] Content optimization
- [ ] Technical SEO checks
- [ ] AEO (Answer Engine Optimization)
- [ ] GEO (Generative Engine Optimization)

#### 6.3 Social & Marketing
- [ ] Social preview cards
- [ ] Share tracking
- [ ] UTM builder
- [ ] Campaign tracking
- [ ] Email marketing integration

---

### Phase 7: Client Portal

#### 7.1 Portal Features
- [ ] Client login
- [ ] Dashboard with stats
- [ ] Content editing (tier-based)
- [ ] Team management
- [ ] Billing/invoices
- [ ] Support tickets
- [ ] Activity log

#### 7.2 Agency Dashboard
- [ ] All clients overview
- [ ] Health monitoring
- [ ] Revenue tracking
- [ ] Project management
- [ ] Team workload
- [ ] White-labeling

---

### Phase 8: Advanced Features

#### 8.1 Collaboration
- [ ] Real-time editing
- [ ] User presence
- [ ] Comments on blocks
- [ ] Approval workflows
- [ ] Notifications

#### 8.2 Internationalization
- [ ] Multi-language content
- [ ] RTL support
- [ ] Language switcher
- [ ] Translation workflow

#### 8.3 Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Accessibility checker
- [ ] Screen reader optimization
- [ ] Keyboard navigation
- [ ] Color contrast validation

#### 8.4 Performance
- [ ] Core Web Vitals monitoring
- [ ] Image optimization
- [ ] Code splitting
- [ ] Edge caching
- [ ] Performance budgets

---

## Quality Standards

### Enterprise-Grade Criteria

#### Code Quality
- TypeScript strict mode
- ESLint + Prettier
- No `any` types
- Comprehensive error handling
- Logging and monitoring
- Unit tests (>80% coverage)
- E2E tests for critical paths

#### UI/UX Quality
- Consistent design language
- Responsive across devices
- Fast interactions (<100ms)
- Loading states for all async
- Error states with recovery
- Empty states with guidance
- Accessibility compliant

#### Performance
- Lighthouse score >90
- First Contentful Paint <1.5s
- Time to Interactive <3s
- Core Web Vitals passing
- Bundle size optimized

#### Security
- Input validation
- XSS prevention
- CSRF protection
- Rate limiting
- Audit logging
- Data encryption
- Role-based access

#### Reliability
- Error boundaries
- Graceful degradation
- Offline support
- Autosave/recovery
- Backup systems
- 99.9% uptime target

---

## Implementation Phases

### Sprint 1: MVP Foundation (2 weeks)
**Goal:** Working page builder with basic features

1. Fix TypeScript errors in tokens package
2. Complete global settings → CSS variable wiring
3. Implement undo/redo system
4. Add basic keyboard shortcuts
5. Add copy/paste blocks
6. Create blog rendering on client

**Deliverable:** Can build a page with sections/blocks, publish it, and see it live

### Sprint 2: Editor Experience (2 weeks)
**Goal:** Professional editing experience

1. Command palette
2. Layers panel
3. History panel
4. All keyboard shortcuts
5. Page-level settings panel
6. Section settings panel

**Deliverable:** Fast, intuitive editing with recovery options

### Sprint 3: Content System (2 weeks)
**Goal:** Complete content management

1. Container settings panel
2. Component settings per block type
3. Blog system completion
4. Categories/tags management
5. Navigation builder
6. Media library enhancements

**Deliverable:** Full CMS capabilities

### Sprint 4: Polish & Launch (2 weeks)
**Goal:** Production-ready

1. Templates system
2. Multi-select & bulk actions
3. Zoom controls
4. Error handling audit
5. Performance optimization
6. Documentation completion

**Deliverable:** Launch-ready platform

### Post-Launch Sprints
- Sprint 5: E-commerce client blocks
- Sprint 6: Analytics infrastructure
- Sprint 7: SEO audit system
- Sprint 8: Client portal
- Sprint 9: Collaboration features
- Sprint 10: Marketing tools

---

## File Structure (Settings Pattern)

```
builder/components/settings/
├── index.ts                      # Exports all settings
├── global-settings-drawer.tsx    # Main settings drawer
├── global-settings-types.ts      # Shared types
│
├── # Global Setting Panels
├── color-settings-panel.tsx
├── typography-settings-panel.tsx
├── animation-settings-panel.tsx
├── component-settings-panel.tsx
├── loading-settings-panel.tsx
├── seo-settings-panel.tsx
├── button-settings-panel.tsx
├── input-settings-panel.tsx
├── card-settings-panel.tsx
│
├── # Page/Section/Container Settings
├── page-settings-panel.tsx       # Per-page settings
├── section-settings-panel.tsx    # Per-section settings
├── container-settings-panel.tsx  # Per-container settings
│
└── # Shared Components
    ├── settings-field.tsx
    ├── settings-section.tsx
    ├── color-picker.tsx
    ├── spacing-control.tsx
    └── responsive-control.tsx
```

---

## DRY Pattern for Settings

### Panel Template

```typescript
// settings/{entity}-settings-panel.tsx

"use client";

import * as React from "react";
import {
  SettingsSection,
  SettingsGridBlock,
  SettingsField,
} from "@/components/ui/settings-drawer";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

// ============================================================================
// Types
// ============================================================================

export interface EntitySettingsData {
  // Define all settings for this entity
  property1: string;
  property2: boolean;
  nested: {
    property3: string;
  };
}

export const defaultEntitySettings: EntitySettingsData = {
  property1: "default",
  property2: true,
  nested: {
    property3: "default",
  },
};

// ============================================================================
// Options (for selects)
// ============================================================================

const property1Options = [
  { value: "option1", label: "Option 1", description: "Description" },
  { value: "option2", label: "Option 2", description: "Description" },
];

// ============================================================================
// Component
// ============================================================================

interface EntitySettingsPanelProps {
  settings: EntitySettingsData;
  onChange: (settings: EntitySettingsData) => void;
}

export function EntitySettingsPanel({
  settings,
  onChange,
}: EntitySettingsPanelProps) {
  // Helper to update nested properties
  const update = <K extends keyof EntitySettingsData>(
    key: K,
    value: EntitySettingsData[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  const updateNested = <K extends keyof EntitySettingsData["nested"]>(
    key: K,
    value: EntitySettingsData["nested"][K]
  ) => {
    onChange({
      ...settings,
      nested: { ...settings.nested, [key]: value },
    });
  };

  return (
    <SettingsSection
      title="Entity Settings"
      description="Configure entity properties"
    >
      <SettingsGridBlock title="Category Name">
        <div className="col-span-2 space-y-4">
          {/* Settings fields */}
        </div>
      </SettingsGridBlock>
    </SettingsSection>
  );
}
```

---

## Next Steps

1. **Review this document** - confirm priorities and features
2. **Continue global settings** - wire to CSS variables
3. **Build undo/redo** - foundational for all future work
4. **Complete MVP checklist** - one item at a time

---

**Last Updated:** 2025-12-30
**Version:** 1.0
**Status:** Active Planning
