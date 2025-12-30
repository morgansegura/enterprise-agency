/**
 * Default Page Templates
 *
 * These pages are created when a new tenant is created.
 * All pages use the Section → Container → Block structure.
 *
 * Only "Coming Soon" is published by default as the home page.
 * All other pages are drafts.
 */

type PageTemplate = {
  slug: string;
  title: string;
  pageType: string;
  isSystemPage: boolean;
  isHomePage: boolean;
  status: "published" | "draft";
  metaTitle: (businessName: string) => string;
  metaDescription: (businessName: string) => string;
  content: {
    sections: Array<{
      _type: "section";
      _key: string;
      background?: string;
      paddingY?: string;
      width?: string;
      align?: string;
      containers: Array<{
        _type: "container";
        _key: string;
        layout: {
          type: "stack" | "flex" | "grid";
          gap?: string;
          align?: string;
          justify?: string;
        };
        blocks: Array<Record<string, unknown>>;
      }>;
    }>;
  };
};

/**
 * Legal page template text
 */
const legalTemplates = {
  privacyPolicy: `This Privacy Policy describes how [BUSINESS_NAME] ("we", "us", or "our") collects, uses, and shares information about you when you use our website and services.

**Information We Collect**

We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.

**How We Use Your Information**

We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.

**Information Sharing**

We do not sell your personal information. We may share your information with third-party service providers who assist us in operating our website and conducting our business.

**Your Rights**

You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.

**Contact Us**

If you have questions about this Privacy Policy, please contact us.

*Last updated: [DATE]*`,

  termsOfService: `Welcome to [BUSINESS_NAME]. By accessing or using our website, you agree to be bound by these Terms of Service.

**Use of Services**

You agree to use our services only for lawful purposes and in accordance with these Terms.

**Intellectual Property**

All content on this website is the property of [BUSINESS_NAME] and is protected by copyright and other intellectual property laws.

**Limitation of Liability**

[BUSINESS_NAME] shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.

**Changes to Terms**

We reserve the right to modify these Terms at any time. Your continued use of our services constitutes acceptance of any changes.

**Contact Us**

If you have questions about these Terms, please contact us.

*Last updated: [DATE]*`,

  cookiePolicy: `This Cookie Policy explains how [BUSINESS_NAME] uses cookies and similar technologies on our website.

**What Are Cookies**

Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your experience.

**How We Use Cookies**

We use cookies to:
- Remember your preferences and settings
- Understand how you use our website
- Improve our services
- Provide personalized content

**Types of Cookies We Use**

- **Essential Cookies**: Required for the website to function properly
- **Analytics Cookies**: Help us understand how visitors interact with our website
- **Functional Cookies**: Remember your preferences

**Managing Cookies**

You can control cookies through your browser settings. Note that disabling certain cookies may affect website functionality.

**Contact Us**

If you have questions about our use of cookies, please contact us.

*Last updated: [DATE]*`,

  adaCompliance: `[BUSINESS_NAME] is committed to ensuring digital accessibility for people with disabilities.

**Our Commitment**

We are continually improving the user experience for everyone and applying the relevant accessibility standards to ensure we provide equal access to all users.

**Conformance Status**

We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA.

**Accessibility Features**

Our website includes:
- Alternative text for images
- Keyboard navigation support
- Clear heading structure
- Sufficient color contrast
- Resizable text

**Feedback**

We welcome your feedback on the accessibility of our website. Please contact us if you encounter accessibility barriers or have suggestions for improvement.

**Contact Us**

If you have questions about our accessibility efforts, please contact us.

*Last updated: [DATE]*`,
};

/**
 * Create a text block
 */
function textBlock(
  key: string,
  content: string,
  options: { size?: string; align?: string; variant?: string } = {},
) {
  return {
    _type: "text-block",
    _key: key,
    data: {
      content,
      size: options.size || "base",
      align: options.align || "left",
      ...(options.variant && { variant: options.variant }),
    },
  };
}

/**
 * Create a heading block
 */
function headingBlock(
  key: string,
  text: string,
  options: {
    level?: string;
    size?: string;
    align?: string;
    weight?: string;
  } = {},
) {
  return {
    _type: "heading-block",
    _key: key,
    data: {
      text,
      level: options.level || "h1",
      size: options.size || "4xl",
      align: options.align || "left",
      ...(options.weight && { weight: options.weight }),
    },
  };
}

/**
 * Create a button block
 */
function buttonBlock(
  key: string,
  text: string,
  href: string,
  options: { variant?: string; size?: string } = {},
) {
  return {
    _type: "button-block",
    _key: key,
    data: {
      text,
      href,
      variant: options.variant || "default",
      size: options.size || "default",
    },
  };
}

/**
 * Generate default pages for a new tenant
 */
export function generateDefaultPages(
  businessName: string,
  authorId: string,
): Array<{
  slug: string;
  title: string;
  authorId: string;
  status: string;
  publishedAt: Date | null;
  isHomePage: boolean;
  pageType: string;
  isSystemPage: boolean;
  metaTitle: string;
  metaDescription: string;
  content: Record<string, unknown>;
}> {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const templates: PageTemplate[] = [
    // Coming Soon - PUBLISHED, HOME PAGE
    {
      slug: "coming-soon",
      title: "Coming Soon",
      pageType: "coming-soon",
      isSystemPage: true,
      isHomePage: true,
      status: "published",
      metaTitle: (name) => `Coming Soon - ${name}`,
      metaDescription: (name) =>
        `${name} website is coming soon. Check back for updates.`,
      content: {
        sections: [
          {
            _type: "section",
            _key: "coming-soon-hero",
            background: "primary",
            paddingY: "2xl",
            width: "narrow",
            align: "center",
            containers: [
              {
                _type: "container",
                _key: "coming-soon-content",
                layout: { type: "stack", gap: "lg", align: "center" },
                blocks: [
                  headingBlock("title", businessName, {
                    level: "h1",
                    size: "5xl",
                    align: "center",
                    weight: "bold",
                  }),
                  textBlock(
                    "subtitle",
                    "We're working on something amazing. Check back soon!",
                    { size: "xl", align: "center", variant: "lead" },
                  ),
                  textBlock(
                    "body",
                    "Our website is currently under construction. We're putting the finishing touches on a great experience for you.",
                    { align: "center" },
                  ),
                ],
              },
            ],
          },
        ],
      },
    },

    // Home - DRAFT (real home page for launch)
    {
      slug: "home",
      title: "Home",
      pageType: "landing",
      isSystemPage: false,
      isHomePage: false,
      status: "draft",
      metaTitle: (name) => `Welcome to ${name}`,
      metaDescription: (name) => `Welcome to ${name}. Discover what we offer.`,
      content: {
        sections: [
          {
            _type: "section",
            _key: "home-hero",
            background: "primary",
            paddingY: "2xl",
            width: "wide",
            align: "center",
            containers: [
              {
                _type: "container",
                _key: "home-hero-content",
                layout: { type: "stack", gap: "lg", align: "center" },
                blocks: [
                  headingBlock("hero-title", `Welcome to ${businessName}`, {
                    level: "h1",
                    size: "5xl",
                    align: "center",
                    weight: "bold",
                  }),
                  textBlock(
                    "hero-subtitle",
                    "Your compelling tagline goes here. Tell visitors what makes you special.",
                    { size: "xl", align: "center", variant: "lead" },
                  ),
                ],
              },
              {
                _type: "container",
                _key: "home-hero-cta",
                layout: { type: "flex", gap: "md", justify: "center" },
                blocks: [
                  buttonBlock("cta-primary", "Get Started", "/contact", {
                    variant: "default",
                    size: "lg",
                  }),
                  buttonBlock("cta-secondary", "Learn More", "/about", {
                    variant: "outline",
                    size: "lg",
                  }),
                ],
              },
            ],
          },
        ],
      },
    },

    // About - DRAFT
    {
      slug: "about",
      title: "About Us",
      pageType: "content",
      isSystemPage: false,
      isHomePage: false,
      status: "draft",
      metaTitle: (name) => `About Us - ${name}`,
      metaDescription: (name) => `Learn more about ${name} and our story.`,
      content: {
        sections: [
          {
            _type: "section",
            _key: "about-hero",
            background: "white",
            paddingY: "xl",
            width: "narrow",
            containers: [
              {
                _type: "container",
                _key: "about-content",
                layout: { type: "stack", gap: "lg" },
                blocks: [
                  headingBlock("about-title", `About ${businessName}`, {
                    level: "h1",
                    size: "4xl",
                  }),
                  textBlock(
                    "about-intro",
                    "Tell your story here. What is your mission? What drives you? What makes you different?",
                    { size: "lg" },
                  ),
                  textBlock(
                    "about-body",
                    "Add more details about your history, your team, your values, and what you stand for. This is your opportunity to connect with visitors on a personal level.",
                  ),
                ],
              },
            ],
          },
        ],
      },
    },

    // Contact - DRAFT
    {
      slug: "contact",
      title: "Contact Us",
      pageType: "content",
      isSystemPage: false,
      isHomePage: false,
      status: "draft",
      metaTitle: (name) => `Contact Us - ${name}`,
      metaDescription: (name) =>
        `Get in touch with ${name}. We'd love to hear from you.`,
      content: {
        sections: [
          {
            _type: "section",
            _key: "contact-hero",
            background: "white",
            paddingY: "xl",
            width: "narrow",
            containers: [
              {
                _type: "container",
                _key: "contact-content",
                layout: { type: "stack", gap: "lg" },
                blocks: [
                  headingBlock("contact-title", "Contact Us", {
                    level: "h1",
                    size: "4xl",
                  }),
                  textBlock(
                    "contact-intro",
                    "We'd love to hear from you. Reach out with any questions, comments, or inquiries.",
                    { size: "lg" },
                  ),
                  textBlock(
                    "contact-info",
                    "Email: contact@example.com\nPhone: (555) 123-4567\nAddress: 123 Main Street, City, State 12345",
                  ),
                ],
              },
            ],
          },
        ],
      },
    },

    // Blog - DRAFT
    {
      slug: "blog",
      title: "Blog",
      pageType: "blog-landing",
      isSystemPage: true,
      isHomePage: false,
      status: "draft",
      metaTitle: (name) => `Blog - ${name}`,
      metaDescription: (name) =>
        `Read the latest news and updates from ${name}.`,
      content: {
        sections: [
          {
            _type: "section",
            _key: "blog-hero",
            background: "white",
            paddingY: "xl",
            width: "wide",
            containers: [
              {
                _type: "container",
                _key: "blog-header",
                layout: { type: "stack", gap: "md", align: "center" },
                blocks: [
                  headingBlock("blog-title", "Blog", {
                    level: "h1",
                    size: "4xl",
                    align: "center",
                  }),
                  textBlock(
                    "blog-intro",
                    "Stay up to date with our latest news, insights, and updates.",
                    { size: "lg", align: "center" },
                  ),
                ],
              },
            ],
          },
        ],
      },
    },

    // FAQ - DRAFT
    {
      slug: "faq",
      title: "FAQ",
      pageType: "content",
      isSystemPage: false,
      isHomePage: false,
      status: "draft",
      metaTitle: (name) => `Frequently Asked Questions - ${name}`,
      metaDescription: (name) =>
        `Find answers to common questions about ${name}.`,
      content: {
        sections: [
          {
            _type: "section",
            _key: "faq-hero",
            background: "white",
            paddingY: "xl",
            width: "narrow",
            containers: [
              {
                _type: "container",
                _key: "faq-content",
                layout: { type: "stack", gap: "lg" },
                blocks: [
                  headingBlock("faq-title", "Frequently Asked Questions", {
                    level: "h1",
                    size: "4xl",
                  }),
                  textBlock(
                    "faq-intro",
                    "Find answers to common questions below. If you don't see what you're looking for, please contact us.",
                    { size: "lg" },
                  ),
                ],
              },
            ],
          },
        ],
      },
    },

    // Under Construction - DRAFT
    {
      slug: "under-construction",
      title: "Under Construction",
      pageType: "under-construction",
      isSystemPage: true,
      isHomePage: false,
      status: "draft",
      metaTitle: (name) => `Under Construction - ${name}`,
      metaDescription: () =>
        `This page is currently under construction. Check back soon.`,
      content: {
        sections: [
          {
            _type: "section",
            _key: "construction-hero",
            background: "gray",
            paddingY: "2xl",
            width: "narrow",
            align: "center",
            containers: [
              {
                _type: "container",
                _key: "construction-content",
                layout: { type: "stack", gap: "lg", align: "center" },
                blocks: [
                  headingBlock("construction-title", "Under Construction", {
                    level: "h1",
                    size: "4xl",
                    align: "center",
                  }),
                  textBlock(
                    "construction-body",
                    "We're working hard to bring you something great. This page will be available soon.",
                    { align: "center" },
                  ),
                  buttonBlock("construction-home", "Go to Home", "/", {
                    variant: "default",
                  }),
                ],
              },
            ],
          },
        ],
      },
    },

    // 404 - DRAFT
    {
      slug: "404",
      title: "Page Not Found",
      pageType: "error",
      isSystemPage: true,
      isHomePage: false,
      status: "draft",
      metaTitle: (name) => `Page Not Found - ${name}`,
      metaDescription: () => `The page you're looking for doesn't exist.`,
      content: {
        sections: [
          {
            _type: "section",
            _key: "404-hero",
            background: "white",
            paddingY: "2xl",
            width: "narrow",
            align: "center",
            containers: [
              {
                _type: "container",
                _key: "404-content",
                layout: { type: "stack", gap: "lg", align: "center" },
                blocks: [
                  headingBlock("404-code", "404", {
                    level: "h1",
                    size: "6xl",
                    align: "center",
                    weight: "bold",
                  }),
                  headingBlock("404-title", "Page Not Found", {
                    level: "h2",
                    size: "2xl",
                    align: "center",
                  }),
                  textBlock(
                    "404-body",
                    "Sorry, the page you're looking for doesn't exist or has been moved.",
                    { align: "center" },
                  ),
                  buttonBlock("404-home", "Go to Home", "/", {
                    variant: "default",
                    size: "lg",
                  }),
                ],
              },
            ],
          },
        ],
      },
    },

    // Privacy Policy - DRAFT
    {
      slug: "privacy-policy",
      title: "Privacy Policy",
      pageType: "legal",
      isSystemPage: true,
      isHomePage: false,
      status: "draft",
      metaTitle: (name) => `Privacy Policy - ${name}`,
      metaDescription: (name) =>
        `Read the privacy policy for ${name}. Learn how we collect, use, and protect your information.`,
      content: {
        sections: [
          {
            _type: "section",
            _key: "privacy-content",
            background: "white",
            paddingY: "xl",
            width: "narrow",
            containers: [
              {
                _type: "container",
                _key: "privacy-body",
                layout: { type: "stack", gap: "lg" },
                blocks: [
                  headingBlock("privacy-title", "Privacy Policy", {
                    level: "h1",
                    size: "4xl",
                  }),
                  textBlock(
                    "privacy-text",
                    legalTemplates.privacyPolicy
                      .replace(/\[BUSINESS_NAME\]/g, businessName)
                      .replace(/\[DATE\]/g, dateStr),
                  ),
                ],
              },
            ],
          },
        ],
      },
    },

    // Terms of Service - DRAFT
    {
      slug: "terms-of-service",
      title: "Terms of Service",
      pageType: "legal",
      isSystemPage: true,
      isHomePage: false,
      status: "draft",
      metaTitle: (name) => `Terms of Service - ${name}`,
      metaDescription: (name) => `Read the terms of service for ${name}.`,
      content: {
        sections: [
          {
            _type: "section",
            _key: "terms-content",
            background: "white",
            paddingY: "xl",
            width: "narrow",
            containers: [
              {
                _type: "container",
                _key: "terms-body",
                layout: { type: "stack", gap: "lg" },
                blocks: [
                  headingBlock("terms-title", "Terms of Service", {
                    level: "h1",
                    size: "4xl",
                  }),
                  textBlock(
                    "terms-text",
                    legalTemplates.termsOfService
                      .replace(/\[BUSINESS_NAME\]/g, businessName)
                      .replace(/\[DATE\]/g, dateStr),
                  ),
                ],
              },
            ],
          },
        ],
      },
    },

    // Cookie Policy - DRAFT
    {
      slug: "cookie-policy",
      title: "Cookie Policy",
      pageType: "legal",
      isSystemPage: true,
      isHomePage: false,
      status: "draft",
      metaTitle: (name) => `Cookie Policy - ${name}`,
      metaDescription: (name) =>
        `Learn about how ${name} uses cookies on our website.`,
      content: {
        sections: [
          {
            _type: "section",
            _key: "cookie-content",
            background: "white",
            paddingY: "xl",
            width: "narrow",
            containers: [
              {
                _type: "container",
                _key: "cookie-body",
                layout: { type: "stack", gap: "lg" },
                blocks: [
                  headingBlock("cookie-title", "Cookie Policy", {
                    level: "h1",
                    size: "4xl",
                  }),
                  textBlock(
                    "cookie-text",
                    legalTemplates.cookiePolicy
                      .replace(/\[BUSINESS_NAME\]/g, businessName)
                      .replace(/\[DATE\]/g, dateStr),
                  ),
                ],
              },
            ],
          },
        ],
      },
    },

    // ADA Compliance - DRAFT
    {
      slug: "accessibility",
      title: "Accessibility Statement",
      pageType: "legal",
      isSystemPage: true,
      isHomePage: false,
      status: "draft",
      metaTitle: (name) => `Accessibility Statement - ${name}`,
      metaDescription: (name) =>
        `Learn about ${name}'s commitment to digital accessibility.`,
      content: {
        sections: [
          {
            _type: "section",
            _key: "ada-content",
            background: "white",
            paddingY: "xl",
            width: "narrow",
            containers: [
              {
                _type: "container",
                _key: "ada-body",
                layout: { type: "stack", gap: "lg" },
                blocks: [
                  headingBlock("ada-title", "Accessibility Statement", {
                    level: "h1",
                    size: "4xl",
                  }),
                  textBlock(
                    "ada-text",
                    legalTemplates.adaCompliance
                      .replace(/\[BUSINESS_NAME\]/g, businessName)
                      .replace(/\[DATE\]/g, dateStr),
                  ),
                ],
              },
            ],
          },
        ],
      },
    },
  ];

  return templates.map((template) => ({
    slug: template.slug,
    title: template.title,
    authorId,
    status: template.status,
    publishedAt: template.status === "published" ? now : null,
    isHomePage: template.isHomePage,
    pageType: template.pageType,
    isSystemPage: template.isSystemPage,
    metaTitle: template.metaTitle(businessName),
    metaDescription: template.metaDescription(businessName),
    content: template.content as Record<string, unknown>,
  }));
}
