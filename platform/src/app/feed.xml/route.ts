import { headers } from 'next/headers'

import { getPosts } from '@/lib/posts'
import { baseUrl } from '@/lib/seo'
import { getSiteSettings } from '@/lib/site-settings'
import { resolveTenantByHost } from '@/lib/tenants'

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

type FeedPost = {
  title?: string
  slug?: string
  excerpt?: string
  publishedAt?: string
}

/** Per-tenant RSS 2.0 feed of published blog posts. */
export async function GET() {
  const host = (await headers()).get('host')
  const tenant = await resolveTenantByHost(host)
  const posts = (tenant ? await getPosts(tenant.id) : []) as FeedPost[]
  const settings = tenant ? await getSiteSettings(tenant.id) : null
  const base = baseUrl(host)
  const title = settings?.siteName || 'Blog'

  const items = posts
    .map(
      (p) => `
    <item>
      <title>${esc(p.title ?? '')}</title>
      <link>${base}/blog/${p.slug}</link>
      <guid>${base}/blog/${p.slug}</guid>${
        p.excerpt ? `\n      <description>${esc(p.excerpt)}</description>` : ''
      }${
        p.publishedAt
          ? `\n      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>`
          : ''
      }
    </item>`,
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(title)}</title>
    <link>${base}/blog</link>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
