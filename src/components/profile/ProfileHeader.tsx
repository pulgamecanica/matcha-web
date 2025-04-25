import { PublicUser } from '@/types/user';
import { Picture } from '@/types/picture';
import { Location } from '@/types/location';

type Props = {
  user: PublicUser;
  profilePicture: Picture | null;
  location?: Location | null;
};

export function ProfileHeader({ user, profilePicture, location }: Props) {
  const isOnline = user.online_status;
  const lastSeen = location?.city || location?.country || null;
  return (
    <div className="flex items-center gap-4">
      <img
        src={profilePicture?.url ?? '/placeholder-profile.jpg'}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
      />

      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">
            {user.last_name}
          </h2>

          <span
            className={`inline-block w-3 h-3 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}
            title={isOnline ? 'Online' : lastSeen ? `Last seen: ${lastSeen}` : 'Offline'}
          />
        </div>

        <p className="text-sm text-gray-500">@{user.username}</p>

        {user.biography && (
          <p className="mt-1 text-sm text-gray-400 italic">"{user.biography}"</p>
        )}

        {!isOnline && lastSeen && (
          <p className="text-xs text-gray-400 mt-1">Last seen: {lastSeen}</p>
        )}
      </div>
    </div>
  );
}
