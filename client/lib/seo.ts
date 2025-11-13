import { Metadata } from "next";

export interface SEOConfig {
  title: string;
  description: string;
  url?: string;
  siteName?: string;
  locale?: string;
  type?: "website" | "article" | "profile";

  // Images
  images?: Array<{
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  }>;

  // Twitter specific
  twitter?: {
    card?: "summary" | "summary_large_image" | "app" | "player";
    site?: string;
    creator?: string;
  };

  // Article specific (for blog posts)
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    tags?: string[];
  };

  // Additional metadata
  keywords?: string[];
  authors?: Array<{ name: string; url?: string }>;
  creator?: string;
  publisher?: string;
  robots?: {
    index?: boolean;
    follow?: boolean;
    googleBot?: {
      index?: boolean;
      follow?: boolean;
    };
  };

  // Canonical and alternates
  canonical?: string;
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };

  // Verification
  verification?: {
    google?: string;
    yandex?: string;
    yahoo?: string;
  };
}

export interface DefaultSEOConfig {
  defaultTitle: string;
  titleTemplate?: string;
  description: string;
  siteName: string;
  siteUrl: string;
  locale: string;
  images: Array<{
    url: string;
    width: number;
    height: number;
    alt: string;
  }>;
  twitter?: {
    card: "summary" | "summary_large_image" | "app" | "player";
    site?: string;
    creator?: string;
  };
  keywords?: string[];
}

/**
 * Generate comprehensive metadata for Next.js pages
 * @param config - SEO configuration for the page
 * @param defaultConfig - Default site-wide SEO configuration
 * @returns Next.js Metadata object
 */
export function generateMetadata(
  config: SEOConfig,
  defaultConfig?: DefaultSEOConfig,
): Metadata {
  const {
    title,
    description,
    url,
    siteName = defaultConfig?.siteName,
    locale = defaultConfig?.locale || "en_US",
    type = "website",
    images = defaultConfig?.images || [],
    twitter = defaultConfig?.twitter,
    article,
    keywords = defaultConfig?.keywords || [],
    authors,
    creator,
    publisher,
    robots,
    canonical,
    alternates,
    verification,
  } = config;

  // Generate full title with template if provided
  const fullTitle = defaultConfig?.titleTemplate
    ? defaultConfig.titleTemplate.replace("%s", title)
    : title;

  // Construct full URL if base URL is provided
  const fullUrl =
    url && defaultConfig?.siteUrl ? `${defaultConfig.siteUrl}${url}` : url;

  // Process images to include full URLs
  const processedImages = images.map((img) => ({
    url: img.url.startsWith("http")
      ? img.url
      : defaultConfig?.siteUrl
        ? `${defaultConfig.siteUrl}${img.url}`
        : img.url,
    width: img.width,
    height: img.height,
    alt: img.alt || title,
  }));

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: authors,
    creator: creator,
    publisher: publisher,

    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: siteName,
      locale: locale,
      type: type,
      images: processedImages.length > 0 ? processedImages : undefined,
      ...(article && {
        publishedTime: article.publishedTime,
        modifiedTime: article.modifiedTime,
        authors: article.authors,
        tags: article.tags,
      }),
    },

    // Twitter
    twitter: {
      card: twitter?.card || "summary_large_image",
      title: fullTitle,
      description,
      images:
        processedImages.length > 0
          ? processedImages.map((img) => img.url)
          : undefined,
      site: twitter?.site,
      creator: twitter?.creator,
    },

    // Robots
    robots: robots
      ? {
          index: robots.index ?? true,
          follow: robots.follow ?? true,
          googleBot: robots.googleBot,
        }
      : undefined,

    // Alternates (canonical, languages)
    alternates: alternates || (canonical ? { canonical } : undefined),

    // Verification
    verification: verification,
  };

  return metadata;
}

/**
 * Generate JSON-LD structured data for organizations
 * @param config - Organization configuration
 * @returns JSON-LD script content
 */
export function generateOrganizationSchema(config: {
  name: string;
  description: string;
  url: string;
  logo?: string;
  contactPoint?: {
    telephone: string;
    contactType: string;
    email?: string;
  };
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  sameAs?: string[]; // Social media URLs
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.name,
    description: config.description,
    url: config.url,
    logo: config.logo,
    contactPoint: config.contactPoint
      ? {
          "@type": "ContactPoint",
          telephone: config.contactPoint.telephone,
          contactType: config.contactPoint.contactType,
          email: config.contactPoint.email,
        }
      : undefined,
    address: config.address
      ? {
          "@type": "PostalAddress",
          streetAddress: config.address.streetAddress,
          addressLocality: config.address.addressLocality,
          addressRegion: config.address.addressRegion,
          postalCode: config.address.postalCode,
          addressCountry: config.address.addressCountry,
        }
      : undefined,
    sameAs: config.sameAs,
  };
}

/**
 * Generate JSON-LD structured data for religious organizations/churches
 * @param config - Church configuration
 * @returns JSON-LD script content
 */
export function generateChurchSchema(config: {
  name: string;
  description: string;
  url: string;
  logo?: string;
  image?: string;
  telephone?: string;
  email?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  openingHours?: string[]; // e.g., ["Su 09:00-12:00", "Su 18:00-20:00", "We 19:00-21:00"]
  sameAs?: string[]; // Social media URLs
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Church",
    name: config.name,
    description: config.description,
    url: config.url,
    logo: config.logo,
    image: config.image,
    telephone: config.telephone,
    email: config.email,
    address: config.address
      ? {
          "@type": "PostalAddress",
          streetAddress: config.address.streetAddress,
          addressLocality: config.address.addressLocality,
          addressRegion: config.address.addressRegion,
          postalCode: config.address.postalCode,
          addressCountry: config.address.addressCountry,
        }
      : undefined,
    openingHoursSpecification: config.openingHours?.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours.substring(0, 2),
      opens: hours.split(" ")[1].split("-")[0],
      closes: hours.split(" ")[1].split("-")[1],
    })),
    sameAs: config.sameAs,
  };
}
