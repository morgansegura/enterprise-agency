import type { CollectionConfig } from 'payload'

import { importImageUrls } from '../hooks/import-image-urls'

const opt = (v: string, label?: string) => ({ value: v, label: label ?? v })

/** Facilities (training grounds + community parks) — tenant-scoped, rendered by
 *  the facilities page (featured → media-split rows, park → field grid). */
export const Facilities: CollectionConfig = {
  slug: 'facilities',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tier', 'order'],
    group: 'Content',
  },
  access: { read: () => true },
  hooks: {
    beforeChange: [importImageUrls([{ image: 'photo', url: 'imageUrl', alt: 'name' }])],
  },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'tier',
      type: 'select',
      defaultValue: 'featured',
      options: [opt('featured', 'Featured'), opt('park', 'Park')],
      admin: { description: 'Featured → media-split row; Park → compact grid card.' },
    },
    { name: 'role', type: 'text', admin: { description: 'Source role tag.' } },
    { name: 'roleLabel', type: 'text', admin: { description: 'e.g. "Primary Training Ground".' } },
    {
      name: 'address',
      type: 'group',
      fields: [
        { name: 'street', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'state', type: 'text' },
        { name: 'zip', type: 'text' },
      ],
    },
    { name: 'description', type: 'textarea' },
    { name: 'uses', type: 'text', hasMany: true },
    { name: 'features', type: 'text', hasMany: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'imageUrl',
      type: 'text',
      admin: { description: 'External image URL — used when no upload.' },
    },
    { name: 'mapsUrl', type: 'text' },
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
