import type { CollectionConfig } from 'payload'

import { importImageUrls } from '../hooks/import-image-urls'

const opt = (v: string, label?: string) => ({ value: v, label: label ?? v })

/** Testimonials (parents, players, alumni, coaches) — tenant-scoped, rendered by
 *  the testimonials page wall + the homepage testimonials rail. */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'role', 'featured', 'order'],
    group: 'Content',
  },
  access: { read: () => true },
  hooks: {
    beforeChange: [importImageUrls([{ image: 'photo', url: 'imageUrl', alt: 'author' }])],
  },
  defaultSort: 'order',
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'author', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'Parent',
      options: [opt('Parent'), opt('Player'), opt('Alumnus'), opt('Coach')],
    },
    { name: 'context', type: 'text', admin: { description: 'e.g. "Parent of B2011 MLS NEXT".' } },
    {
      name: 'longform',
      type: 'textarea',
      admin: { description: 'Longer body for featured entries.' },
    },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'imageUrl',
      type: 'text',
      // Legacy/seed fallback; hidden so editors just use the Photo upload.
      admin: { hidden: true },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [opt('active', 'Active'), opt('archived', 'Archived')],
    },
    { name: 'order', type: 'number', defaultValue: 0 },
    {
      name: 'key',
      type: 'text',
      index: true,
      admin: { description: 'Stable source id for seeding.' },
    },
  ],
}
