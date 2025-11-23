# Two-Tier Content Management System

## Overview

The platform offers two distinct product tiers with different capabilities and pricing:

1. **Content Editor Tier** - WordPress-like content editing only
2. **Builder Tier** - Full visual builder with structural control

This document outlines the technical implementation of the two-tier system.

---

## Product Tiers Comparison

### Tier 1: Content Editor ($49/month)

**Philosophy:** Safe content editing within existing structure

**What Users CAN Do:**

- ✅ Edit text in existing blocks
- ✅ Replace images in existing blocks
- ✅ Adjust colors (from token palette)
- ✅ Change fonts (from token options)
- ✅ Update spacing (from token scale)
- ✅ Edit SEO metadata
- ✅ Manage media library
- ✅ Publish/unpublish pages

**What Users CANNOT Do:**

- ❌ Add new blocks
- ❌ Remove existing blocks
- ❌ Rearrange block order
- ❌ Change page layout structure
- ❌ Create new pages
- ❌ Delete pages
- ❌ Access builder mode

**Use Case:**
Small churches or businesses that just need to keep content fresh (update service times, post events, change photos) but don't need to redesign their site.

---

### Tier 2: Builder ($149/month)

**Philosophy:** Full creative control within professional constraints

**Everything in Content Editor, PLUS:**

- ✅ Add new blocks from library
- ✅ Remove blocks
- ✅ Drag-and-drop to rearrange
- ✅ Create new pages
- ✅ Delete pages
- ✅ Duplicate pages
- ✅ Change page templates
- ✅ Adjust responsive breakpoints
- ✅ Access visual builder mode
- ✅ Section management (add/remove/rearrange)

**Still Token-Constrained:**

- All design via tokens (no arbitrary CSS)
- Professional quality enforced
- Accessibility maintained
- Performance optimized

**Use Case:**
Growing organizations that need flexibility to evolve their site as their needs change.

---

## Technical Implementation

### 1. Database Schema

```typescript
// api/src/modules/tenants/entities/tenant.entity.ts
export enum TenantTier {
  CONTENT_EDITOR = 'content-editor',
  BUILDER = 'builder',
}

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  businessName: string;

  @Column({
    type: 'enum',
    enum: TenantTier,
    default: TenantTier.CONTENT_EDITOR,
  })
  tier: TenantTier;

  @Column({ type: 'jsonb', default: {} })
  features: TenantFeatures;

  @Column({ nullable: true })
  stripeCustomerId: string;

  @Column({ nullable: true })
  stripeSub scriptionId: string;

  // ... other fields
}
```

### 2. Backend Permissions

#### Tier Guard Decorator

```typescript
// api/src/common/decorators/require-tier.decorator.ts
import { SetMetadata } from "@nestjs/common";
import { TenantTier } from "@/modules/tenants/entities/tenant.entity";

export const TIER_KEY = "required_tier";
export const RequireTier = (tier: TenantTier) => SetMetadata(TIER_KEY, tier);
```

#### Tier Guard

```typescript
// api/src/common/guards/tier.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { TIER_KEY } from "../decorators/require-tier.decorator";
import { TenantTier } from "@/modules/tenants/entities/tenant.entity";

@Injectable()
export class TierGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredTier = this.reflector.getAllAndOverride<TenantTier>(
      TIER_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredTier) {
      return true; // No tier requirement
    }

    const request = context.switchToHttp().getRequest();
    const tenant = request.tenant;

    if (!tenant) {
      throw new ForbiddenException("Tenant not found");
    }

    const tierHierarchy = {
      [TenantTier.CONTENT_EDITOR]: 1,
      [TenantTier.BUILDER]: 2,
    };

    if (tierHierarchy[tenant.tier] < tierHierarchy[requiredTier]) {
      throw new ForbiddenException(
        `This feature requires ${requiredTier} tier or higher`,
      );
    }

    return true;
  }
}
```

#### Usage in Controllers

```typescript
// api/src/modules/pages/pages.controller.ts
import { Controller, Get, Post, Delete, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { TenantGuard } from "@/common/guards/tenant.guard";
import { TierGuard } from "@/common/guards/tier.guard";
import { RequireTier } from "@/common/decorators/require-tier.decorator";
import { TenantTier } from "@/modules/tenants/entities/tenant.entity";

@Controller("pages")
@UseGuards(JwtAuthGuard, TenantGuard, TierGuard)
export class PagesController {
  @Get()
  async findAll() {
    // Both tiers can list pages
    return this.pagesService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    // Both tiers can view a page
    return this.pagesService.findOne(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updatePageDto: UpdatePageDto) {
    // Both tiers can update page content
    // But we'll validate the specific changes in the service
    return this.pagesService.update(id, updatePageDto);
  }

  @Post()
  @RequireTier(TenantTier.BUILDER) // Only Builder tier can create pages
  async create(@Body() createPageDto: CreatePageDto) {
    return this.pagesService.create(createPageDto);
  }

  @Delete(":id")
  @RequireTier(TenantTier.BUILDER) // Only Builder tier can delete pages
  async remove(@Param("id") id: string) {
    return this.pagesService.remove(id);
  }

  @Post(":id/duplicate")
  @RequireTier(TenantTier.BUILDER) // Only Builder tier can duplicate
  async duplicate(@Param("id") id: string) {
    return this.pagesService.duplicate(id);
  }
}
```

#### Content vs Structure Validation

```typescript
// api/src/modules/pages/pages.service.ts
@Injectable()
export class PagesService {
  async update(id: string, updatePageDto: UpdatePageDto, tenant: Tenant) {
    const existingPage = await this.findOne(id);

    // If Content Editor tier, validate they're only changing content
    if (tenant.tier === TenantTier.CONTENT_EDITOR) {
      this.validateContentOnlyChanges(existingPage, updatePageDto);
    }

    // Proceed with update
    return this.pagesRepository.save({
      ...existingPage,
      ...updatePageDto,
    });
  }

  private validateContentOnlyChanges(
    existing: Page,
    updates: UpdatePageDto,
  ): void {
    // Check if structure changed
    if (updates.content?.sections) {
      const existingBlocks = this.extractBlockKeys(existing.content.sections);
      const updatedBlocks = this.extractBlockKeys(updates.content.sections);

      // Same blocks, same order = OK
      const structureChanged =
        existingBlocks.length !== updatedBlocks.length ||
        !existingBlocks.every((key, index) => key === updatedBlocks[index]);

      if (structureChanged) {
        throw new ForbiddenException(
          "Content Editor tier cannot modify page structure. Upgrade to Builder tier to add, remove, or rearrange blocks.",
        );
      }

      // Validate only data changed, not block types
      this.validateBlockDataOnly(
        existing.content.sections,
        updates.content.sections,
      );
    }
  }

  private extractBlockKeys(sections: Section[]): string[] {
    const keys: string[] = [];
    sections.forEach((section) => {
      section.blocks.forEach((block) => {
        keys.push(block._key);
        if ("blocks" in block && block.blocks) {
          keys.push(...this.extractNestedBlockKeys(block.blocks));
        }
      });
    });
    return keys;
  }

  private validateBlockDataOnly(
    existingSections: Section[],
    updatedSections: Section[],
  ): void {
    // Recursively check that only 'data' fields changed, not types
    existingSections.forEach((existingSection, sectionIndex) => {
      const updatedSection = updatedSections[sectionIndex];

      existingSection.blocks.forEach((existingBlock, blockIndex) => {
        const updatedBlock = updatedSection.blocks[blockIndex];

        if (existingBlock._type !== updatedBlock._type) {
          throw new ForbiddenException(
            `Content Editor tier cannot change block types`,
          );
        }

        // Recursively check nested blocks
        if ("blocks" in existingBlock && existingBlock.blocks) {
          if (!("blocks" in updatedBlock) || !updatedBlock.blocks) {
            throw new ForbiddenException(
              `Content Editor tier cannot remove nested blocks`,
            );
          }
          this.validateBlockDataOnly(
            [{ _type: "section", _key: "temp", blocks: existingBlock.blocks }],
            [{ _type: "section", _key: "temp", blocks: updatedBlock.blocks }],
          );
        }
      });
    });
  }
}
```

---

### 3. Frontend Implementation

#### Tier Context

```typescript
// builder/lib/contexts/tier-context.tsx
'use client';

import { createContext, useContext } from 'react';
import { useTenant } from '@/lib/hooks/use-tenant';

interface TierContextValue {
  tier: 'content-editor' | 'builder';
  isBuilder: boolean;
  isContentEditor: boolean;
  canAddBlocks: boolean;
  canRemoveBlocks: boolean;
  canRearrangeBlocks: boolean;
  canCreatePages: boolean;
  canDeletePages: boolean;
}

const TierContext = createContext<TierContextValue | undefined>(undefined);

export function TierProvider({ children }: { children: React.ReactNode }) {
  const { data: tenant } = useTenant();

  const tier = tenant?.tier || 'content-editor';
  const isBuilder = tier === 'builder';
  const isContentEditor = tier === 'content-editor';

  const value: TierContextValue = {
    tier,
    isBuilder,
    isContentEditor,
    canAddBlocks: isBuilder,
    canRemoveBlocks: isBuilder,
    canRearrangeBlocks: isBuilder,
    canCreatePages: isBuilder,
    canDeletePages: isBuilder,
  };

  return <TierContext.Provider value={value}>{children}</TierContext.Provider>;
}

export function useTier() {
  const context = useContext(TierContext);
  if (!context) {
    throw new Error('useTier must be used within TierProvider');
  }
  return context;
}
```

#### Conditional UI

```typescript
// builder/app/(clients)/[id]/pages/[pageId]/edit/page.tsx
import { useTier } from '@/lib/contexts/tier-context';

export default function PageEditorPage({ params }: { params: { id: string; pageId: string } }) {
  const { canAddBlocks, canRemoveBlocks, canRearrangeBlocks } = useTier();
  const { data: page } = usePage(params.id, params.pageId);

  return (
    <PageEditorLayout>
      {/* Blocks Library - only show if can add blocks */}
      {canAddBlocks && (
        <BlocksLibrary />
      )}

      {/* Canvas */}
      <div className="editor-canvas">
        {page.content.sections.map((section) => (
          <Section key={section._key}>
            {section.blocks.map((block) => (
              <BlockEditor
                key={block._key}
                block={block}
                canDelete={canRemoveBlocks}
                canDrag={canRearrangeBlocks}
                mode={canAddBlocks ? 'builder' : 'content-only'}
              />
            ))}
          </Section>
        ))}
      </div>
    </PageEditorLayout>
  );
}
```

#### Block Editor Modes

```typescript
// builder/components/blocks/button-block-editor.tsx
import { useTier } from '@/lib/contexts/tier-context';

interface BlockEditorProps {
  block: Block;
  onChange: (block: Block) => void;
  onDelete?: () => void;
}

export function ButtonBlockEditor({ block, onChange, onDelete }: BlockEditorProps) {
  const { isBuilder, canRemoveBlocks } = useTier();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="block-wrapper">
      {/* Preview mode */}
      {!isEditing && (
        <div
          className="block-preview"
          onClick={() => setIsEditing(true)}
        >
          <Button variant={block.data.variant}>
            {block.data.text}
          </Button>

          {/* Delete button - only show for Builder tier */}
          {canRemoveBlocks && (
            <button onClick={onDelete}>Delete</button>
          )}
        </div>
      )}

      {/* Edit mode */}
      {isEditing && (
        <div className="block-editor">
          <h4>Button Block</h4>

          {/* Content fields - available to both tiers */}
          <div>
            <Label>Button Text</Label>
            <Input
              value={block.data.text}
              onChange={(e) => onChange({
                ...block,
                data: { ...block.data, text: e.target.value }
              })}
            />
          </div>

          <div>
            <Label>Link URL</Label>
            <Input
              value={block.data.href}
              onChange={(e) => onChange({
                ...block,
                data: { ...block.data, href: e.target.value }
              })}
            />
          </div>

          {/* Style controls - available to both tiers (token-based) */}
          <div>
            <Label>Variant</Label>
            <Select
              value={block.data.variant}
              onValueChange={(value) => onChange({
                ...block,
                data: { ...block.data, variant: value }
              })}
            >
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
            </Select>
          </div>

          <button onClick={() => setIsEditing(false)}>Done</button>
        </div>
      )}
    </div>
  );
}
```

#### Page List with Tier Restrictions

```typescript
// builder/app/(clients)/[id]/pages/page.tsx
import { useTier } from '@/lib/contexts/tier-context';

export default function PagesListPage({ params }: { params: { id: string } }) {
  const { canCreatePages, canDeletePages } = useTier();
  const { data: pages } = usePages(params.id);
  const deletePage = useDeletePage();

  return (
    <div>
      <div className="header">
        <h1>Pages</h1>

        {/* Create button - only for Builder tier */}
        {canCreatePages ? (
          <Button href={`/${params.id}/pages/new`}>Create Page</Button>
        ) : (
          <UpgradeTip feature="create pages" />
        )}
      </div>

      <div className="pages-grid">
        {pages?.map((page) => (
          <PageCard
            key={page.id}
            page={page}
            canDelete={canDeletePages}
            onDelete={() => deletePage.mutate(page.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

#### Upgrade Prompts

```typescript
// builder/components/upgrade-tip.tsx
import { useTier } from '@/lib/contexts/tier-context';

export function UpgradeTip({ feature }: { feature: string }) {
  const { tier } = useTier();

  if (tier === 'builder') return null;

  return (
    <div className="upgrade-tip">
      <p>Want to {feature}?</p>
      <Link href="/upgrade">
        Upgrade to Builder tier
      </Link>
    </div>
  );
}
```

---

## User Experience Flow

### Content Editor Tier Experience

1. **Login** → Redirected to page editor
2. **Click on block** → Opens editing form with content fields only
3. **Edit text/images** → Changes saved immediately
4. **Try to delete block** → No delete button visible
5. **Try to add block** → No blocks library visible
6. **Try to create page** → "Upgrade to Builder" prompt shown
7. **Save** → Content updates sent to API, structural changes rejected

### Builder Tier Experience

1. **Login** → Redirected to dashboard/pages
2. **Click "Create Page"** → Template selector → Blank canvas
3. **Click "Add Block"** → Blocks library slides in
4. **Drag block to canvas** → Block added to structure
5. **Click block** → Edit content AND structure options
6. **Drag block** → Reorder with visual feedback
7. **Delete block** → Confirmation → Removed from structure
8. **Save** → All changes (content + structure) saved

---

## Upgrade Flow

### In-App Upgrade

```typescript
// builder/app/upgrade/page.tsx
export default function UpgradePage() {
  const { tier } = useTier();
  const upgradeTier = useUpgradeTier();

  if (tier === 'builder') {
    return <p>You're already on Builder tier!</p>;
  }

  return (
    <div className="upgrade-page">
      <h1>Upgrade to Builder</h1>

      <div className="comparison">
        <div className="tier-card current">
          <h2>Content Editor</h2>
          <p className="price">$49/month</p>
          <ul>
            <li>Edit existing content</li>
            <li>Update images & text</li>
            <li>Basic customization</li>
          </ul>
        </div>

        <div className="tier-card upgrade">
          <h2>Builder</h2>
          <p className="price">$149/month</p>
          <ul>
            <li><strong>Everything in Content Editor</strong></li>
            <li><strong>Add/remove/rearrange blocks</strong></li>
            <li><strong>Create new pages</strong></li>
            <li><strong>Full layout control</strong></li>
            <li><strong>Advanced SEO tools</strong></li>
            <li><strong>Team members (up to 5)</strong></li>
          </ul>
          <Button onClick={() => upgradeTier.mutate()}>
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### Stripe Integration

```typescript
// api/src/modules/billing/billing.service.ts
@Injectable()
export class BillingService {
  async upgradeTier(tenantId: string, newTier: TenantTier) {
    const tenant = await this.tenantsService.findOne(tenantId);

    // Create or update Stripe subscription
    const subscription = await this.stripe.subscriptions.create({
      customer: tenant.stripeCustomerId,
      items: [
        {
          price: TIER_PRICE_IDS[newTier],
        },
      ],
    });

    // Update tenant
    await this.tenantsService.update(tenantId, {
      tier: newTier,
      stripeSubscriptionId: subscription.id,
    });

    return { success: true };
  }
}
```

---

## Testing Strategy

### Unit Tests

```typescript
// api/src/modules/pages/pages.service.spec.ts
describe("PagesService - Tier Permissions", () => {
  it("should allow content-only changes for Content Editor tier", async () => {
    const tenant = { tier: TenantTier.CONTENT_EDITOR };
    const existing = {
      content: {
        sections: [
          /* ... */
        ],
      },
    };
    const updates = {
      content: {
        sections: [
          /* same structure, different data */
        ],
      },
    };

    await expect(service.update("id", updates, tenant)).resolves.toBeDefined();
  });

  it("should reject structural changes for Content Editor tier", async () => {
    const tenant = { tier: TenantTier.CONTENT_EDITOR };
    const existing = {
      content: {
        sections: [
          /* 2 blocks */
        ],
      },
    };
    const updates = {
      content: {
        sections: [
          /* 3 blocks */
        ],
      },
    };

    await expect(service.update("id", updates, tenant)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it("should allow all changes for Builder tier", async () => {
    const tenant = { tier: TenantTier.BUILDER };
    const updates = {
      content: {
        sections: [
          /* any structure */
        ],
      },
    };

    await expect(service.update("id", updates, tenant)).resolves.toBeDefined();
  });
});
```

### E2E Tests

```typescript
// api/test/tiers.e2e-spec.ts
describe("Tier Permissions (e2e)", () => {
  it("Content Editor cannot create pages", () => {
    return request(app.getHttpServer())
      .post("/pages")
      .set("Authorization", contentEditorToken)
      .send({ title: "New Page" })
      .expect(403);
  });

  it("Builder can create pages", () => {
    return request(app.getHttpServer())
      .post("/pages")
      .set("Authorization", builderToken)
      .send({ title: "New Page" })
      .expect(201);
  });
});
```

---

## Future Enhancements

1. **Custom Tiers**
   - Create custom pricing tiers per client
   - Mix and match permissions

2. **Trial Period**
   - Give all new clients 14-day Builder access
   - Auto-downgrade to Content Editor if not upgraded

3. **Team Permissions**
   - Different team members with different permissions
   - Owner has Builder, Staff has Content Editor

4. **Usage Analytics**
   - Track which features clients use most
   - Identify upsell opportunities

5. **Gradual Rollout**
   - A/B test pricing tiers
   - Measure conversion rates

---

**Last Updated:** 2025-01-22
**Version:** 1.0
**Status:** Ready for Implementation
