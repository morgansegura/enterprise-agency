# Feature Flags System

## Overview

The feature flags system enables progressive feature development and monetization. Features can be built when needed for specific clients, then unlocked for other clients as appropriate.

---

## Core Concept

**Build → Deploy → Gate → Unlock → Monetize**

1. **Build**: Develop feature when client needs it
2. **Deploy**: Feature exists in platform codebase
3. **Gate**: Feature hidden behind permission check
4. **Unlock**: Enable feature for specific tenants
5. **Monetize**: Charge based on unlocked features

---

## Feature Flag Structure

### Database Schema

```typescript
// Tenant model includes feature flags
interface Tenant {
  id: string;
  slug: string;
  businessName: string;

  // Tier & Billing
  tier: "content-editor" | "builder";
  billingPlan: "starter" | "professional" | "enterprise";

  // Feature Flags
  features: TenantFeatures;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

interface TenantFeatures {
  // Core Features (included in all plans)
  pages: boolean; // Always true
  media: boolean; // Always true

  // Tier-based Features
  builder: boolean; // Only true for 'builder' tier

  // Optional Features (unlocked per tenant)
  blog: boolean;
  customDomain: boolean;
  seo: boolean;
  analytics: boolean;

  // E-Commerce Features
  shop: boolean;
  products: boolean;
  orders: boolean;
  customers: boolean;
  payments: {
    stripe: boolean;
    square: boolean;
    shopify: boolean;
  };

  // Marketing Features
  forms: boolean;
  emailMarketing: boolean;
  leadCapture: boolean;

  // Business Features
  bookings: boolean;
  events: boolean;
  donations: boolean;
  membership: boolean;

  // Advanced Features
  multiLanguage: boolean;
  abTesting: boolean;
  customCode: boolean;
  apiAccess: boolean;

  // White-label Features
  customBranding: boolean;
  clientPortal: boolean;
  teamMembers: {
    enabled: boolean;
    maxUsers: number;
  };
}
```

---

## Feature Flag Tiers

### Tier 1: Content Editor ($49/month)

**What's Included:**

- ✅ Pages management (edit existing content only)
- ✅ Media library (upload/manage images)
- ✅ Basic SEO (meta tags, descriptions)
- ✅ Theme customization (within token constraints)
- ✅ Mobile responsive
- ✅ SSL & hosting
- ❌ Cannot add/remove/rearrange blocks
- ❌ Cannot create new page layouts
- ❌ No advanced features

**Use Case:** Small churches/businesses that need to update content (events, sermons, contact info) but don't need structural changes.

### Tier 2: Builder ($149/month)

**Everything in Content Editor, plus:**

- ✅ Full builder access (add/remove/rearrange blocks)
- ✅ Create new pages
- ✅ Custom layouts
- ✅ Advanced SEO tools
- ✅ Analytics dashboard
- ✅ Form builder
- ✅ Team members (up to 5)

**Use Case:** Growing organizations that need flexibility to evolve their site structure.

### Add-On Features (Priced Separately)

**E-Commerce Suite** (+$99/month)

- Shop/products/orders
- Stripe/Square integration
- Customer accounts
- Inventory management

**Marketing Suite** (+$49/month)

- Email marketing integration
- Lead capture forms
- A/B testing
- Advanced analytics

**Business Suite** (+$79/month)

- Event booking
- Donation system
- Membership areas
- Custom domains

**Enterprise Features** (Custom Pricing)

- Multi-language support
- Custom code injection
- API access
- White-label client portal
- Unlimited team members

---

## Implementation

### 1. Backend: Feature Guard Decorator

```typescript
// api/src/common/decorators/feature-gate.decorator.ts
import { SetMetadata } from "@nestjs/common";

export const FEATURE_KEY = "required_feature";
export const RequireFeature = (...features: (keyof TenantFeatures)[]) =>
  SetMetadata(FEATURE_KEY, features);
```

### 2. Backend: Feature Guard

```typescript
// api/src/common/guards/feature.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FEATURE_KEY } from "../decorators/feature-gate.decorator";

@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredFeatures = this.reflector.getAllAndOverride<string[]>(
      FEATURE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredFeatures) {
      return true; // No feature required
    }

    const request = context.switchToHttp().getRequest();
    const tenant = request.tenant; // Injected by TenantGuard

    if (!tenant) {
      throw new ForbiddenException("Tenant not found");
    }

    // Check if tenant has all required features
    const hasAllFeatures = requiredFeatures.every((feature) => {
      // Support nested features (e.g., 'payments.stripe')
      const keys = feature.split(".");
      let value: any = tenant.features;

      for (const key of keys) {
        value = value?.[key];
        if (value === undefined) return false;
      }

      return value === true;
    });

    if (!hasAllFeatures) {
      throw new ForbiddenException(
        `Feature not enabled for this tenant: ${requiredFeatures.join(", ")}`,
      );
    }

    return true;
  }
}
```

### 3. Backend: Usage in Controllers

```typescript
// api/src/modules/products/products.controller.ts
import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { TenantGuard } from "@/common/guards/tenant.guard";
import { FeatureGuard } from "@/common/guards/feature.guard";
import { RequireFeature } from "@/common/decorators/feature-gate.decorator";

@Controller("products")
@UseGuards(JwtAuthGuard, TenantGuard, FeatureGuard)
export class ProductsController {
  @Get()
  @RequireFeature("shop") // Requires shop feature enabled
  async findAll() {
    // Return products
  }

  @Post()
  @RequireFeature("shop", "products") // Requires both features
  async create() {
    // Create product
  }

  @Post("checkout")
  @RequireFeature("shop", "payments.stripe") // Requires nested feature
  async checkout() {
    // Process Stripe payment
  }
}
```

### 4. Frontend: Feature Hook

```typescript
// builder/lib/hooks/use-features.ts
import { useTenant } from "./use-tenant";

export function useFeature(feature: string): boolean {
  const { data: tenant } = useTenant();

  if (!tenant) return false;

  const keys = feature.split(".");
  let value: any = tenant.features;

  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) return false;
  }

  return value === true;
}

export function useFeatures() {
  const { data: tenant } = useTenant();
  return tenant?.features || {};
}

export function useHasAllFeatures(...features: string[]): boolean {
  const { data: tenant } = useTenant();

  if (!tenant) return false;

  return features.every((feature) => {
    const keys = feature.split(".");
    let value: any = tenant.features;

    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return false;
    }

    return value === true;
  });
}

export function useHasAnyFeature(...features: string[]): boolean {
  const { data: tenant } = useTenant();

  if (!tenant) return false;

  return features.some((feature) => {
    const keys = feature.split(".");
    let value: any = tenant.features;

    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return false;
    }

    return value === true;
  });
}
```

### 5. Frontend: Conditional Rendering

```typescript
// builder/app/dashboard/page.tsx
import { useFeature, useHasAllFeatures } from '@/lib/hooks/use-features';

export default function DashboardPage() {
  const hasShop = useFeature('shop');
  const hasBookings = useFeature('bookings');
  const canUseStripe = useHasAllFeatures('shop', 'payments.stripe');

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Show shop link only if enabled */}
      {hasShop && (
        <Link href="/dashboard/shop">Shop</Link>
      )}

      {/* Show bookings if enabled */}
      {hasBookings && (
        <Link href="/dashboard/bookings">Bookings</Link>
      )}

      {/* Show Stripe settings only if both shop and Stripe enabled */}
      {canUseStripe && (
        <StripeSettings />
      )}
    </div>
  );
}
```

### 6. Frontend: Route Protection

```typescript
// builder/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const FEATURE_ROUTES: Record<string, string> = {
  "/dashboard/shop": "shop",
  "/dashboard/products": "shop",
  "/dashboard/orders": "shop",
  "/dashboard/bookings": "bookings",
  "/dashboard/events": "events",
  "/dashboard/donations": "donations",
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if route requires feature
  const requiredFeature = FEATURE_ROUTES[path];

  if (requiredFeature) {
    // Get tenant from session/cookie
    const tenant = await getTenantFromRequest(request);

    // Check feature
    const hasFeature = checkFeature(tenant, requiredFeature);

    if (!hasFeature) {
      return NextResponse.redirect(new URL("/dashboard/upgrade", request.url));
    }
  }

  return NextResponse.next();
}
```

---

## Feature Development Workflow

### Adding a New Feature

1. **Develop Feature**

   ```bash
   # Create feature module
   nest g module modules/bookings
   nest g service modules/bookings
   nest g controller modules/bookings
   ```

2. **Add Feature Flag to Type**

   ```typescript
   // api/src/common/types/tenant.types.ts
   interface TenantFeatures {
     // ... existing features
     bookings: boolean; // NEW
   }
   ```

3. **Protect Routes**

   ```typescript
   @Controller("bookings")
   @UseGuards(JwtAuthGuard, TenantGuard, FeatureGuard)
   export class BookingsController {
     @Get()
     @RequireFeature("bookings")
     async findAll() {
       // ...
     }
   }
   ```

4. **Add Frontend UI**

   ```typescript
   // builder/app/dashboard/layout.tsx
   import { useFeature } from '@/lib/hooks/use-features';

   function DashboardNav() {
     const hasBookings = useFeature('bookings');

     return (
       <nav>
         {/* ... other nav items */}
         {hasBookings && (
           <NavLink href="/dashboard/bookings">Bookings</NavLink>
         )}
       </nav>
     );
   }
   ```

5. **Enable for Tenant**
   ```typescript
   // Via admin UI or API
   await tenantsService.update(tenantId, {
     features: {
       ...existingFeatures,
       bookings: true,
     },
   });
   ```

---

## Monetization Strategy

### Pricing Tiers

```typescript
interface BillingPlan {
  id: string;
  name: string;
  price: number; // monthly
  tier: 'content-editor' | 'builder';
  includedFeatures: (keyof TenantFeatures)[];
  limits: {
    pages: number;
    storage: number; // GB
    bandw idth: number; // GB/month
    teamMembers: number;
  };
}

const PLANS: BillingPlan[] = [
  {
    id: 'content-editor',
    name: 'Content Editor',
    price: 49,
    tier: 'content-editor',
    includedFeatures: ['pages', 'media', 'seo'],
    limits: {
      pages: 20,
      storage: 5,
      bandwidth: 50,
      teamMembers: 2,
    },
  },
  {
    id: 'builder',
    name: 'Builder',
    price: 149,
    tier: 'builder',
    includedFeatures: ['pages', 'media', 'seo', 'builder', 'forms', 'analytics'],
    limits: {
      pages: 100,
      storage: 25,
      bandwidth: 250,
      teamMembers: 5,
    },
  },
];

const ADD_ONS = [
  { id: 'shop', name: 'E-Commerce Suite', price: 99 },
  { id: 'bookings', name: 'Booking System', price: 79 },
  { id: 'events', name: 'Events Calendar', price: 49 },
  { id: 'donations', name: 'Donations', price: 39 },
  { id: 'custom-domain', name: 'Custom Domain', price: 9 },
];
```

---

## Admin Management UI

### Feature Management Dashboard

```typescript
// builder/app/admin/tenants/[id]/features/page.tsx
export default function TenantFeaturesPage({ params }: { params: { id: string } }) {
  const { data: tenant } = useTenant(params.id);
  const updateFeatures = useUpdateTenantFeatures();

  const toggleFeature = (feature: string) => {
    updateFeatures.mutate({
      tenantId: params.id,
      features: {
        ...tenant.features,
        [feature]: !tenant.features[feature],
      },
    });
  };

  return (
    <div>
      <h1>Features for {tenant.businessName}</h1>

      <div className="feature-grid">
        {AVAILABLE_FEATURES.map(feature => (
          <div key={feature.key} className="feature-card">
            <h3>{feature.name}</h3>
            <p>{feature.description}</p>
            <Switch
              checked={tenant.features[feature.key]}
              onCheckedChange={() => toggleFeature(feature.key)}
            />
            {feature.price && (
              <span className="price">+${feature.price}/mo</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Future Enhancements

1. **Usage-Based Pricing**
   - Track API calls, storage, bandwidth
   - Charge overages automatically

2. **Feature Analytics**
   - Track which features are most used
   - Identify upsell opportunities

3. **Self-Service Upgrades**
   - Let clients upgrade/downgrade via portal
   - Automated billing through Stripe

4. **Feature Bundles**
   - Pre-configured bundles for industries
   - Church bundle, Restaurant bundle, Retail bundle

5. **Time-Limited Trials**
   - Enable features for 14-day trial
   - Auto-disable if not purchased

---

**Last Updated:** 2025-01-22
**Version:** 1.0
**Status:** Ready for Implementation
