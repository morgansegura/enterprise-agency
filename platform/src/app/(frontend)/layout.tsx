import { headers } from 'next/headers'
import React from 'react'
import './styles.css'
import './blocks.css'

import { Analytics } from '@/components/analytics/analytics'
import { CookieBanner } from '@/components/cookie-consent/cookie-banner'
import { SiteHeader, type SiteSettingsData } from '@/components/layout/header'
import { SiteFooter } from '@/components/layout/footer'
import { JsonLd } from '@/components/seo/json-ld'
import { baseUrl } from '@/lib/seo'
import { getSiteSettings } from '@/lib/site-settings'
import { resolveTenantByHost } from '@/lib/tenants'

export const metadata = {
  title: 'Web & Funnel',
  description: 'Web & Funnel — agency platform.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const host = (await headers()).get('host')
  const tenant = await resolveTenantByHost(host)
  const settings = tenant ? await getSiteSettings(tenant.id) : null

  const base = baseUrl(host)
  const siteName = settings?.siteName ?? 'Web & Funnel'
  const logoUrl =
    settings?.logo && typeof settings.logo === 'object'
      ? settings.logo.url
      : undefined
  const sameAs = (settings?.seo?.sameAs ?? [])
    .map((s) => s.url)
    .filter((u): u is string => Boolean(u))

  const orgLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: base,
    ...(logoUrl ? { logo: `${base}${logoUrl}` } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  }
  const siteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: base,
  }

  return (
    <html lang="en">
      <body>
        <Analytics
          gtmId={settings?.analytics?.gtmId}
          ga4Id={settings?.analytics?.ga4Id}
        />
        <JsonLd data={orgLd} />
        <JsonLd data={siteLd} />
        <SiteHeader settings={settings as SiteSettingsData} />
        {children}
        <SiteFooter settings={settings as SiteSettingsData} />
        <CookieBanner />
      </body>
    </html>
  )
}
