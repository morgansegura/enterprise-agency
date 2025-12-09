# Product Vision & Strategy

## Executive Summary

We are building a **professional web agency platform** that enables us to deliver cutting-edge, custom frontends for clients across multiple industries, starting with churches. The platform consists of a powerful builder system with progressive feature development and a two-tier product offering.

**Core Principles:**

1. **100% Professional Frontends** - Zero compromise on frontend quality
2. **Token-Based Design System** - All styles controlled via design tokens, no inline CSS
3. **Progressive Features** - Build features when needed, unlock for clients as needed
4. **Two-Tier Product** - Content editing vs full builder access
5. **We Own Everything** - API, security, data, deployment

---

## The Vision

### What We're Building

A **white-label website platform** that allows our agency to:

1. Build professional, custom websites for clients
2. Manage multiple clients from a single admin platform
3. Unlock features progressively as they're needed
4. Charge different tiers for different capabilities
5. Maintain complete control over design quality via tokens

### What Makes This Different

**Not Webflow/Builder.io:**

- We're not building a public product for everyone
- We're building an internal tool for our agency's specific clients
- We build features when we need them (shop for print client → available for all)
- We gate features behind permissions (agency controls who gets what)

**Two-Tier Product Strategy:**

#### Tier 1: Content Editor (WordPress-like)

- Clients can only **edit existing content**
- Change text, images, colors (within token constraints)
- No structural changes (can't add/remove/rearrange blocks)
- Perfect for most clients who just need to update their site
- **Lower price point**

#### Tier 2: Builder Access (Full Control)

- Everything in Tier 1, plus:
- Add/remove/rearrange blocks
- Create new pages
- Adjust layouts (within token system)
- Access to all unlocked features for their tenant
- **Higher price point**

---

## Token-Based Design System

### Why Tokens Over Inline CSS

**The Constraint is the Feature:**

Webflow/Builder.io use inline CSS because they're public tools serving everyone. We're building for specific verticals (churches, print companies, local businesses) where we can define professional design constraints.

**Benefits:**

- **Consistent, on-brand designs** - Every site looks professional
- **Performance** - Shared CSS, cached styles, minimal HTML
- **Maintainability** - Change tokens, update everywhere
- **Client-proof** - They can't break the design
- **Accessibility** - Built into the system
- **100% Unique** - Token values create unique brand expressions

### How Tokens Enable Uniqueness

Two clients using the same blocks can have completely different sites via tokens:

**Example: Modern Church vs Traditional Church**

```typescript
// Tenant A: Modern Church
tokens: {
  colors: {
    primary: { 500: '#10b981' }, // emerald
    secondary: { 500: '#3b82f6' } // blue
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter'
  },
  radii: { default: '0.5rem' }, // rounded
  spacing: { scale: 1 } // comfortable spacing
}

// Tenant B: Traditional Church
tokens: {
  colors: {
    primary: { 500: '#1e3a8a' }, // navy
    secondary: { 500: '#f59e0b' } // gold
  },
  fonts: {
    heading: 'Crimson Pro',
    body: 'Lora'
  },
  radii: { default: '0' }, // sharp corners
  spacing: { scale: 0.875 } // tighter spacing
}
```

Same blocks, completely different visual identity.

### Design Token Hierarchy

**Token Structure:**

```
Global Tokens (Platform Defaults)
  ↓
Tenant Tokens (Client Brand)
  ↓
Page Tokens (Optional Overrides)
  ↓
Block Tokens (Rare Overrides)
```

**Token Categories:**

- **Colors**: Primary, secondary, accent, neutral (50-950 scales)
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Consistent spacing scale (xs → 5xl)
- **Layout**: Breakpoints, max-widths, gaps
- **Borders**: Radii, widths, styles
- **Shadows**: Elevation system
- **Effects**: Transitions, animations (from preset library)

---

## Progressive Feature Development

### The Strategy

**Build When Needed, Monetize After:**

1. Client needs a feature (e.g., print company needs shop)
2. We build the shop feature
3. Shop is now available in the platform
4. We can unlock it for other clients (gated by feature flags)
5. We charge based on which features are unlocked

### Feature Roadmap

**Phase 1: Core Features** (Current)

- ✅ Page builder with blocks
- ✅ Content management (pages)
- ⏳ Blog system
- ⏳ Media library
- ⏳ Theme/token management
- ⏳ Two-tier permission system

**Phase 2: E-Commerce** (When Print Client Needs It)

- Shop feature
- Product catalog
- Shopping cart
- Checkout (Stripe/Square/Shopify API integration)
- Order management
- Customer accounts

**Phase 3: Advanced Features** (As Needed)

- Booking system (for service businesses, BnBs)
- Events calendar (for churches, venues)
- Donations (for nonprofits, churches)
- Forms & lead capture
- Email marketing integration
- Membership areas

**Phase 4: Professional Tools** (Agency Growth)

- Multi-language support
- Advanced SEO tools
- A/B testing
- Analytics dashboard
- Custom domains & DNS management
- White-label client portals

### Feature Flags System

**Every feature can be:**

- Enabled/disabled per tenant
- Controlled by tier (Content Editor vs Builder)
- Monetized independently

```typescript
interface TenantFeatures {
  // Core (included in all tiers)
  pages: boolean;
  media: boolean;

  // Builder tier only
  builder: boolean; // Can add/remove/rearrange blocks

  // Optional features (unlocked per tenant)
  blog: boolean;
  shop: boolean;
  bookings: boolean;
  events: boolean;
  donations: boolean;
  forms: boolean;
  membership: boolean;
}
```

---

## Frontend Architecture

### Professional Frontend Output

**Non-Negotiable Requirements:**

1. Clean, semantic HTML
2. Minimal CSS (no inline styles)
3. Optimal performance (90+ Lighthouse scores)
4. Accessibility compliant (WCAG 2.1 AA)
5. SEO optimized
6. Mobile-first responsive

### Frontend Flexibility

**Headers Example:**
Clients can choose from professional header options, all token-controlled:

- **Relative Header**: Scrolls with page, traditional
- **Sticky Header**: Sticks to top on scroll, modern
- **Fixed Header**: Always visible at top, app-like

All controlled via page settings (not code), all using design tokens for styling.

### Component System

**Every frontend component:**

- Uses data-slot attributes for styling
- Styled via CSS with token references
- Responsive by default
- Accessible by default
- Theme-aware

```typescript
// Component receives data, not styles
<Button
  variant="primary"
  size="lg"
  href="/contact"
>
  Get Started
</Button>

// CSS applies tokens
[data-slot="button"][data-variant="primary"] {
  background: var(--color-primary-500);
  color: var(--color-primary-foreground);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-md);
}
```

---

## Competitive Positioning

### We Are NOT:

- ❌ Webflow (public builder for everyone)
- ❌ Builder.io (developer tool for React)
- ❌ WordPress (open source, plugin chaos)
- ❌ Squarespace (templates for DIY users)

### We ARE:

- ✅ **Professional web agency platform**
- ✅ **Internal tool for our clients**
- ✅ **Token-based for consistency & quality**
- ✅ **Progressive features as needed**
- ✅ **Two-tier pricing model**

### Our Unique Advantages

**vs Webflow:**

- Better performance (no inline CSS bloat)
- More consistent designs (token constraints)
- Multi-tenant from the ground up
- Feature gating & monetization built-in

**vs WordPress:**

- No plugin chaos
- Professional, not DIY
- Modern tech stack
- Better security (we control everything)
- No client-breaking updates

**vs Custom Code for Every Client:**

- Faster delivery (reuse blocks)
- Lower costs (shared platform)
- Easier maintenance (one codebase)
- Still 100% custom frontends (via tokens)

---

## Success Metrics

### Technical Metrics

- Frontend Lighthouse score: 90+ (all categories)
- Time to first byte: <200ms
- Total page size: <500KB
- Accessibility score: 100 (WCAG AA)

### Business Metrics

- Client delivery time: <2 weeks (vs 6-8 weeks custom)
- Client onboarding: <1 day
- Feature development: Progressive (build when needed)
- Revenue per client: Tier-based pricing

### Agency Growth Metrics

- Number of clients on platform
- Features built and unlocked
- Revenue from feature upgrades
- Time saved vs custom development

---

## Implementation Phases

### Phase 1: Foundation (Months 1-3)

- ✅ Multi-tenant API
- ✅ Block system (23 blocks)
- ✅ Builder UI foundation
- ⏳ Token system implementation
- ⏳ Two-tier permission system
- ⏳ First 3 clients migrated

### Phase 2: Content Features (Months 4-6)

- Blog system
- Media library enhancements
- SEO tools
- Theme manager (token editor)
- Content Editor tier fully functional

### Phase 3: Builder Features (Months 7-9)

- Drag-and-drop block editing
- Visual layout controls
- Responsive breakpoint editor
- Builder tier fully functional

### Phase 4: First Advanced Feature (Month 10-12)

- E-commerce (shop) for print client
- Product catalog
- Checkout integration
- Order management

### Phase 5: Scale (Months 13+)

- Additional features as needed
- White-label client portals
- Agency team expansion features
- Advanced monetization features

---

## Why This Will Work

1. **We're Not Competing** - We're building for our agency, not the public
2. **Progressive Development** - Build features when clients need them
3. **Token System** - Ensures quality while enabling uniqueness
4. **Two-Tier Model** - Monetization from day one
5. **Modern Stack** - Built on cutting-edge tech
6. **Agency Control** - We own everything: code, data, security
7. **Client Success** - They get professional sites faster and cheaper than custom

**This is the right architecture for an agency platform.**

---

## Next Steps

1. Complete token system design → docs/builder/token-system.md
2. Implement two-tier permissions → docs/builder/two-tier-system.md
3. Build theme manager UI
4. Create feature flags system → docs/FEATURE-FLAGS.md
5. Develop first 10 block editors
6. Launch with first client

---

**Last Updated:** 2025-01-22
**Version:** 1.0
**Status:** Active Development
