import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { churchInfo } from "@/lib/site-config";
import { generateChurchSchema } from "@/lib/seo";
import { CookieConsent } from "@/components/cookie-consent";
import { TokenProvider } from "@/components/providers/token-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MH Bible Baptist Church",
    template: "%s | MH Bible Baptist Church",
  },
  description:
    "Welcome to MH Bible Baptist Church. Join us for worship, Bible study, and fellowship.",
  openGraph: {
    title: "MH Bible Baptist Church",
    description:
      "Welcome to MH Bible Baptist Church. Join us for worship, Bible study, and fellowship.",
    url: "https://mhbiblebaptist.org",
    siteName: "MH Bible Baptist Church",
    images: [
      {
        url: "https://mhbiblebaptist.org/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MH Bible Baptist Church",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MH Bible Baptist Church",
    description:
      "Welcome to MH Bible Baptist Church. Join us for worship, Bible study, and fellowship.",
    images: ["https://mhbiblebaptist.org/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const churchSchema = generateChurchSchema(churchInfo);

  return (
    <html lang="en">
      <head>
        <TokenProvider />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(churchSchema),
          }}
        />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
