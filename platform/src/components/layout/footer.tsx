import Link from 'next/link'

import { isExternalLink } from '@/lib/links'

import { menuItems, type SiteSettingsData } from './header'

export function SiteFooter({ settings }: { settings: SiteSettingsData }) {
  if (!settings) return null
  const links = menuItems(settings.footerMenu)
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        {settings.footerText ? (
          <p className="site-footer-text">{settings.footerText}</p>
        ) : null}
        {links.length ? (
          <nav className="site-footer-nav">
            {links.map((l, i) => {
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
    </footer>
  )
}
