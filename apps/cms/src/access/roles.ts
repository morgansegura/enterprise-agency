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

/** Collection access: super-admin only. */
export const superAdminAccess: Access = ({ req: { user } }) => isSuperAdmin(user)

/** Field access: super-admin only (e.g. tenant assignment, roles). */
export const superAdminFieldAccess: FieldAccess = ({ req: { user } }) => isSuperAdmin(user)
