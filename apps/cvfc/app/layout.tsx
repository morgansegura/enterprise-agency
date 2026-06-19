import type { Metadata, Viewport } from "next";

import { Header, Footer } from "@/components/layout";
import { JsonLd } from "@/components/seo";
import { getSiteSettings, toMenuItems } from "@/lib/cms";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";
import { fontBase, fontHeading } from "@/fonts";
import "@/styles/globals.css";

const isProd = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.legalName, url: siteConfig.url }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  category: "sports",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.shortDescription,
  },
  robots: isProd
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#061c48",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Chrome content from the CMS (falls back to lib/menu when empty/offline).
  const settings = await getSiteSettings();
  const headerItems = toMenuItems(settings?.headerMenu);
  const footer = settings?.footer ?? undefined;
  const footerValues = footer?.values
    ?.map((v) => v.value ?? undefined)
    .filter((v): v is string => !!v);
  const footerSocial = footer?.social
    ?.filter((s) => s.platform && s.url)
    .map((s) => ({ platform: s.platform as string, href: s.url as string }));

  return (
    <html lang="en" className={`${fontBase.variable} ${fontHeading.variable}`}>
      <body>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Header items={headerItems} />
        {children}
        <Footer
          items={toMenuItems(settings?.footerMenu)}
          tagline={footer?.tagline ?? undefined}
          values={footerValues}
          copyrightName={footer?.copyrightName ?? undefined}
          social={footerSocial}
        />
      </body>
    </html>
  );
}
