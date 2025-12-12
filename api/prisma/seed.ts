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
  // 1. CREATE AGENCY OWNER (YOU - Mo)
  // ============================================================================

  const hashedPassword = await bcrypt.hash("password123", 10);

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

  console.log("✅ Created Web and Funnel owner:", agencyOwner.email);

  // ============================================================================
  // 1.5 CREATE AGENCY TEAM MEMBERS WITH DIFFERENT ROLES
  // ============================================================================

  const agencyAdmin = await prisma.user.create({
    data: {
      email: "admin@webfunnel.com",
      firstName: "Sarah",
      lastName: "Admin",
      passwordHash: hashedPassword,
      emailVerified: true,
      isSuperAdmin: false,
      agencyRole: "admin",
      status: "active",
    },
  });

  const agencyDeveloper = await prisma.user.create({
    data: {
      email: "dev@webfunnel.com",
      firstName: "Mike",
      lastName: "Developer",
      passwordHash: hashedPassword,
      emailVerified: true,
      isSuperAdmin: false,
      agencyRole: "developer",
      status: "active",
    },
  });

  const agencyDesigner = await prisma.user.create({
    data: {
      email: "designer@webfunnel.com",
      firstName: "Emily",
      lastName: "Designer",
      passwordHash: hashedPassword,
      emailVerified: true,
      isSuperAdmin: false,
      agencyRole: "designer",
      status: "active",
    },
  });

  const agencyContentManager = await prisma.user.create({
    data: {
      email: "content@webfunnel.com",
      firstName: "Alex",
      lastName: "Content",
      passwordHash: hashedPassword,
      emailVerified: true,
      isSuperAdmin: false,
      agencyRole: "content_manager",
      status: "active",
    },
  });

  console.log("✅ Created agency team members with different roles");

  // ============================================================================
  // 2. CREATE FIRST CLIENT: MH Bible Baptist Church
  // ============================================================================

  const mhBibleBaptist = await prisma.tenant.create({
    data: {
      slug: "mh-bible-baptist",
      businessName: "MH Bible Baptist Church",
      businessType: "church",
      status: "active",

      // Feature flags - MANUAL UNLOCK MODEL
      enabledFeatures: {
        // === SERVICES (manually unlocked per client) ===
        "service.pages": true, // Pages builder - ENABLED for MH Bible Baptist
        "service.blog": true, // Blog system - ENABLED for MH Bible Baptist
        "service.shop": false, // E-commerce - LOCKED (not purchased)
        "service.bookings": false, // Booking system - LOCKED
        "service.forms": false, // Form builder - LOCKED

        // === PAGES FEATURES ===
        "pages.view": true,
        "pages.edit": false,
        "pages.create": false,
        "pages.delete": false,

        // === BUILDER ACCESS ===
        "builder.access": false,
        "builder.blocks": false,
        "builder.layout": false,

        // === BLOG FEATURES (unlocked because service.blog is true) ===
        "blog.view": true,
        "blog.create": false,
        "blog.edit": false,
        "blog.delete": false,
        "blog.categories": false,
        "blog.tags": false,

        // === CONFIGURATION ===
        "config.header": false,
        "config.footer": false,
        "config.menus": false,
        "config.logos": false,
        "config.theme": false,

        // === ASSETS ===
        "assets.upload": false,
        "assets.delete": false,

        // === USER MANAGEMENT ===
        "users.invite": false,
        "users.manage": false,
      },

      themeConfig: {
        primary: "#1e40af",
        secondary: "#0891b2",
        "space-6": "1.5rem",
        "font-body": "Inter",
      },

      // headerConfig, footerConfig, menusConfig, logosConfig left undefined (will be null)

      contactEmail: "info@mhbiblebaptist.com",
    },
  });

  console.log("✅ Created client tenant:", mhBibleBaptist.businessName);

  // Create church pastor user (locked out by default)
  const churchPastor = await prisma.user.create({
    data: {
      email: "pastor@mhbiblebaptist.com",
      firstName: "John",
      lastName: "Doe",
      passwordHash: hashedPassword,
      emailVerified: true,
      isSuperAdmin: false,
      agencyRole: null,
      status: "active",
    },
  });

  await prisma.tenantUser.create({
    data: {
      userId: churchPastor.id,
      tenantId: mhBibleBaptist.id,
      role: "owner",
      permissions: {},
    },
  });

  console.log("✅ Created church pastor (features locked)");

  // Assign agency team to this project with different roles
  await prisma.projectAssignment.create({
    data: {
      userId: agencyOwner.id,
      tenantId: mhBibleBaptist.id,
      role: "owner",
      permissions: { fullAccess: true },
      status: "active",
    },
  });

  await prisma.projectAssignment.create({
    data: {
      userId: agencyAdmin.id,
      tenantId: mhBibleBaptist.id,
      role: "admin",
      permissions: { canManageSettings: true, canDeploy: false },
      status: "active",
    },
  });

  await prisma.projectAssignment.create({
    data: {
      userId: agencyDeveloper.id,
      tenantId: mhBibleBaptist.id,
      role: "developer",
      permissions: { canDeploy: true, canManageSettings: false },
      status: "active",
    },
  });

  await prisma.projectAssignment.create({
    data: {
      userId: agencyDesigner.id,
      tenantId: mhBibleBaptist.id,
      role: "designer",
      permissions: {},
      status: "active",
    },
  });

  await prisma.projectAssignment.create({
    data: {
      userId: agencyContentManager.id,
      tenantId: mhBibleBaptist.id,
      role: "content_manager",
      permissions: {},
      status: "active",
    },
  });

  console.log("✅ Assigned agency team to MH Bible Baptist project");

  // Create default system pages
  await createDefaultPages(mhBibleBaptist.id, agencyOwner.id);

  console.log("\n🎉 Web and Funnel platform seeded!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Platform: Web and Funnel");
  console.log("Database: webfunnel_dev");
  console.log("");
  console.log("👤 AGENCY TEAM (Test different roles/permissions):");
  console.log("");
  console.log("   🔑 Owner (Super Admin):");
  console.log("      Email: morgansegura@gmail.com");
  console.log("      Password: S3GuRa536!!1980");
  console.log("      Access: FULL PLATFORM + All Admin Rights");
  console.log("");
  console.log("   👔 Admin:");
  console.log("      Email: admin@webfunnel.com");
  console.log("      Password: password123");
  console.log("      Access: Can manage users/features (no delete)");
  console.log("");
  console.log("   💻 Developer:");
  console.log("      Email: dev@webfunnel.com");
  console.log("      Password: password123");
  console.log("      Access: Technical project access");
  console.log("");
  console.log("   🎨 Designer:");
  console.log("      Email: designer@webfunnel.com");
  console.log("      Password: password123");
  console.log("      Access: Design project access");
  console.log("");
  console.log("   📝 Content Manager:");
  console.log("      Email: content@webfunnel.com");
  console.log("      Password: password123");
  console.log("      Access: Content editing access");
  console.log("");
  console.log("🏢 CLIENT TENANT:");
  console.log("   Name: MH Bible Baptist Church");
  console.log("   Slug: mh-bible-baptist");
  console.log("   Features: ALL LOCKED (unlock via admin panel)");
  console.log("");
  console.log("   👤 Church Pastor:");
  console.log("      Email: pastor@mhbiblebaptist.com");
  console.log("      Password: password123");
  console.log("      Access: LOCKED (unlock features as needed)");
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ All users assigned to MH Bible Baptist project");
  console.log("✅ Test RBAC with different user logins");
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
