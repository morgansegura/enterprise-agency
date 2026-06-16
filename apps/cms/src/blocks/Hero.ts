import type { Block } from 'payload'

/**
 * Hero — a slide-based hero carousel. One slide renders as a static hero;
 * multiple slides auto-advance. This is the CMS half of the FE `HeroCarousel`
 * feature module; the two share one shape (slide: image, eyebrow, heading,
 * tagline, cta).
 *
 * NOTE: slide `image` is a URL string for now so existing external images work
 * immediately. It becomes an `upload` → media picker (Cloudflare R2) in the
 * media pass.
 */
export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Slide', plural: 'Slides' },
      admin: {
        description: 'One slide = a static hero. Two or more = an auto-advancing carousel.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Slide background image — served from the media CDN.',
          },
        },
        {
          name: 'alt',
          type: 'text',
          admin: {
            description: "Optional alt override. Defaults to the media item's own alt text.",
          },
        },
        { name: 'eyebrow', type: 'text' },
        {
          name: 'heading',
          type: 'textarea',
          required: true,
          admin: { description: 'Line breaks become separate heading lines.' },
        },
        { name: 'tagline', type: 'textarea' },
        {
          name: 'cta',
          type: 'group',
          label: 'Call to action',
          fields: [
            {
              name: 'kind',
              type: 'select',
              defaultValue: 'none',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Link', value: 'link' },
                { label: 'Evaluation request', value: 'evaluation' },
              ],
            },
            {
              name: 'label',
              type: 'text',
              admin: {
                condition: (_, sibling) => sibling?.kind && sibling.kind !== 'none',
              },
            },
            {
              name: 'href',
              type: 'text',
              admin: {
                condition: (_, sibling) => sibling?.kind === 'link',
                description: 'e.g. /programs or #pathway',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'autoPlayDelay',
      type: 'number',
      defaultValue: 6500,
      admin: { description: 'Milliseconds between slides (carousel only).' },
    },
  ],
}
