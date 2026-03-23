import type { Metadata } from "next";
import { SectionRenderer } from "@/components/section-renderer";
import { createPublicApiClient } from "@/lib/public-api-client";
import type { TypedSection } from "@/components/section-renderer/section-renderer";
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

export default async function AboutPage() {
  let sections: TypedSection[] = [];

  try {
    const api = await createPublicApiClient();
    const page = await api.getPage("about");

    if (page?.content?.sections) {
      sections = page.content.sections as TypedSection[];
    }
  } catch {
    // Fallback to mock data when API is unavailable
    sections = aboutPageMock.sections as TypedSection[];
  }

  return (
    <div className="min-h-screen">
      <SectionRenderer sections={sections} />
    </div>
  );
}
