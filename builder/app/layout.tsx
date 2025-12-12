import type { Metadata } from "next";
import { Open_Sans, Roboto_Slab } from "next/font/google";
import { Providers } from "./providers";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";

const font_base = Open_Sans({
  variable: "--font-base",
  subsets: ["latin"],
});
const font_heading = Roboto_Slab({
  variable: "--font-heading",
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
      <body
        className={cn("antialiased", font_base.variable, font_heading.variable)}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
