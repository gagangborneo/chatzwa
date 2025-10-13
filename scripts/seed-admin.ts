import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@admin.com' }
    })

    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('password', 12)

    const admin = await prisma.user.create({
      data: {
        email: 'admin@admin.com',
        name: 'Administrator',
        password: hashedPassword,
        role: 'admin',
        isActive: true
      }
    })

    console.log('Admin user created successfully:')
    console.log('Email: admin@admin.com')
    console.log('Password: password')
    console.log('User ID:', admin.id)

  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()