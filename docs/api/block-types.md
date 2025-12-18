# Block Types Reference

Content blocks for the page builder. All blocks are leaf nodes that render content.

## Overview

**Total Block Types:** 18 content blocks
**Layout Control:** Via Container (not blocks)
**Storage:** JSONB in `Page.content.sections[].containers[].blocks`

## Block Structure

Every block has this base structure:

```typescript
interface Block {
  _type: string;   // Block type identifier
  _key: string;    // Unique key within page
  data: {          // Block-specific data
    [key: string]: unknown;
  };
}
```

## Content Blocks

### 1. Heading Block

Semantic headings with visual customization.

```typescript
{
  _type: "heading-block",
  _key: string,
  data: {
    text: string;                    // Required
    level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
    align?: "left" | "center" | "right";
    weight?: "normal" | "medium" | "semibold" | "bold";
    color?: string;
  }
}
```

### 2. Text Block

Rich text content using TipTap editor.

```typescript
{
  _type: "text-block",
  _key: string,
  data: {
    text?: string;                   // Plain text (legacy)
    html?: string;                   // Rich text HTML
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    align?: "left" | "center" | "right" | "justify";
    variant?: "body" | "muted" | "caption";
    maxWidth?: string;
  }
}
```

### 3. Button Block

Call-to-action buttons.

```typescript
{
  _type: "button-block",
  _key: string,
  data: {
    text: string;                    // Required
    href: string;                    // Required
    variant?: "default" | "primary" | "secondary" | "outline" | "ghost" | "link" | "destructive";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    icon?: string;
    iconPosition?: "left" | "right";
    openInNewTab?: boolean;
  }
}
```

### 4. Image Block

Images with responsive handling.

```typescript
{
  _type: "image-block",
  _key: string,
  data: {
    src: string;                     // Required
    alt: string;                     // Required
    width?: number;
    height?: number;
    aspectRatio?: "16/9" | "4/3" | "1/1" | "3/2" | "auto";
    objectFit?: "cover" | "contain" | "fill" | "none";
    rounded?: boolean;
    caption?: string;
    link?: {
      href: string;
      openInNewTab?: boolean;
    };
  }
}
```

### 5. Video Block

Video embeds (YouTube, Vimeo, direct).

```typescript
{
  _type: "video-block",
  _key: string,
  data: {
    url: string;                     // Required
    provider?: "youtube" | "vimeo" | "direct";
    aspectRatio?: "16/9" | "4/3" | "1/1" | "21/9";
    autoplay?: boolean;
    muted?: boolean;
    controls?: boolean;
    loop?: boolean;
  }
}
```

### 6. Audio Block

Audio player.

```typescript
{
  _type: "audio-block",
  _key: string,
  data: {
    src: string;                     // Required
    title?: string;
    artist?: string;
    controls?: boolean;
    autoplay?: boolean;
    loop?: boolean;
  }
}
```

### 7. Card Block

Cards with image, title, description.

```typescript
{
  _type: "card-block",
  _key: string,
  data: {
    title: string;                   // Required
    description?: string;
    footer?: string;
    image?: {
      src: string;
      alt: string;
      aspectRatio?: string;
      objectFit?: "cover" | "contain" | "fill";
    };
    link?: {
      href: string;
      text?: string;
      openInNewTab?: boolean;
    };
    variant?: "default" | "bordered" | "elevated";
    padding?: "none" | "sm" | "md" | "lg";
  }
}
```

### 8. Quote Block

Blockquotes with attribution.

```typescript
{
  _type: "quote-block",
  _key: string,
  data: {
    text: string;                    // Required
    author?: string;
    title?: string;                  // Author's title/role
    size?: "sm" | "md" | "lg";
    align?: "left" | "center" | "right";
    variant?: "default" | "bordered" | "highlighted";
  }
}
```

### 9. List Block

Ordered or unordered lists.

```typescript
{
  _type: "list-block",
  _key: string,
  data: {
    items: Array<{
      text: string;
      icon?: string;
    }>;
    ordered?: boolean;
    style?: "default" | "checkmarks" | "bullets" | "numbers";
    spacing?: "compact" | "comfortable" | "relaxed";
  }
}
```

### 10. Icon Block

Icons with optional labels.

```typescript
{
  _type: "icon-block",
  _key: string,
  data: {
    icon: string;                    // Required (Lucide icon name)
    label?: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl";
    color?: "default" | "primary" | "secondary" | "muted";
    align?: "left" | "center" | "right";
  }
}
```

### 11. Stats Block

Statistics display.

```typescript
{
  _type: "stats-block",
  _key: string,
  data: {
    stats: Array<{
      value: string;
      label: string;
      description?: string;
      icon?: string;
    }>;
    layout?: "horizontal" | "vertical";
    variant?: "default" | "highlighted" | "bordered";
  }
}
```

### 12. Accordion Block

Collapsible content panels.

```typescript
{
  _type: "accordion-block",
  _key: string,
  data: {
    items: Array<{
      title: string;
      content: string;
      defaultOpen?: boolean;
    }>;
    allowMultiple?: boolean;
    variant?: "default" | "bordered" | "separated";
  }
}
```

### 13. Tabs Block

Tabbed content interface.

```typescript
{
  _type: "tabs-block",
  _key: string,
  data: {
    tabs: Array<{
      label: string;
      content: string;
      icon?: string;
    }>;
    defaultTab?: number;
    variant?: "default" | "pills" | "underline";
  }
}
```

### 14. Divider Block

Horizontal divider lines.

```typescript
{
  _type: "divider-block",
  _key: string,
  data: {
    style?: "solid" | "dashed" | "dotted";
    thickness?: "thin" | "medium" | "thick";
    spacing?: "sm" | "md" | "lg";
    color?: "default" | "primary" | "muted";
  }
}
```

### 15. Spacer Block

Vertical spacing.

```typescript
{
  _type: "spacer-block",
  _key: string,
  data: {
    height: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  }
}
```

### 16. Embed Block

External content embeds.

```typescript
{
  _type: "embed-block",
  _key: string,
  data: {
    html: string;                    // Required (iframe HTML)
    aspectRatio?: "16/9" | "4/3" | "1/1" | "auto";
    caption?: string;
  }
}
```

### 17. Logo Block

Logo display.

```typescript
{
  _type: "logo-block",
  _key: string,
  data: {
    logoId: "primary" | "icon" | "custom";
    width?: string;
    height?: string;
    align?: "left" | "center" | "right";
    link?: {
      href: string;
      openInNewTab?: boolean;
    };
  }
}
```

### 18. Map Block

Map embeds.

```typescript
{
  _type: "map-block",
  _key: string,
  data: {
    address?: string;
    lat?: number;
    lng?: number;
    zoom?: number;
    height?: string;
    provider?: "google" | "openstreetmap";
  }
}
```

## Deprecated Block Types

The following layout block types are **deprecated**. Use Container layout modes instead.

| Deprecated | Replacement |
|------------|-------------|
| `grid-block` | Container with `layout.type: "grid"` |
| `flex-block` | Container with `layout.type: "flex"` |
| `stack-block` | Container with `layout.type: "stack"` |
| `container-block` | Use Container entity directly |
| `columns-block` | Container with `layout.type: "grid"` |

See [Page Structure Architecture](/docs/architecture/page-structure.md) for the new Section → Container → Block hierarchy.

## Validation Rules

1. `_key` must be unique within the page
2. `_type` must match a registered block type
3. Required fields must be present in `data`
4. Images must have `alt` text for accessibility
5. URLs must be valid

---

**Last Updated:** 2025-12-18
