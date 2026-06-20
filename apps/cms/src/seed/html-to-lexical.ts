/**
 * Minimal HTML → Lexical (Payload richText) converter for seeding existing
 * HTML article bodies into the Posts collection. Handles the block tags the
 * cvfc news uses (h1–h3, p, ul/ol/li) and inline bold/italic; links are kept as
 * plain text. Best-effort migration — the org can refine in the CMS editor.
 */

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
  '&rsquo;': '’',
  '&lsquo;': '‘',
  '&rdquo;': '”',
  '&ldquo;': '“',
  '&mdash;': '—',
  '&ndash;': '–',
  '&hellip;': '…',
}

function decode(s: string): string {
  return s.replace(/&[a-z#0-9]+;/gi, (m) => ENTITIES[m] ?? m)
}

type TextNode = {
  type: 'text'
  detail: number
  format: number
  mode: 'normal'
  style: string
  text: string
  version: number
}

function text(t: string, format = 0): TextNode {
  return { type: 'text', detail: 0, format, mode: 'normal', style: '', text: t, version: 1 }
}

/** Parse an inline HTML fragment into Lexical text nodes (bold=1, italic=2). */
function inline(html: string): TextNode[] {
  const cleaned = html.replace(/<a\b[^>]*>/gi, '').replace(/<\/a>/gi, '')
  const nodes: TextNode[] = []
  let format = 0
  const re = /<(\/?)(strong|b|em|i)\b[^>]*>|([^<]+)/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(cleaned))) {
    if (m[3] != null) {
      const t = decode(m[3]).replace(/\s+/g, ' ')
      if (t.trim() || nodes.length) nodes.push(text(t, format))
    } else {
      const bit = m[2].toLowerCase() === 'strong' || m[2].toLowerCase() === 'b' ? 1 : 2
      format = m[1] === '/' ? format & ~bit : format | bit
    }
  }
  return nodes.length ? nodes : [text('')]
}

const block = (type: string, extra: Record<string, unknown>, children: unknown[]) => ({
  type,
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  ...extra,
  children,
})

/** Convert an HTML string into a Lexical editor state object for a richText field. */
export function htmlToLexical(html: string) {
  const children: unknown[] = []
  const re = /<(h1|h2|h3|p|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    const tag = m[1].toLowerCase()
    const inner = m[2]
    if (tag === 'ul' || tag === 'ol') {
      const items: unknown[] = []
      const li = /<li\b[^>]*>([\s\S]*?)<\/li>/gi
      let lm: RegExpExecArray | null
      let i = 1
      while ((lm = li.exec(inner))) {
        items.push(block('listitem', { value: i++, checked: undefined }, inline(lm[1])))
      }
      if (items.length) {
        children.push(
          block('list', { listType: tag === 'ol' ? 'number' : 'bullet', start: 1, tag }, items),
        )
      }
    } else if (tag === 'p') {
      const nodes = inline(inner)
      if (nodes.some((n) => n.text.trim())) {
        children.push(block('paragraph', { textFormat: 0 }, nodes))
      }
    } else {
      children.push(block('heading', { tag }, inline(inner)))
    }
  }
  if (!children.length) {
    children.push(
      block('paragraph', { textFormat: 0 }, [text(decode(html.replace(/<[^>]+>/g, ' ')).trim())]),
    )
  }
  return {
    root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children },
  }
}
