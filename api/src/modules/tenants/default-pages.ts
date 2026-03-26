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
      minHeight?: string;
      verticalAlign?: string;
      containers: Array<{
        _type: "container";
        _key: string;
        layout: {
          type: "stack" | "flex" | "grid";
          gap?: string;
          align?: string;
          justify?: string;
        };
        maxWidth?: string;
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
 * Create a spacer block
 */
function spacerBlock(key: string, size: string = "lg") {
  return {
    _type: "spacer-block",
    _key: key,
    data: { size },
  };
}

/**
 * Create a stats block
 */
function statsBlock(
  key: string,
  stats: Array<{ label: string; value: string }>,
) {
  return {
    _type: "stats-block",
    _key: key,
    data: { stats, columns: stats.length },
  };
}

/**
 * Create a card block
 */
function cardBlock(
  key: string,
  title: string,
  description: string,
  options: { variant?: string; icon?: string } = {},
) {
  return {
    _type: "card-block",
    _key: key,
    data: {
      title,
      description,
      variant: options.variant || "default",
      ...(options.icon && { icon: options.icon }),
    },
  };
}

/**
 * Create a hero block
 */
function heroBlock(
  key: string,
  heading: string,
  options: {
    subheading?: string;
    description?: string;
    primaryCta?: { text: string; href: string };
    secondaryCta?: { text: string; href: string };
    layout?: "centered" | "split-right" | "split-left";
    size?: "sm" | "md" | "lg";
    align?: "left" | "center" | "right";
  } = {},
) {
  return {
    _type: "hero-block",
    _key: key,
    data: {
      heading,
      layout: options.layout || "centered",
      size: options.size || "lg",
      align: options.align || "center",
      ...(options.subheading && { subheading: options.subheading }),
      ...(options.description && { description: options.description }),
      ...(options.primaryCta && { primaryCta: options.primaryCta }),
      ...(options.secondaryCta && { secondaryCta: options.secondaryCta }),
    },
  };
}

/**
 * Create a CTA block
 */
function ctaBlock(
  key: string,
  heading: string,
  options: {
    description?: string;
    primaryCta: { text: string; href: string };
    secondaryCta?: { text: string; href: string };
    variant?: "default" | "highlighted" | "minimal";
    align?: "left" | "center";
  },
) {
  return {
    _type: "cta-block",
    _key: key,
    data: {
      heading,
      primaryCta: options.primaryCta,
      variant: options.variant || "default",
      align: options.align || "center",
      ...(options.description && { description: options.description }),
      ...(options.secondaryCta && { secondaryCta: options.secondaryCta }),
    },
  };
}

/**
 * Create a testimonial block
 */
function testimonialBlock(
  key: string,
  testimonials: Array<{
    quote: string;
    name: string;
    role?: string;
    company?: string;
    rating?: number;
  }>,
  options: {
    layout?: "grid" | "carousel" | "single";
    columns?: 1 | 2 | 3;
    variant?: "default" | "card" | "minimal";
    showRating?: boolean;
  } = {},
) {
  return {
    _type: "testimonial-block",
    _key: key,
    data: {
      testimonials,
      layout: options.layout || "grid",
      columns: options.columns || 2,
      variant: options.variant || "card",
      showRating: options.showRating ?? true,
    },
  };
}

/**
 * Create a pricing block
 */
function pricingBlock(
  key: string,
  tiers: Array<{
    name: string;
    price: string;
    period?: string;
    description?: string;
    features: string[];
    cta: { text: string; href: string };
    highlighted?: boolean;
  }>,
  options: {
    heading?: string;
    description?: string;
    variant?: "default" | "bordered" | "elevated";
  } = {},
) {
  return {
    _type: "pricing-block",
    _key: key,
    data: {
      tiers,
      variant: options.variant || "default",
      ...(options.heading && { heading: options.heading }),
      ...(options.description && { description: options.description }),
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
      metaDescription: (name) =>
        `Welcome to ${name}. Discover our services and what makes us different.`,
      content: {
        sections: [
          // Hero Section
          {
            _type: "section",
            _key: "home-hero",
            paddingY: "2xl",
            width: "wide",
            align: "center",
            containers: [
              {
                _type: "container",
                _key: "home-hero-content",
                layout: { type: "stack", align: "center" },
                blocks: [
                  heroBlock("hero", `Welcome to ${businessName}`, {
                    subheading: "Professional Solutions",
                    description:
                      "Your compelling tagline goes here. Tell visitors what makes you special and why they should choose you.",
                    primaryCta: { text: "Get Started", href: "/contact" },
                    secondaryCta: { text: "Learn More", href: "/about" },
                    layout: "centered",
                    size: "lg",
                  }),
                ],
              },
            ],
          },

          // Stats Section
          {
            _type: "section",
            _key: "home-stats",
            background: "dark",
            paddingY: "lg",
            width: "wide",
            align: "center",
            containers: [
              {
                _type: "container",
                _key: "home-stats-grid",
                layout: { type: "stack", align: "center" },
                maxWidth: "4xl",
                blocks: [
                  statsBlock("stats", [
                    { label: "Years in Business", value: "10+" },
                    { label: "Clients Served", value: "500+" },
                    { label: "Projects Completed", value: "1,200+" },
                    { label: "Team Members", value: "25+" },
                  ]),
                ],
              },
            ],
          },

          // Services Preview
          {
            _type: "section",
            _key: "home-services",
            background: "white",
            paddingY: "2xl",
            width: "wide",
            align: "center",
            containers: [
              {
                _type: "container",
                _key: "home-services-header",
                layout: { type: "stack", gap: "md", align: "center" },
                maxWidth: "2xl",
                blocks: [
                  headingBlock("services-title", "What We Do", {
                    level: "h2",
                    size: "3xl",
                    align: "center",
                  }),
                  textBlock(
                    "services-intro",
                    "We offer a range of professional services tailored to help your business grow and succeed.",
                    { align: "center" },
                  ),
                ],
              },
              {
                _type: "container",
                _key: "home-services-grid",
                layout: { type: "grid", gap: "lg" },
                blocks: [
                  cardBlock(
                    "svc-1",
                    "Strategy",
                    "We help you define your goals and create a roadmap to achieve them.",
                  ),
                  cardBlock(
                    "svc-2",
                    "Design",
                    "Beautiful, functional designs that represent your brand and engage your audience.",
                  ),
                  cardBlock(
                    "svc-3",
                    "Development",
                    "Custom-built solutions using modern technology for performance and reliability.",
                  ),
                ],
              },
              {
                _type: "container",
                _key: "home-services-cta",
                layout: { type: "stack", align: "center" },
                blocks: [
                  spacerBlock("svc-spacer", "md"),
                  buttonBlock("svc-btn", "View All Services", "/services", {
                    variant: "outline",
                  }),
                ],
              },
            ],
          },

          // About Preview
          {
            _type: "section",
            _key: "home-about",
            background: "muted",
            paddingY: "2xl",
            width: "wide",
            containers: [
              {
                _type: "container",
                _key: "home-about-content",
                layout: { type: "stack", gap: "lg" },
                maxWidth: "3xl",
                blocks: [
                  headingBlock("about-preview-title", `Why ${businessName}?`, {
                    level: "h2",
                    size: "3xl",
                  }),
                  textBlock(
                    "about-preview-body",
                    "We believe in delivering exceptional results through a combination of expertise, dedication, and genuine care for our clients. Our approach is collaborative — we work alongside you, not just for you.",
                    { size: "lg" },
                  ),
                  textBlock(
                    "about-preview-body2",
                    "With over a decade of experience, our team brings deep industry knowledge and a track record of success to every project we take on.",
                  ),
                  buttonBlock("about-btn", "Learn More About Us", "/about"),
                ],
              },
            ],
          },

          // Testimonials
          {
            _type: "section",
            _key: "home-testimonials",
            background: "muted",
            paddingY: "2xl",
            width: "wide",
            align: "center",
            containers: [
              {
                _type: "container",
                _key: "home-testimonials-header",
                layout: { type: "stack", gap: "md", align: "center" },
                maxWidth: "2xl",
                blocks: [
                  headingBlock("testimonials-title", "What Our Clients Say", {
                    level: "h2",
                    size: "3xl",
                    align: "center",
                  }),
                ],
              },
              {
                _type: "container",
                _key: "home-testimonials-grid",
                layout: { type: "stack", align: "center" },
                blocks: [
                  testimonialBlock(
                    "testimonials",
                    [
                      {
                        quote:
                          "Working with this team transformed our online presence. Highly recommend!",
                        name: "Sarah Johnson",
                        role: "CEO",
                        company: "Acme Corp",
                        rating: 5,
                      },
                      {
                        quote:
                          "Professional, responsive, and delivered beyond expectations.",
                        name: "Michael Chen",
                        role: "Marketing Director",
                        company: "TechFlow",
                        rating: 5,
                      },
                    ],
                    { columns: 2, variant: "card", showRating: true },
                  ),
                ],
              },
            ],
          },

          // CTA Section
          {
            _type: "section",
            _key: "home-cta",
            paddingY: "2xl",
            width: "wide",
            align: "center",
            containers: [
              {
                _type: "container",
                _key: "home-cta-content",
                layout: { type: "stack", align: "center" },
                blocks: [
                  ctaBlock("cta", "Ready to Get Started?", {
                    description:
                      "Let's discuss how we can help you achieve your goals. Reach out today for a free consultation.",
                    primaryCta: { text: "Contact Us", href: "/contact" },
                    secondaryCta: { text: "View Pricing", href: "/pricing" },
                    variant: "highlighted",
                  }),
                ],
              },
            ],
          },
        ],
      },
    },

    // Services - DRAFT
    {
      slug: "services",
      title: "Services",
      pageType: "content",
      isSystemPage: false,
      isHomePage: false,
      status: "draft",
      metaTitle: (name) => `Our Services - ${name}`,
      metaDescription: (name) =>
        `Explore the professional services offered by ${name}. From strategy to execution, we deliver results.`,
      content: {
        sections: [
          {
            _type: "section",
            _key: "services-hero",
            background: "white",
            paddingY: "xl",
            width: "narrow",
            align: "center",
            containers: [
              {
                _type: "container",
                _key: "services-hero-content",
                layout: { type: "stack", gap: "md", align: "center" },
                blocks: [
                  headingBlock("services-page-title", "Our Services", {
                    level: "h1",
                    size: "4xl",
                    align: "center",
                  }),
                  textBlock(
                    "services-page-intro",
                    "We provide comprehensive solutions to help your business thrive in a competitive landscape.",
                    { size: "lg", align: "center" },
                  ),
                ],
              },
            ],
          },
          {
            _type: "section",
            _key: "services-list",
            background: "white",
            paddingY: "xl",
            width: "wide",
            containers: [
              {
                _type: "container",
                _key: "services-grid",
                layout: { type: "grid", gap: "lg" },
                blocks: [
                  cardBlock(
                    "svc-detail-1",
                    "Strategic Consulting",
                    "We analyze your market, competition, and opportunities to build a winning strategy for growth.",
                  ),
                  cardBlock(
                    "svc-detail-2",
                    "Brand Design",
                    "From logos to complete brand systems, we craft identities that resonate and stand the test of time.",
                  ),
                  cardBlock(
                    "svc-detail-3",
                    "Web Development",
                    "Modern, fast, accessible websites built with the latest technology for an optimal user experience.",
                  ),
                  cardBlock(
                    "svc-detail-4",
                    "Digital Marketing",
                    "Data-driven campaigns across search, social, and email to reach your ideal customers.",
                  ),
                  cardBlock(
                    "svc-detail-5",
                    "Content Strategy",
                    "Compelling content that tells your story, builds authority, and drives organic traffic.",
                  ),
                  cardBlock(
                    "svc-detail-6",
                    "Ongoing Support",
                    "We don't disappear after launch. Continuous optimization, updates, and dedicated support.",
                  ),
                ],
              },
            ],
          },
          {
            _type: "section",
            _key: "services-cta",
            background: "muted",
            paddingY: "xl",
            width: "wide",
            align: "center",
            containers: [
              {
                _type: "container",
                _key: "services-cta-content",
                layout: { type: "stack", gap: "md", align: "center" },
                maxWidth: "2xl",
                blocks: [
                  headingBlock("services-cta-title", "Let's Work Together", {
                    level: "h2",
                    size: "2xl",
                    align: "center",
                  }),
                  textBlock(
                    "services-cta-body",
                    "Every project starts with a conversation. Tell us about your goals and we'll show you how we can help.",
                    { align: "center" },
                  ),
                  buttonBlock(
                    "services-cta-btn",
                    "Start a Conversation",
                    "/contact",
                    { variant: "default", size: "lg" },
                  ),
                ],
              },
            ],
          },
        ],
      },
    },

    // Pricing - DRAFT
    {
      slug: "pricing",
      title: "Pricing",
      pageType: "content",
      isSystemPage: false,
      isHomePage: false,
      status: "draft",
      metaTitle: (name) => `Pricing - ${name}`,
      metaDescription: (name) =>
        `View pricing plans and packages from ${name}.`,
      content: {
        sections: [
          {
            _type: "section",
            _key: "pricing-hero",
            background: "white",
            paddingY: "xl",
            width: "wide",
            align: "center",
            containers: [
              {
                _type: "container",
                _key: "pricing-header",
                layout: { type: "stack", gap: "md", align: "center" },
                maxWidth: "2xl",
                blocks: [
                  headingBlock("pricing-title", "Simple, Transparent Pricing", {
                    level: "h1",
                    size: "4xl",
                    align: "center",
                  }),
                  textBlock(
                    "pricing-intro",
                    "Choose the plan that fits your needs. All plans include our core features.",
                    { size: "lg", align: "center" },
                  ),
                ],
              },
              {
                _type: "container",
                _key: "pricing-table",
                layout: { type: "stack", align: "center" },
                blocks: [
                  pricingBlock(
                    "pricing",
                    [
                      {
                        name: "Starter",
                        price: "$49",
                        period: "/month",
                        description: "For small businesses getting started",
                        features: [
                          "Up to 5 pages",
                          "Basic SEO",
                          "Content editing",
                          "Email support",
                        ],
                        cta: { text: "Get Started", href: "/contact" },
                      },
                      {
                        name: "Professional",
                        price: "$149",
                        period: "/month",
                        description: "For growing businesses",
                        features: [
                          "Unlimited pages",
                          "Advanced SEO tools",
                          "Visual page builder",
                          "Analytics dashboard",
                          "Priority support",
                          "Team access (5 users)",
                        ],
                        cta: { text: "Go Professional", href: "/contact" },
                        highlighted: true,
                      },
                      {
                        name: "Enterprise",
                        price: "Custom",
                        description: "For large organizations",
                        features: [
                          "Everything in Professional",
                          "Custom integrations",
                          "White-label options",
                          "API access",
                          "Dedicated account manager",
                          "SLA guarantee",
                        ],
                        cta: { text: "Contact Sales", href: "/contact" },
                      },
                    ],
                    { variant: "elevated" },
                  ),
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
