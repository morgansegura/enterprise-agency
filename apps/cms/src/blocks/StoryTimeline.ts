import type { Block } from 'payload'

/** Story Timeline — the club's history as a scroll-animated timeline. CMS half
 *  of the FE `StoryTimeline`. Each entry is a milestone year with copy + photo. */
export const StoryTimelineBlock: Block = {
  slug: 'storyTimeline',
  labels: { singular: 'Story Timeline', plural: 'Story Timelines' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'entries',
      type: 'array',
      labels: { singular: 'Milestone', plural: 'Milestones' },
      admin: { description: 'Ordered oldest → newest. Drag to reorder.' },
      fields: [
        {
          name: 'year',
          type: 'text',
          required: true,
          admin: {
            description: 'Year or range label, e.g. "1982", "2013–14", "Today".',
          },
        },
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'imageUrl',
          type: 'text',
          admin: { hidden: true },
        },
      ],
    },
  ],
}
