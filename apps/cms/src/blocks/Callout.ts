import type { Block } from 'payload'

/** Callout — banner with heading + body + optional CTA. CMS half of `Callout`. */
export const CalloutBlock: Block = {
  slug: 'callout',
  labels: { singular: 'Callout', plural: 'Callouts' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'midnight',
      options: [
        { label: 'Midnight', value: 'midnight' },
        { label: 'Bone', value: 'bone' },
        { label: 'Gold', value: 'gold' },
        { label: 'Midnight Bright', value: 'midnight-bright' },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Call to action',
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
        { name: 'label', type: 'text' },
        {
          name: 'href',
          type: 'text',
          admin: { condition: (_data, sibling) => sibling?.kind !== 'evaluation' },
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
