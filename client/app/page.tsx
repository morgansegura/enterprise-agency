import { Page } from "@/components/layout/page";
import { HeaderRenderer } from "@/components/header-renderer";
import { FooterRenderer } from "@/components/footer-renderer";
import { SectionRenderer } from "@/components/section-renderer";
import type { TypedSection } from "@/components/section-renderer/section-renderer";
import { siteConfigMock, homePageMock } from "@/data/mocks";
import { publicApi } from "@/lib/public-api-client";
import { logger } from "@/lib/logger";
import type { LogoConfig } from "@/lib/logos/types";
import type { Menu } from "@/lib/menus/types";
import {
  resolveHeader,
  resolveFooter,
  getHeaderMenu,
} from "@/lib/config/resolvers";

export default async function Home() {
  // Fetch real data from API with fallback to mocks
  let siteConfig = siteConfigMock;
  let pageData = homePageMock;

  try {
    // Fetch site configuration and home page from API
    const [apiConfig, apiPage] = await Promise.all([
      publicApi.getConfig(),
      publicApi.getPage("home"),
    ]);

    // Use API data if available
    if (apiConfig) {
      siteConfig = {
        ...siteConfigMock,
        ...apiConfig,
        // Map API fields to expected client structure
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
        ...homePageMock,
        ...apiPage,
        sections:
          (apiPage.content.sections as TypedSection[]) || homePageMock.sections,
      };
    }
  } catch {
    // Gracefully fall back to mocks if API unavailable
    logger.warn("API unavailable, using mock data for homepage");
  }

  // Resolve header and footer based on page config and site defaults
  const headerConfig = resolveHeader(pageData, siteConfig);
  const footerConfig = resolveFooter(pageData, siteConfig);

  // Get menu for header
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
