# Styling Architecture

## The Core Principle

**Builder = Full Tailwind Freedom. Frontend = Clean Semantic CSS.**

This is the definitive guide for how styling flows through the platform.

---

## The Two Outputs

### Builder (Design Tool)

The builder is where we design. It has **full Tailwind CSS freedom** - the complete utility system available for freestyle design.

```tsx
// Builder preview - Tailwind utilities for rapid design
<div className="flex flex-col md:flex-row gap-8 p-12 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
  <h1 className="text-5xl font-bold tracking-tight text-gray-900">
    Boutique. Local. Personalized.
  </h1>
</div>
```

**Why Tailwind in the Builder:**
- Freestyle design - build anything you can imagine
- Rapid iteration - change styles instantly
- Full design system - every spacing, color, typography option
- Responsive design - breakpoint prefixes (`md:`, `lg:`)
- State variants - hover, focus, active effects
- No limitations - if you can code it, you can build it

### Frontend (Production Output)

The frontend outputs **clean, semantic HTML and CSS**. No Tailwind utility soup. No JavaScript bloat.

```html
<!-- Frontend output - Clean semantic markup -->
<section class="section" data-bg="white" data-py="xl">
  <div class="container" data-layout="flex" data-direction="column" data-gap="lg">
    <h1 class="heading" data-size="5xl" data-weight="bold" data-letter-spacing="tight">
      Boutique. Local. Personalized.
    </h1>
  </div>
</section>
```

```css
/* Frontend CSS - Token-based styling via data-attributes */
.section { width: 100%; }
.section[data-bg="white"] { background: var(--background); }
.section[data-py="xl"] { padding-block: var(--spacing-xl); }

.container { width: 100%; max-width: var(--container-max); margin-inline: auto; }
.container[data-layout="flex"] { display: flex; }
.container[data-direction="column"] { flex-direction: column; }
.container[data-gap="lg"] { gap: var(--spacing-lg); }

.heading { font-family: var(--font-heading); line-height: var(--line-height-tight); }
.heading[data-size="5xl"] { font-size: var(--heading-size-5xl); }
.heading[data-weight="bold"] { font-weight: var(--font-weight-bold); }
.heading[data-letter-spacing="tight"] { letter-spacing: -0.025em; }
```

**Why Clean CSS on Frontend:**
- Performance - cached CSS, minimal HTML
- SEO - search engines love clean markup
- Accessibility - semantic structure
- Maintainability - human-readable output
- Professional - not amateur utility soup
- Fast - no runtime CSS-in-JS

---

## The Transformation Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                         BUILDER                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Tailwind Utilities + Design Tokens                      │   │
│  │  "text-5xl font-bold md:text-6xl hover:text-primary"    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                     ┌────────────────┐
                     │  Block Data    │
                     │  (JSON)        │
                     └────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Semantic Classes + Data Attributes + CSS Variables     │   │
│  │  class="heading" data-size="5xl" data-weight="bold"    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Step 1: Design in Builder

Designer uses full Tailwind in the builder's visual interface. Every utility is available.

### Step 2: Save Block Data

When saved, block data stores the styling configuration as structured data:

```json
{
  "_type": "heading-block",
  "_key": "hero-h1",
  "data": {
    "text": "Boutique. Local. Personalized.",
    "level": "h1",
    "size": "5xl",
    "weight": "bold",
    "letterSpacing": "tight",
    "color": "default",
    "align": "left",
    "_responsive": {
      "tablet": { "size": "4xl" },
      "mobile": { "size": "3xl" }
    }
  }
}
```

### Step 3: Render on Frontend

Frontend components render clean HTML with data-attributes:

```tsx
// client/components/block/heading-block.tsx
export function HeadingBlock({ data }: { data: HeadingBlockData }) {
  const Component = data.level;

  return (
    <Component
      className="heading"
      data-size={data.size}
      data-weight={data.weight}
      data-letter-spacing={data.letterSpacing}
      data-align={data.align}
    >
      {data.text}
    </Component>
  );
}
```

Output:
```html
<h1 class="heading" data-size="5xl" data-weight="bold" data-letter-spacing="tight">
  Boutique. Local. Personalized.
</h1>
```

---

## Page Structure

```
Page
└── Section (semantic wrapper)
    ├── background, padding, margins
    └── Container (layout wrapper)
        ├── layout: stack | flex | grid
        ├── gap, alignment, max-width
        └── Block (content)
            └── heading, text, image, button, etc.
```

### Section

The semantic wrapper. Full-width by default. Controls background and vertical spacing.

**Builder:** Style with any Tailwind background, padding, margin utilities.
**Frontend:** Outputs `<section class="section" data-bg="gray" data-py="xl">`.

### Container

The layout wrapper. Controls how blocks are arranged.

**Builder:** Configure grid, flex, or stack layout with full Tailwind flexibility.
**Frontend:** Outputs `<div class="container" data-layout="grid" data-cols="2" data-gap="lg">`.

### Block

The content. Headings, text, images, buttons, etc.

**Builder:** Full typography, spacing, color control via Tailwind.
**Frontend:** Outputs semantic elements with data-attributes for styling.

---

## Naming Convention

### Frontend CSS: Data-Attribute Pattern

All frontend styling uses base classes + data-attributes:

```
.{component}                    → Base element styles
.{component}[data-{prop}="{value}"]  → Property variations
```

**Examples:**

```css
/* Section */
.section { width: 100%; }
.section[data-bg="gray"] { background: var(--muted); }
.section[data-bg="white"] { background: var(--background); }
.section[data-py="xl"] { padding-block: var(--spacing-xl); }
.section[data-py="2xl"] { padding-block: var(--spacing-2xl); }

/* Container */
.container { width: 100%; max-width: var(--container-max); margin-inline: auto; }
.container[data-layout="grid"] { display: grid; }
.container[data-layout="flex"] { display: flex; }
.container[data-layout="stack"] { display: flex; flex-direction: column; }
.container[data-cols="2"] { grid-template-columns: repeat(2, 1fr); }
.container[data-gap="lg"] { gap: var(--spacing-lg); }

/* Heading */
.heading { font-family: var(--font-heading); line-height: var(--line-height-tight); }
.heading[data-size="5xl"] { font-size: var(--heading-size-5xl); }
.heading[data-size="4xl"] { font-size: var(--heading-size-4xl); }
.heading[data-weight="bold"] { font-weight: var(--font-weight-bold); }
.heading[data-align="center"] { text-align: center; margin-inline: auto; }

/* Button */
.button { display: inline-flex; align-items: center; justify-content: center; }
.button[data-variant="primary"] { background: var(--primary); color: var(--primary-foreground); }
.button[data-variant="secondary"] { background: var(--secondary); color: var(--secondary-foreground); }
.button[data-size="lg"] { padding: var(--spacing-3) var(--spacing-6); font-size: var(--font-lg); }
```

### CSS Custom Properties

All values reference design tokens:

```css
:root {
  /* Typography */
  --font-5xl: 3rem;
  --font-bold: 700;
  --tracking-tight: -0.025em;

  /* Spacing */
  --spacing-xl: 4rem;
  --gap-lg: 2rem;

  /* Colors */
  --color-primary: #1a3f56;
  --color-gray-50: #f9fafb;

  /* Radius */
  --radius-2xl: 1rem;

  /* Shadows */
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}
```

---

## Shared Tailwind Config

Both builder and client share the same Tailwind configuration to ensure design parity:

```
packages/tokens/
├── tailwind.preset.ts    → Shared Tailwind preset
├── colors.ts             → Color scales
├── typography.ts         → Font sizes, weights, line heights
├── spacing.ts            → Spacing scale
└── index.ts              → Exports
```

### Usage

```typescript
// builder/tailwind.config.ts
import { enterprisePreset } from '@enterprise/tokens';

export default {
  presets: [enterprisePreset],
  // Builder-specific additions...
};

// client/tailwind.config.ts
import { enterprisePreset } from '@enterprise/tokens';

export default {
  presets: [enterprisePreset],
  // Client-specific additions...
};
```

This ensures:
- Same color palette in builder and frontend
- Same typography scale
- Same spacing values
- Same breakpoints
- Identical design system

---

## Block Data Structure

Every block stores styling as structured data, not raw CSS:

```typescript
interface HeadingBlockData {
  // Content
  text: string;
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  // Typography
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  weight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  letterSpacing?: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';
  lineHeight?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
  fontStyle?: 'normal' | 'italic';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through';

  // Color
  color?: 'default' | 'primary' | 'secondary' | 'muted' | 'accent' | 'destructive';

  // Layout
  align?: 'left' | 'center' | 'right';
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'prose' | 'none';

  // Responsive
  _responsive?: {
    tablet?: Partial<HeadingBlockData>;
    mobile?: Partial<HeadingBlockData>;
  };
}
```

**Why structured data, not raw classes:**
- Validation - ensure valid values
- Migration - easy to update all blocks
- Analysis - query blocks by property
- Transformation - compile to any output format

---

## WYSIWYG Parity

The builder preview must exactly match the frontend output. This is achieved by:

1. **Same Tailwind Config** - Identical design tokens
2. **Same Component Logic** - Preview components mirror frontend components
3. **Same CSS Variables** - Token values are identical
4. **Same Breakpoints** - Responsive preview matches production

### Builder Preview Component

```tsx
// builder/components/blocks/heading-block-editor.tsx
export function HeadingBlockEditor({ block, onChange }: Props) {
  return (
    <InlineText
      value={block.data.text}
      onChange={(text) => handleChange('text', text)}
      as={block.data.level}
      className="heading"
      data-size={block.data.size}
      data-weight={block.data.weight}
      data-align={block.data.align}
      // ... all properties as data-attributes
    />
  );
}
```

### Frontend Component

```tsx
// client/components/block/heading-block.tsx
export function HeadingBlock({ data }: Props) {
  const Component = data.level;

  return (
    <Component
      className="heading"
      data-size={data.size}
      data-weight={data.weight}
      data-align={data.align}
      data-letter-spacing={data.letterSpacing}
    >
      {data.text}
    </Component>
  );
}
```

### Shared CSS

Both builder and client import the same base CSS from `@enterprise/tokens`:

```css
/* packages/tokens/src/css/heading.css */
.heading {
  font-family: var(--font-heading);
  line-height: var(--line-height-tight);
}

.heading[data-size="5xl"] { font-size: var(--heading-size-5xl); }
.heading[data-size="4xl"] { font-size: var(--heading-size-4xl); }
/* ... */

.heading[data-weight="bold"] { font-weight: var(--font-weight-bold); }
.heading[data-weight="semibold"] { font-weight: var(--font-weight-semibold); }
/* ... */

.heading[data-align="center"] { text-align: center; margin-inline: auto; }
.heading[data-align="left"] { text-align: left; }
/* ... */
```

---

## Responsive Design

### Builder

Full responsive preview with breakpoint switching. Designer can set different values per breakpoint.

### Block Data

Responsive overrides stored in `_responsive`:

```json
{
  "size": "5xl",
  "_responsive": {
    "tablet": { "size": "4xl" },
    "mobile": { "size": "3xl", "align": "center" }
  }
}
```

### Frontend Output

Compiled to CSS with media queries:

```css
.hero-heading {
  font-size: var(--font-5xl);
  text-align: left;
}

@media (max-width: 1024px) {
  .hero-heading {
    font-size: var(--font-4xl);
  }
}

@media (max-width: 640px) {
  .hero-heading {
    font-size: var(--font-3xl);
    text-align: center;
  }
}
```

---

## Why This Architecture

### vs Inline Styles (Webflow/Builder.io)

```html
<!-- Their output - bloated, uncacheable -->
<div style="display:flex;flex-direction:column;gap:2rem;padding:3rem;background:#fff;border-radius:1rem;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1)">
```

```html
<!-- Our output - clean, cacheable -->
<div class="hero-card">
```

### vs Utility Classes (Tailwind in production)

```html
<!-- Tailwind output - messy, hard to maintain -->
<div class="flex flex-col gap-8 p-12 bg-white rounded-2xl shadow-xl md:flex-row hover:shadow-2xl transition-shadow">
```

```html
<!-- Our output - semantic, readable -->
<div class="hero-card">
```

### vs React/JS Frameworks

```html
<!-- Framework output - JS bloat, hydration -->
<div data-reactroot="" data-v-abc123>
  <!-- + 200KB of JavaScript -->
```

```html
<!-- Our output - static, fast -->
<div class="hero-card">
  <!-- Pure HTML + CSS, no JS required -->
```

---

## Summary

| Aspect | Builder | Frontend |
|--------|---------|----------|
| Styling | Full Tailwind utilities | Data-attribute CSS selectors |
| Output | Visual preview | Clean semantic HTML |
| Classes | `text-5xl font-bold` | `class="heading" data-size="5xl"` |
| CSS | Tailwind processed | CSS custom properties |
| Purpose | Design freedom | Production quality |
| Performance | Development speed | Runtime speed |

**The builder is our design tool. The frontend is our production output.**

---

**Last Updated:** 2025-01-05
**Status:** Active Architecture
