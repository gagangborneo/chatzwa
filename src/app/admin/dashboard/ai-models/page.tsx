'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Bot,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Settings,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Database,
  TrendingUp,
  BarChart3
} from 'lucide-react'

export default function AIModelManagementPage() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [isAddModelOpen, setIsAddModelOpen] = useState(false)
  const [isEditModelOpen, setIsEditModelOpen] = useState(false)

  // Mock data for AI models
  const aiModels = [
    {
      id: '1',
      name: 'GPT-4 Turbo',
      type: 'OpenAI',
      status: 'active',
      version: '4.0.1',
      usage: '85%',
      requests: '12,456',
      avgResponseTime: '1.2s',
      accuracy: '98.5%',
      cost: '$0.03/1K tokens',
      lastUpdated: '2 hours ago',
      description: 'High-performance model for complex tasks'
    },
    {
      id: '2',
      name: 'Claude-3 Sonnet',
      type: 'Anthropic',
      status: 'active',
      version: '3.0.2',
      usage: '62%',
      requests: '8,234',
      avgResponseTime: '0.8s',
      accuracy: '97.2%',
      cost: '$0.015/1K tokens',
      lastUpdated: '1 hour ago',
      description: 'Balanced model for general tasks'
    },
    {
      id: '3',
      name: 'Llama-3 70B',
      type: 'Meta',
      status: 'inactive',
      version: '3.0.0',
      usage: '0%',
      requests: '0',
      avgResponseTime: '2.1s',
      accuracy: '94.8%',
      cost: '$0.008/1K tokens',
      lastUpdated: '3 days ago',
      description: 'Open-source model for cost-effective solutions'
    },
    {
      id: '4',
      name: 'Gemini Pro',
      type: 'Google',
      status: 'maintenance',
      version: '1.5.0',
      usage: '45%',
      requests: '5,678',
      avgResponseTime: '1.5s',
      accuracy: '96.1%',
      cost: '$0.025/1K tokens',
      lastUpdated: '6 hours ago',
      description: 'Google\'s multimodal AI model'
    }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      inactive: { variant: 'secondary' as const, icon: XCircle, color: 'text-gray-600' },
      maintenance: { variant: 'outline' as const, icon: AlertCircle, color: 'text-yellow-600' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Manajemen Model AI</h2>
          <p className="text-muted-foreground">
            Kelola dan monitor semua model AI yang digunakan dalam sistem
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddModelOpen} onOpenChange={setIsAddModelOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Model
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Tambah Model AI Baru</DialogTitle>
                <DialogDescription>
                  Konfigurasi model AI baru untuk ditambahkan ke sistem
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="model-name" className="text-right">
                    Nama Model
                  </Label>
                  <Input id="model-name" placeholder="Contoh: GPT-4" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="model-type" className="text-right">
                    Provider
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="meta">Meta</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="model-version" className="text-right">
                    Versi
                  </Label>
                  <Input id="model-version" placeholder="Contoh: 4.0.1" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="api-key" className="text-right">
                    API Key
                  </Label>
                  <Input id="api-key" type="password" placeholder="Masukkan API key" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Deskripsi
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Deskripsi model AI..."
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddModelOpen(false)}>
                  Batal
                </Button>
                <Button onClick={() => setIsAddModelOpen(false)}>
                  Tambah Model
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Model</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              3 aktif, 1 maintenance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Request</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">26.4K</div>
            <p className="text-xs text-muted-foreground">
              +12% dari minggu lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.4s</div>
            <p className="text-xs text-muted-foreground">
              -0.2s dari kemarin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.7%</div>
            <p className="text-xs text-muted-foreground">
              +0.3% dari bulan lalu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="models" className="space-y-4">
        <TabsList>
          <TabsTrigger value="models">Daftar Model</TabsTrigger>
          <TabsTrigger value="performance">Performa</TabsTrigger>
          <TabsTrigger value="settings">Pengaturan</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Model AI</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aiModels.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{model.name}</div>
                          <div className="text-sm text-muted-foreground">{model.version}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{model.type}</Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(model.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: model.usage }}
                            ></div>
                          </div>
                          <span className="text-sm">{model.usage}</span>
                        </div>
                      </TableCell>
                      <TableCell>{model.avgResponseTime}</TableCell>
                      <TableCell>{model.accuracy}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedModel(model.id)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          {model.status === 'active' ? (
                            <Button variant="outline" size="sm">
                              <Pause className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm">
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Usage Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <Zap className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Usage trend chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <Database className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Performance metrics chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Model Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiModels.map((model) => (
                  <div key={model.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Bot className="h-5 w-5" />
                        <div>
                          <h4 className="font-semibold">{model.name}</h4>
                          <p className="text-sm text-muted-foreground">{model.description}</p>
                        </div>
                      </div>
                      {getStatusBadge(model.status)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Requests:</span>
                        <p className="font-medium">{model.requests}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Response Time:</span>
                        <p className="font-medium">{model.avgResponseTime}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Accuracy:</span>
                        <p className="font-medium">{model.accuracy}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cost:</span>
                        <p className="font-medium">{model.cost}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Global Model AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-scaling</Label>
                  <p className="text-sm text-muted-foreground">
                    Otomatis menyesuaikan jumlah model berdasarkan load
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Load Balancing</Label>
                  <p className="text-sm text-muted-foreground">
                    Mendistribusikan request ke model yang tersedia
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Model Fallback</Label>
                  <p className="text-sm text-muted-foreground">
                    Otomatis beralih ke model cadangan jika error
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cost Optimization</Label>
                  <p className="text-sm text-muted-foreground">
                    Prioritaskan model dengan biaya lebih rendah
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Performance Monitoring</Label>
                  <p className="text-sm text-muted-foreground">
                    Monitor performa model secara real-time
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeout">Request Timeout (detik)</Label>
                  <Input id="timeout" placeholder="30" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retry">Max Retry Attempts</Label>
                  <Input id="retry" placeholder="3" defaultValue="3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate-limit">Rate Limit (req/min)</Label>
                  <Input id="rate-limit" placeholder="1000" defaultValue="1000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cache-ttl">Cache TTL (menit)</Label>
                  <Input id="cache-ttl" placeholder="5" defaultValue="5" />
                </div>
              </div>

              <div className="pt-4">
                <Button>Simpan Pengaturan</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}