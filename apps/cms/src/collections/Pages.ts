import type { CollectionConfig, PayloadRequest } from 'payload'

import { Hero } from '../blocks/Hero'
import { PageHeroBlock } from '../blocks/PageHero'
import { HeadingSectionBlock } from '../blocks/HeadingSection'
import { WelcomeBanner } from '../blocks/WelcomeBanner'
import { FaqSectionBlock } from '../blocks/FaqSection'
import { TestimonialsBlock } from '../blocks/TestimonialsSection'
import { MediaSplit } from '../blocks/MediaSplit'
import { IconCardsBlock } from '../blocks/IconCards'
import { CalloutBlock } from '../blocks/Callout'
import { StatBandBlock } from '../blocks/StatBand'
import { PortraitGridBlock } from '../blocks/PortraitGrid'
import { Content } from '../blocks/Content'
import { RichTextBlock } from '../blocks/RichText'
import { CallToAction } from '../blocks/CallToAction'
import { Features } from '../blocks/Features'
import { ImageBlock } from '../blocks/Image'
import { revalidatePages, revalidatePagesAfterDelete } from '../hooks/revalidate-pages'
import { importBlockImageUrls } from '../hooks/import-image-urls'

type PageDoc = {
  slug?: string
  tenant?: number | string | { id: number | string; domain?: string | null }
}

/**
 * A real public host (not localhost / loopback), or null if the value is a
 * dev-only host like `cvfc.localhost`. Lets the live CMS ignore a dev domain
 * stored on the tenant and fall back to FRONTEND_URL instead.
 */
function publicHost(domain?: string | null): string | null {
  if (!domain) return null
  const host = domain.replace(/^https?:\/\//, '').replace(/\/+$/, '')
  if (
    !host ||
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.startsWith('127.') ||
    host.startsWith('0.0.0.0')
  ) {
    return null
  }
  return host
}

/**
 * Front-end preview URL for a page — resolved PER TENANT (one CMS, many sites).
 * Prod uses the tenant's public `domain`; if that's a dev host (e.g.
 * `cvfc.localhost`) it falls back to `FRONTEND_URL` so a single Render env var
 * can point live preview at the live FE. Dev uses `FRONTEND_URL` or localhost.
 * Hits the FE's `/api/preview` with a shared secret token.
 */
async function previewUrl(doc: PageDoc | undefined, req: PayloadRequest): Promise<string> {
  const secret = process.env.PREVIEW_SECRET || 'preview-dev'
  const path = doc?.slug && doc.slug !== 'home' ? `/${doc.slug}` : '/'
  const envBase = process.env.FRONTEND_URL?.replace(/\/+$/, '')

  let base = envBase || 'http://localhost:4011'
  if (process.env.NODE_ENV === 'production') {
    let domain: string | null | undefined
    const t = doc?.tenant
    if (t && typeof t === 'object') domain = t.domain
    else if (t != null) {
      const tenant = await req.payload.findByID({ collection: 'tenants', id: t })
      domain = (tenant as { domain?: string | null })?.domain
    }
    const host = publicHost(domain)
    if (host) base = `https://${host}`
    else if (envBase) base = envBase
  }

  return `${base}/api/preview?secret=${encodeURIComponent(secret)}&path=${encodeURIComponent(path)}`
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  versions: {
    drafts: { schedulePublish: true, autosave: { interval: 800 } },
    maxPerDoc: 100,
  },
  admin: {
    useAsTitle: 'title',
    // "Preview" button (opens the draft in a tab) + Live Preview (in-editor iframe).
    preview: (doc, { req }) => previewUrl(doc as PageDoc, req),
    livePreview: {
      url: ({ data, req }) => previewUrl(data as PageDoc, req),
      // Device presets for the preview toolbar (adds Mobile/Tablet/Desktop next to
      // the freeform "Responsive" mode). One click instead of typing dimensions.
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  access: { read: () => true },
  hooks: {
    beforeChange: [importBlockImageUrls],
    afterChange: [revalidatePages],
    afterDelete: [revalidatePagesAfterDelete],
  },
  // Slug is unique PER TENANT (each tenant can have its own "home"), not globally.
  indexes: [{ fields: ['tenant', 'slug'], unique: true }],
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'URL path, e.g. "home" or "about".' },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        Hero,
        PageHeroBlock,
        HeadingSectionBlock,
        WelcomeBanner,
        FaqSectionBlock,
        TestimonialsBlock,
        MediaSplit,
        IconCardsBlock,
        CalloutBlock,
        StatBandBlock,
        PortraitGridBlock,
        Content,
        RichTextBlock,
        CallToAction,
        Features,
        ImageBlock,
      ],
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'seoHealth',
          type: 'ui',
          admin: {
            components: {
              Field: '@/components/admin/seo-health#SeoHealthField',
            },
          },
        },
        {
          name: 'title',
          type: 'text',
          admin: { description: 'Overrides the page title in search/social.' },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: { description: 'Meta description (~155 chars).' },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Social share image (1200×630).' },
        },
        {
          name: 'noindex',
          type: 'checkbox',
          label: 'Hide from search engines (noindex)',
          defaultValue: false,
          admin: {
            description:
              'When on, this page sends a noindex robots tag and is dropped from the sitemap.',
          },
        },
      ],
    },
  ],
}
