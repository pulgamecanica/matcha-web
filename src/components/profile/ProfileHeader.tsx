import { User } from '@/types/user';
import { Picture } from '@/types/picture';

type Props = {
  user: User;
  profilePicture: Picture | null;
};

export function ProfileHeader({ user, profilePicture }: Props) {
  return (
    <div className="flex items-center gap-4">
      <img
        src={profilePicture?.url ?? '/placeholder-profile.jpg'}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
      />
      <div>
        <h2 className="text-xl font-bold">{user.first_name} {user.last_name}</h2>
        <p className="text-sm text-gray-500">@{user.username}</p>
        {user.biography && (
          <p className="mt-1 text-sm text-gray-400 italic">"{user.biography}"</p>
        )}
      </div>
    </div>
  );
}
