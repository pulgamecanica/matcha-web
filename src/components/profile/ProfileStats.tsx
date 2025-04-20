import { PublicUser } from '@/types/user';

type Props = {
  user: PublicUser;
};

export function ProfileStats({ user }: Props) {
  const totalViews = user.views.length;
  const uniqueVisitors = new Set(user.visitors.map(v => v.id)).size;

  return (
    <div className="w-full flex justify-around text-sm text-gray-700 dark:text-gray-300 my-4">
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-pink-600 dark:text-pink-400">
          {user.total_likes_sent}
        </span>
        <span className="text-xs">Likes Sent</span>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-pink-600 dark:text-pink-400">
          {user.total_likes_received}
        </span>
        <span className="text-xs">Likes Received</span>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
          {totalViews}
        </span>
        <span className="text-xs">Views</span>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-green-600 dark:text-green-400">
          {uniqueVisitors}
        </span>
        <span className="text-xs">Visitors</span>
      </div>
    </div>
  );
}
