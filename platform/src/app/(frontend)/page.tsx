import type { Metadata } from 'next'
import { headers } from 'next/headers'

import { PageView } from '@/components/page-view'
import { type BlockData } from '@/lib/generate-css'
import { getPageBySlug } from '@/lib/pages'
import { buildPageMetadata } from '@/lib/seo'
import { getSiteSettings } from '@/lib/site-settings'
import { resolveTenantByHost } from '@/lib/tenants'

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get('host')
  const tenant = await resolveTenantByHost(host)
  if (!tenant) return {}
  const [page, settings] = await Promise.all([
    getPageBySlug('home', tenant.id),
    getSiteSettings(tenant.id),
  ])
  return buildPageMetadata({ page, settings, host, path: '/' })
}

export default async function HomePage() {
  const host = (await headers()).get('host')
  const tenant = await resolveTenantByHost(host)
  const page = tenant ? await getPageBySlug('home', tenant.id) : null

  if (!page) {
    return (
      <main className="page">
        <section className="block">
          <h1 className="hero-heading">No home page yet</h1>
          <p className="hero-sub">
            {tenant
              ? `Create a Page with slug “home” for “${tenant.name}”.`
              : 'No tenant matches this domain — add one in the admin (Tenants → domain).'}
          </p>
        </section>
      </main>
    )
  }

  const layout = ((page as { layout?: unknown }).layout ?? []) as BlockData[]
  return (
    <PageView
      layout={layout}
      theme={tenant.theme}
      tenantId={tenant.id}
      puckData={(page as { puckData?: unknown }).puckData}
    />
  )
}
