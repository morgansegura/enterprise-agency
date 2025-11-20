# Monorepo Strategy for Client Deployments

## Problem Statement

Each client needs a **unique, fully customized frontend** (not cookie-cutter), but we want to:
- Share core components across all clients
- Push updates to shared functionality
- Maintain client-specific customizations
- Avoid code duplication

## Solution: Monorepo with Shared Packages

### Recommended Structure

```
webfunnel-platform/
├── packages/                    # Shared packages
│   ├── ui-components/          # Shared React components
│   │   ├── src/
│   │   │   ├── Heading.tsx
│   │   │   ├── Text.tsx
│   │   │   ├── Button.tsx
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── block-renderer/         # Core block rendering system
│   │   ├── src/
│   │   │   ├── BlockRenderer.tsx
│   │   │   ├── blocks/
│   │   │   │   ├── HeadingBlock.tsx
│   │   │   │   ├── TextBlock.tsx
│   │   │   │   └── ImageBlock.tsx
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── api-client/             # Shared API client for public endpoints
│   │   ├── src/
│   │   │   ├── PublicApiClient.ts
│   │   │   └── types.ts
│   │   └── package.json
│   │
│   └── shared-types/           # Shared TypeScript types
│       ├── src/
│       │   ├── block-types.ts
│       │   ├── page-types.ts
│       │   └── index.ts
│       └── package.json
│
├── clients/                     # Individual client deployments
│   ├── client-template/        # Base template for new clients
│   │   ├── app/
│   │   ├── components/         # Client-specific components
│   │   ├── styles/             # Client-specific styles
│   │   ├── public/
│   │   ├── .env.example
│   │   └── package.json        # References @webfunnel/* packages
│   │
│   ├── mh-bible-baptist/       # Actual client deployment
│   │   ├── app/
│   │   ├── components/
│   │   │   └── CustomBanner.tsx   # Client-specific component
│   │   ├── styles/
│   │   │   └── custom.css         # Client-specific styles
│   │   └── package.json
│   │
│   └── demo-church/            # Another client
│       └── ...
│
├── api/                        # Backend API (existing)
├── builder/                    # Admin builder (existing)
├── package.json                # Root package.json
├── pnpm-workspace.yaml         # Workspace configuration
└── turbo.json                  # Turborepo configuration (optional)
```

---

## Implementation Steps

### Step 1: Initialize Workspace

Create `pnpm-workspace.yaml` in root:

```yaml
packages:
  - "api"
  - "builder"
  - "clients/*"
  - "packages/*"
```

### Step 2: Create Shared Packages

#### Example: `packages/ui-components/package.json`

```json
{
  "name": "@webfunnel/ui-components",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js"
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts",
    "dev": "tsup src/index.ts --format esm,cjs --dts --watch"
  },
  "dependencies": {
    "react": "^19.0.0"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.0.0"
  }
}
```

#### Example: `packages/api-client/package.json`

```json
{
  "name": "@webfunnel/api-client",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts"
  },
  "dependencies": {
    "@webfunnel/shared-types": "workspace:*"
  }
}
```

### Step 3: Update Client Template

#### `clients/client-template/package.json`

```json
{
  "name": "client-template",
  "private": true,
  "dependencies": {
    "@webfunnel/ui-components": "workspace:*",
    "@webfunnel/block-renderer": "workspace:*",
    "@webfunnel/api-client": "workspace:*",
    "@webfunnel/shared-types": "workspace:*",
    "next": "^15.0.0",
    "react": "^19.0.0"
  }
}
```

### Step 4: Use Shared Packages in Client

```tsx
// clients/mh-bible-baptist/app/page.tsx
import { Heading, Text } from "@webfunnel/ui-components";
import { BlockRenderer } from "@webfunnel/block-renderer";
import { PublicApiClient } from "@webfunnel/api-client";

const api = new PublicApiClient("mh-bible-baptist");

export default async function HomePage() {
  const page = await api.getPage("home");

  return (
    <div>
      <Heading level="h1">{page.title}</Heading>
      <BlockRenderer blocks={page.content.sections} />
    </div>
  );
}
```

---

## Workflow: Creating a New Client

### 1. Clone Template
```bash
cd clients
cp -r client-template new-client-name
cd new-client-name
```

### 2. Customize Package.json
```json
{
  "name": "new-client-name",
  "private": true,
  "scripts": {
    "dev": "next dev -p 4010",
    "build": "next build",
    "start": "next start"
  }
}
```

### 3. Update Environment Variables
```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_TENANT_SLUG=new-client-slug
```

### 4. Install Dependencies
```bash
# From root
pnpm install
```

### 5. Customize Client-Specific Code
```
clients/new-client-name/
├── app/                    # Custom pages
├── components/             # Custom components
│   └── ClientLogo.tsx     # Client-specific
├── styles/
│   └── custom.css         # Client-specific styles
└── public/
    └── logo.png           # Client assets
```

### 6. Deploy
```bash
# Build client
cd clients/new-client-name
pnpm build

# Deploy to Vercel
vercel deploy

# Point custom domain
# client-domain.com → Vercel deployment
```

---

## Updating Shared Components

### Scenario: Update Heading Component

```bash
# 1. Update shared component
cd packages/ui-components
# Edit src/Heading.tsx

# 2. Build package
pnpm build

# 3. All clients automatically get update on next build
cd ../../clients/mh-bible-baptist
pnpm build  # Uses updated @webfunnel/ui-components
```

---

## Benefits of This Approach

### ✅ Shared Core, Custom Clients
- **Core components** updated once, propagate to all clients
- **Client customizations** remain isolated
- **No code duplication** across clients

### ✅ Version Control Per Client
```bash
# Each client can pin versions if needed
"@webfunnel/ui-components": "1.2.0"  # Pin specific version
"@webfunnel/block-renderer": "workspace:*"  # Always latest
```

### ✅ Independent Deployments
- Each client deploys independently
- No risk of breaking other clients
- Custom domains per client

### ✅ Shared Updates
```bash
# Update all clients to latest shared packages
pnpm update --recursive @webfunnel/*
```

---

## Optimization: Use Turborepo

For faster builds across the monorepo:

### Install Turborepo
```bash
pnpm add -D turbo
```

### Create `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "type-check": {}
  }
}
```

### Update Root `package.json`
```json
{
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "build:api": "turbo build --filter=api",
    "build:builder": "turbo build --filter=builder",
    "build:client": "turbo build --filter=mh-bible-baptist"
  }
}
```

### Benefits:
- **Parallel builds** across packages
- **Caching** - only rebuild what changed
- **Task dependencies** - build packages before clients

---

## Package Breakdown

### `@webfunnel/ui-components`
**Purpose:** Primitive UI components (Heading, Text, Button, etc.)

**When to use:**
- Shared across ALL clients
- Basic building blocks
- Follows design system

**When NOT to use:**
- Client-specific components
- Complex business logic

### `@webfunnel/block-renderer`
**Purpose:** Block system (HeadingBlock, ImageBlock, etc.)

**When to use:**
- Rendering CMS content
- Core block types
- Block validation

**When NOT to use:**
- Custom blocks for specific clients

### `@webfunnel/api-client`
**Purpose:** Client for public API endpoints

**When to use:**
- Fetching pages, posts, config
- Standard API calls
- Type-safe requests

**Exports:**
```typescript
export class PublicApiClient {
  constructor(tenantSlug: string);
  async getConfig(): Promise<SiteConfig>;
  async getPage(slug: string): Promise<Page>;
  async getPosts(page?: number): Promise<PostsResponse>;
}
```

### `@webfunnel/shared-types`
**Purpose:** Shared TypeScript types

**When to use:**
- Types shared between packages
- Block type definitions
- API response types

**Exports:**
```typescript
export interface Page { ... }
export interface Post { ... }
export type ContentBlock = HeadingBlock | TextBlock | ...
```

---

## Migration Plan

### Phase 1: Extract Shared Code (Week 1)
1. Create `packages/` folder structure
2. Move components from `client/` to `packages/ui-components/`
3. Create `@webfunnel/block-renderer` package
4. Test with existing client

### Phase 2: Setup Client Template (Week 1)
1. Rename `client/` → `clients/client-template/`
2. Update imports to use `@webfunnel/*` packages
3. Document customization points
4. Create deployment guide

### Phase 3: Migrate MH Bible Baptist (Week 2)
1. Clone template → `clients/mh-bible-baptist/`
2. Migrate existing customizations
3. Test thoroughly
4. Deploy to production

### Phase 4: Optimize (Week 3+)
1. Add Turborepo for faster builds
2. Setup CI/CD per client
3. Create client scaffolding CLI
4. Document shared package updates

---

## Client Scaffolding CLI (Future)

Create a CLI tool to scaffold new clients:

```bash
pnpm create-client

# Interactive prompts:
? Client name: New Church
? Slug: new-church
? Domain: newchurch.com
? Copy template: client-template
? Include sample pages: Yes

✓ Created clients/new-church
✓ Installed dependencies
✓ Generated .env.local
✓ Ready to customize!

Next steps:
  cd clients/new-church
  pnpm dev
```

---

## Best Practices

### 1. Versioning Strategy
- **Shared packages:** Semantic versioning (1.0.0, 1.1.0, etc.)
- **Clients:** No versioning (always private)

### 2. Breaking Changes
- Bump major version in shared packages
- Migrate clients individually
- Use deprecation warnings

### 3. Client Customization Points
```tsx
// GOOD: Allow customization via props
<BlockRenderer
  blocks={blocks}
  customBlocks={{
    'custom-banner': ClientBanner
  }}
/>

// BAD: Copy-paste entire component
```

### 4. Shared vs Client-Specific
**Shared (packages/):**
- Used by 3+ clients
- Core functionality
- Stable API

**Client-Specific (clients/):**
- Unique to one client
- Business-specific logic
- Experimental features

---

## Deployment Strategy

### Option 1: Vercel (Recommended)
```bash
# Deploy each client separately
cd clients/mh-bible-baptist
vercel deploy --prod

# Environment variables set in Vercel dashboard
NEXT_PUBLIC_API_URL=https://api.webfunnel.com
NEXT_PUBLIC_TENANT_SLUG=mh-bible-baptist
```

### Option 2: Netlify
```bash
netlify deploy --prod
```

### Option 3: Docker (Self-hosted)
```dockerfile
# Dockerfile per client
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build
CMD ["pnpm", "start"]
```

---

## Maintenance

### Updating Shared Components
```bash
# 1. Update package
cd packages/ui-components
# Make changes
pnpm build

# 2. Test with one client first
cd ../../clients/test-client
pnpm dev
# Verify changes work

# 3. Update all clients
cd ../..
pnpm build  # Rebuilds all
```

### Security Updates
```bash
# Update all dependencies
pnpm update --recursive

# Check for vulnerabilities
pnpm audit

# Update specific package
pnpm update next --recursive
```

---

## FAQ

### Q: Can clients opt-out of shared package updates?
**A:** Yes, pin specific versions:
```json
{
  "dependencies": {
    "@webfunnel/ui-components": "1.2.0"  // Pin to 1.2.0
  }
}
```

### Q: How do I test shared package changes before deploying?
**A:** Use local linking:
```bash
# In package
cd packages/ui-components
pnpm build

# In client
cd clients/test-client
# Changes automatically reflected (workspace:* link)
pnpm dev
```

### Q: Can clients override shared components?
**A:** Yes, via customization props or local components:
```tsx
// Override shared Heading with client-specific
import { Heading as SharedHeading } from '@webfunnel/ui-components';
import { CustomHeading } from './components/CustomHeading';

// Use CustomHeading instead of SharedHeading
```

### Q: How do I handle different Next.js versions per client?
**A:** Each client can use different versions:
```json
// clients/old-client/package.json
"next": "14.0.0"

// clients/new-client/package.json
"next": "15.0.0"
```

---

## Summary

**Monorepo Strategy = Best of Both Worlds:**
- ✅ Shared core components (efficiency)
- ✅ Unique client customization (not cookie-cutter)
- ✅ Independent deployments (safety)
- ✅ Centralized updates (maintainability)

**Next Steps:**
1. Create `packages/` folder structure
2. Extract shared components
3. Setup client template
4. Document migration guide

---

**Last Updated:** November 2025
