import type { Block } from 'payload'

/**
 * Page Hero — eyebrow + heading + description + actions. CMS half of the FE
 * `PageHero` feature. One per inner page (the top band on about/programs/etc.).
 */
export const PageHeroBlock: Block = {
  slug: 'pageHero',
  labels: { singular: 'Page Hero', plural: 'Page Heroes' },
  fields: [
    { name: 'eyebrow', type: 'text', required: true },
    { name: 'heading', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Bone', value: 'bone' },
      ],
    },
    {
      name: 'actions',
      type: 'array',
      labels: { singular: 'Action', plural: 'Actions' },
      fields: [
        {
          name: 'kind',
          type: 'select',
          defaultValue: 'link',
          options: [
            { label: 'Link', value: 'link' },
            { label: 'Evaluation Modal', value: 'evaluation' },
          ],
        },
        { name: 'label', type: 'text', required: true },
        {
          name: 'href',
          type: 'text',
          admin: {
            condition: (_data, sibling) => sibling?.kind !== 'evaluation',
            description: 'Destination URL (for Link actions).',
          },
        },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'default',
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
