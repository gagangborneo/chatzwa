'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
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
  UploadCloud
} from 'lucide-react'

export default function KnowledgeBasePage() {
  const { t } = useI18n()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Mock data untuk demonstrasi
  const knowledgeStats = {
    totalDocuments: 1247,
    indexedDocuments: 1189,
    categories: 5,
    storageUsed: 2.4,
    storageTotal: 5.0,
    lastUpdated: '2 jam yang lalu'
  }

  const categories = [
    { id: 'islamic-studies', name: 'Islamic Studies', count: 245, color: 'bg-green-500' },
    { id: 'education', name: 'Education', count: 189, color: 'bg-blue-500' },
    { id: 'donation', name: 'Donation Programs', count: 156, color: 'bg-purple-500' },
    { id: 'quran', name: 'Quran Learning', count: 134, color: 'bg-orange-500' },
    { id: 'general', name: 'General', count: 123, color: 'bg-gray-500' }
  ]

  const knowledgeData = [
    {
      id: '1',
      title: 'Panduan Pendaftaran Siswa Baru 2024',
      category: 'education',
      author: 'Admin Education',
      date: '2024-01-15',
      size: '2.4 MB',
      status: 'indexed',
      views: 1247,
      description: 'Panduan lengkap untuk proses pendaftaran siswa baru tahun ajaran 2024',
      format: 'PDF',
      embeddingCount: 245
    },
    {
      id: '2',
      title: 'Program Beasiswa Yayasan',
      category: 'education',
      author: 'Scholarship Team',
      date: '2024-01-12',
      size: '1.8 MB',
      status: 'indexed',
      views: 892,
      description: 'Informasi lengkap mengenai program beasiswa yang tersedia',
      format: 'PDF',
      embeddingCount: 189
    },
    {
      id: '3',
      title: 'Manual Operasional Masjid',
      category: 'islamic-studies',
      author: 'Islamic Affairs',
      date: '2024-01-10',
      size: '3.2 MB',
      status: 'indexed',
      views: 654,
      description: 'Prosedur operasional dan pengelolaan masjid harian',
      format: 'DOCX',
      embeddingCount: 156
    },
    {
      id: '4',
      title: 'Protokol Donasi Online',
      category: 'donation',
      author: 'Donation Team',
      date: '2024-01-08',
      size: '1.5 MB',
      status: 'processing',
      views: 432,
      description: 'Tata cara dan prosedur donasi melalui platform online',
      format: 'PDF',
      embeddingCount: 0
    },
    {
      id: '5',
      title: 'Metode Pembelajaran Al-Quran',
      category: 'quran',
      author: 'Quran Education',
      date: '2024-01-05',
      size: '2.8 MB',
      status: 'indexed',
      views: 1102,
      description: 'Berbagai metode efektif untuk pembelajaran Al-Quran modern',
      format: 'PDF',
      embeddingCount: 134
    }
  ]

  const recentIndexing = [
    {
      id: '1',
      document: 'Curriculum Update 2024',
      status: 'completed',
      timestamp: '10 menit yang lalu',
      embeddingCount: 145
    },
    {
      id: '2',
      document: 'Islamic Studies Guide',
      status: 'completed',
      timestamp: '25 menit yang lalu',
      embeddingCount: 89
    },
    {
      id: '3',
      document: 'Donation Procedures',
      status: 'processing',
      timestamp: '1 jam yang lalu',
      embeddingCount: 0
    },
    {
      id: '4',
      document: 'Archive Document',
      status: 'failed',
      timestamp: '2 jam yang lalu',
      embeddingCount: 0
    }
  ]

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleFileUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    setTimeout(() => {
      setUploadProgress(100)
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 500)
    }, 2000)
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category?.color || 'bg-gray-500'
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'indexed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch(status) {
      case 'indexed': return t('status.indexed')
      case 'processing': return t('status.processing')
      case 'failed': return t('status.failed')
      default: return status
    }
  }

  const getIndexingStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-600'
      case 'processing': return 'text-blue-600'
      case 'failed': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getIndexingIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'processing': return <AlertCircle className="h-4 w-4" />
      case 'failed': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
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
            {t('knowledge.subtitle', 'Manage and monitor your AI knowledge base and document indexing')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {t('actions.refresh')}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t('actions.export')}
          </Button>
        </div>
      </div>

      {/* Knowledge Base Stats - Knowledge Specific */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('knowledge.totalDocuments')}</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{knowledgeStats.totalDocuments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
              +12.5% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('knowledge.indexedDocuments')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{knowledgeStats.indexedDocuments.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={(knowledgeStats.indexedDocuments / knowledgeStats.totalDocuments) * 100} className="flex-1" />
              <span className="text-xs text-muted-foreground min-w-[40px]">
                {Math.round((knowledgeStats.indexedDocuments / knowledgeStats.totalDocuments) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('knowledge.totalEmbeddings')}</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,832</div>
            <p className="text-xs text-muted-foreground">
              Total vector embeddings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('knowledge.storageUsed')}</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{knowledgeStats.storageUsed} GB</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={(knowledgeStats.storageUsed / knowledgeStats.storageTotal) * 100} className="flex-1" />
              <span className="text-xs text-muted-foreground min-w-[60px]">
                {knowledgeStats.storageUsed}/{knowledgeStats.storageTotal} GB
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Base Tabs - Only 2 Tabs */}
      <Tabs defaultValue="data" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="data">{t('knowledge.knowledgeData')}</TabsTrigger>
          <TabsTrigger value="upload">{t('knowledge.uploadFiles')}</TabsTrigger>
        </TabsList>

        {/* Knowledge Data Tab */}
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('knowledge.knowledgeManagement')}</span>
                <div className="flex items-center gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('knowledge.allCategories')}</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('knowledge.searchDocuments')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-[250px]"
                    />
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('knowledge.documentTitle')}</TableHead>
                    <TableHead>{t('knowledge.category')}</TableHead>
                    <TableHead>{t('knowledge.author')}</TableHead>
                    <TableHead>{t('knowledge.format')}</TableHead>
                    <TableHead>{t('knowledge.size')}</TableHead>
                    <TableHead>{t('knowledge.status')}</TableHead>
                    <TableHead>{t('knowledge.embeddings')}</TableHead>
                    <TableHead>{t('knowledge.views')}</TableHead>
                    <TableHead>{t('knowledge.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {knowledgeData
                    .filter(doc =>
                      (selectedCategory === 'all' || doc.category === selectedCategory) &&
                      (doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       doc.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{doc.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {doc.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(doc.category)}>
                          {categories.find(cat => cat.id === doc.category)?.name}
                        </Badge>
                      </TableCell>
                      <TableCell>{doc.author}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.format}</Badge>
                      </TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(doc.status)}>
                          {getStatusText(doc.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{doc.embeddingCount}</TableCell>
                      <TableCell>{doc.views.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Indexing Activity */}
          <Card>
            <CardHeader>
              <CardTitle>{t('knowledge.recentIndexing')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentIndexing.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className={`flex items-center ${getIndexingStatusColor(activity.status)}`}>
                      {getIndexingIcon(activity.status)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.document}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                        {activity.embeddingCount > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {activity.embeddingCount} embeddings
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(activity.status)}>
                        {getStatusText(activity.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload Files Tab */}
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('knowledge.fileUpload')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <UploadCloud className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('knowledge.dragDropFiles')}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t('knowledge.supportedFormats')}
                  </p>
                  <p className="text-xs text-gray-400">
                    PDF, DOCX, TXT, MDX, CSV maksimal 10MB per file
                  </p>
                </div>
                <Button onClick={handleFileUpload} disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {t('knowledge.uploading')}...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {t('knowledge.selectFiles')}
                    </>
                  )}
                </Button>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">{t('knowledge.uploadProgress')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>{t('knowledge.processingFiles')}</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-xs text-muted-foreground">
                        {t('knowledge.uploadDescription')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Batch Upload Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t('knowledge.batchUploadOptions')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('knowledge.defaultCategory')}</label>
                      <Select defaultValue="general">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('knowledge.autoIndexing')}</label>
                      <Checkbox defaultChecked />
                      <p className="text-xs text-muted-foreground">
                        {t('knowledge.autoIndexingDescription')}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('knowledge.description')}</label>
                    <Textarea
                      placeholder={t('knowledge.descriptionPlaceholder')}
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Supported File Types */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t('knowledge.supportedFileTypes')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center gap-2 p-2 border rounded">
                      <File className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="text-sm font-medium">PDF Documents</p>
                        <p className="text-xs text-muted-foreground">.pdf</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 border rounded">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Word Documents</p>
                        <p className="text-xs text-muted-foreground">.docx, .doc</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 border rounded">
                      <FileText className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">Text Files</p>
                        <p className="text-xs text-muted-foreground">.txt, .md</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}