import type { TypedSection } from "@/components/section-renderer";

/**
 * Mock data for the home page
 * Comprehensive test of all components and layouts
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

  // Content sections
  sections: [
    // Hero Section
    {
      _key: "section_hero",
      _type: "section" as const,
      background: "primary" as const,
      paddingY: "2xl" as const,
      width: "full" as const,
      align: "center" as const,
      containers: [
        {
          _key: "hero-content",
          _type: "container" as const,
          layout: {
            type: "stack" as const,
            gap: "lg" as const,
            align: "center" as const,
          },
          maxWidth: "lg" as const,
          align: "center" as const,
          blocks: [
            {
              _key: "hero-heading",
              _type: "heading-block" as const,
              data: {
                text: "Welcome to MH Bible Baptist Church",
                level: "h1" as const,
                size: "6xl" as const,
                align: "center" as const,
                weight: "bold" as const,
              },
            },
            {
              _key: "hero-text",
              _type: "text-block" as const,
              data: {
                content:
                  "A community of faith, worship, and service. Join us this Sunday!",
                size: "xl" as const,
                align: "center" as const,
                variant: "lead" as const,
              },
            },
          ],
        },
        {
          _key: "hero-buttons",
          _type: "container" as const,
          layout: {
            type: "flex" as const,
            gap: "md" as const,
            justify: "center" as const,
            wrap: true,
          },
          blocks: [
            {
              _key: "hero-btn-1",
              _type: "button-block" as const,
              data: {
                text: "Plan Your Visit",
                url: "/visit",
                variant: "default" as const,
                size: "lg" as const,
              },
            },
            {
              _key: "hero-btn-2",
              _type: "button-block" as const,
              data: {
                text: "Watch Online",
                url: "/watch",
                variant: "outline" as const,
                size: "lg" as const,
              },
            },
          ],
        },
      ],
    },

    // Service Times Section
    {
      _key: "section_service_times",
      _type: "section" as const,
      background: "white" as const,
      paddingY: "xl" as const,
      width: "wide" as const,
      align: "center" as const,
      containers: [
        {
          _key: "service-times-content",
          _type: "container" as const,
          layout: {
            type: "stack" as const,
            gap: "lg" as const,
          },
          blocks: [
            {
              _key: "service-times-heading",
              _type: "heading-block" as const,
              data: {
                text: "Service Times",
                level: "h2" as const,
                size: "4xl" as const,
                align: "center" as const,
                weight: "bold" as const,
              },
            },
            {
              _key: "service-times-stats",
              _type: "stats-block" as const,
              data: {
                stats: [
                  {
                    label: "Sunday Worship",
                    value: "10:00 AM",
                    description: "Join us for worship and the Word",
                  },
                  {
                    label: "Wednesday Bible Study",
                    value: "7:00 PM",
                    description: "Midweek growth and fellowship",
                  },
                  {
                    label: "Sunday School",
                    value: "9:00 AM",
                    description: "All ages welcome",
                  },
                ],
                columns: 3,
              },
            },
          ],
        },
      ],
    },

    // Welcome Section - Two column layout
    {
      _key: "section_welcome",
      _type: "section" as const,
      background: "gray" as const,
      paddingY: "xl" as const,
      width: "wide" as const,
      align: "center" as const,
      containers: [
        {
          _key: "welcome-grid",
          _type: "container" as const,
          layout: {
            type: "grid" as const,
            columns: 2,
            gap: "xl" as const,
            align: "center" as const,
          },
          blocks: [
            {
              _key: "welcome-image",
              _type: "image-block" as const,
              data: {
                url: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800",
                alt: "Church interior with people worshiping",
                width: 800,
                height: 600,
                objectFit: "cover" as const,
                rounded: true,
              },
            },
            {
              _key: "welcome-content-stack",
              _type: "stack-block" as const,
              data: {
                gap: "md" as const,
              },
              blocks: [
                {
                  _key: "welcome-heading",
                  _type: "heading-block" as const,
                  data: {
                    text: "Welcome Home",
                    level: "h2" as const,
                    size: "4xl" as const,
                    weight: "bold" as const,
                  },
                },
                {
                  _key: "welcome-text-1",
                  _type: "text-block" as const,
                  data: {
                    content:
                      "At MH Bible Baptist Church, we believe in the power of community, the truth of God's Word, and the transforming love of Jesus Christ.",
                    size: "lg" as const,
                  },
                },
                {
                  _key: "welcome-text-2",
                  _type: "text-block" as const,
                  data: {
                    content:
                      "Whether you're new to faith or have been walking with God for years, you'll find a warm welcome here. We're a family that loves God and loves people.",
                    size: "lg" as const,
                  },
                },
                {
                  _key: "welcome-btn",
                  _type: "button-block" as const,
                  data: {
                    text: "Learn More About Us",
                    url: "/about",
                    variant: "default" as const,
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    // Ministries Section
    {
      _key: "section_ministries",
      _type: "section" as const,
      background: "white" as const,
      paddingY: "xl" as const,
      width: "wide" as const,
      align: "center" as const,
      gapY: "xl" as const,
      containers: [
        {
          _key: "ministries-header",
          _type: "container" as const,
          layout: {
            type: "stack" as const,
            gap: "md" as const,
          },
          align: "center" as const,
          blocks: [
            {
              _key: "ministries-heading",
              _type: "heading-block" as const,
              data: {
                text: "Our Ministries",
                level: "h2" as const,
                size: "4xl" as const,
                align: "center" as const,
                weight: "bold" as const,
              },
            },
          ],
        },
        {
          _key: "ministries-cards",
          _type: "container" as const,
          layout: {
            type: "grid" as const,
            columns: 3,
            gap: "lg" as const,
          },
          blocks: [
            {
              _key: "ministry-card-1",
              _type: "card-block" as const,
              data: {
                title: "Youth Ministry",
                description:
                  "Building strong foundations in faith for the next generation. Weekly meetings, events, and service projects.",
                image: {
                  url: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400",
                  alt: "Youth group",
                },
                link: {
                  text: "Learn More",
                  url: "/ministries/youth",
                },
              },
            },
            {
              _key: "ministry-card-2",
              _type: "card-block" as const,
              data: {
                title: "Women's Ministry",
                description:
                  "Fellowship, Bible study, and encouragement for women of all ages. Monthly gatherings and small groups.",
                image: {
                  url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400",
                  alt: "Women's Bible study",
                },
                link: {
                  text: "Learn More",
                  url: "/ministries/women",
                },
              },
            },
            {
              _key: "ministry-card-3",
              _type: "card-block" as const,
              data: {
                title: "Community Outreach",
                description:
                  "Serving our neighbors and sharing God's love through action. Food bank, home repairs, and community events.",
                image: {
                  url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400",
                  alt: "Community service",
                },
                link: {
                  text: "Learn More",
                  url: "/ministries/outreach",
                },
              },
            },
          ],
        },
      ],
    },

    // Quote Section
    {
      _key: "section_verse",
      _type: "section" as const,
      background: "gray" as const,
      paddingY: "xl" as const,
      width: "narrow" as const,
      align: "center" as const,
      containers: [
        {
          _key: "verse-container",
          _type: "container" as const,
          layout: {
            type: "stack" as const,
          },
          blocks: [
            {
              _key: "verse-quote",
              _type: "quote-block" as const,
              data: {
                quote:
                  "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
                author: "John 3:16",
                size: "lg" as const,
                align: "center" as const,
              },
            },
          ],
        },
      ],
    },

    // Events Section
    {
      _key: "section_events",
      _type: "section" as const,
      background: "white" as const,
      paddingY: "xl" as const,
      width: "wide" as const,
      align: "center" as const,
      gapY: "lg" as const,
      containers: [
        {
          _key: "events-header",
          _type: "container" as const,
          layout: {
            type: "stack" as const,
          },
          blocks: [
            {
              _key: "events-heading",
              _type: "heading-block" as const,
              data: {
                text: "Upcoming Events",
                level: "h2" as const,
                size: "4xl" as const,
                align: "center" as const,
                weight: "bold" as const,
              },
            },
          ],
        },
        {
          _key: "events-cards",
          _type: "container" as const,
          layout: {
            type: "grid" as const,
            columns: 2,
            gap: "lg" as const,
          },
          blocks: [
            {
              _key: "event-card-1",
              _type: "card-block" as const,
              data: {
                title: "Easter Sunday Service",
                description:
                  "Join us for a special celebration of the resurrection. Service begins at 10:00 AM followed by fellowship lunch.",
                badge: "This Sunday",
                link: {
                  text: "Get Details",
                  url: "/events/easter",
                },
              },
            },
            {
              _key: "event-card-2",
              _type: "card-block" as const,
              data: {
                title: "Community BBQ",
                description:
                  "Free community meal and fun activities for the whole family. Everyone welcome!",
                badge: "Next Week",
                link: {
                  text: "RSVP Now",
                  url: "/events/bbq",
                },
              },
            },
          ],
        },
        {
          _key: "events-cta",
          _type: "container" as const,
          layout: {
            type: "stack" as const,
            align: "center" as const,
          },
          align: "center" as const,
          blocks: [
            {
              _key: "events-btn",
              _type: "button-block" as const,
              data: {
                text: "View All Events",
                url: "/events",
                variant: "outline" as const,
              },
            },
          ],
        },
      ],
    },

    // CTA Section
    {
      _key: "section_cta",
      _type: "section" as const,
      background: "primary" as const,
      paddingY: "2xl" as const,
      width: "full" as const,
      align: "center" as const,
      containers: [
        {
          _key: "cta-content",
          _type: "container" as const,
          layout: {
            type: "stack" as const,
            gap: "lg" as const,
            align: "center" as const,
          },
          maxWidth: "lg" as const,
          align: "center" as const,
          blocks: [
            {
              _key: "cta-heading",
              _type: "heading-block" as const,
              data: {
                text: "Ready to Visit?",
                level: "h2" as const,
                size: "5xl" as const,
                align: "center" as const,
                weight: "bold" as const,
              },
            },
            {
              _key: "cta-text",
              _type: "text-block" as const,
              data: {
                content:
                  "We'd love to meet you! Plan your first visit or get in touch with any questions.",
                size: "xl" as const,
                align: "center" as const,
              },
            },
          ],
        },
        {
          _key: "cta-buttons",
          _type: "container" as const,
          layout: {
            type: "flex" as const,
            gap: "md" as const,
            justify: "center" as const,
            wrap: true,
          },
          blocks: [
            {
              _key: "cta-btn-1",
              _type: "button-block" as const,
              data: {
                text: "Plan Your Visit",
                url: "/visit",
                variant: "default" as const,
                size: "lg" as const,
              },
            },
            {
              _key: "cta-btn-2",
              _type: "button-block" as const,
              data: {
                text: "Contact Us",
                url: "/contact",
                variant: "outline" as const,
                size: "lg" as const,
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

export type PageData = typeof homePageMock;
