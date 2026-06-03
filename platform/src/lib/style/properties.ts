/**
 * Style property registry — the single source of truth for the per-element
 * style system. Every supported CSS property is declared once here; the CSS
 * generator (`./generate`) and (later) the inspector UI both derive from it.
 *
 * Adding a property = one entry here. Values are stored as raw CSS strings
 * (e.g. "16px", "#fff", "center", "1px solid #ccc"), so units are first-class
 * and the surface scales without bespoke per-property code.
 */

export type StyleGroup =
  | 'layout'
  | 'spacing'
  | 'sizing'
  | 'position'
  | 'typography'
  | 'background'
  | 'border'
  | 'effects'
  | 'transform'
  | 'transition'

/** Hint for the future inspector UI; the generator only needs `css`. */
export type StyleControl =
  | 'length' // number + unit
  | 'color'
  | 'select'
  | 'number'
  | 'text' // raw CSS value
  | 'shadow'

export type StylePropDef = {
  /** Key stored in the style object. */
  key: string
  /** One or more CSS properties this expands to (axis/shorthand support). */
  css: string | string[]
  group: StyleGroup
  control: StyleControl
  label: string
  /** Allowed units for `length` controls (UI hint). */
  units?: string[]
  /** Allowed values for `select` controls (UI hint). */
  options?: string[]
}

const LENGTH_UNITS = ['px', 'rem', 'em', '%', 'vw', 'vh', 'auto']

export const STYLE_PROPS: StylePropDef[] = [
  // ── Layout ────────────────────────────────────────────────
  {
    key: 'display',
    css: 'display',
    group: 'layout',
    control: 'select',
    label: 'Display',
    options: ['block', 'inline-block', 'flex', 'inline-flex', 'grid', 'none'],
  },
  {
    key: 'flexDirection',
    css: 'flex-direction',
    group: 'layout',
    control: 'select',
    label: 'Direction',
    options: ['row', 'column', 'row-reverse', 'column-reverse'],
  },
  {
    key: 'justifyContent',
    css: 'justify-content',
    group: 'layout',
    control: 'select',
    label: 'Justify',
    options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
  },
  {
    key: 'alignItems',
    css: 'align-items',
    group: 'layout',
    control: 'select',
    label: 'Align items',
    options: ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'],
  },
  {
    key: 'flexWrap',
    css: 'flex-wrap',
    group: 'layout',
    control: 'select',
    label: 'Wrap',
    options: ['nowrap', 'wrap', 'wrap-reverse'],
  },
  { key: 'gap', css: 'gap', group: 'layout', control: 'length', label: 'Gap', units: LENGTH_UNITS },
  {
    key: 'gridTemplateColumns',
    css: 'grid-template-columns',
    group: 'layout',
    control: 'text',
    label: 'Grid columns',
  },

  // ── Sizing ────────────────────────────────────────────────
  {
    key: 'width',
    css: 'width',
    group: 'sizing',
    control: 'length',
    label: 'Width',
    units: LENGTH_UNITS,
  },
  {
    key: 'height',
    css: 'height',
    group: 'sizing',
    control: 'length',
    label: 'Height',
    units: LENGTH_UNITS,
  },
  {
    key: 'minWidth',
    css: 'min-width',
    group: 'sizing',
    control: 'length',
    label: 'Min width',
    units: LENGTH_UNITS,
  },
  {
    key: 'maxWidth',
    css: 'max-width',
    group: 'sizing',
    control: 'length',
    label: 'Max width',
    units: LENGTH_UNITS,
  },
  {
    key: 'minHeight',
    css: 'min-height',
    group: 'sizing',
    control: 'length',
    label: 'Min height',
    units: LENGTH_UNITS,
  },
  {
    key: 'maxHeight',
    css: 'max-height',
    group: 'sizing',
    control: 'length',
    label: 'Max height',
    units: LENGTH_UNITS,
  },

  // ── Spacing (per-side + axis + all) ───────────────────────
  {
    key: 'marginTop',
    css: 'margin-top',
    group: 'spacing',
    control: 'length',
    label: 'Margin top',
    units: LENGTH_UNITS,
  },
  {
    key: 'marginRight',
    css: 'margin-right',
    group: 'spacing',
    control: 'length',
    label: 'Margin right',
    units: LENGTH_UNITS,
  },
  {
    key: 'marginBottom',
    css: 'margin-bottom',
    group: 'spacing',
    control: 'length',
    label: 'Margin bottom',
    units: LENGTH_UNITS,
  },
  {
    key: 'marginLeft',
    css: 'margin-left',
    group: 'spacing',
    control: 'length',
    label: 'Margin left',
    units: LENGTH_UNITS,
  },
  {
    key: 'marginX',
    css: ['margin-left', 'margin-right'],
    group: 'spacing',
    control: 'length',
    label: 'Margin X',
    units: LENGTH_UNITS,
  },
  {
    key: 'marginY',
    css: ['margin-top', 'margin-bottom'],
    group: 'spacing',
    control: 'length',
    label: 'Margin Y',
    units: LENGTH_UNITS,
  },
  { key: 'margin', css: 'margin', group: 'spacing', control: 'text', label: 'Margin (all)' },
  {
    key: 'paddingTop',
    css: 'padding-top',
    group: 'spacing',
    control: 'length',
    label: 'Padding top',
    units: LENGTH_UNITS,
  },
  {
    key: 'paddingRight',
    css: 'padding-right',
    group: 'spacing',
    control: 'length',
    label: 'Padding right',
    units: LENGTH_UNITS,
  },
  {
    key: 'paddingBottom',
    css: 'padding-bottom',
    group: 'spacing',
    control: 'length',
    label: 'Padding bottom',
    units: LENGTH_UNITS,
  },
  {
    key: 'paddingLeft',
    css: 'padding-left',
    group: 'spacing',
    control: 'length',
    label: 'Padding left',
    units: LENGTH_UNITS,
  },
  {
    key: 'paddingX',
    css: ['padding-left', 'padding-right'],
    group: 'spacing',
    control: 'length',
    label: 'Padding X',
    units: LENGTH_UNITS,
  },
  {
    key: 'paddingY',
    css: ['padding-top', 'padding-bottom'],
    group: 'spacing',
    control: 'length',
    label: 'Padding Y',
    units: LENGTH_UNITS,
  },
  { key: 'padding', css: 'padding', group: 'spacing', control: 'text', label: 'Padding (all)' },

  // ── Position ──────────────────────────────────────────────
  {
    key: 'position',
    css: 'position',
    group: 'position',
    control: 'select',
    label: 'Position',
    options: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
  },
  {
    key: 'top',
    css: 'top',
    group: 'position',
    control: 'length',
    label: 'Top',
    units: LENGTH_UNITS,
  },
  {
    key: 'right',
    css: 'right',
    group: 'position',
    control: 'length',
    label: 'Right',
    units: LENGTH_UNITS,
  },
  {
    key: 'bottom',
    css: 'bottom',
    group: 'position',
    control: 'length',
    label: 'Bottom',
    units: LENGTH_UNITS,
  },
  {
    key: 'left',
    css: 'left',
    group: 'position',
    control: 'length',
    label: 'Left',
    units: LENGTH_UNITS,
  },
  { key: 'zIndex', css: 'z-index', group: 'position', control: 'number', label: 'Z-index' },

  // ── Typography ────────────────────────────────────────────
  { key: 'color', css: 'color', group: 'typography', control: 'color', label: 'Text color' },
  {
    key: 'fontFamily',
    css: 'font-family',
    group: 'typography',
    control: 'text',
    label: 'Font family',
  },
  {
    key: 'fontSize',
    css: 'font-size',
    group: 'typography',
    control: 'length',
    label: 'Font size',
    units: LENGTH_UNITS,
  },
  {
    key: 'fontWeight',
    css: 'font-weight',
    group: 'typography',
    control: 'select',
    label: 'Font weight',
    options: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  },
  {
    key: 'lineHeight',
    css: 'line-height',
    group: 'typography',
    control: 'text',
    label: 'Line height',
  },
  {
    key: 'letterSpacing',
    css: 'letter-spacing',
    group: 'typography',
    control: 'length',
    label: 'Letter spacing',
    units: ['px', 'em', 'rem'],
  },
  {
    key: 'textAlign',
    css: 'text-align',
    group: 'typography',
    control: 'select',
    label: 'Text align',
    options: ['left', 'center', 'right', 'justify'],
  },
  {
    key: 'textTransform',
    css: 'text-transform',
    group: 'typography',
    control: 'select',
    label: 'Transform',
    options: ['none', 'uppercase', 'lowercase', 'capitalize'],
  },
  {
    key: 'fontStyle',
    css: 'font-style',
    group: 'typography',
    control: 'select',
    label: 'Style',
    options: ['normal', 'italic'],
  },
  {
    key: 'textDecoration',
    css: 'text-decoration',
    group: 'typography',
    control: 'select',
    label: 'Decoration',
    options: ['none', 'underline', 'line-through'],
  },

  // ── Background ────────────────────────────────────────────
  {
    key: 'backgroundColor',
    css: 'background-color',
    group: 'background',
    control: 'color',
    label: 'Background',
  },
  {
    key: 'backgroundImage',
    css: 'background-image',
    group: 'background',
    control: 'text',
    label: 'Background image',
  },
  {
    key: 'backgroundSize',
    css: 'background-size',
    group: 'background',
    control: 'select',
    label: 'Background size',
    options: ['auto', 'cover', 'contain'],
  },
  {
    key: 'backgroundPosition',
    css: 'background-position',
    group: 'background',
    control: 'text',
    label: 'Background position',
  },
  {
    key: 'backgroundRepeat',
    css: 'background-repeat',
    group: 'background',
    control: 'select',
    label: 'Background repeat',
    options: ['no-repeat', 'repeat', 'repeat-x', 'repeat-y'],
  },

  // ── Border ────────────────────────────────────────────────
  {
    key: 'borderWidth',
    css: 'border-width',
    group: 'border',
    control: 'length',
    label: 'Border width',
    units: ['px', 'rem', 'em'],
  },
  {
    key: 'borderStyle',
    css: 'border-style',
    group: 'border',
    control: 'select',
    label: 'Border style',
    options: ['none', 'solid', 'dashed', 'dotted', 'double'],
  },
  {
    key: 'borderColor',
    css: 'border-color',
    group: 'border',
    control: 'color',
    label: 'Border color',
  },
  {
    key: 'borderRadius',
    css: 'border-radius',
    group: 'border',
    control: 'length',
    label: 'Radius',
    units: ['px', 'rem', '%'],
  },
  {
    key: 'borderTopLeftRadius',
    css: 'border-top-left-radius',
    group: 'border',
    control: 'length',
    label: 'Radius TL',
    units: ['px', 'rem', '%'],
  },
  {
    key: 'borderTopRightRadius',
    css: 'border-top-right-radius',
    group: 'border',
    control: 'length',
    label: 'Radius TR',
    units: ['px', 'rem', '%'],
  },
  {
    key: 'borderBottomRightRadius',
    css: 'border-bottom-right-radius',
    group: 'border',
    control: 'length',
    label: 'Radius BR',
    units: ['px', 'rem', '%'],
  },
  {
    key: 'borderBottomLeftRadius',
    css: 'border-bottom-left-radius',
    group: 'border',
    control: 'length',
    label: 'Radius BL',
    units: ['px', 'rem', '%'],
  },

  // ── Effects ───────────────────────────────────────────────
  { key: 'boxShadow', css: 'box-shadow', group: 'effects', control: 'shadow', label: 'Box shadow' },
  { key: 'opacity', css: 'opacity', group: 'effects', control: 'number', label: 'Opacity' },
  { key: 'filter', css: 'filter', group: 'effects', control: 'text', label: 'Filter' },
  {
    key: 'backdropFilter',
    css: 'backdrop-filter',
    group: 'effects',
    control: 'text',
    label: 'Backdrop filter',
  },
  {
    key: 'mixBlendMode',
    css: 'mix-blend-mode',
    group: 'effects',
    control: 'select',
    label: 'Blend mode',
    options: ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten'],
  },
  {
    key: 'overflow',
    css: 'overflow',
    group: 'effects',
    control: 'select',
    label: 'Overflow',
    options: ['visible', 'hidden', 'scroll', 'auto', 'clip'],
  },

  // ── Transform & transition ────────────────────────────────
  { key: 'transform', css: 'transform', group: 'transform', control: 'text', label: 'Transform' },
  {
    key: 'transformOrigin',
    css: 'transform-origin',
    group: 'transform',
    control: 'text',
    label: 'Transform origin',
  },
  {
    key: 'transition',
    css: 'transition',
    group: 'transition',
    control: 'text',
    label: 'Transition',
  },
]

export const STYLE_PROP_MAP: Record<string, StylePropDef> = Object.fromEntries(
  STYLE_PROPS.map((p) => [p.key, p]),
)

/** Property keys grouped, for building the inspector UI later. */
export const STYLE_GROUPS: StyleGroup[] = [
  'layout',
  'spacing',
  'sizing',
  'position',
  'typography',
  'background',
  'border',
  'effects',
  'transform',
  'transition',
]
