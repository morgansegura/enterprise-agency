/**
 * Public API Client for Client Frontend
 * Fetches published content from the multi-tenant API
 *
 * Enterprise practices:
 * - Type-safe API responses
 * - Environment-based configuration
 * - Error handling
 * - Cache-friendly with Next.js fetch
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG || "mh-bible-baptist";

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

  constructor(tenantSlug: string = TENANT_SLUG, apiUrl: string = API_URL) {
    this.tenantSlug = tenantSlug;
    this.baseUrl = `${apiUrl}/api/v1/public/${tenantSlug}`;
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
 * Default instance for use throughout the app
 */
export const publicApi = new PublicApiClient();
