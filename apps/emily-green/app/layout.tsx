import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";

import { Footer, Header } from "@/components/layout";
import { OrganizationSchema, WebsiteSchema } from "@/components/seo";
import { fontBase, fontHeading } from "@/fonts";
import { cn } from "@/lib/utils";
import { site } from "@/site.config";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(fontBase.variable, fontHeading.variable)}>
      <body>
        <OrganizationSchema />
        <WebsiteSchema />
        <Header />
        {children}
        <Footer />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
