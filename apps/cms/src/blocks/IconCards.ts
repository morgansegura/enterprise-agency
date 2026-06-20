import type { Block } from 'payload'

const CTA = {
  name: 'cta',
  type: 'group' as const,
  label: 'Call to action',
  fields: [
    { name: 'label', type: 'text' as const },
    { name: 'href', type: 'text' as const },
    {
      name: 'variant',
      type: 'select' as const,
      defaultValue: 'secondary',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
      ],
    },
    { name: 'iconToken', type: 'text' as const },
  ],
}

/** Icon Cards — eyebrow/heading + a grid of cards. CMS half of `IconCards`. */
export const IconCardsBlock: Block = {
  slug: 'iconCards',
  labels: { singular: 'Icon Cards', plural: 'Icon Card Sections' },
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
      name: 'cards',
      type: 'array',
      labels: { singular: 'Card', plural: 'Cards' },
      fields: [
        { name: 'iconToken', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'href', type: 'text' },
      ],
    },
    CTA,
  ],
}
