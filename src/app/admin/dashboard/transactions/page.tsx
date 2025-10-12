'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  CreditCard,
  Download,
  Filter,
  Search,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  FileText,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react'

export default function TransactionManagementPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  // Mock data for transactions
  const transactions = [
    {
      id: 'TRX001',
      userId: 'USR123456',
      userName: 'Ahmad Rahman',
      email: 'ahmad.rahman@email.com',
      type: 'subscription',
      plan: 'Professional',
      amount: 990000,
      currency: 'IDR',
      status: 'completed',
      paymentMethod: 'credit_card',
      paymentGateway: 'Midtrans',
      createdAt: '2024-01-15 10:30:00',
      completedAt: '2024-01-15 10:31:45',
      description: 'Bulanan Paket Professional',
      metadata: {
        cardType: 'Visa',
        cardLast4: '4242'
      }
    },
    {
      id: 'TRX002',
      userId: 'USR789012',
      userName: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@email.com',
      type: 'subscription',
      plan: 'Starter',
      amount: 299000,
      currency: 'IDR',
      status: 'pending',
      paymentMethod: 'bank_transfer',
      paymentGateway: 'BCA Virtual Account',
      createdAt: '2024-01-15 09:15:00',
      completedAt: null,
      description: 'Bulanan Paket Starter',
      metadata: {
        vaNumber: '1234567890',
        bankName: 'BCA'
      }
    },
    {
      id: 'TRX003',
      userId: 'USR345678',
      userName: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      type: 'one_time',
      plan: 'Enterprise',
      amount: 2990000,
      currency: 'IDR',
      status: 'failed',
      paymentMethod: 'credit_card',
      paymentGateway: 'Stripe',
      createdAt: '2024-01-15 08:45:00',
      completedAt: '2024-01-15 08:46:12',
      description: 'Setup Fee Enterprise',
      metadata: {
        failureReason: 'Insufficient funds',
        cardType: 'Mastercard',
        cardLast4: '5555'
      }
    },
    {
      id: 'TRX004',
      userId: 'USR901234',
      userName: 'Dewi Lestari',
      email: 'dewi.lestari@email.com',
      type: 'refund',
      plan: 'Professional',
      amount: -990000,
      currency: 'IDR',
      status: 'completed',
      paymentMethod: 'bank_transfer',
      paymentGateway: 'Manual Refund',
      createdAt: '2024-01-14 16:20:00',
      completedAt: '2024-01-15 10:00:00',
      description: 'Refund Januari 2024',
      metadata: {
        refundReason: 'Service cancellation',
        originalTransaction: 'TRX000'
      }
    },
    {
      id: 'TRX005',
      userId: 'USR567890',
      userName: 'Rizki Pratama',
      email: 'rizki.pratama@email.com',
      type: 'subscription',
      plan: 'Enterprise',
      amount: 2990000,
      currency: 'IDR',
      status: 'completed',
      paymentMethod: 'crypto',
      paymentGateway: 'Coinbase',
      createdAt: '2024-01-14 14:30:00',
      completedAt: '2024-01-14 14:32:15',
      description: 'Bulanan Paket Enterprise',
      metadata: {
        cryptoType: 'USDT',
        network: 'TRC20'
      }
    }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      pending: { variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      failed: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      refunded: { variant: 'outline' as const, icon: AlertCircle, color: 'text-blue-600' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalRevenue = transactions
    .filter(t => t.status === 'completed' && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)

  const totalRefunds = Math.abs(transactions
    .filter(t => t.status === 'completed' && t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0))

  const pendingTransactions = transactions.filter(t => t.status === 'pending').length
  const failedTransactions = transactions.filter(t => t.status === 'failed').length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Manajemen Transaksi</h2>
          <p className="text-muted-foreground">
            Monitor dan kelola semua transaksi pembayaran dalam sistem
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Transaksi Manual
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Buat Transaksi Manual</DialogTitle>
                <DialogDescription>
                  Tambahkan transaksi baru secara manual
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="user-email" className="text-right">
                    Email User
                  </Label>
                  <Input id="user-email" placeholder="user@email.com" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="transaction-type" className="text-right">
                    Tipe
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih tipe transaksi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subscription">Subscription</SelectItem>
                      <SelectItem value="one_time">One Time</SelectItem>
                      <SelectItem value="refund">Refund</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Jumlah
                  </Label>
                  <Input id="amount" type="number" placeholder="0" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Deskripsi
                  </Label>
                  <Input id="description" placeholder="Deskripsi transaksi" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                  Batal
                </Button>
                <Button onClick={() => setIsViewOpen(false)}>
                  Buat Transaksi
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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue, 'IDR')}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRefunds, 'IDR')}</div>
            <p className="text-xs text-muted-foreground">
              2 refund bulan ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTransactions}</div>
            <p className="text-xs text-muted-foreground">
              Menunggu konfirmasi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedTransactions}</div>
            <p className="text-xs text-muted-foreground">
              Perlu attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Daftar Transaksi</TabsTrigger>
          <TabsTrigger value="analytics">Analitik</TabsTrigger>
          <TabsTrigger value="settings">Pengaturan</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Transaksi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Cari berdasarkan ID, nama, atau email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter Tanggal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Waktu</SelectItem>
                    <SelectItem value="today">Hari Ini</SelectItem>
                    <SelectItem value="week">Minggu Ini</SelectItem>
                    <SelectItem value="month">Bulan Ini</SelectItem>
                    <SelectItem value="year">Tahun Ini</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Transaksi ({filteredTransactions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Transaksi</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Metode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.id}</div>
                          <div className="text-sm text-muted-foreground">{transaction.plan}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.userName}</div>
                          <div className="text-sm text-muted-foreground">{transaction.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {transaction.type === 'subscription' ? 'Subscription' :
                           transaction.type === 'one_time' ? 'One Time' : 'Refund'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className={transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}>
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{transaction.paymentGateway}</div>
                          <div className="text-muted-foreground">
                            {transaction.paymentMethod === 'credit_card' ? 'Credit Card' :
                             transaction.paymentMethod === 'bank_transfer' ? 'Bank Transfer' :
                             transaction.paymentMethod === 'crypto' ? 'Crypto' : 'Other'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(transaction.createdAt).toLocaleDateString('id-ID')}</div>
                          <div className="text-muted-foreground">
                            {new Date(transaction.createdAt).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
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
                            {transaction.status === 'pending' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            {transaction.status === 'failed' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Retry Payment
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <DollarSign className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Revenue trend chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <CreditCard className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Payment methods distribution chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Top Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Professional', 'Starter', 'Enterprise'].map((plan, index) => (
                    <div key={plan} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' : 'bg-purple-500'
                        }`} />
                        <span className="text-sm font-medium">{plan}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {index === 0 ? '45%' : index === 1 ? '35%' : '20%'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((transactions.filter(t => t.status === 'completed').length / transactions.length) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <span className="text-sm font-medium">Pending</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((pendingTransactions / transactions.length) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-sm font-medium">Failed</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((failedTransactions / transactions.length) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: 'New subscription', time: '2 menit yang lalu', type: 'success' },
                    { action: 'Payment failed', time: '15 menit yang lalu', type: 'error' },
                    { action: 'Refund processed', time: '1 jam yang lalu', type: 'info' },
                    { action: 'Plan upgraded', time: '3 jam yang lalu', type: 'success' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Payment Gateway</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Payment Gateways Aktif</h4>
                <div className="grid gap-4">
                  {[
                    { name: 'Midtrans', status: true, currency: 'IDR' },
                    { name: 'Stripe', status: true, currency: 'USD, EUR' },
                    { name: 'PayPal', status: false, currency: 'USD' },
                    { name: 'Coinbase', status: true, currency: 'USDT, BTC' }
                  ].map((gateway) => (
                    <div key={gateway.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h5 className="font-medium">{gateway.name}</h5>
                        <p className="text-sm text-muted-foreground">Currency: {gateway.currency}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${gateway.status ? 'bg-green-500' : 'bg-gray-300'}`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Pengaturan Refund</h4>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Auto Refund for Failed Payments</Label>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Manual Refund Approval</Label>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Refund Email Notifications</Label>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
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