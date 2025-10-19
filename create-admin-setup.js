const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminSetup() {
  try {
    console.log('🚀 Membuat setup admin...');

    // 1. Buat user admin
    console.log('1. Membuat user admin...');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    let adminUser = await prisma.user.findFirst({
      where: { email: 'admin@admin.com' }
    });

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: 'admin@admin.com',
          name: 'Admin User',
          password: hashedPassword,
          role: 'admin',
          isActive: true,
        }
      });
      console.log('✅ User admin berhasil dibuat');
    } else {
      console.log('ℹ️ User admin sudah ada');
    }

    // 2. Buat admin package
    console.log('2. Membuat admin package...');

    let adminPackage = await prisma.package.findFirst({
      where: { name: 'admin-package' }
    });

    if (!adminPackage) {
      adminPackage = await prisma.package.create({
        data: {
          name: 'admin-package',
          displayName: 'Admin Package',
          description: 'Free package for administrator with unlimited access',
          price: 0,
          billingCycle: 'lifetime',
          currency: 'IDR',
          sortOrder: 0,
          isActive: true,
          isPopular: false,

          // Feature Limits - Unlimited for admin
          maxChatbots: 999,
          maxMessages: null,
          maxKnowledgeDocs: null,
          maxTeamMembers: 999,
          maxApiCalls: null,

          // All Features Enabled
          features: {
            apiAccess: true,
            whatsappIntegration: true,
            customDomain: true,
            prioritySupport: true,
            advancedAnalytics: true,
            customBranding: true,
            exportData: true,
            ragSystem: true
          },
          apiAccess: true,
          whatsappIntegration: true,
          customDomain: true,
          prioritySupport: true,
          advancedAnalytics: true,
          customBranding: true,
          exportData: true,
          ragSystem: true
        }
      });
      console.log('✅ Admin package berhasil dibuat');
    } else {
      console.log('ℹ️ Admin package sudah ada');
    }

    // 3. Buat default subscription untuk admin
    console.log('3. Membuat default subscription...');

    let adminSubscription = await prisma.subscription.findFirst({
      where: {
        userId: adminUser.id
      }
    });

    if (!adminSubscription) {
      adminSubscription = await prisma.subscription.create({
        data: {
          userId: adminUser.id,
          packageId: adminPackage.id,
          status: 'active',
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 10)), // 10 tahun
          nextBillingDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 tahun
          isAutoRenew: false,
          basePrice: 0,
          discountAmount: 0,
          taxAmount: 0,
          totalAmount: 0,
          currency: 'IDR',
        }
      });
      console.log('✅ Default subscription admin berhasil dibuat');
    } else {
      console.log('ℹ️ Subscription admin sudah ada');
    }

    // 4. Buat chatbot untuk admin
    console.log('4. Membuat chatbot admin...');

    let adminChatbot = await prisma.chatbot.findFirst({
      where: {
        userId: adminUser.id,
        name: 'AI Assistant Admin'
      }
    });

    if (!adminChatbot) {
      adminChatbot = await prisma.chatbot.create({
        data: {
          userId: adminUser.id,
          subscriptionId: adminSubscription.id,
          name: 'AI Assistant Admin',
          description: 'Assistant AI untuk admin dengan persona profesional',
          model: 'gpt-3.5-turbo',
          language: 'id',
          status: 'active',
          temperature: 0.7,
          maxTokens: 1000,
          welcomeMessage: 'Halo! Saya adalah AI Assistant Admin. Ada yang bisa saya bantu?',
          isPublic: false,
          systemPrompt: 'Anda adalah asisten AI profesional yang membantu admin dalam mengelola sistem. Gunakan bahasa yang sopan, informatif, dan profesional. Berikan jawaban yang jelas dan membantu.',
        }
      });
      console.log('✅ Chatbot admin berhasil dibuat');
    } else {
      console.log('ℹ️ Chatbot admin sudah ada');
    }

    // 5. Buat persona untuk admin
    console.log('5. Membuat persona admin...');

    let adminPersona = await prisma.persona.findFirst({
      where: {
        name: 'Professional Admin Assistant',
        userId: adminUser.id
      }
    });

    if (!adminPersona) {
      adminPersona = await prisma.persona.create({
        data: {
          userId: adminUser.id,
          name: 'Professional Admin Assistant',
          slug: 'professional-admin-assistant',
          welcomeMessage: 'Selamat datang! Saya adalah asisten AI profesional yang siap membantu Anda mengelola sistem ini. Ada yang bisa saya bantu hari ini?',
          selectedProfile: 'islamic_educator',

          // Text Style Settings
          formality: 'professional',
          empathy: 'high',
          enthusiasm: 'medium',
          humor: 'low',
          verbosity: 'medium',

          // Behavior Settings
          knowledgeDomain: 'general',
          languageStyle: 'professional',
          culturalContext: 'indonesian',
          expertise: 'expert',
          personality: 'helpful',

          // Response Settings
          maxLength: 500,
          minResponseTime: 1.0,
          maxResponseTime: 5.0,

          isActive: true
        }
      });
      console.log('✅ Persona admin berhasil dibuat');
    } else {
      console.log('ℹ️ Persona admin sudah ada');
    }

    // 6. Hubungkan persona ke chatbot
    console.log('6. Menghubungkan persona ke chatbot...');

    await prisma.chatbot.update({
      where: { id: adminChatbot.id },
      data: { persona: adminPersona.id }
    });
    console.log('✅ Persona berhasil dihubungkan ke chatbot');

    // 5. Tampilkan hasil setup
    console.log('\n🎉 Setup admin berhasil!');
    console.log('====================================');
    console.log('📧 Email Login: admin@admin.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Nama: Admin User');
    console.log('🔐 Role: admin');
    console.log('🤖 Chatbot ID:', adminChatbot.id);
    console.log('🎭 Persona ID:', adminPersona.id);
    console.log('====================================');

    console.log('\n✨ Anda sekarang bisa:');
    console.log('1. Login dengan akun admin');
    console.log('2. Chatbot akan menggunakan persona admin secara default');
    console.log('3. Floating chat akan terhubung ke chatbot admin');

  } catch (error) {
    console.error('❌ Error saat membuat setup admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminSetup();