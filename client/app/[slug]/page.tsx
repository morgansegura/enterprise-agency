import { Page } from "@/components/layout/page";
import { HeaderRenderer } from "@/components/header-renderer";
import { FooterRenderer } from "@/components/footer-renderer";
import { SectionRenderer } from "@/components/section-renderer";
import type { TypedSection } from "@/components/section-renderer/section-renderer";
import { siteConfigMock } from "@/data/mocks";
import { publicApi } from "@/lib/public-api-client";
import { logger } from "@/lib/logger";
import type { LogoConfig } from "@/lib/logos/types";
import type { Menu } from "@/lib/menus/types";
import {
  resolveHeader,
  resolveFooter,
  getHeaderMenu,
} from "@/lib/config/resolvers";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch page and config from API
  let siteConfig = siteConfigMock;
  let pageData = null;

  try {
    const [apiConfig, apiPage] = await Promise.all([
      publicApi.getConfig(),
      publicApi.getPage(slug),
    ]);

    if (apiConfig) {
      siteConfig = {
        ...siteConfigMock,
        ...apiConfig,
        logos:
          (apiConfig.logosConfig as Record<string, LogoConfig>) ||
          siteConfigMock.logos,
        menus:
          (apiConfig.menusConfig as Record<string, Menu>) ||
          siteConfigMock.menus,
      };
    }

    if (apiPage?.content) {
      pageData = {
        ...apiPage,
        sections: (apiPage.content.sections as TypedSection[]) || [],
      };
    }
  } catch {
    // Page not found - return 404
    logger.warn(`Page not found: ${slug}`);
    notFound();
  }

  if (!pageData) {
    notFound();
  }

  // Resolve header and footer
  const headerConfig = resolveHeader(pageData, siteConfig);
  const footerConfig = resolveFooter(pageData, siteConfig);
  const headerMenu = headerConfig
    ? getHeaderMenu(headerConfig, siteConfig)
    : null;

  return (
    <Page
      header={
        headerConfig ? (
          <HeaderRenderer
            config={headerConfig}
            menu={headerMenu}
            logos={siteConfig.logos}
          />
        ) : undefined
      }
      footer={
        footerConfig ? <FooterRenderer config={footerConfig} /> : undefined
      }
      headerPosition={headerConfig?.behavior.position}
    >
      <SectionRenderer sections={pageData.sections} />
    </Page>
  );
}

/**
 * Generate static params for all published pages
 * This enables static generation for all pages at build time
 */
export async function generateStaticParams() {
  try {
    const { pages } = await publicApi.listPages();

    // Filter out 'home' since it's handled by app/page.tsx
    return pages
      .filter((page) => page.slug !== "home")
      .map((page) => ({
        slug: page.slug,
      }));
  } catch {
    // Build time - API not available, skip static generation
    logger.warn("Static generation skipped - API not available");
    return [];
  }
}
