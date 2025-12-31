# UI Components

This document covers the reusable UI components available in the builder application.

## Skeleton & Loading Components

Located in `builder/components/ui/skeleton/`

### Overview

The skeleton system provides loading placeholders and animations for a consistent loading experience across the application. All components support configurable animations and are designed to match the final content dimensions.

### Installation

Components are exported from the skeleton module:

```typescript
import {
  Skeleton,
  SkeletonText,
  SkeletonHeading,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonImage,
  SkeletonCard,
  SkeletonArticle,
  SkeletonProfile,
  SkeletonTable,
  SkeletonGrid,
  ImagePlaceholder,
  Loader,
  PageLoader,
} from "@/components/ui/skeleton";
```

### Animation Types

All skeleton components support these animation types:

| Animation | Description                  |
| --------- | ---------------------------- |
| `shimmer` | Gliding highlight effect     |
| `pulse`   | Fading in/out (CSS default)  |
| `wave`    | Smooth wave motion           |
| `none`    | Static placeholder (no anim) |

```typescript
type SkeletonAnimation = "pulse" | "shimmer" | "wave" | "none";
```

### Base Skeleton

The foundational skeleton component:

```tsx
<Skeleton className="h-4 w-full" animation="shimmer" />
```

### Skeleton Variants

#### SkeletonText

Multi-line text placeholder:

```tsx
<SkeletonText lines={3} lastLineWidth="60%" animation="shimmer" />
```

| Prop            | Type                | Default     | Description          |
| --------------- | ------------------- | ----------- | -------------------- |
| `lines`         | `number`            | `3`         | Number of text lines |
| `lastLineWidth` | `string`            | `"60%"`     | Width of last line   |
| `animation`     | `SkeletonAnimation` | `"shimmer"` | Animation type       |

#### SkeletonHeading

Heading placeholder (larger, 3/4 width):

```tsx
<SkeletonHeading animation="shimmer" />
```

#### SkeletonAvatar

Circular avatar placeholder:

```tsx
<SkeletonAvatar size={40} animation="shimmer" />
```

| Prop   | Type    | Default | Description |
| ------ | ------- | ------- | ----------- | ------------------ |
| `size` | `number | string` | `40`        | Diameter in pixels |

#### SkeletonButton

Button-shaped placeholder:

```tsx
<SkeletonButton className="w-24" animation="shimmer" />
```

#### SkeletonImage

Image placeholder with video aspect ratio:

```tsx
<SkeletonImage animation="shimmer" />
```

#### SkeletonCard

Full card skeleton (image + heading + text):

```tsx
<SkeletonCard animation="shimmer" />;

{
  /* Or with custom children */
}
<SkeletonCard animation="shimmer">
  <SkeletonImage />
  <SkeletonHeading />
</SkeletonCard>;
```

### Composite Skeletons

#### SkeletonArticle

Full article layout (image, heading, author, text):

```tsx
<SkeletonArticle animation="shimmer" />
```

#### SkeletonProfile

User profile row (avatar + name + subtitle):

```tsx
<SkeletonProfile animation="shimmer" />
```

#### SkeletonTable

Table skeleton with configurable rows/columns:

```tsx
<SkeletonTable rows={5} columns={4} animation="shimmer" />
```

| Prop      | Type     | Default | Description       |
| --------- | -------- | ------- | ----------------- |
| `rows`    | `number` | `5`     | Number of rows    |
| `columns` | `number` | `4`     | Number of columns |

#### SkeletonGrid

Grid of card skeletons:

```tsx
<SkeletonGrid items={6} columns={3} animation="shimmer" />
```

| Prop      | Type     | Default | Description     |
| --------- | -------- | ------- | --------------- |
| `items`   | `number` | `6`     | Number of cards |
| `columns` | `number` | `3`     | Grid columns    |

### Image Placeholder

Image placeholder with optional icon:

```tsx
<ImagePlaceholder
  animation="shimmer"
  icon="image"
  aspectRatio="video"
  iconSize={48}
/>
```

| Prop          | Type                | Default     | Description         |
| ------------- | ------------------- | ----------- | ------------------- | ------- | --------- | ------------ | ---------------- |
| `animation`   | `SkeletonAnimation` | `"shimmer"` | Animation type      |
| `icon`        | `"image"            | "video"     | "document"          | "user"  | "none"`   | `"image"`    | Placeholder icon |
| `aspectRatio` | `"square"           | "video"     | "portrait"          | "auto"` | `"video"` | Aspect ratio |
| `iconSize`    | `number`            | `48`        | Icon size in pixels |

### Loaders

#### Inline Loader

Small loading indicators for buttons and inline elements:

```tsx
<Loader variant="spinner" size="md" />
```

| Prop      | Type       | Default | Description |
| --------- | ---------- | ------- | ----------- | ----------- | ----------- | ------------ |
| `variant` | `"spinner" | "dots"  | "bars"      | "progress"` | `"spinner"` | Loader style |
| `size`    | `"sm"      | "md"    | "lg"`       | `"md"`      | Loader size |

**Variants:**

- `spinner` - Rotating circle (classic loading spinner)
- `dots` - Three bouncing dots
- `bars` - Four equalizer-style bars
- `progress` - Animated progress bar

#### Page Loader

Full-page loading overlay:

```tsx
<PageLoader
  variant="spinner"
  size="md"
  fullscreen={false}
  label="Loading..."
/>;

{
  /* With custom logo */
}
<PageLoader logo={<YourLogo />} label="Loading..." />;
```

| Prop         | Type              | Default     | Description                   |
| ------------ | ----------------- | ----------- | ----------------------------- |
| `variant`    | `LoaderVariant`   | `"spinner"` | Loader style                  |
| `size`       | `LoaderSize`      | `"md"`      | Loader size                   |
| `fullscreen` | `boolean`         | `false`     | Solid background vs blur      |
| `label`      | `string`          | -           | Loading text                  |
| `logo`       | `React.ReactNode` | -           | Custom logo (replaces loader) |

### CSS Classes

The skeleton system uses data attributes for styling:

```css
/* Base skeleton */
[data-slot="skeleton"] { ... }
[data-slot="skeleton"][data-animation="shimmer"] { ... }
[data-slot="skeleton"][data-animation="pulse"] { ... }

/* Variants */
[data-slot="skeleton-text"] { ... }
[data-slot="skeleton-heading"] { ... }
[data-slot="skeleton-avatar"] { ... }
[data-slot="skeleton-image"] { ... }

/* Image placeholder */
[data-slot="image-placeholder"] { ... }

/* Page loader */
[data-slot="page-loader"] { ... }
[data-slot="page-loader"][data-variant="fullscreen"] { ... }
```

### Global Settings

Loading behavior can be configured globally via Settings > Loading:

- **Skeleton Animation**: Default animation style (shimmer, pulse, wave, none)
- **Image Placeholder**: Default aspect ratio, icon visibility
- **Page Loader**: Loader style, loading text, fullscreen option
- **Inline Loader**: Default variant and size

These settings are stored in tenant tokens and can be accessed via:

```typescript
import { useTenantTokens } from "@/lib/hooks/use-tenant-tokens";

const { data: tokens } = useTenantTokens(tenantId);
const { loadingSettings } = tokens;
```

---

## Global Settings Panels

The builder includes comprehensive global settings accessible via the Settings drawer.

### Available Panels

| Panel      | Description                             |
| ---------- | --------------------------------------- |
| Site       | Page management, homepage settings      |
| SEO        | Meta tags, schema, analytics, redirects |
| Colors     | Brand colors, UI colors, color scales   |
| Typography | Font families, scales, role assignments |
| Animations | Motion preferences, transition timing   |
| Components | Dropdowns, modals, drawers styling      |
| Loading    | Skeletons, placeholders, loaders        |
| Buttons    | Button sizes and styling per size       |
| Inputs     | Form input styling                      |
| Cards      | Card component styling                  |

### SEO Settings

Configure search engine optimization and analytics:

**Meta & Social Tab:**

- Title template and separator
- Default meta description (with character counter)
- Default keywords (tag-based input)
- OG image URL
- Twitter card settings

**Schema Tab:**

- Organization type (Organization, LocalBusiness, Corporation, ProfessionalService)
- Organization name and logo
- Contact information (phone, email)
- Address for local SEO

**Analytics Tab:**

- Google Analytics ID (G-XXXXXXXXXX)
- Google Tag Manager ID (GTM-XXXXXXX)
- Facebook Pixel ID
- Custom head/body scripts

**Redirects Tab:**

- 301/302 redirect management
- Enable/disable individual rules
- From/to URL configuration

### Loading Settings

Configure loading and placeholder behavior:

**Skeleton Animation:**

- Default animation style
- Text skeleton line count

**Image Placeholder:**

- Animation style
- Default aspect ratio
- Icon visibility and size

**Page Loader:**

- Loader variant (spinner, dots, bars, progress)
- Loading text
- Fullscreen overlay option

**Inline Loader:**

- Default variant
- Default size

---

## Usage Examples

### Loading State Pattern

```tsx
function MyComponent() {
  const { data, isLoading } = useQuery(...);

  if (isLoading) {
    return <SkeletonCard animation="shimmer" />;
  }

  return <Card>{data}</Card>;
}
```

### Page Loading

```tsx
function PageWrapper({ children, isLoading }) {
  return (
    <>
      {isLoading && <PageLoader label="Loading page..." />}
      {children}
    </>
  );
}
```

### Button Loading State

```tsx
<Button disabled={isPending}>
  {isPending && <Loader variant="spinner" size="sm" />}
  {isPending ? "Saving..." : "Save"}
</Button>
```

### Image with Placeholder

```tsx
function LazyImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative">
      {!loaded && <ImagePlaceholder animation="shimmer" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={loaded ? "opacity-100" : "opacity-0"}
      />
    </div>
  );
}
```
