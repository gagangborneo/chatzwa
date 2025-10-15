import { getRAGService, SyncHistory } from './rag-service'

export interface SyncHistoryManager {
  addSyncRecord: (sync: Omit<SyncHistory, 'id' | 'timestamp'>) => Promise<void>
  getSyncHistory: (limit?: number) => Promise<SyncHistory[]>
  getSyncById: (id: string) => Promise<SyncHistory | null>
  deleteSyncRecord: (id: string) => Promise<boolean>
}

class SyncHistoryManagerImpl implements SyncHistoryManager {
  private storageKey = 'rag_sync_history'

  async addSyncRecord(sync: Omit<SyncHistory, 'id' | 'timestamp'>): Promise<void> {
    const records = await this.getSyncHistory()
    const newRecord: SyncHistory = {
      ...sync,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
    }

    records.unshift(newRecord) // Add to beginning (most recent first)

    // Keep only last 100 records
    if (records.length > 100) {
      records.splice(100)
    }

    // Save to localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(records))

    // Also try to save to database if available
    try {
      await fetch('/api/sync/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecord),
      })
    } catch (error) {
      console.warn('Failed to save sync record to database:', error)
    }
  }

  async getSyncHistory(limit: number = 50): Promise<SyncHistory[]> {
    // Try to get from API first
    try {
      const response = await fetch(`/api/sync/history?limit=${limit}`)
      if (response.ok) {
        const apiRecords = await response.json()
        // Update localStorage cache
        localStorage.setItem(this.storageKey, JSON.stringify(apiRecords))
        return apiRecords
      }
    } catch (error) {
      console.warn('Failed to fetch sync history from API:', error)
    }

    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        const records = JSON.parse(stored)
        return records.slice(0, limit)
      }
    } catch (error) {
      console.error('Error reading sync history from localStorage:', error)
    }

    return []
  }

  async getSyncById(id: string): Promise<SyncHistory | null> {
    const records = await this.getSyncHistory()
    return records.find(record => record.id === id) || null
  }

  async deleteSyncRecord(id: string): Promise<boolean> {
    const records = await this.getSyncHistory()
    const filteredRecords = records.filter(record => record.id !== id)

    localStorage.setItem(this.storageKey, JSON.stringify(filteredRecords))

    // Try to delete from database
    try {
      await fetch(`/api/sync/history/${id}`, {
        method: 'DELETE',
      })
      return true
    } catch (error) {
      console.warn('Failed to delete sync record from database:', error)
      return true // Still return true since localStorage was updated
    }
  }

  private generateId(): string {
    return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

export const syncHistoryManager: SyncHistoryManager = new SyncHistoryManagerImpl()

// RAG Data Synchronizer
export class RAGDataSynchronizer {
  private ragService = getRAGService()

  async synchronizeData(
    dataSource: string,
    syncType: 'full' | 'incremental' = 'incremental',
    documents?: any[]
  ): Promise<{
    success: boolean
    processed: number
    failed: number
    errors: string[]
    duration: number
  }> {
    const startTime = Date.now()
    const errors: string[] = []
    let processed = 0
    let failed = 0

    try {
      // Check RAG service health
      const health = await this.ragService.checkHealth()
      if (!health.ollama) {
        errors.push('Ollama service is not available')
        return this.createSyncResult(false, processed, failed, errors, Date.now() - startTime)
      }
      if (!health.chroma) {
        errors.push('ChromaDB service is not available')
        return this.createSyncResult(false, processed, failed, errors, Date.now() - startTime)
      }

      // Create collection if it doesn't exist
      await this.ragService.createCollection()

      // Get documents based on data source
      let docsToProcess = documents || await this.getDocumentsFromSource(dataSource)

      if (docsToProcess.length === 0) {
        return this.createSyncResult(true, 0, 0, [], Date.now() - startTime)
      }

      // Process documents in batches
      const batchSize = 10
      for (let i = 0; i < docsToProcess.length; i += batchSize) {
        const batch = docsToProcess.slice(i, i + batchSize)

        try {
          // Generate embeddings
          const texts = batch.map(doc => this.combineDocumentContent(doc))
          const embeddings = await this.ragService.generateEmbeddings(texts)

          // Create embedding results
          const embeddingResults = batch.map((doc, index) => ({
            id: this.generateDocumentId(doc),
            embedding: embeddings[index],
            metadata: {
              title: doc.title || 'Untitled Document',
              content: this.combineDocumentContent(doc),
              category: doc.category || 'general',
              source: dataSource,
              created_at: new Date().toISOString(),
              ...doc.metadata
            }
          }))

          // Store embeddings
          await this.ragService.storeEmbeddings(embeddingResults)
          processed += batch.length

        } catch (batchError) {
          console.error('Error processing batch:', batchError)
          errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${batchError instanceof Error ? batchError.message : 'Unknown error'}`)
          failed += batch.length
        }
      }

    } catch (error) {
      console.error('Error during synchronization:', error)
      errors.push(error instanceof Error ? error.message : 'Unknown synchronization error')
    }

    const duration = Date.now() - startTime
    const result = this.createSyncResult(processed > 0, processed, failed, errors, duration)

    // Save sync history
    await syncHistoryManager.addSyncRecord({
      status: result.success ? 'success' : 'failed',
      documents_processed: processed,
      embeddings_created: processed, // Assuming one embedding per document
      duration,
      error_message: errors.length > 0 ? errors.join('; ') : undefined,
      data_source: dataSource,
      sync_type: syncType
    })

    return result
  }

  private async getDocumentsFromSource(dataSource: string): Promise<any[]> {
    // Mock implementation - in real app, this would fetch from actual data sources
    switch (dataSource) {
      case 'database':
        return this.getDatabaseDocuments()
      case 'wordpress':
        return this.getWordPressDocuments()
      case 'documents':
        return this.getDocumentFiles()
      case 'api':
        return this.getAPIDocuments()
      default:
        return []
    }
  }

  private async getDatabaseDocuments(): Promise<any[]> {
    // Mock database documents
    return [
      {
        id: 'doc_1',
        title: 'Company Overview',
        content: 'Our company provides AI-powered solutions for businesses...',
        category: 'business',
        metadata: { type: 'document', author: 'admin' }
      },
      {
        id: 'doc_2',
        title: 'Product Features',
        content: 'Our product includes advanced AI capabilities, real-time processing...',
        category: 'product',
        metadata: { type: 'document', version: '2.0' }
      }
    ]
  }

  private async getWordPressDocuments(): Promise<any[]> {
    // Mock WordPress documents
    return [
      {
        id: 'wp_1',
        title: 'Latest Blog Post',
        content: 'In this blog post, we discuss the latest trends in AI technology...',
        category: 'blog',
        metadata: { type: 'post', author: 'editor' }
      }
    ]
  }

  private async getDocumentFiles(): Promise<any[]> {
    // Mock document files
    return [
      {
        id: 'file_1',
        title: 'User Guide',
        content: 'This user guide will help you navigate through our platform...',
        category: 'documentation',
        metadata: { type: 'pdf', size: '2.5MB' }
      }
    ]
  }

  private async getAPIDocuments(): Promise<any[]> {
    // Mock API documents
    return [
      {
        id: 'api_1',
        title: 'API Documentation',
        content: 'Our REST API provides comprehensive access to all platform features...',
        category: 'technical',
        metadata: { type: 'api', version: 'v1.0' }
      }
    ]
  }

  private combineDocumentContent(doc: any): string {
    // Combine title and content for better embedding
    const title = doc.title || ''
    const content = doc.content || ''
    const category = doc.category || ''

    return [title, category, content].filter(Boolean).join(' ')
  }

  private generateDocumentId(doc: any): string {
    const baseId = doc.id || doc.title || 'document'
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 6)
    return `${baseId}_${timestamp}_${random}`
  }

  private createSyncResult(
    success: boolean,
    processed: number,
    failed: number,
    errors: string[],
    duration: number
  ) {
    return {
      success,
      processed,
      failed,
      errors,
      duration
    }
  }

  async getSyncStatus(): Promise<{
    ollamaAvailable: boolean
    chromaAvailable: boolean
    collectionExists: boolean
    totalDocuments: number
    lastSync?: SyncHistory
  }> {
    const health = await this.ragService.checkHealth()
    const collectionInfo = await this.ragService.getCollectionInfo()
    const history = await syncHistoryManager.getSyncHistory(1)

    return {
      ollamaAvailable: health.ollama,
      chromaAvailable: health.chroma,
      collectionExists: health.collectionExists,
      totalDocuments: collectionInfo?.count || 0,
      lastSync: history[0]
    }
  }
}

export const ragDataSynchronizer = new RAGDataSynchronizer()