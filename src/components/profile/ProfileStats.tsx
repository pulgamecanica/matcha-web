import { JSX, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicUser } from '@/types/user';
import { StatItem } from '@/components/profile/StatItem';
import { StatSidebar } from '@/components/profile/StatSidebar';

type Props = {
  user: PublicUser;
};

type StatType = 'likes_sent' | 'likes_received' | 'matches' | 'views' | 'visitors';

export function ProfileStats({ user }: Props) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeStat, setActiveStat] = useState<StatType | null>(null);
  const navigate = useNavigate();

  const handleClick = (stat: StatType) => {
    setActiveStat(stat);
    setShowSidebar(true);
  };

  const statContent: Record<StatType, JSX.Element> = {
    likes_sent: <p>{user.total_likes_sent} people you liked ❤️</p>,
    likes_received: <p>{user.total_likes_received} Please upgrade to premium to see who like you 🥰</p>,
    matches: <p>{user.total_likes_sent} matches (placeholder) 💘</p>,
    views: (
      <ul className="text-sm space-y-1">
        {Array.from(new Map(user.views.map(v => [v.id, v])).values()).map((viewer, i) => (
          <li
            key={i}
            onClick={() => navigate(`/profile/${viewer.username}`)}
            className="cursor-pointer"
          >
            {viewer.username} 👀
          </li>
        ))}
      </ul>
    ),
    visitors: (
      <ul className="text-sm space-y-1">
        {Array.from(new Set(user.visitors.map(v => v.id))).map((id, i) => {
          const visitor = user.visitors.find(v => v.id === id);
          return visitor ? (
            <li
              key={i}
              onClick={() => navigate(`/profile/${visitor.username}`)}
              className="cursor-pointer"
            >
              {visitor.username} 🚪
            </li>
          ) : null;
        })}
      </ul>
    )
  };

  return (
    <>
      <div className="w-full flex justify-around text-sm text-gray-700 dark:text-gray-300 my-4">
        <StatItem
          label="Likes Sent"
          value={user.total_likes_sent}
          color="text-pink-600 dark:text-pink-400"
          onClick={() => handleClick('likes_sent')}
        />
        <StatItem
          label="Likes Received"
          value={user.total_likes_received}
          color="text-pink-600 dark:text-pink-400"
          onClick={() => handleClick('likes_received')}
        />
        <StatItem
          label="Match"
          value={user.total_likes_sent}
          color="text-pink-600 dark:text-pink-400"
          onClick={() => handleClick('matches')}
        />
        <StatItem
          label="Views"
          value={user.views.length}
          color="text-blue-600 dark:text-blue-400"
          onClick={() => handleClick('views')}
        />
        <StatItem
          label="Visitors"
          value={new Set(user.visitors.map(v => v.id)).size}
          color="text-green-600 dark:text-green-400"
          onClick={() => handleClick('visitors')}
        />
      </div>

      <StatSidebar
        visible={showSidebar}
        title={activeStat?.replace('_', ' ') || ''}
        onClose={() => setShowSidebar(false)}
      >
        {activeStat && statContent[activeStat]}
      </StatSidebar>
    </>
  );
}


