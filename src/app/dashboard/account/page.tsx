'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Smartphone,
  Key,
  Eye,
  EyeOff,
  Camera,
  Save,
  RotateCcw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Settings,
  Users,
  Globe,
  Lock
} from 'lucide-react'

export default function AccountPage() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Profile state
  const [profile, setProfile] = useState({
    firstName: 'Ahmad',
    lastName: 'Rizki',
    email: 'ahmad.rizki@example.com',
    phone: '+62 812-3456-7890',
    jobTitle: 'Kepala Sekolah',
    department: 'Akademik',
    institution: 'Yayasan Pendidikan Islam Attallah',
    bio: 'Berkomitmen untuk meningkatkan kualitas pendidikan Islam di Indonesia. Fokus pada pengembangan kurikulum yang relevan dan pembelajaran berbasis teknologi.',
    location: 'Jakarta, Indonesia',
    website: 'www.attallah.sch.id',
    joinDate: '2023-01-15'
  })

  // Security state
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: false
  })

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    chatNotifications: true,
    systemAlerts: true,
    billingReminders: true,
    newFeatures: false,
    securityAlerts: true,
    weeklyReports: true,
    marketingEmails: false
  })

  const saveProfile = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const saveSecurity = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const saveNotifications = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Handle file upload
      console.log('Uploading file:', file.name)
    }
  }

  const accountStats = {
    totalLogins: 234,
    lastLogin: '2024-10-10T09:30:00Z',
    accountCreated: '2023-01-15',
    storageUsed: '2.4 GB',
    storageLimit: '10 GB',
    subscriptionPlan: 'Professional',
    nextBilling: '2024-11-15'
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('account.title')}</h2>
          <p className="text-muted-foreground">{t('account.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="h-4 w-4 mr-2" />
            {t('account.exportProfile')}
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          {t('account.saveSuccess')}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {t('account.profileTab')}
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t('account.securityTab')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {t('account.notificationsTab')}
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('account.statsTab')}
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>{t('account.profilePicture')}</CardTitle>
                  <CardDescription>{t('account.profilePictureDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/api/placeholder/96/96" alt={profile.firstName} />
                        <AvatarFallback className="text-lg">
                          {profile.firstName[0]}{profile.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <label htmlFor="picture-upload" className="absolute bottom-0 right-0 cursor-pointer">
                        <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/90 transition-colors">
                          <Camera className="h-4 w-4" />
                        </div>
                        <input
                          id="picture-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="text-center mt-4">
                      <h3 className="font-semibold text-lg">{profile.firstName} {profile.lastName}</h3>
                      <p className="text-sm text-muted-foreground">{profile.jobTitle}</p>
                      <Badge variant="secondary" className="mt-2">{accountStats.subscriptionPlan}</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.institution}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{t('account.memberSince')} {new Date(accountStats.accountCreated).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Personal Information */}
            <div className="md:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t('account.personalInfo')}
                  </CardTitle>
                  <CardDescription>{t('account.personalInfoDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t('account.firstName')}</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t('account.lastName')}</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('account.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('account.phone')}</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">{t('account.jobTitle')}</Label>
                      <Input
                        id="jobTitle"
                        value={profile.jobTitle}
                        onChange={(e) => setProfile({...profile, jobTitle: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="department">{t('account.department')}</Label>
                      <Input
                        id="department"
                        value={profile.department}
                        onChange={(e) => setProfile({...profile, department: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="institution">{t('account.institution')}</Label>
                      <Input
                        id="institution"
                        value={profile.institution}
                        onChange={(e) => setProfile({...profile, institution: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="location">{t('account.location')}</Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">{t('account.website')}</Label>
                      <Input
                        id="website"
                        value={profile.website}
                        onChange={(e) => setProfile({...profile, website: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">{t('account.bio')}</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      placeholder={t('account.bioPlaceholder')}
                      className="min-h-[100px]"
                    />
                    <div className="text-sm text-muted-foreground">
                      {profile.bio.length}/500 {t('account.characters')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Password Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  {t('account.passwordManagement')}
                </CardTitle>
                <CardDescription>{t('account.passwordDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">{t('account.currentPassword')}</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      value={security.currentPassword}
                      onChange={(e) => setSecurity({...security, currentPassword: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">{t('account.newPassword')}</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={security.newPassword}
                      onChange={(e) => setSecurity({...security, newPassword: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t('account.confirmPassword')}</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity({...security, confirmPassword: e.target.value})}
                  />
                </div>

                <Button onClick={saveSecurity} disabled={saving} className="w-full">
                  {saving ? t('account.saving') : t('account.updatePassword')}
                </Button>
              </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  {t('account.twoFactorAuth')}
                </CardTitle>
                <CardDescription>{t('account.twoFactorDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('account.enable2FA')}</Label>
                    <p className="text-sm text-muted-foreground">{t('account.twoFactorHelp')}</p>
                  </div>
                  <Switch
                    checked={security.twoFactorEnabled}
                    onCheckedChange={(checked) => setSecurity({...security, twoFactorEnabled: checked})}
                  />
                </div>

                {security.twoFactorEnabled && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">{t('account.setupRequired')}</p>
                        <p>{t('account.twoFactorSetupHelp')}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>{t('account.recoveryCodes')}</Label>
                  <p className="text-sm text-muted-foreground">{t('account.recoveryCodesDescription')}</p>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    {t('account.downloadCodes')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Login Activity */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t('account.loginActivity')}
                </CardTitle>
                <CardDescription>{t('account.loginActivityDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{t('account.currentSession')}</p>
                        <p className="text-sm text-muted-foreground">Jakarta, Indonesia • Chrome on Windows</p>
                      </div>
                    </div>
                    <Badge variant="outline">{t('account.active')}</Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">{t('account.recentLogins')}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Globe className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Chrome on Android</p>
                            <p className="text-xs text-muted-foreground">Jakarta, Indonesia • 2 hours ago</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">{t('account.logout')}</Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Globe className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Safari on iPhone</p>
                            <p className="text-xs text-muted-foreground">Surabaya, Indonesia • Yesterday</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">{t('account.logout')}</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Email Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  {t('account.emailNotifications')}
                </CardTitle>
                <CardDescription>{t('account.emailNotificationsDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('account.productUpdates')}</Label>
                    <p className="text-sm text-muted-foreground">{t('account.productUpdatesDescription')}</p>
                  </div>
                  <Switch
                    checked={notifications.emailUpdates}
                    onCheckedChange={(checked) => setNotifications({...notifications, emailUpdates: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('account.chatNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">{t('account.chatNotificationsDescription')}</p>
                  </div>
                  <Switch
                    checked={notifications.chatNotifications}
                    onCheckedChange={(checked) => setNotifications({...notifications, chatNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('account.billingReminders')}</Label>
                    <p className="text-sm text-muted-foreground">{t('account.billingRemindersDescription')}</p>
                  </div>
                  <Switch
                    checked={notifications.billingReminders}
                    onCheckedChange={(checked) => setNotifications({...notifications, billingReminders: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('account.securityAlerts')}</Label>
                    <p className="text-sm text-muted-foreground">{t('account.securityAlertsDescription')}</p>
                  </div>
                  <Switch
                    checked={notifications.securityAlerts}
                    onCheckedChange={(checked) => setNotifications({...notifications, securityAlerts: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* System Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  {t('account.systemNotifications')}
                </CardTitle>
                <CardDescription>{t('account.systemNotificationsDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('account.systemAlerts')}</Label>
                    <p className="text-sm text-muted-foreground">{t('account.systemAlertsDescription')}</p>
                  </div>
                  <Switch
                    checked={notifications.systemAlerts}
                    onCheckedChange={(checked) => setNotifications({...notifications, systemAlerts: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('account.weeklyReports')}</Label>
                    <p className="text-sm text-muted-foreground">{t('account.weeklyReportsDescription')}</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => setNotifications({...notifications, weeklyReports: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('account.newFeatures')}</Label>
                    <p className="text-sm text-muted-foreground">{t('account.newFeaturesDescription')}</p>
                  </div>
                  <Switch
                    checked={notifications.newFeatures}
                    onCheckedChange={(checked) => setNotifications({...notifications, newFeatures: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('account.marketingEmails')}</Label>
                    <p className="text-sm text-muted-foreground">{t('account.marketingEmailsDescription')}</p>
                  </div>
                  <Switch
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) => setNotifications({...notifications, marketingEmails: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={saveNotifications} disabled={saving}>
              {saving ? t('account.saving') : t('account.savePreferences')}
            </Button>
          </div>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('account.totalLogins')}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accountStats.totalLogins}</div>
                <p className="text-xs text-muted-foreground">{t('account.allTime')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('account.storageUsed')}</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accountStats.storageUsed}</div>
                <Progress value={24} className="mt-2" />
                <p className="text-xs text-muted-foreground">{t('account.ofLimit', { limit: accountStats.storageLimit })}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('account.currentPlan')}</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accountStats.subscriptionPlan}</div>
                <p className="text-xs text-muted-foreground">{t('account.nextBilling', { date: new Date(accountStats.nextBilling).toLocaleDateString('id-ID') })}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('account.accountAge')}</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.floor((Date.now() - new Date(accountStats.accountCreated).getTime()) / (1000 * 60 * 60 * 24 * 30))}</div>
                <p className="text-xs text-muted-foreground">{t('account.months')}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('account.accountSummary')}</CardTitle>
              <CardDescription>{t('account.accountSummaryDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">{t('account.accountDetails')}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t('account.accountId')}</span>
                      <span className="font-mono">USR-2024-0156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('account.accountType')}</span>
                      <span>{t('account.premiumAccount')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('account.lastLogin')}</span>
                      <span>{new Date(accountStats.lastLogin).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('account.createdDate')}</span>
                      <span>{new Date(accountStats.accountCreated).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">{t('account.usageStatistics')}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t('account.chatInteractions')}</span>
                      <span>1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('account.knowledgeDocuments')}</span>
                      <span>156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('account.apiCalls')}</span>
                      <span>8,934</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('account.dataSyncs')}</span>
                      <span>42</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button (only show on profile tab) */}
      {activeTab === 'profile' && (
        <div className="flex justify-end">
          <Button onClick={saveProfile} disabled={saving} className="flex items-center gap-2">
            {saving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t('account.saving')}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {t('account.saveProfile')}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}