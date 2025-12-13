import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";
import { config } from "dotenv";

config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

// ============================================================================
// DEFAULT PAGES TEMPLATES
// ============================================================================

interface DefaultPage {
  slug: string;
  title: string;
  pageType: string;
  metaTitle: string;
  metaDescription: string;
  content: any;
}

const DEFAULT_PAGES: DefaultPage[] = [
  {
    slug: "home",
    title: "Welcome",
    pageType: "home",
    metaTitle: "Home",
    metaDescription: "Welcome to our website",
    content: {
      sections: [
        {
          _type: "section",
          _key: "hero",
          background: "primary",
          spacing: "2xl",
          blocks: [
            {
              _type: "heading-block",
              _key: "h1",
              data: {
                text: "Welcome",
                level: "h1",
                size: "6xl",
                align: "center",
              },
            },
          ],
        },
      ],
    },
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    pageType: "privacy-policy",
    metaTitle: "Privacy Policy",
    metaDescription: "Our privacy policy and data protection practices",
    content: {
      sections: [
        {
          _type: "section",
          _key: "content",
          blocks: [
            {
              _type: "heading-block",
              _key: "h1",
              data: { text: "Privacy Policy", level: "h1" },
            },
            {
              _type: "text-block",
              _key: "intro",
              data: {
                text: "This privacy policy explains how we collect, use, and protect your personal information.",
              },
            },
          ],
        },
      ],
    },
  },
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    pageType: "terms-of-service",
    metaTitle: "Terms of Service",
    metaDescription: "Terms and conditions of using our services",
    content: {
      sections: [
        {
          _type: "section",
          _key: "content",
          blocks: [
            {
              _type: "heading-block",
              _key: "h1",
              data: { text: "Terms of Service", level: "h1" },
            },
            {
              _type: "text-block",
              _key: "intro",
              data: {
                text: "By using our services, you agree to these terms and conditions.",
              },
            },
          ],
        },
      ],
    },
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    pageType: "cookie-policy",
    metaTitle: "Cookie Policy",
    metaDescription: "How we use cookies on our website",
    content: {
      sections: [
        {
          _type: "section",
          _key: "content",
          blocks: [
            {
              _type: "heading-block",
              _key: "h1",
              data: { text: "Cookie Policy", level: "h1" },
            },
            {
              _type: "text-block",
              _key: "intro",
              data: {
                text: "This policy explains how we use cookies to improve your browsing experience.",
              },
            },
          ],
        },
      ],
    },
  },
  {
    slug: "coming-soon",
    title: "Coming Soon",
    pageType: "coming-soon",
    metaTitle: "Coming Soon",
    metaDescription: "Something exciting is coming soon",
    content: {
      sections: [
        {
          _type: "section",
          _key: "hero",
          background: "accent",
          spacing: "2xl",
          blocks: [
            {
              _type: "heading-block",
              _key: "h1",
              data: {
                text: "Coming Soon",
                level: "h1",
                size: "6xl",
                align: "center",
              },
            },
            {
              _type: "text-block",
              _key: "subtitle",
              data: {
                text: "We are working on something amazing. Stay tuned!",
                align: "center",
              },
            },
          ],
        },
      ],
    },
  },
  {
    slug: "under-construction",
    title: "Under Construction",
    pageType: "under-construction",
    metaTitle: "Under Construction",
    metaDescription: "This page is currently under construction",
    content: {
      sections: [
        {
          _type: "section",
          _key: "hero",
          background: "muted",
          spacing: "2xl",
          blocks: [
            {
              _type: "heading-block",
              _key: "h1",
              data: {
                text: "Under Construction",
                level: "h1",
                size: "5xl",
                align: "center",
              },
            },
            {
              _type: "text-block",
              _key: "subtitle",
              data: {
                text: "This page is being built. Please check back soon.",
                align: "center",
              },
            },
          ],
        },
      ],
    },
  },
];

async function createDefaultPages(tenantId: string, authorId: string) {
  console.log("   📄 Creating default pages...");

  for (const page of DEFAULT_PAGES) {
    await prisma.page.create({
      data: {
        tenantId,
        authorId,
        slug: page.slug,
        title: page.title,
        pageType: page.pageType,
        isSystemPage: true,
        status: page.pageType === "home" ? "published" : "draft",
        content: page.content,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
      },
    });
  }

  console.log(`   ✅ Created ${DEFAULT_PAGES.length} default pages`);
}

async function main() {
  console.log("🌱 Seeding Web and Funnel platform database...");

  // Clean existing data (development only)
  await prisma.tenantUser.deleteMany();
  await prisma.projectAssignment.deleteMany();
  await prisma.page.deleteMany();
  await prisma.post.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.user.deleteMany();

  // ============================================================================
  // 1. CREATE AGENCY OWNER (Morgan Segura)
  // ============================================================================

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

  console.log("✅ Created agency owner:", agencyOwner.email);

  // ============================================================================
  // 2. CREATE WEB AND FUNNEL AGENCY TENANT
  // ============================================================================

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

  console.log("✅ Created agency tenant:", agencyTenant.businessName);

  // ============================================================================
  // 3. LINK OWNER TO AGENCY TENANT
  // ============================================================================

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

  console.log("✅ Linked owner to agency tenant");

  // ============================================================================
  // 4. CREATE DEFAULT PAGES FOR AGENCY
  // ============================================================================

  await createDefaultPages(agencyTenant.id, agencyOwner.id);

  // ============================================================================
  // SUMMARY
  // ============================================================================

  console.log("\n🎉 Web and Funnel platform seeded!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Platform: Web and Funnel");
  // console.log("");
  // console.log("🏢 AGENCY TENANT:");
  // console.log("   Name: Web and Funnel");
  // console.log("   Slug: web-and-funnel");
  // console.log("   Type: AGENCY (Primary Tenant)");
  // console.log("   Features: ALL ENABLED");
  // console.log("");
  // console.log("👤 AGENCY OWNER:");
  // console.log("   Email: morgansegura@gmail.com");
  // console.log("   Password: password123");
  // console.log("   Role: Super Admin + Owner");
  // console.log("   Access: Full Platform Access");
  // console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ Agency tenant created");
  console.log("✅ Default pages created");
  console.log("");
  console.log("📌 Create additional users and clients via the Builder app");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
