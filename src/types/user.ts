export type Gender = 'male' | 'female' | 'other'
export type SexualPreferences = 'male' | 'female' | 'non_binary' | 'everyone'

export type Picture = {
  id: number
  url: string
  is_profile: boolean
}

export type Tag = {
  id: number
  name: string
}

export type PublicUser = {
  id: number
  username: string
  first_name: string
  last_name: string
  biography: string
  pictures: Picture[]
}

export type User = {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  gender: Gender
  sexual_preferences: SexualPreferences
  biography: string
  latitude: number
  longitude: number
  confirmed: boolean
  pictures: Picture[]
  tags: Tag[]
  liked: PublicUser[]
  liked_by: PublicUser[]
  matches: PublicUser[]
}

