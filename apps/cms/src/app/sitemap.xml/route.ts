import { headers } from 'next/headers'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { baseUrl } from '@/lib/seo'
import { resolveTenantByHost } from '@/lib/tenants'

/** Per-tenant sitemap.xml (pages + products + blog posts). */
export async function GET() {
  const host = (await headers()).get('host')
  const tenant = await resolveTenantByHost(host)
  const base = baseUrl(host)
  const urls = new Set<string>([
    `${base}/`,
    `${base}/products`,
    `${base}/blog`,
  ])

  if (tenant) {
    const payload = await getPayload({ config: await config })
    const tid = tenant.id
    const [pages, products, posts] = await Promise.all([
      payload.find({
        collection: 'pages',
        where: {
          and: [
            { tenant: { equals: tid } },
            { _status: { equals: 'published' } },
          ],
        },
        limit: 1000,
        pagination: false,
        select: { slug: true },
      }),
      payload.find({
        collection: 'products',
        where: { tenant: { equals: tid } },
        limit: 1000,
        pagination: false,
        select: { slug: true },
      }),
      payload.find({
        collection: 'posts',
        where: {
          and: [
            { tenant: { equals: tid } },
            { _status: { equals: 'published' } },
          ],
        },
        limit: 1000,
        pagination: false,
        select: { slug: true },
      }),
    ])
    pages.docs.forEach((p) => urls.add(`${base}/${p.slug}`))
    products.docs.forEach((p) => urls.add(`${base}/products/${p.slug}`))
    posts.docs.forEach((p) => urls.add(`${base}/blog/${p.slug}`))
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls].map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
