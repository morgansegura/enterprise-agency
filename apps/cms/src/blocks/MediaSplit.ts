import type { Block } from 'payload'

/**
 * Media Split — image + content side-by-side. CMS half of the FE `MediaSplit`
 * feature. Repeats on a page (e.g. the pathway sections), so it's rendered in
 * layout order by the FE <Blocks> renderer, not by block-type lookup.
 */
export const MediaSplit: Block = {
  slug: 'mediaSplit',
  labels: { singular: 'Media Split', plural: 'Media Splits' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Served from the media CDN. Takes priority over Image URL.' },
    },
    {
      name: 'imageUrl',
      type: 'text',
      admin: {
        description:
          'External image URL — used when no upload is set (migration/seed). Prefer an upload for new content.',
      },
    },
    { name: 'imageAlt', type: 'text' },
    {
      name: 'tags',
      type: 'array',
      labels: { singular: 'Tag', plural: 'Tags' },
      fields: [{ name: 'label', type: 'text', required: true }],
    },
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
      name: 'reverse',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Flip image/content sides.' },
    },
    {
      name: 'buttons',
      type: 'array',
      labels: { singular: 'Button', plural: 'Buttons' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
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
