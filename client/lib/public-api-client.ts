import { cookies, headers } from "next/headers";

/**
 * Public API Client for Client Frontend
 * Fetches published content from the multi-tenant API
 *
 * Enterprise practices:
 * - Type-safe API responses
 * - Dynamic tenant resolution from middleware
 * - Error handling
 * - Cache-friendly with Next.js fetch
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const DEFAULT_TENANT_SLUG =
  process.env.NEXT_PUBLIC_TENANT_SLUG || "enterprise-agency";

/**
 * Get the current tenant slug from middleware headers/cookies
 * Falls back to env variable if not set
 */
export async function getTenantSlug(): Promise<string> {
  try {
    // Try to get from request headers (set by middleware)
    const headersList = await headers();
    const headerSlug = headersList.get("x-tenant-slug");
    if (headerSlug) {
      return headerSlug;
    }

    // Try to get from cookies (set by middleware)
    const cookieStore = await cookies();
    const cookieSlug = cookieStore.get("tenant-slug")?.value;
    if (cookieSlug) {
      return cookieSlug;
    }
  } catch {
    // headers() throws when called outside of request context (e.g., during build)
  }

  // Fall back to environment variable
  return DEFAULT_TENANT_SLUG;
}

/**
 * Get tenant slug for client-side use (from cookie)
 */
export function getClientTenantSlug(): string {
  if (typeof window === "undefined") {
    return DEFAULT_TENANT_SLUG;
  }

  const match = document.cookie.match(/tenant-slug=([^;]+)/);
  return match?.[1] || DEFAULT_TENANT_SLUG;
}

/**
 * Site Configuration Response
 */
export interface SiteConfig {
  slug: string;
  businessName: string;
  businessType: string;
  logoUrl?: string;
  metaDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  headerConfig?: Record<string, unknown>;
  footerConfig?: Record<string, unknown>;
  menusConfig?: Record<string, unknown>;
  logosConfig?: Record<string, unknown>;
  themeConfig?: Record<string, string>;
  updatedAt: string;
}

/**
 * Page Response
 */
export interface Page {
  id: string;
  slug: string;
  title: string;
  content?: {
    sections?: Section[];
  };
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
  publishedAt?: string;
  updatedAt?: string;
}

export interface Section {
  _type: string;
  _key: string;
  background?: string;
  spacing?: string;
  width?: string;
  align?: string;
  blocks?: Block[];
}

export interface Block {
  _type: string;
  _key: string;
  [key: string]: unknown;
}

/**
 * Public API Client Class
 * Handles all requests to the multi-tenant public API
 */
export class PublicApiClient {
  private baseUrl: string;
  private tenantSlug: string;

  constructor(tenantSlug: string, apiUrl: string = API_URL) {
    this.tenantSlug = tenantSlug;
    this.baseUrl = `${apiUrl}/api/v1/public/${tenantSlug}`;
  }

  /**
   * Get the tenant slug this client is configured for
   */
  getSlug(): string {
    return this.tenantSlug;
  }

  /**
   * Get tenant design tokens
   * Cached for 5 minutes (tokens change infrequently)
   */
  async getTokens(): Promise<Record<string, unknown>> {
    const res = await fetch(`${this.baseUrl}/tokens`, {
      next: { revalidate: 300 }, // 5 minutes
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch design tokens: ${res.status} ${res.statusText}`,
      );
    }

    return res.json();
  }

  /**
   * Get site configuration (theme, branding, navigation)
   * Cached for 5 minutes to reduce API load
   */
  async getConfig(): Promise<SiteConfig> {
    const res = await fetch(`${this.baseUrl}/config`, {
      next: { revalidate: 300 }, // 5 minutes
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch site config: ${res.status} ${res.statusText}`,
      );
    }

    return res.json();
  }

  /**
   * Get a published page by slug
   * Cached for 1 minute to balance freshness and performance
   */
  async getPage(slug: string): Promise<Page> {
    const res = await fetch(`${this.baseUrl}/pages/${slug}`, {
      next: { revalidate: 60 }, // 1 minute
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch page ${slug}: ${res.status} ${res.statusText}`,
      );
    }

    return res.json();
  }

  /**
   * List all published pages
   * Used for generating static params and sitemaps
   */
  async listPages(): Promise<{ pages: Page[] }> {
    const res = await fetch(`${this.baseUrl}/pages`, {
      next: { revalidate: 300 }, // 5 minutes
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch pages: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }
}

/**
 * Create a PublicApiClient for the current tenant
 * Use this in server components to get a tenant-aware API client
 */
export async function createPublicApiClient(): Promise<PublicApiClient> {
  const slug = await getTenantSlug();
  return new PublicApiClient(slug);
}

/**
 * Create a PublicApiClient for a specific tenant slug
 * Use this when you know the tenant slug ahead of time
 */
export function createPublicApiClientForTenant(
  tenantSlug: string,
): PublicApiClient {
  return new PublicApiClient(tenantSlug);
}

/**
 * Default instance using environment variable
 * Use createPublicApiClient() for dynamic tenant resolution
 */
export const publicApi = new PublicApiClient(DEFAULT_TENANT_SLUG);
