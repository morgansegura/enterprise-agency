# Composable Block System

A type-safe, composable block architecture for building rich web and mobile applications. Built on Next.js with React and designed for platform sharing with React Native.

## Architecture Overview

This platform uses a **data-driven block system** where:

- **Rich data structures** drive presentation (not component multiplication)
- **Blocks compose** with type-safe nesting (max 4 levels)
- **One codebase** powers both web and mobile
- **Theme system** enables multi-tenant customization

```
Page/Screen
└── Sections (layout: background, spacing, width)
    └── Blocks (content or containers)
        └── Blocks (nested up to 4 levels)
```

## Core Concepts

### Sections

Handle all layout concerns - background, spacing, width, alignment. Think of sections as the "personality layer" that wraps blocks.

### Blocks

**Content Blocks** (leaf nodes):

- `heading-block` - Headings (h1-h6)
- `text-block` - Paragraph text
- `image-block` - Images with captions
- `button-block` - Call-to-action buttons
- `card-block` - Feature cards

**Container Blocks** (hold children):

- `grid-block` - Responsive CSS Grid
- `flex-block` - Flexbox layout
- `stack-block` - Vertical stacking

### Theme System

Lightweight, Tailwind-first theming:

- Font preferences per client
- Design preferences (radius, shadow, header style)
- Semantic spacing tokens
- All in `lib/site-config.ts`

### Token System

Complete token-based styling for layout components with zero hardcoded values:

**Header Tokens** (~150 properties):

- Layout & structure (height, padding, positioning)
- Behavior & animation (scroll effects, transitions)
- Visual styling (backgrounds, borders, shadows)
- All customizable per-tenant

**Menu Tokens** (~130 properties):

- Reusable across header, footer, sidebar, tabs
- Multiple variants (pills, underline, bordered, minimal)
- Dropdown & mega menu support
- Context-aware styling (header/footer/sidebar)

**Footer Tokens** (~80 properties):

- Layout & sections
- Column configurations
- Social links, bottom bar, CTA sections
- Multiple templates (centered, stacked, minimal)

**Section Tokens** (~200+ properties):

- Vertical spacing scale (8 levels) with responsive overrides
- Container widths (narrow, container, wide, full, prose)
- Backgrounds (solid colors, gradients, images, overlays)
- Borders, dividers, shadows, and border radius
- Pattern overlays (dots, grid, diagonal lines)
- Content and text alignment
- Animations, transitions, and z-index layers
- Complete responsive breakpoint controls

All tokens generate CSS custom properties for complete tenant customization.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Run all checks (format, lint, typecheck, test)
pnpm verify
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Documentation

- **[Architecture Guide](../docs/client/architecture.md)** - System design and principles
- **[Block Reference](../docs/client/blocks.md)** - Complete block documentation
- **[Theme Guide](../docs/client/theme.md)** - Theming and customization _(coming soon)_

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── globals.css          # Global styles + Tailwind config
│   ├── layout.tsx           # Root layout with theme injection
│   └── test/                # Visual testing pages
│       └── headers/         # Header variations test page
├── components/
│   ├── block/               # Content block components
│   ├── block-renderer/      # Block rendering engine
│   ├── header-renderer/     # Header rendering with token support
│   ├── footer-renderer/     # Footer rendering with token support
│   ├── menu-renderer/       # Reusable menu component
│   ├── layout/              # Layout components (Section, Container)
│   ├── section-renderer/    # Section rendering engine
│   └── ui/                  # UI primitives (shadcn-based)
├── lib/
│   ├── blocks/              # Block type definitions
│   ├── tokens/              # Token system (headers, menus, footers, sections)
│   │   ├── header-tokens.ts       # Header token schema
│   │   ├── header-defaults.ts     # Platform header defaults
│   │   ├── menu-tokens.ts         # Menu token schema
│   │   ├── menu-defaults.ts       # Platform menu defaults
│   │   ├── footer-tokens.ts       # Footer token schema
│   │   ├── footer-defaults.ts     # Platform footer defaults
│   │   ├── section-tokens.ts      # Section token schema
│   │   ├── section-defaults.ts    # Platform section defaults
│   │   └── generate-*-css.ts      # CSS generation functions
│   ├── site-config.ts       # Site metadata + theme config
│   ├── theme.ts             # Theme utilities
│   └── types.ts             # Global type definitions
├── styles/
│   └── tokens/              # Token-based CSS (zero hardcoded values)
│       ├── header.css       # Header token styles
│       ├── menu.css         # Menu token styles
│       ├── footer.css       # Footer token styles
│       └── section.css      # Section token styles
├── data/mocks/              # Mock page data for development
└── docs/                    # Architecture documentation
```

## Using the Token System

### Generating Custom Token CSS

```typescript
import {
  headerDefaults,
  menuDefaults,
  footerDefaults,
  sectionDefaults,
  generateHeaderCSS,
  generateMenuCSS,
  generateFooterCSS,
  generateSectionCSS,
} from "@/lib/tokens";

// Use platform defaults
const headerCSS = generateHeaderCSS(headerDefaults);
const menuCSS = generateMenuCSS(menuDefaults);
const footerCSS = generateFooterCSS(footerDefaults);
const sectionCSS = generateSectionCSS(sectionDefaults);

// Or customize for a tenant
const customTokens = {
  ...headerDefaults,
  height: {
    default: "100px", // Taller header
    shrunk: "80px",
    mobile: "72px",
  },
};

const tenantCSS = generateHeaderCSS(customTokens);
```

### Token-Based Components

All layout components use token-based CSS with clean classnames:

```tsx
// Headers use .header-* classes
<header className="header-renderer" data-position="sticky">
  <div className="header-container">...</div>
</header>

// Menus use .menu-* classes (reusable everywhere)
<MenuRenderer
  menu={menu}
  context="header"  // or "footer", "sidebar"
  variant="pills"   // or "underline", "bordered", "minimal"
/>

// Footers use .footer-* classes
<footer className="footer-renderer" data-template="centered">
  <div className="footer-container">...</div>
</footer>

// Sections use .section classes
<section
  className="section"
  data-spacing="lg"
  data-width="container"
  data-background="primary"
  data-pattern="dots"
>
  <div>...</div>
</section>
```

No hardcoded styles - everything driven by CSS custom properties from tokens.

## Type Safety

The system uses TypeScript discriminated unions to ensure correctness:

```typescript
// ✅ Type-safe - compiler knows this is valid
const block: TypedBlock = {
  _type: "heading-block",
  _key: "h1",
  data: {
    text: "Hello",
    level: "h1",
  },
};

// ❌ Type error - wrong data for block type
const block: TypedBlock = {
  _type: "heading-block",
  _key: "h1",
  data: {
    content: "Wrong!", // ❌ 'content' doesn't exist on HeadingBlockData
  },
};
```

Nesting limits are enforced at compile time - you cannot create invalid structures.

## Example: Building a Page

```typescript
import { TypedSection } from "@/components/section-renderer";

const pageData: { sections: TypedSection[] } = {
  sections: [
    {
      _type: "section",
      _key: "hero",
      background: "gray",
      spacing: "xl",
      width: "wide",
      blocks: [
        {
          _type: "grid-block",
          _key: "hero-grid",
          data: {
            columns: { mobile: 1, desktop: 2 },
            gap: "lg",
            align: "center",
          },
          blocks: [
            {
              _type: "stack-block",
              _key: "hero-content",
              data: { gap: "md" },
              blocks: [
                {
                  _type: "heading-block",
                  _key: "h1",
                  data: {
                    text: "Welcome",
                    level: "h1",
                    size: "4xl",
                  },
                },
                {
                  _type: "text-block",
                  _key: "p1",
                  data: {
                    content: "Build amazing things",
                    size: "lg",
                  },
                },
              ],
            },
            {
              _type: "image-block",
              _key: "hero-img",
              data: {
                url: "/hero.jpg",
                alt: "Hero image",
              },
            },
          ],
        },
      ],
    },
  ],
};
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4 + CSS Modules
- **UI Components**: Shadcn UI (refactored to CSS-first)
- **Package Manager**: pnpm
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

## Platform Sharing

The block system is designed for cross-platform use:

- **Web**: React components (current)
- **Mobile**: React Native components (planned)
- **Data**: 100% shared across platforms

Same TypeScript types, same data structures, different renderers.

## Contributing

This is an internal project. See architecture docs before making changes.

## License

Private - All Rights Reserved
