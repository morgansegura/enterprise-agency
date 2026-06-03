import type { CollectionConfig } from 'payload'

/**
 * People (coaches, administrators, team). Tenant-scoped structured content that
 * data-bound blocks (e.g. StaffDirectory) render on the live site — replacing
 * hand-coded `data/coaches.ts`-style files. `group` drives section/filtering.
 */
export const Staff: CollectionConfig = {
  slug: 'staff',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'group', 'order'],
    group: 'Content',
  },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', admin: { description: 'e.g. Head Coach' } },
    {
      name: 'group',
      type: 'text',
      index: true,
      admin: {
        description:
          'Section / filter label, e.g. "Coaching Staff" or "Administrators". Blocks can show one group or all.',
      },
    },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea' },
    { name: 'email', type: 'text' },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower numbers sort first.' },
    },
  ],
}
