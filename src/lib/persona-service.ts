import { db } from '@/lib/db'

// Types
export interface PersonaData {
  id?: string
  name: string
  welcomeMessage: string
  selectedProfile?: string
  formality?: string
  empathy?: string
  enthusiasm?: string
  humor?: string
  verbosity?: string
  knowledgeDomain?: string
  languageStyle?: string
  culturalContext?: string
  expertise?: string
  personality?: string
  maxLength?: number
  minResponseTime?: number
  maxResponseTime?: number
  useEmojis?: boolean
  includeGreeting?: boolean
  askFollowUp?: boolean
  systemPrompt?: string
  customInstructions?: string
  isActive?: boolean
  userId?: string
}

// Create or Update Persona
export async function savePersona(data: PersonaData, userId?: string) {
  try {
    const personaData = {
      name: data.name,
      welcomeMessage: data.welcomeMessage,
      selectedProfile: data.selectedProfile || 'islamic_educator',
      formality: data.formality || 'professional',
      empathy: data.empathy || 'high',
      enthusiasm: data.enthusiasm || 'medium',
      humor: data.humor || 'low',
      verbosity: data.verbosity || 'medium',
      knowledgeDomain: data.knowledgeDomain || 'islamic_education',
      languageStyle: data.languageStyle || 'friendly',
      culturalContext: data.culturalContext || 'indonesian',
      expertise: data.expertise || 'general',
      personality: data.personality || 'helpful',
      maxLength: data.maxLength || 500,
      minResponseTime: data.minResponseTime || 1.0,
      maxResponseTime: data.maxResponseTime || 5.0,
      useEmojis: data.useEmojis ?? true,
      includeGreeting: data.includeGreeting ?? true,
      askFollowUp: data.askFollowUp ?? true,
      systemPrompt: data.systemPrompt || '',
      customInstructions: data.customInstructions || '',
      isActive: data.isActive ?? false,
      userId: userId || null
    }

    if (data.id) {
      // Update existing persona
      const persona = await db.persona.update({
        where: { id: data.id },
        data: personaData
      })
      return persona
    } else {
      // Create new persona
      const persona = await db.persona.create({
        data: personaData
      })
      return persona
    }
  } catch (error) {
    console.error('Error saving persona:', error)
    throw new Error('Failed to save persona')
  }
}

// Get Persona by ID
export async function getPersonaById(id: string) {
  try {
    const persona = await db.persona.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    return persona
  } catch (error) {
    console.error('Error getting persona:', error)
    throw new Error('Failed to get persona')
  }
}

// Get All Personas (optional: by user)
export async function getAllPersonas(userId?: string) {
  try {
    const personas = await db.persona.findMany({
      where: userId ? { userId } : {},
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
    return personas
  } catch (error) {
    console.error('Error getting personas:', error)
    throw new Error('Failed to get personas')
  }
}

// Get Active Persona
export async function getActivePersona(userId?: string) {
  try {
    const persona = await db.persona.findFirst({
      where: {
        isActive: true,
        ...(userId && { userId })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    return persona
  } catch (error) {
    console.error('Error getting active persona:', error)
    throw new Error('Failed to get active persona')
  }
}

// Set Active Persona
export async function setActivePersona(personaId: string, userId?: string) {
  try {
    // First, deactivate all personas for this user (or all if no userId)
    await db.persona.updateMany({
      where: userId ? { userId } : {},
      data: { isActive: false }
    })

    // Then activate the specified persona
    const persona = await db.persona.update({
      where: { id: personaId },
      data: { isActive: true }
    })

    return persona
  } catch (error) {
    console.error('Error setting active persona:', error)
    throw new Error('Failed to set active persona')
  }
}

// Delete Persona
export async function deletePersona(id: string) {
  try {
    const persona = await db.persona.delete({
      where: { id }
    })
    return persona
  } catch (error) {
    console.error('Error deleting persona:', error)
    throw new Error('Failed to delete persona')
  }
}

// Duplicate Persona
export async function duplicatePersona(id: string, newName?: string) {
  try {
    const originalPersona = await getPersonaById(id)
    if (!originalPersona) {
      throw new Error('Original persona not found')
    }

    const duplicatedPersona = await db.persona.create({
      data: {
        name: newName || `${originalPersona.name} (Copy)`,
        welcomeMessage: originalPersona.welcomeMessage,
        selectedProfile: originalPersona.selectedProfile,
        formality: originalPersona.formality,
        empathy: originalPersona.empathy,
        enthusiasm: originalPersona.enthusiasm,
        humor: originalPersona.humor,
        verbosity: originalPersona.verbosity,
        knowledgeDomain: originalPersona.knowledgeDomain,
        languageStyle: originalPersona.languageStyle,
        culturalContext: originalPersona.culturalContext,
        expertise: originalPersona.expertise,
        personality: originalPersona.personality,
        maxLength: originalPersona.maxLength,
        minResponseTime: originalPersona.minResponseTime,
        maxResponseTime: originalPersona.maxResponseTime,
        useEmojis: originalPersona.useEmojis,
        includeGreeting: originalPersona.includeGreeting,
        askFollowUp: originalPersona.askFollowUp,
        systemPrompt: originalPersona.systemPrompt,
        customInstructions: originalPersona.customInstructions,
        isActive: false, // Duplicated personas are not active by default
        userId: originalPersona.userId
      }
    })

    return duplicatedPersona
  } catch (error) {
    console.error('Error duplicating persona:', error)
    throw new Error('Failed to duplicate persona')
  }
}

// Get Personas by Profile Type
export async function getPersonasByProfile(profile: string, userId?: string) {
  try {
    const personas = await db.persona.findMany({
      where: {
        selectedProfile: profile,
        ...(userId && { userId })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
    return personas
  } catch (error) {
    console.error('Error getting personas by profile:', error)
    throw new Error('Failed to get personas by profile')
  }
}

// Search Personas
export async function searchPersonas(query: string, userId?: string) {
  try {
    const personas = await db.persona.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { welcomeMessage: { contains: query, mode: 'insensitive' } },
          { systemPrompt: { contains: query, mode: 'insensitive' } },
          { customInstructions: { contains: query, mode: 'insensitive' } }
        ],
        ...(userId && { userId })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
    return personas
  } catch (error) {
    console.error('Error searching personas:', error)
    throw new Error('Failed to search personas')
  }
}