import { Metadata } from "next";
import { Page } from "@/components/layout/page";
import { SectionRenderer } from "@/components/section-renderer";
import { HeaderRenderer } from "@/components/header-renderer";
import { FooterRenderer } from "@/components/footer-renderer";
import type { TypedSection } from "@/components/section-renderer/section-renderer";
import {
  createPublicApiClientForTenant,
  type SiteConfig,
} from "@/lib/public-api-client";
import {
  resolveHeader,
  resolveFooter,
  getHeaderMenu,
} from "@/lib/config/resolvers";
import type { SiteConfig as ResolverSiteConfig } from "@/lib/config/types";
import type { LogoConfig } from "@/lib/logos/types";
import type { Menu } from "@/lib/menus/types";
import type { HeaderConfig } from "@/lib/headers/types";
import type { FooterConfig } from "@/lib/footers/types";
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
 * Renders the home page for a specific tenant with header and footer.
 * Complete data isolation - each tenant's data is fetched separately.
 * All content comes from the API - no mock data fallbacks.
 */
export default async function TenantHomePage({ params }: PageProps) {
  const { tenantSlug } = await params;

  // Create API client for this specific tenant
  const api = await createPublicApiClientForTenant(tenantSlug);

  let apiConfig: SiteConfig;
  let sections: TypedSection[] = [];

  try {
    const [config, apiPage] = await Promise.all([
      api.getConfig(),
      api.getPage("home"),
    ]);

    apiConfig = config;

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

  // Transform API config into resolver-compatible format
  const headers =
    (apiConfig.headerConfig as Record<string, HeaderConfig>) || {};
  const footers =
    (apiConfig.footerConfig as Record<string, FooterConfig>) || {};
  const logos = (apiConfig.logosConfig as Record<string, LogoConfig>) || {};
  const menus = (apiConfig.menusConfig as Record<string, Menu>) || {};

  // Build resolver-compatible config
  const resolverConfig: ResolverSiteConfig = {
    tenant: apiConfig.slug,
    domain: "",
    defaults: {
      header: "default",
      footer: "default",
    },
    headers,
    footers,
    menus,
    logos,
    routing: { routes: [], home: "/" },
    theme: {
      fonts: { heading: "", body: "", mono: "" },
      preferences: {
        defaultRadius: "md",
        defaultShadow: "md",
        headerStyle: "minimal",
      },
    },
    metadata: {
      siteName: apiConfig.businessName || "",
    },
  };

  // Resolve header and footer
  const headerConfig = resolveHeader({}, resolverConfig);
  const footerConfig = resolveFooter({}, resolverConfig);
  const headerMenu = headerConfig
    ? getHeaderMenu(headerConfig, resolverConfig)
    : null;

  return (
    <Page
      header={
        headerConfig ? (
          <HeaderRenderer
            config={headerConfig}
            menu={headerMenu}
            logos={logos}
          />
        ) : undefined
      }
      footer={
        footerConfig ? <FooterRenderer config={footerConfig} /> : undefined
      }
      headerPosition={headerConfig?.behavior.position}
    >
      <SectionRenderer sections={sections} />
    </Page>
  );
}
