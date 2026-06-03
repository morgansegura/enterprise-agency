/**
 * Generate scoped CSS for per-element Puck styles. Walks the Puck content tree
 * (recursing into slot content like Columns) and delegates each element's
 * `props.style` to the registry-driven style engine (`./style/*`). Style values
 * are raw CSS (with units); base + hover/focus + tablet/mobile are all handled
 * by the engine. Keeps published output clean (no inline styles); injected once
 * by PageView and live in the builder canvas.
 */
import { appendElementCss, assembleCss, emptyBuckets, type StyleMap } from '@/lib/style/generate'

type PuckItem = { type?: unknown; props?: Record<string, unknown> }

function isItemArray(v: unknown): v is PuckItem[] {
  return (
    Array.isArray(v) &&
    v.length > 0 &&
    v.every((x) => x && typeof (x as PuckItem).type === 'string')
  )
}

function walk(items: PuckItem[], out: ReturnType<typeof emptyBuckets>): void {
  for (const item of items) {
    const props = item?.props
    const id = props?.id
    if (props && typeof id === 'string') {
      const style = (props.style ?? {}) as StyleMap
      appendElementCss(`.block[data-el="${id}"]`, style, out)
    }
    // Recurse into slot content (props that are arrays of components).
    if (props) {
      for (const v of Object.values(props)) {
        if (isItemArray(v)) walk(v, out)
      }
    }
  }
}

export function generatePuckCSS(content: PuckItem[] | undefined): string {
  if (!Array.isArray(content)) return ''
  const out = emptyBuckets()
  walk(content, out)
  return assembleCss(out)
}
