import type { Payload } from 'payload'

/**
 * Reusable seed toolkit — the repeatable primitives every per-tenant seed uses,
 * so a new site's seed is mostly its content + a handful of calls (not a bespoke
 * script). All operations are idempotent: pages key on (slug, tenant); collection
 * records key on a stable `key` field + tenant. See docs/cms-page-rollout.md.
 */

type Id = number | string

/** Resolve a tenant by slug (or null). */
export async function getTenantBySlug(payload: Payload, slug: string) {
  const res = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })
  return res.docs[0] ?? null
}

/** Find-or-create a Pages doc by (slug, tenant); publishes it. Idempotent. */
export async function upsertPage(
  payload: Payload,
  tenantId: Id,
  slug: string,
  title: string,
  layout: unknown[],
  meta?: { title: string; description: string },
) {
  const found = await payload.find({
    collection: 'pages',
    where: { and: [{ slug: { equals: slug } }, { tenant: { equals: tenantId } }] },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const data = {
    layout: layout as never,
    _status: 'published' as const,
    ...(meta ? { meta } : {}),
  }
  if (found.docs[0]) {
    await payload.update({
      collection: 'pages',
      id: found.docs[0].id,
      data,
      depth: 0,
      overrideAccess: true,
    })
  } else {
    await payload.create({
      collection: 'pages',
      data: { title, slug, tenant: tenantId, ...data },
      depth: 0,
      overrideAccess: true,
    })
  }
}

/** Find-or-create any keyed collection doc by (key, tenant). `extraWhere` lets a
 *  collection key on more than `key` (e.g. Staff keys on key + group). Idempotent. */
export async function upsertByKey(
  payload: Payload,
  tenantId: Id,
  collection: string,
  key: string,
  data: Record<string, unknown>,
  extraWhere: Record<string, unknown>[] = [],
) {
  const found = await payload.find({
    collection: collection as never,
    where: { and: [{ key: { equals: key } }, ...extraWhere, { tenant: { equals: tenantId } }] },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const doc = { ...data, key } as never
  if (found.docs[0]) {
    await payload.update({
      collection: collection as never,
      id: found.docs[0].id,
      data: doc,
      depth: 0,
      overrideAccess: true,
    })
  } else {
    await payload.create({
      collection: collection as never,
      data: { ...(doc as object), tenant: tenantId } as never,
      depth: 0,
      overrideAccess: true,
    })
  }
}

/**
 * Migrate a source array (e.g. a `data/*.ts` file) into a keyed collection.
 * `keyOf` derives the stable id; `map` builds the doc; `extraWhere` optionally
 * scopes the lookup (e.g. by group). Returns the count migrated.
 */
export async function migrateCollection<T>(
  payload: Payload,
  tenantId: Id,
  collection: string,
  items: T[],
  keyOf: (item: T, i: number) => string,
  map: (item: T, i: number) => Record<string, unknown>,
  extraWhere?: (item: T) => Record<string, unknown>[],
): Promise<number> {
  for (const [i, item] of items.entries()) {
    await upsertByKey(
      payload,
      tenantId,
      collection,
      keyOf(item, i),
      map(item, i),
      extraWhere?.(item) ?? [],
    )
  }
  return items.length
}
