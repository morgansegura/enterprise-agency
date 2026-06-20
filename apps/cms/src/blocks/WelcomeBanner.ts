import type { Block } from 'payload'

/**
 * Welcome Banner — intro section (eyebrow + heading + body + framed image).
 * CMS half of the FE `WelcomeBanner` feature. Empty fields fall back to the
 * feature's built-in defaults, so a partially-filled block is safe.
 */
export const WelcomeBanner: Block = {
  slug: 'welcomeBanner',
  labels: { singular: 'Welcome Banner', plural: 'Welcome Banners' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'textarea' },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Framed image. Falls back to the default when empty.' },
    },
  ],
}
