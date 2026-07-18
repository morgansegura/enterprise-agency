/**
 * One-time backfill: stamp existing `media` + `form-submissions` rows (which
 * predate tenant-scoping) with a tenant so scoped editors can see them. Safe
 * while there's a single tenant with data — it assigns every un-tenanted row to
 * it. With more than one tenant it refuses and asks you to specify.
 *
 * Run AFTER the migration that adds the tenant columns:
 *   bun run payload migrate            # apply the schema migration first
 *   bunx tsx scripts/backfill-tenant.ts
 * Optionally target a slug: TENANT_SLUG=cvfc bunx tsx scripts/backfill-tenant.ts
 */
import { getPayload } from 'payload'

import config from '../src/payload.config'

const COLLECTIONS = ['media', 'form-submissions'] as const

async function run() {
  const payload = await getPayload({ config })

  const slug = process.env.TENANT_SLUG
  const tenants = await payload.find({
    collection: 'tenants',
    ...(slug ? { where: { slug: { equals: slug } } } : {}),
    limit: 2,
    depth: 0,
  })

  if (tenants.docs.length === 0) {
    throw new Error(slug ? `No tenant with slug "${slug}".` : 'No tenants found.')
  }
  if (tenants.docs.length > 1) {
    throw new Error(
      'More than one tenant — set TENANT_SLUG=<slug> to choose which owns the existing rows.',
    )
  }

  const tenantId = tenants.docs[0].id
  console.log(`Backfilling un-tenanted rows → tenant ${tenantId}`)

  for (const collection of COLLECTIONS) {
    const res = await payload.update({
      collection,
      // `tenant` is added by the multi-tenant plugin at runtime; payload-types.ts
      // won't include it until `generate:types` runs post-migration — cast here.
      where: { tenant: { exists: false } } as never,
      data: { tenant: tenantId } as never,
      depth: 0,
      overrideAccess: true,
    })
    console.log(`  ${collection}: updated ${res.docs.length}`)
  }

  console.log('Done.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
