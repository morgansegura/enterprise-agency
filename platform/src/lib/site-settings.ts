import { getPayload } from 'payload'

import config from '@/payload.config'

/** The tenant's site chrome settings (one per tenant via multi-tenant global). */
export async function getSiteSettings(tenantId: string | number) {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'siteSettings',
    where: { tenant: { equals: tenantId } },
    limit: 1,
  })
  return docs[0] ?? null
}
