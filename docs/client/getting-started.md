# Getting Started - Complete Flow

This guide shows how all the pieces work together.

---

## Architecture Overview

```
Mock Data (data/mocks/)
        ↓
    Page Component (app/page.tsx)
        ↓
    BlockRenderer (components/block-renderer.tsx)
        ↓
    Block Components (components/block/)
        ↓
    UI Components (components/ui/)
        ↓
    Rendered HTML
```

---

## 1. Creating Mock Data

Create mock page data in `data/mocks/`:

```typescript
// data/mocks/home.mock.ts
export const homePageMock = {
  id: "page_home",
  slug: "home",
  title: "Home",
  blocks: [
    {
      _key: "block_1",
      _type: "heading-block",
      data: {
        title: "Welcome",
        level: "h1",
        size: "4xl",
        align: "center",
      },
    },
  ],
};
```

---

## 2. Rendering Pages

Use the mock data in your pages:

```typescript
// app/page.tsx
import { BlockRenderer } from '@/components/block-renderer'
import { homePageMock } from '@/data/mocks'

export default function Home() {
  const pageData = homePageMock

  return (
    <BlockRenderer blocks={pageData.blocks} />
  )
}
```

---

## 3. BlockRenderer

The BlockRenderer maps block types to components:

```typescript
// components/block-renderer.tsx
const BLOCK_REGISTRY = {
  'heading-block': HeadingBlock,
  'text-block': TextBlock,
  // Add more as you create them
}

export function BlockRenderer({ blocks }) {
  return blocks.map(block => {
    const Component = BLOCK_REGISTRY[block._type]
    return <Component key={block._key} {...block.data} />
  })
}
```

---

## 4. Block Components

Blocks compose UI components:

```typescript
// components/block/heading-block/heading-block.tsx
export function HeadingBlock({ title, subtitle, level, size }) {
  return (
    <div>
      <Heading as={level} size={size}>{title}</Heading>
      {subtitle && <Text variant="muted">{subtitle}</Text>}
    </div>
  )
}
```

---

## 5. UI Components

Primitives with data attributes:

```typescript
// components/ui/heading/heading.tsx
export function Heading({ as, size, children }) {
  const Component = as
  return (
    <Component data-size={size}>
      {children}
    </Component>
  )
}
```

---

## Current Features

✅ Mock data system
✅ Block-based content
✅ BlockRenderer
✅ HeadingBlock
✅ UI components (Heading, Text, Section)
✅ TipTap editor
✅ Type-safe throughout

---

## What's Next?

### Add More Blocks

1. Generate the component:

   ```bash
   npm run generate component block/text-block
   ```

2. Define the data type:

   ```typescript
   export type TextBlockData = {
     content: string;
     size?: "sm" | "base" | "lg";
   };
   ```

3. Build with UI components:

   ```typescript
   export function TextBlock({ content, size = 'base' }) {
     return <Text size={size}>{content}</Text>
   }
   ```

4. Register in BlockRenderer:

   ```typescript
   const BLOCK_REGISTRY = {
     "heading-block": HeadingBlock,
     "text-block": TextBlock, // Add here
   };
   ```

5. Use in mock data:
   ```typescript
   {
     _type: 'text-block',
     data: { content: 'Hello world' }
   }
   ```

---

## Editing Content

Visit `/admin/editor` to test the TipTap editor:

- Type and format content
- Use markdown shortcuts (`#`, `**`, etc.)
- Content converts to your block format
- Logged to console in real-time

---

## Future: API Integration

When you build the backend, simply swap:

```typescript
// Before
const pageData = homePageMock;

// After
const pageData = await fetch("/api/pages/home").then((r) => r.json());
```

Everything else stays the same!

---

## Development Workflow

1. **Create mock data** for a new page
2. **Generate blocks** as needed
3. **Test in browser** (mock data renders)
4. **Test in editor** (`/admin/editor`)
5. **Iterate** on design/UX
6. **Later:** Build API to match

---

## Key Files

- `data/mocks/` - Mock page data
- `components/block-renderer.tsx` - Maps data to components
- `components/block/` - Block components
- `components/ui/` - UI primitives
- `lib/editor/` - TipTap integration
- `app/admin/editor/` - Editor demo

---

**You're ready to start building!** 🎉

Next: Create more blocks and perfect the UX before building the backend.
