import { getPayload } from 'payload'

import config from '@/payload.config'

/**
 * Tenant-scoped page fetch. Multi-tenant: a (slug, tenant) pair is unique.
 */
export async function getPageBySlug(slug: string, tenantId: string | number) {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { slug: { equals: slug } },
        { tenant: { equals: tenantId } },
        { _status: { equals: 'published' } },
      ],
    },
    limit: 1,
  })
  return docs[0] ?? null
}
