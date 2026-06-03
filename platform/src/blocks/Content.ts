import type { Block } from 'payload'

export const Content: Block = {
  slug: 'content',
  labels: { singular: 'Content', plural: 'Content' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'textarea' },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
      ],
    },
  ],
}
