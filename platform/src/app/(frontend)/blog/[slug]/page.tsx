import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'

import { JsonLd } from '@/components/seo/json-ld'
import { getPostBySlug } from '@/lib/posts'
import { baseUrl, buildPageMetadata } from '@/lib/seo'
import { getSiteSettings } from '@/lib/site-settings'
import { resolveTenantByHost } from '@/lib/tenants'

type PostView = {
  title?: string
  excerpt?: string
  publishedAt?: string
  author?: string
  content?: unknown
  coverImage?: { url?: string; alt?: string } | number | string | null
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
  const [post, settings] = await Promise.all([
    getPostBySlug(slug, tenant.id),
    getSiteSettings(tenant.id),
  ])
  if (!post) return {}
  const p = post as PostView
  return buildPageMetadata({
    page: { title: p.title, meta: { description: p.excerpt, image: p.coverImage } },
    settings,
    host,
    path: `/blog/${slug}`,
  })
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const host = (await headers()).get('host')
  const tenant = await resolveTenantByHost(host)
  if (!tenant) notFound()

  const post = await getPostBySlug(slug, tenant.id)
  if (!post) notFound()

  const p = post as PostView
  const img = p.coverImage && typeof p.coverImage === 'object' ? p.coverImage : null
  const base = baseUrl(host)
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    ...(p.publishedAt ? { datePublished: p.publishedAt } : {}),
    ...(p.author ? { author: { '@type': 'Person', name: p.author } } : {}),
    ...(img?.url ? { image: `${base}${img.url}` } : {}),
  }

  return (
    <main className="page">
      <article className="block post">
        {img?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="post-cover" src={img.url} alt={img.alt ?? p.title ?? ''} />
        ) : null}
        <h1 className="hero-heading">{p.title}</h1>
        <p className="post-meta">
          {p.author ? `By ${p.author}` : ''}
          {p.publishedAt
            ? `${p.author ? ' · ' : ''}${new Date(p.publishedAt).toLocaleDateString()}`
            : ''}
        </p>
        {p.content ? (
          <div className="richtext">
            <RichText
              data={p.content as React.ComponentProps<typeof RichText>['data']}
            />
          </div>
        ) : null}
        <JsonLd data={ld} />
      </article>
    </main>
  )
}
