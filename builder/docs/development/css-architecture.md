# CSS Architecture

This project uses **Tailwind CSS v4** with a **CSS-first architecture** approach. All styles are written in dedicated CSS files with semantic class names and the `app-*` naming convention.

---

## Philosophy

### Why CSS-First?

Traditional Tailwind uses utility classes directly in JSX/HTML:

```jsx
// Traditional approach (not used in this project)
<div className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100">
```

Our CSS-first approach:

```jsx
// Our approach
<div className="app-header-button">
```

**Benefits**:

1. **Maintainability** - Change styles in one place
2. **Readability** - Semantic class names describe purpose
3. **Reusability** - Define once, use everywhere
4. **Team Collaboration** - Designers can work in CSS files
5. **Migration** - Easier to switch CSS frameworks if needed

---

## File Structure

```
src/styles/
├── app-header.css          # Header component styles
├── app-sidebar.css         # Sidebar navigation styles
├── app-pages.css           # Page layouts and common patterns
├── sidebar.css             # Sidebar-specific utilities
├── back-to-crm.css         # CRM navigation component
└── globals.css             # Global styles, CSS reset, theme
```

```
src/components/ui/
├── button/
│   ├── button.tsx          # Component
│   └── button.css          # Component styles
├── input/
│   ├── input.tsx
│   └── input.css
├── dropdown-menu/
│   ├── dropdown-menu.tsx
│   └── dropdown-menu.css
└── ...
```

---

## Naming Convention

All application-level styles use the `app-*` prefix to distinguish from component library styles.

### Pattern: `app-[component]-[element]-[modifier]`

```css
/* Component */
.app-header {
}

/* Element within component */
.app-header-button {
}
.app-header-user-avatar {
}

/* Modifier/variant */
.app-header-button:hover {
}
.app-status-badge.app-status-active {
}
```

### Examples

```css
/* Layout */
.app-page-main
.app-page-title
.app-page-subtitle

/* Stats Grid */
.app-stats-grid
.app-stat-card
.app-stat-card-header
.app-stat-card-value

/* Tables */
.app-table
.app-table-header
.app-table-cell
.app-table-row

/* Buttons */
.app-button-primary
.app-button-secondary

/* Status */
.app-status-badge
.app-status-active
.app-status-suspended
```

---

## Tailwind v4 Syntax

### File Reference

Every CSS file must start with:

```css
@reference "tailwindcss";
```

This imports Tailwind's utilities and makes them available via `@apply`.

### Apply Utilities

```css
.app-header {
  @apply sticky top-0 z-10 flex h-14 items-center;
  @apply border-b border-(--border) bg-(--background);
}
```

**Key Differences from Tailwind v3**:

- Use `@apply` for Tailwind utilities
- No `@tailwind` directives
- No JIT mode config needed
- Uses CSS custom properties for themes

### Design Tokens

Tailwind v4 uses CSS custom properties for theming:

```css
/* Access design tokens */
.app-header {
  @apply bg-(--background);
  @apply text-(--foreground);
  @apply border-(--border);
}

/* Available tokens */
--background
--foreground
--muted
--muted-foreground
--popover
--popover-foreground
--card
--card-foreground
--border
--input
--primary
--primary-foreground
--secondary
--secondary-foreground
--accent
--accent-foreground
--destructive
--destructive-foreground
--ring
```

### CSS Nesting

Tailwind v4 supports native CSS nesting:

```css
.app-button {
  @apply px-4 py-2 rounded-lg;

  &:hover {
    @apply bg-(--accent);
  }

  &:disabled {
    @apply opacity-50 pointer-events-none;
  }

  &[data-variant="primary"] {
    @apply bg-blue-600 text-white;
  }
}
```

---

## Animations

### Custom Keyframes

Tailwind v4 doesn't include animation utilities like `animate-in` or `fade-in`. Create custom animations:

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.dropdown-menu-content {
  &[data-state="open"] {
    animation: fade-in 150ms ease-out;
  }
}
```

### Common Patterns

```css
/* Fade in */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Slide in from right */
@keyframes slide-in-from-right {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Scale up */
@keyframes scale-up {
  from {
    transform: scale(0.95);
  }
  to {
    transform: scale(1);
  }
}
```

---

## Component Patterns

### Layout Components

```css
/* Page Layout */
.app-page-main {
  @apply p-6 max-w-[1600px];
}

.app-page-title {
  @apply text-2xl font-semibold text-(--foreground);
}

.app-page-subtitle {
  @apply mt-1 text-sm text-(--muted-foreground);
}
```

### Cards

```css
.app-stat-card {
  @apply rounded-xl border border-(--border) bg-(--card) p-5;
  @apply transition-all;
  @apply hover:shadow-sm hover:border-(--border)/80;
}

.app-stat-card-header {
  @apply mb-3 flex items-center justify-between;
}

.app-stat-card-value {
  @apply text-4xl font-bold text-(--card-foreground);
}
```

### Interactive Elements

```css
.app-button-primary {
  @apply rounded-md px-4 py-2 text-sm font-medium;
  @apply bg-blue-600 text-white;
  @apply transition-colors;
  @apply hover:bg-blue-700;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
  @apply disabled:opacity-50 disabled:pointer-events-none;
}
```

### Tables

```css
.app-table {
  @apply w-full;
}

.app-table-header {
  @apply border-b border-(--border) bg-(--muted);
}

.app-table-header-cell {
  @apply px-6 py-3 text-left text-xs font-medium uppercase tracking-wider;
  @apply text-(--muted-foreground);
}

.app-table-row {
  @apply transition-colors;
  @apply hover:bg-(--muted);
}

.app-table-cell {
  @apply px-6 py-4;
}
```

---

## Responsive Design

### Breakpoints

Tailwind v4 uses standard breakpoints:

```css
/* Mobile first */
.app-stats-grid {
  @apply grid gap-6;
  @apply sm:grid-cols-2; /* 640px+ */
  @apply lg:grid-cols-4; /* 1024px+ */
}
```

### Container Queries (Future)

Tailwind v4 will support container queries:

```css
.app-card {
  @apply @container;
}

.app-card-content {
  @apply text-sm;
  @apply @lg:text-base; /* When container is large */
}
```

---

## Dark Mode

### Theme Variables

Dark mode works via CSS custom properties:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: 224 71% 4%;
    --foreground: 213 31% 91%;
    --muted: 223 47% 11%;
    /* ... other tokens */
  }
}
```

All components automatically adapt because they use design tokens:

```css
/* Automatically works in dark mode */
.app-header {
  @apply bg-(--background);
  @apply text-(--foreground);
}
```

---

## Component Library Styles

UI components (buttons, inputs, etc.) have dedicated CSS files:

```
src/components/ui/button/
├── button.tsx
└── button.css
```

```css
/* button.css */
@reference "tailwindcss";

.button {
  @apply inline-flex items-center justify-center rounded-md text-sm font-medium;
  @apply ring-offset-background transition-colors;
  @apply focus-visible:outline-none focus-visible:ring-2;
  @apply disabled:pointer-events-none disabled:opacity-50;
}

.button-default {
  @apply bg-primary text-primary-foreground;
  @apply hover:bg-primary/90;
}

.button-outline {
  @apply border border-input bg-background;
  @apply hover:bg-accent hover:text-accent-foreground;
}
```

---

## Migration from Tailwind v3

### What Changed

| Tailwind v3          | Tailwind v4                | Action                 |
| -------------------- | -------------------------- | ---------------------- |
| `@tailwind base`     | `@reference "tailwindcss"` | Replace with reference |
| `animate-in fade-in` | Custom `@keyframes`        | Create animation       |
| `group/name`         | Direct nesting             | Remove group/peer      |
| `peer/name`          | CSS nesting                | Use `&` selector       |
| `space-x-4`          | `calc(1rem)`               | Use explicit values    |

### Example Migration

**Before (Tailwind v3)**:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

.group\/menu-button {
  @apply hover:bg-gray-100;
}

.peer-hover\/menu-button\:text-blue-600 {
  @apply text-blue-600;
}
```

**After (Tailwind v4)**:

```css
@reference "tailwindcss";

.menu-button {
  @apply hover:bg-(--muted);
}

.menu-action {
  .menu-button:hover ~ & {
    @apply text-blue-600;
  }
}
```

---

## Best Practices

### DO:

✅ Use semantic class names (`app-header-button`)
✅ Group related styles in dedicated CSS files
✅ Use design tokens for colors (`--foreground`)
✅ Create reusable component classes
✅ Use `@apply` for Tailwind utilities
✅ Document complex style decisions

### DON'T:

❌ Use inline utility classes in JSX
❌ Create one-off class names
❌ Hard-code colors (use tokens)
❌ Nest more than 3 levels deep
❌ Use `!important` (fix specificity instead)
❌ Mix CSS-first with utility-first approaches

---

## Examples

### Complete Component

```css
/* app-header.css */
@reference "tailwindcss";

.app-header {
  @apply sticky top-0 z-10 flex h-14 items-center justify-between px-4;
  @apply border-b border-(--border) bg-(--background);
}

.app-header-right {
  @apply flex items-center gap-2;
}

.app-header-icon-button {
  @apply flex h-8 w-8 items-center justify-center rounded-lg;
  @apply transition-colors;
  @apply hover:bg-(--muted);

  &:focus {
    @apply outline-none ring-2 ring-(--ring);
  }

  &:disabled {
    @apply opacity-50 pointer-events-none;
  }
}

.app-header-user-button {
  @apply flex items-center gap-2.5 rounded-lg px-2 py-1.5;
  @apply transition-colors;
  @apply hover:bg-(--muted);
}

.app-header-user-avatar {
  @apply flex h-8 w-8 items-center justify-center rounded-full overflow-hidden;
  @apply bg-(--muted);
}
```

### Using in Component

```tsx
// app-header.tsx
import "@/styles/app-header.css";

export function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header-right">
        <button className="app-header-icon-button">
          <BellIcon />
        </button>
        <button className="app-header-user-button">
          <div className="app-header-user-avatar">
            <img src={userImage} alt="User" />
          </div>
        </button>
      </div>
    </header>
  );
}
```

---

## Debugging

### Check Compiled Output

Tailwind v4 compiles CSS at build time. To see compiled output:

```bash
npm run build
# Check .next/static/css/app-*.css
```

### Common Issues

**Issue**: Styles not applying

- **Fix**: Ensure `@reference "tailwindcss"` is at top of file
- **Fix**: Check file is imported in component
- **Fix**: Verify class name matches CSS exactly

**Issue**: Design tokens not working

- **Fix**: Use syntax `bg-(--background)` not `bg-background`
- **Fix**: Check token is defined in theme

**Issue**: Hover states not working

- **Fix**: Use `&:hover` not `.class:hover` when nesting

---

## Tools & Workflow

### VS Code Extensions

- **Tailwind CSS IntelliSense** - Autocomplete for utilities
- **CSS Var Complete** - Autocomplete for CSS variables
- **PostCSS Language Support** - Syntax highlighting

### Linting

```bash
# Check for unused CSS
npm run css:lint

# Format CSS files
npm run css:format
```

---

## Related Documentation

- [Component Library](../guides/component-library.md)
- [Design System](../guides/design-system.md)
- [Theming](../guides/theming.md)
