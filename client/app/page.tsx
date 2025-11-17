import { Page } from "@/components/layout/page";
import { HeaderRenderer } from "@/components/header-renderer";
import { FooterRenderer } from "@/components/footer-renderer";
import { SectionRenderer } from "@/components/section-renderer";
import { siteConfigMock, homePageMock } from "@/data/mocks";
import {
  resolveHeader,
  resolveFooter,
  getHeaderMenu,
} from "@/lib/config/resolvers";

export default function Home() {
  // In the future, this will come from API calls:
  // const siteConfig = await fetch(`/api/sites/${tenant}/config`).then(r => r.json())
  // const pageData = await fetch(`/api/sites/${tenant}/pages/home`).then(r => r.json())

  const siteConfig = siteConfigMock;
  const pageData = homePageMock;

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
