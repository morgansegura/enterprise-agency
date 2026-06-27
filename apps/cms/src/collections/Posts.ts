import type { CollectionConfig } from 'payload'

import { revalidatePosts, revalidatePostsAfterDelete } from '../hooks/revalidate-posts'
import { importImageUrls } from '../hooks/import-image-urls'

/** Blog posts → /blog and /blog/[slug] (Article schema + RSS). */
export const Posts: CollectionConfig = {
  slug: 'posts',
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 50 },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedAt'],
  },
  access: { read: () => true },
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
      admin: { description: 'URL slug → /blog/<slug>' },
    },
    { name: 'excerpt', type: 'textarea' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      name: 'coverImageUrl',
      type: 'text',
      admin: { description: 'External/asset image URL — used when no upload is set.' },
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
          admin: {
            description: 'Or an image URL — imported into Media on save.',
          },
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
