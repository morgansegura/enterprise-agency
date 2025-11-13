import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { generateMetadata } from "@/lib/seo";
import { defaultSEO, churchInfo } from "@/lib/site-config";
import { generateChurchSchema } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = generateMetadata(
  {
    title: defaultSEO.defaultTitle,
    description: defaultSEO.description,
    keywords: defaultSEO.keywords,
  },
  defaultSEO
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const churchSchema = generateChurchSchema(churchInfo);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* JSON-LD Structured Data for Church */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(churchSchema),
          }}
        />
        {children}
      </body>
    </html>
  );
}
