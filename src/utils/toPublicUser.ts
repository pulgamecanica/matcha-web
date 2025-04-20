import { User, PublicUser, Visitor } from '@/types/user';
import { Picture } from '@/types/picture';
import { Tag } from '@/types/tag';

export function toPublicUser(
  user: User,
  tags: Tag[],
  pictures: Picture[],
  views: Visitor[],
  viewers: Visitor[],
  likes: number,
  liked_by: number
): PublicUser {
  return {
    id: user.id,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    biography: user.biography,
    gender: user.gender,
    sexual_preferences: user.sexual_preferences,
    birth_year: user.birth_year.toString(),
    profile_picture_id: user.profile_picture_id,
    latitude: user.latitude,
    longitude: user.longitude,
    online_status: user.online_status,
    last_seen_at: user.last_seen_at,
    pictures,
    tags,
    views: views,
    visitors: viewers,
    total_likes_sent: likes,
    total_likes_received: liked_by,
  };
}
