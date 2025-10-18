import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.transaction.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.chatbot.deleteMany()
  await prisma.package.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@chatbot.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    },
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create Package Plans
  const packages = [
    {
      name: 'starter',
      displayName: 'Starter',
      description: 'Cocok untuk mencoba chatbot AI dasar dengan fitur terbatas',
      price: 0,
      billingCycle: 'monthly',
      sortOrder: 1,
      isActive: true,
      isPopular: false,

      // Feature Limits
      maxChatbots: 1,
      maxMessages: 100,
      maxKnowledgeDocs: 10,
      maxTeamMembers: 1,
      maxApiCalls: 50,

      // Feature Flags
      features: {
        basicAnalytics: true,
        emailSupport: false,
        customBranding: false,
        prioritySupport: false,
        advancedAnalytics: false,
        apiAccess: false,
        whatsappIntegration: false,
        customDomain: false,
        exportData: false,
        ragSystem: false,
      },
      apiAccess: false,
      whatsappIntegration: false,
      customDomain: false,
      prioritySupport: false,
      advancedAnalytics: false,
      customBranding: false,
      exportData: false,
      ragSystem: false,
    },
    {
      name: 'basic',
      displayName: 'Basic',
      description: 'Untuk bisnis kecil yang membutuhkan chatbot profesional',
      price: 299000,
      billingCycle: 'monthly',
      sortOrder: 2,
      isActive: true,
      isPopular: false,

      // Feature Limits
      maxChatbots: 3,
      maxMessages: 1000,
      maxKnowledgeDocs: 50,
      maxTeamMembers: 3,
      maxApiCalls: 500,

      // Feature Flags
      features: {
        basicAnalytics: true,
        emailSupport: true,
        customBranding: false,
        prioritySupport: false,
        advancedAnalytics: false,
        apiAccess: false,
        whatsappIntegration: false,
        customDomain: false,
        exportData: false,
        ragSystem: true,
      },
      apiAccess: false,
      whatsappIntegration: false,
      customDomain: false,
      prioritySupport: false,
      advancedAnalytics: false,
      customBranding: false,
      exportData: false,
      ragSystem: true,
    },
    {
      name: 'pro',
      displayName: 'Pro',
      description: 'Solusi lengkap untuk bisnis yang berkembang dengan dukungan prioritas',
      price: 899000,
      billingCycle: 'monthly',
      sortOrder: 3,
      isActive: true,
      isPopular: true,

      // Feature Limits
      maxChatbots: 10,
      maxMessages: 5000,
      maxKnowledgeDocs: 200,
      maxTeamMembers: 10,
      maxApiCalls: 2500,

      // Feature Flags
      features: {
        basicAnalytics: true,
        emailSupport: true,
        customBranding: true,
        prioritySupport: true,
        advancedAnalytics: true,
        apiAccess: true,
        whatsappIntegration: false,
        customDomain: false,
        exportData: true,
        ragSystem: true,
      },
      apiAccess: true,
      whatsappIntegration: false,
      customDomain: false,
      prioritySupport: true,
      advancedAnalytics: true,
      customBranding: true,
      exportData: true,
      ragSystem: true,
    },
    {
      name: 'enterprise',
      displayName: 'Enterprise',
      description: 'Solusi enterprise kustom dengan semua fitur dan dukungan khusus',
      price: 2499000,
      billingCycle: 'monthly',
      sortOrder: 4,
      isActive: true,
      isPopular: false,

      // Feature Limits
      maxChatbots: 999, // Large number for "unlimited"
      maxMessages: 999999, // Large number for "unlimited"
      maxKnowledgeDocs: 999999, // Large number for "unlimited"
      maxTeamMembers: 999, // Large number for "unlimited"
      maxApiCalls: 999999, // Large number for "unlimited"

      // Feature Flags
      features: {
        basicAnalytics: true,
        emailSupport: true,
        customBranding: true,
        prioritySupport: true,
        advancedAnalytics: true,
        apiAccess: true,
        whatsappIntegration: true,
        customDomain: true,
        exportData: true,
        ragSystem: true,
        dedicatedSupport: true,
        customIntegrations: true,
        slaGuarantee: true,
      },
      apiAccess: true,
      whatsappIntegration: true,
      customDomain: true,
      prioritySupport: true,
      advancedAnalytics: true,
      customBranding: true,
      exportData: true,
      ragSystem: true,
    },
    {
      name: 'basic_yearly',
      displayName: 'Basic (Yearly)',
      description: 'Hemat 20% dengan berlangganan tahunan Basic Plan',
      price: 2870400,
      billingCycle: 'yearly',
      sortOrder: 5,
      isActive: true,
      isPopular: false,

      // Feature Limits (same as monthly basic)
      maxChatbots: 3,
      maxMessages: 1000,
      maxKnowledgeDocs: 50,
      maxTeamMembers: 3,
      maxApiCalls: 500,

      // Feature Flags (same as monthly basic)
      features: {
        basicAnalytics: true,
        emailSupport: true,
        customBranding: false,
        prioritySupport: false,
        advancedAnalytics: false,
        apiAccess: false,
        whatsappIntegration: false,
        customDomain: false,
        exportData: false,
        ragSystem: true,
      },
      apiAccess: false,
      whatsappIntegration: false,
      customDomain: false,
      prioritySupport: false,
      advancedAnalytics: false,
      customBranding: false,
      exportData: false,
      ragSystem: true,
    },
    {
      name: 'pro_yearly',
      displayName: 'Pro (Yearly)',
      description: 'Hemat 20% dengan berlangganan tahunan Pro Plan',
      price: 8611200,
      billingCycle: 'yearly',
      sortOrder: 6,
      isActive: true,
      isPopular: false,

      // Feature Limits (same as monthly pro)
      maxChatbots: 10,
      maxMessages: 5000,
      maxKnowledgeDocs: 200,
      maxTeamMembers: 10,
      maxApiCalls: 2500,

      // Feature Flags (same as monthly pro)
      features: {
        basicAnalytics: true,
        emailSupport: true,
        customBranding: true,
        prioritySupport: true,
        advancedAnalytics: true,
        apiAccess: true,
        whatsappIntegration: false,
        customDomain: false,
        exportData: true,
        ragSystem: true,
      },
      apiAccess: true,
      whatsappIntegration: false,
      customDomain: false,
      prioritySupport: true,
      advancedAnalytics: true,
      customBranding: true,
      exportData: true,
      ragSystem: true,
    },
    {
      name: 'lifetime',
      displayName: 'Lifetime',
      description: 'Akses seumur hidup semua fitur Pro dengan pembayaran sekali',
      price: 14990000,
      billingCycle: 'lifetime',
      sortOrder: 7,
      isActive: true,
      isPopular: false,

      // Feature Limits (same as pro)
      maxChatbots: 10,
      maxMessages: null, // Unlimited for lifetime
      maxKnowledgeDocs: null, // Unlimited for lifetime
      maxTeamMembers: 10,
      maxApiCalls: null, // Unlimited for lifetime

      // Feature Flags (same as pro)
      features: {
        basicAnalytics: true,
        emailSupport: true,
        customBranding: true,
        prioritySupport: true,
        advancedAnalytics: true,
        apiAccess: true,
        whatsappIntegration: false,
        customDomain: false,
        exportData: true,
        ragSystem: true,
        lifetimeAccess: true,
      },
      apiAccess: true,
      whatsappIntegration: false,
      customDomain: false,
      prioritySupport: true,
      advancedAnalytics: true,
      customBranding: true,
      exportData: true,
      ragSystem: true,
    },
  ]

  for (const pkg of packages) {
    await prisma.package.create({
      data: pkg,
    })
    console.log(`✅ Package created: ${pkg.displayName}`)
  }

  // Create sample user with subscription
  const sampleUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'Sample User',
      password: await bcrypt.hash('password123', 10),
      role: 'user',
      isActive: true,
    },
  })

  // Get Pro package
  const proPackage = await prisma.package.findUnique({
    where: { name: 'pro' },
  })

  if (proPackage) {
    // Create active subscription for sample user
    const subscription = await prisma.subscription.create({
      data: {
        userId: sampleUser.id,
        packageId: proPackage.id,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        basePrice: proPackage.price,
        totalAmount: proPackage.price,
        currency: 'IDR',
        isAutoRenew: true,
        usageResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        currentUsage: {
          chatbots: 1,
          messages: 145,
          knowledgeDocs: 12,
          apiCalls: 89,
        },
      },
    })

    // Create sample transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: sampleUser.id,
        subscriptionId: subscription.id,
        type: 'subscription',
        amount: proPackage.price,
        currency: 'IDR',
        status: 'completed',
        description: `Buat langganan ${proPackage.displayName}`,
        paymentMethod: 'credit_card',
        paymentGateway: 'midtrans',
        externalTransactionId: 'MIDTRANS-' + Date.now(),
        baseAmount: proPackage.price,
        totalAmount: proPackage.price,
        paidAt: new Date(),
        nextBillingDate: subscription.nextBillingDate,
      },
    })

    // Create invoice
    await prisma.invoice.create({
      data: {
        userId: sampleUser.id,
        subscriptionId: subscription.id,
        invoiceNumber: generateInvoiceNumber(),
        type: 'subscription',
        status: 'paid',
        description: `Invoice untuk langganan ${proPackage.displayName}`,
        periodStartDate: subscription.startDate,
        periodEndDate: subscription.endDate,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        issuedAt: new Date(),
        paidAt: new Date(),
        subtotal: proPackage.price,
        totalAmount: proPackage.price,
        currency: 'IDR',
        paymentMethod: 'credit_card',
        items: [
          {
            description: `${proPackage.displayName} - Bulanan`,
            quantity: 1,
            unitPrice: proPackage.price,
            total: proPackage.price,
          },
        ],
      },
    })

    // Create sample chatbot
    await prisma.chatbot.create({
      data: {
        userId: sampleUser.id,
        subscriptionId: subscription.id,
        name: 'Customer Service Bot',
        description: 'Chatbot untuk layanan pelanggan',
        persona: 'Customer service representative yang helpful dan professional',
        model: 'gpt-3.5-turbo',
        language: 'id',
        status: 'active',
        temperature: 0.7,
        maxTokens: 1000,
        welcomeMessage: 'Halo! Ada yang bisa saya bantu?',
        totalMessages: 145,
        totalTokens: 15680,
        lastUsedAt: new Date(),
      },
    })

    console.log('✅ Sample subscription and data created')
  }

  console.log('🎉 Database seeding completed!')
}

// Helper function to generate invoice number
function generateInvoiceNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  return `INV/${year}${month}/${random}`
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })