import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@/payload.config'

/**
 * Resolve the tenant for an incoming request host (e.g. "wf.com",
 * "cvfc.localhost:4010"). Tries the full host, then host without port, then
 * falls back to the first tenant (single-tenant dev convenience).
 *
 * Wrapped in `react.cache` so layout + generateMetadata + generateViewport
 * share one lookup per request instead of hammering the DB three times.
 */
export const resolveTenantByHost = cache(async (host: string | null) => {
  const payload = await getPayload({ config: await config })
  const candidates = host ? [host, host.split(':')[0]] : []

  for (const domain of candidates) {
    if (!domain) continue
    const { docs } = await payload.find({
      collection: 'tenants',
      where: { domain: { equals: domain } },
      limit: 1,
    })
    if (docs[0]) return docs[0]
  }

  const { docs } = await payload.find({ collection: 'tenants', limit: 1 })
  return docs[0] ?? null
})
