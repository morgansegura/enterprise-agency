# Token Layer Architecture

The `@enterprise/tokens` package provides a comprehensive token system for the page builder, shared between the builder admin and client rendering apps.

## Package Structure

```
packages/tokens/
├── src/
│   ├── architecture/    # Section → Container → Block types
│   │   ├── types.ts     # Core architecture types
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
  data?: Record<string, unknown>;
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
