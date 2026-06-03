import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { PageView } from '@/components/page-view'
import { type BlockData } from '@/lib/generate-css'
import { getPageBySlug } from '@/lib/pages'
import { buildPageMetadata } from '@/lib/seo'
import { getSiteSettings } from '@/lib/site-settings'
import { resolveTenantByHost } from '@/lib/tenants'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const host = (await headers()).get('host')
  const tenant = await resolveTenantByHost(host)
  if (!tenant) return {}
  const [page, settings] = await Promise.all([
    getPageBySlug(slug, tenant.id),
    getSiteSettings(tenant.id),
  ])
  return buildPageMetadata({ page, settings, host, path: `/${slug}` })
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const host = (await headers()).get('host')
  const tenant = await resolveTenantByHost(host)
  if (!tenant) notFound()

  const page = await getPageBySlug(slug, tenant.id)
  if (!page) notFound()

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
