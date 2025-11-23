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
      │    Sections     │ ◄── Background, Spacing, Width
      │ (Layout Layer)  │
      └────────┬────────┘
               │
      ┌────────▼────────┐
      │     Blocks      │ ◄── Content OR Layout
      │  (Level 1-4)    │
      └─────────────────┘
```

### 1. Sections

**Purpose**: Handle all layout concerns - background, spacing, width, alignment.

**Responsibilities**:

- Background colors/patterns
- Vertical spacing (padding)
- Content width constraints
- Horizontal alignment

**Does NOT**:

- Render content directly
- Handle internal layout of blocks

**Example**:

```typescript
{
  _type: "section",
  _key: "hero",
  background: "gray",
  spacing: "xl",
  width: "wide",
  blocks: [...]  // Can contain any RootBlock
}
```

### 2. Blocks

Blocks are the core content/layout primitives. There are two categories:

#### Content Blocks (Leaf Nodes)

These blocks **cannot have children**. They render actual content.

- `heading-block` - Text headings (h1-h6)
- `text-block` - Paragraph text with formatting
- `image-block` - Images with captions
- `button-block` - Call-to-action buttons
- `card-block` - Cards with title/description/image/actions

#### Container Blocks

These blocks **contain other blocks** and handle layout arrangement.

- `grid-block` - CSS Grid layout with responsive columns
- `flex-block` - Flexbox layout with direction control
- `stack-block` - Vertical stacking (simplified flex column)

## Nesting Strategy

**Maximum Depth: 4 Levels**

```
Level 1: Section
├─ Level 2: Container Block (grid/flex/stack)
   ├─ Level 3: Container Block OR Content Block
      ├─ Level 4: Content Block ONLY
```

### Nesting Rules

1. **Sections** contain `RootBlock[]` (any block type)
2. **DeepContainerBlock** (Level 2) can contain `ContentBlock | ShallowContainerBlock`
3. **ShallowContainerBlock** (Level 3) can contain `ContentBlock` only
4. **ContentBlock** (Level 4) cannot have children

### Type Enforcement

TypeScript enforces these rules at compile time:

```typescript
// ✅ Valid - 3 levels
{
  _type: "section",
  blocks: [
    {
      _type: "grid-block",  // Level 2
      blocks: [
        {
          _type: "stack-block",  // Level 3
          blocks: [
            { _type: "heading-block" },  // Level 4
            { _type: "text-block" }
          ]
        }
      ]
    }
  ]
}

// ❌ Invalid - Would be 5 levels (TypeScript error)
{
  _type: "section",
  blocks: [
    {
      _type: "grid-block",
      blocks: [
        {
          _type: "flex-block",
          blocks: [
            {
              _type: "stack-block",  // ❌ Can't nest container here
              blocks: [...]
            }
          ]
        }
      ]
    }
  ]
}
```

## Data Structure Examples

### Simple: Heading + Text

```typescript
{
  _type: "section",
  background: "white",
  spacing: "lg",
  blocks: [
    {
      _type: "heading-block",
      _key: "h1",
      data: {
        text: "Welcome",
        level: "h1",
        align: "center"
      }
    },
    {
      _type: "text-block",
      _key: "p1",
      data: {
        content: "This is some text",
        align: "center"
      }
    }
  ]
}
```

### Medium: 3-Column Feature Grid

```typescript
{
  _type: "section",
  background: "gray",
  spacing: "xl",
  blocks: [
    {
      _type: "grid-block",
      _key: "features",
      data: {
        columns: { mobile: 1, tablet: 2, desktop: 3 },
        gap: "lg"
      },
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
        // ... more cards
      ]
    }
  ]
}
```

### Complex: Nested Layout

```typescript
{
  _type: "section",
  background: "white",
  spacing: "2xl",
  blocks: [
    {
      _type: "grid-block",  // Level 2
      _key: "main-grid",
      data: {
        columns: { mobile: 1, desktop: 3 },
        gap: "md"
      },
      blocks: [
        // Each grid item contains its own layout
        {
          _type: "stack-block",  // Level 3
          _key: "item-1",
          data: { gap: "sm" },
          blocks: [
            {
              _type: "heading-block",  // Level 4
              _key: "h1",
              data: { text: "Item 1" }
            },
            {
              _type: "text-block",  // Level 4
              _key: "p1",
              data: { content: "Details" }
            }
          ]
        },
        // Repeat for items 2 and 3...
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

## Migration Path

Current state → Target state:

1. ✅ Basic content blocks (heading, text)
2. ✅ Section-based layout
3. 🔄 Container blocks (grid, flex, stack)
4. ⏳ Rich content blocks (card, button, image)
5. ⏳ Platform parity (React Native)
6. ⏳ CMS integration

---

**Next**: See `blocks.md` for detailed block documentation.
