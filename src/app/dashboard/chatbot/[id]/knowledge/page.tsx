'use client'

import { useState, useEffect, useRef } from 'react'
import { useI18n } from '@/lib/i18n'
import { usePathname } from 'next/navigation'
import { getRAGService } from '@/lib/rag-service'
import { ragDataSynchronizer } from '@/lib/sync-history'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  RefreshCw,
  Download,
  Upload,
  Search,
  FileText,
  Database,
  Tag,
  Calendar,
  TrendingUp,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  File,
  Folder,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  UploadCloud,
  Save,
  X,
  FolderPlus,
  FilePlus
} from 'lucide-react'

// Types
interface KnowledgeCategory {
  id: string
  name: string
  description?: string
  color: string
  icon?: string
  isActive: boolean
  sortOrder: number
  _count: { documents: number }
}

interface KnowledgeDocument {
  id: string
  title: string
  content: string
  description?: string
  categoryId?: string
  author?: string
  source?: string
  filePath?: string
  fileName?: string
  fileSize?: number
  mimeType?: string
  format?: string
  status: string
  isIndexed: boolean
  embeddingCount: number
  viewCount: number
  ragDocumentId?: string
  lastIndexedAt?: string
  tags?: string
  keywords?: string
  priority: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
  category?: {
    id: string
    name: string
    color: string
  }
}

interface KnowledgeStats {
  documents: {
    total: number
    published: number
    draft: number
    indexed: number
    totalViews: number
  }
  categories: Array<{
    id: string
    name: string
    color: string
    documentCount: number
  }>
  recentDocuments: KnowledgeDocument[]
  popularDocuments: KnowledgeDocument[]
  storage: {
    totalSize: number
    usedSize: number
    availableSize: number
  }
}

export default function KnowledgeBasePage() {
  const { t } = useI18n()
  const pathname = usePathname()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Extract chatbot ID from pathname
  const chatbotId = pathname.split('/')[3] || ''

  // Data state
  const [stats, setStats] = useState<KnowledgeStats | null>(null)
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([])
  const [categories, setCategories] = useState<KnowledgeCategory[]>([])
  const [ragStatus, setRagStatus] = useState<any>(null)

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Dialog state
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [editingDocument, setEditingDocument] = useState<KnowledgeDocument | null>(null)
  const [editingCategory, setEditingCategory] = useState<KnowledgeCategory | null>(null)

  // Form state
  const [documentForm, setDocumentForm] = useState({
    title: '',
    content: '',
    description: '',
    categoryId: '',
    author: '',
    tags: '',
    keywords: '',
    priority: 0,
    status: 'draft'
  })

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    color: '#6B7280',
    icon: '',
    sortOrder: 0
  })

  const [uploadForm, setUploadForm] = useState({
    categoryId: '',
    title: '',
    description: '',
    tags: '',
    autoIndex: true
  })

  // Load data on mount and when chatbot ID changes
  useEffect(() => {
    if (chatbotId) {
      loadInitialData()
    }
  }, [chatbotId])

  useEffect(() => {
    if (chatbotId) {
      loadDocuments()
    }
  }, [searchTerm, selectedCategory, selectedStatus, currentPage, chatbotId])

  const loadInitialData = async () => {
    setIsLoading(true)
    try {
      await Promise.all([
        loadStats(),
        loadCategories(),
        loadRAGStatus()
      ])
    } catch (error) {
      console.error('Error loading initial data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch(`/api/knowledge/stats?chatbotId=${chatbotId}`)
      const result = await response.json()
      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch(`/api/knowledge/categories?chatbotId=${chatbotId}`)
      const result = await response.json()
      if (result.success) {
        setCategories(result.data)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadDocuments = async () => {
    try {
      const params = new URLSearchParams({
        chatbotId,
        page: currentPage.toString(),
        limit: '20',
        ...(selectedCategory !== 'all' && { categoryId: selectedCategory }),
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`/api/knowledge/documents?${params}`)
      const result = await response.json()
      if (result.success) {
        setDocuments(result.data)
        setTotalPages(result.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error loading documents:', error)
    }
  }

  const loadRAGStatus = async () => {
    try {
      const status = await ragDataSynchronizer.getSyncStatus()
      setRagStatus(status)
    } catch (error) {
      console.error('Error loading RAG status:', error)
    }
  }

  // Document CRUD operations
  const handleSaveDocument = async () => {
    try {
      const url = editingDocument
        ? `/api/knowledge/documents/${editingDocument.id}`
        : '/api/knowledge/documents'

      const method = editingDocument ? 'PUT' : 'POST'

      // Handle "none" value for categoryId and include chatbotId
      const submissionData = {
        ...documentForm,
        chatbotId,
        categoryId: documentForm.categoryId === 'none' ? null : documentForm.categoryId
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      })

      const result = await response.json()
      if (result.success) {
        setIsDocumentDialogOpen(false)
        resetDocumentForm()
        await loadDocuments()
        await loadStats()
      } else {
        alert(result.error || 'Failed to save document')
      }
    } catch (error) {
      console.error('Error saving document:', error)
      alert('Failed to save document')
    }
  }

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const response = await fetch(`/api/knowledge/documents/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      if (result.success) {
        await loadDocuments()
        await loadStats()
      } else {
        alert(result.error || 'Failed to delete document')
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Failed to delete document')
    }
  }

  const handleEditDocument = (document: KnowledgeDocument) => {
    setEditingDocument(document)
    setDocumentForm({
      title: document.title,
      content: document.content,
      description: document.description || '',
      categoryId: document.categoryId || '',
      author: document.author || '',
      tags: document.tags || '',
      keywords: document.keywords || '',
      priority: document.priority,
      status: document.status
    })
    setIsDocumentDialogOpen(true)
  }

  // Category CRUD operations
  const handleSaveCategory = async () => {
    try {
      const url = editingCategory
        ? `/api/knowledge/categories/${editingCategory.id}`
        : '/api/knowledge/categories'

      const method = editingCategory ? 'PUT' : 'POST'

      // Include chatbotId in the submission
      const submissionData = {
        ...categoryForm,
        chatbotId
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      })

      const result = await response.json()
      if (result.success) {
        setIsCategoryDialogOpen(false)
        resetCategoryForm()
        await loadCategories()
        await loadStats()
      } else {
        alert(result.error || 'Failed to save category')
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Failed to save category')
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const response = await fetch(`/api/knowledge/categories/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      if (result.success) {
        await loadCategories()
        await loadStats()
      } else {
        alert(result.error || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    }
  }

  const handleEditCategory = (category: KnowledgeCategory) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      color: category.color,
      icon: category.icon || '',
      sortOrder: category.sortOrder
    })
    setIsCategoryDialogOpen(true)
  }

  // File upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('chatbotId', chatbotId)
      formData.append('categoryId', uploadForm.categoryId === 'none' ? '' : uploadForm.categoryId)
      formData.append('autoIndex', uploadForm.autoIndex.toString())
      formData.append('title', uploadForm.title)
      formData.append('description', uploadForm.description)
      formData.append('tags', uploadForm.tags)

      const response = await fetch('/api/knowledge/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      if (result.success) {
        setUploadProgress(100)
        await loadDocuments()
        await loadStats()

        // Reset form
        setUploadForm({
          categoryId: '',
          title: '',
          description: '',
          tags: '',
          autoIndex: true
        })

        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        alert(result.error || 'Failed to upload file')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload file')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // Utility functions
  const resetDocumentForm = () => {
    setDocumentForm({
      title: '',
      content: '',
      description: '',
      categoryId: '',
      author: '',
      tags: '',
      keywords: '',
      priority: 0,
      status: 'draft'
    })
    setEditingDocument(null)
  }

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      color: '#6B7280',
      icon: '',
      sortOrder: 0
    })
    setEditingCategory(null)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'archived': return 'bg-red-100 text-red-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch(status) {
      case 'published': return 'Published'
      case 'draft': return 'Draft'
      case 'archived': return 'Archived'
      case 'processing': return 'Processing'
      default: return status
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID')
  }

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Database className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Knowledge Base Data Yet
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          This chatbot doesn't have any knowledge base data yet. Start by adding your first document or creating categories to organize your content.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add First Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Document</DialogTitle>
              </DialogHeader>
              {/* Document form content will be rendered here */}
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={documentForm.title}
                    onChange={(e) => setDocumentForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter document title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={documentForm.content}
                    onChange={(e) => setDocumentForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter document content"
                    rows={6}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDocumentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveDocument}>
                  Save Document
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="h-4 w-4 mr-2" />
                Create Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="category-name">Name</Label>
                  <Input
                    id="category-name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter category name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category-description">Description</Label>
                  <Textarea
                    id="category-description"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter category description"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveCategory}>
                  Create Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )

  if (!chatbotId) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Invalid Chatbot ID</h3>
          <p className="text-sm text-gray-500">Please select a valid chatbot to manage its knowledge base.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {t('nav.knowledgeBase')}
          </h2>
          <p className="text-muted-foreground">
            Manage and monitor your AI knowledge base and document indexing
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* RAG Status Display */}
          <div className="flex items-center gap-2 mr-4">
            <div className={`w-3 h-3 rounded-full ${ragStatus?.ollamaAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-muted-foreground">Ollama</span>
          </div>
          <div className="flex items-center gap-2 mr-4">
            <div className={`w-3 h-3 rounded-full ${ragStatus?.chromaAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-muted-foreground">ChromaDB</span>
          </div>
          <Button variant="outline" onClick={loadInitialData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Empty State or Stats Cards */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (!stats || stats.documents.total === 0) ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.documents.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.documents.published} published, {stats.documents.draft} draft
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Indexed Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.documents.indexed.toLocaleString()}</div>
              <div className="flex items-center gap-2 mt-2">
                <Progress
                  value={stats.documents.total > 0 ? (stats.documents.indexed / stats.documents.total) * 100 : 0}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground min-w-[40px]">
                  {stats.documents.total > 0 ? Math.round((stats.documents.indexed / stats.documents.total) * 100) : 0}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.documents.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across all documents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
              <p className="text-xs text-muted-foreground">
                Organize your documents
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rest of the content would continue here... */}
      {/* For now, I'll add a placeholder for the main content area */}
      <div className="mt-8">
        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Documents</CardTitle>
                  <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Document
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Add New Document</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="doc-title">Title</Label>
                          <Input
                            id="doc-title"
                            value={documentForm.title}
                            onChange={(e) => setDocumentForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter document title"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="doc-content">Content</Label>
                          <Textarea
                            id="doc-content"
                            value={documentForm.content}
                            onChange={(e) => setDocumentForm(prev => ({ ...prev, content: e.target.value }))}
                            placeholder="Enter document content"
                            rows={6}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="doc-description">Description</Label>
                          <Input
                            id="doc-description"
                            value={documentForm.description}
                            onChange={(e) => setDocumentForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter document description"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="doc-category">Category</Label>
                          <Select value={documentForm.categoryId} onValueChange={(value) => setDocumentForm(prev => ({ ...prev, categoryId: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Category</SelectItem>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsDocumentDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveDocument}>
                          Save Document
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
                    <p className="text-sm text-gray-500 mb-4">Add your first document to get started</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.title}</TableCell>
                          <TableCell>{doc.category?.name || '-'}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(doc.status)}>
                              {getStatusText(doc.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(doc.createdAt)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditDocument(doc)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(doc.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Categories</CardTitle>
                  <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Create New Category</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="cat-name">Name</Label>
                          <Input
                            id="cat-name"
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter category name"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="cat-description">Description</Label>
                          <Textarea
                            id="cat-description"
                            value={categoryForm.description}
                            onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter category description"
                            rows={3}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="cat-color">Color</Label>
                          <Input
                            id="cat-color"
                            type="color"
                            value={categoryForm.color}
                            onChange={(e) => setCategoryForm(prev => ({ ...prev, color: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveCategory}>
                          Create Category
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {categories.length === 0 ? (
                  <div className="text-center py-8">
                    <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
                    <p className="text-sm text-gray-500 mb-4">Create your first category to organize documents</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                      <Card key={category.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              <CardTitle className="text-sm">{category.name}</CardTitle>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                          <Badge variant="secondary">{category._count.documents} documents</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload documents to add them to your knowledge base
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file-upload">Choose File</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="upload-title">Title (optional)</Label>
                      <Input
                        id="upload-title"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Auto-generated from filename"
                        disabled={isUploading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="upload-category">Category</Label>
                      <Select value={uploadForm.categoryId} onValueChange={(value) => setUploadForm(prev => ({ ...prev, categoryId: value }))} disabled={isUploading}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Category</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="upload-description">Description (optional)</Label>
                    <Textarea
                      id="upload-description"
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter file description"
                      rows={3}
                      disabled={isUploading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="upload-tags">Tags (optional)</Label>
                    <Input
                      id="upload-tags"
                      value={uploadForm.tags}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="Enter tags separated by commas"
                      disabled={isUploading}
                    />
                  </div>

                  {isUploading && (
                    <div>
                      <Label>Upload Progress</Label>
                      <Progress value={uploadProgress} className="w-full" />
                    </div>
                  )}

                  <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                    <UploadCloud className="h-4 w-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload File'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base Settings</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure your knowledge base settings and preferences
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Coming Soon</h3>
                  <p className="text-sm text-gray-500">Advanced settings and configuration options will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
