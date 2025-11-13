import type { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";
import { defaultSEO } from "@/lib/site-config";

/**
 * Example: Custom metadata for the About page
 * This demonstrates how to use the SEO utilities for individual pages
 */
export const metadata: Metadata = generateMetadata(
  {
    title: "About Us",
    description:
      "Learn about MH Bible Baptist Church, our mission, beliefs, and the community we serve. Discover our commitment to faith, fellowship, and the Gospel.",
    url: "/about",
    keywords: [
      "About MH Bible Baptist Church",
      "Church Mission",
      "Baptist Beliefs",
      "Church History",
      "Faith Community",
    ],
    images: [
      {
        url: "/images/about-og.jpg", // Custom image for this page
        width: 1200,
        height: 630,
        alt: "About MH Bible Baptist Church",
      },
    ],
  },
  defaultSEO
);

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">About MH Bible Baptist Church</h1>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p>
            Welcome to MH Bible Baptist Church. We are a community of believers
            dedicated to worshiping God, studying His Word, and serving our
            neighbors in love.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What We Believe</h2>
          <p>
            As a Bible Baptist church, we hold firm to the fundamental truths
            of Scripture and the historic Baptist faith.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Community</h2>
          <p>
            We invite you to join us for worship, Bible study, and fellowship
            as we grow together in faith.
          </p>
        </section>
      </div>
    </div>
  );
}
