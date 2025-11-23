# Client Documentation

Frontend documentation for the MH Bible Baptist Church platform.

---

## Quick Links

- **[Getting Started](./getting-started.md)** - Complete workflow guide ⭐
- **[Component System](./components.md)** - How components are organized
- **[Block Architecture](./blocks.md)** - Block-based content system
- **[Data Model](./data-model.md)** - Data structures and API design
- **[SEO System](./seo-usage.md)** - SEO and metadata
- **[Code Generator](./generator.md)** - Generating components and pages

---

## Getting Started

### Install Dependencies

```bash
cd client
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Generate Components

```bash
# Generate a UI component
pnpm generate component ui/button

# Generate a block component
pnpm generate component block/hero-block

# Generate a page
pnpm generate page contact
```

See [generator.md](./generator.md) for details.

---

## Project Structure

```
client/
├── app/                    # Next.js App Router
│   ├── (routes)/          # Page routes
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # UI primitives (Heading, Text, Button)
│   ├── block/             # Content blocks (HeadingBlock, HeroBlock)
│   └── layout/            # Layout components (Page, Section)
├── lib/
│   ├── types.ts           # Shared TypeScript types
│   ├── utils.ts           # Utility functions (cn, etc.)
│   ├── seo.ts             # SEO utilities
│   └── site-config.ts     # Site configuration
├── data/                  # Mock JSON data (current)
│   └── pages/
└── docs/ → /docs/client   # Documentation
```

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Components:** Custom component system
- **Fonts:** Geist Sans & Geist Mono

---

## Development Workflow

### 1. Build with Mock Data

Currently using JSON files in `/data/` directory to simulate API responses.

### 2. Perfect the Data Model

As you build features, refine the data structures in `/lib/types.ts` and mock JSON.

### 3. Design Components

Build components with the data shapes you want the API to provide.

### 4. Later: Connect to Real API

Once the backend is built, swap mock data for real API calls.

---

## Key Concepts

### Components Are Composable

```tsx
// Block composed from UI components
<HeadingBlock>
  └── <Heading>
  └── <Text>
```

### Data Attributes for Variants

```tsx
<div data-size="lg" data-variant="primary">
```

Styled in CSS:

```css
.component[data-size="lg"] {
  @apply text-lg;
}
```

### Type Safety

All components use TypeScript with shared types from `/lib/types.ts`.

---

## Current Phase

**Phase 2: Mock Data & Perfection**

We're building the frontend first with mock data, perfecting the UX and data model before building the backend.

**Next up:**

- [ ] Create mock JSON data
- [ ] Build BlockRenderer
- [ ] Add more block types
- [ ] Perfect the UX

---

## Need Help?

See the [master documentation index](../../README.md) or check specific doc files above.
