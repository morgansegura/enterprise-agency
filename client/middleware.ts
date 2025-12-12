import { NextRequest, NextResponse } from "next/server";

/**
 * Tenant Detection Middleware
 *
 * Resolves the tenant based on:
 * 1. Subdomain (e.g., demo.example.com -> demo)
 * 2. Custom domain lookup via API
 * 3. Falls back to primary tenant (marketing site)
 *
 * Sets the tenant slug in a request header for use throughout the app
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Cache tenant resolution to avoid hitting API on every request
const tenantCache = new Map<string, { slug: string; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function resolveTenant(
  domain: string,
): Promise<{ slug: string; isPrimary: boolean }> {
  // Check cache first
  const cached = tenantCache.get(domain);
  if (cached && cached.expiresAt > Date.now()) {
    return { slug: cached.slug, isPrimary: false };
  }

  try {
    const res = await fetch(
      `${API_URL}/api/v1/public/resolve?domain=${encodeURIComponent(domain)}`,
      {
        headers: { "Content-Type": "application/json" },
        // Don't cache at fetch level since we handle it ourselves
        cache: "no-store",
      },
    );

    if (res.ok) {
      const data = await res.json();
      // Cache the result
      tenantCache.set(domain, {
        slug: data.slug,
        expiresAt: Date.now() + CACHE_TTL,
      });
      return data;
    }
  } catch {
    console.error("[Middleware] Failed to resolve tenant for domain:", domain);
  }

  // Fall back to env-based tenant slug or default
  const fallbackSlug =
    process.env.NEXT_PUBLIC_TENANT_SLUG || "enterprise-agency";
  return { slug: fallbackSlug, isPrimary: true };
}

function extractSubdomain(host: string): string | null {
  // Remove port if present
  const hostname = host.split(":")[0];

  // Skip for localhost and IP addresses
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    /^\d+\.\d+\.\d+\.\d+$/.test(hostname)
  ) {
    return null;
  }

  // Split hostname into parts
  const parts = hostname.split(".");

  // Need at least 3 parts for a subdomain (sub.domain.tld)
  if (parts.length < 3) {
    return null;
  }

  // Return the subdomain (first part)
  const subdomain = parts[0];

  // Skip common non-tenant subdomains
  if (["www", "api", "admin", "app", "staging", "dev"].includes(subdomain)) {
    return null;
  }

  return subdomain;
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const response = NextResponse.next();

  // Try to extract subdomain first (for subdomain-based multi-tenancy)
  const subdomain = extractSubdomain(host);

  let tenantSlug: string;

  if (subdomain) {
    // Use subdomain as tenant slug directly
    tenantSlug = subdomain;
  } else {
    // For custom domains or root domain, resolve via API
    const { slug } = await resolveTenant(host);
    tenantSlug = slug;
  }

  // Set tenant slug in response headers for use in the app
  response.headers.set("x-tenant-slug", tenantSlug);

  // Also set as a cookie for client-side access
  response.cookies.set("tenant-slug", tenantSlug, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour
  });

  return response;
}

// Only run middleware on pages, not on static files or API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};
