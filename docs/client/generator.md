# Code Generator

A CLI tool to quickly scaffold new components and pages for the MH Bible Baptist Church website.

## Quick Start

```bash
# Generate a component (you choose the directory)
npm run generate component <directory/component-name>

# Generate a page
npm run generate page <route/name>
```

## Generate Components

You have **full control** over where components are created. Specify the complete path:

### Examples

```bash
# UI components go in components/ui/
npm run generate component ui/button
npm run generate component ui/card
npm run generate component ui/input

# Layout components go in components/layout/
npm run generate component layout/header
npm run generate component layout/footer
npm run generate component layout/sidebar

# Nested structures work too
npm run generate component layout/header/nav-menu
npm run generate component forms/input/text-field
npm run generate component sections/hero/hero-banner
```

### What Gets Created

For `npm run generate component ui/button`:

```
components/ui/button/
├── button.tsx       # Component file
├── button.css       # Stylesheet
└── index.ts         # Export file
```

### Component Template

```typescript
import { cn } from '@/lib/utils'
import './button.css'

type ButtonProps = {
  children?: React.ReactNode
  className?: string
}

export function Button({ children, className }: ButtonProps) {
  return (
    <div className={cn("button", className)}>
      {children}
    </div>
  )
}
```

### Import Usage

```typescript
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
```

## Generate Pages

Pages are created in the `app/` directory and automatically get routes.

### Examples

```bash
# Simple page: /contact
npm run generate page contact

# Nested page: /ministries/youth
npm run generate page ministries/youth

# Deep nesting: /events/2024/easter
npm run generate page events/2024/easter
```

### What Gets Created

For `npm run generate page contact`:

```
app/contact/
└── page.tsx        # Next.js page with full SEO metadata
```

### Page Template

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact page for MH Bible Baptist Church.",
  openGraph: {
    title: "Contact | MH Bible Baptist Church",
    description: "Contact page for MH Bible Baptist Church.",
    url: "https://mhbiblebaptist.org/contact",
    siteName: "MH Bible Baptist Church",
    images: [
      {
        url: "https://mhbiblebaptist.org/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact | MH Bible Baptist Church",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | MH Bible Baptist Church",
    description: "Contact page for MH Bible Baptist Church.",
    images: ["https://mhbiblebaptist.org/og-image.jpg"],
  },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">Contact</h1>
      <div className="prose max-w-none">
        <section className="mb-8">
          <p>Contact content goes here.</p>
        </section>
      </div>
    </div>
  );
}
```

## Suggested Directory Structure

Organize your components by purpose:

```
components/
├── ui/              # Reusable UI elements
│   ├── button/
│   ├── card/
│   ├── input/
│   └── modal/
├── layout/          # Layout components
│   ├── header/
│   ├── footer/
│   ├── sidebar/
│   └── page/
├── sections/        # Page sections
│   ├── hero/
│   ├── about/
│   └── testimonials/
└── forms/           # Form components
    ├── contact-form/
    └── newsletter/
```

## Tips & Tricks

### 1. Choose the Right Directory

- **`ui/`** - Generic, reusable components (buttons, inputs, cards)
- **`layout/`** - Structural components (header, footer, navigation)
- **`sections/`** - Large page sections (hero, features, testimonials)
- **`forms/`** - Form-related components

### 2. Use Shorthand

```bash
npm run generate c ui/button      # 'c' for component
npm run generate p contact        # 'p' for page
```

### 3. Naming Conventions (Auto-handled)

- Input: `nav-menu`, `NavMenu`, or `nav_menu`
- Component: `NavMenu` (PascalCase)
- Files: `nav-menu.tsx`, `nav-menu.css` (kebab-case)
- CSS class: `nav-menu` (kebab-case)

### 4. Customize After Generation

Generated files are **templates** - modify them as needed:

```typescript
// Add custom props
type ButtonProps = {
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline"; // ✓ Add this
  size?: "sm" | "md" | "lg"; // ✓ Add this
  onClick?: () => void; // ✓ Add this
};
```

### 5. Update Page Metadata

Always update generated page metadata for better SEO:

```typescript
export const metadata: Metadata = {
  title: "Youth Ministry", // ✓ Specific title
  description: "Join our vibrant youth ministry...", // ✓ Compelling description
  // ... update images, keywords, etc.
};
```

## Real Examples

### Create a Hero Section Component

```bash
npm run generate component sections/hero
```

Result: `components/sections/hero/hero.tsx`

### Create a Contact Form Component

```bash
npm run generate component forms/contact-form
```

Result: `components/forms/contact-form/contact-form.tsx`

### Create a Ministries Page

```bash
npm run generate page ministries
```

Result: `app/ministries/page.tsx` (accessible at `/ministries`)

### Create a Youth Ministry Subpage

```bash
npm run generate page ministries/youth
```

Result: `app/ministries/youth/page.tsx` (accessible at `/ministries/youth`)

## Troubleshooting

**"Permission denied" error:**

```bash
chmod +x scripts/generate.js
```

**Generator not found:**
Make sure you're in the `client/` directory

**Import errors after generation:**

- Check that `@/` path alias is configured in `tsconfig.json`
- Restart your IDE/editor
- Restart the dev server

## Reference Examples

**Component:** `components/layout/page/page.tsx`
**Page:** `app/about/page.tsx`

## Customizing Templates

Edit templates in `scripts/generate.js`:

- `generateComponentTemplate()` - Component structure
- `generateComponentCSSTemplate()` - CSS file
- `generatePageTemplate()` - Page structure
