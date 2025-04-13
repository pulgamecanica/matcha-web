export type User = {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: 'male' | 'female' | 'other';
  sexual_preferences: 'male' | 'female' | 'both';
  biography: string | null;
  is_email_verified: 't' | 'f';
  is_banned: 't' | 'f';
  fame_rating: string;
  birth_year: number | null;
  latitude: number | null;
  longitude: number | null;
  online_status: 't' | 'f';
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
  profile_picture_id: string | null;
};

export type UpdateUserProfilePayload = {
  username?: string;
  first_name?: string;
  last_name?: string;
  gender?: 'male' | 'female' | 'other';
  sexual_preferences?: 'male' | 'female' | 'non_binary' | 'everyone';
  biography?: string;
  birth_year?: number;
};