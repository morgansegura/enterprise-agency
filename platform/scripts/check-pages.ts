import { getPayload } from 'payload'

import config from '../src/payload.config'

const payload = await getPayload({ config: await config })
const { docs } = await payload.find({
  collection: 'pages',
  depth: 0,
  pagination: false,
})
for (const d of docs) {
  console.log({
    id: d.id,
    slug: d.slug,
    tenant: (d as { tenant?: unknown }).tenant ?? null,
    hasPuck: Boolean((d as { puckData?: { content?: unknown[] } }).puckData?.content?.length),
  })
}
const { docs: tenants } = await payload.find({
  collection: 'tenants',
  depth: 0,
  pagination: false,
})
console.log(
  'tenants:',
  tenants.map((t) => ({ id: t.id, slug: t.slug, domain: t.domain })),
)
process.exit(0)
