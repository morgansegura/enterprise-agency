import Link from 'next/link'

import { isExternalLink } from '@/lib/links'

type MenuItem = { label?: string | null; href?: string | null }
type MenuRef = { items?: MenuItem[] | null } | number | string | null

export type SiteSettingsData = {
  siteName?: string | null
  logo?: { url?: string | null; alt?: string | null } | number | string | null
  headerMenu?: MenuRef
  footerMenu?: MenuRef
  footerText?: string | null
} | null

export function menuItems(ref?: MenuRef): MenuItem[] {
  return ref && typeof ref === 'object' && 'items' in ref ? (ref.items ?? []) : []
}

export function SiteHeader({ settings }: { settings: SiteSettingsData }) {
  if (!settings) return null
  const logo =
    settings.logo && typeof settings.logo === 'object' ? settings.logo : null
  const nav = menuItems(settings.headerMenu)
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="site-brand" href="/">
          {logo?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="site-logo"
              src={logo.url}
              alt={logo.alt ?? settings.siteName ?? ''}
            />
          ) : (
            <span className="site-name">{settings.siteName}</span>
          )}
        </Link>
        {nav.length ? (
          <nav className="site-nav">
            {nav.map((l, i) => {
              const href = l.href ?? '#'
              return isExternalLink(href) ? (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.label}
                </a>
              ) : (
                <Link key={i} href={href}>
                  {l.label}
                </Link>
              )
            })}
          </nav>
        ) : null}
      </div>
    </header>
  )
}
