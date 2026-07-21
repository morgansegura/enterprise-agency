import type { Access, FieldAccess } from 'payload'

/**
 * Super-admin allowlist by email (comma-separated env var). A super-admin has
 * all-tenant access; everyone else is scoped to their assigned tenant(s) by the
 * multi-tenant plugin. Email-based so it needs no schema/migration and can't
 * lock anyone out — see `userHasAccessToAllTenants` in payload.config.ts.
 */
export const SUPER_ADMIN_EMAILS = (process.env.SUPER_ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

type MaybeUser = { email?: unknown; roles?: unknown } | null | undefined

/** True if the user has all-tenant (super-admin) access. */
export function isSuperAdmin(user: MaybeUser): boolean {
  if (!user) return false
  const roles = Array.isArray(user.roles) ? user.roles : []
  if (roles.includes('super-admin')) return true
  const email = typeof user.email === 'string' ? user.email.toLowerCase() : ''
  return email !== '' && SUPER_ADMIN_EMAILS.includes(email)
}

/**
 * Collection access: super-admin only — but OPEN until super-admins are
 * configured, matching `userHasAccessToAllTenants`. Without this fallback these
 * guards would deny everyone (locking editing) whenever SUPER_ADMIN_EMAILS is
 * unset. Isolation + these locks activate together the moment it's configured.
 */
export const superAdminAccess: Access = ({ req: { user } }) =>
  SUPER_ADMIN_EMAILS.length === 0 || isSuperAdmin(user)

/** Field access: super-admin only (open until super-admins are configured). */
export const superAdminFieldAccess: FieldAccess = ({ req: { user } }) =>
  SUPER_ADMIN_EMAILS.length === 0 || isSuperAdmin(user)

/**
 * Public read that never exposes drafts. Authenticated users (the plugin then
 * scopes them to their tenant) and preview requests carrying the shared
 * `x-preview-secret` header see everything; everyone else — the public FE,
 * scrapers, other tenants — is limited to PUBLISHED docs via a where-constraint.
 * Keeps published content public for the front-ends while preventing one
 * tenant's unpublished drafts from leaking through the shared API.
 */
export const publicOrPreviewRead: Access = ({ req }) => {
  if (req.user) return true
  const secret = req.headers?.get?.('x-preview-secret')
  if (secret && secret === (process.env.PREVIEW_SECRET || 'preview-dev')) {
    return true
  }
  return { _status: { equals: 'published' } }
}
