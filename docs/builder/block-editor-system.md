# Block Editor System

Complete documentation for the builder's block editor infrastructure and implementation.

## Overview

The block editor system provides a centralized, type-safe, and scalable architecture for managing 24 different block types. It uses a registry pattern with lazy loading to optimize performance and maintainability.

## Architecture

### Core Components

```
builder/
├── lib/editor/
│   ├── block-registry.ts          # Central registry for all block types
│   ├── implemented-blocks.ts      # Registration of completed editors
│   ├── types.ts                   # TypeScript types and interfaces
│   └── utils.ts                   # Utility functions
│
├── components/blocks/
│   ├── block-editor-renderer.tsx  # Dynamic component loader
│   ├── button-block-editor.tsx    # Individual block editors...
│   ├── spacer-block-editor.tsx
│   ├── divider-block-editor.tsx
│   ├── text-block-editor.tsx
│   ├── heading-block-editor.tsx
│   └── image-block-editor.tsx
│
└── app/(clients)/[id]/pages/[pageId]/edit/
    └── page.tsx                   # Page editor that uses the system
```

## Block Registry

### Purpose

The `BlockRegistry` class provides:

- Centralized management of all block types
- Lazy loading of editor components
- Type-safe block creation with defaults
- Category and tier-based filtering
- Easy addition of new blocks without modifying existing code

### Implementation

```typescript
// lib/editor/block-registry.ts
class BlockRegistry {
  private registry = new Map<string, BlockRegistration>();

  // Register a single block
  register(registration: BlockRegistration): void {
    this.registry.set(registration.type, registration);
  }

  // Register multiple blocks at once
  registerMany(registrations: BlockRegistration[]): void {
    registrations.forEach((reg) => this.register(reg));
  }

  // Get a specific block registration
  get(type: string): BlockRegistration | undefined {
    return this.registry.get(type);
  }

  // Load editor component dynamically
  async loadEditor(
    type: string,
  ): Promise<ComponentType<BlockEditorProps> | null> {
    const registration = this.get(type);
    if (!registration) return null;

    try {
      const module = await registration.component();
      return module.default;
    } catch (error) {
      console.error(`Failed to load editor for "${type}":`, error);
      return null;
    }
  }

  // Create default block instance
  createDefault(type: string): Block | null {
    const registration = this.get(type);
    if (!registration) return null;
    return registration.createDefault();
  }

  // Filter blocks by category
  getByCategory(category: string): BlockRegistration[] {
    return this.getAll().filter((reg) => reg.category === category);
  }

  // Filter blocks by tier
  getByTier(tier: string): BlockRegistration[] {
    return this.getAll().filter((reg) => reg.tier === tier);
  }
}

export const blockRegistry = new BlockRegistry();
```

### Registration Format

```typescript
interface BlockRegistration {
  type: string; // Unique block type ID (e.g., "button-block")
  displayName: string; // Human-readable name (e.g., "Button")
  category: "content" | "media" | "layout" | "interactive";
  icon: string; // Lucide icon name
  description: string; // Short description
  component: () => Promise<{
    // Lazy-loaded editor component
    default: ComponentType<BlockEditorProps>;
  }>;
  createDefault: () => Block; // Factory function for default data
  tier: "CONTENT_EDITOR" | "BUILDER"; // Required tier
}
```

### Example Registration

```typescript
// lib/editor/implemented-blocks.ts
{
  type: "button-block",
  displayName: "Button",
  category: "content",
  icon: "MousePointerClick",
  description: "Call-to-action button with link",
  component: () =>
    import("@/components/blocks/button-block-editor").then((mod) => ({
      default: mod.ButtonBlockEditor as any,
    })),
  createDefault: () => ({
    _key: `button-${Date.now()}`,
    _type: "button-block",
    data: {
      text: "Click me",
      href: "#",
      variant: "default",
      size: "default",
      fullWidth: false,
      openInNewTab: false,
    },
  }),
  tier: "CONTENT_EDITOR",
}
```

## Block Editor Renderer

### Purpose

The `BlockEditorRenderer` component:

- Dynamically loads the appropriate editor for any block type
- Handles loading states
- Displays errors gracefully
- Provides consistent interface for all editors

### Implementation

```typescript
// components/blocks/block-editor-renderer.tsx
export function BlockEditorRenderer({ block, onChange, onDelete }: BlockEditorRendererProps) {
  const [EditorComponent, setEditorComponent] = useState<ComponentType<BlockEditorProps> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    blockRegistry
      .loadEditor(block._type)
      .then((component) => {
        if (!component) {
          setError(`Editor not found for block type: ${block._type}`);
        } else {
          setEditorComponent(() => component);
        }
      })
      .catch((err) => {
        setError(`Failed to load editor: ${err.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [block._type]);

  if (isLoading) return <div>Loading...</div>;
  if (error || !EditorComponent) return <div>Error: {error}</div>;

  return <EditorComponent block={block} onChange={onChange} onDelete={onDelete} />;
}
```

### Usage in Page Editor

```typescript
// app/(clients)/[id]/pages/[pageId]/edit/page.tsx
{section.blocks.map((block, blockIndex) => (
  <BlockEditorRenderer
    key={block._key}
    block={block}
    onChange={(updatedBlock) =>
      handleBlockChange(sectionIndex, blockIndex, updatedBlock)
    }
    onDelete={() =>
      handleBlockDelete(sectionIndex, blockIndex)
    }
  />
))}
```

## Block Editor Pattern

All block editors follow a consistent two-state pattern for optimal UX.

### Standard Structure

```typescript
interface BlockEditorProps {
  block: BlockData;                    // Current block data
  onChange: (block: BlockData) => void;  // Immutable update callback
  onDelete: () => void;                  // Delete callback
}

export function BlockEditor({ block, onChange, onDelete }: BlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDataChange = (field: string, value: unknown) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        [field]: value,
      },
    });
  };

  if (!isEditing) {
    return <PreviewMode />;
  }

  return <EditMode />;
}
```

### Preview Mode

**Visual Design:**

- Dashed border (`border-2 border-dashed border-border`)
- Hover effect (`hover:border-primary`)
- Click to edit (`onClick={() => setIsEditing(true)}`)
- Hover-reveal delete button (`opacity-0 group-hover:opacity-100`)

**Example:**

```tsx
<div
  className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
  onClick={() => setIsEditing(true)}
>
  {/* Visual preview of block */}
  <Button
    variant="destructive"
    size="icon-sm"
    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
    onClick={(e) => {
      e.stopPropagation();
      onDelete();
    }}
  >
    <Trash2 className="h-3 w-3" />
  </Button>
</div>
```

### Edit Mode

**Visual Design:**

- Solid primary border (`border-2 border-primary`)
- Header with icon and title
- Done/Delete buttons
- Form controls (Input, Select, Textarea, etc.)
- Live preview section at bottom

**Example:**

```tsx
<div className="border-2 border-primary rounded-lg p-4 space-y-4">
  {/* Header */}
  <div className="flex items-center justify-between">
    <h4 className="font-semibold text-sm flex items-center gap-2">
      <Icon className="h-4 w-4" />
      Block Name
    </h4>
    <div className="flex gap-2">
      <Button size="sm" onClick={() => setIsEditing(false)}>
        Done
      </Button>
      <Button variant="destructive" size="sm" onClick={onDelete}>
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  </div>

  {/* Form Fields */}
  <div className="space-y-3">
    <div>
      <Label htmlFor="field">Field Label</Label>
      <Input
        id="field"
        value={block.data.field}
        onChange={(e) => handleDataChange("field", e.target.value)}
      />
    </div>
  </div>

  {/* Live Preview */}
  <div className="border rounded-lg p-4 bg-muted/30">
    <p className="text-xs text-muted-foreground mb-2">Preview:</p>
    {/* Rendered preview */}
  </div>
</div>
```

## Implemented Block Editors

### Phase 1 - Core Editors (6 editors) ✅

#### 1. Button Block Editor

**Features:**

- Text input
- URL input
- Variant selector (default, destructive, outline, secondary, ghost, link)
- Size selector (default, sm, lg, icon)
- Full width toggle
- Open in new tab toggle

**Data Structure:**

```typescript
{
  text: string;
  href: string;
  variant: "default" |
    "destructive" |
    "outline" |
    "secondary" |
    "ghost" |
    "link";
  size: "default" | "sm" | "lg" | "icon";
  fullWidth: boolean;
  openInNewTab: boolean;
}
```

#### 2. Spacer Block Editor

**Features:**

- Height selector (xs, sm, md, lg, xl, 2xl)
- Visual height preview with measurements

**Data Structure:**

```typescript
{
  height: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}
```

#### 3. Divider Block Editor

**Features:**

- Style selector (solid, dashed, dotted)
- Thickness selector (thin, medium, thick)
- Spacing selector (sm, md, lg)
- Color selector (default, primary, muted)

**Data Structure:**

```typescript
{
  style: "solid" | "dashed" | "dotted";
  thickness: "thin" | "medium" | "thick";
  spacing: "sm" | "md" | "lg";
  color: "default" | "primary" | "muted";
}
```

#### 4. Text Block Editor

**Features:**

- TipTap WYSIWYG editor with bubble menu toolbar
- Inline formatting: bold, italic, underline, strike, code
- Size selector (xs through 6xl)
- Alignment selector (left, center, right, justify)
- Comprehensive typography controls:
  - Weight (thin through black)
  - Letter spacing (tighter through widest)
  - Line height (none through loose)
  - Font style (normal, italic)
  - Text transform (none, uppercase, lowercase, capitalize)
  - Text decoration (none, underline, line-through)
- Color presets (default, primary, secondary, muted, accent, destructive)
- Layout controls (maxWidth, whiteSpace)
- Multi-column support (1-4 columns with gap options)
- Effects (opacity, dropCap)
- Responsive overrides for tablet/mobile

**Data Structure:**

```typescript
{
  // Content
  text?: string;     // Plain text (legacy)
  html?: string;     // Rich text HTML from TipTap (preferred)

  // Typography - Size & Spacing
  size?: "xs" | "sm" | "base" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  letterSpacing?: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest";
  lineHeight?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";

  // Typography - Style
  weight?: "thin" | "extralight" | "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold" | "black";
  fontStyle?: "normal" | "italic";
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  textDecoration?: "none" | "underline" | "line-through";
  variant?: "default" | "muted" | "lead" | "subtle" | "caption";

  // Typography - Color (presets only)
  color?: "default" | "primary" | "secondary" | "muted" | "accent" | "destructive";

  // Layout
  align?: "left" | "center" | "right" | "justify";
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "prose" | "none";
  whiteSpace?: "normal" | "nowrap" | "pre-wrap";

  // Multi-column
  columns?: 1 | 2 | 3 | 4;
  columnGap?: "sm" | "md" | "lg" | "xl";

  // Effects
  opacity?: number; // 0-100, mapped to presets
  dropCap?: boolean;

  // Responsive overrides
  _responsive?: {
    tablet?: Partial<TextBlockData>;
    mobile?: Partial<TextBlockData>;
  };
}
```

**Implementation Note:** Uses CSS classes for all styling (no inline styles). The TipTap editor stores rich text as HTML in the `html` field.

#### 5. Heading Block Editor

**Features:**

- Text input
- Semantic level selector (h1-h6)
- Visual size customization (xs-9xl) - independent of semantic level
- Alignment selector (left, center, right)
- Comprehensive typography controls:
  - Weight (thin through black)
  - Letter spacing (tighter through widest)
  - Line height (none through loose)
  - Font style (normal, italic)
  - Text transform (none, uppercase, lowercase, capitalize)
  - Text decoration (none, underline, line-through)
- Color presets (default, primary, secondary, muted, accent, destructive)
- Layout controls (maxWidth, whiteSpace)
- Effects (opacity)
- Responsive overrides for tablet/mobile

**Data Structure:**

```typescript
{
  // Content
  text: string;
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  // Typography - Size & Spacing
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl";
  letterSpacing?: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest";
  lineHeight?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";

  // Typography - Style
  weight?: "thin" | "extralight" | "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold" | "black";
  fontStyle?: "normal" | "italic";
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  textDecoration?: "none" | "underline" | "line-through";
  variant?: "default" | "primary" | "muted";

  // Typography - Color (presets only, no arbitrary values)
  color?: "default" | "primary" | "secondary" | "muted" | "accent" | "destructive";

  // Layout
  align?: "left" | "center" | "right";
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "prose" | "none";
  whiteSpace?: "normal" | "nowrap" | "pre-wrap";

  // Effects
  opacity?: number; // 0-100, mapped to presets (10, 25, 50, 75, 90, 100)

  // Responsive overrides
  _responsive?: {
    tablet?: Partial<HeadingBlockData>;
    mobile?: Partial<HeadingBlockData>;
  };
}
```

**Implementation Note:** Uses data-\* attributes and CSS classes for styling (no inline styles). Responsive overrides generate Tailwind-prefixed classes (md:, lg:).

#### 6. Image Block Editor

**Features:**

- URL input
- Alt text input (required for accessibility)
- Aspect ratio selector (16:9, 4:3, 1:1, 3:2, auto)
- Object fit selector (cover, contain, fill, none)
- Optional caption (Textarea)
- Optional link configuration (Accordion)
  - Link URL
  - Open in new tab toggle

**Data Structure:**

```typescript
{
  src: string;
  alt: string;
  aspectRatio: "16/9" | "4/3" | "1/1" | "3/2" | "auto";
  objectFit: "cover" | "contain" | "fill" | "none";
  rounded: boolean;
  caption?: string;
  link?: {
    href: string;
    openInNewTab: boolean;
  };
}
```

## Adding a New Block Editor

### Step 1: Create Editor Component

```typescript
// components/blocks/my-new-block-editor.tsx
"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, IconName } from "lucide-react";

interface MyNewBlockData {
  _key: string;
  _type: "my-new-block";
  data: {
    myField: string;
    // ... other fields
  };
}

interface MyNewBlockEditorProps {
  block: MyNewBlockData;
  onChange: (block: MyNewBlockData) => void;
  onDelete: () => void;
}

export function MyNewBlockEditor({
  block,
  onChange,
  onDelete,
}: MyNewBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDataChange = (field: string, value: unknown) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        [field]: value,
      },
    });
  };

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        {/* Preview */}
        <Button
          variant="destructive"
          size="icon-sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="border-2 border-primary rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <IconName className="h-4 w-4" />
          My New Block
        </h4>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setIsEditing(false)}>
            Done
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Form fields */}
      </div>

      <div className="border rounded-lg p-4 bg-muted/30">
        <p className="text-xs text-muted-foreground mb-2">Preview:</p>
        {/* Live preview */}
      </div>
    </div>
  );
}
```

### Step 2: Register in implemented-blocks.ts

```typescript
// lib/editor/implemented-blocks.ts
{
  type: "my-new-block",
  displayName: "My New Block",
  category: "content",
  icon: "IconName",
  description: "Description of what this block does",
  component: () =>
    import("@/components/blocks/my-new-block-editor").then((mod) => ({
      default: mod.MyNewBlockEditor as any,
    })),
  createDefault: () => ({
    _key: `my-new-block-${Date.now()}`,
    _type: "my-new-block",
    data: {
      myField: "default value",
    },
  }),
  tier: "CONTENT_EDITOR", // or "BUILDER"
}
```

### Step 3: Test

1. Start the builder: `pnpm dev:builder`
2. Navigate to page editor
3. Click "Add Block" in blocks library
4. Find your new block in the appropriate category
5. Add it to the page
6. Test preview mode and edit mode
7. Verify save/delete functionality

## Best Practices

### Data Management

1. **Immutability**: Always create new objects when updating

```typescript
// Good
onChange({ ...block, data: { ...block.data, field: value } });

// Bad
block.data.field = value;
onChange(block);
```

2. **Type Safety**: Use TypeScript interfaces for all block data
3. **Defaults**: Provide sensible defaults in `createDefault()`
4. **Validation**: Add Zod schemas for runtime validation (future)

### UI/UX

1. **Consistent Patterns**: Follow the two-state pattern
2. **Visual Feedback**: Show loading/error states
3. **Accessibility**: Use proper labels, ARIA attributes
4. **Preview**: Always show live preview in edit mode
5. **Delete Confirmation**: Consider adding confirmation for destructive actions

### Performance

1. **Lazy Loading**: Use dynamic imports in registry
2. **Memoization**: Memoize expensive computations
3. **Debouncing**: Debounce rapid onChange calls if needed
4. **Code Splitting**: Each editor is its own chunk

### Phase 2 - Rich Content (5 editors) ✅

#### 7. Rich Text Block Editor

**Features:**

- TipTap WYSIWYG editor with formatting toolbar
- Bold, italic, strike, code formatting
- Headings (H1-H6), bullet lists, ordered lists
- Blockquotes, code blocks, horizontal rules
- Link management with URL prompt
- Size selector (xs-xl)
- Alignment selector (left, center, right, justify)

**Data Structure:**

```typescript
{
  html: string;
  size: "xs" | "sm" | "md" | "lg" | "xl";
  align: "left" | "center" | "right" | "justify";
}
```

#### 8. Quote Block Editor

**Features:**

- Quote text (Textarea)
- Optional title input
- Optional author input
- Size selector (sm, md, lg)
- Alignment selector (left, center, right)
- Variant selector (default, bordered, highlighted)

**Data Structure:**

```typescript
{
  text: string;
  title?: string;
  author?: string;
  size: "sm" | "md" | "lg";
  align: "left" | "center" | "right";
  variant: "default" | "bordered" | "highlighted";
}
```

#### 9. List Block Editor

**Features:**

- Dynamic items array with add/remove
- Items management with text inputs
- Ordered/unordered toggle
- Style selector (default, checkmarks, bullets, numbers)
- Spacing selector (compact, comfortable, relaxed)

**Data Structure:**

```typescript
{
  items: Array<{ text: string }>;
  ordered: boolean;
  style: "default" | "checkmarks" | "bullets" | "numbers";
  spacing: "compact" | "comfortable" | "relaxed";
}
```

#### 10. Icon Block Editor

**Features:**

- Icon name input (Lucide icons)
- Quick select common icons (Star, Heart, Check, X, etc.)
- Optional label input
- Size selector (sm, md, lg, xl)
- Color selector (default, primary, secondary, muted)
- Alignment selector (left, center, right)

**Data Structure:**

```typescript
{
  icon: string;
  label?: string;
  size: "sm" | "md" | "lg" | "xl";
  color: "default" | "primary" | "secondary" | "muted";
  align: "left" | "center" | "right";
}
```

#### 11. Card Block Editor

**Features:**

- Title input
- Description (Textarea)
- Optional footer text
- Optional image (Accordion)
  - Image URL, alt text, aspect ratio, object fit
- Optional link (Accordion)
  - URL, open in new tab toggle
- Variant selector (default, bordered, elevated)
- Padding selector (sm, md, lg)

**Data Structure:**

```typescript
{
  title: string;
  description: string;
  footer?: string;
  image?: {
    src: string;
    alt: string;
    aspectRatio: "16/9" | "4/3" | "1/1";
    objectFit: "cover" | "contain" | "fill";
  };
  link?: {
    href: string;
    openInNewTab: boolean;
  };
  variant: "default" | "bordered" | "elevated";
  padding: "sm" | "md" | "lg";
}
```

### Phase 3 - Interactive/Media (6 editors) ✅

#### 12. Video Block Editor

**Features:**

- URL input
- Provider selector (YouTube, Vimeo, direct)
- Aspect ratio selector (16:9, 4:3, 1:1, 21:9)
- Controls toggle
- Autoplay toggle
- Muted toggle
- Loop toggle

**Data Structure:**

```typescript
{
  url: string;
  provider: "youtube" | "vimeo" | "direct";
  aspectRatio: "16/9" | "4/3" | "1/1" | "21/9";
  controls: boolean;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
}
```

#### 13. Audio Block Editor

**Features:**

- Source URL input
- Optional title input
- Optional artist input
- Controls toggle
- Autoplay toggle
- Loop toggle

**Data Structure:**

```typescript
{
  src: string;
  title?: string;
  artist?: string;
  controls: boolean;
  autoplay: boolean;
  loop: boolean;
}
```

#### 14. Embed Block Editor

**Features:**

- HTML/iframe code input (Textarea with monospace font)
- Aspect ratio selector (16:9, 4:3, 1:1, auto)
- Optional caption
- Supports any embed code

**Data Structure:**

```typescript
{
  html: string;
  aspectRatio: "16/9" | "4/3" | "1/1" | "auto";
  caption?: string;
}
```

#### 15. Accordion Block Editor

**Features:**

- Dynamic items array with add/remove
- Expandable editing per item (title, content, defaultOpen)
- Allow multiple toggle (open multiple items simultaneously)
- Variant selector (default, bordered, separated)

**Data Structure:**

```typescript
{
  items: Array<{
    title: string;
    content: string;
    defaultOpen: boolean;
  }>;
  allowMultiple: boolean;
  variant: "default" | "bordered" | "separated";
}
```

#### 16. Tabs Block Editor

**Features:**

- Dynamic tabs array with add/remove
- Tab navigation for editing active tab
- Label, content, optional icon per tab
- Default tab selector
- Variant selector (default, pills, underline)

**Data Structure:**

```typescript
{
  tabs: Array<{
    label: string;
    content: string;
    icon?: string;
  }>;
  defaultTab: number;
  variant: "default" | "pills" | "underline";
}
```

#### 17. Stats Block Editor

**Features:**

- Dynamic stats array with add/remove
- Expandable editing per stat (value, label, description, icon)
- Layout selector (horizontal, vertical)
- Variant selector (default, highlighted, bordered)

**Data Structure:**

```typescript
{
  stats: Array<{
    value: string;
    label: string;
    description?: string;
    icon?: string;
  }>;
  layout: "horizontal" | "vertical";
  variant: "default" | "highlighted" | "bordered";
}
```

## Roadmap

### Phase 4 - Layout Containers (5 editors) ⏳

Requires nested block support infrastructure.

- container-block-editor.tsx
- stack-block-editor.tsx
- flex-block-editor.tsx
- grid-block-editor.tsx
- columns-block-editor.tsx

### Phase 5 - Specialized (2 editors) ⏳

- logo-block-editor.tsx
- map-block-editor.tsx

## Related Documentation

- [Two-Tier System](./two-tier-system.md)
- [Token System](./token-system.md)
- [Block Types Reference](../api/block-types.md)
- [Builder Architecture](./architecture.md)

---

**Last Updated:** 2025-12-27
**Status:** Phases 1-3 Complete (17/24 editors)

## Key Implementation Notes

- **No inline styles**: All styling uses data-\* attributes and CSS classes
- **Preset-based values**: Typography properties use preset values (not arbitrary strings)
- **TipTap for rich text**: TextBlock uses TipTap editor, stores HTML in `data.html`
- **Responsive overrides**: Blocks support `_responsive.tablet` and `_responsive.mobile` overrides
