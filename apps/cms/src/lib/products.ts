import { getPayload } from 'payload'

import config from '@/payload.config'

export async function getProducts(tenantId: string | number) {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'products',
    where: { tenant: { equals: tenantId } },
    pagination: false,
    limit: 200,
    sort: 'name',
  })
  return docs
}

export async function getProductBySlug(slug: string, tenantId: string | number) {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'products',
    where: {
      and: [{ slug: { equals: slug } }, { tenant: { equals: tenantId } }],
    },
    limit: 1,
  })
  return docs[0] ?? null
}
