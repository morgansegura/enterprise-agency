import { Metadata } from "next";
import { Page } from "@/components/layout/page";
import { HeaderRenderer } from "@/components/header-renderer";
import { FooterRenderer } from "@/components/footer-renderer";
import { SectionRenderer } from "@/components/section-renderer";
import { BreadcrumbSchema } from "@/components/seo";
import type { TypedSection } from "@/components/section-renderer/section-renderer";
import { siteConfigMock } from "@/data/mocks";
import { createPublicApiClient } from "@/lib/public-api-client";
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

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4002";

  try {
    const api = await createPublicApiClient();
    const [config, page] = await Promise.all([
      api.getConfig(),
      api.getPage(slug),
    ]);

    const siteName = config?.businessName || "Enterprise Agency";
    const pageTitle = page.metaTitle || page.title;
    const pageDescription =
      page.metaDescription || config?.metaDescription || "";
    const pageUrl = `${siteUrl}/${slug}`;
    const ogImage = page.ogImage || config?.logoUrl || "/og-image.jpg";

    return {
      title: pageTitle,
      description: pageDescription,
      keywords: page.metaKeywords,
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: pageUrl,
        siteName,
        images: [
          {
            url: ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`,
            width: 1200,
            height: 630,
            alt: pageTitle,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description: pageDescription,
        images: [ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`],
      },
    };
  } catch {
    // Fallback metadata during build or API errors
    return {
      title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
    };
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4002";

  // Fetch page and config from API
  let siteConfig = siteConfigMock;
  let pageData = null;

  try {
    const api = await createPublicApiClient();
    const [apiConfig, apiPage] = await Promise.all([
      api.getConfig(),
      api.getPage(slug),
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
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteUrl },
          { name: pageData.title, url: `${siteUrl}/${slug}` },
        ]}
      />
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
    </>
  );
}

/**
 * Generate static params for all published pages
 * This enables static generation for all pages at build time
 */
export async function generateStaticParams() {
  try {
    const api = await createPublicApiClient();
    const { pages } = await api.listPages();

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
