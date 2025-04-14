import { useEffect, useState } from 'react'
import axiosInstance from '@/api/axiosInstance'
import type { User, Tag, Picture, PublicUser } from '@/types/user'

type UserData = {
  user: User | null
  loading: boolean
  error: string | null
}

export function useUserData(): UserData {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [me, tags, pictures, liked, likedBy, matches] = await Promise.all([
          axiosInstance.get('/me'),
          axiosInstance.get('/me/tags'),
          axiosInstance.get('/me/pictures'),
          axiosInstance.get('/me/likes'),
          axiosInstance.get('/me/liked_by'),
          axiosInstance.get('/me/matches'),
        ])

        console.log('me:', me)
        console.log('tags:', tags)
        console.log('pictures:', pictures)
        console.log('liked:', liked)
        console.log('likedBy:', likedBy)
        console.log('matches:', matches)

        const userData: User = {
          ...me,
          tags: tags.data,
          pictures: pictures.data,
          liked: liked.data,
          liked_by: likedBy.data,
          matches: matches.data,
        }
        console.log('me.data:', me.data)

        console.log('userData:', userData)

        setUser(userData)
      } catch (err: any) {
        const status = err.response?.status
        if (status === 401 || status === 403) {
          setError('Unauthorized or forbidden')
        } else {
          setError('Failed to load user data')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])
  return { user, loading, error }
}
