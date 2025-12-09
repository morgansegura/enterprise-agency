# Component System

The component system follows a hierarchical structure with clear separation of concerns.

## Component Hierarchy

```
Layout Components (Structure)
  ├── Page
  ├── Section
  └── Container

Block Components (Content Modules)
  ├── HeadingBlock
  ├── TextBlock (future)
  └── HeroBlock (future)

UI Components (Primitives)
  ├── Heading
  ├── Text
  ├── Button (future)
  └── Image (future)
```

---

## Layout Components

### Page

**Location:** `components/layout/page`

**Purpose:** Top-level layout structure with header/footer slots

**Props:**

- `children` - Main content
- `header?` - Header component
- `footer?` - Footer component
- `headerPosition?` - 'static' | 'sticky' | 'fixed'

**Usage:**

```tsx
<Page header={<Header />} footer={<Footer />}>
  {children}
</Page>
```

---

### Section

**Location:** `components/layout/section`

**Purpose:** Page sections with spacing and backgrounds

**Props:**

- `as?` - HTML element (section, div, article, etc.)
- `spacing?` - Vertical padding
- `background?` - Background variant
- `width?` - Max width constraint
- `align?` - Text alignment

**Usage:**

```tsx
<Section spacing="lg" background="gray" width="wide">
  {children}
</Section>
```

---

### Container

**Location:** `components/layout/container` (future)

**Purpose:** Width constraints and horizontal padding

---

## Block Components

### HeadingBlock

**Location:** `components/block/heading-block`

**Purpose:** Page headings with optional subtitles

**Data Type:** `HeadingBlockData`

**Usage:**

```tsx
<HeadingBlock
  title="Welcome"
  subtitle="Join us for worship"
  level="h1"
  size="4xl"
  align="center"
/>
```

---

## UI Components

### Heading

**Location:** `components/ui/heading`

**Purpose:** Semantic headings (h1-h6) with visual styling

**Props:**

- `as?` - Heading level (h1-h6)
- `size?` - Visual size
- `weight?` - Font weight
- `align?` - Text alignment
- `variant?` - Color variant

**Usage:**

```tsx
<Heading as="h2" size="2xl" align="center">
  Title
</Heading>
```

---

### Text

**Location:** `components/ui/text`

**Purpose:** Paragraph text with variants

**Props:**

- `as?` - HTML element (p, span, div)
- `size?` - Text size
- `weight?` - Font weight
- `align?` - Text alignment
- `variant?` - Style variant

**Usage:**

```tsx
<Text variant="lead" size="lg">
  Introduction text
</Text>
```

---

## Component Guidelines

### 1. **Use Data Attributes for Variants**

```tsx
// ✅ Good
<div data-size="lg" data-variant="primary">

// ❌ Avoid
<div className={size === 'lg' ? 'text-lg' : 'text-base'}>
```

### 2. **Import Shared Types**

```tsx
import type { HeadingSize, TextAlign } from "@/lib/types";
```

### 3. **Composition Over Props**

Build blocks from smaller UI components:

```tsx
// Block Component
export function HeadingBlock({ title, subtitle }: HeadingBlockData) {
  return (
    <div>
      <Heading>{title}</Heading>
      {subtitle && <Text variant="muted">{subtitle}</Text>}
    </div>
  );
}
```

### 4. **Separate Data Types**

```tsx
// Export data type separately
export type HeadingBlockData = {
  title: string;
  subtitle?: string;
  // ...
};

// Component uses the data type
export function HeadingBlock(props: HeadingBlockData) {
  // ...
}
```

---

## Creating New Components

Use the code generator:

```bash
# UI Component
npm run generate component ui/button

# Block Component
npm run generate component block/hero-block

# Layout Component
npm run generate component layout/container
```

See [GENERATOR.md](./GENERATOR.md) for details.

---

## Styling Guidelines

### CSS Files

Each component has a CSS file using Tailwind `@apply`:

```css
@reference "tailwindcss";

.component-name {
  @apply relative;
}

.component-name[data-variant="primary"] {
  @apply bg-blue-600 text-white;
}
```

### No Inline Styles

Avoid inline styles and className prop styling:

```tsx
// ❌ Avoid
<div className="text-lg font-bold text-center">

// ✅ Good
<div className={cn("component-name", className)} data-size="lg">
```

The `className` prop is for overrides only, not primary styling.

---

## Component Checklist

When creating a new component:

- [ ] Generate using code generator
- [ ] Define TypeScript types (import from `/lib/types.ts` when possible)
- [ ] Use data attributes for variants
- [ ] Create CSS file with `@apply`
- [ ] Export from index.ts
- [ ] Document in this file
- [ ] Create example usage

---

## Reference

See existing components for examples:

- `components/ui/heading/heading.tsx`
- `components/ui/text/text.tsx`
- `components/layout/section/section.tsx`
- `components/block/heading-block/heading-block.tsx`
