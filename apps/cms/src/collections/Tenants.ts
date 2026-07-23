import type { CollectionConfig } from 'payload'
import { tenantsCollectionRead } from '../access/tenant-read'

import { superAdminAccess } from '../access/roles'

/** A theme color field rendered with the admin color picker. */
const color = (name: string, label: string) => ({
  name,
  type: 'text' as const,
  label,
  admin: {
    components: {
      Field: { path: '@/components/admin/color-input#ColorInput' },
    },
  },
})

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: { useAsTitle: 'name' },
  // Public read (the FE resolves tenant theme). Only a super-admin can create,
  // edit, or delete tenants — editors can never mint or alter a client site.
  access: {
    read: tenantsCollectionRead({ scopeField: 'id' }),
    create: superAdminAccess,
    update: superAdminAccess,
    delete: superAdminAccess,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Used for routing / subdomain, e.g. "wf".' },
    },
    {
      name: 'domain',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'Primary domain. e.g. "webandfunnel.com" — or "localhost:4010" for local dev.',
      },
    },
    {
      name: 'theme',
      type: 'group',
      admin: {
        description: 'Per-tenant brand. Leave blank to use platform defaults.',
      },
      fields: [
        color('primary', 'Primary'),
        color('primaryForeground', 'Primary text'),
        color('secondary', 'Secondary'),
        color('secondaryForeground', 'Secondary text'),
        color('background', 'Background'),
        color('foreground', 'Foreground'),
        color('muted', 'Muted'),
        {
          name: 'headingFont',
          type: 'text',
          admin: { description: 'Google font family, e.g. Poppins' },
        },
        {
          name: 'bodyFont',
          type: 'text',
          admin: { description: 'Google font family, e.g. Inter' },
        },
        {
          name: 'tokens',
          type: 'array',
          label: 'Component token overrides',
          admin: {
            description:
              'Fine-tune any component token without forking it, e.g. name "staff-photo-size" value "6rem", or "hero-overlay" value "rgba(0,0,0,.6)".',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: { description: 'Token name without -- (e.g. staff-photo-size)' },
            },
            { name: 'value', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
