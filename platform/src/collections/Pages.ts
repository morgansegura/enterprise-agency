import type { CollectionConfig } from 'payload'

import { Hero } from '../blocks/Hero'
import { Content } from '../blocks/Content'
import { RichTextBlock } from '../blocks/RichText'
import { CallToAction } from '../blocks/CallToAction'
import { Features } from '../blocks/Features'
import { ImageBlock } from '../blocks/Image'
import {
  revalidatePages,
  revalidatePagesAfterDelete,
} from '../hooks/revalidate-pages'

export const Pages: CollectionConfig = {
  slug: 'pages',
  versions: { drafts: true, maxPerDoc: 100 },
  admin: { useAsTitle: 'title' },
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
      name: 'editInBuilder',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: {
            path: '@/components/admin/edit-in-builder#EditInBuilderButton',
          },
        },
      },
    },
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
      name: 'puckData',
      type: 'json',
      admin: {
        description:
          'Visual builder (Puck) layout. When set, it renders instead of the blocks above. Edit at /builder/<id>.',
      },
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
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
      ],
    },
  ],
}
