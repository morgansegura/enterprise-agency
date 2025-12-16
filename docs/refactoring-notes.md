# Refactoring Notes

Technical debt and improvement tracking for the Enterprise Agency Platform.

## Current Focus

**Priority: Section Blocks, Header, and Footer**

The section block pattern is being perfected first, then applied to headers, footers, and all other blocks. This establishes the canonical pattern for the entire system.

### Target Pattern

```
Section → Container → Blocks
```

- **Section**: Background, padding, width constraints, responsive behavior
- **Container**: Inner content wrapper with max-width
- **Blocks**: Content elements (heading, text, button, image, etc.)

### Implementation Checklist

- [ ] Section block editor with all styling options
- [ ] Header component with section-like styling
- [ ] Footer component with section-like styling
- [ ] Apply pattern to remaining content blocks

---

## Critical Issues

### 1. Client: Sitemap URL Bug

**Location:** `client/app/sitemap.ts`

URLs are missing the tenant slug, causing incorrect sitemap entries.

```typescript
// Current (broken):
url: `${siteUrl}/${page.slug}`;

// Should be:
url: `${siteUrl}/${tenantSlug}/${page.slug}`;
```

**Priority:** High - affects SEO

---

### 2. Client: LogoBlock Data Pattern Inconsistency

**Location:** `client/components/blocks/logo-block.tsx`

All blocks expect `data.propertyName` but LogoBlock accesses properties directly.

```typescript
// Other blocks (correct pattern):
const { title, description } = data;

// LogoBlock (breaks pattern):
const { src, alt, width, height } = props;
```

**Fix:** Wrap logo props in `data` object to match other blocks.

---

### 3. Client: Duplicate Files

**Location:** Git working directory

Duplicate files exist that should be removed:

- `client/app/robots 2.ts`
- `client/app/sitemap 2.ts`
- `client/middleware 2.ts`
- `pnpm-lock 2.yaml`
- `pnpm-lock 3.yaml`

**Fix:** Delete all duplicate files.

---

### 4. Builder: Missing Save Implementation

**Location:**

- `builder/components/settings/entity-settings-drawer.tsx`
- `builder/components/editor/global-settings-drawer/global-settings-drawer.tsx`

TODO comments indicate save functionality isn't fully wired to the API.

**Fix:** Complete API integration for saving settings.

---

### 5. API: sessionId Field Bug

**Location:** `api/src/auth/strategies/jwt.strategy.ts`

JWT strategy doesn't set `sessionId` on the request user object, but some controllers may expect it.

**Fix:** Add sessionId to JWT payload and strategy return.

---

## Medium Priority Issues

### Code Organization

| Issue                | Location                                                  | Description                                        |
| -------------------- | --------------------------------------------------------- | -------------------------------------------------- |
| Monolithic component | `builder/app/(clients)/[id]/pages/[pageId]/edit/page.tsx` | 860 lines, should be split into smaller components |
| Duplicated logic     | `client/components/blocks/*`                              | Responsive class generation duplicated in 4+ files |
| No error boundaries  | `client/`                                                 | No React error boundaries anywhere                 |
| Type safety bypassed | `builder/lib/blocks/registry.ts`                          | Uses `as any` casts for block data                 |

### Security

| Issue                 | Location            | Description                                       |
| --------------------- | ------------------- | ------------------------------------------------- |
| Unencrypted secrets   | `api/`              | Payment config stored as plain JSON               |
| Incomplete audit logs | `api/modules/audit` | AuditLog model exists but isn't consistently used |

---

## Standardization Tasks

### Block Data Structure

All blocks should follow this pattern:

```typescript
interface BlockProps<T> {
  data: T;
  settings?: BlockSettings;
}

// Example:
interface HeadingBlockData {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  alignment?: "left" | "center" | "right";
}

function HeadingBlock({ data }: BlockProps<HeadingBlockData>) {
  const { text, level, alignment } = data;
  // ...
}
```

### Responsive Class Generation

Extract into shared utility:

```typescript
// lib/utils/responsive.ts
export function generateResponsiveClasses(config: ResponsiveConfig): string {
  // Single source of truth for responsive class generation
}
```

Currently duplicated in:

- `client/components/blocks/section-block.tsx`
- `client/components/blocks/grid-block.tsx`
- `client/components/blocks/flex-block.tsx`
- `client/components/blocks/stack-block.tsx`

---

## Completed

- [x] Next.js 16.0.10 security update (CVE-2025-55182 / React2Shell)
- [x] Font preset system implementation
- [x] Draft mode preview system
- [x] 3-tier tenant hierarchy

---

## Notes

This document tracks technical debt discovered during development. Items should be addressed when working in related areas or during dedicated refactoring sprints.

**Last Updated:** December 16, 2025
