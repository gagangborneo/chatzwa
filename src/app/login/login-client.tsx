'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import AuthSuspenseWrapper from '@/components/auth-suspense-wrapper'

function LoginContent({ successMessage, setSuccessMessage }: { successMessage: string; setSuccessMessage: (msg: string) => void }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [showOTP, setShowOTP] = useState(false)
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password, name: formData.name }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store token
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', data.data.token)
          sessionStorage.setItem('auth-token', data.data.token)
        }

        // Redirect to dashboard or show OTP
        if (data.data.requiresOTP) {
          setShowOTP(true)
        } else {
          router.push('/dashboard')
        }
      } else {
        setError(data.error || 'Authentication failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
      console.error('Auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: otpCode.join(''),
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push('/dashboard')
      } else {
        setError(data.error || 'Invalid OTP code')
      }
    } catch (error) {
      setError('Network error. Please try again.')
      console.error('OTP error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otpCode]
      newOtp[index] = value
      setOtpCode(newOtp)

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement
        if (nextInput) nextInput.focus()
      }
    }
  }

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement
      if (prevInput) prevInput.focus()
    }
  }

  if (showOTP) {
    return (
      <AuthSuspenseWrapper>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto h-12 w-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Verifikasi OTP</CardTitle>
              <CardDescription>
                Masukkan kode 6 digit yang dikirim ke {formData.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOTPSubmit} className="space-y-6">
                <div className="flex justify-center gap-2">
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {successMessage && (
                  <Alert>
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isLoading || otpCode.join('').length !== 6}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowOTP(false)}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Kembali ke login
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </AuthSuspenseWrapper>
    )
  }

  return (
    <AuthSuspenseWrapper>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mb-4">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? 'Masuk ke dashboard 7 Connect Anda'
                : 'Bergabung dengan platform chatbot AI terdepan'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      id="name"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : (isLogin ? 'Masuk' : 'Daftar')}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError('')
                    setSuccessMessage('')
                  }}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  {isLogin
                    ? 'Belum punya akun? Daftar sekarang'
                    : 'Sudah punya akun? Masuk'
                  }
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/demo"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Coba demo →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthSuspenseWrapper>
  )
}

export default function LoginClient() {
  const [successMessage, setSuccessMessage] = useState('')

  return <LoginContent successMessage={successMessage} setSuccessMessage={setSuccessMessage} />
}

function Bot({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  )
}