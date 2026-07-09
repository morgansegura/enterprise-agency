import type { Metadata } from "next";
import { Toaster } from "sonner";

import { Footer, Header } from "@/components/layout";
import { fontBase, fontHeading } from "@/fonts";
import { cn } from "@/lib/utils";
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
    <html lang="en" className={cn(fontBase.variable, fontHeading.variable)}>
      <body>
        <Header />
        {children}
        <Footer />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
