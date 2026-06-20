import type { Block } from 'payload'

/**
 * FAQ Section — heading + Q&A list. CMS half of the FE `FaqSection` feature.
 * Empty = the feature's built-in FAQ defaults; add entries here to override.
 */
export const FaqSectionBlock: Block = {
  slug: 'faqSection',
  labels: { singular: 'FAQ Section', plural: 'FAQ Sections' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'entries',
      type: 'array',
      labels: { singular: 'Q&A', plural: 'Q&As' },
      admin: { description: 'Highest-intent questions first.' },
      fields: [
        { name: 'category', type: 'text' },
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    { name: 'ctaLabel', type: 'text' },
    { name: 'ctaHref', type: 'text', admin: { description: 'e.g. /faq' } },
  ],
}
