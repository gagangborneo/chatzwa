import { NextResponse } from 'next/server'
import { getRAGService } from '@/lib/rag-service'

export async function GET() {
  try {
    console.log('Testing RAG system...')

    const ragService = getRAGService()

    // Test health check
    console.log('1. Checking RAG service health...')
    const health = await ragService.checkHealth()
    console.log('Health status:', health)

    let result = {
      success: true,
      health,
      tests: []
    }

    if (health.ollama && health.chroma) {
      console.log('✅ Both services are available!')

      try {
        // Test embedding generation
        console.log('2. Testing embedding generation...')
        const embeddings = await ragService.generateEmbeddings(['Hello world test'])
        const embeddingDimension = embeddings[0]?.length || 0

        result.tests.push({
          test: 'Embedding Generation',
          success: true,
          result: `Generated ${embeddingDimension} dimensions`
        })

        // Test collection creation
        console.log('3. Testing collection creation...')
        const collectionCreated = await ragService.createCollection()

        result.tests.push({
          test: 'Collection Creation',
          success: collectionCreated,
          result: collectionCreated ? 'Collection created/verified' : 'Failed to create collection'
        })

        // Test collection info
        console.log('4. Getting collection info...')
        const collectionInfo = await ragService.getCollectionInfo()

        result.tests.push({
          test: 'Collection Info',
          success: !!collectionInfo,
          result: collectionInfo ? `Collection has ${collectionInfo.count} documents` : 'No collection info'
        })

        console.log('✅ RAG system test completed successfully!')

      } catch (testError) {
        console.error('Error during RAG functionality tests:', testError)
        result.tests.push({
          test: 'Functionality Tests',
          success: false,
          error: testError instanceof Error ? testError.message : 'Unknown error'
        })
      }

    } else {
      console.log('❌ Some services are not available')
      result.success = false
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ Error during RAG test:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}