# Enterprise Agency Platform

## Quick Reference

| App     | Port | Stack                            | Path               |
| ------- | ---- | -------------------------------- | ------------------ |
| API     | 4000 | NestJS 10, Prisma, PostgreSQL 16 | `api/`             |
| Builder | 4001 | Next.js 16, React 19, Tailwind 4 | `builder/`         |
| Client  | 4002 | Next.js 16, React 19, Tailwind 4 | `client/`          |
| Tokens  | —    | TypeScript, tsup                 | `packages/tokens/` |
| Blocks  | —    | TypeScript                       | `packages/blocks/` |
| Media   | —    | TypeScript                       | `packages/media/`  |
| UI      | —    | TypeScript                       | `packages/ui/`     |

## Commands

```bash
pnpm dev              # All services
pnpm dev:api          # API only
pnpm dev:builder      # Builder only
pnpm dev:client       # Client only
pnpm db:push          # Push Prisma schema
pnpm db:seed          # Seed database
pnpm db:studio        # Prisma Studio
pnpm verify           # format + lint + typecheck + test
pnpm format           # Prettier
pnpm typecheck        # tsc across workspaces
```

**Requires:** Node >=22 <23, pnpm 10.20.0, PostgreSQL on port 5433 (via docker-compose)

## Architecture

**Multi-tenant SaaS platform** for a professional web agency. Tenants are isolated by `tenantId` on every database row. The builder is the agency's internal tool; the client renders published sites.

### Data flow

```
Builder UI → Zustand stores → apiClient (x-tenant-id header) → NestJS API → Prisma → PostgreSQL
Client UI  → publicApi (no auth) → NestJS API → Prisma → PostgreSQL
```

### Page structure hierarchy

```
Page → Section[] → Container[] → Block[]
```

All types defined in `@enterprise/tokens` (`packages/tokens/src/architecture/`).

### Design token system (critical)

Three-tier: **Primitives** (raw Tailwind values) → **Semantic** (named scales) → **Components** (property schemas with defaults).

CSS tokens live in `packages/tokens/src/css/` — imported by both builder and client `globals.css`. This is the **single source of truth** for builder/client visual parity.

Styling uses **data-\* attributes** on components, matched by CSS selectors in token CSS files. Not Tailwind classes on rendered output.

### Auth & permissions

- JWT access tokens (15min) + refresh tokens (7 days) via HTTP-only cookies
- 6 roles: SUPERADMIN → AGENCY_ADMIN → AGENCY_EDITOR → CLIENT_ADMIN → CLIENT_EDITOR → SUB_CLIENT
- 120+ atomic permissions (`resource:action` format)
- Guards: JwtAuthGuard → TenantAccessGuard → PermissionGuard
- Tenant resolved from: `x-tenant-id` header > query param > subdomain

### State management (builder)

- **Zustand + Immer**: `useEditorStore` (page data, undo/redo), `useUIStore` (panels, selection), `useAuthStore`, `useTenantsStore`, `useAdminStore`
- **React Query**: Server state via hooks in `builder/lib/hooks/` (usePages, usePosts, useProducts, etc.)
- **React Context**: `BlockEditorContext` (TipTap editor state), theme, responsive preview

### Block system

- 25+ block types registered in `builder/lib/editor/implemented-blocks.ts`
- Lazy-loaded editors via `blockRegistry`
- Categories: content, media, interactive, layout, specialized, container
- Two-tier gating: CONTENT_EDITOR vs BUILDER tier

## Conventions

- **Commits**: Conventional commits (`feat:`, `fix:`, `refactor:`)
- **Formatting**: Prettier — double quotes, semicolons, trailing commas, 80-char width, 2-space indent
- **Linting**: ESLint — `no-explicit-any: error`, unused vars error (underscore prefix to ignore)
- **TypeScript**: Strict in api/client/packages, non-strict in builder
- **CSS**: Tailwind 4 with `@import "tailwindcss"`, component CSS in colocated `.css` files
- **Imports**: `@/*` path alias in builder and client; `@/`, `@common/`, `@modules/`, `@prisma` in api
- **Testing**: Jest for API, Vitest for builder (97 tests: 75 store, 22 hook)

## Key files

| Purpose                          | Location                                                 |
| -------------------------------- | -------------------------------------------------------- |
| Prisma schema                    | `api/prisma/schema.prisma`                               |
| Seed data                        | `api/prisma/seed.ts`                                     |
| API modules                      | `api/src/modules/` (17 modules)                          |
| Permission definitions           | `api/src/common/permissions/`                            |
| Guards & decorators              | `api/src/common/guards/`, `api/src/common/decorators/`   |
| Editor store                     | `builder/lib/stores/editor-store.ts`                     |
| UI store                         | `builder/lib/stores/ui-store.ts`                         |
| Block registry                   | `builder/lib/editor/block-registry.ts`                   |
| React Query hooks                | `builder/lib/hooks/`                                     |
| Settings context                 | `builder/lib/settings/use-settings-context.ts`           |
| Token architecture types         | `packages/tokens/src/architecture/`                      |
| Token CSS                        | `packages/tokens/src/css/`                               |
| Platform defaults                | `packages/tokens/src/design-system/platform-defaults.ts` |
| Client proxy (tenant resolution) | `client/proxy.ts`                                        |

## Pricing tiers

- **Content Editor** ($49/mo): Pages, media, basic SEO
- **Builder** ($149/mo): + builder, forms, analytics, team (5 users)
- **E-Commerce** (+$99/mo): Shop, products, orders, Stripe/Square
- **Marketing Suite** (+$99/mo): Advanced analytics, SEO audit, campaigns
- **Business Suite** (+$79/mo): Bookings, events, donations
- **Enterprise**: Multi-language, custom code, API access, white-label
