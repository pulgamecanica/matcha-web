export type Gender = 'male' | 'female' | 'other';
export type SexualPreference = 'male' | 'female' | 'non_binary' | 'everyone';

export type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: Gender;
  sexual_preferences: SexualPreference;
  biography: string | null;
  is_email_verified: boolean;
  is_banned: boolean;
  fame_rating: number;
  birth_year: number;
  latitude: number | null;
  longitude: number | null;
  online_status: boolean;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
  profile_picture_id: number | null;
};

export type Picture = {
  id: number;
  user_id: number;
  url: string;
  is_profile: "t" | "f";
  created_at: string;
};

export type Tags = {
  id: string,
  name: string;
};

export type PublicUser = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  biography: string | null;
  gender: Gender;
  sexual_preferences: SexualPreference;
  birth_year: string;
  profile_picture_id: number | null;
  online_status: boolean;
  last_seen_at: string | null;
  pictures: Picture[];
  tags: Tags[];
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
