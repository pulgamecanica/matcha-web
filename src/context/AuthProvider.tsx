'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { AuthTokens } from '@/types/auth'

type AuthContextType = {
  isAuthenticated: boolean
  tokens: AuthTokens | null
  setTokens: (tokens: AuthTokens | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokens] = useState<AuthTokens | null>(null)

  useEffect(() => {
    // Optionally load tokens from secure local storage or cookie
    const stored = localStorage.getItem('tokens')
    if (stored) setTokens(JSON.parse(stored))
  }, [])

  const updateTokens = (tokens: AuthTokens | null) => {
    setTokens(tokens)
    if (tokens) {
      localStorage.setItem('tokens', JSON.stringify(tokens))
    } else {
      localStorage.removeItem('tokens')
    }
  }

  const logout = () => {
    updateTokens(null)
    // optionally notify backend
  }

  return (
    <AuthContext.Provider value={{ tokens, isAuthenticated: !!tokens, setTokens: updateTokens, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
