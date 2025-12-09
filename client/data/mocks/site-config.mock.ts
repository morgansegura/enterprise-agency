/**
 * Site Configuration Mock Data
 *
 * This represents what will come from: GET /api/sites/{tenant}/config
 * Combines all site-level configuration into one structure
 */

import type { SiteConfig } from "@/lib/config/types";
import { headerConfigMock, primaryMenuMock } from "./header.mock";
import { footerConfigMock } from "./footer.mock";
import { primaryLogoMock, iconLogoMock, imageLogoMock } from "./logos.mock";
import { theme } from "@/lib/site-config";

/**
 * Complete site configuration for MH Bible Baptist Church
 * Uses all the existing mocks we've built
 */
export const siteConfigMock: SiteConfig = {
  tenant: "mh-bible-baptist",
  domain: "mhbiblebaptist.org",

  defaults: {
    header: "main",
    footer: "main",
    pageType: "static-page",
  },

  // Named header configurations (reusable across pages)
  headers: {
    main: headerConfigMock,
    // Future: Add more headers as needed
    // blog: blogHeaderConfig,
    // shop: shopHeaderConfig,
  },

  // Named footer configurations (reusable across pages)
  footers: {
    main: footerConfigMock,
    // Future: Add more footers as needed
    // minimal: minimalFooterConfig,
  },

  // Named menu configurations
  menus: {
    primary: primaryMenuMock,
    // Future: Add more menus as needed
    // blog: blogMenuMock,
    // footer: footerMenuMock,
  },

  // Named logo configurations
  logos: {
    primary: primaryLogoMock,
    icon: iconLogoMock,
    image: imageLogoMock,
    // Future: Add more logos as needed
    // wordmark: wordmarkLogoMock,
    // footer: footerLogoMock,
  },

  // Routing configuration
  routing: {
    home: "/",
    routes: [
      // Static pages
      {
        type: "static-page",
        pattern: "/:slug",
        handler: "static-page",
      },
      // Blog routes (future)
      // {
      //   type: "blog-index",
      //   pattern: "/blog",
      //   handler: "blog-index",
      //   header: "blog", // Optional: Use blog header
      // },
      // {
      //   type: "blog-post",
      //   pattern: "/blog/:slug",
      //   handler: "blog-post",
      //   header: "blog",
      // },
    ],
    notFound: "/404",
  },

  // Theme configuration (reuse existing)
  theme,

  // Site metadata
  metadata: {
    siteName: "MH Bible Baptist Church",
    tagline: "A community of faith, worship, and service",
    description:
      "Welcome to MH Bible Baptist Church. Join us for worship, Bible study, and fellowship.",
    logo: "/logo.png",
    favicon: "/favicon.ico",
  },
};
