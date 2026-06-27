import type { CollectionConfig } from 'payload'

import { importImageUrls } from '../hooks/import-image-urls'

/** Example data collection: products with detail pages at /products/[slug]. */
export const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  hooks: {
    beforeChange: [importImageUrls([{ image: 'image', url: 'imageUrl', alt: 'name' }])],
  },
  // Slug unique per tenant (like Pages).
  indexes: [{ fields: ['tenant', 'slug'], unique: true }],
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'URL slug → /products/<slug>' },
    },
    { name: 'price', type: 'number' },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'imageUrl',
      type: 'text',
      admin: { description: 'Or an image URL — imported into Media on save.' },
    },
  ],
}
