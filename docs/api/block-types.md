# Block Type System Documentation

Complete reference for all block types supported by the CMS.

## Overview

**Total Block Types:** 24+
**Nesting Levels:** Maximum 4 levels deep
**Storage:** JSONB in `Page.content` field

---

## Block Hierarchy

```
Page
└── content
    └── sections: Section[]
        └── blocks: Block[]
            └── blocks?: Block[]  (for container blocks)
                └── blocks?: Block[]
                    └── blocks?: Block[]  (max 4 levels)
```

---

## Section (Top-Level Container)

Every page is composed of sections.

```typescript
{
  _key: string              // Unique identifier
  _type: 'section'          // Always 'section'

  // Styling
  background?: 'default' | 'primary' | 'secondary' | 'accent' | 'muted' | 'dark'
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  width?: 'narrow' | 'default' | 'wide' | 'full'
  align?: 'left' | 'center' | 'right'

  // Content
  blocks: Block[]           // Array of blocks
}
```

**Validation Rules:**

- `_key` must be unique within page
- `blocks` array required, can be empty
- Max 20 sections per page (recommended)

---

## Content Blocks (Leaf Nodes)

These blocks contain actual content and **cannot** have children.

### 1. Heading Block

Display headings with various sizes and styles.

```typescript
{
  _key: string
  _type: 'heading-block'
  data: {
    text: string                                    // Required
    level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' // Required
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
    align?: 'left' | 'center' | 'right'
    weight?: 'normal' | 'medium' | 'semibold' | 'bold'
    color?: 'default' | 'primary' | 'secondary' | 'muted'
  }
}
```

**Example:**

```json
{
  "_key": "hero-heading",
  "_type": "heading-block",
  "data": {
    "text": "Welcome to Our Church",
    "level": "h1",
    "size": "6xl",
    "align": "center",
    "weight": "bold",
    "color": "primary"
  }
}
```

---

### 2. Text Block

Paragraph text with styling options.

```typescript
{
  _key: string
  _type: 'text-block'
  data: {
    text: string                                    // Required
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    align?: 'left' | 'center' | 'right' | 'justify'
    variant?: 'body' | 'muted' | 'caption'
    maxWidth?: string                               // CSS value (e.g., '65ch')
  }
}
```

---

### 3. Rich Text Block

Rich text with formatting (bold, italic, links, lists).

```typescript
{
  _key: string
  _type: 'rich-text-block'
  data: {
    html: string                                    // HTML content
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    align?: 'left' | 'center' | 'right' | 'justify'
  }
}
```

**Example:**

```json
{
  "_key": "about-text",
  "_type": "rich-text-block",
  "data": {
    "html": "<p>We are a <strong>Bible-believing</strong> church serving the community since <em>1985</em>.</p>",
    "size": "lg"
  }
}
```

---

### 4. Button Block

Call-to-action button.

```typescript
{
  _key: string
  _type: 'button-block'
  data: {
    text: string                                    // Required
    href: string                                    // Required
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    icon?: string                                   // Icon name
    iconPosition?: 'left' | 'right'
    openInNewTab?: boolean
  }
}
```

---

### 5. Image Block

Display images with responsive handling.

```typescript
{
  _key: string
  _type: 'image-block'
  data: {
    src: string                                     // Required (URL or asset ID)
    alt: string                                     // Required
    width?: number
    height?: number
    aspectRatio?: '16/9' | '4/3' | '1/1' | '3/2' | 'auto'
    objectFit?: 'cover' | 'contain' | 'fill' | 'none'
    rounded?: boolean
    caption?: string
    link?: {
      href: string
      openInNewTab?: boolean
    }
  }
}
```

**Example:**

```json
{
  "_key": "church-photo",
  "_type": "image-block",
  "data": {
    "src": "https://images.unsplash.com/photo-...",
    "alt": "Church building exterior",
    "aspectRatio": "16/9",
    "objectFit": "cover",
    "rounded": true,
    "caption": "Our beautiful sanctuary"
  }
}
```

---

### 6. Video Block

Embed videos from YouTube, Vimeo, or direct URLs.

```typescript
{
  _key: string
  _type: 'video-block'
  data: {
    url: string                                     // Required (YouTube/Vimeo/direct)
    provider?: 'youtube' | 'vimeo' | 'direct'       // Auto-detected
    aspectRatio?: '16/9' | '4/3' | '1/1' | '21/9'
    autoplay?: boolean
    muted?: boolean
    controls?: boolean
    loop?: boolean
  }
}
```

---

### 7. Audio Block

Audio player.

```typescript
{
  _key: string
  _type: 'audio-block'
  data: {
    src: string                                     // Required
    title?: string
    artist?: string
    controls?: boolean
    autoplay?: boolean
    loop?: boolean
  }
}
```

---

### 8. Card Block

Card with image, title, description, and optional link.

```typescript
{
  _key: string
  _type: 'card-block'
  data: {
    image?: {
      src: string
      alt: string
      aspectRatio?: string
    }
    title: string                                   // Required
    description?: string
    footer?: string
    link?: {
      href: string
      text?: string
      openInNewTab?: boolean
    }
    variant?: 'default' | 'bordered' | 'elevated'
    padding?: 'none' | 'sm' | 'md' | 'lg'
  }
}
```

**Example:**

```json
{
  "_key": "ministry-card",
  "_type": "card-block",
  "data": {
    "image": {
      "src": "https://...",
      "alt": "Youth ministry",
      "aspectRatio": "4/3"
    },
    "title": "Youth Ministry",
    "description": "Ages 12-18. Wednesdays at 7pm.",
    "link": {
      "href": "/ministries/youth",
      "text": "Learn more"
    }
  }
}
```

---

### 9. List Block

Ordered or unordered lists.

```typescript
{
  _key: string
  _type: 'list-block'
  data: {
    items: Array<{
      text: string
      icon?: string
    }>
    ordered?: boolean                               // true = <ol>, false = <ul>
    style?: 'default' | 'checkmarks' | 'bullets' | 'numbers'
    spacing?: 'compact' | 'comfortable'
  }
}
```

---

### 10. Quote Block

Blockquote with optional attribution.

```typescript
{
  _key: string
  _type: 'quote-block'
  data: {
    text: string                                    // Required
    author?: string
    title?: string                                  // Author's title/role
    size?: 'sm' | 'md' | 'lg'
    align?: 'left' | 'center' | 'right'
    variant?: 'default' | 'bordered' | 'highlighted'
  }
}
```

**Example:**

```json
{
  "_key": "verse-quote",
  "_type": "quote-block",
  "data": {
    "text": "For God so loved the world...",
    "author": "John 3:16",
    "size": "lg",
    "align": "center",
    "variant": "highlighted"
  }
}
```

---

### 11. Accordion Block

Collapsible content panels.

```typescript
{
  _key: string
  _type: 'accordion-block'
  data: {
    items: Array<{
      title: string
      content: string
      defaultOpen?: boolean
    }>
    allowMultiple?: boolean                         // Allow multiple open at once
    variant?: 'default' | 'bordered' | 'separated'
  }
}
```

---

### 12. Tabs Block

Tabbed content interface.

```typescript
{
  _key: string
  _type: 'tabs-block'
  data: {
    tabs: Array<{
      label: string
      content: string
      icon?: string
    }>
    defaultTab?: number                             // Index of default active tab
    variant?: 'default' | 'pills' | 'underline'
  }
}
```

---

### 13. Divider Block

Horizontal divider line.

```typescript
{
  _key: string
  _type: 'divider-block'
  data: {
    style?: 'solid' | 'dashed' | 'dotted'
    thickness?: 'thin' | 'medium' | 'thick'
    spacing?: 'sm' | 'md' | 'lg'
    color?: 'default' | 'muted'
  }
}
```

---

### 14. Spacer Block

Vertical spacing.

```typescript
{
  _key: string;
  _type: "spacer-block";
  data: {
    height: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  }
}
```

---

### 15. Embed Block

Embed external content (iframe).

```typescript
{
  _key: string
  _type: 'embed-block'
  data: {
    html: string                                    // Required (iframe HTML)
    aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto'
    caption?: string
  }
}
```

---

### 16. Icon Block

Display icon with optional text.

```typescript
{
  _key: string
  _type: 'icon-block'
  data: {
    icon: string                                    // Required (icon name)
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    color?: 'default' | 'primary' | 'secondary' | 'muted'
    label?: string
    align?: 'left' | 'center' | 'right'
  }
}
```

---

### 17. Stats Block

Display statistics/metrics.

```typescript
{
  _key: string
  _type: 'stats-block'
  data: {
    stats: Array<{
      label: string
      value: string
      description?: string
      icon?: string
    }>
    layout?: 'horizontal' | 'vertical'
    variant?: 'default' | 'highlighted' | 'bordered'
  }
}
```

**Example:**

```json
{
  "_key": "church-stats",
  "_type": "stats-block",
  "data": {
    "stats": [
      {
        "label": "Members",
        "value": "500+",
        "description": "Active members"
      },
      {
        "label": "Years",
        "value": "40",
        "description": "Serving the community"
      }
    ],
    "layout": "horizontal"
  }
}
```

---

### 18. Map Block

Embed Google Maps or other map providers.

```typescript
{
  _key: string
  _type: 'map-block'
  data: {
    address?: string                                // Address to geocode
    lat?: number                                    // Or direct coordinates
    lng?: number
    zoom?: number                                   // Default: 15
    height?: string                                 // CSS height
    provider?: 'google' | 'openstreetmap'
    apiKey?: string                                 // For Google Maps
  }
}
```

---

### 19. Logo Block

Display logo (SVG or image).

```typescript
{
  _key: string
  _type: 'logo-block'
  data: {
    logoId: 'primary' | 'icon' | 'custom'          // References Tenant.logosConfig
    width?: string                                  // CSS width
    height?: string                                 // CSS height
    align?: 'left' | 'center' | 'right'
    link?: {
      href: string
      openInNewTab?: boolean
    }
  }
}
```

---

## Container Blocks

These blocks can contain other blocks (including other containers).

### 20. Grid Block

CSS Grid layout.

```typescript
{
  _key: string
  _type: 'grid-block'
  data: {
    columns: {
      mobile?: number                               // 1-12
      tablet?: number                               // 1-12
      desktop?: number                              // 1-12
    }
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    align?: 'start' | 'center' | 'end' | 'stretch'
    justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
  }
  blocks: Block[]                                   // Child blocks
}
```

**Example:**

```json
{
  "_key": "ministries-grid",
  "_type": "grid-block",
  "data": {
    "columns": {
      "mobile": 1,
      "tablet": 2,
      "desktop": 3
    },
    "gap": "lg"
  },
  "blocks": [
    { "_type": "card-block", ... },
    { "_type": "card-block", ... },
    { "_type": "card-block", ... }
  ]
}
```

---

### 21. Flex Block

Flexbox layout.

```typescript
{
  _key: string
  _type: 'flex-block'
  data: {
    direction: 'row' | 'column' | 'row-reverse' | 'column-reverse'
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
    justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'
  }
  blocks: Block[]                                   // Child blocks
}
```

---

### 22. Stack Block

Vertical stacking (simplified flex column).

```typescript
{
  _key: string
  _type: 'stack-block'
  data: {
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    align?: 'left' | 'center' | 'right'             // Horizontal alignment
  }
  blocks: Block[]                                   // Child blocks
}
```

**Example:**

```json
{
  "_key": "hero-content",
  "_type": "stack-block",
  "data": {
    "gap": "lg",
    "align": "center"
  },
  "blocks": [
    { "_type": "heading-block", ... },
    { "_type": "text-block", ... },
    { "_type": "button-block", ... }
  ]
}
```

---

### 23. Container Block

Width constraint wrapper.

```typescript
{
  _key: string
  _type: 'container-block'
  data: {
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
    padding?: 'none' | 'sm' | 'md' | 'lg'
    center?: boolean
  }
  blocks: Block[]                                   // Child blocks
}
```

---

### 24. Columns Block

Two or three column layout (semantic sugar over grid).

```typescript
{
  _key: string
  _type: 'columns-block'
  data: {
    count: 2 | 3
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    responsive?: boolean                            // Stack on mobile
    ratio?: '1:1' | '2:1' | '1:2' | '1:1:1'       // Column width ratios
  }
  blocks: Block[]                                   // Must have 2 or 3 blocks
}
```

---

## Nesting Rules

**Maximum Depth:** 4 levels

```
Section
└── GridBlock (Level 1)
    └── CardBlock (Level 2) - LEAF, cannot have children
```

**Allowed:**

```
Section
└── GridBlock (Level 1)
    └── StackBlock (Level 2)
        └── ContainerBlock (Level 3)
            └── HeadingBlock (Level 4) - LEAF
```

**Not Allowed:**

```
Section
└── GridBlock (Level 1)
    └── FlexBlock (Level 2)
        └── StackBlock (Level 3)
            └── ContainerBlock (Level 4)
                └── GridBlock (Level 5) ❌ TOO DEEP
```

**Container Blocks Can Nest:**

- GridBlock → StackBlock ✅
- FlexBlock → ContainerBlock ✅
- StackBlock → GridBlock ✅

**Content Blocks Cannot Have Children:**

- HeadingBlock → anything ❌
- TextBlock → anything ❌
- CardBlock → anything ❌

---

## Validation Rules

### Key Uniqueness

- `_key` must be unique across ALL blocks in a page
- Recommendation: Use UUID or `{type}-{timestamp}-{random}`

### Required Fields

- Every block must have `_key` and `_type`
- Content blocks must have `data` object
- Container blocks must have `data` and `blocks` array

### Block Count Limits

- Sections per page: 20 (recommended)
- Blocks per section: 50 (recommended)
- Blocks per container: 20 (recommended)
- Total blocks per page: 500 (hard limit)

### Field Validation

- All enum fields must match allowed values exactly
- URLs must be valid
- Images must have alt text (accessibility)
- JSONB size limit: 1MB per page

---

## API DTO Structure

```typescript
// CreatePageDto
{
  slug: string
  title: string
  content: {
    sections: [
      {
        _key: string
        _type: 'section'
        background?: string
        spacing?: string
        blocks: [
          {
            _key: string
            _type: 'heading-block' | 'text-block' | ...
            data: { ... }
            blocks?: [ ... ]  // For container blocks
          }
        ]
      }
    ]
  }
  metaTitle?: string
  metaDescription?: string
  status?: 'draft' | 'published' | 'scheduled' | 'archived'
}
```

---

## Example Complete Page

```json
{
  "slug": "home",
  "title": "Home",
  "content": {
    "sections": [
      {
        "_key": "hero-section",
        "_type": "section",
        "background": "primary",
        "spacing": "2xl",
        "blocks": [
          {
            "_key": "hero-stack",
            "_type": "stack-block",
            "data": {
              "gap": "lg",
              "align": "center"
            },
            "blocks": [
              {
                "_key": "hero-heading",
                "_type": "heading-block",
                "data": {
                  "text": "Welcome to Our Church",
                  "level": "h1",
                  "size": "6xl",
                  "weight": "bold",
                  "color": "default"
                }
              },
              {
                "_key": "hero-text",
                "_type": "text-block",
                "data": {
                  "text": "Join us this Sunday at 10am",
                  "size": "lg",
                  "variant": "muted"
                }
              },
              {
                "_key": "hero-cta",
                "_type": "button-block",
                "data": {
                  "text": "Plan Your Visit",
                  "href": "/visit",
                  "variant": "primary",
                  "size": "lg"
                }
              }
            ]
          }
        ]
      },
      {
        "_key": "ministries-section",
        "_type": "section",
        "background": "default",
        "spacing": "xl",
        "blocks": [
          {
            "_key": "ministries-heading",
            "_type": "heading-block",
            "data": {
              "text": "Our Ministries",
              "level": "h2",
              "size": "4xl",
              "align": "center"
            }
          },
          {
            "_key": "ministries-grid",
            "_type": "grid-block",
            "data": {
              "columns": {
                "mobile": 1,
                "tablet": 2,
                "desktop": 3
              },
              "gap": "lg"
            },
            "blocks": [
              {
                "_key": "youth-card",
                "_type": "card-block",
                "data": {
                  "title": "Youth Ministry",
                  "description": "Ages 12-18, Wednesdays at 7pm",
                  "link": {
                    "href": "/ministries/youth",
                    "text": "Learn more"
                  }
                }
              },
              {
                "_key": "kids-card",
                "_type": "card-block",
                "data": {
                  "title": "Kids Ministry",
                  "description": "Ages 4-11, Sundays at 10am",
                  "link": {
                    "href": "/ministries/kids",
                    "text": "Learn more"
                  }
                }
              },
              {
                "_key": "worship-card",
                "_type": "card-block",
                "data": {
                  "title": "Worship Team",
                  "description": "Join our music ministry",
                  "link": {
                    "href": "/ministries/worship",
                    "text": "Learn more"
                  }
                }
              }
            ]
          }
        ]
      }
    ]
  },
  "metaTitle": "Home - MH Bible Baptist Church",
  "metaDescription": "Welcome to MH Bible Baptist Church. Join us this Sunday!",
  "status": "published"
}
```

---

## Next Steps

1. Create DTO for each block type
2. Implement discriminated union validation
3. Add nesting level validator
4. Test with sample data
5. Generate TypeScript types from DTOs
