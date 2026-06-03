import type { CollectionConfig } from 'payload'

/** One per tenant (multi-tenant isGlobal): site-wide header/footer chrome. */
export const SiteSettings: CollectionConfig = {
  slug: 'siteSettings',
  labels: { singular: 'Site Settings', plural: 'Site Settings' },
  admin: { useAsTitle: 'siteName' },
  access: { read: () => true },
  fields: [
    { name: 'siteName', type: 'text' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
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
