/**
 * Minimal scoped-CSS generator — the spike proof of the token-CSS pipeline.
 * Block data → CSS rules keyed by `.b-<id>`, referencing theme tokens (vars
 * vendored from @enterprise/tokens in blocks.css). Phase 1+ replaces this with
 * the ported @enterprise/tokens generatePageCSS.
 */
export type BlockData = {
  id?: string | null
  blockType?: string
  align?: string | null
  background?: string | null
  [key: string]: unknown
}

export function generatePageCSS(blocks: BlockData[]): string {
  const rules: string[] = []
  for (const b of blocks) {
    if (!b?.id) continue
    const decl: string[] = []
    if (b.align) decl.push(`text-align:${b.align}`)
    if (b.background === 'muted') decl.push('background:var(--muted)')
    if (b.background === 'brand') {
      decl.push('background:var(--primary)', 'color:var(--primary-foreground)')
    }
    if (decl.length) rules.push(`.b-${b.id}{${decl.join(';')}}`)
  }
  return rules.join('\n')
}
