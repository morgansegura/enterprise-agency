import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { getProductBySlug } from '@/lib/products'
import { buildPageMetadata } from '@/lib/seo'
import { getSiteSettings } from '@/lib/site-settings'
import { resolveTenantByHost } from '@/lib/tenants'

type ProductView = {
  name?: string
  price?: number | null
  description?: string | null
  image?: { url?: string | null; alt?: string | null } | number | string | null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const host = (await headers()).get('host')
  const tenant = await resolveTenantByHost(host)
  if (!tenant) return {}
  const [product, settings] = await Promise.all([
    getProductBySlug(slug, tenant.id),
    getSiteSettings(tenant.id),
  ])
  if (!product) return {}
  const p = product as ProductView
  return buildPageMetadata({
    page: { title: p.name, meta: { description: p.description } },
    settings,
    host,
    path: `/products/${slug}`,
  })
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const host = (await headers()).get('host')
  const tenant = await resolveTenantByHost(host)
  if (!tenant) notFound()

  const product = await getProductBySlug(slug, tenant.id)
  if (!product) notFound()

  const p = product as ProductView
  const img = p.image && typeof p.image === 'object' ? p.image : null

  return (
    <main className="page">
      <section className="block product-detail">
        {img?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="product-detail-img"
            src={img.url}
            alt={img.alt ?? p.name ?? ''}
          />
        ) : null}
        <div className="product-detail-body">
          <h1 className="hero-heading">{p.name}</h1>
          {typeof p.price === 'number' ? (
            <p className="product-detail-price">${p.price}</p>
          ) : null}
          {p.description ? <p className="content-body">{p.description}</p> : null}
        </div>
      </section>
    </main>
  )
}
