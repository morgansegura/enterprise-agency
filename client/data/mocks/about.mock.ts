import type { TypedSection } from "@/components/section-renderer";

/**
 * Mock data for the about page
 */
export const aboutPageMock = {
  id: "page_about",
  slug: "about",
  title: "About Us",
  description: "Learn about MH Bible Baptist Church",
  status: "published" as const,
  publishedAt: "2025-01-15T00:00:00Z",

  metadata: {
    title: "About Us | MH Bible Baptist Church",
    description:
      "Learn about our mission, beliefs, and the community we serve.",
    keywords: ["about", "church mission", "baptist beliefs", "church history"],
    ogImage: "/og-about.jpg",
  },

  sections: [
    {
      _key: "section_about",
      _type: "section" as const,
      background: "white" as const,
      paddingY: "xl" as const,
      width: "narrow" as const,
      align: "left" as const,
      containers: [
        {
          _key: "container_about_main",
          _type: "container" as const,
          layout: {
            type: "stack" as const,
            gap: "lg" as const,
          },
          blocks: [
            {
              _key: "block_about_heading",
              _type: "heading-block" as const,
              data: {
                title: "About MH Bible Baptist Church",
                level: "h1" as const,
                size: "4xl" as const,
                align: "left" as const,
              },
            },
            {
              _key: "block_mission_heading",
              _type: "heading-block" as const,
              data: {
                title: "Our Mission",
                level: "h2" as const,
                size: "2xl" as const,
                align: "left" as const,
              },
            },
            {
              _key: "block_mission_text",
              _type: "text-block" as const,
              data: {
                content:
                  "We are a community of believers dedicated to worshiping God, studying His Word, and serving our neighbors in love.",
                size: "base" as const,
                align: "left" as const,
              },
            },
            {
              _key: "block_beliefs_heading",
              _type: "heading-block" as const,
              data: {
                title: "What We Believe",
                level: "h2" as const,
                size: "2xl" as const,
                align: "left" as const,
              },
            },
            {
              _key: "block_beliefs_text",
              _type: "text-block" as const,
              data: {
                content:
                  "As a Bible Baptist church, we hold firm to the fundamental truths of Scripture and the historic Baptist faith.",
                size: "base" as const,
                align: "left" as const,
              },
            },
          ],
        },
      ],
    },
  ] as TypedSection[],

  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-15T00:00:00Z",
};
