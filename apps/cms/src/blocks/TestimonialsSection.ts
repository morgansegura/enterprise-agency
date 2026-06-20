import type { Block } from 'payload'

/**
 * Testimonials — heading + quote list. CMS half of the FE `Testimonials`
 * feature. Empty = the feature's built-in defaults.
 */
export const TestimonialsBlock: Block = {
  slug: 'testimonialsSection',
  labels: { singular: 'Testimonials', plural: 'Testimonials Sections' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'testimonials',
      type: 'array',
      labels: { singular: 'Testimonial', plural: 'Testimonials' },
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'author', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
