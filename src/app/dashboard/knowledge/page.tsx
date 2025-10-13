'use client'

import { useState, useEffect, useRef } from 'react'
import { useI18n } from '@/lib/i18n'
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
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  // Load data on mount
  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    loadDocuments()
  }, [searchTerm, selectedCategory, selectedStatus, currentPage])

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
      const response = await fetch('/api/knowledge/stats')
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
      const response = await fetch('/api/knowledge/categories')
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

      // Handle "none" value for categoryId
      const submissionData = {
        ...documentForm,
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

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
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

      {/* Stats Cards */}
      {stats && (
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
                Active categories
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Documents</span>
                <div className="flex items-center gap-2">
                  <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetDocumentForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Document
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingDocument ? 'Edit Document' : 'Create Document'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                              id="title"
                              value={documentForm.title}
                              onChange={(e) => setDocumentForm(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="Enter document title"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="author">Author</Label>
                            <Input
                              id="author"
                              value={documentForm.author}
                              onChange={(e) => setDocumentForm(prev => ({ ...prev, author: e.target.value }))}
                              placeholder="Enter author name"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="content">Content</Label>
                          <Textarea
                            id="content"
                            value={documentForm.content}
                            onChange={(e) => setDocumentForm(prev => ({ ...prev, content: e.target.value }))}
                            placeholder="Enter document content"
                            rows={10}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={documentForm.description}
                            onChange={(e) => setDocumentForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter document description"
                            rows={3}
                          />
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={documentForm.categoryId} onValueChange={(value) => setDocumentForm(prev => ({ ...prev, categoryId: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No category</SelectItem>
                                {categories.map((cat) => (
                                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={documentForm.status} onValueChange={(value) => setDocumentForm(prev => ({ ...prev, status: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Input
                              id="priority"
                              type="number"
                              value={documentForm.priority}
                              onChange={(e) => setDocumentForm(prev => ({ ...prev, priority: Number(e.target.value) }))}
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                              id="tags"
                              value={documentForm.tags}
                              onChange={(e) => setDocumentForm(prev => ({ ...prev, tags: e.target.value }))}
                              placeholder="tag1, tag2, tag3"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="keywords">Keywords</Label>
                            <Input
                              id="keywords"
                              value={documentForm.keywords}
                              onChange={(e) => setDocumentForm(prev => ({ ...prev, keywords: e.target.value }))}
                              placeholder="keyword1, keyword2, keyword3"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsDocumentDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveDocument}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex items-center gap-4 mb-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Documents Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{doc.title}</div>
                          {doc.description && (
                            <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                              {doc.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {doc.category ? (
                          <Badge style={{ backgroundColor: doc.category.color, color: 'white' }}>
                            {doc.category.name}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{doc.author || '-'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(doc.status)}>
                          {getStatusText(doc.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{doc.viewCount.toLocaleString()}</TableCell>
                      <TableCell>{formatDate(doc.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditDocument(doc)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteDocument(doc.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Categories</span>
                <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetCategoryForm}>
                      <FolderPlus className="h-4 w-4 mr-2" />
                      New Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingCategory ? 'Edit Category' : 'Create Category'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cat-name">Name</Label>
                        <Input
                          id="cat-name"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter category name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cat-description">Description</Label>
                        <Textarea
                          id="cat-description"
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Enter category description"
                          rows={3}
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="cat-color">Color</Label>
                          <Input
                            id="cat-color"
                            type="color"
                            value={categoryForm.color}
                            onChange={(e) => setCategoryForm(prev => ({ ...prev, color: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cat-icon">Icon</Label>
                          <Input
                            id="cat-icon"
                            value={categoryForm.icon}
                            onChange={(e) => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                            placeholder="Enter icon name or emoji"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cat-sort">Sort Order</Label>
                        <Input
                          id="cat-sort"
                          type="number"
                          value={categoryForm.sortOrder}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, sortOrder: Number(e.target.value) }))}
                          placeholder="0"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveCategory}>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <Card key={category.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: category.color }}
                          />
                          <h3 className="font-medium">{category.name}</h3>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {category.description || 'No description'}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {category._count.documents} documents
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Form */}
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="upload-category">Category</Label>
                    <Select value={uploadForm.categoryId} onValueChange={(value) => setUploadForm(prev => ({ ...prev, categoryId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No category</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upload-title">Title (optional)</Label>
                    <Input
                      id="upload-title"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Document title"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upload-description">Description (optional)</Label>
                  <Textarea
                    id="upload-description"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Document description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upload-tags">Tags (optional)</Label>
                  <Input
                    id="upload-tags"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auto-index"
                    checked={uploadForm.autoIndex}
                    onCheckedChange={(checked) => setUploadForm(prev => ({ ...prev, autoIndex: !!checked }))}
                  />
                  <Label htmlFor="auto-index">Auto-index in RAG system</Label>
                </div>
              </div>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <UploadCloud className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    Drag and drop files here
                  </h3>
                  <p className="text-sm text-gray-500">
                    Supported formats: PDF, DOCX, DOC, TXT, MD, CSV (max 10MB)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.doc,.txt,.md,.csv"
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="mt-4"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Select Files
                    </>
                  )}
                </Button>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Upload Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Processing file...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-xs text-muted-foreground">
                        File is being processed and indexed. Please wait...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}