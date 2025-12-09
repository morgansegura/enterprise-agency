# Navigation Styling Tokens Reference

This document lists all customizable navigation styling tokens for headers and footers.

## Desktop Navigation Links

### Typography

- `--nav-link-font-size` - Font size (default: 16px)
- `--nav-link-font-weight` - Font weight (default: 500)
- `--nav-link-line-height` - Line height (default: 1.5)

### Spacing

- `--nav-link-padding-x` - Horizontal padding (default: var(--spacing-4))
- `--nav-link-padding-y` - Vertical padding (default: var(--spacing-2))
- `--nav-link-gap` - Gap between nav items (default: var(--spacing-6))

### Colors - Default State

- `--nav-link-color` - Text color (default: var(--foreground))
- `--nav-link-bg` - Background color (default: transparent)

### Colors - Hover State

- `--nav-link-hover-color` - Hover text color (default: var(--primary))
- `--nav-link-hover-bg` - Hover background (default: var(--accent))

### Colors - Active State

- `--nav-link-active-color` - Active text color (default: var(--primary))
- `--nav-link-active-bg` - Active background (default: var(--accent))

### Borders - Default

- `--nav-link-border-width` - Border width (default: 0px)
- `--nav-link-border-color` - Border color (default: transparent)
- `--nav-link-border-radius` - Corner roundedness (default: var(--radius-sm))

### Borders - Hover

- `--nav-link-hover-border-width` - Hover border width (default: 0px)
- `--nav-link-hover-border-color` - Hover border color (default: transparent)

### Borders - Active

- `--nav-link-active-border-width` - Active border width (default: 0px)
- `--nav-link-active-border-color` - Active border color (default: var(--primary))

### Animations

- `--nav-link-transition-duration` - Transition time (default: 200ms)
- `--nav-link-transition-timing` - Easing function (default: ease-in-out)
- `--nav-link-hover-transform` - Transform on hover (default: none, e.g., "translateY(-2px)")

## Dropdown Menus

### Layout

- `--dropdown-width` - Dropdown width (default: 220px)
- `--dropdown-padding` - Internal padding (default: var(--spacing-2))
- `--dropdown-gap` - Gap between items (default: var(--spacing-1))

### Appearance

- `--dropdown-bg` - Background color (default: var(--popover))
- `--dropdown-border-width` - Border width (default: 1px)
- `--dropdown-border-color` - Border color (default: var(--border))
- `--dropdown-border-radius` - Corner roundedness (default: var(--radius-lg))
- `--dropdown-shadow` - Shadow (default: var(--shadow-lg))

### Dropdown Items

- `--dropdown-item-padding-x` - Item horizontal padding (default: var(--spacing-3))
- `--dropdown-item-padding-y` - Item vertical padding (default: var(--spacing-2))
- `--dropdown-item-border-radius` - Item roundedness (default: var(--radius-md))
- `--dropdown-item-color` - Item text color (default: var(--foreground))
- `--dropdown-item-hover-color` - Item hover text (default: var(--accent-foreground))
- `--dropdown-item-hover-bg` - Item hover background (default: var(--accent))

### Dropdown Animations

- `--dropdown-animation-duration` - Animation time (default: 200ms)
- `--dropdown-animation-timing` - Easing (default: ease-out)
- `--dropdown-slide-distance` - Slide distance (default: 8px)

## Mobile Navigation

### Mobile Drawer

- `--mobile-nav-width` - Drawer width (default: 280px)
- `--mobile-nav-bg` - Drawer background (default: var(--background))

### Mobile Nav Items

- `--mobile-nav-item-padding-x` - Item horizontal padding (default: var(--spacing-4))
- `--mobile-nav-item-padding-y` - Item vertical padding (default: var(--spacing-3))
- `--mobile-nav-item-gap` - Gap between items (default: var(--spacing-1))
- `--mobile-nav-item-border-radius` - Item roundedness (default: var(--radius-md))

### Mobile Nav Colors

- `--mobile-nav-item-color` - Text color (default: var(--foreground))
- `--mobile-nav-item-hover-color` - Hover text (default: var(--accent-foreground))
- `--mobile-nav-item-hover-bg` - Hover background (default: var(--accent))
- `--mobile-nav-item-active-color` - Active text (default: var(--primary))
- `--mobile-nav-item-active-bg` - Active background (default: var(--accent))

### Mobile Nav Submenu

- `--mobile-nav-submenu-indent` - Submenu indentation (default: var(--spacing-4))
- `--mobile-nav-submenu-border-color` - Left border color (default: var(--border))

## Footer Navigation

### Layout

- `--footer-nav-gap` - Gap between footer nav items (default: var(--spacing-2))

### Typography

- `--footer-nav-link-font-size` - Font size (default: 14px)
- `--footer-nav-link-font-weight` - Font weight (default: 400)

### Spacing

- `--footer-nav-link-padding-x` - Horizontal padding (default: var(--spacing-2))
- `--footer-nav-link-padding-y` - Vertical padding (default: var(--spacing-1))
- `--footer-nav-link-border-radius` - Roundedness (default: var(--radius-sm))

### Colors

- `--footer-nav-link-color` - Text color (default: var(--muted-foreground))
- `--footer-nav-link-bg` - Background (default: transparent)
- `--footer-nav-link-hover-color` - Hover text (default: var(--foreground))
- `--footer-nav-link-hover-bg` - Hover background (default: var(--accent))

### Animations

- `--footer-nav-link-transition-duration` - Transition time (default: 150ms)
- `--footer-nav-link-transition-timing` - Easing (default: ease-in-out)

## Example: Customizing Navigation

To customize navigation for a specific header, you can override these tokens in your header config (future feature) or globally in your theme.

```css
/* Example: Create a bold, colorful navigation */
:root {
  --nav-link-font-weight: 600;
  --nav-link-padding-x: var(--spacing-6);
  --nav-link-border-radius: var(--radius-lg);
  --nav-link-hover-bg: var(--primary);
  --nav-link-hover-color: white;
  --nav-link-hover-transform: translateY(-2px);
}
```

All navigation elements now automatically use these tokens, giving you complete control over the styling!
