const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAndActivateAdminPersona() {
  try {
    console.log('🔍 Mengecek persona admin yang aktif...');

    // Check for any active persona
    const activePersona = await prisma.persona.findFirst({
      where: { isActive: true },
      include: { user: true }
    });

    if (activePersona) {
      console.log(`ℹ️ Ada persona aktif: ${activePersona.name} (ID: ${activePersona.id})`);
      if (activePersona.user) {
        console.log(`   User: ${activePersona.user.name} (${activePersona.user.email})`);
      }
    } else {
      console.log('ℹ️ Tidak ada persona yang aktif');
    }

    // Find admin persona
    const adminPersona = await prisma.persona.findFirst({
      where: { name: 'Professional Admin Assistant' },
      include: { user: true }
    });

    if (adminPersona) {
      console.log(`🎭 Ditemukan persona admin: ${adminPersona.name} (ID: ${adminPersona.id})`);
      console.log(`   Status: ${adminPersona.isActive ? 'Aktif' : 'Tidak Aktif'}`);

      console.log('🔄 Mengaktifkan persona admin...');

      // Deactivate all personas first
      await prisma.persona.updateMany({
        where: {},
        data: { isActive: false }
      });

      // Activate admin persona
      const updated = await prisma.persona.update({
        where: { id: adminPersona.id },
        data: { isActive: true }
      });

      console.log('✅ Persona admin berhasil diaktifkan!');
      console.log(`   Nama: ${updated.name}`);
      console.log(`   Welcome Message: ${updated.welcomeMessage}`);
    } else {
      console.log('❌ Persona admin tidak ditemukan. Jalankan create-admin-setup.js terlebih dahulu.');
    }

    // Verify active persona after changes
    const currentActive = await prisma.persona.findFirst({
      where: { isActive: true },
      include: { user: true }
    });

    if (currentActive) {
      console.log(`\n🎯 Persona aktif saat ini: ${currentActive.name}`);
      console.log(`   ID: ${currentActive.id}`);
      if (currentActive.user) {
        console.log(`   User: ${currentActive.user.name} (${currentActive.user.email})`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndActivateAdminPersona();