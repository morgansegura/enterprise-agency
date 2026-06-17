import type { CollectionConfig } from 'payload'

const target = {
  name: 'target',
  type: 'select' as const,
  defaultValue: '',
  options: [
    { label: 'Same tab', value: '' },
    { label: 'New tab', value: '_blank' },
  ],
}

/**
 * Reusable navigation menus (per tenant), referenced by header + footer via
 * SiteSettings. Supports one level of nesting: top-level `items` (with an
 * optional `heading` for footer columns / `description` for header dropdowns)
 * each holding optional `children`. Mirrors the FE `TMenuItem` shape.
 */
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
        { name: 'label', type: 'text' },
        {
          name: 'heading',
          type: 'text',
          admin: {
            description: 'Footer column heading (leave blank for plain links).',
          },
        },
        { name: 'href', type: 'text', admin: { description: 'e.g. /programs' } },
        {
          name: 'description',
          type: 'text',
          admin: { description: 'Sub-text shown in header dropdowns.' },
        },
        target,
        {
          name: 'children',
          type: 'array',
          labels: { singular: 'Sub-item', plural: 'Sub-items' },
          admin: { description: 'Dropdown links / footer column links.' },
          fields: [
            { name: 'label', type: 'text' },
            { name: 'href', type: 'text' },
            { name: 'description', type: 'text' },
            target,
          ],
        },
      ],
    },
  ],
}
