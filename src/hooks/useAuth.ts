import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name?: string
  role: string
  isActive: boolean
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/auth/me')
        const data = await response.json()

        if (data.success && data.data?.user) {
          setUser(data.data.user)
        } else {
          setUser(null)
          if (data.error) {
            setError(data.error)
          }
        }
      } catch (err) {
        console.error('Error fetching user:', err)
        setUser(null)
        setError('Failed to fetch user information')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading, error }
}