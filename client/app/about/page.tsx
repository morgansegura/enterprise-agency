import type { Metadata } from "next";
import { SectionRenderer } from "@/components/section-renderer";
import { aboutPageMock } from "@/data/mocks";

/**
 * Example: Custom metadata for the About page
 * Testing with simple metadata object
 */
export const metadata: Metadata = {
  title: "About Us | MH Bible Baptist Church",
  description:
    "Learn about MH Bible Baptist Church, our mission, beliefs, and the community we serve.",
  openGraph: {
    title: "About Us | MH Bible Baptist Church",
    description:
      "Learn about MH Bible Baptist Church, our mission, beliefs, and the community we serve.",
    url: "https://mhbiblebaptist.org/about",
    siteName: "MH Bible Baptist Church",
    images: [
      {
        url: "https://mhbiblebaptist.org/images/about-og.jpg",
        width: 1200,
        height: 630,
        alt: "About MH Bible Baptist Church",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | MH Bible Baptist Church",
    description:
      "Learn about MH Bible Baptist Church, our mission, beliefs, and the community we serve.",
    images: ["https://mhbiblebaptist.org/images/about-og.jpg"],
  },
};

export default function AboutPage() {
  // Mock data - will be replaced with API call
  const pageData = aboutPageMock;

  return (
    <div className="min-h-screen">
      <SectionRenderer sections={pageData.sections} />
    </div>
  );
}
