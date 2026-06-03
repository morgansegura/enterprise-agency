/**
 * Registry-driven CSS generation for per-element styles. Reads raw CSS values
 * from a style object and emits scoped declarations, covering base + states
 * (hover/focus) + breakpoints (tablet/mobile). Knows nothing property-specific
 * — it just looks each key up in the property registry, so the surface scales
 * by editing `./properties`, not this file.
 */
import { STYLE_PROP_MAP } from './properties'

/** Reserved keys on a style object that hold nested state/breakpoint maps. */
const RESERVED = new Set(['hover', 'focus', 'tablet', 'mobile'])

export type StyleMap = Record<string, unknown>

function isMap(v: unknown): v is StyleMap {
  return Boolean(v) && typeof v === 'object' && !Array.isArray(v)
}

/** Turn a flat {key: cssValue} map into CSS declarations via the registry. */
export function serializeDecls(props: StyleMap): string[] {
  const decls: string[] = []
  for (const [key, raw] of Object.entries(props)) {
    if (RESERVED.has(key)) continue
    const def = STYLE_PROP_MAP[key]
    if (!def || raw == null) continue
    const value = String(raw).trim()
    if (!value) continue
    const cssProps = Array.isArray(def.css) ? def.css : [def.css]
    for (const p of cssProps) decls.push(`${p}:${value}`)
  }
  return decls
}

export type StyleBuckets = { base: string[]; tablet: string[]; mobile: string[] }

export function emptyBuckets(): StyleBuckets {
  return { base: [], tablet: [], mobile: [] }
}

function rule(selector: string, decls: string[]): string | null {
  return decls.length ? `${selector}{${decls.join(';')}}` : null
}

/**
 * Append every rule for one element's style object to the buckets. Base + state
 * selectors go to `base`; breakpoint overrides go to `tablet`/`mobile` (wrapped
 * in container queries by the caller).
 */
export function appendElementCss(selector: string, style: StyleMap, out: StyleBuckets): void {
  const base = rule(selector, serializeDecls(style))
  if (base) out.base.push(base)

  if (isMap(style.hover)) {
    const r = rule(`${selector}:hover`, serializeDecls(style.hover))
    if (r) out.base.push(r)
  }
  if (isMap(style.focus)) {
    const r = rule(`${selector}:focus-visible`, serializeDecls(style.focus))
    if (r) out.base.push(r)
  }
  if (isMap(style.tablet)) {
    const r = rule(selector, serializeDecls(style.tablet))
    if (r) out.tablet.push(r)
  }
  if (isMap(style.mobile)) {
    const r = rule(selector, serializeDecls(style.mobile))
    if (r) out.mobile.push(r)
  }
}

/** Assemble buckets into a stylesheet. Breakpoints use container queries
 *  (against `.page`) so they track the page width in both the live site and
 *  the builder canvas. Tablet before mobile so the narrower wins at ≤480. */
export function assembleCss(out: StyleBuckets): string {
  const css = [...out.base]
  if (out.tablet.length) {
    css.push(`@container page (max-width:768px){${out.tablet.join('')}}`)
  }
  if (out.mobile.length) {
    css.push(`@container page (max-width:480px){${out.mobile.join('')}}`)
  }
  return css.join('\n')
}
