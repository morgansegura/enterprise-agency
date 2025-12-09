import type { Metadata } from "next";
import { Inter, Roboto_Slab } from "next/font/google";
import { Providers } from "./providers";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const roboto_slab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web & Funnel Builder",
  description: "Admin UI for managing all church sites",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", inter.variable, roboto_slab.variable)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
