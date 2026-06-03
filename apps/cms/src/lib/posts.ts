import { getPayload } from 'payload'

import config from '@/payload.config'

export async function getPosts(tenantId: string | number) {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { tenant: { equals: tenantId } },
        { _status: { equals: 'published' } },
      ],
    },
    sort: '-publishedAt',
    limit: 100,
    pagination: false,
  })
  return docs
}

export async function getPostBySlug(slug: string, tenantId: string | number) {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'posts',
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
