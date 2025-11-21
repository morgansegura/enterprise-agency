# Public API Implementation

## Overview

The Public API provides **unauthenticated** endpoints for client frontends to fetch published content without authentication. This allows client websites to display their content to visitors.

## Endpoints

All public API endpoints are prefixed with `/api/v1/public/:tenantSlug`

### 1. Get Site Configuration

```http
GET /api/v1/public/:tenantSlug/config
```

**Returns:** Branding, navigation, contact info, menus, logos

**Example:**
```bash
curl http://localhost:4000/api/v1/public/bible-baptist-church/config
```

**Response:**
```json
{
  "slug": "bible-baptist-church",
  "businessName": "Bible Baptist Church",
  "businessType": "church",
  "logoUrl": "https://...",
  "metaDescription": "A welcoming community church...",
  "contactEmail": "info@biblebaptist.com",
  "contactPhone": "(555) 123-4567",
  "headerConfig": { /* navigation config */ },
  "footerConfig": { /* footer config */ },
  "menusConfig": { /* menu config */ },
  "logosConfig": { /* logo variants */ },
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

**Cache:** 5 minutes

---

### 2. List Published Pages

```http
GET /api/v1/public/:tenantSlug/pages?page=1&limit=100
```

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 100) - Items per page

**Example:**
```bash
curl http://localhost:4000/api/v1/public/bible-baptist-church/pages
```

**Response:**
```json
{
  "pages": [
    {
      "id": "...",
      "slug": "about-us",
      "title": "About Our Church",
      "content": { /* structured blocks */ },
      "metaTitle": "About Our Church - Bible Baptist Church",
      "metaDescription": "Learn about our church...",
      "template": "default",
      "publishedAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "page": 1,
  "limit": 100,
  "total": 12,
  "totalPages": 1
}
```

**Cache:** 2 minutes

---

### 3. Get Single Page

```http
GET /api/v1/public/:tenantSlug/pages/:pageSlug
```

**Example:**
```bash
curl http://localhost:4000/api/v1/public/bible-baptist-church/pages/about-us
```

**Cache:** 2 minutes

---

### 4. List Published Posts

```http
GET /api/v1/public/:tenantSlug/posts?page=1&limit=20&category=sermons&tags=easter,worship
```

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20, max: 100) - Items per page
- `category` (optional) - Filter by category
- `tags` (optional) - Filter by tags (comma-separated or multiple `tags` params)

**Example:**
```bash
# All posts
curl http://localhost:4000/api/v1/public/bible-baptist-church/posts

# Filter by category
curl "http://localhost:4000/api/v1/public/bible-baptist-church/posts?category=sermons"

# Filter by tags
curl "http://localhost:4000/api/v1/public/bible-baptist-church/posts?tags=easter&tags=worship"
```

**Response:**
```json
{
  "posts": [
    {
      "id": "...",
      "slug": "easter-service-2024",
      "title": "Easter Service 2024",
      "excerpt": "Join us for...",
      "content": "<p>Full content...</p>",
      "featuredImageUrl": "https://...",
      "category": "events",
      "tags": ["easter", "worship"],
      "metaTitle": "Easter Service 2024",
      "metaDescription": "Join us for...",
      "viewCount": 142,
      "publishedAt": "2024-04-07T09:00:00.000Z",
      "updatedAt": "2024-04-01T14:30:00.000Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 45,
  "totalPages": 3,
  "category": "events",
  "tags": ["easter", "worship"]
}
```

**Cache:** 1 minute

---

### 5. Get Single Post

```http
GET /api/v1/public/:tenantSlug/posts/:postSlug
```

**Special behavior:** Automatically increments `viewCount` on each request

**Example:**
```bash
curl http://localhost:4000/api/v1/public/bible-baptist-church/posts/easter-service-2024
```

**Cache:** 1 minute

---

## Security Features

### 1. Rate Limiting
- **Global limit:** 100 requests per minute per IP
- Prevents abuse and DDoS attacks
- Returns `429 Too Many Requests` when exceeded

### 2. Tenant Isolation
- All queries filtered by `tenantId`
- Cannot access other tenants' data
- Invalid tenant slug returns `404 Not Found`

### 3. Published Content Only
- Only returns content with `status = 'published'`
- Draft/archived content is not exposed
- Inactive tenants return `404 Not Found`

### 4. No Sensitive Data
- No user emails, passwords, or internal IDs exposed
- No unpublished content
- No audit logs or system metadata

### 5. HTTP Caching
- Cache-Control headers for browser/CDN caching
- Reduces database load
- Improves performance for visitors

**Cache durations:**
- Site config: 5 minutes
- Pages: 2 minutes
- Posts: 1 minute

---

## Usage in Client Frontends

### Next.js Example

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG;

export async function getSiteConfig() {
  const res = await fetch(
    `${API_URL}/api/v1/public/${TENANT_SLUG}/config`,
    { next: { revalidate: 300 } } // 5 minutes
  );

  if (!res.ok) throw new Error('Failed to fetch config');
  return res.json();
}

export async function getPages(page = 1) {
  const res = await fetch(
    `${API_URL}/api/v1/public/${TENANT_SLUG}/pages?page=${page}`,
    { next: { revalidate: 120 } } // 2 minutes
  );

  if (!res.ok) throw new Error('Failed to fetch pages');
  return res.json();
}

export async function getPage(slug: string) {
  const res = await fetch(
    `${API_URL}/api/v1/public/${TENANT_SLUG}/pages/${slug}`,
    { next: { revalidate: 120 } }
  );

  if (!res.ok) throw new Error('Page not found');
  return res.json();
}

export async function getPosts(options?: {
  page?: number;
  category?: string;
  tags?: string[];
}) {
  const params = new URLSearchParams({
    page: (options?.page || 1).toString(),
  });

  if (options?.category) {
    params.append('category', options.category);
  }

  if (options?.tags) {
    options.tags.forEach(tag => params.append('tags', tag));
  }

  const res = await fetch(
    `${API_URL}/api/v1/public/${TENANT_SLUG}/posts?${params}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}
```

### React Component Example

```typescript
// app/posts/page.tsx
import { getPosts } from '@/lib/api';

export default async function PostsPage() {
  const { posts } = await getPosts({ page: 1 });

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
          <span>{post.viewCount} views</span>
        </article>
      ))}
    </div>
  );
}
```

---

## Testing the Public API

### Using curl

```bash
# Test site config
curl http://localhost:4000/api/v1/public/bible-baptist-church/config

# Test pages list
curl http://localhost:4000/api/v1/public/bible-baptist-church/pages

# Test single page
curl http://localhost:4000/api/v1/public/bible-baptist-church/pages/about-us

# Test posts list
curl http://localhost:4000/api/v1/public/bible-baptist-church/posts

# Test posts with filters
curl "http://localhost:4000/api/v1/public/bible-baptist-church/posts?category=sermons&page=1&limit=10"

# Test single post
curl http://localhost:4000/api/v1/public/bible-baptist-church/posts/some-post-slug
```

### Expected Responses

**Success (200 OK):**
- Returns JSON data as documented above
- Includes `Cache-Control` header

**Not Found (404):**
```json
{
  "statusCode": 404,
  "message": "Tenant not found: invalid-slug",
  "error": "Not Found"
}
```

**Rate Limited (429):**
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

---

## OpenAPI/Swagger Documentation

Once the API is running, view interactive documentation at:

```
http://localhost:4000/api
```

(Note: Swagger UI setup may need to be added to `main.ts`)

---

## Performance Optimization

### 1. Database Indexing
Already optimized with indexes on:
- `tenantId + slug` (unique constraint)
- `tenantId + status`
- `publishedAt` (for sorting)

### 2. Selective Field Loading
- Only fetches required fields (not entire records)
- Reduces database payload
- Faster query execution

### 3. HTTP Caching
- Browser/CDN can cache responses
- Reduces API requests
- Faster page loads for visitors

### 4. Pagination
- Limits result set size
- Prevents memory issues
- Consistent performance at scale

---

## Future Enhancements

### 1. Redis Caching
Currently using HTTP caching. Consider adding Redis for:
- Server-side caching
- Cache invalidation on content updates
- Reduced database queries

### 2. CDN Integration
- Serve API through CloudFlare/CloudFront
- Global edge caching
- DDoS protection

### 3. Analytics
- Track popular content
- Monitor API usage
- Performance metrics

### 4. Search Endpoint
```http
GET /api/v1/public/:tenantSlug/search?q=easter
```

---

## Summary

✅ **Complete** - All endpoints implemented
✅ **Secure** - Tenant isolation, rate limiting, published-only
✅ **Fast** - Caching, indexing, optimized queries
✅ **Documented** - API examples and usage guides
✅ **Production-ready** - Error handling, validation, monitoring
