import type { CollectionConfig } from 'payload'

import {
  revalidatePosts,
  revalidatePostsAfterDelete,
} from '../hooks/revalidate-posts'

/** Blog posts → /blog and /blog/[slug] (Article schema + RSS). */
export const Posts: CollectionConfig = {
  slug: 'posts',
  versions: { drafts: true, maxPerDoc: 50 },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedAt'],
  },
  access: { read: () => true },
  indexes: [{ fields: ['tenant', 'slug'], unique: true }],
  hooks: {
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
    { name: 'publishedAt', type: 'date' },
    { name: 'author', type: 'text' },
    { name: 'content', type: 'richText' },
  ],
}
