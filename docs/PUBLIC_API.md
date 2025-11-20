# Public API Implementation Guide

**Purpose:** Enable client frontends (e.g., mhbiblebaptist.com) to fetch published content without authentication.

---

## Overview

The Public API provides **read-only access** to **published content** for client websites. It is:
- ✅ **No authentication required** (public access)
- ✅ **Tenant-scoped** (via slug in URL)
- ✅ **Read-only** (GET requests only)
- ✅ **Published content only** (never drafts)
- ✅ **Rate-limited** (prevent abuse)
- ✅ **Cacheable** (optimized for ISR/static generation)

---

## Architecture

```
Client Website (4002)
       ↓
GET /api/v1/public/{tenant-slug}/pages/home
       ↓
   Public API (No Auth Required)
       ↓
   PostgreSQL (Only published content)
       ↓
   Return Page Data
```

---

## Implementation Steps

### Step 1: Create Public Module

```bash
cd api/src/modules
mkdir public
```

### Step 2: Create Public Controller

**File:** `api/src/modules/public/public.controller.ts`

```typescript
import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  ParseIntPipe,
} from "@nestjs/common";
import { Public } from "@/modules/auth/decorators/public.decorator";
import { PrismaService } from "@/common/services/prisma.service";

@Controller("public/:tenantSlug")
@Public() // No authentication required
export class PublicController {
  constructor(private prisma: PrismaService) {}

  /**
   * GET /api/v1/public/:tenantSlug/config
   * Get site configuration (header, footer, menus, logos)
   */
  @Get("config")
  async getPublicConfig(@Param("tenantSlug") tenantSlug: string) {
    const tenant = await this.getActiveTenant(tenantSlug);

    return {
      businessName: tenant.businessName,
      businessType: tenant.businessType,
      contactEmail: tenant.contactEmail,
      header: tenant.headerConfig,
      footer: tenant.footerConfig,
      menus: tenant.menusConfig,
      logos: tenant.logosConfig,
      theme: tenant.themeConfig,
    };
  }

  /**
   * GET /api/v1/public/:tenantSlug/pages/:pageSlug
   * Get published page by slug
   */
  @Get("pages/:pageSlug")
  async getPublicPage(
    @Param("tenantSlug") tenantSlug: string,
    @Param("pageSlug") pageSlug: string,
  ) {
    const tenant = await this.getActiveTenant(tenantSlug);

    const page = await this.prisma.page.findFirst({
      where: {
        tenantId: tenant.id,
        slug: pageSlug,
        status: "published", // CRITICAL: Only published
      },
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
        metaTitle: true,
        metaDescription: true,
        metaKeywords: true,
        ogImage: true,
        publishedAt: true,
        updatedAt: true,
      },
    });

    if (!page) {
      throw new NotFoundException("Page not found");
    }

    return page;
  }

  /**
   * GET /api/v1/public/:tenantSlug/pages
   * List all published pages (for navigation)
   */
  @Get("pages")
  async getPublicPages(@Param("tenantSlug") tenantSlug: string) {
    const tenant = await this.getActiveTenant(tenantSlug);

    const pages = await this.prisma.page.findMany({
      where: {
        tenantId: tenant.id,
        status: "published",
      },
      select: {
        id: true,
        slug: true,
        title: true,
        publishedAt: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    return { pages };
  }

  /**
   * GET /api/v1/public/:tenantSlug/posts/:postSlug
   * Get published blog post by slug
   */
  @Get("posts/:postSlug")
  async getPublicPost(
    @Param("tenantSlug") tenantSlug: string,
    @Param("postSlug") postSlug: string,
  ) {
    const tenant = await this.getActiveTenant(tenantSlug);

    const post = await this.prisma.post.findFirst({
      where: {
        tenantId: tenant.id,
        slug: postSlug,
        status: "published",
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        featuredImage: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        publishedAt: true,
        updatedAt: true,
      },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return post;
  }

  /**
   * GET /api/v1/public/:tenantSlug/posts?page=1&limit=10
   * List published blog posts with pagination
   */
  @Get("posts")
  async getPublicPosts(
    @Param("tenantSlug") tenantSlug: string,
    @Query("page", new ParseIntPipe({ optional: true })) page: number = 1,
    @Query("limit", new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    const tenant = await this.getActiveTenant(tenantSlug);

    // Cap limit to prevent abuse
    const safeLimit = Math.min(limit, 50);
    const skip = (page - 1) * safeLimit;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: {
          tenantId: tenant.id,
          status: "published",
        },
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          featuredImage: true,
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          publishedAt: true,
        },
        orderBy: {
          publishedAt: "desc",
        },
        skip,
        take: safeLimit,
      }),
      this.prisma.post.count({
        where: {
          tenantId: tenant.id,
          status: "published",
        },
      }),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  /**
   * Private helper: Get active tenant by slug
   */
  private async getActiveTenant(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
    });

    if (!tenant || tenant.status !== "active") {
      throw new NotFoundException("Site not found");
    }

    return tenant;
  }
}
```

### Step 3: Create Public Module

**File:** `api/src/modules/public/public.module.ts`

```typescript
import { Module } from "@nestjs/common";
import { PublicController } from "./public.controller";
import { PrismaService } from "@/common/services/prisma.service";
import { PagesService } from "@/modules/pages/pages.service";
import { PostsService } from "@/modules/posts/posts.service";
import { SiteConfigService } from "@/modules/site-config/site-config.service";

@Module({
  controllers: [PublicController],
  providers: [PrismaService, PagesService, PostsService, SiteConfigService],
})
export class PublicModule {}
```

### Step 4: Register Module

**File:** `api/src/app.module.ts`

```typescript
import { PublicModule } from "./modules/public/public.module";

@Module({
  imports: [
    // ... existing modules
    PublicModule,  // ADD THIS
  ],
})
export class AppModule {}
```

---

## API Endpoints Reference

### Base URL

```
Development: http://localhost:4000/api/v1/public/{tenant-slug}
Production:  https://api.yourdomain.com/api/v1/public/{tenant-slug}
```

### Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/config` | Get site configuration | Site config object |
| `GET` | `/pages` | List all published pages | Array of pages |
| `GET` | `/pages/:slug` | Get page by slug | Page object |
| `GET` | `/posts` | List published posts (paginated) | Posts + pagination |
| `GET` | `/posts/:slug` | Get post by slug | Post object |

---

## Request Examples

### Get Site Configuration

```bash
GET /api/v1/public/mh-bible-baptist/config
```

**Response:**
```json
{
  "businessName": "MH Bible Baptist Church",
  "businessType": "church",
  "contactEmail": "info@mhbiblebaptist.com",
  "header": {
    "logo": { "url": "/logo.png", "alt": "MH Bible Baptist" },
    "navigation": [
      { "label": "Home", "href": "/" },
      { "label": "About", "href": "/about" }
    ]
  },
  "footer": {
    "copyright": "© 2025 MH Bible Baptist Church"
  },
  "theme": {
    "colors": {
      "primary": "#1e40af",
      "secondary": "#0891b2"
    }
  }
}
```

### Get Published Page

```bash
GET /api/v1/public/mh-bible-baptist/pages/home
```

**Response:**
```json
{
  "id": "clx123",
  "slug": "home",
  "title": "Welcome to Our Church",
  "content": {
    "sections": [
      {
        "_type": "section",
        "_key": "hero",
        "blocks": [
          {
            "_type": "heading-block",
            "data": { "text": "Welcome", "level": "h1" }
          }
        ]
      }
    ]
  },
  "metaTitle": "Home | MH Bible Baptist Church",
  "metaDescription": "Welcome to our church...",
  "publishedAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

### List Published Posts

```bash
GET /api/v1/public/mh-bible-baptist/posts?page=1&limit=10
```

**Response:**
```json
{
  "posts": [
    {
      "id": "clx456",
      "slug": "welcome-message",
      "title": "Welcome to Our New Website",
      "excerpt": "We're excited to announce...",
      "featuredImage": "/uploads/welcome.jpg",
      "author": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "publishedAt": "2025-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

## Client Integration

### Create API Client

**File:** `clients/mh-bible-baptist/lib/public-api-client.ts`

```typescript
const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG || 'mh-bible-baptist';

export class PublicApiClient {
  private baseUrl: string;

  constructor(tenantSlug: string = TENANT_SLUG) {
    this.baseUrl = `${PUBLIC_API_URL}/api/v1/public/${tenantSlug}`;
  }

  async getConfig() {
    const res = await fetch(`${this.baseUrl}/config`, {
      cache: 'force-cache',
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!res.ok) throw new Error('Failed to fetch config');
    return res.json();
  }

  async getPage(slug: string) {
    const res = await fetch(`${this.baseUrl}/pages/${slug}`, {
      cache: 'force-cache',
      next: { revalidate: 60 }, // Revalidate every minute
    });

    if (!res.ok) throw new Error(`Page not found: ${slug}`);
    return res.json();
  }

  async getPages() {
    const res = await fetch(`${this.baseUrl}/pages`, {
      cache: 'force-cache',
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error('Failed to fetch pages');
    return res.json();
  }

  async getPost(slug: string) {
    const res = await fetch(`${this.baseUrl}/posts/${slug}`, {
      cache: 'no-store', // Always fresh for blog posts
    });

    if (!res.ok) throw new Error(`Post not found: ${slug}`);
    return res.json();
  }

  async getPosts(page: number = 1, limit: number = 10) {
    const res = await fetch(
      `${this.baseUrl}/posts?page=${page}&limit=${limit}`,
      {
        cache: 'no-store',
      }
    );

    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  }
}

export const publicApi = new PublicApiClient();
```

### Usage in Next.js Pages

**File:** `clients/mh-bible-baptist/app/[slug]/page.tsx`

```typescript
import { publicApi } from '@/lib/public-api-client';
import { BlockRenderer } from '@webfunnel/block-renderer';

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await publicApi.getPage(params.slug);

  return (
    <div>
      <h1>{page.title}</h1>
      <BlockRenderer blocks={page.content.sections} />
    </div>
  );
}

// Generate static params for all published pages
export async function generateStaticParams() {
  const { pages } = await publicApi.getPages();

  return pages.map((page) => ({
    slug: page.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await publicApi.getPage(params.slug);

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription,
  };
}
```

---

## Security Considerations

### 1. Content Filtering

**Always filter to published content only:**

```typescript
// GOOD
where: {
  tenantId: tenant.id,
  status: "published",
}

// BAD - Exposes drafts!
where: {
  tenantId: tenant.id,
}
```

### 2. Field Selection

**Only expose necessary fields:**

```typescript
// GOOD - Minimal data
select: {
  id: true,
  title: true,
  content: true,
}

// BAD - Exposes internal data
select: {
  id: true,
  title: true,
  content: true,
  authorId: true,        // Internal
  createdBy: true,       // Internal
  internalNotes: true,   // Sensitive
}
```

### 3. Rate Limiting

**Add throttling to prevent abuse:**

```typescript
import { Throttle } from '@nestjs/throttler';

@Controller("public/:tenantSlug")
@Public()
@Throttle({ default: { limit: 100, ttl: 60000 } })  // 100 req/min
export class PublicController { ... }
```

### 4. CORS for Public Endpoints

**Allow broader CORS for public data:**

```typescript
@Get("config")
@Header('Access-Control-Allow-Origin', '*')
@Header('Cache-Control', 'public, max-age=300')
async getPublicConfig(...) { ... }
```

---

## Caching Strategy

### API-Level Caching

**Install cache manager:**

```bash
pnpm add @nestjs/cache-manager cache-manager
```

**Configure caching:**

```typescript
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300, // 5 minutes
      max: 100, // Max items in cache
    }),
  ],
})
export class PublicModule {}
```

**Apply to endpoints:**

```typescript
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Get("pages/:pageSlug")
@CacheKey('public-page')
@CacheTTL(300)  // Cache for 5 minutes
async getPublicPage(...) { ... }
```

### Client-Level Caching (Next.js)

**Use ISR (Incremental Static Regeneration):**

```typescript
// Revalidate every 60 seconds
export const revalidate = 60;

export default async function Page() {
  const page = await publicApi.getPage('home');
  return <div>{page.title}</div>;
}
```

**Use dynamic revalidation:**

```typescript
await fetch('...', {
  next: { revalidate: 60 }
});
```

---

## Testing

### Manual Testing

```bash
# Get config
curl http://localhost:4000/api/v1/public/mh-bible-baptist/config

# Get page
curl http://localhost:4000/api/v1/public/mh-bible-baptist/pages/home

# List pages
curl http://localhost:4000/api/v1/public/mh-bible-baptist/pages

# Get post
curl http://localhost:4000/api/v1/public/mh-bible-baptist/posts/welcome-message

# List posts with pagination
curl "http://localhost:4000/api/v1/public/mh-bible-baptist/posts?page=1&limit=10"
```

### Automated Tests

**File:** `api/test/public.e2e-spec.ts`

```typescript
describe('Public API (e2e)', () => {
  it('should return site config', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/public/mh-bible-baptist/config')
      .expect(200);

    expect(response.body).toHaveProperty('businessName');
    expect(response.body).toHaveProperty('header');
  });

  it('should only return published pages', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/public/mh-bible-baptist/pages')
      .expect(200);

    const pages = response.body.pages;
    expect(pages.every(p => p.status === 'published')).toBe(true);
  });

  it('should return 404 for draft pages', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/public/mh-bible-baptist/pages/draft-page')
      .expect(404);
  });

  it('should return 404 for inactive tenants', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/public/inactive-tenant/config')
      .expect(404);
  });
});
```

---

## Deployment Checklist

- [ ] Public module implemented
- [ ] All endpoints tested
- [ ] Rate limiting configured
- [ ] Caching implemented
- [ ] CORS configured for public access
- [ ] Only published content exposed
- [ ] No sensitive fields in responses
- [ ] Client API client created
- [ ] Environment variables set
- [ ] Documentation updated

---

## Troubleshooting

### Issue: 404 on public endpoints

**Check:**
- Module registered in `app.module.ts`
- API running on port 4000
- Correct URL: `/api/v1/public/{slug}/...`

### Issue: Draft pages being returned

**Check:**
- `status: "published"` filter in query
- Database has published pages
- Tenant is active

### Issue: CORS errors from client

**Check:**
- Client domain in CORS config
- `credentials: true` in CORS
- Public decorator applied to controller

---

## Summary

**Public API provides:**
- ✅ No-auth access to published content
- ✅ Tenant-scoped data isolation
- ✅ Read-only, cacheable responses
- ✅ Perfect for static site generation
- ✅ Secure by design (no sensitive data)

**Perfect for:**
- Client websites (Next.js ISR)
- Mobile apps (public content)
- Third-party integrations
- CDN edge caching

---

**Last Updated:** November 2025
