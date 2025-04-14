import { useState } from 'react'
import axiosInstance from '@/api/axiosInstance'
import { Credentials, AuthTokens } from '@/types/auth'
import { useAuthContext } from '@/context/AuthProvider'

export function useLogin() {
  const { setTokens } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (credentials: Credentials) => {
    setLoading(true)
    try {
      const res = await axiosInstance.post<AuthTokens>('/auth/login', credentials)
      setTokens(res.data)
      setError(null)
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}
