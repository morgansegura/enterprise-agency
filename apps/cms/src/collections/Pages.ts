import type { CollectionConfig, PayloadRequest } from 'payload'

import { Hero } from '../blocks/Hero'
import { Content } from '../blocks/Content'
import { RichTextBlock } from '../blocks/RichText'
import { CallToAction } from '../blocks/CallToAction'
import { Features } from '../blocks/Features'
import { ImageBlock } from '../blocks/Image'
import { revalidatePages, revalidatePagesAfterDelete } from '../hooks/revalidate-pages'

type PageDoc = {
  slug?: string
  tenant?: number | string | { id: number | string; domain?: string | null }
}

/**
 * Front-end preview URL for a page — resolved PER TENANT (one CMS, many sites).
 * The frontend base comes from the page's tenant `domain` in prod; locally it's
 * the dev FE. Hits the FE's `/api/preview` with a shared secret token.
 */
async function previewUrl(doc: PageDoc | undefined, req: PayloadRequest): Promise<string> {
  const secret = process.env.PREVIEW_SECRET || 'preview-dev'
  const path = doc?.slug && doc.slug !== 'home' ? `/${doc.slug}` : '/'

  let base = (process.env.FRONTEND_URL || 'http://localhost:4011').replace(/\/+$/, '')
  if (process.env.NODE_ENV === 'production') {
    let domain: string | null | undefined
    const t = doc?.tenant
    if (t && typeof t === 'object') domain = t.domain
    else if (t != null) {
      const tenant = await req.payload.findByID({ collection: 'tenants', id: t })
      domain = (tenant as { domain?: string | null })?.domain
    }
    if (domain) base = `https://${domain.replace(/^https?:\/\//, '').replace(/\/+$/, '')}`
  }

  return `${base}/api/preview?secret=${encodeURIComponent(secret)}&path=${encodeURIComponent(path)}`
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  versions: { drafts: true, maxPerDoc: 100 },
  admin: {
    useAsTitle: 'title',
    // "Preview" button (opens the draft in a tab) + Live Preview (in-editor iframe).
    preview: (doc, { req }) => previewUrl(doc as PageDoc, req),
    livePreview: {
      url: ({ data, req }) => previewUrl(data as PageDoc, req),
    },
  },
  access: { read: () => true },
  hooks: {
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
      blocks: [Hero, Content, RichTextBlock, CallToAction, Features, ImageBlock],
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
