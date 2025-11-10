// Simple test for chatbot creation
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testChatbotCRUD() {
  try {
    console.log('🧪 Testing Chatbot CRUD Operations...')

    // Test creating a user first (if doesn't exist)
    let user = await prisma.user.findUnique({
      where: { email: 'user@chatzku.id' }
    })

    if (!user) {
      console.log('📝 Creating test user...')
      user = await prisma.user.create({
        data: {
          email: 'user@chatzku.id',
          name: 'Regular User',
          password: 'hashed_password',
          role: 'user',
          isActive: true
        }
      })
      console.log('✅ User created:', user.email)
    } else {
      console.log('✅ User exists:', user.email)
    }

    // Test creating a persona (chatbot)
    console.log('📝 Creating test chatbot...')
    const persona = await prisma.persona.create({
      data: {
        name: 'Test Chatbot',
        welcomeMessage: 'Hello! I am a test chatbot for CRUD testing.',
        selectedProfile: 'islamic_educator',
        formality: 'professional',
        empathy: 'high',
        enthusiasm: 'medium',
        humor: 'low',
        verbosity: 'medium',
        knowledgeDomain: 'islamic_education',
        languageStyle: 'friendly',
        culturalContext: 'indonesian',
        expertise: 'general',
        personality: 'helpful',
        maxLength: 500,
        minResponseTime: 1.0,
        maxResponseTime: 5.0,
        useEmojis: true,
        includeGreeting: true,
        askFollowUp: true,
        systemPrompt: '',
        customInstructions: '',
        isActive: true,
        createdBy: user.id,
        userId: user.id
      }
    })

    console.log('✅ Chatbot created:', persona.name, '(ID:', persona.id, ')')

    // Test reading personas
    console.log('📖 Reading all chatbots for user...')
    const personas = await prisma.persona.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { chatMessages: true }
        }
      }
    })

    console.log('✅ Found', personas.length, 'chatbots:')
    personas.forEach(p => {
      console.log('  -', p.name, '(Messages:', p._count.chatMessages, ')')
    })

    // Test updating persona
    console.log('📝 Updating chatbot...')
    const updatedPersona = await prisma.persona.update({
      where: { id: persona.id },
      data: {
        welcomeMessage: 'Updated welcome message for testing.',
        isActive: false
      }
    })

    console.log('✅ Chatbot updated:', updatedPersona.welcomeMessage)

    // Test deleting persona
    console.log('🗑️  Deleting chatbot...')
    await prisma.persona.delete({
      where: { id: persona.id }
    })

    console.log('✅ Chatbot deleted successfully')

    // Verify deletion
    const remainingPersonas = await prisma.persona.findMany({
      where: { userId: user.id }
    })

    console.log('✅ Verification: Remaining chatbots:', remainingPersonas.length)

    console.log('🎉 All CRUD operations completed successfully!')

  } catch (error) {
    console.error('❌ Error during CRUD testing:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testChatbotCRUD()