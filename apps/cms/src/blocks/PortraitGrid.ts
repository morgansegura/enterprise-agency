import type { Block } from 'payload'

/** Portrait Grid — people grid (coaches/staff). CMS half of `PortraitGrid`. */
export const PortraitGridBlock: Block = {
  slug: 'portraitGrid',
  labels: { singular: 'Portrait Grid', plural: 'Portrait Grids' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'bone',
      options: [
        { label: 'Bone', value: 'bone' },
        { label: 'White', value: 'white' },
      ],
    },
    {
      name: 'people',
      type: 'array',
      labels: { singular: 'Person', plural: 'People' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'credential', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Call to action',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'secondary',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
          ],
        },
        { name: 'iconToken', type: 'text' },
      ],
    },
  ],
}
