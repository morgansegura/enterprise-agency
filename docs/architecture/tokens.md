# Token Layer Architecture

The `@enterprise/tokens` package provides a comprehensive token system for the page builder, shared between the builder admin and client rendering apps.

## Package Structure

```
packages/tokens/
├── src/
│   ├── architecture/    # Section → Container → Block types
│   │   ├── types.ts     # Core architecture types
│   │   ├── blocks.ts    # Block type definitions
│   │   └── index.ts     # Exports
│   ├── primitives/      # Raw Tailwind CSS values
│   │   ├── colors.ts    # 22 color palettes (~240 colors)
│   │   ├── spacing.ts   # 36 spacing values (0-96)
│   │   ├── typography.ts # Font sizes, weights, alignment
│   │   ├── borders.ts   # Widths, radii, styles
│   │   ├── effects.ts   # Shadows, opacity, blur
│   │   ├── layout.ts    # Width, height, flex, grid
│   │   ├── transitions.ts # Animations, transforms
│   │   └── index.ts
│   ├── semantic/        # Abstracted scales
│   │   ├── scales.ts    # sizeScale, radiusScale, etc.
│   │   ├── css-variables.ts
│   │   └── index.ts
│   ├── components/      # Component property schemas
│   │   ├── section.ts
│   │   ├── container.ts
│   │   ├── text.ts
│   │   ├── heading.ts
│   │   ├── button.ts
│   │   ├── image.ts
│   │   └── index.ts
│   ├── ui/              # UI utilities
│   │   ├── select-options.ts  # Option generators
│   │   └── index.ts
│   ├── design-system/   # Platform default tokens
│   │   ├── platform-defaults.ts
│   │   └── index.ts
│   ├── fonts/           # Google Fonts utilities
│   │   └── index.ts     # Font list and utilities
│   ├── logger/          # Unified logging utility
│   │   └── index.ts     # Logger class and helpers
│   ├── utils/           # Shared utility functions
│   │   └── index.ts     # cn() and other utilities
│   ├── responsive/      # Responsive override types
│   │   └── index.ts     # Breakpoint types and utilities
│   └── index.ts         # Main exports
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

## Usage

### Importing Types

```typescript
// Import architecture types
import type {
  Section,
  Container,
  Block,
  Spacing,
  BorderRadius,
} from "@enterprise/tokens";

// Import from specific module
import type { Section } from "@enterprise/tokens/architecture";
```

### Importing UI Utilities

```typescript
import {
  SPACING_OPTIONS,
  BORDER_RADIUS_OPTIONS,
  generateOptionsFromScale,
} from "@enterprise/tokens";
```

### Importing Primitives

```typescript
import { spacing, colors, fontSize } from "@enterprise/tokens/primitives";
```

### Importing Semantic Scales

```typescript
import {
  sizeScale,
  radiusScale,
  shadowScale,
} from "@enterprise/tokens/semantic";
```

### Importing Design System Defaults

```typescript
import { platformDefaults } from "@enterprise/tokens";

// Access default color palette, typography, spacing
const { colors, typography, spacing } = platformDefaults;
```

### Importing Font Utilities

```typescript
import {
  googleFonts,
  buildFontFamily,
  buildGoogleFontsUrl,
  getFallbackStack,
} from "@enterprise/tokens";

// Build font-family string with fallbacks
const fontFamily = buildFontFamily("Inter"); // "Inter, ui-sans-serif, system-ui, ..."

// Generate Google Fonts URL for loading
const fontsUrl = buildGoogleFontsUrl(["Inter", "Playfair Display"]);
```

### Importing Logger

```typescript
import { logger, createLogger, type LogLevel } from "@enterprise/tokens";

// Use default logger
logger.info("Something happened", { context: "MyComponent" });
logger.error("Failed to load", error, { meta: { userId: 123 } });

// Create custom logger
const customLogger = createLogger({ minLevel: "warn" });
```

### Importing Utilities

```typescript
import { cn } from "@enterprise/tokens";

// Combine class names with Tailwind merge
const className = cn("px-4 py-2", isActive && "bg-blue-500", className);
```

### Importing Responsive Types

```typescript
import {
  type Breakpoint,
  type ResponsiveOverrides,
  type ResponsiveBlockData,
  BREAKPOINT_WIDTHS,
  hasResponsiveOverrides,
} from "@enterprise/tokens";

// Check if data has responsive overrides
if (hasResponsiveOverrides(blockData)) {
  // Handle responsive data
}
```

## Architecture Types

The core page structure follows `Section → Container → Block`:

```typescript
interface Section<TBlock = Block> {
  _type: "section";
  _key: string;
  containers: Container<TBlock>[];
  background?: string | SectionBackground;
  paddingY?: ExtendedSpacing;
  // ... other section properties
}

interface Container<TBlock = Block> {
  _type: "container";
  _key: string;
  blocks: TBlock[];
  layout: ContainerLayout;
  // ... other container properties
}

interface Block {
  _type: string;
  _key: string;
  data: Record<string, unknown>;
}
```

## Token Scales

### Size Scale (Spacing)

| Key  | Value   | Pixels |
| ---- | ------- | ------ |
| none | 0       | 0px    |
| xs   | 0.5rem  | 8px    |
| sm   | 0.75rem | 12px   |
| md   | 1rem    | 16px   |
| lg   | 1.5rem  | 24px   |
| xl   | 2rem    | 32px   |
| 2xl  | 3rem    | 48px   |
| 3xl  | 4rem    | 64px   |
| 4xl  | 6rem    | 96px   |

### Radius Scale

| Key  | Value    | Pixels |
| ---- | -------- | ------ |
| none | 0        | 0px    |
| sm   | 0.125rem | 2px    |
| md   | 0.375rem | 6px    |
| lg   | 0.5rem   | 8px    |
| xl   | 0.75rem  | 12px   |
| 2xl  | 1rem     | 16px   |
| full | 9999px   | -      |

### Shadow Scale

| Key   | Value                               |
| ----- | ----------------------------------- |
| none  | none                                |
| sm    | 0 1px 2px 0 rgb(0 0 0 / 0.05)       |
| md    | 0 4px 6px -1px rgb(0 0 0 / 0.1)     |
| lg    | 0 10px 15px -3px rgb(0 0 0 / 0.1)   |
| xl    | 0 20px 25px -5px rgb(0 0 0 / 0.1)   |
| inner | inset 0 2px 4px 0 rgb(0 0 0 / 0.05) |

## SelectOption Pattern

The UI module provides pre-generated option arrays for select components:

```typescript
interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

// Pre-generated options
export const SPACING_OPTIONS: SelectOption[];
export const BORDER_RADIUS_OPTIONS: SelectOption[];
export const SHADOW_OPTIONS: SelectOption[];
// ... etc
```

### Generating Custom Options

```typescript
import { generateOptionsFromScale } from "@enterprise/tokens";
import { sizeScale } from "@enterprise/tokens/semantic";

const customOptions = generateOptionsFromScale(sizeScale);
```

## Workspace Integration

The package uses pnpm's `workspace:*` protocol for local resolution:

```json
// builder/package.json or client/package.json
{
  "dependencies": {
    "@enterprise/tokens": "workspace:*"
  }
}
```

During development, pnpm creates symlinks:

```
builder/node_modules/@enterprise/tokens → ../../packages/tokens
client/node_modules/@enterprise/tokens → ../../packages/tokens
```

## Build Process

The package is built with tsup, outputting:

- CommonJS: `dist/*.js`
- ESM: `dist/*.mjs`
- TypeScript declarations: `dist/*.d.ts`

Build command:

```bash
cd packages/tokens && pnpm build
```

The project's root `pnpm verify` command handles build order automatically.

## Adding New Tokens

1. Add primitive values to `src/primitives/`
2. Create semantic scale in `src/semantic/scales.ts`
3. Generate UI options in `src/ui/select-options.ts`
4. Export from appropriate index files
5. Rebuild: `cd packages/tokens && pnpm build`

## Migration Notes

### From Hardcoded Options

Before (269 lines):

```typescript
// builder/lib/constants/settings-options.ts
export const SPACING_OPTIONS = [
  { value: "none", label: "None" },
  { value: "xs", label: "XS" },
  // ... many more
];
```

After (46 lines):

```typescript
// builder/lib/constants/settings-options.ts
export {
  SPACING_OPTIONS,
  BORDER_RADIUS_OPTIONS,
  // ... re-exports from tokens
} from "@enterprise/tokens";
```

## Consolidated Modules

The following modules have been consolidated into `@enterprise/tokens` to eliminate code duplication between builder and client apps:

| Module                | Description                                           | Lines Saved |
| --------------------- | ----------------------------------------------------- | ----------- |
| `architecture/`       | Section, Container, Block types                       | ~700        |
| `design-system/`      | Platform default tokens (colors, typography, spacing) | ~450        |
| `architecture/blocks` | Block type definitions (Heading, Text, Image, etc.)   | ~520        |
| `fonts/`              | Google Fonts list and utilities                       | ~300        |
| `logger/`             | Unified logging with environment detection            | ~150        |
| `utils/`              | cn() className utility                                | ~10         |
| `responsive/`         | Breakpoint types and responsive overrides             | ~40         |
| **Total**             |                                                       | **~2,170**  |

Each app (builder, client) re-exports from `@enterprise/tokens` for backward compatibility:

```typescript
// builder/lib/logger.ts or client/lib/logger.ts
export { logger, createLogger, type LogLevel } from "@enterprise/tokens";
```

This pattern allows gradual migration - existing imports continue to work while new code can import directly from `@enterprise/tokens`.
