import type { Block } from 'payload'

/**
 * A time-boxed program season (e.g. Mini Maestros). The frontend hides the
 * whole block once `endDate` passes and drops the early-bird fact once
 * `earlyBirdDeadline` passes — so a finished season disappears on its own
 * instead of relying on someone remembering to unpublish it.
 */
export const SeasonalProgram: Block = {
  slug: 'seasonalProgram',
  labels: { singular: 'Seasonal Program', plural: 'Seasonal Programs' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: { description: 'Small label above the heading, e.g. "Mini Maestros · Fall 2026".' },
    },
    { name: 'heading', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
        },
        {
          name: 'endDate',
          type: 'date',
          required: true,
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayOnly' },
            description: 'After this date the block stops rendering on the site.',
          },
        },
      ],
    },
    {
      name: 'datelineNote',
      type: 'text',
      admin: { description: 'Small gold line above the dates, e.g. "Labor Day weekend break".' },
    },
    {
      name: 'facts',
      type: 'array',
      maxRows: 3,
      admin: {
        description: 'Keep values SHORT — they render at display size. e.g. "6 weeks", "Ages 4–9".',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'earlyBirdPrice',
          type: 'text',
          admin: {
            width: '50%',
            description: 'e.g. "$95". Shown as an extra fact while early bird is open.',
          },
        },
        {
          name: 'earlyBirdDeadline',
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    {
      name: 'divisions',
      type: 'array',
      labels: { singular: 'Division', plural: 'Divisions' },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'birthYears',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "Born 2021–2022".' },
        },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      labels: { singular: 'Detail list', plural: 'Detail lists' },
      admin: { description: 'Schedule, venues, what is included, how to register…' },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'items',
          type: 'array',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    { name: 'footnote', type: 'text' },
    {
      name: 'cta',
      type: 'group',
      label: 'Call to action',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
        { name: 'newTab', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
