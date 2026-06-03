/**
 * Per-tenant theming. A tenant's brand (colors + fonts) is emitted as CSS
 * variable overrides scoped to `.page`, overriding the platform defaults in
 * blocks.css. Same blocks + different tenant theme = different-looking sites.
 */
export type TenantTheme =
  | {
      primary?: string | null
      primaryForeground?: string | null
      secondary?: string | null
      secondaryForeground?: string | null
      background?: string | null
      foreground?: string | null
      muted?: string | null
      headingFont?: string | null
      bodyFont?: string | null
      /** Arbitrary component-token overrides, e.g. { name: 'staff-photo-size',
       *  value: '6rem' } → `--staff-photo-size:6rem` on `.page`. Lets a tenant
       *  fine-tune any component token without forking the component. */
      tokens?: Array<{ name?: string | null; value?: string | null }> | null
    }
  | null
  | undefined

const COLOR_VARS: Record<string, string> = {
  primary: '--primary',
  primaryForeground: '--primary-foreground',
  secondary: '--secondary',
  secondaryForeground: '--secondary-foreground',
  background: '--background',
  foreground: '--foreground',
  muted: '--muted',
}

export function generateThemeCSS(theme: TenantTheme): string {
  if (!theme) return ''
  const decls: string[] = []
  const t = theme as Record<string, unknown>
  for (const [key, varName] of Object.entries(COLOR_VARS)) {
    const val = t[key]
    if (typeof val === 'string' && val.trim()) {
      decls.push(`${varName}:${val.trim()}`)
    }
  }
  if (theme.bodyFont?.trim()) {
    decls.push(`--font-body:'${theme.bodyFont.trim()}',ui-sans-serif,system-ui,sans-serif`)
  }
  if (theme.headingFont?.trim()) {
    decls.push(`--font-heading:'${theme.headingFont.trim()}',var(--font-body)`)
  }

  // Arbitrary component-token overrides (e.g. --staff-photo-size, --hero-overlay).
  // Name sanitized to a CSS-ident; value stripped of braces so it can't break
  // out of the rule. This is the per-tenant "fine-tune any component" mechanism.
  const tokens = (theme as { tokens?: unknown }).tokens
  if (Array.isArray(tokens)) {
    for (const tk of tokens) {
      const rawName = typeof tk?.name === 'string' ? tk.name.trim() : ''
      const rawVal = typeof tk?.value === 'string' ? tk.value.trim() : ''
      if (!rawName || !rawVal) continue
      const name = rawName.replace(/^--/, '').replace(/[^a-zA-Z0-9-]/g, '')
      if (!name) continue
      const val = rawVal.replace(/[{}]/g, '')
      decls.push(`--${name}:${val}`)
    }
  }

  return decls.length ? `.page{${decls.join(';')}}` : ''
}

export function googleFontsHref(theme: TenantTheme): string | null {
  if (!theme) return null
  const families = [theme.headingFont, theme.bodyFont]
    .filter((f): f is string => typeof f === 'string' && f.trim().length > 0)
    .map((f) => f.trim())
  const unique = [...new Set(families)]
  if (!unique.length) return null
  const params = unique
    .map((f) => `family=${encodeURIComponent(f)}:wght@400;500;600;700;800`)
    .join('&')
  return `https://fonts.googleapis.com/css2?${params}&display=swap`
}
