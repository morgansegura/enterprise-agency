# Client Data Model

This document defines the data structures used throughout the frontend, designed to match the future API responses.

## Philosophy

**Design the API you wish you had.**

We're building the frontend first with mock data that matches what the backend API will eventually provide. This allows us to:

- Perfect the UX without backend constraints
- Define the ideal data structure
- Build the backend to match what the frontend needs

---

## Core Data Types

All types are defined in `/lib/types.ts` and should be imported wherever needed.

### Shared Types

```typescript
// Typography
export type TextAlign = "left" | "center" | "right" | "justify";
export type TextSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl";
export type HeadingSize = TextSize | "3xl" | "4xl";
export type FontWeight =
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold";
export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

// Layout
export type Spacing = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type Width = "narrow" | "wide" | "full";
export type BackgroundVariant =
  | "none"
  | "white"
  | "gray"
  | "dark"
  | "primary"
  | "secondary";
```

---

## Page Data Structure

### Page Object

```typescript
type Page = {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: "draft" | "published" | "scheduled";
  publishedAt?: string;
  metadata: PageMetadata;
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
};
```

### Page Metadata (SEO)

```typescript
type PageMetadata = {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: "website" | "article";
  canonicalUrl?: string;
};
```

### Example Page JSON

```json
{
  "id": "page_123",
  "slug": "home",
  "title": "Home",
  "description": "Welcome to MH Bible Baptist Church",
  "status": "published",
  "publishedAt": "2025-01-15T00:00:00Z",
  "metadata": {
    "title": "Welcome | MH Bible Baptist Church",
    "description": "Join us for worship and fellowship",
    "keywords": ["church", "worship", "bible"],
    "ogImage": "/og-home.jpg"
  },
  "blocks": [
    {
      "id": "block_1",
      "type": "heading-block",
      "order": 0,
      "data": {
        "title": "Welcome to Our Church",
        "subtitle": "Join us for worship and fellowship",
        "level": "h1",
        "size": "4xl",
        "align": "center"
      }
    }
  ],
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-15T00:00:00Z"
}
```

---

## Block Data Structure

### Base Block

All blocks share this base structure:

```typescript
type Block = {
  id: string;
  type: string; // 'heading-block', 'text-block', etc.
  order: number; // Display order on page
  data: Record<string, any>; // Block-specific data
};
```

### Heading Block

```typescript
type HeadingBlockData = {
  title: string
  subtitle?: string
  level?: HeadingLevel
  size?: HeadingSize
  align?: TextAlign
  variant?: HeadingVariant
  subtitleSize?: TextSize
}

// Example JSON
{
  "id": "block_1",
  "type": "heading-block",
  "order": 0,
  "data": {
    "title": "Welcome",
    "subtitle": "Join us for worship",
    "level": "h1",
    "size": "4xl",
    "align": "center",
    "variant": "default"
  }
}
```

### Text Block (Future)

```typescript
type TextBlockData = {
  content: string
  size?: TextSize
  align?: TextAlign
  variant?: TextVariant
}

// Example JSON
{
  "id": "block_2",
  "type": "text-block",
  "order": 1,
  "data": {
    "content": "We are a community of believers...",
    "size": "lg",
    "align": "left",
    "variant": "default"
  }
}
```

### Hero Block (Future)

```typescript
type HeroBlockData = {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
  cta?: {
    text: string;
    href: string;
    variant: "primary" | "secondary";
  };
  align?: TextAlign;
};
```

---

## Mock Data Location

Mock data files live in `/data/` directory:

```
data/
├── pages/
│   ├── home.json
│   ├── about.json
│   └── contact.json
└── blocks/
    └── examples.json
```

### Creating Mock Data

When building a new block or feature, create mock data first:

```json
// data/pages/example.json
{
  "id": "page_example",
  "slug": "example",
  "title": "Example Page",
  "status": "published",
  "blocks": [
    {
      "id": "block_1",
      "type": "heading-block",
      "order": 0,
      "data": {
        "title": "Example Heading",
        "level": "h2",
        "size": "2xl"
      }
    }
  ]
}
```

---

## Future API Endpoints

When the backend is built, these will be the API endpoints:

### Get Page by Slug

```
GET /api/pages/:slug

Response:
{
  "data": Page,
  "status": "success"
}
```

### Get All Pages

```
GET /api/pages

Response:
{
  "data": Page[],
  "status": "success"
}
```

### Create/Update Blocks

```
PUT /api/pages/:id/blocks

Body: {
  "blocks": Block[]
}

Response:
{
  "data": Page,
  "status": "success"
}
```

---

## Data Flow

```
┌──────────────┐
│  Mock JSON   │  (Current - data/ directory)
│   Files      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Next.js    │  Reads JSON, transforms to typed objects
│    Page      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Block     │  Receives typed data props
│  Renderer    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Block      │  Renders with UI components
│ Components   │  (HeadingBlock, TextBlock, etc.)
└──────────────┘

Future:
┌──────────────┐
│  NestJS API  │  Replaces mock JSON
└──────────────┘
```

---

## Type Safety Guidelines

1. **All block data types** must be defined in the block component file
2. **Export data types** separately from component props
3. **Use shared types** from `/lib/types.ts` when possible
4. **Mock data must match types** exactly

### Example

```typescript
// ✅ Good - matches type
{
  "type": "heading-block",
  "data": {
    "title": "Welcome",
    "level": "h1",
    "size": "4xl"
  }
}

// ❌ Bad - doesn't match HeadingBlockData type
{
  "type": "heading-block",
  "data": {
    "heading": "Welcome",  // Wrong property name
    "level": "heading1"     // Invalid value
  }
}
```

---

## Next Steps

1. Create mock JSON files for initial pages
2. Build BlockRenderer component
3. Create additional block types (TextBlock, HeroBlock, etc.)
4. Perfect the data model through iteration
5. Build backend API to match this structure

---

**Remember:** The frontend defines the ideal API. Build what you wish you had!
