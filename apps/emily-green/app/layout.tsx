import type { Metadata } from "next";

import { Footer, Header } from "@/components/layout";
import { fontBase } from "@/fonts";
import { site } from "@/site.config";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s — ${site.name}` },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontBase.variable}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
