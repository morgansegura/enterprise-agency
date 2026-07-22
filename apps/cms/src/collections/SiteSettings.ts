import type { CollectionConfig } from 'payload'

import { importImageUrls } from '../hooks/import-image-urls'

/** One per tenant (multi-tenant isGlobal): site-wide header/footer chrome. */
export const SiteSettings: CollectionConfig = {
  slug: 'siteSettings',
  labels: { singular: 'Site Settings', plural: 'Site Settings' },
  admin: { useAsTitle: 'siteName' },
  access: { read: () => true },
  hooks: {
    beforeChange: [importImageUrls([{ image: 'logo', url: 'logoUrl' }])],
  },
  fields: [
    { name: 'siteName', type: 'text' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'logoUrl',
      type: 'text',
      // Legacy/seed fallback; hidden so editors just use the Logo upload.
      admin: { hidden: true },
    },
    {
      name: 'headerMenu',
      type: 'relationship',
      relationTo: 'menus',
      admin: { description: 'Menu shown in the header nav.' },
    },
    { name: 'footerText', type: 'textarea' },
    {
      name: 'footerMenu',
      type: 'relationship',
      relationTo: 'menus',
      admin: { description: 'Menu shown in the footer.' },
    },
    {
      name: 'footer',
      type: 'group',
      label: 'Footer',
      fields: [
        {
          name: 'tagline',
          type: 'text',
          admin: {
            description:
              'Short line under the logo, e.g. "Creating champions on the field, and leaders in life."',
          },
        },
        {
          name: 'values',
          type: 'array',
          labels: { singular: 'Value', plural: 'Values' },
          admin: { description: 'Word marks, e.g. Passion · Unity · Respect.' },
          fields: [{ name: 'value', type: 'text', required: true }],
        },
        {
          name: 'copyrightName',
          type: 'text',
          admin: { description: 'Name in the © line (defaults to the site name).' },
        },
        {
          name: 'social',
          type: 'array',
          labels: { singular: 'Social link', plural: 'Social links' },
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              options: ['facebook', 'instagram', 'x', 'youtube', 'tiktok', 'linkedin'].map((v) => ({
                label: v,
                value: v,
              })),
            },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO defaults',
      fields: [
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: { description: 'Default meta description (~155 chars).' },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Default social share image (1200×630).' },
        },
        { name: 'twitter', type: 'text', admin: { description: '@handle' } },
        {
          name: 'sameAs',
          type: 'array',
          labels: { singular: 'Profile', plural: 'Social profiles (sameAs)' },
          fields: [{ name: 'url', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'signupNotify',
      type: 'group',
      label: 'Signup notification emails',
      admin: {
        description:
          'Club admins notified when a parent joins (one per line or comma-separated). "All" is notified on every signup; "Boys"/"Girls" are added for that pathway. They get the same new-signup email as the matched coach.',
      },
      fields: [
        {
          name: 'all',
          type: 'textarea',
          label: 'All — every signup',
        },
        {
          name: 'boys',
          type: 'textarea',
          label: 'Boys pathway',
        },
        {
          name: 'girls',
          type: 'textarea',
          label: 'Girls pathway',
        },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      label: 'Analytics',
      fields: [
        {
          name: 'gtmId',
          type: 'text',
          admin: { description: 'Google Tag Manager ID (GTM-XXXXXXX).' },
        },
        {
          name: 'ga4Id',
          type: 'text',
          admin: { description: 'GA4 ID (G-XXXXXXX) — only if not using GTM.' },
        },
      ],
    },
  ],
}
