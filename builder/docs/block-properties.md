# Block, Section & Container Properties

Reference for all element properties, their current defaults, and the target clean-slate values.

**Architecture:**
- `null` = not set, no data-attribute rendered, inherits from theme/browser
- Explicit value = user set it (or Figma import / theme applied it)
- Theme provides defaults via CSS custom properties (`--heading-default-size`, etc.)

---

## Section

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| width | `full` \| `container` \| `narrow` \| `wide` | `"container"` | `null` | `--section-default-width` | |
| paddingTop | Spacing scale | `"lg"` | `null` | `--section-default-padding-y` | |
| paddingBottom | Spacing scale | `"lg"` | `null` | `--section-default-padding-y` | |
| paddingY | Spacing scale | — | `null` | `--section-default-padding-y` | Shorthand for top+bottom |
| marginTop | Spacing scale | — | `null` | — | |
| marginBottom | Spacing scale | — | `null` | — | |
| gapY | Spacing scale | — | `null` | `--section-default-gap` | Gap between containers |
| background | preset \| color \| gradient \| image | — | `null` | `--section-default-background` | |
| align | `left` \| `center` \| `right` | — | `null` | — | |
| borderTop | `none` \| `thin` \| `medium` \| `thick` | — | `null` | — | |
| borderBottom | same | — | `null` | — | |
| borderLeft | same | — | `null` | — | |
| borderRight | same | — | `null` | — | |
| borderRadius | `none` \| `sm` \| `md` \| `lg` \| `xl` \| `full` | — | `null` | — | |
| shadow | `none` \| `sm` \| `md` \| `lg` \| `xl` \| `inner` | — | `null` | — | |
| minHeight | `none` \| `sm` \| `md` \| `lg` \| `xl` \| `screen` | — | `null` | — | |
| verticalAlign | `top` \| `center` \| `bottom` | — | `null` | — | Only when minHeight set |
| overflowX | `visible` \| `hidden` \| `scroll` \| `auto` | — | `null` | — | |
| overflowY | same | — | `null` | — | |

**Creation defaults file:** `builder/lib/hooks/use-page-editor.ts` → `createDefaultSection()`

---

## Container

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| layout.type | `stack` \| `flex` \| `grid` | `"stack"` | `null` | `--container-default-layout` | |
| layout.gap | Spacing scale | `"md"` | `null` | `--container-default-gap` | |
| layout.direction | `row` \| `column` | — | `null` | — | Flex only |
| layout.wrap | boolean | — | `null` | — | Flex only |
| layout.columns | `1`-`6` \| `auto-fit` | — | `null` | — | Grid only |
| layout.rows | string | — | `null` | — | Grid only |
| layout.justify | `start` \| `center` \| `end` \| `between` \| `around` | — | `null` | — | |
| layout.align | `start` \| `center` \| `end` \| `stretch` \| `baseline` | — | `null` | — | |
| paddingX | Spacing scale | `"md"` | `null` | `--container-default-padding-x` | |
| paddingY | Spacing scale | — | `null` | `--container-default-padding-y` | |
| maxWidth | `none` \| `xs` \| `sm` \| `md` \| `lg` \| `xl` \| `full` | — | `null` | — | |
| minHeight | `none` \| `sm` \| `md` \| `lg` \| `xl` | — | `null` | — | |
| border | `none` \| `thin` \| `medium` \| `thick` | — | `null` | — | All sides |
| borderTop | same | — | `null` | — | |
| borderBottom | same | — | `null` | — | |
| borderLeft | same | — | `null` | — | |
| borderRight | same | — | `null` | — | |
| borderRadius | `none` \| `sm` \| `md` \| `lg` \| `xl` \| `full` | — | `null` | — | |
| shadow | `none` \| `sm` \| `md` \| `lg` \| `xl` | — | `null` | — | |
| align | `left` \| `center` \| `right` | — | `null` | — | |
| verticalAlign | `top` \| `center` \| `bottom` | — | `null` | — | |
| background | color string | — | `null` | — | |

**Creation defaults file:** `builder/lib/hooks/use-page-editor.ts` → `createDefaultContainer()`

---

## Blocks

### heading-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| text | string | `"Heading"` | `"Heading"` | — | Content, keep |
| level | `h1`-`h6` | `"h2"` | `"h2"` | — | Structural, keep |
| size | Heading scale | `"2xl"` | `null` | `--heading-default-size` | |
| align | `left` \| `center` \| `right` | `"left"` | `null` | — | |
| weight | Font weight | `"semibold"` | `null` | `--heading-default-weight` | |
| color | Color preset | `"default"` | `null` | — | `"default"` blocks inheritance |

### text-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| text | string | `"Your text here"` | `"Your text here"` | — | Content, keep |
| size | Text scale | `"md"` | `null` | `--text-default-size` | |
| align | alignment | `"left"` | `null` | — | |
| variant | `body` \| `muted` \| etc. | `"body"` | `null` | — | |

### rich-text-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| html | string | `"<p>Start typing...</p>"` | `"<p>Start typing...</p>"` | — | Content, keep |
| size | Text scale | `"md"` | `null` | `--text-default-size` | |
| align | alignment | `"left"` | `null` | — | |

### button-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| text | string | `"Click me"` | `"Click me"` | — | Content, keep |
| href | string | `"#"` | `"#"` | — | Content, keep |
| variant | `default` \| `outline` \| `ghost` \| etc. | `"default"` | `null` | `--button-default-variant` | |
| size | `sm` \| `default` \| `lg` | `"default"` | `null` | `--button-default-size` | |
| fullWidth | boolean | `false` | `false` | — | Structural, keep |
| openInNewTab | boolean | `false` | `false` | — | Structural, keep |

### image-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| src | string | `""` | `""` | — | Content |
| alt | string | `""` | `""` | — | Content |
| aspectRatio | ratio string | `"16/9"` | `null` | `--image-default-aspect-ratio` | |
| objectFit | `cover` \| `contain` \| etc. | `"cover"` | `null` | `--image-default-fit` | |
| rounded | boolean | `false` | `false` | — | |

### card-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| title | string | `"Card Title"` | `"Card Title"` | — | Content, keep |
| description | string | `"Card description..."` | `"Card description..."` | — | Content, keep |
| variant | `default` \| etc. | `"default"` | `null` | `--card-default-variant` | |
| padding | Spacing scale | `"md"` | `null` | `--card-default-padding` | |

### divider-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| style | `solid` \| `dashed` \| `dotted` | `"solid"` | `null` | `--divider-default-style` | |
| thickness | `thin` \| `medium` \| `thick` | `"thin"` | `null` | `--divider-default-thickness` | |
| spacing | Spacing scale | `"md"` | `null` | `--divider-default-spacing` | |
| color | Color preset | `"default"` | `null` | — | |

### spacer-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| height | Spacing scale | `"md"` | `null` | `--spacer-default-height` | |

### icon-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| icon | string (Lucide name) | `"Star"` | `"Star"` | — | Content, keep |
| size | Size scale | `"md"` | `null` | `--icon-default-size` | |
| color | Color preset | `"default"` | `null` | — | |
| align | alignment | `"center"` | `null` | — | |

### quote-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| text | string | `"Insert your quote..."` | `"Insert your quote..."` | — | Content, keep |
| size | Size scale | `"md"` | `null` | `--quote-default-size` | |
| align | alignment | `"left"` | `null` | — | |
| variant | `default` \| etc. | `"default"` | `null` | — | |

### list-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| items | array | 3 items | 3 items | — | Content, keep |
| ordered | boolean | `false` | `false` | — | Structural, keep |
| style | `default` \| etc. | `"default"` | `null` | — | |
| spacing | `comfortable` \| etc. | `"comfortable"` | `null` | `--list-default-spacing` | |

### video-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| url | string | `""` | `""` | — | Content |
| provider | `youtube` \| `vimeo` \| etc. | `"youtube"` | `"youtube"` | — | Structural, keep |
| aspectRatio | ratio string | `"16/9"` | `null` | — | |
| controls | boolean | `true` | `true` | — | Structural, keep |
| autoplay | boolean | `false` | `false` | — | Structural, keep |
| muted | boolean | `false` | `false` | — | Structural, keep |
| loop | boolean | `false` | `false` | — | Structural, keep |

### audio-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| src | string | `""` | `""` | — | Content |
| controls | boolean | `true` | `true` | — | Structural, keep |
| autoplay | boolean | `false` | `false` | — | Structural, keep |
| loop | boolean | `false` | `false` | — | Structural, keep |

### embed-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| html | string | `""` | `""` | — | Content |
| aspectRatio | ratio string | `"16/9"` | `null` | — | |

### accordion-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| items | array | 2 items | 2 items | — | Content, keep |
| allowMultiple | boolean | `false` | `false` | — | Structural, keep |
| variant | `default` \| etc. | `"default"` | `null` | `--accordion-default-variant` | |

### tabs-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| tabs | array | 2 tabs | 2 tabs | — | Content, keep |
| defaultTab | number | `0` | `0` | — | Structural, keep |
| variant | `default` \| etc. | `"default"` | `null` | `--tabs-default-variant` | |

### logo-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| src | string | `""` | `""` | — | Content |
| alt | string | `"Logo"` | `"Logo"` | — | Content, keep |
| size | Size scale | `"md"` | `null` | — | |
| align | alignment | `"left"` | `null` | — | |

### map-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| center | lat/lng | NYC coords | NYC coords | — | Content, keep |
| zoom | number | `12` | `12` | — | Structural, keep |
| height | Size scale | `"md"` | `null` | — | |
| style | `default` \| etc. | `"default"` | `null` | — | |

### stats-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| stats | array | 3 items | 3 items | — | Content, keep |
| layout | `horizontal` \| `vertical` | `"horizontal"` | `null` | — | |
| variant | `default` \| etc. | `"default"` | `null` | — | |

### hero-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| heading | string | placeholder | placeholder | — | Content, keep |
| subheading | string | placeholder | placeholder | — | Content, keep |
| layout | `centered` \| `split` \| etc. | `"centered"` | `null` | — | |
| size | Size scale | `"lg"` | `null` | — | |
| align | alignment | `"center"` | `null` | — | |

### cta-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| heading | string | placeholder | placeholder | — | Content, keep |
| description | string | placeholder | placeholder | — | Content, keep |
| primaryCta | object | `{ text, href }` | `{ text, href }` | — | Content, keep |
| variant | `default` \| etc. | `"default"` | `null` | — | |
| align | alignment | `"center"` | `null` | — | |

### testimonial-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| testimonials | array | 1 item | 1 item | — | Content, keep |
| layout | `grid` \| `carousel` | `"grid"` | `null` | — | |
| columns | number | `2` | `null` | — | |
| variant | `card` \| etc. | `"card"` | `null` | — | |
| showRating | boolean | `true` | `true` | — | Structural, keep |

### pricing-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| tiers | array | 2 tiers | 2 tiers | — | Content, keep |
| variant | `default` \| etc. | `"default"` | `null` | — | |

### team-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| members | array | 1 member | 1 member | — | Content, keep |
| columns | number | `3` | `null` | — | |
| variant | `card` \| etc. | `"card"` | `null` | — | |
| showBio | boolean | `false` | `false` | — | Structural, keep |
| showSocial | boolean | `false` | `false` | — | Structural, keep |

### logo-bar-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| logos | array | `[]` | `[]` | — | Content |
| variant | `grayscale` \| etc. | `"grayscale"` | `null` | — | |
| size | Size scale | `"md"` | `null` | — | |

### contact-form-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| heading | string | placeholder | placeholder | — | Content, keep |
| description | string | placeholder | placeholder | — | Content, keep |
| fields | array | 3 fields | 3 fields | — | Content, keep |
| submitText | string | `"Send Message"` | `"Send Message"` | — | Content, keep |

### newsletter-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| heading | string | placeholder | placeholder | — | Content, keep |
| description | string | placeholder | placeholder | — | Content, keep |
| placeholder | string | `"Enter your email"` | `"Enter your email"` | — | Content, keep |
| buttonText | string | `"Subscribe"` | `"Subscribe"` | — | Content, keep |
| variant | `inline` \| etc. | `"inline"` | `null` | — | |

### feature-grid-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| heading | string | placeholder | placeholder | — | Content, keep |
| description | string | placeholder | placeholder | — | Content, keep |
| features | array | 3 items | 3 items | — | Content, keep |
| columns | number | `3` | `null` | — | |
| variant | `card` \| etc. | `"card"` | `null` | — | |

### social-links-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| links | array | 3 links | 3 links | — | Content, keep |
| size | Size scale | `"md"` | `null` | — | |
| variant | `default` \| etc. | `"default"` | `null` | — | |
| align | alignment | `"center"` | `null` | — | |

### faq-block

| Property | Type | Current Default | Clean Slate | Theme Variable | Notes |
|----------|------|----------------|-------------|----------------|-------|
| heading | string | placeholder | placeholder | — | Content, keep |
| description | string | placeholder | placeholder | — | Content, keep |
| items | array | 3 items | 3 items | — | Content, keep |

---

## Key Principle

**Content defaults KEEP:** text, placeholder content, structural items, boolean flags
**Visual defaults → `null`:** size, variant, color, align, spacing, padding, weight, layout

When `null`, the renderer outputs no data-attribute. The theme CSS custom property provides the visual default. When no theme is set, the CSS fallback value applies (sensible browser default).
