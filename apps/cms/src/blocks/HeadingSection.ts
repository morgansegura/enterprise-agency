import type { Block } from 'payload'

/**
 * Heading Section — a centered eyebrow + heading + multi-paragraph body inside a
 * Section. CMS half of the FE `Section` + `Heading` pair (the most common prose
 * block). Body paragraphs are separated by a blank line; rich WYSIWYG (bold,
 * links) is a tracked upgrade.
 */
export const HeadingSectionBlock: Block = {
  slug: 'headingSection',
  labels: { singular: 'Heading Section', plural: 'Heading Sections' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    {
      name: 'body',
      type: 'textarea',
      admin: { description: 'Separate paragraphs with a blank line.' },
    },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'bone',
      options: [
        { label: 'Bone', value: 'bone' },
        { label: 'White', value: 'white' },
        { label: 'Transparent', value: 'transparent' },
        { label: 'Midnight', value: 'midnight' },
      ],
    },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Compact', value: 'compact' },
        { label: 'Default', value: 'default' },
        { label: 'Loose', value: 'loose' },
      ],
    },
    {
      name: 'headingSize',
      type: 'select',
      defaultValue: 'section',
      options: [
        { label: 'Display', value: 'display' },
        { label: 'Section', value: 'section' },
        { label: 'Compact', value: 'compact' },
      ],
    },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Center', value: 'center' },
        { label: 'Left', value: 'left' },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Call to action (optional)',
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
