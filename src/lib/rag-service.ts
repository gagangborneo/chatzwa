interface EmbeddingResult {
  id: string;
  embedding: number[];
  metadata: {
    title: string;
    content: string;
    category: string;
    source: string;
    created_at: string;
  };
}

interface RAGConfig {
  ollamaBaseUrl: string;
  embeddingModel: string;
  chromaUrl: string;
  collectionName: string;
}

interface SyncResult {
  success: boolean;
  processed: number;
  failed: number;
  errors: string[];
  duration: number;
}

interface SyncHistory {
  id: string;
  timestamp: string;
  status: 'success' | 'failed' | 'running';
  documents_processed: number;
  embeddings_created: number;
  duration: number;
  error_message?: string;
  data_source: string;
  sync_type: 'full' | 'incremental';
}

class RAGService {
  private config: RAGConfig;

  constructor(config: RAGConfig) {
    this.config = config;
  }

  /**
   * Generate embeddings using Ollama Nomic-embed-text
   */
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      // Handle both single and multiple embeddings
      if (Array.isArray(texts)) {
        const embeddings: number[][] = [];
        for (const text of texts) {
          const response = await fetch(`${this.config.ollamaBaseUrl}/api/embeddings`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: this.config.embeddingModel,
              prompt: text,
            }),
          });

          if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
          }

          const result = await response.json();
          embeddings.push(result.embedding);
        }
        return embeddings;
      } else {
        // Single text
        const response = await fetch(`${this.config.ollamaBaseUrl}/api/embeddings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.config.embeddingModel,
            prompt: texts,
          }),
        });

        if (!response.ok) {
          throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const result = await response.json();
        return [result.embedding];
      }
    } catch (error) {
      console.error('Error generating embeddings:', error);
      throw error;
    }
  }

  /**
   * Store embeddings in ChromaDB (using v2 API)
   */
  async storeEmbeddings(embeddings: EmbeddingResult[]): Promise<boolean> {
    try {
      const payload = {
        ids: embeddings.map(e => e.id),
        embeddings: embeddings.map(e => e.embedding),
        metadatas: embeddings.map(e => e.metadata),
        documents: embeddings.map(e => e.metadata.content),
      };

      const response = await fetch(
        `${this.config.chromaUrl}/api/v2/collections/${this.config.collectionName}/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ChromaDB API error: ${response.statusText} - ${errorText}`);
      }

      return true;
    } catch (error) {
      console.error('Error storing embeddings:', error);
      throw error;
    }
  }

  /**
   * Query embeddings from ChromaDB (using v2 API)
   */
  async queryEmbeddings(queryText: string, nResults: number = 5): Promise<{
    ids: string[][];
    metadatas: any[][];
    distances: number[][];
    documents: string[][];
  }> {
    try {
      // Generate embedding for query
      const queryEmbeddings = await this.generateEmbeddings([queryText]);

      const response = await fetch(
        `${this.config.chromaUrl}/api/v2/collections/${this.config.collectionName}/query`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query_embeddings: queryEmbeddings,
            n_results: nResults,
            include: ['metadatas', 'documents', 'distances'],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ChromaDB query error: ${response.statusText} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error querying embeddings:', error);
      throw error;
    }
  }

  /**
   * Create collection in ChromaDB (using v2 API)
   */
  async createCollection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.chromaUrl}/api/v2/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.config.collectionName,
          metadata: {
            description: 'Knowledge base embeddings for AI assistant',
          },
        }),
      });

      // Collection might already exist, that's okay
      return response.status === 200 || response.status === 409;
    } catch (error) {
      console.error('Error creating collection:', error);
      return false;
    }
  }

  /**
   * Get collection info (using v2 API)
   */
  async getCollectionInfo(): Promise<{
    name: string;
    count: number;
    metadata?: any;
  } | null> {
    try {
      const response = await fetch(
        `${this.config.chromaUrl}/api/v2/collections/${this.config.collectionName}`
      );

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting collection info:', error);
      return null;
    }
  }

  /**
   * Delete collection (using v2 API)
   */
  async deleteCollection(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.config.chromaUrl}/api/v2/collections/${this.config.collectionName}`,
        {
          method: 'DELETE',
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error deleting collection:', error);
      return false;
    }
  }

  /**
   * Check if RAG services are available
   */
  async checkHealth(): Promise<{
    ollama: boolean;
    chroma: boolean;
    collectionExists: boolean;
  }> {
    const ollamaHealthy = await this.checkOllamaHealth();
    const chromaHealthy = await this.checkChromaHealth();
    const collectionInfo = await this.getCollectionInfo();

    return {
      ollama: ollamaHealthy,
      chroma: chromaHealthy,
      collectionExists: collectionInfo !== null,
    };
  }

  private async checkOllamaHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.ollamaBaseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async checkChromaHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.chromaUrl}/api/v2/heartbeat`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Create singleton instance
let ragService: RAGService | null = null;

export function getRAGService(): RAGService {
  if (!ragService) {
    const config: RAGConfig = {
      ollamaBaseUrl: process.env.OLLAMA_EMBEDDING_BASE_URL || 'http://localhost:11434',
      embeddingModel: process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text',
      chromaUrl: process.env.CHROMA_URL || 'http://localhost:8000',
      collectionName: process.env.CHROMA_COLLECTION || 'knowledge_base',
    };
    ragService = new RAGService(config);
  }
  return ragService;
}

// Export types
export type { EmbeddingResult, RAGConfig, SyncResult, SyncHistory };
export { RAGService };