import type { Metadata } from 'next'

type ImageRef = number | { url?: string | null } | string | null | undefined
type PageMeta = {
  title?: string | null
  description?: string | null
  image?: ImageRef
}
type PageLike = { title?: string | null; meta?: PageMeta | null } | null
type SettingsLike = {
  siteName?: string | null
  seo?: {
    metaDescription?: string | null
    ogImage?: ImageRef
    twitter?: string | null
  } | null
} | null

export function baseUrl(host: string | null): string {
  if (!host) return ''
  const proto = host.includes('localhost') ? 'http' : 'https'
  return `${proto}://${host}`
}

function imgUrl(ref: ImageRef): string | undefined {
  return ref && typeof ref === 'object' ? (ref.url ?? undefined) : undefined
}

/** Per-page Metadata (title/description/canonical/OG/Twitter) with tenant SEO defaults. */
export function buildPageMetadata({
  page,
  settings,
  host,
  path,
}: {
  page: PageLike
  settings: SettingsLike
  host: string | null
  path: string
}): Metadata {
  const siteName = settings?.siteName?.trim() || 'Web & Funnel'
  const meta = page?.meta ?? null
  const baseTitle = meta?.title?.trim() || page?.title?.trim() || siteName
  const title = baseTitle === siteName ? siteName : `${baseTitle} | ${siteName}`
  const description =
    meta?.description?.trim() ||
    settings?.seo?.metaDescription?.trim() ||
    undefined
  const base = baseUrl(host)
  const url = `${base}${path}`
  const rawImg = imgUrl(meta?.image) || imgUrl(settings?.seo?.ogImage)
  const image = rawImg
    ? rawImg.startsWith('http')
      ? rawImg
      : `${base}${rawImg}`
    : `${base}/og?title=${encodeURIComponent(baseTitle)}`
  const twitterSite = settings?.seo?.twitter?.trim() || undefined

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: 'website',
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: twitterSite,
      images: image ? [image] : undefined,
    },
  }
}
