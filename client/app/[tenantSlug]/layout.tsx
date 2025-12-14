import { Metadata } from "next";
import {
  createPublicApiClientForTenant,
  SiteConfig,
} from "@/lib/public-api-client";
import { generateOrganizationSchema } from "@/lib/seo";
import { TokenProvider } from "@/components/providers/token-provider";
import { PreviewBanner } from "@/components/preview-banner";

interface TenantLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    tenantSlug: string;
  }>;
}

/**
 * Fetch site config for a specific tenant
 */
async function getSiteConfig(tenantSlug: string): Promise<SiteConfig | null> {
  try {
    const api = await createPublicApiClientForTenant(tenantSlug);
    return await api.getConfig();
  } catch {
    return null;
  }
}

/**
 * Generate dynamic metadata based on tenant configuration
 */
export async function generateMetadata({
  params,
}: TenantLayoutProps): Promise<Metadata> {
  const { tenantSlug } = await params;
  const config = await getSiteConfig(tenantSlug);

  const siteName = config?.businessName || "Enterprise Agency";
  const description = config?.metaDescription || "Welcome to our website";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4002";
  const logoUrl = config?.logoUrl || "/og-image.jpg";

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    openGraph: {
      title: siteName,
      description,
      url: `${siteUrl}/${tenantSlug}`,
      siteName,
      images: [
        {
          url: logoUrl.startsWith("http") ? logoUrl : `${siteUrl}${logoUrl}`,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      images: [logoUrl.startsWith("http") ? logoUrl : `${siteUrl}${logoUrl}`],
    },
  };
}

/**
 * Tenant Layout
 *
 * Wraps all tenant pages with:
 * - Tenant-specific design tokens
 * - Organization schema for SEO
 * - Complete data isolation per tenant
 */
export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const { tenantSlug } = await params;
  const config = await getSiteConfig(tenantSlug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4002";

  // Generate organization schema from tenant config
  const organizationSchema = config
    ? generateOrganizationSchema({
        name: config.businessName,
        description: config.metaDescription || "",
        url: `${siteUrl}/${tenantSlug}`,
        logo: config.logoUrl
          ? config.logoUrl.startsWith("http")
            ? config.logoUrl
            : `${siteUrl}${config.logoUrl}`
          : `${siteUrl}/logo.png`,
        contactPoint:
          config.contactPhone || config.contactEmail
            ? {
                telephone: config.contactPhone || "",
                contactType: "customer service",
                email: config.contactEmail,
              }
            : undefined,
        sameAs: [],
      })
    : null;

  return (
    <>
      {/* Inject tenant-specific design tokens */}
      <TokenProvider tenantSlug={tenantSlug} />

      {/* Organization schema for SEO */}
      {organizationSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      )}

      {children}

      {/* Preview banner shown when Draft Mode is enabled */}
      <PreviewBanner />
    </>
  );
}
