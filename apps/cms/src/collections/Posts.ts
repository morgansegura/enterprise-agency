import type { CollectionConfig } from 'payload'

import { revalidatePosts, revalidatePostsAfterDelete } from '../hooks/revalidate-posts'
import { importImageUrls } from '../hooks/import-image-urls'
import { buildPreviewUrl } from '../lib/preview'
import { publicOrPreviewRead } from '../access/roles'

type PostPreviewDoc = {
  slug?: string
  tenant?: number | string | { id: number | string; domain?: string | null }
}

/** Blog posts → /blog and /blog/[slug] (Article schema + RSS). */
export const Posts: CollectionConfig = {
  slug: 'posts',
  versions: {
    // autosave drives the instant Live Preview update-as-you-type (like Pages).
    drafts: { schedulePublish: true, autosave: { interval: 800 } },
    maxPerDoc: 50,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedAt'],
    // Preview + Live Preview, like Pages — points at the blog route /news/<slug>.
    preview: (doc, { req }) =>
      buildPreviewUrl(
        `/news/${(doc as PostPreviewDoc).slug ?? ''}`,
        (doc as PostPreviewDoc).tenant,
        req,
      ),
    livePreview: {
      url: ({ data, req }) =>
        buildPreviewUrl(
          `/news/${(data as PostPreviewDoc).slug ?? ''}`,
          (data as PostPreviewDoc).tenant,
          req,
        ),
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  // Published posts are public; drafts require auth or the preview secret.
  access: { read: publicOrPreviewRead },
  indexes: [{ fields: ['tenant', 'slug'], unique: true }],
  hooks: {
    beforeChange: [
      importImageUrls([
        { image: 'coverImage', url: 'coverImageUrl', alt: 'title' },
        { image: 'image', url: 'imageUrl', alt: 'title' },
      ]),
    ],
    afterChange: [revalidatePosts],
    afterDelete: [revalidatePostsAfterDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'URL slug → /news/<slug>' },
    },
    { name: 'excerpt', type: 'textarea' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      name: 'coverImageUrl',
      type: 'text',
      // Legacy/seed fallback; hidden so editors just use the Cover Image upload.
      admin: { hidden: true },
    },
    { name: 'publishedAt', type: 'date' },
    { name: 'author', type: 'text' },
    { name: 'content', type: 'richText' },
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
          admin: { description: 'Overrides the post title in search/social.' },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Meta description (~155 chars). Falls back to excerpt.',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Social share image (1200×630). Falls back to cover.',
          },
        },
        {
          name: 'imageUrl',
          type: 'text',
          // Legacy/seed fallback; hidden so editors just use the Image upload.
          admin: { hidden: true },
        },
        {
          name: 'noindex',
          type: 'checkbox',
          label: 'Hide from search engines (noindex)',
          defaultValue: false,
          admin: {
            description:
              'When on, this post sends a noindex robots tag and is dropped from the sitemap.',
          },
        },
      ],
    },
  ],
}
