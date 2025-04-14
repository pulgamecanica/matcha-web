import { createContext, useContext } from 'react'
import { useUserData } from '@/hooks/useUserData'
import type { User } from '@/types/user'

type UserContextValue = {
  user: User | null
  loading: boolean
  error: string | null
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, error } = useUserData()
  console.log(user)
  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext(): UserContextValue {
  const ctx = useContext(UserContext)
  if (!ctx) {
    throw new Error('useUserContext must be used within a UserProvider')
  }
  return ctx
}
