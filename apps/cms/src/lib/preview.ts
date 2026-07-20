import type { PayloadRequest } from 'payload'

type TenantRef =
  | number
  | string
  | { id: number | string; domain?: string | null }
  | null
  | undefined

/**
 * The CMS admin's own origin — where Live Preview `postMessage`s originate. The
 * FE must target THIS exact origin in its `ready` handshake and message filter,
 * so we pass it through the preview link rather than let the FE guess it
 * (ancestorOrigins/referrer are browser-dependent and fail in prod iframes).
 */
function cmsOrigin(req: PayloadRequest): string {
  const fromOrigin = req.headers.get('origin')
  if (fromOrigin) return fromOrigin.replace(/\/+$/, '')
  const host = req.headers.get('host')
  if (host) {
    const proto =
      req.headers.get('x-forwarded-proto') ?? (host.includes('localhost') ? 'http' : 'https')
    return `${proto}://${host}`
  }
  return (process.env.CMS_URL || 'http://localhost:4010').replace(/\/+$/, '')
}

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
  // `/preview` = cookie-free live preview (works cross-site). `/api/preview` is
  // the legacy draft-cookie route, still used by surfaces not yet migrated
  // (Posts). Pages opt into `/preview`.
  endpoint: '/preview' | '/api/preview' = '/api/preview',
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

  const origin = encodeURIComponent(cmsOrigin(req))
  return `${base}${endpoint}?secret=${encodeURIComponent(secret)}&path=${encodeURIComponent(path)}&origin=${origin}`
}
