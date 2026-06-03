import type { CollectionConfig } from 'payload'

/** Reusable navigation menus (per tenant). Referenced by header + footer. */
export const Menus: CollectionConfig = {
  slug: 'menus',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Internal name, e.g. "Main Nav" or "Footer".' },
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Item', plural: 'Items' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
  ],
}
