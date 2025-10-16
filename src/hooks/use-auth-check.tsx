'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function useAuthCheck() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()

        if (data.success && data.authenticated) {
          router.push('/dashboard')
          return
        }
      } catch (error) {
        console.error('Auth check error:', error)
      }

      const message = searchParams.get('message')
      if (message === 'registrasi-berhasil') {
        setSuccessMessage('Registrasi berhasil! Silakan login dengan akun Anda.')
      }
    }

    checkAuthStatus()
  }, [searchParams, router])

  return { successMessage, setSuccessMessage }
}