import { Metadata } from "next";
import { Page } from "@/components/layout/page";
import { SectionRenderer } from "@/components/section-renderer";
import { BreadcrumbSchema } from "@/components/seo";
import { HeaderRenderer } from "@/components/header-renderer";
import { FooterRenderer } from "@/components/footer-renderer";
import type { TypedSection } from "@/components/section-renderer/section-renderer";
import { generatePageCSS } from "@enterprise/tokens";
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

/**
 * Generate CSS custom properties from design tokens for SSR.
 * Mirrors what applyTokensToDOM does on the builder client-side.
 */
function generateThemeCSS(tokens: Record<string, unknown>): string {
  if (!tokens || Object.keys(tokens).length === 0) return "";

  // Unwrap legacy { tokens: { ... } } wrapper
  const data =
    tokens.tokens && typeof tokens.tokens === "object"
      ? (tokens.tokens as Record<string, unknown>)
      : tokens;

  const vars: string[] = [];

  // Fonts
  const fonts = data.fonts as
    | Record<string, Record<string, string>>
    | undefined;
  if (fonts) {
    if (fonts.heading?.family && fonts.heading.family !== "system") {
      vars.push(`--theme-font-heading: ${fonts.heading.family}`);
      vars.push(`--font-heading: ${fonts.heading.family}`);
      vars.push(`--font-primary: ${fonts.heading.family}`);
    }
    if (fonts.body?.family && fonts.body.family !== "system") {
      vars.push(`--theme-font-body: ${fonts.body.family}`);
      vars.push(`--font-body: ${fonts.body.family}`);
      vars.push(`--font-secondary: ${fonts.body.family}`);
    }
    if (fonts.accent?.family && fonts.accent.family !== "system") {
      vars.push(`--theme-font-accent: ${fonts.accent.family}`);
      vars.push(`--font-accent: ${fonts.accent.family}`);
    }
  }

  // Colors
  const colors = data.colors as Record<string, string> | undefined;
  if (colors) {
    if (colors.primaryHex) vars.push(`--primary: ${colors.primaryHex}`);
    if (colors.accentHex) vars.push(`--accent: ${colors.accentHex}`);
    if (colors.background) vars.push(`--background: ${colors.background}`);
    if (colors.foreground) vars.push(`--foreground: ${colors.foreground}`);
    if (colors.borderColor) vars.push(`--border: ${colors.borderColor}`);
    if (colors.linkColor) vars.push(`--link: ${colors.linkColor}`);
  }

  // Border radius
  const radius = data.borderRadius as Record<string, string> | undefined;
  if (radius?.default) vars.push(`--default-radius: ${radius.default}`);

  if (vars.length === 0) return "";
  return `:root {\n  ${vars.join(";\n  ")};\n}`;
}

interface PageProps {
  params: Promise<{
    tenantSlug: string;
    pageSlug: string;
  }>;
}

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tenantSlug, pageSlug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4002";

  try {
    const api = await createPublicApiClientForTenant(tenantSlug);
    const [config, page] = await Promise.all([
      api.getConfig(),
      api.getPage(pageSlug),
    ]);

    const siteName = config?.businessName || "Enterprise Agency";
    const pageTitle = page.metaTitle || page.title;
    const pageDescription =
      page.metaDescription || config?.metaDescription || "";
    const pageUrl = `${siteUrl}/${tenantSlug}/${pageSlug}`;
    const ogImage = page.ogImage || config?.logoUrl || "/og-image.jpg";

    return {
      title: `${pageTitle} | ${siteName}`,
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
      title:
        pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1).replace(/-/g, " "),
    };
  }
}

/**
 * Tenant Page
 * URL: /{tenantSlug}/{pageSlug}
 *
 * Renders any published page for a specific tenant.
 * Complete data isolation - each tenant's data is fetched separately.
 * All content comes from the API - no mock data fallbacks.
 */
export default async function TenantPage({ params }: PageProps) {
  const { tenantSlug, pageSlug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4002";

  // Create API client for this specific tenant
  const api = await createPublicApiClientForTenant(tenantSlug);

  let apiConfig: SiteConfig;
  let pageTitle = "";
  let sections: TypedSection[] = [];
  let designTokens: Record<string, unknown> = {};

  try {
    const [config, apiPage, tokens] = await Promise.all([
      api.getConfig(),
      api.getPage(pageSlug),
      api.getTokens().catch(() => ({})),
    ]);

    apiConfig = config;
    designTokens = tokens;
    pageTitle = apiPage.title;

    // Extract sections from page content
    if (apiPage?.content?.sections) {
      sections = apiPage.content.sections as TypedSection[];
    }
  } catch (error) {
    // Page not found - return 404
    logger.warn(`Page not found: ${tenantSlug}/${pageSlug}`, {
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

  // Generate scoped CSS from section/container/block styles
  const pageCSS = generatePageCSS(sections as never[]);

  // Generate theme CSS variables from design tokens
  const themeCSS = generateThemeCSS(designTokens);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `${siteUrl}/${tenantSlug}` },
          { name: pageTitle, url: `${siteUrl}/${tenantSlug}/${pageSlug}` },
        ]}
      />
      {/* Google Fonts for theme */}
      {(() => {
        const fontFamilies: string[] = [];
        const fonts = (designTokens.tokens as Record<string, unknown>)?.fonts ?? designTokens.fonts;
        if (fonts && typeof fonts === "object") {
          const f = fonts as Record<string, Record<string, string>>;
          for (const role of ["heading", "body", "accent"]) {
            const family = f[role]?.family;
            if (family && family !== "system") {
              const name = family.replace(/^'|',.*/g, "");
              if (name && !fontFamilies.includes(name)) fontFamilies.push(name);
            }
          }
        }
        return fontFamilies.map((family) => (
          <link
            key={family}
            rel="stylesheet"
            href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@300;400;500;600;700;800&display=swap`}
          />
        ));
      })()}
      {themeCSS && (
        <style
          id="theme-styles"
          dangerouslySetInnerHTML={{ __html: themeCSS }}
        />
      )}
      {pageCSS && (
        <style
          id="page-styles"
          dangerouslySetInnerHTML={{ __html: pageCSS }}
        />
      )}
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
    </>
  );
}

/**
 * Generate static params for all published pages across all tenants
 * This enables static generation for all pages at build time
 */
export async function generateStaticParams() {
  // For now, skip static generation - pages will be generated on-demand
  // To enable full static generation, we'd need an API endpoint to list all tenants
  // and then iterate through each tenant's pages
  return [];
}
