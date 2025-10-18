'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { unifiedAuth } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Camera,
  Save,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Navigation,
  Shield,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'

export default function AccountPage() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasProfileData, setHasProfileData] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Profile state - initialize with empty values
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
    institution: '',
    bio: '',
    location: '',
    website: '',
    joinDate: ''
  })

  // User data from auth
  const [user, setUser] = useState<any>(null)

  // Security state
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Destinations state
  const [destinations, setDestinations] = useState([
    {
      id: 1,
      name: 'Website Utama',
      url: 'https://example.com',
      status: 'active',
      lastSync: new Date().toISOString(),
      type: 'website'
    },
    {
      id: 2,
      name: 'Mobile App',
      url: 'https://app.example.com',
      status: 'active',
      lastSync: new Date(Date.now() - 3600000).toISOString(),
      type: 'mobile'
    }
  ])

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user from auth token in cookie
      const response = await fetch('/api/auth/me')
      const data = await response.json()

      if (data.success && data.data?.user) {
        const userData = data.data.user
        setUser(userData)

        // Set profile data from user data
        setProfile(prev => ({
          ...prev,
          email: userData.email || '',
          firstName: userData.name?.split(' ')[0] || userData.name || '',
          lastName: userData.name?.split(' ').slice(1).join(' ') || '',
          joinDate: userData.createdAt || new Date().toISOString()
        }))

        // Check if user has additional profile data
        const hasAdditionalData = !!(userData.phone || userData.jobTitle || userData.department || userData.bio)
        setHasProfileData(hasAdditionalData)

        // Load additional profile data if exists
        if (userData.phone) {
          setProfile(prev => ({ ...prev, phone: userData.phone }))
        }
        if (userData.jobTitle) {
          setProfile(prev => ({ ...prev, jobTitle: userData.jobTitle }))
        }
        if (userData.department) {
          setProfile(prev => ({ ...prev, department: userData.department }))
        }
        if (userData.institution) {
          setProfile(prev => ({ ...prev, institution: userData.institution }))
        }
        if (userData.bio) {
          setProfile(prev => ({ ...prev, bio: userData.bio }))
        }
        if (userData.location) {
          setProfile(prev => ({ ...prev, location: userData.location }))
        }
        if (userData.website) {
          setProfile(prev => ({ ...prev, website: userData.website }))
        }
      } else {
        // Fallback: Try to get basic user data from unifiedAuth directly
        console.log('⚠️ Using fallback mode for user data')
        const fallbackResponse = await fetch('/api/user/profile')
        const fallbackData = await fallbackResponse.json()

        if (fallbackData.success && fallbackData.data?.user) {
          const userData = fallbackData.data.user
          setUser(userData)
          setProfile(prev => ({
            ...prev,
            email: userData.email || 'No email',
            firstName: userData.name?.split(' ')[0] || 'User',
            lastName: userData.name?.split(' ').slice(1).join(' ') || '',
            joinDate: userData.createdAt || new Date().toISOString()
          }))
        } else {
          setError('Failed to load user data from all sources')
        }
      }
    } catch (err) {
      setError('Failed to load user data')
      console.error('Error fetching user data:', err)
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    setSaving(true)
    setSaved(false)
    setError(null)

    try {
      // Update user profile via API
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${profile.firstName} ${profile.lastName}`.trim(),
          phone: profile.phone,
          jobTitle: profile.jobTitle,
          department: profile.department,
          institution: profile.institution,
          bio: profile.bio,
          location: profile.location,
          website: profile.website
        })
      })

      const data = await response.json()

      if (data.success) {
        setSaved(true)
        setHasProfileData(true)
        // Refresh user data
        await fetchUserData()
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(data.error || 'Failed to update profile')
      }
    } catch (err) {
      setError('Failed to update profile')
      console.error('Error updating profile:', err)
    } finally {
      setSaving(false)
    }
  }

  const savePassword = async () => {
    setSaving(true)
    setSaved(false)
    setError(null)

    try {
      // Validate passwords
      if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
        setError('Semua field password harus diisi')
        return
      }

      if (security.newPassword.length < 6) {
        setError('Password baru harus memiliki minimal 6 karakter')
        return
      }

      if (security.newPassword !== security.confirmPassword) {
        setError('Password baru dan konfirmasi password harus sama')
        return
      }

      const response = await fetch('/api/user/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: security.currentPassword,
          newPassword: security.newPassword
        })
      })

      const data = await response.json()

      if (data.success) {
        setSaved(true)
        setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(data.error || 'Gagal memperbarui password')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memperbarui password')
      console.error('Error updating password:', err)
    } finally {
      setSaving(false)
    }
  }

  
  
  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Handle file upload
      console.log('Uploading file:', file.name)
    }
  }

  
  // Loading state
  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t('account.title')}</h2>
            <p className="text-muted-foreground">{t('account.subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Loading profile data...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('account.title')}</h2>
          <p className="text-muted-foreground">{t('account.subtitle')}</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          {t('account.saveSuccess')}
        </div>
      )}

      {/* Empty State Message */}
      {!hasProfileData && !loading && !error && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Profile information is incomplete. Please fill in your details below.</span>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Keamanan
          </TabsTrigger>
          <TabsTrigger value="destinations" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Kemana Saja
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
                      <h3 className="font-semibold text-lg">
                        {profile.firstName || profile.lastName ? `${profile.firstName} ${profile.lastName}`.trim() : user?.email || 'User'}
                      </h3>
                      <p className="text-sm text-muted-foreground">{profile.jobTitle || 'No job title set'}</p>
                      <Badge variant="secondary" className="mt-2">{user?.role === 'admin' ? 'Professional' : 'Free'}</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.email || user?.email || 'No email'}</span>
                    </div>
                    {profile.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    {profile.institution && (
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.institution}</span>
                      </div>
                    )}
                    {profile.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{t('account.memberSince')} {new Date(user?.createdAt || profile.joinDate).toLocaleDateString('id-ID')}</span>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Keamanan
              </CardTitle>
              <CardDescription>Kelola pengaturan keamanan akun Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Change Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Ganti Password</h3>
                </div>

                <div className="space-y-4">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Password Saat Ini</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={security.currentPassword}
                        onChange={(e) => setSecurity({...security, currentPassword: e.target.value})}
                        placeholder="Masukkan password saat ini"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Password Baru</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={security.newPassword}
                        onChange={(e) => setSecurity({...security, newPassword: e.target.value})}
                        placeholder="Masukkan password baru"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password harus memiliki minimal 6 karakter
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={security.confirmPassword}
                        onChange={(e) => setSecurity({...security, confirmPassword: e.target.value})}
                        placeholder="Masukkan kembali password baru"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Security Tips */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Tips Keamanan:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Gunakan password yang unik dan tidak mudah ditebak</li>
                  <li>• Gabungkan huruf besar, kecil, angka, dan simbol</li>
                  <li>• Jangan gunakan password yang sama untuk akun lain</li>
                  <li>• Ganti password secara berkala</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Save Button for Security Tab */}
          <div className="flex justify-end">
            <Button onClick={savePassword} disabled={saving} className="flex items-center gap-2">
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Ganti Password
                </>
              )}
            </Button>
          </div>
        </TabsContent>

      {/* Destinations Tab */}
        <TabsContent value="destinations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Kemana Saja
              </CardTitle>
              <CardDescription>Kelola tempat tujuan integrasi chatbot Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {destinations.map((destination) => (
                  <div key={destination.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        destination.type === 'website' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        <Globe className={`h-5 w-5 ${
                          destination.type === 'website' ? 'text-blue-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{destination.name}</p>
                        <p className="text-sm text-muted-foreground">{destination.url}</p>
                        <p className="text-xs text-muted-foreground">
                          Sinkronisasi terakhir: {new Date(destination.lastSync).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={destination.status === 'active' ? 'default' : 'secondary'}>
                        {destination.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Konfigurasi
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Tambah Tujuan Baru</p>
                    <Button variant="outline">
                      + Tambah Integrasi
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Buttons */}
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