'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Mail,
  Shield,
  UserCheck,
  UserX,
  Calendar,
  Activity,
  TrendingUp,
  MoreHorizontal,
  Crown,
  Star,
  Zap
} from 'lucide-react'

export default function UserManagementPage() {
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')

  // Mock data for users
  const users = [
    {
      id: 'USR001',
      name: 'Ahmad Rahman',
      email: 'ahmad.rahman@email.com',
      phone: '+62 812-3456-7890',
      plan: 'Enterprise',
      status: 'active',
      role: 'admin',
      avatar: '/avatars/user1.jpg',
      joinDate: '2024-01-15',
      lastLogin: '2024-01-15 14:30:00',
      totalSpent: 35700000,
      totalChats: 1234,
      storageUsed: 45.6,
      apiCalls: 12500,
      verified: true,
      twoFactorEnabled: true
    },
    {
      id: 'USR002',
      name: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@email.com',
      phone: '+62 813-5678-9012',
      plan: 'Professional',
      status: 'active',
      role: 'user',
      avatar: '/avatars/user2.jpg',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-15 09:15:00',
      totalSpent: 11880000,
      totalChats: 856,
      storageUsed: 23.4,
      apiCalls: 8900,
      verified: true,
      twoFactorEnabled: false
    },
    {
      id: 'USR003',
      name: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      phone: '+62 811-2345-6789',
      plan: 'Starter',
      status: 'suspended',
      role: 'user',
      avatar: '/avatars/user3.jpg',
      joinDate: '2023-12-01',
      lastLogin: '2024-01-10 16:45:00',
      totalSpent: 2691000,
      totalChats: 234,
      storageUsed: 8.9,
      apiCalls: 2100,
      verified: false,
      twoFactorEnabled: false
    },
    {
      id: 'USR004',
      name: 'Dewi Lestari',
      email: 'dewi.lestari@email.com',
      phone: '+62 814-7890-1234',
      plan: 'Professional',
      status: 'active',
      role: 'moderator',
      avatar: '/avatars/user4.jpg',
      joinDate: '2023-11-20',
      lastLogin: '2024-01-15 11:20:00',
      totalSpent: 23760000,
      totalChats: 1567,
      storageUsed: 67.8,
      apiCalls: 15600,
      verified: true,
      twoFactorEnabled: true
    },
    {
      id: 'USR005',
      name: 'Rizki Pratama',
      email: 'rizki.pratama@email.com',
      phone: '+62 815-4567-8901',
      plan: 'Starter',
      status: 'inactive',
      role: 'user',
      avatar: '/avatars/user5.jpg',
      joinDate: '2024-01-05',
      lastLogin: '2024-01-12 08:30:00',
      totalSpent: 598000,
      totalChats: 45,
      storageUsed: 2.1,
      apiCalls: 450,
      verified: true,
      twoFactorEnabled: false
    }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, icon: UserCheck, color: 'text-green-600' },
      inactive: { variant: 'secondary' as const, icon: UserX, color: 'text-gray-600' },
      suspended: { variant: 'destructive' as const, icon: Shield, color: 'text-red-600' }
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

  const getPlanBadge = (plan: string) => {
    const planConfig = {
      Enterprise: { variant: 'default' as const, icon: Crown, color: 'text-purple-600' },
      Professional: { variant: 'secondary' as const, icon: Star, color: 'text-blue-600' },
      Starter: { variant: 'outline' as const, icon: Zap, color: 'text-green-600' }
    }

    const config = planConfig[plan as keyof typeof planConfig] || planConfig.Starter
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {plan}
      </Badge>
    )
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { variant: 'default' as const, label: 'Admin' },
      moderator: { variant: 'secondary' as const, label: 'Moderator' },
      user: { variant: 'outline' as const, label: 'User' }
    }

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    )
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesPlan = planFilter === 'all' || user.plan === planFilter

    return matchesSearch && matchesStatus && matchesPlan
  })

  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'active').length
  const totalRevenue = users.reduce((sum, u) => sum + u.totalSpent, 0)
  const totalChats = users.reduce((sum, u) => sum + u.totalChats, 0)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Manajemen User</h2>
          <p className="text-muted-foreground">
            Kelola semua pengguna dan monitoring aktivitas mereka
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Tambah User Baru</DialogTitle>
                <DialogDescription>
                  Buat akun user baru untuk sistem
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="user-name" className="text-right">
                    Nama Lengkap
                  </Label>
                  <Input id="user-name" placeholder="Nama lengkap user" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="user-email" className="text-right">
                    Email
                  </Label>
                  <Input id="user-email" type="email" placeholder="user@email.com" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="user-phone" className="text-right">
                    Telepon
                  </Label>
                  <Input id="user-phone" placeholder="+62 8xx-xxxx-xxxx" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="user-plan" className="text-right">
                    Paket
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih paket" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="user-role" className="text-right">
                    Role
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="user-password" className="text-right">
                    Password
                  </Label>
                  <Input id="user-password" type="password" placeholder="Masukkan password" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Batal
                </Button>
                <Button onClick={() => setIsAddOpen(false)}>
                  Tambah User
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
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {activeUsers} aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
              }).format(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              +15% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalChats.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% dari minggu lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Storage</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(users.reduce((sum, u) => sum + u.storageUsed, 0) / users.length).toFixed(1)}GB
            </div>
            <p className="text-xs text-muted-foreground">
              Per user
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Daftar User</TabsTrigger>
          <TabsTrigger value="analytics">Analitik</TabsTrigger>
          <TabsTrigger value="settings">Pengaturan</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Cari berdasarkan nama, email, atau telepon..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter Paket" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Paket</SelectItem>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar User ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Paket</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                            <div className="text-xs text-muted-foreground">{user.phone}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell>
                        {getPlanBadge(user.plan)}
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(user.joinDate).toLocaleDateString('id-ID')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(user.lastLogin).toLocaleDateString('id-ID')}
                          <div className="text-xs text-muted-foreground">
                            {new Date(user.lastLogin).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                          }).format(user.totalSpent)}
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
                            <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/users/${user.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            {user.status === 'active' ? (
                              <DropdownMenuItem>
                                <UserX className="mr-2 h-4 w-4" />
                                Suspend
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
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
                  User Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <Users className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">User growth chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  User Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <Activity className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">User activity chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution by Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { plan: 'Starter', count: 2, percentage: 40, color: 'bg-green-500' },
                    { plan: 'Professional', count: 2, percentage: 40, color: 'bg-blue-500' },
                    { plan: 'Enterprise', count: 1, percentage: 20, color: 'bg-purple-500' }
                  ].map((item) => (
                    <div key={item.plan} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-sm font-medium">{item.plan}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{item.count} users</span>
                        <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm font-medium">Active</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {activeUsers} users
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500" />
                      <span className="text-sm font-medium">Inactive</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {users.filter(u => u.status === 'inactive').length} users
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-sm font-medium">Suspended</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {users.filter(u => u.status === 'suspended').length} users
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Users by Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users
                    .sort((a, b) => b.totalSpent - a.totalSpent)
                    .slice(0, 5)
                    .map((user, index) => (
                      <div key={user.id} className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.plan}</p>
                        </div>
                        <div className="text-sm font-medium">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                          }).format(user.totalSpent)}
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
              <CardTitle>Pengaturan User Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto User Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Otomatis verifikasi email user baru
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Force 2FA for Admin</Label>
                  <p className="text-sm text-muted-foreground">
                    Wajibkan 2FA untuk semua admin users
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>User Welcome Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Kirim email welcome ke user baru
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Inactive User Cleanup</Label>
                  <p className="text-sm text-muted-foreground">
                    Hapus user inactive setelah 90 hari
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Daily Activity Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Kirim laporan aktivitas user harian
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Default User Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-plan">Default Plan</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih default plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-role">Default Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih default role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storage-limit">Default Storage Limit (GB)</Label>
                  <Input id="storage-limit" placeholder="10" defaultValue="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-limit">Default API Limit (per day)</Label>
                  <Input id="api-limit" placeholder="1000" defaultValue="1000" />
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