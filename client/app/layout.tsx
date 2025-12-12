import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { createPublicApiClient, SiteConfig } from "@/lib/public-api-client";
import { generateOrganizationSchema } from "@/lib/seo";
import { CookieConsent } from "@/components/cookie-consent";
import { TokenProvider } from "@/components/providers/token-provider";

import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Fetch site config with fallback for build time
 */
async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    const api = await createPublicApiClient();
    return await api.getConfig();
  } catch {
    // During build or when API unavailable, return null
    return null;
  }
}

/**
 * Generate dynamic metadata based on tenant configuration
 */
export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();

  // Fallback values for build time or API errors
  const siteName = config?.businessName || "Enterprise Agency";
  const description = config?.metaDescription || "Welcome to our website";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4002";
  const logoUrl = config?.logoUrl || "/og-image.jpg";

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    openGraph: {
      title: siteName,
      description,
      url: siteUrl,
      siteName,
      images: [
        {
          url: logoUrl.startsWith("http") ? logoUrl : `${siteUrl}${logoUrl}`,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      images: [logoUrl.startsWith("http") ? logoUrl : `${siteUrl}${logoUrl}`],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4002";

  // Generate organization schema from tenant config
  const organizationSchema = config
    ? generateOrganizationSchema({
        name: config.businessName,
        description: config.metaDescription || "",
        url: siteUrl,
        logo: config.logoUrl
          ? config.logoUrl.startsWith("http")
            ? config.logoUrl
            : `${siteUrl}${config.logoUrl}`
          : `${siteUrl}/logo.png`,
        contactPoint:
          config.contactPhone || config.contactEmail
            ? {
                telephone: config.contactPhone || "",
                contactType: "customer service",
                email: config.contactEmail,
              }
            : undefined,
        sameAs: [],
      })
    : null;

  return (
    <html lang="en">
      <head>
        <TokenProvider />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {organizationSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />
        )}
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
