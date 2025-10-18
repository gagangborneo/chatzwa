const { generateToken } = require('./src/lib/auth.ts')

async function generateTestToken() {
  try {
    const token = await generateToken({
      userId: 'regular_user_id',
      email: 'user@7connect.id',
      role: 'user',
      name: 'Regular User'
    })

    console.log('Generated token:', token)
    return token
  } catch (error) {
    console.error('Error generating token:', error)
  }
}

generateTestToken()