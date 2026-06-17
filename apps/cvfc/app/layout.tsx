import type { Metadata } from "next";

import { Header, Footer } from "@/components/layout";
import { getSiteSettings, toMenuItems } from "@/lib/cms";
import { fontBase, fontHeading } from "@/fonts";
import { site } from "@/site.config";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s — ${site.name}` },
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
