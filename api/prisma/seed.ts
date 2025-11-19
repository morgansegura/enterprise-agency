import { PrismaClient } from '@prisma/client'
import { Logger } from '@nestjs/common'

const prisma = new PrismaClient()
const logger = new Logger('SeedScript')

async function main() {
  logger.log('🌱 Seeding database...')

  // Create super admin (Web & Funnel agency owner)
  const superAdmin = await prisma.user.upsert({
    where: { email: 'morgansegura@gmail.com' },
    update: {},
    create: {
      email: 'morgansegura@gmail.com',
      firstName: 'Morgan',
      lastName: 'Segura',
      emailVerified: true,
      status: 'active',
      isSuperAdmin: true,
      agencyRole: 'owner',
    },
  })

  logger.log(`✅ Created super admin: ${superAdmin.email}`)

  // Create demo tenant
  const demoTenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      slug: 'demo',
      businessName: 'Demo Store',
      businessType: 'ecommerce',
      status: 'active',
      contactEmail: 'hello@demo-store.com',
      contactPhone: '(555) 123-4567',
      enabledFeatures: {
        shop: true,
        cms: true,
        blog: true,
        booking: false,
      },
      themeConfig: {
        template: 'modern-minimal',
        fonts: {
          heading: 'Inter',
          body: 'Inter',
        },
        colors: {
          primary: '#0070f3',
          secondary: '#7928ca',
        },
      },
      planLimits: {
        maxProducts: 100,
        maxPages: 50,
        maxUsers: 5,
        maxStorageMb: 5000,
        maxBandwidthGb: 100,
      },
    },
  })

  logger.log(`✅ Created tenant: ${demoTenant.businessName}`)

  // Create tenant domain
  await prisma.tenantDomain.upsert({
    where: { domain: 'demo.local' },
    update: {},
    create: {
      tenantId: demoTenant.id,
      domain: 'demo.local',
      isPrimary: true,
      sslStatus: 'active',
      environment: 'development',
    },
  })

  logger.log('✅ Created tenant domain: demo.local')

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'admin@demo-store.com' },
    update: {},
    create: {
      email: 'admin@demo-store.com',
      firstName: 'Demo',
      lastName: 'Admin',
      emailVerified: true,
      status: 'active',
    },
  })

  logger.log(`✅ Created user: ${demoUser.email}`)

  // Link user to tenant as owner
  await prisma.tenantUser.upsert({
    where: {
      tenantId_userId: {
        tenantId: demoTenant.id,
        userId: demoUser.id,
      },
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      userId: demoUser.id,
      role: 'owner',
      permissions: {
        pages: { view: true, create: true, edit: true, delete: true },
        products: { view: true, create: true, edit: true, delete: true },
        settings: { view: true, edit: true },
      },
    },
  })

  logger.log('✅ Linked user to tenant as owner')

  // Assign super admin to demo tenant project
  await prisma.projectAssignment.upsert({
    where: {
      userId_tenantId: {
        userId: superAdmin.id,
        tenantId: demoTenant.id,
      },
    },
    update: {},
    create: {
      userId: superAdmin.id,
      tenantId: demoTenant.id,
      role: 'lead',
      status: 'active',
      permissions: {
        fullAccess: true,
      },
    },
  })

  logger.log('✅ Assigned super admin to demo tenant project')

  // Create sample products
  const products = [
    {
      name: 'Premium Wireless Headphones',
      slug: 'premium-wireless-headphones',
      description: 'High-quality wireless headphones with active noise cancellation',
      shortDescription: 'Premium audio experience with ANC',
      price: 299.99,
      compareAtPrice: 399.99,
      cost: 150.0,
      sku: 'WH-1000',
      stockQuantity: 45,
      category: 'Electronics',
      tags: ['audio', 'wireless', 'premium'],
      status: 'active',
      featured: true,
      publishedAt: new Date(),
    },
    {
      name: 'Ergonomic Office Chair',
      slug: 'ergonomic-office-chair',
      description: 'Comfortable office chair with lumbar support and adjustable height',
      shortDescription: 'All-day comfort for your workspace',
      price: 449.99,
      cost: 200.0,
      sku: 'CHAIR-2000',
      stockQuantity: 23,
      category: 'Furniture',
      tags: ['office', 'ergonomic', 'furniture'],
      status: 'active',
      featured: true,
      publishedAt: new Date(),
    },
    {
      name: 'Stainless Steel Water Bottle',
      slug: 'stainless-steel-water-bottle',
      description: 'Insulated water bottle keeps drinks cold for 24h or hot for 12h',
      shortDescription: 'Stay hydrated in style',
      price: 34.99,
      compareAtPrice: 44.99,
      cost: 15.0,
      sku: 'BTL-500',
      stockQuantity: 150,
      category: 'Accessories',
      tags: ['hydration', 'eco-friendly', 'insulated'],
      status: 'active',
      featured: false,
      publishedAt: new Date(),
    },
    {
      name: 'Mechanical Keyboard RGB',
      slug: 'mechanical-keyboard-rgb',
      description: 'Gaming mechanical keyboard with customizable RGB lighting',
      shortDescription: 'Level up your typing experience',
      price: 159.99,
      cost: 80.0,
      sku: 'KB-RGB-100',
      stockQuantity: 67,
      category: 'Electronics',
      tags: ['gaming', 'keyboard', 'rgb'],
      status: 'active',
      featured: false,
      publishedAt: new Date(),
    },
    {
      name: 'Yoga Mat Premium',
      slug: 'yoga-mat-premium',
      description: 'Extra thick yoga mat with non-slip surface and carrying strap',
      shortDescription: 'Perfect for home workouts',
      price: 59.99,
      cost: 25.0,
      sku: 'YM-PRO',
      stockQuantity: 89,
      category: 'Fitness',
      tags: ['yoga', 'fitness', 'wellness'],
      status: 'active',
      featured: false,
      publishedAt: new Date(),
    },
    {
      name: 'Smart Watch Series 5',
      slug: 'smart-watch-series-5',
      description: 'Fitness tracking smartwatch with heart rate monitor and GPS',
      shortDescription: 'Track your fitness journey',
      price: 399.99,
      compareAtPrice: 499.99,
      cost: 200.0,
      sku: 'SW-5000',
      stockQuantity: 34,
      category: 'Electronics',
      tags: ['wearable', 'fitness', 'smart'],
      status: 'active',
      featured: true,
      publishedAt: new Date(),
    },
    {
      name: 'Coffee Maker Deluxe',
      slug: 'coffee-maker-deluxe',
      description: 'Programmable coffee maker with thermal carafe and brew strength control',
      shortDescription: 'Start your day right',
      price: 129.99,
      cost: 60.0,
      sku: 'CM-DLX',
      stockQuantity: 28,
      category: 'Kitchen',
      tags: ['coffee', 'kitchen', 'appliances'],
      status: 'active',
      featured: false,
      publishedAt: new Date(),
    },
    {
      name: 'Laptop Stand Aluminum',
      slug: 'laptop-stand-aluminum',
      description: 'Adjustable aluminum laptop stand for better ergonomics',
      shortDescription: 'Elevate your workspace',
      price: 49.99,
      cost: 20.0,
      sku: 'LS-ALU',
      stockQuantity: 0,
      category: 'Accessories',
      tags: ['laptop', 'ergonomic', 'desk'],
      status: 'active',
      featured: false,
      publishedAt: new Date(),
    },
  ]

  const createdProducts = []
  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: {
        tenantId_slug: {
          tenantId: demoTenant.id,
          slug: productData.slug,
        },
      },
      update: {},
      create: {
        ...productData,
        tenantId: demoTenant.id,
      },
    })
    createdProducts.push(product)
    logger.log(`✅ Created product: ${productData.name}`)
  }

  // Create customers
  logger.log('👥 Creating customers...')

  const customerData = [
    {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1-555-0101',
    },
    {
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1-555-0102',
    },
    {
      email: 'mike.johnson@example.com',
      firstName: 'Mike',
      lastName: 'Johnson',
      phone: '+1-555-0103',
    },
    {
      email: 'sarah.williams@example.com',
      firstName: 'Sarah',
      lastName: 'Williams',
      phone: '+1-555-0104',
    },
    {
      email: 'david.brown@example.com',
      firstName: 'David',
      lastName: 'Brown',
      phone: '+1-555-0105',
    },
  ]

  const createdCustomers = []
  for (const customerInfo of customerData) {
    const customer = await prisma.customer.upsert({
      where: {
        tenantId_email: {
          tenantId: demoTenant.id,
          email: customerInfo.email,
        },
      },
      update: {},
      create: {
        tenantId: demoTenant.id,
        email: customerInfo.email,
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        phone: customerInfo.phone,
        status: 'active',
      },
    })
    createdCustomers.push(customer)
    logger.log(`✅ Created customer: ${customer.email}`)
  }

  // Create sample orders
  logger.log('📦 Creating orders...')

  const orderStatuses = ['pending', 'processing', 'completed', 'completed']
  const paymentStatuses = ['pending', 'paid', 'paid', 'paid']
  const fulfillmentStatuses = ['unfulfilled', 'unfulfilled', 'fulfilled', 'fulfilled']

  let orderNumber = 1001

  for (let i = 0; i < 25; i++) {
    const customerInfo = customerData[i % customerData.length]
    const statusIndex = Math.floor(Math.random() * orderStatuses.length)

    // Pick 1-3 random products
    const numItems = Math.floor(Math.random() * 3) + 1
    const selectedProducts = []
    for (let j = 0; j < numItems; j++) {
      const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)]
      selectedProducts.push(randomProduct)
    }

    const orderItems = selectedProducts.map((product) => {
      const quantity = Math.floor(Math.random() * 3) + 1
      return {
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        price: Number(product.price),
        quantity,
        subtotal: Number(product.price) * quantity,
      }
    })

    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0)
    const tax = subtotal * 0.08
    const shipping = 12.99
    const total = subtotal + tax + shipping

    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)

    await prisma.order.create({
      data: {
        tenantId: demoTenant.id,
        orderNumber: `ORD-${orderNumber++}`,
        customerEmail: customerInfo.email,
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customerPhone: customerInfo.phone,
        subtotal,
        tax,
        shipping,
        discount: 0,
        total,
        currency: 'USD',
        shippingName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        shippingAddress1: `${Math.floor(Math.random() * 9999) + 1} Main St`,
        shippingCity: 'New York',
        shippingState: 'NY',
        shippingPostalCode: '10001',
        shippingCountry: 'US',
        billingName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        billingAddress1: `${Math.floor(Math.random() * 9999) + 1} Main St`,
        billingCity: 'New York',
        billingState: 'NY',
        billingPostalCode: '10001',
        billingCountry: 'US',
        paymentStatus: paymentStatuses[statusIndex],
        paymentMethod: 'credit_card',
        fulfillmentStatus: fulfillmentStatuses[statusIndex],
        status: orderStatuses[statusIndex],
        paidAt: paymentStatuses[statusIndex] === 'paid' ? createdAt : null,
        shippedAt:
          fulfillmentStatuses[statusIndex] === 'fulfilled'
            ? new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000)
            : null,
        createdAt,
        orderItems: {
          create: orderItems,
        },
      },
    })
  }

  logger.log(`✅ Created 25 orders`)

  // Update customer stats
  logger.log('📊 Updating customer stats...')
  const customers = await prisma.customer.findMany({
    where: { tenantId: demoTenant.id },
  })

  for (const customer of customers) {
    const orders = await prisma.order.findMany({
      where: {
        tenantId: demoTenant.id,
        customerEmail: customer.email,
        paymentStatus: 'paid',
      },
    })

    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total), 0)
    const averageOrder = totalOrders > 0 ? totalSpent / totalOrders : 0

    const firstOrder = orders.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0]
    const lastOrder = orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        totalOrders,
        totalSpent,
        averageOrder,
        firstOrderAt: firstOrder?.createdAt || null,
        lastOrderAt: lastOrder?.createdAt || null,
      },
    })
  }

  logger.log(`✅ Updated stats for ${customers.length} customers`)

  // Create sample pages
  const pages = [
    {
      slug: 'home',
      title: 'Home',
      content: {
        blocks: [
          {
            type: 'hero',
            heading: 'Welcome to Demo Store',
            subheading: 'Premium products for modern living',
          },
          {
            type: 'text',
            html: '<p>Discover our curated collection of high-quality products.</p>',
          },
        ],
      },
      status: 'published',
      template: 'landing',
      publishedAt: new Date(),
    },
    {
      slug: 'about',
      title: 'About Us',
      content: {
        blocks: [
          {
            type: 'text',
            html: '<h1>About Demo Store</h1><p>We are passionate about providing the best products.</p>',
          },
        ],
      },
      status: 'published',
      template: 'default',
      publishedAt: new Date(),
    },
  ]

  for (const pageData of pages) {
    await prisma.page.upsert({
      where: {
        tenantId_slug: {
          tenantId: demoTenant.id,
          slug: pageData.slug,
        },
      },
      update: {},
      create: {
        ...pageData,
        tenantId: demoTenant.id,
        authorId: demoUser.id,
      },
    })
    logger.log(`✅ Created page: ${pageData.title}`)
  }

  // Create sample subscription
  await prisma.subscription.upsert({
    where: { id: demoTenant.id },
    update: {},
    create: {
      tenantId: demoTenant.id,
      planId: 'growth',
      planConfig: {
        name: 'Growth',
        dashboardAccess: true,
        maxProducts: 200,
        maxPages: 50,
        maxUsers: 10,
        features: ['shop', 'cms', 'blog'],
      },
      status: 'active',
      basePrice: 49.0,
      featureAddons: {
        shop: 20,
        cms: 0,
        blog: 10,
      },
      totalMrr: 79.0,
      currency: 'USD',
      billingInterval: 'monthly',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  })

  logger.log('✅ Created subscription (Growth plan with dashboard access)')

  logger.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    logger.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
