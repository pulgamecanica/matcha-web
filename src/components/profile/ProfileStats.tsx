import { PublicUser } from '@/types/user';
import { useState } from 'react';

type Props = {
  user: PublicUser;
};

type StatType = 'likes_sent' | 'likes_received' | 'matches' | 'views' | 'visitors';

export function ProfileStats({ user }: Props) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeStat, setActiveStat] = useState<StatType | null>(null);
  const handleClick = (stat: StatType) => {
    setActiveStat(stat);
    setShowSidebar(true);
  };
  const renderSidebarContent = () => {
    switch (activeStat) {
      case 'likes_sent':
        return <p>{user.total_likes_sent} people you liked ❤️</p>;
      case 'likes_received':
        return <p>{user.total_likes_received} Please upgrade to premium to see who like you 🥰</p>;
      case 'matches':
        return <p>{user.total_likes_sent} matches (placeholder) 💘</p>
      case 'views':
        const uniqueViewersMap = new Map();
        user.views.forEach(viewer => {
          if (!uniqueViewersMap.has(viewer.id)) {
            uniqueViewersMap.set(viewer.id, viewer);
          }
        });
        return (
          <ul className="text-sm space-y-1">
            {[...uniqueViewersMap.values()].map((viewer, i) => (
              <li key={i}>{viewer.username} 👀</li>
            ))}
          </ul>
        );
      case 'visitors':
        return (
          <ul className="text-sm space-y-1">
            {[...new Set(user.visitors.map((v) => v.id))].map((id, i) => {
              const visitor = user.visitors.find((v) => v.id === id);
              return visitor ? <li key={i}>{visitor.username} 🚪</li> : null;
            })}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex justify-around text-sm text-gray-700 dark:text-gray-300 my-4">
      <div onClick={() => handleClick('likes_sent')} className="flex flex-col items-center cursor-pointer">
        <span className="text-lg font-semibold text-pink-600 dark:text-pink-400">{user.total_likes_sent}</span>
        <span className="text-xs">Likes Sent</span>
      </div>

      <div onClick={() => handleClick('likes_received')} className="flex flex-col items-center cursor-pointer">
        <span className="text-lg font-semibold text-pink-600 dark:text-pink-400">{user.total_likes_received}</span>
        <span className="text-xs">Likes Received</span>
      </div>

      <div onClick={() => handleClick('matches')} className="flex flex-col items-center cursor-pointer">
        <span className="text-lg font-semibold text-pink-600 dark:text-pink-400">{user.total_likes_sent}</span>
        <span className="text-xs">Match</span>
      </div>

      <div onClick={() => handleClick('views')} className="flex flex-col items-center cursor-pointer">
        <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">{user.views.length}</span>
        <span className="text-xs">Views</span>
      </div>

      <div onClick={() => handleClick('visitors')} className="relative flex flex-col items-center cursor-pointer">
        <span className="text-lg font-semibold text-green-600 dark:text-green-400">
          {new Set(user.visitors.map((v) => v.id)).size}
        </span>
        <span className="text-xs">Visitors</span>
      </div>

      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowSidebar(false)}
          ></div>

          <div className="ml-auto w-[100px] sm:w-[240px] h-full bg-white dark:bg-gray-900 p-6 shadow-lg animate-slide-in-right">
            <button onClick={() => setShowSidebar(false)} className="text-right w-full text-sm text-pink-400 hover:underline">
              Close
            </button>
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2 capitalize">{activeStat?.replace('_', ' ')}</h2>
              {renderSidebarContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
