import { Metadata } from "next";
import { Page } from "@/components/layout/page";
import { SectionRenderer } from "@/components/section-renderer";
import type { TypedSection } from "@/components/section-renderer/section-renderer";
import { createPublicApiClientForTenant } from "@/lib/public-api-client";
import { logger } from "@/lib/logger";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    tenantSlug: string;
  }>;
}

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tenantSlug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4002";

  try {
    const api = await createPublicApiClientForTenant(tenantSlug);
    const config = await api.getConfig();

    const siteName = config?.businessName || "Enterprise Agency";
    const pageUrl = `${siteUrl}/${tenantSlug}`;

    return {
      title: siteName,
      description: config?.metaDescription || "",
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title: siteName,
        description: config?.metaDescription || "",
        url: pageUrl,
        siteName,
        locale: "en_US",
        type: "website",
      },
    };
  } catch {
    return {
      title: "Home",
    };
  }
}

/**
 * Tenant Home Page
 * URL: /{tenantSlug}
 *
 * Renders the home page for a specific tenant.
 * Complete data isolation - each tenant's data is fetched separately.
 * All content comes from the API - no mock data fallbacks.
 */
export default async function TenantHomePage({ params }: PageProps) {
  const { tenantSlug } = await params;

  // Create API client for this specific tenant
  const api = await createPublicApiClientForTenant(tenantSlug);

  let sections: TypedSection[] = [];

  try {
    // Fetch home page from API
    const apiPage = await api.getPage("home");

    // Extract sections from page content
    if (apiPage?.content?.sections) {
      sections = apiPage.content.sections as TypedSection[];
    }
  } catch (error) {
    // If tenant doesn't exist or API fails, return 404
    logger.warn(`Failed to load tenant ${tenantSlug}`, {
      meta: { error: error instanceof Error ? error.message : String(error) },
    });
    notFound();
  }

  return (
    <Page>
      <SectionRenderer sections={sections} />
    </Page>
  );
}
