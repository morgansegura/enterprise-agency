import type { FooterConfig } from "@/lib/footers/types";

/**
 * Example footer configuration
 * Uses the block system - footer columns contain RootBlock[]
 */
export const footerConfigMock: FooterConfig = {
  template: "3-column",

  columns: [
    // Column 1: About
    {
      _key: "about-column",
      blocks: [
        {
          _type: "heading-block",
          _key: "about-heading",
          data: {
            text: "MH Bible Baptist Church",
            level: "h3",
            size: "lg",
            weight: "bold",
          },
        },
        {
          _type: "text-block",
          _key: "about-text",
          data: {
            content:
              "A community dedicated to worshiping God, studying the Bible, and serving our neighbors.",
            size: "sm",
            variant: "muted",
          },
        },
      ],
    },

    // Column 2: Quick Links
    {
      _key: "links-column",
      blocks: [
        {
          _type: "heading-block",
          _key: "links-heading",
          data: {
            text: "Quick Links",
            level: "h3",
            size: "base",
            weight: "semibold",
          },
        },
        {
          _type: "stack-block",
          _key: "links-stack",
          data: {
            gap: "xs",
            align: "start",
          },
          blocks: [
            {
              _type: "button-block",
              _key: "link-home",
              data: {
                text: "Home",
                href: "/",
                variant: "link",
                size: "sm",
              },
            },
            {
              _type: "button-block",
              _key: "link-about",
              data: {
                text: "About Us",
                href: "/about",
                variant: "link",
                size: "sm",
              },
            },
            {
              _type: "button-block",
              _key: "link-ministries",
              data: {
                text: "Ministries",
                href: "/ministries",
                variant: "link",
                size: "sm",
              },
            },
            {
              _type: "button-block",
              _key: "link-events",
              data: {
                text: "Events",
                href: "/events",
                variant: "link",
                size: "sm",
              },
            },
            {
              _type: "button-block",
              _key: "link-contact",
              data: {
                text: "Contact",
                href: "/contact",
                variant: "link",
                size: "sm",
              },
            },
          ],
        },
      ],
    },

    // Column 3: Connect
    {
      _key: "connect-column",
      blocks: [
        {
          _type: "heading-block",
          _key: "connect-heading",
          data: {
            text: "Connect With Us",
            level: "h3",
            size: "base",
            weight: "semibold",
          },
        },
        {
          _type: "text-block",
          _key: "address",
          data: {
            content: "123 Church Street\nYour City, ST 12345",
            size: "sm",
            variant: "muted",
          },
        },
        {
          _type: "text-block",
          _key: "phone",
          data: {
            content: "(555) 123-4567",
            size: "sm",
            variant: "muted",
          },
        },
        {
          _type: "flex-block",
          _key: "social-links",
          data: {
            direction: "row",
            gap: "sm",
            align: "center",
          },
          blocks: [
            {
              _type: "button-block",
              _key: "facebook",
              data: {
                text: "Facebook",
                href: "https://facebook.com",
                variant: "outline",
                size: "sm",
              },
            },
            {
              _type: "button-block",
              _key: "instagram",
              data: {
                text: "Instagram",
                href: "https://instagram.com",
                variant: "outline",
                size: "sm",
              },
            },
            {
              _type: "button-block",
              _key: "youtube",
              data: {
                text: "YouTube",
                href: "https://youtube.com",
                variant: "outline",
                size: "sm",
              },
            },
          ],
        },
      ],
    },
  ],

  bottomBar: {
    left: [
      {
        _type: "text-block",
        _key: "copyright",
        data: {
          content: "© 2025 MH Bible Baptist Church. All rights reserved.",
          size: "sm",
          variant: "muted",
        },
      },
    ],
    right: [
      {
        _type: "flex-block",
        _key: "legal-links",
        data: {
          direction: "row",
          gap: "md",
          justify: "end",
        },
        blocks: [
          {
            _type: "button-block",
            _key: "privacy",
            data: {
              text: "Privacy Policy",
              href: "/privacy",
              variant: "link",
              size: "sm",
            },
          },
          {
            _type: "button-block",
            _key: "terms",
            data: {
              text: "Terms of Service",
              href: "/terms",
              variant: "link",
              size: "sm",
            },
          },
        ],
      },
    ],
  },

  styling: {
    background: "dark",
    spacing: "xl",
    maxWidth: "container",
    divider: true,
  },
};
