# System Architecture

## Overview

This platform is built on a **composable block system** designed for maximum flexibility while maintaining type safety and preventing over-complexity. The architecture supports both web (React) and mobile (React Native) applications using shared data structures.

## Core Principles

1. **Data-Driven**: Rich data structures drive presentation, not component multiplication
2. **Composable**: Blocks can contain other blocks (with limits)
3. **Type-Safe**: TypeScript ensures correctness at every level
4. **Platform-Agnostic**: Same data works for web and mobile
5. **DRY**: One powerful component > many simple variations

## Architecture Layers

```
┌─────────────────────────────────────────┐
│              Page/Screen                │
│  (Container for sections)               │
└──────────────┬──────────────────────────┘
               │
      ┌────────▼────────┐
      │    Sections     │ ◄── Semantic wrapper, background, paddingY
      │ (Layout Layer)  │
      └────────┬────────┘
               │
      ┌────────▼────────┐
      │   Containers    │ ◄── Layout (stack/flex/grid), maxWidth, padding
      │ (Layout Layer)  │
      └────────┬────────┘
               │
      ┌────────▼────────┐
      │     Blocks      │ ◄── Content only (leaf nodes)
      │  (Content)      │
      └─────────────────┘
```

### 1. Sections

**Purpose**: Semantic HTML wrapper with section-level styling.

**Responsibilities**:

- Semantic element (`<section>`, `<article>`, `<aside>`, etc.)
- Background (color, gradient, image)
- Vertical padding (`paddingY`)
- Gap between containers (`gapY`)
- Border and shadow
- Anchor IDs for navigation

**Example**:

```typescript
{
  _type: "section",
  _key: "hero",
  as: "section",
  background: { type: "gradient", ... },
  paddingY: "2xl",
  gapY: "lg",
  containers: [...]  // Array of containers
}
```

### 2. Containers

**Purpose**: Layout wrapper inside sections. Controls how blocks are arranged.

**Responsibilities**:

- Layout mode (stack, flex, grid)
- Max width constraints
- Internal padding
- Gap between blocks
- Border, shadow, background

**Example**:

```typescript
{
  _type: "container",
  _key: "hero-grid",
  layout: { type: "grid", columns: 2, gap: "lg" },
  maxWidth: "xl",
  blocks: [...]  // Array of content blocks
}
```

### 3. Blocks

Blocks are **content-only leaf nodes**. They render actual content and cannot have children.

- `heading-block` - Text headings (h1-h6) with comprehensive typography
- `text-block` - Rich text with TipTap HTML support
- `image-block` - Images with captions
- `button-block` - Call-to-action buttons
- `card-block` - Cards with title/description/image/actions
- `video-block`, `audio-block`, `embed-block` - Media blocks
- `quote-block`, `list-block`, `icon-block`, `stats-block` - Content blocks
- `accordion-block`, `tabs-block` - Interactive blocks
- `divider-block`, `spacer-block` - Utility blocks

**Note**: Layout blocks (`grid-block`, `flex-block`, `stack-block`) are **deprecated**. Use Container layout modes instead.

## Nesting Strategy

**Fixed 3-Level Hierarchy:**

```
Level 1: Section (semantic wrapper)
└─ Level 2: Container[] (layout wrappers)
   └─ Level 3: Block[] (content only)
```

### Rules

1. **Sections** contain an array of `Container[]`
2. **Containers** contain an array of `Block[]` (content blocks only)
3. **Blocks** are leaf nodes - they cannot have children

### Example

```typescript
{
  _type: "section",
  _key: "hero",
  as: "section",
  paddingY: "2xl",
  containers: [
    {
      _type: "container",
      _key: "hero-content",
      layout: { type: "grid", columns: 2, gap: "lg" },
      maxWidth: "xl",
      blocks: [
        {
          _type: "heading-block",
          _key: "h1",
          data: { text: "Welcome", level: "h1", size: "5xl" }
        },
        {
          _type: "image-block",
          _key: "img1",
          data: { src: "/hero.jpg", alt: "Hero image" }
        }
      ]
    },
    {
      _type: "container",
      _key: "hero-cta",
      layout: { type: "flex", justify: "center", gap: "md" },
      blocks: [
        {
          _type: "button-block",
          _key: "btn1",
          data: { text: "Get Started", href: "/signup" }
        }
      ]
    }
  ]
}
```

This structure allows multiple layout regions within a single semantic section.

## Data Structure Examples

### Simple: Heading + Text

```typescript
{
  _type: "section",
  _key: "intro",
  paddingY: "lg",
  containers: [
    {
      _type: "container",
      _key: "intro-content",
      layout: { type: "stack", gap: "md" },
      maxWidth: "lg",
      blocks: [
        {
          _type: "heading-block",
          _key: "h1",
          data: {
            text: "Welcome",
            level: "h1",
            align: "center",
            size: "4xl"
          }
        },
        {
          _type: "text-block",
          _key: "p1",
          data: {
            html: "<p>This is some text content.</p>",
            align: "center"
          }
        }
      ]
    }
  ]
}
```

### Medium: 3-Column Feature Grid

```typescript
{
  _type: "section",
  _key: "features",
  paddingY: "xl",
  background: { type: "color", color: "var(--muted)" },
  containers: [
    {
      _type: "container",
      _key: "features-grid",
      layout: { type: "grid", columns: 3, gap: "lg" },
      maxWidth: "xl",
      blocks: [
        {
          _type: "card-block",
          _key: "f1",
          data: {
            title: "Feature 1",
            description: "Description here",
            variant: "elevated"
          }
        },
        {
          _type: "card-block",
          _key: "f2",
          data: {
            title: "Feature 2",
            description: "Another feature",
            variant: "elevated"
          }
        },
        {
          _type: "card-block",
          _key: "f3",
          data: {
            title: "Feature 3",
            description: "Third feature",
            variant: "elevated"
          }
        }
      ]
    }
  ]
}
```

### Complex: Multiple Containers in One Section

```typescript
{
  _type: "section",
  _key: "hero",
  as: "section",
  paddingY: "2xl",
  gapY: "xl",
  background: {
    type: "gradient",
    gradient: {
      type: "linear",
      angle: 180,
      stops: [
        { color: "#1e40af", position: 0 },
        { color: "#3b82f6", position: 100 }
      ]
    }
  },
  containers: [
    // Container 1: Two-column grid for headline + image
    {
      _type: "container",
      _key: "hero-main",
      layout: { type: "grid", columns: 2, gap: "xl", align: "center" },
      maxWidth: "xl",
      blocks: [
        {
          _type: "heading-block",
          _key: "h1",
          data: { text: "Build Amazing Websites", level: "h1", size: "5xl" }
        },
        {
          _type: "image-block",
          _key: "hero-img",
          data: { src: "/hero.jpg", alt: "Hero illustration" }
        }
      ]
    },
    // Container 2: Centered CTA buttons
    {
      _type: "container",
      _key: "hero-cta",
      layout: { type: "flex", justify: "center", gap: "md" },
      blocks: [
        {
          _type: "button-block",
          _key: "btn1",
          data: { text: "Get Started", href: "/signup", variant: "primary" }
        },
        {
          _type: "button-block",
          _key: "btn2",
          data: { text: "Learn More", href: "/features", variant: "outline" }
        }
      ]
    }
  ]
}
```

## Responsive Design

All container blocks support responsive column configuration:

```typescript
{
  _type: "grid-block",
  data: {
    columns: {
      mobile: 1,    // 1 column on mobile
      tablet: 2,    // 2 columns on tablet (md breakpoint)
      desktop: 4    // 4 columns on desktop (lg breakpoint)
    },
    gap: "md",
    align: "start",
    justify: "between"
  },
  blocks: [...]
}
```

## Theme Integration

The theme system provides:

- **Colors**: Via CSS custom properties in `globals.css`
- **Spacing**: Semantic spacing tokens (`--spacing-section-md`, `--spacing-block-lg`)
- **Typography**: Font families and preferences
- **Preferences**: Per-client defaults (radius, shadow, header style)

Blocks and sections reference theme values:

```css
[data-slot="section"][data-spacing="lg"] {
  @apply py-[var(--spacing-section-lg)];
}

[data-slot="grid-block"][data-gap="md"] {
  @apply gap-[var(--spacing-block-md)];
}
```

## Platform Sharing

The same data structure works across platforms:

### Web (React)

```tsx
import { BlockRenderer } from "@/components/block-renderer";

<BlockRenderer blocks={pageData.blocks} />;
```

### Mobile (React Native)

```tsx
import { BlockRenderer } from "@/components/block-renderer.native";

<BlockRenderer blocks={pageData.blocks} />;
```

The data is identical. Only the component implementations differ.

## Extension Points

### Adding a New Content Block

1. Define data type in `lib/blocks/types.ts`:

```typescript
export type VideoBlockData = {
  url: string;
  autoplay?: boolean;
  controls?: boolean;
};
```

2. Add to `ContentBlock` union:

```typescript
export type ContentBlock =
  | { _type: "heading-block"; ... }
  | { _type: "video-block"; _key: string; data: VideoBlockData };
```

3. Create component in `components/block/video-block/`

4. Add to BlockRenderer switch statement

### Adding a New Container Block

Follow the same pattern but ensure it fits within nesting limits.

## Best Practices

1. **Keep blocks simple**: Each block does one thing well
2. **Use containers wisely**: Don't nest for the sake of nesting
3. **Prefer Section layout**: Most layouts don't need container blocks
4. **Data over components**: Add variant options instead of new components
5. **Enforce limits**: 3-4 levels maximum, enforced by types
6. **Document variants**: Each block's data shape is its API

## Current State

1. ✅ Section → Container → Block architecture
2. ✅ Container layout modes (stack, flex, grid)
3. ✅ Heading block with comprehensive typography
4. ✅ Text block with TipTap rich text
5. ✅ Builder ↔ Frontend sync working
6. ✅ Save and publish flow

---

**Reference**: See [Page Structure](/docs/architecture/page-structure.md) for full architecture details.

**Last Updated:** 2025-12-27
