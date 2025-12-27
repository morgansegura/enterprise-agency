import { PrismaClient, Prisma } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";
import { config } from "dotenv";

config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

// ============================================================================
// BLOCK HELPERS
// ============================================================================

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

// ============================================================================
// LEGAL TEMPLATE TEXT
// ============================================================================

const legalTemplates = {
  privacyPolicy: `This Privacy Policy describes how Web and Funnel ("we", "us", or "our") collects, uses, and shares information about you when you use our website and services.

**Information We Collect**

We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.

**How We Use Your Information**

We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.

**Information Sharing**

We do not sell your personal information. We may share your information with third-party service providers who assist us in operating our website and conducting our business.

**Your Rights**

You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.

**Contact Us**

If you have questions about this Privacy Policy, please contact us at hello@webandfunnel.com.`,

  termsOfService: `Welcome to Web and Funnel. By accessing or using our website, you agree to be bound by these Terms of Service.

**Use of Services**

You agree to use our services only for lawful purposes and in accordance with these Terms.

**Intellectual Property**

All content on this website is the property of Web and Funnel and is protected by copyright and other intellectual property laws.

**Limitation of Liability**

Web and Funnel shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.

**Changes to Terms**

We reserve the right to modify these Terms at any time. Your continued use of our services constitutes acceptance of any changes.

**Contact Us**

If you have questions about these Terms, please contact us at hello@webandfunnel.com.`,

  cookiePolicy: `This Cookie Policy explains how Web and Funnel uses cookies and similar technologies on our website.

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

If you have questions about our use of cookies, please contact us at hello@webandfunnel.com.`,

  adaCompliance: `Web and Funnel is committed to ensuring digital accessibility for people with disabilities.

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

If you have questions about our accessibility efforts, please contact us at hello@webandfunnel.com.`,
};

// ============================================================================
// DEFAULT PAGES (Section → Container → Block structure)
// ============================================================================

interface DefaultPage {
  slug: string;
  title: string;
  pageType: string;
  isSystemPage: boolean;
  isHomePage: boolean;
  status: "published" | "draft";
  metaTitle: string;
  metaDescription: string;
  content: Record<string, unknown>;
}

const DEFAULT_PAGES: DefaultPage[] = [
  // Coming Soon - PUBLISHED, HOME PAGE
  {
    slug: "coming-soon",
    title: "Coming Soon",
    pageType: "coming-soon",
    isSystemPage: true,
    isHomePage: true,
    status: "published",
    metaTitle: "Coming Soon - Web and Funnel",
    metaDescription:
      "Web and Funnel website is coming soon. Check back for updates.",
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
                headingBlock("title", "Web and Funnel", {
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
    metaTitle: "Welcome to Web and Funnel",
    metaDescription:
      "Web and Funnel - Enterprise website and funnel building platform.",
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
                headingBlock("hero-title", "Welcome to Web and Funnel", {
                  level: "h1",
                  size: "5xl",
                  align: "center",
                  weight: "bold",
                }),
                textBlock(
                  "hero-subtitle",
                  "Enterprise website and funnel building platform. Build stunning websites for your clients.",
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
    metaTitle: "About Us - Web and Funnel",
    metaDescription: "Learn more about Web and Funnel and our mission.",
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
                headingBlock("about-title", "About Web and Funnel", {
                  level: "h1",
                  size: "4xl",
                }),
                textBlock(
                  "about-intro",
                  "Web and Funnel is an enterprise-grade multi-tenant platform for building and managing client websites.",
                  { size: "lg" },
                ),
                textBlock(
                  "about-body",
                  "Our mission is to provide agencies with the tools they need to deliver exceptional digital experiences to their clients. With our platform, you can manage multiple client sites from a single dashboard, ensuring consistency and efficiency.",
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
    metaTitle: "Contact Us - Web and Funnel",
    metaDescription:
      "Get in touch with Web and Funnel. We'd love to hear from you.",
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
                textBlock("contact-info", "Email: hello@webandfunnel.com"),
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
    metaTitle: "Blog - Web and Funnel",
    metaDescription: "Read the latest news and updates from Web and Funnel.",
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
    metaTitle: "Frequently Asked Questions - Web and Funnel",
    metaDescription: "Find answers to common questions about Web and Funnel.",
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
    metaTitle: "Under Construction - Web and Funnel",
    metaDescription:
      "This page is currently under construction. Check back soon.",
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
    metaTitle: "Page Not Found - Web and Funnel",
    metaDescription: "The page you're looking for doesn't exist.",
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
    metaTitle: "Privacy Policy - Web and Funnel",
    metaDescription:
      "Read the privacy policy for Web and Funnel. Learn how we collect, use, and protect your information.",
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
                textBlock("privacy-text", legalTemplates.privacyPolicy),
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
    metaTitle: "Terms of Service - Web and Funnel",
    metaDescription: "Read the terms of service for Web and Funnel.",
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
                textBlock("terms-text", legalTemplates.termsOfService),
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
    metaTitle: "Cookie Policy - Web and Funnel",
    metaDescription:
      "Learn about how Web and Funnel uses cookies on our website.",
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
                textBlock("cookie-text", legalTemplates.cookiePolicy),
              ],
            },
          ],
        },
      ],
    },
  },

  // ADA Compliance / Accessibility - DRAFT
  {
    slug: "accessibility",
    title: "Accessibility Statement",
    pageType: "legal",
    isSystemPage: true,
    isHomePage: false,
    status: "draft",
    metaTitle: "Accessibility Statement - Web and Funnel",
    metaDescription:
      "Learn about Web and Funnel's commitment to digital accessibility.",
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
                textBlock("ada-text", legalTemplates.adaCompliance),
              ],
            },
          ],
        },
      ],
    },
  },
];

// ============================================================================
// CREATE DEFAULT PAGES
// ============================================================================

async function createDefaultPages(tenantId: string, authorId: string) {
  console.log("   📄 Creating default pages...");

  const now = new Date();

  for (const page of DEFAULT_PAGES) {
    await prisma.page.create({
      data: {
        tenantId,
        authorId,
        slug: page.slug,
        title: page.title,
        pageType: page.pageType,
        isSystemPage: page.isSystemPage,
        isHomePage: page.isHomePage,
        status: page.status,
        publishedAt: page.status === "published" ? now : null,
        content: page.content as Prisma.InputJsonValue,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
      },
    });
  }

  console.log(`   ✅ Created ${DEFAULT_PAGES.length} default pages`);
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function main() {
  console.log("🌱 Seeding Web and Funnel platform database...\n");

  // Clean existing data (development only)
  console.log("🧹 Cleaning existing data...");
  await prisma.tenantUser.deleteMany();
  await prisma.projectAssignment.deleteMany();
  await prisma.page.deleteMany();
  await prisma.post.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.user.deleteMany();
  console.log("   ✅ Database cleaned\n");

  // ============================================================================
  // 1. CREATE AGENCY OWNER (Morgan Segura)
  // ============================================================================

  console.log("👤 Creating agency owner...");
  const hashedPassword = await bcrypt.hash("S3GuRa536!!1980", 10);

  const agencyOwner = await prisma.user.create({
    data: {
      email: "morgansegura@gmail.com",
      firstName: "Morgan",
      lastName: "Segura",
      passwordHash: hashedPassword,
      emailVerified: true,
      isSuperAdmin: true,
      agencyRole: "owner",
      status: "active",
    },
  });

  console.log(`   ✅ Created: ${agencyOwner.email}\n`);

  // ============================================================================
  // 2. CREATE WEB AND FUNNEL AGENCY TENANT
  // ============================================================================

  console.log("🏢 Creating Web and Funnel agency tenant...");

  const agencyTenant = await prisma.tenant.create({
    data: {
      slug: "web-and-funnel",
      businessName: "Web and Funnel",
      businessType: "agency",
      status: "active",
      isPrimaryTenant: true,
      tenantType: "AGENCY",
      clientType: "BUSINESS",

      // Agency has ALL features enabled
      enabledFeatures: {
        // === SERVICES ===
        "service.pages": true,
        "service.blog": true,
        "service.shop": true,
        "service.bookings": true,
        "service.forms": true,

        // === PAGES FEATURES ===
        "pages.view": true,
        "pages.edit": true,
        "pages.create": true,
        "pages.delete": true,

        // === BUILDER ACCESS ===
        "builder.access": true,
        "builder.blocks": true,
        "builder.layout": true,

        // === BLOG FEATURES ===
        "blog.view": true,
        "blog.create": true,
        "blog.edit": true,
        "blog.delete": true,
        "blog.categories": true,
        "blog.tags": true,

        // === CONFIGURATION ===
        "config.header": true,
        "config.footer": true,
        "config.menus": true,
        "config.logos": true,
        "config.theme": true,

        // === ASSETS ===
        "assets.upload": true,
        "assets.delete": true,

        // === USER MANAGEMENT ===
        "users.invite": true,
        "users.manage": true,

        // === AGENCY ADMIN ===
        "admin.clients": true,
        "admin.users": true,
        "admin.billing": true,
      },

      themeConfig: {
        primary: "#6366f1", // Indigo
        secondary: "#8b5cf6", // Purple
        accent: "#f59e0b", // Amber
        "font-heading": "Inter",
        "font-body": "Inter",
      },

      contactEmail: "hello@webandfunnel.com",
      metaDescription:
        "Web and Funnel - Enterprise website and funnel building platform",
    },
  });

  console.log(
    `   ✅ Created: ${agencyTenant.businessName} (${agencyTenant.slug})\n`,
  );

  // ============================================================================
  // 3. LINK OWNER TO AGENCY TENANT
  // ============================================================================

  console.log("🔗 Linking owner to agency tenant...");

  await prisma.tenantUser.create({
    data: {
      userId: agencyOwner.id,
      tenantId: agencyTenant.id,
      role: "owner",
      permissions: {
        pages: { view: true, create: true, edit: true, delete: true },
        posts: { view: true, create: true, edit: true, delete: true },
        assets: { view: true, create: true, edit: true, delete: true },
        settings: { view: true, edit: true },
        admin: { clients: true, users: true, billing: true },
      },
    },
  });

  console.log("   ✅ Owner linked\n");

  // ============================================================================
  // 4. CREATE DEFAULT PAGES FOR AGENCY
  // ============================================================================

  console.log("📄 Creating default pages for agency...");
  await createDefaultPages(agencyTenant.id, agencyOwner.id);

  // ============================================================================
  // SUMMARY
  // ============================================================================

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎉 Web and Funnel platform seeded successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("🏢 Agency Tenant:");
  console.log("   Name: Web and Funnel");
  console.log("   Slug: web-and-funnel");
  console.log("   Type: AGENCY (Primary Tenant)");
  console.log("   Status: Active\n");

  console.log("👤 Agency Owner:");
  console.log("   Email: morgansegura@gmail.com");
  console.log("   Role: Super Admin + Owner\n");

  console.log("📄 Default Pages Created:");
  console.log("   • Coming Soon (Published - Home Page)");
  console.log("   • Home (Draft)");
  console.log("   • About (Draft)");
  console.log("   • Contact (Draft)");
  console.log("   • Blog (Draft)");
  console.log("   • FAQ (Draft)");
  console.log("   • Under Construction (Draft)");
  console.log("   • 404 (Draft)");
  console.log("   • Privacy Policy (Draft)");
  console.log("   • Terms of Service (Draft)");
  console.log("   • Cookie Policy (Draft)");
  console.log("   • Accessibility (Draft)\n");

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📌 Next steps:");
  console.log("   1. Start the API: pnpm --filter api dev");
  console.log("   2. Start the Builder: pnpm --filter builder dev");
  console.log("   3. Start the Client: pnpm --filter client dev");
  console.log(
    "   4. Login at http://localhost:3001 with morgansegura@gmail.com",
  );
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
