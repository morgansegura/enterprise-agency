# Token-Based Design System

## Overview

The platform uses a token-based design system to enable 100% unique frontends while maintaining professional quality and consistency. All styles are controlled through design tokens - no inline CSS, no arbitrary values.

---

## Core Concept

**Design Tokens = Variables for Design Decisions**

Instead of:

```html
<!-- ❌ Inline CSS (Webflow/Builder.io approach) -->
<div style="background: #3b82f6; padding: 24px; border-radius: 8px;"></div>
```

We use:

```html
<!-- ✅ Token-based (Our approach) -->
<div data-variant="primary" data-spacing="lg" data-radius="md"></div>
```

With CSS:

```css
[data-variant="primary"] {
  background: var(--color-primary-500);
}

[data-spacing="lg"] {
  padding: var(--spacing-6);
}

[data-radius="md"] {
  border-radius: var(--radius-md);
}
```

**Result:** Clean HTML, cached CSS, consistent design, professional output.

---

## Token Architecture

### Token Hierarchy

```
Platform Tokens (System Defaults)
  ↓ inherits
Tenant Tokens (Client Brand)
  ↓ inherits
Page Tokens (Optional Overrides)
  ↓ inherits
Block Tokens (Rare Overrides)
```

### Token Structure

```typescript
interface DesignTokens {
  // Color System
  colors: {
    // Brand Colors
    primary: ColorScale; // Main brand color
    secondary: ColorScale; // Accent brand color
    accent: ColorScale; // Tertiary accent

    // Semantic Colors
    neutral: ColorScale; // Grays, blacks, whites
    success: ColorScale; // Green tones
    warning: ColorScale; // Yellow/orange tones
    error: ColorScale; // Red tones
    info: ColorScale; // Blue tones

    // Functional Colors (derived from above)
    background: string;
    foreground: string;
    muted: string;
    mutedf oreground: string;
    border: string;
    input: string;
    ring: string;
  };

  // Typography
  typography: {
    // Font Families
    fonts: {
      heading: string; // e.g., "Inter", "Crimson Pro"
      body: string; // e.g., "Inter", "Lora"
      mono: string; // e.g., "Fira Code"
    };

    // Font Sizes (type scale)
    sizes: {
      xs: string; // 0.75rem (12px)
      sm: string; // 0.875rem (14px)
      base: string; // 1rem (16px)
      lg: string; // 1.125rem (18px)
      xl: string; // 1.25rem (20px)
      '2xl': string; // 1.5rem (24px)
      '3xl': string; // 1.875rem (30px)
      '4xl': string; // 2.25rem (36px)
      '5xl': string; // 3rem (48px)
      '6xl': string; // 3.75rem (60px)
      '7xl': string; // 4.5rem (72px)
      '8xl': string; // 6rem (96px)
      '9xl': string; // 8rem (128px)
    };

    // Font Weights
    weights: {
      thin: number; // 100
      extralight: number; // 200
      light: number; // 300
      normal: number; // 400
      medium: number; // 500
      semibold: number; // 600
      bold: number; // 700
      extrabold: number; // 800
      black: number; // 900
    };

    // Line Heights
    lineHeights: {
      none: number; // 1
      tight: number; // 1.25
      snug: number; // 1.375
      normal: number; // 1.5
      relaxed: number; // 1.625
      loose: number; // 2
    };

    // Letter Spacing
    letterSpacing: {
      tighter: string; // -0.05em
      tight: string; // -0.025em
      normal: string; // 0
      wide: string; // 0.025em
      wider: string; // 0.05em
      widest: string; // 0.1em
    };
  };

  // Spacing Scale
  spacing: {
    0: string; // 0
    px: string; // 1px
    0.5: string; // 0.125rem (2px)
    1: string; // 0.25rem (4px)
    1.5: string; // 0.375rem (6px)
    2: string; // 0.5rem (8px)
    2.5: string; // 0.625rem (10px)
    3: string; // 0.75rem (12px)
    3.5: string; // 0.875rem (14px)
    4: string; // 1rem (16px)
    5: string; // 1.25rem (20px)
    6: string; // 1.5rem (24px)
    7: string; // 1.75rem (28px)
    8: string; // 2rem (32px)
    9: string; // 2.25rem (36px)
    10: string; // 2.5rem (40px)
    11: string; // 2.75rem (44px)
    12: string; // 3rem (48px)
    14: string; // 3.5rem (56px)
    16: string; // 4rem (64px)
    20: string; // 5rem (80px)
    24: string; // 6rem (96px)
    28: string; // 7rem (112px)
    32: string; // 8rem (128px)
    36: string; // 9rem (144px)
    40: string; // 10rem (160px)
    44: string; // 11rem (176px)
    48: string; // 12rem (192px)
    52: string; // 13rem (208px)
    56: string; // 14rem (224px)
    60: string; // 15rem (240px)
    64: string; // 16rem (256px)
    72: string; // 18rem (288px)
    80: string; // 20rem (320px)
    96: string; // 24rem (384px)
  };

  // Border Radii
  radii: {
    none: string; // 0
    sm: string; // 0.125rem (2px)
    default: string; // 0.25rem (4px)
    md: string; // 0.375rem (6px)
    lg: string; // 0.5rem (8px)
    xl: string; // 0.75rem (12px)
    '2xl': string; // 1rem (16px)
    '3xl': string; // 1.5rem (24px)
    full: string; // 9999px
  };

  // Shadows
  shadows: {
    none: string;
    sm: string;
    default: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
  };

  // Layout
  layout: {
    // Breakpoints
    breakpoints: {
      sm: string; // 640px
      md: string; // 768px
      lg: string; // 1024px
      xl: string; // 1280px
      '2xl': string; // 1536px
    };

    // Max Widths
    maxWidths: {
      xs: string; // 320px
      sm: string; // 384px
      md: string; // 448px
      lg: string; // 512px
      xl: string; // 576px
      '2xl': string; // 672px
      '3xl': string; // 768px
      '4xl': string; // 896px
      '5xl': string; // 1024px
      '6xl': string; // 1152px
      '7xl': string; // 1280px
      full: string; // 100%
    };

    // Z-Index Scale
    zIndex: {
      0: number; // 0
      10: number; // 10
      20: number; // 20
      30: number; // 30
      40: number; // 40
      50: number; // 50
      auto: string; // 'auto'
    };
  };

  // Transitions
  transitions: {
    // Durations
    durations: {
      fast: string; // 150ms
      normal: string; // 200ms
      slow: string; // 300ms
      slower: string; // 500ms
    };

    // Easing Functions
    easing: {
      linear: string;
      in: string;
      out: string;
      inOut: string;
    };
  };
}

// Color Scale Structure
interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string; // Base color
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}
```

---

## Implementation

### 1. Database Storage

```typescript
// api/src/modules/tenants/entities/tenant.entity.ts
@Entity("tenants")
export class Tenant {
  // ... other fields

  @Column({ type: "jsonb", nullable: true })
  designTokens: DesignTokens;

  @Column({ default: false })
  useCustomTokens: boolean; // Falls back to platform defaults if false
}
```

### 2. Platform Default Tokens

```typescript
// builder/lib/tokens/platform-defaults.ts
export const PLATFORM_TOKENS: DesignTokens = {
  colors: {
    primary: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e", // Base green
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
      950: "#052e16",
    },
    secondary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6", // Base blue
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
      950: "#172554",
    },
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
      950: "#0a0a0a",
    },
    // ... other colors
  },
  typography: {
    fonts: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
      mono: "Fira Code, monospace",
    },
    sizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
      "7xl": "4.5rem",
      "8xl": "6rem",
      "9xl": "8rem",
    },
    // ... other typography tokens
  },
  // ... other token categories
};
```

### 3. CSS Variables Generation

```typescript
// client/lib/tokens/generate-css.ts
export function generateCSSVariables(tokens: DesignTokens): string {
  return `
    :root {
      /* Colors - Primary */
      --color-primary-50: ${tokens.colors.primary[50]};
      --color-primary-100: ${tokens.colors.primary[100]};
      --color-primary-200: ${tokens.colors.primary[200]};
      --color-primary-300: ${tokens.colors.primary[300]};
      --color-primary-400: ${tokens.colors.primary[400]};
      --color-primary-500: ${tokens.colors.primary[500]};
      --color-primary-600: ${tokens.colors.primary[600]};
      --color-primary-700: ${tokens.colors.primary[700]};
      --color-primary-800: ${tokens.colors.primary[800]};
      --color-primary-900: ${tokens.colors.primary[900]};
      --color-primary-950: ${tokens.colors.primary[950]};

      /* Typography */
      --font-heading: ${tokens.typography.fonts.heading};
      --font-body: ${tokens.typography.fonts.body};
      --font-mono: ${tokens.typography.fonts.mono};

      --text-xs: ${tokens.typography.sizes.xs};
      --text-sm: ${tokens.typography.sizes.sm};
      --text-base: ${tokens.typography.sizes.base};
      --text-lg: ${tokens.typography.sizes.lg};
      /* ... all other sizes */

      /* Spacing */
      --spacing-0: ${tokens.spacing[0]};
      --spacing-px: ${tokens.spacing.px};
      --spacing-1: ${tokens.spacing[1]};
      --spacing-2: ${tokens.spacing[2]};
      /* ... all spacing values */

      /* Border Radii */
      --radius-none: ${tokens.radii.none};
      --radius-sm: ${tokens.radii.sm};
      --radius-md: ${tokens.radii.md};
      --radius-lg: ${tokens.radii.lg};
      /* ... all radii */

      /* Shadows */
      --shadow-sm: ${tokens.shadows.sm};
      --shadow-md: ${tokens.shadows.md};
      --shadow-lg: ${tokens.shadows.lg};
      /* ... all shadows */

      /* Transitions */
      --duration-fast: ${tokens.transitions.durations.fast};
      --duration-normal: ${tokens.transitions.durations.normal};
      --easing-in-out: ${tokens.transitions.easing.inOut};
      /* ... all transitions */
    }
  `;
}
```

### 4. Component Usage

```typescript
// client/components/block/button-block.tsx
interface ButtonBlockProps {
  data: {
    text: string;
    href: string;
    variant: 'primary' | 'secondary' | 'outline';
    size: 'sm' | 'md' | 'lg';
  };
}

export function ButtonBlock({ data }: ButtonBlockProps) {
  return (
    <a
      href={data.href}
      data-slot="button"
      data-variant={data.variant}
      data-size={data.size}
    >
      {data.text}
    </a>
  );
}
```

```css
/* client/components/block/button-block.css */
[data-slot="button"] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-weight: 600;
  border-radius: var(--radius-md);
  transition: all var(--duration-normal) var(--easing-in-out);
  text-decoration: none;
}

/* Variants */
[data-slot="button"][data-variant="primary"] {
  background-color: var(--color-primary-500);
  color: white;
}

[data-slot="button"][data-variant="primary"]:hover {
  background-color: var(--color-primary-600);
}

[data-slot="button"][data-variant="secondary"] {
  background-color: var(--color-secondary-500);
  color: white;
}

[data-slot="button"][data-variant="outline"] {
  background-color: transparent;
  border: 2px solid var(--color-primary-500);
  color: var(--color-primary-500);
}

/* Sizes */
[data-slot="button"][data-size="sm"] {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--text-sm);
}

[data-slot="button"][data-size="md"] {
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--text-base);
}

[data-slot="button"][data-size="lg"] {
  padding: var(--spacing-4) var(--spacing-8);
  font-size: var(--text-lg);
}
```

---

## Theme Manager UI

### Builder: Token Editor

```typescript
// builder/app/(clients)/[id]/theme/page.tsx
export default function ThemePage({ params }: { params: { id: string } }) {
  const { data: tenant } = useTenant(params.id);
  const updateTokens = useUpdateTenantTokens();

  const [tokens, setTokens] = useState<DesignTokens>(
    tenant?.designTokens || PLATFORM_TOKENS
  );

  const handleColorChange = (path: string, value: string) => {
    // Update nested token value
    const updated = { ...tokens };
    setNestedValue(updated, path, value);
    setTokens(updated);
  };

  const handleSave = () => {
    updateTokens.mutate({
      tenantId: params.id,
      tokens,
    });
  };

  return (
    <div className="theme-editor">
      <h1>Theme Customization</h1>

      <Tabs defaultValue="colors">
        <TabsList>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>

        <TabsContent value="colors">
          <div className="color-editor">
            <h2>Primary Color</h2>
            <ColorScaleEditor
              scale={tokens.colors.primary}
              onChange={(scale) => handleColorChange('colors.primary', scale)}
            />

            <h2>Secondary Color</h2>
            <ColorScaleEditor
              scale={tokens.colors.secondary}
              onChange={(scale) => handleColorChange('colors.secondary', scale)}
            />

            {/* ... other color categories */}
          </div>
        </TabsContent>

        <TabsContent value="typography">
          <div className="typography-editor">
            <h2>Font Families</h2>
            <FontPicker
              label="Heading Font"
              value={tokens.typography.fonts.heading}
              onChange={(font) => handleColorChange('typography.fonts.heading', font)}
            />
            <FontPicker
              label="Body Font"
              value={tokens.typography.fonts.body}
              onChange={(font) => handleColorChange('typography.fonts.body', font)}
            />

            <h2>Type Scale</h2>
            <TypeScaleEditor
              sizes={tokens.typography.sizes}
              onChange={(sizes) => handleColorChange('typography.sizes', sizes)}
            />
          </div>
        </TabsContent>

        {/* ... other tabs */}
      </Tabs>

      <div className="preview-panel">
        <h2>Live Preview</h2>
        <iframe
          src={`/${params.id}/preview`}
          style={{ '--tokens': generateCSSVariables(tokens) }}
        />
      </div>

      <Button onClick={handleSave}>Save Theme</Button>
    </div>
  );
}
```

---

## Real-World Examples

### Example 1: Modern Church

```typescript
const modernChurchTokens: DesignTokens = {
  colors: {
    primary: emeraldScale, // #10b981
    secondary: blueScale, // #3b82f6
    accent: tealScale,
    neutral: slateScale,
  },
  typography: {
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
      mono: "Fira Code, monospace",
    },
    sizes: {
      // Comfortable, modern sizing
      base: "1.125rem", // 18px (larger than default)
      // ... adjusted scale
    },
  },
  radii: {
    default: "0.5rem", // Rounded corners
    // ...
  },
  spacing: {
    // Generous spacing
    // ... scale * 1.2
  },
};
```

**Result:** Clean, modern, tech-forward church site

### Example 2: Traditional Church

```typescript
const traditionalChurchTokens: DesignTokens = {
  colors: {
    primary: navyScale, // #1e3a8a
    secondary: goldScale, // #f59e0b
    accent: crimsonScale,
    neutral: warmGrayScale,
  },
  typography: {
    fonts: {
      heading: "Crimson Pro, serif",
      body: "Lora, serif",
      mono: "Courier New, monospace",
    },
    sizes: {
      // Traditional sizing
      base: "1rem", // 16px
      // ... classic scale
    },
  },
  radii: {
    default: "0", // Sharp corners
    // ...
  },
  spacing: {
    // Tighter spacing
    // ... scale * 0.875
  },
};
```

**Result:** Classic, elegant, traditional church site

### Example 3: Print Company

```typescript
const printCompanyTokens: DesignTokens = {
  colors: {
    primary: indigoScale, // #6366f1
    secondary: orangeScale, // #f97316
    accent: pinkScale,
    neutral: coolGrayScale,
  },
  typography: {
    fonts: {
      heading: "Montserrat, sans-serif",
      body: "Open Sans, sans-serif",
      mono: "Roboto Mono, monospace",
    },
    sizes: {
      // Bold, attention-grabbing
      base: "1rem",
      "6xl": "4rem", // Large headlines
      // ...
    },
  },
  radii: {
    default: "0.25rem", // Subtle rounding
    // ...
  },
  shadows: {
    // Prominent shadows for depth
    lg: "0 10px 25px rgba(0, 0, 0, 0.15)",
    xl: "0 20px 40px rgba(0, 0, 0, 0.2)",
  },
};
```

**Result:** Bold, creative, portfolio-style business site

---

## Benefits of Token System

### 1. Performance

- **Cached CSS**: Styles in external stylesheet, cached by browser
- **Minimal HTML**: No inline styles bloating markup
- **Fast Rendering**: Browser applies cached styles instantly

### 2. Consistency

- **Design System**: All sites follow professional design principles
- **Brand Cohesion**: Colors, fonts, spacing always on-brand
- **Accessibility**: WCAG compliance built into tokens

### 3. Maintainability

- **Single Source of Truth**: Change token, update everywhere
- **No Technical Debt**: No scattered inline styles to track down
- **Easy Updates**: Rebrand entire site by editing tokens

### 4. Uniqueness

- **100% Custom Brands**: Token values create unique identity
- **Infinite Combinations**: Color × Typography × Spacing × Layout
- **Professional Quality**: Constrained choices prevent bad design

### 5. Client-Proof

- **Safe Customization**: Clients can only choose from token options
- **No Breaking**: Can't accidentally break layout or responsiveness
- **Quality Maintained**: All changes stay within design system

---

## Future Enhancements

1. **AI-Powered Token Generation**
   - Upload logo → Extract color palette
   - Analyze brand → Suggest token values

2. **Token Presets**
   - Industry-specific starter themes
   - Seasonal color palettes
   - Accessibility-optimized tokens

3. **Advanced Token Types**
   - Gradients
   - Custom animations
   - Complex shadows (layered)

4. **Token Marketplace**
   - Sell/buy professional token sets
   - Community-contributed themes

5. **Dynamic Tokens**
   - Time-based (day/night themes)
   - User preference-based
   - Context-aware (homepage vs product page)

---

**Last Updated:** 2025-01-22
**Version:** 1.0
**Status:** Ready for Implementation
