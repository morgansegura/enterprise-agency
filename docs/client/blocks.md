# Block Reference

Complete reference for all available blocks in the system.

## Content Blocks

Content blocks are leaf nodes - they render actual content and cannot have children.

### heading-block

Renders text headings with semantic HTML levels.

**Data Type**: `HeadingBlockData`

```typescript
{
  _type: "heading-block",
  _key: "unique-id",
  data: {
    text: string;                    // The heading text
    level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";  // Default: "h2"
    size?: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
    align?: "left" | "center" | "right";  // Default: "left"
    weight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
  }
}
```

**Example**:

```typescript
{
  _type: "heading-block",
  _key: "hero-heading",
  data: {
    text: "Welcome to Our Platform",
    level: "h1",
    size: "4xl",
    align: "center",
    weight: "bold"
  }
}
```

---

### text-block

Renders paragraph text with formatting options.

**Data Type**: `TextBlockData`

```typescript
{
  _type: "text-block",
  _key: "unique-id",
  data: {
    content: string;                 // The text content (supports rich text/markdown)
    size?: "sm" | "base" | "lg";    // Default: "base"
    align?: "left" | "center" | "right" | "justify";  // Default: "left"
    variant?: "default" | "muted" | "lead" | "subtle";  // Default: "default"
  }
}
```

**Variants**:

- `default` - Normal text color
- `muted` - Lighter, secondary text
- `lead` - Larger, lead paragraph style
- `subtle` - Very light, tertiary text

**Example**:

```typescript
{
  _type: "text-block",
  _key: "intro",
  data: {
    content: "This is the introduction paragraph with **bold** and *italic* text.",
    size: "lg",
    align: "center",
    variant: "lead"
  }
}
```

---

### image-block

Renders images with optional captions.

**Data Type**: `ImageBlockData`

```typescript
{
  _type: "image-block",
  _key: "unique-id",
  data: {
    url: string;                     // Image URL
    alt?: string;                    // Alt text for accessibility
    caption?: string;                // Optional caption below image
    width?: number;                  // Optional width constraint
    height?: number;                 // Optional height constraint
    objectFit?: "contain" | "cover" | "fill" | "none";  // Default: "cover"
  }
}
```

**Example**:

```typescript
{
  _type: "image-block",
  _key: "hero-image",
  data: {
    url: "/images/hero.jpg",
    alt: "Platform hero image",
    caption: "Our beautiful platform",
    objectFit: "cover"
  }
}
```

---

### button-block

Renders call-to-action buttons.

**Data Type**: `ButtonBlockData`

```typescript
{
  _type: "button-block",
  _key: "unique-id",
  data: {
    text: string;                    // Button text
    href?: string;                   // Link URL
    onClick?: string;                // Action identifier for programmatic handling
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
  }
}
```

**Variants**:

- `default` - Filled primary button
- `destructive` - Danger/delete action
- `outline` - Outlined button
- `secondary` - Secondary filled button
- `ghost` - Transparent with hover
- `link` - Styled as link

**Example**:

```typescript
{
  _type: "button-block",
  _key: "cta",
  data: {
    text: "Get Started",
    href: "/signup",
    variant: "default",
    size: "lg"
  }
}
```

---

### card-block

Renders feature cards with title, description, image, and actions.

**Data Type**: `CardBlockData`

```typescript
{
  _type: "card-block",
  _key: "unique-id",
  data: {
    title?: string;                  // Card title
    description?: string;            // Card description
    image?: ImageBlockData;          // Optional image
    imagePosition?: "top" | "left" | "background";  // Default: "top"
    actions?: ButtonBlockData[];     // Optional action buttons
    variant?: "default" | "elevated" | "outlined";  // Default: "default"
  }
}
```

**Variants**:

- `default` - Standard card
- `elevated` - Card with shadow
- `outlined` - Card with border

**Image Positions**:

- `top` - Image above content
- `left` - Image on left, content on right
- `background` - Image as background with overlay

**Example**:

```typescript
{
  _type: "card-block",
  _key: "feature-1",
  data: {
    title: "Fast Performance",
    description: "Our platform is optimized for speed and efficiency.",
    image: {
      url: "/images/fast.svg",
      alt: "Speed icon"
    },
    imagePosition: "top",
    variant: "elevated",
    actions: [
      {
        text: "Learn More",
        href: "/features",
        variant: "outline"
      }
    ]
  }
}
```

---

## Container Blocks

Container blocks hold other blocks and control layout arrangement.

### grid-block

Arranges child blocks in a responsive CSS grid.

**Data Type**: `GridLayoutData`

```typescript
{
  _type: "grid-block",
  _key: "unique-id",
  data: {
    columns: ResponsiveColumns | number;  // Column configuration
    gap?: Spacing;                        // Gap between items (default: "md")
    align?: "start" | "center" | "end" | "stretch";  // align-items
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";  // justify-content
  },
  blocks: ContentBlock[] | (ContentBlock | ShallowContainerBlock)[]
}
```

**Responsive Columns**:

```typescript
{
  mobile?: 1 | 2;
  tablet?: 1 | 2 | 3 | 4;
  desktop?: 1 | 2 | 3 | 4 | 5 | 6;
}
```

**Example - 3 Column Feature Grid**:

```typescript
{
  _type: "grid-block",
  _key: "features",
  data: {
    columns: { mobile: 1, tablet: 2, desktop: 3 },
    gap: "lg",
    align: "start"
  },
  blocks: [
    { _type: "card-block", ... },
    { _type: "card-block", ... },
    { _type: "card-block", ... }
  ]
}
```

**Example - Nested Grid**:

```typescript
{
  _type: "grid-block",
  _key: "main",
  data: {
    columns: 2,
    gap: "xl"
  },
  blocks: [
    {
      _type: "stack-block",
      _key: "left",
      data: { gap: "md" },
      blocks: [
        { _type: "heading-block", ... },
        { _type: "text-block", ... }
      ]
    },
    {
      _type: "image-block",
      _key: "right",
      data: { url: "/image.jpg" }
    }
  ]
}
```

---

### flex-block

Arranges child blocks using flexbox.

**Data Type**: `FlexLayoutData`

```typescript
{
  _type: "flex-block",
  _key: "unique-id",
  data: {
    direction?: "row" | "col";       // flex-direction (default: "row")
    wrap?: boolean;                   // flex-wrap (default: false)
    gap?: Spacing;                    // gap (default: "md")
    align?: AlignItems;               // align-items
    justify?: JustifyContent;         // justify-content
  },
  blocks: ContentBlock[] | (ContentBlock | ShallowContainerBlock)[]
}
```

**Example - Horizontal Button Group**:

```typescript
{
  _type: "flex-block",
  _key: "actions",
  data: {
    direction: "row",
    gap: "sm",
    justify: "center"
  },
  blocks: [
    { _type: "button-block", data: { text: "Primary" } },
    { _type: "button-block", data: { text: "Secondary", variant: "outline" } }
  ]
}
```

---

### stack-block

Simplified vertical stacking (flex column).

**Data Type**: `StackLayoutData`

```typescript
{
  _type: "stack-block",
  _key: "unique-id",
  data: {
    gap?: Spacing;                    // gap (default: "md")
    align?: AlignItems;               // align-items (default: "stretch")
  },
  blocks: ContentBlock[] | (ContentBlock | ShallowContainerBlock)[]
}
```

**Example - Vertical Content Stack**:

```typescript
{
  _type: "stack-block",
  _key: "content",
  data: {
    gap: "lg",
    align: "start"
  },
  blocks: [
    { _type: "heading-block", data: { text: "Title" } },
    { _type: "text-block", data: { content: "Description" } },
    { _type: "button-block", data: { text: "CTA" } }
  ]
}
```

---

## Nesting Examples

### 2 Levels: Section → Content

```typescript
{
  _type: "section",
  background: "white",
  spacing: "lg",
  blocks: [
    { _type: "heading-block", ... },
    { _type: "text-block", ... }
  ]
}
```

### 3 Levels: Section → Container → Content

```typescript
{
  _type: "section",
  background: "gray",
  spacing: "xl",
  blocks: [
    {
      _type: "grid-block",
      data: { columns: 3 },
      blocks: [
        { _type: "card-block", ... },
        { _type: "card-block", ... },
        { _type: "card-block", ... }
      ]
    }
  ]
}
```

### 4 Levels: Section → Container → Container → Content

```typescript
{
  _type: "section",
  background: "white",
  spacing: "2xl",
  blocks: [
    {
      _type: "grid-block",
      data: { columns: { mobile: 1, desktop: 2 } },
      blocks: [
        {
          _type: "stack-block",
          data: { gap: "md" },
          blocks: [
            { _type: "heading-block", ... },
            { _type: "text-block", ... },
            { _type: "button-block", ... }
          ]
        },
        {
          _type: "image-block",
          data: { url: "/image.jpg" }
        }
      ]
    }
  ]
}
```

---

## Type Guards

Use these helpers to determine block types:

```typescript
import { isContainerBlock, isContentBlock } from "@/lib/blocks";

if (isContainerBlock(block)) {
  // block has .blocks property
  block.blocks.forEach(...)
}

if (isContentBlock(block)) {
  // block is a leaf node
  renderContent(block)
}
```

---

## Best Practices

1. **Start Simple**: Use content blocks directly in sections when possible
2. **Add Containers When Needed**: Only use container blocks for multi-column layouts
3. **Respect Nesting Limits**: Don't exceed 4 levels
4. **Use Semantic Blocks**: Choose the right block type for the content
5. **Leverage Variants**: Use data variants instead of creating new block types
6. **Keep Data Rich**: Put configuration in data, not in multiple components

---

**Next**: See `theme.md` for theming documentation.
