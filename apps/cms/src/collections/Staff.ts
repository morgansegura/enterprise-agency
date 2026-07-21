import type { CollectionConfig } from 'payload'
import { tenantScopedRead } from '../access/tenant-read'

import { importImageUrls } from '../hooks/import-image-urls'

const opt = (v: string, label?: string) => ({ value: v, label: label ?? v })

/**
 * People (coaches + administrators). Tenant-scoped structured content that the
 * data-bound directory features render on the live site — the single source of
 * truth replacing hand-coded `data/coaches.ts` / `data/administrators.ts`.
 * `group` separates Coaching Staff from Administrators; `pathway`/`programs`
 * drive the coaching-staff filters; `key` makes seeding idempotent.
 */
export const Staff: CollectionConfig = {
  slug: 'staff',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'group', 'order'],
    group: 'Content',
  },
  access: { read: tenantScopedRead() },
  hooks: {
    beforeChange: [importImageUrls([{ image: 'photo', url: 'imageUrl', alt: 'name' }])],
  },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Display title, e.g. "Academy Director · Head Coach, B2010 MLS NEXT".',
      },
    },
    {
      name: 'group',
      type: 'text',
      index: true,
      admin: {
        description:
          'Which directory this person appears in: "Coaching Staff" or "Administrators".',
      },
    },
    {
      name: 'department',
      type: 'text',
      admin: { description: 'For administrators, e.g. "Executive" or "Technical".' },
    },
    {
      name: 'pathway',
      type: 'select',
      hasMany: true,
      options: [
        opt('boys', 'Boys'),
        opt('girls', 'Girls'),
        opt('goalkeeper', 'Goalkeeper'),
        opt('foundations', 'Foundations'),
      ],
      admin: { description: 'Coaching-staff filter tags.' },
    },
    {
      name: 'programs',
      type: 'select',
      hasMany: true,
      options: [
        opt('mls-next-homegrown', 'MLS NEXT Homegrown'),
        opt('mls-next', 'MLS NEXT'),
        opt('mls-next-academy', 'MLS NEXT Academy'),
        opt('elite-academy', 'Elite Academy'),
        opt('ea-2', 'EA 2'),
        opt('dpl', 'DPL'),
        opt('socal-flight', 'SoCal Flight'),
        opt('mini-maestros', 'Mini Maestros'),
      ],
    },
    { name: 'team', type: 'text', admin: { description: 'e.g. "B2010 MLS NEXT".' } },
    { name: 'credentials', type: 'text', hasMany: true },
    { name: 'achievements', type: 'text', hasMany: true },
    { name: 'bio', type: 'textarea' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'imageUrl',
      type: 'text',
      // Legacy/seed fallback; hidden so editors just use the Photo upload.
      admin: { hidden: true },
    },
    { name: 'email', type: 'text' },
    { name: 'phone', type: 'text' },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show in the homepage coaching grid.' },
    },
    { name: 'joinedYear', type: 'number' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [opt('active', 'Active'), opt('on-leave', 'On leave'), opt('departed', 'Departed')],
      admin: { description: 'Departed people are hidden from public pages.' },
    },
    // Legacy text role (kept to avoid a destructive schema change); prefer `title`.
    { name: 'role', type: 'text', admin: { description: 'Deprecated — use Title.' } },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower numbers sort first.' },
    },
    {
      name: 'key',
      type: 'text',
      index: true,
      admin: { description: 'Stable source id for idempotent seeding. Do not change.' },
    },
  ],
}
