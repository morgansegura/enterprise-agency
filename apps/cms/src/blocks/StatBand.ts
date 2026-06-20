import type { Block } from 'payload'

/** Stat Band — stats + highlights band. CMS half of the FE `StatBand`. */
export const StatBandBlock: Block = {
  slug: 'statBand',
  labels: { singular: 'Stat Band', plural: 'Stat Bands' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'midnight',
      options: [
        { label: 'Midnight', value: 'midnight' },
        { label: 'Bone', value: 'bone' },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      labels: { singular: 'Stat', plural: 'Stats' },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'highlights',
      type: 'array',
      labels: { singular: 'Highlight', plural: 'Highlights' },
      fields: [
        { name: 'tag', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
      ],
    },
    { name: 'footnote', type: 'textarea' },
  ],
}
