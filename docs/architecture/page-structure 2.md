# Page Structure Architecture

The page builder uses a three-tier hierarchy for semantic HTML and flexible layouts.

## Hierarchy

```
Page
└── sections: Section[]
    ├── (semantic wrapper: <section> | <article> | <aside> | <header> | <footer> | <div>)
    ├── (styling: background, paddingY, gapY, minHeight, etc.)
    └── containers: Container[]
        ├── (layout: stack | flex | grid)
        ├── (styling: maxWidth, padding, gap, background, border, shadow, etc.)
        └── blocks: Block[]
            └── (content: heading, text, button, image, etc.)
```

## Why This Structure?

### Problem: Semantic HTML vs Layout Flexibility

A semantic `<section>` element should represent ONE thematic grouping of content. But a single section often needs multiple layout regions:

```
Hero Section (ONE semantic section)
├── Top: 2-column grid (headline + image)
├── Middle: centered text message
└── Bottom: button group

Previously required:
<section>...grid...</section>
<section>...text...</section>    ← Wrong! Still part of hero
<section>...buttons...</section> ← Wrong! Still part of hero
```

### Solution: Section Contains Multiple Containers

```
<section>                         ← ONE semantic section
  <div class="container grid">    ← Container 1: grid layout
    <h1>...</h1>
    <img>...</img>
  </div>
  <div class="container stack">   ← Container 2: stack layout
    <p>...</p>
  </div>
  <div class="container flex">    ← Container 3: flex layout
    <button>...</button>
    <button>...</button>
  </div>
</section>
```

## Data Types

> **Type Definitions Location:**
>
> - **Builder:** `builder/lib/types/section.ts`
> - **Client:** `client/lib/types/section.ts`
>
> Import types: `import type { Section, Container, Block } from "@/lib/types/section"`

### Section

The semantic wrapper. Always renders as a landmark element.

```typescript
interface Section {
  _type: "section";
  _key: string;

  // Semantic HTML element
  as?: "section" | "div" | "article" | "aside" | "header" | "footer";

  // Background (color, gradient, or image)
  background?: SectionBackground;

  // Spacing
  paddingY?: ExtendedSpacing; // "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl"
  paddingTop?: ExtendedSpacing;
  paddingBottom?: ExtendedSpacing;
  marginTop?: Spacing | "none";
  marginBottom?: Spacing | "none";
  gapY?: Spacing | "none"; // gap between containers

  // Size
  width?: "narrow" | "container" | "wide" | "full";
  minHeight?: "none" | "sm" | "md" | "lg" | "xl" | "screen";

  // Content alignment (for hero sections with minHeight)
  align?: "left" | "center" | "right";
  verticalAlign?: "top" | "center" | "bottom";

  // Border (all 4 sides)
  borderTop?: "none" | "thin" | "medium" | "thick";
  borderBottom?: "none" | "thin" | "medium" | "thick";
  borderLeft?: "none" | "thin" | "medium" | "thick";
  borderRight?: "none" | "thin" | "medium" | "thick";
  borderColor?: string;
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

  // Shadow
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "inner";

  // Advanced
  anchorId?: string; // for #anchor linking
  overflowX?: "visible" | "hidden" | "scroll" | "auto";
  overflowY?: "visible" | "hidden" | "scroll" | "auto";
  hideOn?: {
    desktop?: boolean;
    tablet?: boolean;
    mobile?: boolean;
  };
  customClasses?: string;

  // Responsive overrides
  _responsive?: {
    tablet?: Partial<SectionSettings>;
    mobile?: Partial<SectionSettings>;
  };

  // Content
  containers: Container[];
}
```

### Container

The layout wrapper inside a section. Controls how blocks are arranged.

```typescript
interface Container {
  _type: "container";
  _key: string;

  // Layout mode
  layout: {
    type: "stack" | "flex" | "grid";

    // Stack/Flex options
    direction?: "row" | "column";
    wrap?: boolean;
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
    align?: "start" | "center" | "end" | "stretch" | "baseline";

    // Grid options
    columns?: number | "auto-fit";
    rows?: number;

    // Shared
    gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  };

  // Size
  maxWidth?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "full";
  minHeight?: "none" | "sm" | "md" | "lg" | "xl";

  // Background
  background?: SectionBackground;

  // Padding
  paddingX?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  paddingY?: "none" | "xs" | "sm" | "md" | "lg" | "xl";

  // Border
  border?: "none" | "thin" | "medium" | "thick";
  borderTop?: "none" | "thin" | "medium" | "thick";
  borderBottom?: "none" | "thin" | "medium" | "thick";
  borderLeft?: "none" | "thin" | "medium" | "thick";
  borderRight?: "none" | "thin" | "medium" | "thick";
  borderColor?: string;
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "full";

  // Shadow
  shadow?: "none" | "sm" | "md" | "lg" | "xl";

  // Content alignment (for positioning content within container)
  align?: "left" | "center" | "right";
  verticalAlign?: "top" | "center" | "bottom";

  // Advanced
  overflow?: "visible" | "hidden" | "scroll" | "auto";
  hideOn?: {
    desktop?: boolean;
    tablet?: boolean;
    mobile?: boolean;
  };
  customClasses?: string;

  // Responsive overrides
  _responsive?: {
    tablet?: Partial<ContainerSettings>;
    mobile?: Partial<ContainerSettings>;
  };

  // Content
  blocks: Block[];
}
```

### Background

Shared background type for sections and containers.

```typescript
// Background variants for preset colors
type BackgroundVariant =
  | "none"
  | "white"
  | "gray"
  | "dark"
  | "primary"
  | "secondary"
  | "muted"
  | "accent";

interface SectionBackground {
  type: "none" | "color" | "gradient" | "image";
  color?: string; // when type is "color"
  gradient?: GradientConfig; // when type is "gradient"
  image?: ImageBackgroundConfig; // when type is "image"
}

interface GradientConfig {
  type: "linear" | "radial";
  angle?: number;
  stops: Array<{ color: string; position: number }>;
}

interface ImageBackgroundConfig {
  src: string;
  alt?: string;
  position?: string; // e.g., "center center"
  size?: "cover" | "contain" | "auto";
  repeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  overlay?: string; // overlay color with opacity
}

// Usage: background can be a preset string or full config
// background?: BackgroundVariant | string | SectionBackground
```

### Block

Content blocks are leaf nodes. They render actual content and cannot have children.

```typescript
interface Block {
  _type: string; // "heading-block", "text-block", etc.
  _key: string;
  data: Record<string, unknown>;
}
```

## Content Blocks

All blocks that render content (not layout):

| Block Type        | Description                          |
| ----------------- | ------------------------------------ |
| `heading-block`   | Semantic headings (h1-h6)            |
| `text-block`      | Rich text with TipTap                |
| `button-block`    | CTA buttons with variants            |
| `image-block`     | Images with captions                 |
| `video-block`     | YouTube, Vimeo, or direct video      |
| `audio-block`     | Audio player                         |
| `card-block`      | Cards with image, title, description |
| `quote-block`     | Blockquotes with attribution         |
| `list-block`      | Ordered/unordered lists              |
| `icon-block`      | Icons with optional labels           |
| `stats-block`     | Statistics display                   |
| `accordion-block` | Collapsible content                  |
| `tabs-block`      | Tabbed content                       |
| `divider-block`   | Horizontal dividers                  |
| `spacer-block`    | Vertical spacing                     |
| `embed-block`     | External embeds (iframe)             |
| `logo-block`      | Logo display                         |
| `map-block`       | Google Maps embed                    |

## Deprecated Patterns

The following block types are **deprecated** in favor of Container layout modes:

| Old Block         | New Approach                          |
| ----------------- | ------------------------------------- |
| `grid-block`      | Container with `layout.type: "grid"`  |
| `flex-block`      | Container with `layout.type: "flex"`  |
| `stack-block`     | Container with `layout.type: "stack"` |
| `container-block` | Use Container directly                |
| `columns-block`   | Container with `layout.type: "grid"`  |

## Example: Hero Section

```json
{
  "_type": "section",
  "_key": "hero",
  "as": "section",
  "background": {
    "type": "gradient",
    "gradient": {
      "type": "linear",
      "angle": 180,
      "stops": [
        { "color": "#1e40af", "position": 0 },
        { "color": "#3b82f6", "position": 100 }
      ]
    }
  },
  "paddingY": "2xl",
  "minHeight": "lg",
  "gapY": "lg",
  "containers": [
    {
      "_type": "container",
      "_key": "hero-grid",
      "layout": {
        "type": "grid",
        "columns": 2,
        "gap": "xl"
      },
      "maxWidth": "xl",
      "align": "center",
      "blocks": [
        {
          "_type": "heading-block",
          "_key": "h1",
          "data": {
            "text": "Welcome to Our Platform",
            "level": "h1",
            "size": "5xl"
          }
        },
        {
          "_type": "image-block",
          "_key": "hero-img",
          "data": {
            "src": "/hero.jpg",
            "alt": "Platform illustration"
          }
        }
      ]
    },
    {
      "_type": "container",
      "_key": "hero-cta",
      "layout": {
        "type": "flex",
        "direction": "row",
        "justify": "center",
        "gap": "md"
      },
      "maxWidth": "md",
      "blocks": [
        {
          "_type": "button-block",
          "_key": "cta-1",
          "data": {
            "text": "Get Started",
            "href": "/signup",
            "variant": "primary",
            "size": "lg"
          }
        },
        {
          "_type": "button-block",
          "_key": "cta-2",
          "data": {
            "text": "Learn More",
            "href": "/features",
            "variant": "outline",
            "size": "lg"
          }
        }
      ]
    }
  ]
}
```

## Rendering

### Section Renderer

```tsx
function SectionRenderer({ section }: { section: Section }) {
  const Tag = section.as || "section";

  return (
    <Tag
      id={section.anchorId}
      className={cn(getSectionStyles(section), section.customClasses)}
      style={getSectionBackground(section.background)}
    >
      {section.containers.map((container) => (
        <ContainerRenderer key={container._key} container={container} />
      ))}
    </Tag>
  );
}
```

### Container Renderer

```tsx
function ContainerRenderer({ container }: { container: Container }) {
  return (
    <div
      className={cn(
        getContainerStyles(container),
        getLayoutStyles(container.layout),
        container.customClasses,
      )}
      style={getContainerBackground(container.background)}
    >
      {container.blocks.map((block) => (
        <BlockRenderer key={block._key} block={block} />
      ))}
    </div>
  );
}
```

## Migration Guide

### From Old Structure

```json
// OLD: Section with blocks directly
{
  "_type": "section",
  "_key": "hero",
  "blocks": [
    { "_type": "heading-block", ... },
    { "_type": "grid-block", "blocks": [...] }
  ]
}
```

### To New Structure

```json
// NEW: Section with containers
{
  "_type": "section",
  "_key": "hero",
  "containers": [
    {
      "_type": "container",
      "_key": "hero-c1",
      "layout": { "type": "stack" },
      "blocks": [
        { "_type": "heading-block", ... }
      ]
    },
    {
      "_type": "container",
      "_key": "hero-c2",
      "layout": { "type": "grid", "columns": 2 },
      "blocks": [...]
    }
  ]
}
```

---

**Last Updated:** 2025-12-27
**Status:** Active
