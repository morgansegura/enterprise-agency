# Content Preview & Publishing System

## Overview

The content preview and publishing system manages the complete content lifecycle from draft creation to public visibility. Built on Next.js Draft Mode and optimized for Vercel deployment, it provides secure preview capabilities, shareable preview links for client review, and instant publish with cache invalidation.

---

## Core Concepts

**Draft → Preview → Published**

1. **Draft**: Content exists in database but is not publicly visible
2. **Preview**: Content visible via secure Draft Mode or preview token
3. **Published**: Content visible to public, statically generated for performance

---

## Content Status Model

### Database Schema

```typescript
// Simplified status model - only draft or published
enum ContentStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}

interface Page {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  status: ContentStatus;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null; // Set on first publish

  // Content
  sections: Section[];
  seo: SEOData | null;
}

interface Post {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  status: ContentStatus;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;

  // Content
  content: Block[];
  excerpt: string | null;
  featuredImage: string | null;

  // Taxonomy
  tags: Tag[];
  categories: Category[];
}
```

### Status Transitions

```
┌─────────────────────────────────────────────────────────────┐
│                    Content Lifecycle                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────┐    Save    ┌──────────┐                     │
│   │  CREATE  │ ─────────► │  DRAFT   │◄──────┐             │
│   └──────────┘            └────┬─────┘       │             │
│                                │             │             │
│                           Publish         Unpublish        │
│                                │             │             │
│                                ▼             │             │
│                          ┌──────────┐       │             │
│                          │ PUBLISHED│───────┘             │
│                          └──────────┘                      │
│                                                             │
│   Preview Mode: Available at ANY status via Draft Mode      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Preview System Architecture

### Next.js Draft Mode

Draft Mode is a Next.js built-in feature that bypasses static generation to show the latest content. When enabled:

- `draftMode().isEnabled` returns `true`
- Data fetching functions see draft content
- Cache is bypassed for that user's session

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                      Request Flow                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   PUBLIC USER                      PREVIEW USER                 │
│   ───────────                      ────────────                 │
│                                                                 │
│   Request ───► Next.js            Request + Cookie              │
│                  │                       │                      │
│            [draftMode: false]      [draftMode: true]           │
│                  │                       │                      │
│                  ▼                       ▼                      │
│          Static Cache              API (no cache)              │
│          (published)               (all content)               │
│                  │                       │                      │
│                  ▼                       ▼                      │
│           Fast Response            Fresh Content               │
│                                    + Preview Banner            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: API Updates

#### 1.1 Content Status Endpoints

```typescript
// api/src/modules/pages/pages.controller.ts

@Controller("pages")
@UseGuards(JwtAuthGuard, TenantGuard)
export class PagesController {
  // Publish a page
  @Post(":id/publish")
  @RequirePermission("pages:publish")
  async publish(@Param("id") id: string) {
    return this.pagesService.publish(id);
  }

  // Unpublish a page
  @Post(":id/unpublish")
  @RequirePermission("pages:publish")
  async unpublish(@Param("id") id: string) {
    return this.pagesService.unpublish(id);
  }
}

// api/src/modules/pages/pages.service.ts

@Injectable()
export class PagesService {
  async publish(id: string): Promise<Page> {
    const page = await this.prisma.page.update({
      where: { id },
      data: {
        status: "published",
        publishedAt: new Date(),
      },
    });

    // Trigger Vercel cache revalidation
    await this.revalidationService.revalidatePage(page);

    return page;
  }

  async unpublish(id: string): Promise<Page> {
    const page = await this.prisma.page.update({
      where: { id },
      data: {
        status: "draft",
      },
    });

    // Trigger Vercel cache revalidation
    await this.revalidationService.revalidatePage(page);

    return page;
  }
}
```

#### 1.2 Preview Token Generation

```typescript
// api/src/modules/preview/preview.controller.ts

@Controller("preview")
@UseGuards(JwtAuthGuard, TenantGuard)
export class PreviewController {
  constructor(
    private readonly previewService: PreviewService,
    private readonly jwtService: JwtService,
  ) {}

  // Generate a shareable preview token
  @Post("token")
  async generateToken(
    @Body() dto: GeneratePreviewTokenDto,
    @CurrentUser() user: User,
  ) {
    return this.previewService.generateToken({
      contentType: dto.contentType, // 'page' | 'post'
      contentId: dto.contentId,
      tenantId: dto.tenantId,
      createdBy: user.id,
      expiresIn: dto.expiresIn || "7d", // Default 7 days
    });
  }

  // Validate a preview token (used by client app)
  @Get("validate")
  async validateToken(@Query("token") token: string) {
    return this.previewService.validateToken(token);
  }
}

// api/src/modules/preview/preview.service.ts

@Injectable()
export class PreviewService {
  async generateToken(options: GenerateTokenOptions): Promise<PreviewToken> {
    const token = crypto.randomUUID();
    const expiresAt = this.calculateExpiry(options.expiresIn);

    const previewToken = await this.prisma.previewToken.create({
      data: {
        token,
        contentType: options.contentType,
        contentId: options.contentId,
        tenantId: options.tenantId,
        createdBy: options.createdBy,
        expiresAt,
      },
    });

    return {
      token: previewToken.token,
      url: this.buildPreviewUrl(previewToken),
      expiresAt: previewToken.expiresAt,
    };
  }

  async validateToken(token: string): Promise<ValidatedToken | null> {
    const previewToken = await this.prisma.previewToken.findUnique({
      where: { token },
      include: { tenant: true },
    });

    if (!previewToken || previewToken.expiresAt < new Date()) {
      return null;
    }

    return {
      contentType: previewToken.contentType,
      contentId: previewToken.contentId,
      tenantSlug: previewToken.tenant.slug,
    };
  }

  private buildPreviewUrl(token: PreviewTokenRecord): string {
    const baseUrl = this.configService.get("CLIENT_PREVIEW_URL");
    return `${baseUrl}/api/preview?token=${token.token}`;
  }
}
```

#### 1.3 Public API Filtering

```typescript
// api/src/modules/public/public-pages.controller.ts

@Controller("public/pages")
export class PublicPagesController {
  // Standard public endpoint - only published content
  @Get()
  async findAll(@Query() query: FindPagesDto) {
    return this.publicPagesService.findAll({
      ...query,
      status: "published", // ALWAYS filter to published
    });
  }

  @Get(":slug")
  async findBySlug(
    @Param("slug") slug: string,
    @Query("preview") previewToken?: string,
  ) {
    // If preview token provided, validate and return any status
    if (previewToken) {
      const validated = await this.previewService.validateToken(previewToken);
      if (validated) {
        return this.publicPagesService.findBySlug(slug, {
          includeUnpublished: true,
        });
      }
    }

    // Standard flow - published only
    return this.publicPagesService.findBySlug(slug, {
      includeUnpublished: false,
    });
  }
}
```

---

### Phase 2: Client App (Preview Consumer)

#### 2.1 Draft Mode API Routes

```typescript
// client/app/api/preview/route.ts

import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response("Missing preview token", { status: 400 });
  }

  // Validate token with API
  const response = await fetch(
    `${process.env.API_URL}/preview/validate?token=${token}`,
  );

  if (!response.ok) {
    return new Response("Invalid or expired preview token", { status: 401 });
  }

  const validated = await response.json();

  // Enable Draft Mode
  const draft = await draftMode();
  draft.enable();

  // Store preview context in cookie for the session
  const previewCookie = JSON.stringify({
    contentType: validated.contentType,
    contentId: validated.contentId,
    tenantSlug: validated.tenantSlug,
  });

  // Redirect to the content
  const redirectUrl = buildRedirectUrl(validated);
  redirect(redirectUrl);
}

function buildRedirectUrl(validated: ValidatedToken): string {
  switch (validated.contentType) {
    case "page":
      return `/${validated.slug}`;
    case "post":
      return `/blog/${validated.slug}`;
    default:
      return "/";
  }
}
```

```typescript
// client/app/api/preview/disable/route.ts

import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const returnUrl = searchParams.get("returnUrl") || "/";

  const draft = await draftMode();
  draft.disable();

  redirect(returnUrl);
}
```

#### 2.2 Data Fetching with Draft Mode Awareness

```typescript
// client/lib/api/pages.ts

import { draftMode } from "next/headers";

export async function getPage(slug: string) {
  const { isEnabled } = await draftMode();

  const params = new URLSearchParams();
  if (isEnabled) {
    // In draft mode, request includes draft content
    params.set("includeDrafts", "true");
  }

  const response = await fetch(
    `${process.env.API_URL}/public/pages/${slug}?${params}`,
    {
      // Skip cache when in draft mode
      cache: isEnabled ? "no-store" : "force-cache",
      next: isEnabled
        ? {}
        : {
            revalidate: 60,
            tags: [`page-${slug}`],
          },
    },
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}
```

#### 2.3 Preview Banner Component

```typescript
// client/components/preview-banner.tsx

import { draftMode } from 'next/headers';

export async function PreviewBanner() {
  const { isEnabled } = await draftMode();

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="preview-banner">
      <div className="preview-banner-content">
        <span className="preview-badge">Preview Mode</span>
        <p>You are viewing unpublished content.</p>
        <a
          href="/api/preview/disable"
          className="preview-exit-link"
        >
          Exit Preview
        </a>
      </div>
    </div>
  );
}
```

```css
/* client/styles/preview-banner.css */

.preview-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  padding: 12px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}

.preview-banner-content {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 1200px;
}

.preview-badge {
  background: #e94560;
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preview-exit-link {
  color: #00d9ff;
  text-decoration: underline;
  font-weight: 500;
}

.preview-exit-link:hover {
  color: #fff;
}
```

---

### Phase 3: Builder Integration

#### 3.1 Auto-Save Implementation

```typescript
// builder/lib/hooks/use-auto-save.ts

import { useEffect, useRef, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { usePageStore } from "@/lib/stores/page-store";
import { useUpdatePage } from "@/lib/queries/pages";

interface UseAutoSaveOptions {
  debounceMs?: number;
  enabled?: boolean;
}

export function useAutoSave(options: UseAutoSaveOptions = {}) {
  const { debounceMs = 2000, enabled = true } = options;

  const { page, isDirty, setIsDirty, setLastSaved } = usePageStore();
  const updatePage = useUpdatePage();

  const lastSavedRef = useRef<string | null>(null);

  const save = useCallback(async () => {
    if (!page || !isDirty) return;

    const contentHash = JSON.stringify(page);

    // Skip if content hasn't actually changed
    if (contentHash === lastSavedRef.current) {
      return;
    }

    try {
      await updatePage.mutateAsync({
        id: page.id,
        data: {
          title: page.title,
          slug: page.slug,
          sections: page.sections,
          seo: page.seo,
          // Note: status is NOT updated here - saves are always to draft
        },
      });

      lastSavedRef.current = contentHash;
      setIsDirty(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Auto-save failed:", error);
      // Don't clear isDirty on error - retry on next change
    }
  }, [page, isDirty, updatePage, setIsDirty, setLastSaved]);

  const debouncedSave = useDebouncedCallback(save, debounceMs);

  // Trigger debounced save when content changes
  useEffect(() => {
    if (enabled && isDirty) {
      debouncedSave();
    }
  }, [enabled, isDirty, debouncedSave]);

  // Save immediately on unmount if dirty
  useEffect(() => {
    return () => {
      if (isDirty) {
        save();
      }
    };
  }, [isDirty, save]);

  return {
    save,
    isSaving: updatePage.isPending,
    lastSaved: usePageStore((s) => s.lastSaved),
  };
}
```

#### 3.2 Publish Actions

```typescript
// builder/lib/hooks/use-publish.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function usePublishPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pageId: string) => {
      const response = await api.post(`/pages/${pageId}/publish`);
      return response.data;
    },
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      queryClient.setQueryData(["page", page.id], page);
    },
  });
}

export function useUnpublishPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pageId: string) => {
      const response = await api.post(`/pages/${pageId}/unpublish`);
      return response.data;
    },
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      queryClient.setQueryData(["page", page.id], page);
    },
  });
}
```

#### 3.3 Preview Token Generation

```typescript
// builder/lib/hooks/use-preview-token.ts

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface GeneratePreviewTokenOptions {
  contentType: "page" | "post";
  contentId: string;
  expiresIn?: string;
}

interface PreviewToken {
  token: string;
  url: string;
  expiresAt: string;
}

export function useGeneratePreviewToken() {
  return useMutation<PreviewToken, Error, GeneratePreviewTokenOptions>({
    mutationFn: async (options) => {
      const response = await api.post("/preview/token", options);
      return response.data;
    },
  });
}
```

#### 3.4 Editor Toolbar Integration

```typescript
// builder/components/editor/editor-toolbar.tsx

import { useState } from 'react';
import { usePageStore } from '@/lib/stores/page-store';
import { usePublishPage, useUnpublishPage } from '@/lib/hooks/use-publish';
import { useGeneratePreviewToken } from '@/lib/hooks/use-preview-token';
import { useAutoSave } from '@/lib/hooks/use-auto-save';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export function EditorToolbar() {
  const { page, isDirty, lastSaved } = usePageStore();
  const { save, isSaving } = useAutoSave();

  const publishPage = usePublishPage();
  const unpublishPage = useUnpublishPage();
  const generateToken = useGeneratePreviewToken();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handlePublish = async () => {
    if (!page) return;

    // Save any pending changes first
    if (isDirty) {
      await save();
    }

    try {
      await publishPage.mutateAsync(page.id);
      toast.success('Page published successfully');
    } catch (error) {
      toast.error('Failed to publish page');
    }
  };

  const handleUnpublish = async () => {
    if (!page) return;

    try {
      await unpublishPage.mutateAsync(page.id);
      toast.success('Page unpublished');
    } catch (error) {
      toast.error('Failed to unpublish page');
    }
  };

  const handleGeneratePreviewLink = async () => {
    if (!page) return;

    // Save any pending changes first
    if (isDirty) {
      await save();
    }

    try {
      const result = await generateToken.mutateAsync({
        contentType: 'page',
        contentId: page.id,
        expiresIn: '7d',
      });

      setPreviewUrl(result.url);

      // Copy to clipboard
      await navigator.clipboard.writeText(result.url);
      toast.success('Preview link copied to clipboard');
    } catch (error) {
      toast.error('Failed to generate preview link');
    }
  };

  const isPublished = page?.status === 'published';

  return (
    <div className="editor-toolbar">
      {/* Save Status */}
      <div className="save-status">
        {isSaving && <span className="saving">Saving...</span>}
        {!isSaving && isDirty && <span className="unsaved">Unsaved changes</span>}
        {!isSaving && !isDirty && lastSaved && (
          <span className="saved">
            Saved {formatRelativeTime(lastSaved)}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="toolbar-actions">
        {/* Preview Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Preview</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => window.open(getPreviewUrl(page))}>
              Open Preview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleGeneratePreviewLink}>
              Copy Shareable Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Publish Button */}
        {isPublished ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default">
                Published
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handlePublish}>
                Update Published Version
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleUnpublish}
                className="text-destructive"
              >
                Unpublish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={handlePublish}
            disabled={publishPage.isPending}
          >
            {publishPage.isPending ? 'Publishing...' : 'Publish'}
          </Button>
        )}
      </div>
    </div>
  );
}
```

---

### Phase 4: Vercel Integration

#### 4.1 On-Demand Revalidation

```typescript
// api/src/modules/revalidation/revalidation.service.ts

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RevalidationService {
  private readonly revalidateSecret: string;
  private readonly clientAppUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.revalidateSecret = this.configService.get("REVALIDATE_SECRET");
    this.clientAppUrl = this.configService.get("CLIENT_APP_URL");
  }

  async revalidatePage(page: Page): Promise<void> {
    const tenant = await this.tenantsService.findById(page.tenantId);
    const baseUrl = this.getClientBaseUrl(tenant);

    // Revalidate by path
    await this.revalidatePath(baseUrl, `/${page.slug}`);

    // Revalidate by tag
    await this.revalidateTag(baseUrl, `page-${page.id}`);
  }

  async revalidatePost(post: Post): Promise<void> {
    const tenant = await this.tenantsService.findById(post.tenantId);
    const baseUrl = this.getClientBaseUrl(tenant);

    // Revalidate the post page
    await this.revalidatePath(baseUrl, `/blog/${post.slug}`);

    // Revalidate the blog index
    await this.revalidatePath(baseUrl, "/blog");

    // Revalidate by tag
    await this.revalidateTag(baseUrl, `post-${post.id}`);
    await this.revalidateTag(baseUrl, "posts-list");
  }

  private async revalidatePath(baseUrl: string, path: string): Promise<void> {
    try {
      await fetch(`${baseUrl}/api/revalidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-revalidate-secret": this.revalidateSecret,
        },
        body: JSON.stringify({ path }),
      });
    } catch (error) {
      console.error(`Failed to revalidate path: ${path}`, error);
    }
  }

  private async revalidateTag(baseUrl: string, tag: string): Promise<void> {
    try {
      await fetch(`${baseUrl}/api/revalidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-revalidate-secret": this.revalidateSecret,
        },
        body: JSON.stringify({ tag }),
      });
    } catch (error) {
      console.error(`Failed to revalidate tag: ${tag}`, error);
    }
  }

  private getClientBaseUrl(tenant: Tenant): string {
    // Check for custom domain first
    if (tenant.customDomain) {
      return `https://${tenant.customDomain}`;
    }
    // Fall back to subdomain
    return `https://${tenant.slug}.${this.clientAppUrl}`;
  }
}
```

#### 4.2 Revalidation API Route (Client App)

```typescript
// client/app/api/revalidate/route.ts

import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");

  // Validate secret
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { path, tag } = body;

    if (path) {
      revalidatePath(path);
      return NextResponse.json({
        revalidated: true,
        type: "path",
        value: path,
      });
    }

    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({
        revalidated: true,
        type: "tag",
        value: tag,
      });
    }

    return NextResponse.json(
      { error: "Must provide path or tag" },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 },
    );
  }
}
```

---

## Database Migrations

### PreviewToken Model

```prisma
// api/prisma/schema.prisma

model PreviewToken {
  id          String   @id @default(uuid())
  token       String   @unique
  contentType String   // 'page' | 'post'
  contentId   String
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  createdBy   String
  user        User     @relation(fields: [createdBy], references: [id])
  expiresAt   DateTime
  createdAt   DateTime @default(now())

  @@index([token])
  @@index([tenantId])
  @@index([expiresAt])
}
```

---

## Environment Variables

### API

```env
# .env (API)

# Revalidation
REVALIDATE_SECRET=your-secure-random-string
CLIENT_APP_URL=your-client-domain.vercel.app

# Preview
CLIENT_PREVIEW_URL=https://your-client-domain.vercel.app
```

### Client App

```env
# .env (Client)

# Revalidation
REVALIDATE_SECRET=your-secure-random-string

# API
API_URL=https://your-api-domain.vercel.app
```

---

## Security Considerations

### Preview Token Security

1. **Token Generation**: Use cryptographically secure random UUIDs
2. **Expiration**: Default 7-day expiry, configurable per token
3. **Revocation**: Tokens can be deleted to revoke access
4. **Scope**: Tokens are scoped to specific content, not full site access

### Draft Mode Security

1. **Cookie-Based**: Draft mode uses secure HTTP-only cookies
2. **Session Scoped**: Enabled per-session, not persisted long-term
3. **Exit Control**: Users can disable at any time via `/api/preview/disable`

### Revalidation Security

1. **Shared Secret**: API and Client share a secret for authentication
2. **Server-Only**: Revalidation endpoint only accessible server-to-server
3. **No User Input**: Paths/tags come from trusted API, not user input

---

## User Experience Flow

### Builder User (Agency/Client Editor)

```
1. Edit page in builder
   ↓
2. Changes auto-save (debounced 2s)
   ↓
3. Click "Preview" to open in new tab (Draft Mode)
   ↓
4. Or click "Copy Shareable Link" to share with client
   ↓
5. When ready, click "Publish"
   ↓
6. Page instantly live (on-demand revalidation)
```

### Client Reviewer (Via Shareable Link)

```
1. Receive preview link via email/message
   ↓
2. Click link → Draft Mode enabled
   ↓
3. View page with preview banner at bottom
   ↓
4. Provide feedback to agency
   ↓
5. Click "Exit Preview" when done
```

### Public Visitor

```
1. Visit site normally
   ↓
2. Only see published content
   ↓
3. Fast static pages from Vercel CDN
   ↓
4. No awareness of draft content
```

---

## Future Enhancements

1. **Scheduled Publishing**: Set publish date/time for content
2. **Version History**: Track and restore previous versions
3. **Approval Workflows**: Require approval before publish
4. **Preview Comments**: Allow reviewers to leave feedback directly
5. **A/B Testing**: Publish multiple versions for testing
6. **Rollback**: Quick revert to previous published version

---

**Last Updated:** 2025-01-22
**Version:** 1.0
**Status:** Ready for Implementation
