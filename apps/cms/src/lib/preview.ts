import type { PayloadRequest } from 'payload'

type TenantRef =
  | number
  | string
  | { id: number | string; domain?: string | null }
  | null
  | undefined

/**
 * A real public host (not localhost / loopback), or null for a dev-only host
 * like `cvfc.localhost` — lets the live CMS ignore a dev domain on the tenant
 * and fall back to FRONTEND_URL.
 */
function publicHost(domain?: string | null): string | null {
  if (!domain) return null
  const host = domain.replace(/^https?:\/\//, '').replace(/\/+$/, '')
  if (
    !host ||
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.startsWith('127.') ||
    host.startsWith('0.0.0.0')
  ) {
    return null
  }
  return host
}

/**
 * Front-end preview URL for `path`, resolved PER TENANT (one CMS, many sites).
 * Prod uses the tenant's public `domain` (falling back to FRONTEND_URL for dev
 * hosts); dev uses FRONTEND_URL or localhost. Hits the FE `/api/preview` with
 * the shared secret. Shared by Pages and Posts so both preview the same way.
 */
export async function buildPreviewUrl(
  path: string,
  tenant: TenantRef,
  req: PayloadRequest,
): Promise<string> {
  const secret = process.env.PREVIEW_SECRET || 'preview-dev'
  const envBase = process.env.FRONTEND_URL?.replace(/\/+$/, '')

  let base = envBase || 'http://localhost:4011'
  if (process.env.NODE_ENV === 'production') {
    let domain: string | null | undefined
    if (tenant && typeof tenant === 'object') domain = tenant.domain
    else if (tenant != null) {
      const t = await req.payload.findByID({ collection: 'tenants', id: tenant })
      domain = (t as { domain?: string | null })?.domain
    }
    const host = publicHost(domain)
    if (host) base = `https://${host}`
    else if (envBase) base = envBase
  }

  return `${base}/api/preview?secret=${encodeURIComponent(secret)}&path=${encodeURIComponent(path)}`
}
