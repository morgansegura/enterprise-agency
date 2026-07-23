import type { Access, PayloadRequest, Where } from 'payload'

import { isSuperAdmin, SUPER_ADMIN_EMAILS } from './roles'

/**
 * Per-tenant read keys, env-managed (no schema/migration). `TENANT_KEYS` on the
 * CMS is `slug:key,slug:key`; each front-end sends its key as `x-tenant-key`.
 * Maps key → tenant slug.
 */
const KEY_TO_SLUG: Map<string, string> = new Map(
  (process.env.TENANT_KEYS ?? '')
    .split(',')
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const i = pair.indexOf(':')
      return [pair.slice(i + 1).trim(), pair.slice(0, i).trim()] as [string, string]
    })
    .filter(([k, s]) => k && s),
)

const previewSecret = () => process.env.PREVIEW_SECRET || 'preview-dev'

/** Resolve the tenant id for a request's key (cached on the request). */
async function tenantIdFromKey(req: PayloadRequest, key: string): Promise<number | string | null> {
  const slug = KEY_TO_SLUG.get(key)
  if (!slug) return null
  const cacheProp = `__tid_${slug}`
  const cache = req as unknown as Record<string, unknown>
  if (cacheProp in cache) return cache[cacheProp] as number | string | null
  const res = await req.payload.find({
    collection: 'tenants',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true, // avoid recursing into this same access rule
  })
  const id = res.docs[0]?.id ?? null
  cache[cacheProp] = id
  return id
}

type Opts = {
  /** Collection has drafts → hide unpublished from public reads. */
  versioned?: boolean
  /** Field to scope on. `tenant` for content; `id` for the tenants collection. */
  scopeField?: 'tenant' | 'id'
}

/**
 * Public read, scoped to the caller's tenant via the `x-tenant-key` header:
 * - authenticated users → true (the multi-tenant plugin then scopes them)
 * - valid tenant key → only that tenant's docs (drafts too if the preview secret
 *   is also present, for versioned collections)
 * - invalid key → denied
 * - no key → published-only fallback (keeps things working), UNLESS
 *   `REQUIRE_TENANT_KEY=true`, which denies keyless public reads entirely —
 *   that's the switch that fully closes cross-tenant enumeration.
 */
export const tenantScopedRead =
  ({ versioned = false, scopeField = 'tenant' }: Opts = {}): Access =>
  async ({ req }) => {
    if (req.user) return true

    const key = req.headers?.get?.('x-tenant-key') || ''
    const preview = req.headers?.get?.('x-preview-secret') === previewSecret()
    const and: Where[] = []

    if (key) {
      const tenantId = await tenantIdFromKey(req, key)
      if (tenantId == null) return false
      and.push({ [scopeField]: { equals: tenantId } })
    } else if (process.env.REQUIRE_TENANT_KEY === 'true') {
      return false
    }

    if (versioned && !preview) and.push({ _status: { equals: 'published' } })

    if (and.length === 0) return true
    if (and.length === 1) return and[0]
    return { and }
  }

/** The tenant ids a user is assigned to (multi-tenant plugin's `tenants` array;
 *  each row is `{ tenant: id | doc }`). */
function assignedTenantIds(user: unknown): (number | string)[] {
  const rows = (user as { tenants?: unknown })?.tenants
  if (!Array.isArray(rows)) return []
  return rows
    .map((row) => {
      const t = (row as { tenant?: unknown })?.tenant ?? row
      return typeof t === 'object' && t !== null ? (t as { id?: unknown }).id : t
    })
    .filter((v): v is number | string => v != null)
}

/**
 * Read access for the **Tenants collection itself** (not tenant-scoped content).
 * The multi-tenant plugin does NOT scope this registry, so a plain `req.user →
 * true` lets any editor read — and see in the tenant picker — every client's
 * site. Instead: super-admins see all; other authenticated users see only the
 * tenant(s) they're assigned to; unauthenticated FE reads fall back to the
 * public `x-tenant-key` scoping. Stays open only while SUPER_ADMIN_EMAILS is
 * unset (matching the rest of the isolation switch, so a deploy can't lock out).
 */
export const tenantsCollectionRead =
  (opts: Opts = { scopeField: 'id' }): Access =>
  async (args) => {
    const { req } = args
    if (req.user) {
      if (SUPER_ADMIN_EMAILS.length === 0 || isSuperAdmin(req.user)) return true
      const ids = assignedTenantIds(req.user)
      if (ids.length === 0) return false
      return { id: { in: ids } }
    }
    return tenantScopedRead(opts)(args)
  }
