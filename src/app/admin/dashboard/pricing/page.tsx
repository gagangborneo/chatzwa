'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Crown,
  Zap,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  Target,
  Clock,
  MessageSquare,
  Database,
  Globe,
  BarChart3,
  MoreHorizontal,
  Copy,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

export default function PricingManagementPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false)
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false)
  const [isViewPlanOpen, setIsViewPlanOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('plans')

  // Mock data for pricing plans
  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for individuals and small teams getting started',
      price: 299000,
      currency: 'IDR',
      billing: 'monthly',
      yearlyPrice: 2990000,
      yearlyDiscount: 17,
      icon: Zap,
      color: 'bg-green-500',
      features: [
        '500 conversations per month',
        '100 Knowledge Base documents',
        '1 team member',
        'Email support',
        'Basic analytics',
        '1 GB storage',
        'Community forum access'
      ],
      limitations: [
        'No API access',
        'No custom integrations',
        'Basic AI models only'
      ],
      targetAudience: 'Individual users, freelancers',
      isActive: true,
      isPopular: false,
      sortOrder: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing businesses and teams',
      price: 990000,
      currency: 'IDR',
      billing: 'monthly',
      yearlyPrice: 9900000,
      yearlyDiscount: 17,
      icon: Star,
      color: 'bg-blue-500',
      features: [
        'Unlimited conversations',
        '2,000 Knowledge Base documents',
        '15 team members',
        'Priority email support',
        'Advanced analytics',
        '10 GB storage',
        'API access',
        'Custom integrations',
        'Advanced AI models',
        'Custom branding'
      ],
      limitations: [
        'No white-label option',
        'No dedicated support'
      ],
      targetAudience: 'Small to medium businesses',
      isActive: true,
      isPopular: true,
      sortOrder: 2,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Complete solution for large organizations',
      price: 2990000,
      currency: 'IDR',
      billing: 'monthly',
      yearlyPrice: 29900000,
      yearlyDiscount: 17,
      icon: Crown,
      color: 'bg-purple-500',
      features: [
        'Unlimited everything',
        'Unlimited Knowledge Base documents',
        'Unlimited team members',
        '24/7 dedicated support',
        'Enterprise analytics',
        'Unlimited storage',
        'Full API access',
        'Custom integrations',
        'All AI models',
        'White-label option',
        'On-premise deployment',
        'Custom AI training',
        'SLA guarantee'
      ],
      limitations: [
        'No limitations'
      ],
      targetAudience: 'Large enterprises, corporations',
      isActive: true,
      isPopular: false,
      sortOrder: 3,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 'custom',
      name: 'Custom',
      description: 'Tailored solutions for specific needs',
      price: null,
      currency: 'IDR',
      billing: 'custom',
      yearlyPrice: null,
      yearlyDiscount: 0,
      icon: Target,
      color: 'bg-orange-500',
      features: [
        'Custom features based on requirements',
        'Flexible pricing structure',
        'Dedicated account manager',
        'Custom development',
        'Specialized AI models',
        'Tailored support levels'
      ],
      limitations: [
        'Requires consultation'
      ],
      targetAudience: 'Specialized requirements',
      isActive: true,
      isPopular: false,
      sortOrder: 4,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    }
  ]

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount)
  }

  const activePlans = pricingPlans.filter(plan => plan.isActive)
  const totalRevenue = activePlans.reduce((sum, plan) => sum + (plan.price || 0), 0)
  const avgPlanPrice = activePlans.filter(plan => plan.price).reduce((sum, plan) => sum + plan.price!, 0) / activePlans.filter(plan => plan.price).length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Manajemen Harga</h2>
          <p className="text-muted-foreground">
            Kelola paket harga dan fitur yang ditawarkan kepada pengguna
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Lihat Analytics
          </Button>
          <Dialog open={isAddPlanOpen} onOpenChange={setIsAddPlanOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Paket
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Tambah Paket Baru</DialogTitle>
                <DialogDescription>
                  Buat paket harga baru dengan fitur dan konfigurasi lengkap
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plan-name">Nama Paket</Label>
                    <Input id="plan-name" placeholder="Contoh: Professional" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plan-target">Target Audience</Label>
                    <Input id="plan-target" placeholder="Contoh: Small businesses" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plan-description">Deskripsi</Label>
                  <Textarea id="plan-description" placeholder="Deskripsi paket..." rows={3} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plan-price">Harga Bulanan (IDR)</Label>
                    <Input id="plan-price" type="number" placeholder="299000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plan-yearly">Harga Tahunan (IDR)</Label>
                    <Input id="plan-yearly" type="number" placeholder="2990000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plan-discount">Diskon Tahunan (%)</Label>
                    <Input id="plan-discount" type="number" placeholder="17" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Fitur Paket</Label>
                  <div className="space-y-2 border rounded-lg p-4">
                    {['Feature 1', 'Feature 2', 'Feature 3'].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Input placeholder={`Fitur ${index + 1}`} className="flex-1" />
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Fitur
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Batasan Paket</Label>
                  <div className="space-y-2 border rounded-lg p-4">
                    {['Limitation 1', 'Limitation 2'].map((limitation, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <Input placeholder={`Batasan ${index + 1}`} className="flex-1" />
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Batasan
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Aktifkan Paket</Label>
                    <p className="text-sm text-muted-foreground">
                      Paket akan ditampilkan di halaman pricing
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddPlanOpen(false)}>
                  Batal
                </Button>
                <Button onClick={() => setIsAddPlanOpen(false)}>
                  Tambah Paket
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
            <CardTitle className="text-sm font-medium">Total Paket</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePlans.length}</div>
            <p className="text-xs text-muted-foreground">
              {activePlans.filter(p => p.isActive).length} aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Harga</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(avgPlanPrice, 'IDR')}</div>
            <p className="text-xs text-muted-foreground">
              Per bulan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue, 'IDR')}</div>
            <p className="text-xs text-muted-foreground">
              Potensial per bulan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular Plan</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Professional</div>
            <p className="text-xs text-muted-foreground">
              Paling diminati
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Daftar Paket</TabsTrigger>
          <TabsTrigger value="preview">Preview Halaman</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Pengaturan</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          {/* Pricing Plans Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Paket Harga</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paket</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Diskon Tahunan</TableHead>
                    <TableHead>Fitur</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingPlans.map((plan) => {
                    const Icon = plan.icon
                    return (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg ${plan.color} flex items-center justify-center`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{plan.name}</span>
                                {plan.isPopular && (
                                  <Badge variant="secondary" className="text-xs">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">{plan.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {plan.price ? (
                            <div>
                              <div className="font-medium">{formatCurrency(plan.price, plan.currency)}</div>
                              <div className="text-xs text-muted-foreground">/bulan</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Custom</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {plan.yearlyDiscount > 0 ? (
                            <div className="flex items-center space-x-1">
                              <span className="text-green-600 font-medium">-{plan.yearlyDiscount}%</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{plan.features.length} fitur</div>
                            <div className="text-muted-foreground">
                              {plan.limitations.length} batasan
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm max-w-xs">
                            {plan.targetAudience}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${plan.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-sm">{plan.isActive ? 'Aktif' : 'Non-aktif'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Plan
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate Plan
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {plan.isActive ? (
                                <DropdownMenuItem>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Deactivate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Plan
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview Halaman Pricing</CardTitle>
              <p className="text-sm text-muted-foreground">
                Lihat tampilan halaman pricing dari perspektif user
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {pricingPlans
                  .filter(plan => plan.isActive)
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((plan) => {
                    const Icon = plan.icon
                    return (
                      <Card key={plan.id} className={`relative ${plan.isPopular ? 'border-blue-500 border-2' : ''}`}>
                        {plan.isPopular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-blue-500">Most Popular</Badge>
                          </div>
                        )}
                        <CardHeader className="text-center pb-4">
                          <div className={`w-16 h-16 mx-auto rounded-lg ${plan.color} flex items-center justify-center mb-4`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <CardTitle className="text-xl">{plan.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                          <div className="mt-4">
                            {plan.price ? (
                              <div className="text-center">
                                <div className="text-3xl font-bold">
                                  {formatCurrency(plan.price, plan.currency)}
                                </div>
                                <div className="text-sm text-muted-foreground">/bulan</div>
                                {plan.yearlyDiscount > 0 && (
                                  <div className="text-xs text-green-600 mt-1">
                                    Hemat {plan.yearlyDiscount}% untuk tahunan
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-center">
                                <div className="text-2xl font-bold">Custom</div>
                                <div className="text-sm text-muted-foreground">Kontak kami</div>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="text-sm font-medium">Fitur:</div>
                            {plan.features.slice(0, 5).map((feature, index) => (
                              <div key={index} className="flex items-center space-x-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                            {plan.features.length > 5 && (
                              <div className="text-xs text-muted-foreground">
                                +{plan.features.length - 5} fitur lainnya
                              </div>
                            )}
                          </div>
                          <Button className="w-full mt-6" variant={plan.isPopular ? 'default' : 'outline'}>
                            {plan.price ? 'Pilih Paket' : 'Konsultasi'}
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Subscription Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Subscription trends chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Plan Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <Database className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Plan distribution chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { plan: 'Starter', views: 1250, conversions: 156, rate: 12.5 },
                    { plan: 'Professional', views: 890, conversions: 234, rate: 26.3 },
                    { plan: 'Enterprise', views: 320, conversions: 48, rate: 15.0 }
                  ].map((item) => (
                    <div key={item.plan} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.plan}</span>
                        <span className="text-sm text-muted-foreground">{item.rate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.rate * 3}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{item.views} views</span>
                        <span>{item.conversions} conversions</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Monthly Recurring</span>
                    <span className="text-sm font-bold">
                      {formatCurrency(15840000, 'IDR')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Annual Contracts</span>
                    <span className="text-sm font-bold">
                      {formatCurrency(42750000, 'IDR')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">One-time Setup</span>
                    <span className="text-sm font-bold">
                      {formatCurrency(5000000, 'IDR')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total MRR</span>
                    <span className="text-sm font-bold text-green-600">
                      {formatCurrency(15840000, 'IDR')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Churn Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Monthly Churn Rate</span>
                    <span className="text-sm font-bold text-red-600">3.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Customer Lifetime</span>
                    <span className="text-sm font-bold">18 bulan</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg Revenue/Churned</span>
                    <span className="text-sm font-bold">
                      {formatCurrency(890000, 'IDR')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Retention Rate</span>
                    <span className="text-sm font-bold text-green-600">96.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tampilkan Harga Tahunan</Label>
                  <p className="text-sm text-muted-foreground">
                    Tampilkan opsi pembayaran tahunan dengan diskon
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tampilkan Currency Selector</Label>
                  <p className="text-sm text-muted-foreground">
                    Izinkan user memilih currency (IDR/USD)
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Free Trial</Label>
                  <p className="text-sm text-muted-foreground">
                    Tawarkan free trial 14 hari untuk paket berbayar
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Comparison Table</Label>
                  <p className="text-sm text-muted-foreground">
                    Tampilkan tabel perbandingan fitur antar paket
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Customer Testimonials</Label>
                  <p className="text-sm text-muted-foreground">
                    Tampilkan testimonial customer di halaman pricing
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>FAQ Section</Label>
                  <p className="text-sm text-muted-foreground">
                    Tampilkan FAQ pricing di bawah paket
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-currency">Default Currency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">Indonesian Rupiah (IDR)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-cycle">Default Billing Cycle</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trial-days">Free Trial Days</Label>
                  <Input id="trial-days" type="number" placeholder="14" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grace-period">Grace Period (days)</Label>
                  <Input id="grace-period" type="number" placeholder="7" />
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