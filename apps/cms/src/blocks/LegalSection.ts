import type { Block } from 'payload'

/**
 * Legal Section — a numbered section on a legal page (privacy/terms/cookie/link):
 * a heading + rich-text body. The FE `LegalLayout` renders these as the numbered
 * sections + table of contents, falling back to the hard-coded legal copy.
 */
export const LegalSectionBlock: Block = {
  slug: 'legalSection',
  labels: { singular: 'Legal Section', plural: 'Legal Sections' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'content', type: 'richText' },
  ],
}
