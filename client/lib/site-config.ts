import { DefaultSEOConfig } from "./seo";
import type { ThemeConfig } from "./types";

/**
 * Default site-wide SEO configuration for MH Bible Baptist Church
 * Update these values with the actual church information
 */
export const defaultSEO: DefaultSEOConfig = {
  defaultTitle: "MH Bible Baptist Church",
  titleTemplate: "%s | MH Bible Baptist Church",
  description:
    "Welcome to MH Bible Baptist Church. Join us for worship, Bible study, and fellowship. We are a community dedicated to spreading the Gospel and serving our neighbors.",
  siteName: "MH Bible Baptist Church",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://mhbiblebaptist.org", // Update with actual domain
  locale: "en_US",
  images: [
    {
      url: "/og-image.jpg", // Update with actual image path
      width: 1200,
      height: 630,
      alt: "MH Bible Baptist Church",
    },
  ],
  twitter: {
    card: "summary_large_image",
    site: "@mhbiblebaptist", // Update with actual Twitter handle
    creator: "@mhbiblebaptist", // Update with actual Twitter handle
  },
  keywords: [
    "MH Bible Baptist Church",
    "Baptist Church",
    "Christian Church",
    "Bible Study",
    "Worship Service",
    "Gospel",
    "Faith Community",
  ],
};

/**
 * Church information for structured data (JSON-LD)
 * Update with actual church details
 */
export const churchInfo = {
  name: "MH Bible Baptist Church",
  description:
    "A Bible-believing Baptist church dedicated to worship, fellowship, and spreading the Gospel of Jesus Christ.",
  url: defaultSEO.siteUrl,
  logo: `${defaultSEO.siteUrl}/logo.png`, // Update with actual logo path
  image: `${defaultSEO.siteUrl}/church-photo.jpg`, // Update with actual image path
  telephone: "+1-XXX-XXX-XXXX", // Update with actual phone number
  email: "info@mhbiblebaptist.org", // Update with actual email
  address: {
    streetAddress: "123 Church Street", // Update with actual address
    addressLocality: "City Name",
    addressRegion: "State",
    postalCode: "12345",
    addressCountry: "US",
  },
  openingHours: [
    // Update with actual service times
    "Su 09:00-12:00", // Sunday Morning Service
    "Su 18:00-20:00", // Sunday Evening Service
    "We 19:00-21:00", // Wednesday Bible Study
  ],
  sameAs: [
    // Add actual social media URLs
    // "https://www.facebook.com/mhbiblebaptist",
    // "https://www.youtube.com/@mhbiblebaptist",
    // "https://twitter.com/mhbiblebaptist",
  ],
};

/**
 * Theme configuration
 * Defines church-specific design preferences
 * Most design tokens (spacing, shadows, etc.) are defined in globals.css using Tailwind
 */
export const theme: ThemeConfig = {
  fonts: {
    heading: "var(--font-heading)",
    body: "var(--font-body)",
    mono: "var(--font-mono)",
  },

  preferences: {
    defaultRadius: "lg",
    defaultShadow: "md",
    headerStyle: "minimal",
  },
};
