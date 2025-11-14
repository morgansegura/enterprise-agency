import type { TypedSection } from "@/components/section-renderer";

/**
 * Mock data for the home page
 * This simulates what would come from the API
 */
export const homePageMock = {
  id: "page_home",
  slug: "home",
  title: "Home",
  description: "Welcome to MH Bible Baptist Church",
  status: "published" as const,
  publishedAt: "2025-01-15T00:00:00Z",

  // SEO metadata
  metadata: {
    title: "Welcome | MH Bible Baptist Church",
    description:
      "Join us for worship, Bible study, and fellowship at MH Bible Baptist Church.",
    keywords: ["church", "worship", "bible", "baptist", "fellowship"],
    ogImage: "/og-home.jpg",
  },

  // Content sections (sections contain blocks)
  sections: [
    {
      _key: "section_hero",
      _type: "section" as const,
      background: "gray" as const,
      spacing: "xl" as const,
      width: "wide" as const,
      align: "center" as const,
      blocks: [
        {
          _key: "block_hero_1",
          _type: "heading-block" as const,
          data: {
            title: "Welcome to MH Bible Baptist Church",
            subtitle: "Join us for worship and fellowship every Sunday",
            level: "h1" as const,
            size: "4xl" as const,
            align: "center" as const,
            variant: "default" as const,
          },
        },
        {
          _key: "block_intro_1",
          _type: "text-block" as const,
          data: {
            content:
              "We are a community of believers dedicated to worshiping God, studying His Word, and serving our neighbors in love. Whether you're a long-time Christian or just beginning to explore faith, you're welcome here.",
            size: "lg" as const,
            align: "center" as const,
          },
        },
      ],
    },
    {
      _key: "section_services",
      _type: "section" as const,
      background: "white" as const,
      spacing: "lg" as const,
      width: "wide" as const,
      align: "center" as const,
      blocks: [
        {
          _key: "block_services_heading",
          _type: "heading-block" as const,
          data: {
            title: "Service Times",
            level: "h2" as const,
            size: "2xl" as const,
            align: "center" as const,
          },
        },
        {
          _key: "block_services_text",
          _type: "text-block" as const,
          data: {
            content:
              "Sunday Morning Worship: 10:00 AM\nSunday Evening Service: 6:00 PM\nWednesday Bible Study: 7:00 PM",
            size: "base" as const,
            align: "center" as const,
          },
        },
      ],
    },
  ] as TypedSection[],

  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-15T00:00:00Z",
};

export type PageData = typeof homePageMock;
