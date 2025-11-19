import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Web and Funnel platform database...')

  // Clean existing data (development only)
  await prisma.tenantUser.deleteMany()
  await prisma.projectAssignment.deleteMany()
  await prisma.page.deleteMany()
  await prisma.post.deleteMany()
  await prisma.asset.deleteMany()
  await prisma.tenant.deleteMany()
  await prisma.user.deleteMany()

  // ============================================================================
  // 1. CREATE AGENCY OWNER (YOU - Mo)
  // ============================================================================

  const hashedPassword = await bcrypt.hash('password123', 10)

  const agencyOwner = await prisma.user.create({
    data: {
      email: 'mo@webfunnel.com',
      firstName: 'Morgan',
      lastName: 'Segura',
      passwordHash: hashedPassword,
      emailVerified: true,
      isSuperAdmin: true,
      agencyRole: 'owner',
      status: 'active',
    },
  })

  console.log('✅ Created Web and Funnel owner:', agencyOwner.email)

  // ============================================================================
  // 2. CREATE FIRST CLIENT: MH Bible Baptist Church
  // ============================================================================

  const mhBibleBaptist = await prisma.tenant.create({
    data: {
      slug: 'mh-bible-baptist',
      businessName: 'MH Bible Baptist Church',
      businessType: 'church',
      status: 'active',

      // Feature flags - ALL LOCKED by default
      enabledFeatures: {
        'pages.view': true,
        'pages.edit': false,
        'pages.create': false,
        'pages.delete': false,
        'builder.access': false,
        'builder.blocks': false,
        'builder.layout': false,
        'config.header': false,
        'config.footer': false,
        'config.menus': false,
        'config.logos': false,
        'assets.upload': false,
        'assets.delete': false,
        'users.invite': false,
        'users.manage': false,
        'posts.create': false,
        'posts.edit': false,
        'posts.delete': false,
      },

      themeConfig: {
        colors: {
          primary: '#1e40af',
          secondary: '#0891b2',
        },
      },

      // headerConfig, footerConfig, menusConfig, logosConfig left undefined (will be null)

      contactEmail: 'info@mhbiblebaptist.com',
    },
  })

  console.log('✅ Created client tenant:', mhBibleBaptist.businessName)

  // Create church pastor user (locked out by default)
  const churchPastor = await prisma.user.create({
    data: {
      email: 'pastor@mhbiblebaptist.com',
      firstName: 'John',
      lastName: 'Doe',
      passwordHash: hashedPassword,
      emailVerified: true,
      isSuperAdmin: false,
      agencyRole: null,
      status: 'active',
    },
  })

  await prisma.tenantUser.create({
    data: {
      userId: churchPastor.id,
      tenantId: mhBibleBaptist.id,
      role: 'owner',
      permissions: {},
    },
  })

  console.log('✅ Created church pastor (features locked)')

  // Assign you to this project
  await prisma.projectAssignment.create({
    data: {
      userId: agencyOwner.id,
      tenantId: mhBibleBaptist.id,
      role: 'owner',
      permissions: { fullAccess: true },
      status: 'active',
    },
  })

  console.log('✅ Assigned you to MH Bible Baptist project')

  // Create sample homepage
  await prisma.page.create({
    data: {
      tenantId: mhBibleBaptist.id,
      authorId: agencyOwner.id,
      slug: 'home',
      title: 'Welcome to MH Bible Baptist Church',
      status: 'draft',
      content: {
        sections: [
          {
            _type: 'section',
            _key: 'hero',
            background: 'primary',
            spacing: '2xl',
            blocks: [
              {
                _type: 'heading-block',
                _key: 'h1',
                data: {
                  text: 'Welcome to Our Church',
                  level: 'h1',
                  size: '6xl',
                  align: 'center',
                },
              },
            ],
          },
        ],
      },
      metaTitle: 'MH Bible Baptist Church',
    },
  })

  console.log('\n🎉 Web and Funnel platform seeded!\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Platform: Web and Funnel')
  console.log('Database: webfunnel_dev')
  console.log('')
  console.log('👤 Agency Owner:')
  console.log('   Email: mo@webfunnel.com')
  console.log('   Password: password123')
  console.log('   Access: FULL PLATFORM')
  console.log('')
  console.log('🏢 First Client:')
  console.log('   MH Bible Baptist Church')
  console.log('   Slug: mh-bible-baptist')
  console.log('   Features: ALL LOCKED')
  console.log('')
  console.log('👤 Church Pastor:')
  console.log('   Email: pastor@mhbiblebaptist.com')
  console.log('   Password: password123')
  console.log('   Access: LOCKED (unlock features as needed)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
