import { JSX, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicUser } from '@/types/user';
import { StatItem } from '@/components/profile/StatItem';
import { StatSidebar } from '@/components/profile/StatSidebar';
import { MailOpen } from 'lucide-react';

type Props = {
  user: PublicUser;
  showMessage?: boolean;
};

type StatType = 'likes' | 'liked_by' | 'views' | 'visitors';

export function ProfileStats({ user, showMessage = false }: Props) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeStat, setActiveStat] = useState<StatType | null>(null);
  const navigate = useNavigate();

  const handleClick = (stat: StatType) => {
    setActiveStat(stat);
    setShowSidebar(true);
  };

  const statContent: Record<StatType, JSX.Element> = {
    likes: (
      <ul className="text-sm space-y-1">
        {Array.from(new Map(user.likes.map(v => [v.id, v])).values()).map((likes, i) => (
          <li
            key={i}
            className="flex justify-between items-center gap-2 cursor-pointer"
          >
            <span
              onClick={() => navigate(`/profile/${likes.username}`)}
              className="hover:underline"
            >
              {likes.username}
            </span>
            {showMessage && <MailOpen
              className="h-4 w-4 text-blue-500 hover:text-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/conversations?user=${likes.username}`);
              }}
            />}
          </li>
        ))}
      </ul>
    ),
    liked_by: (
      <ul className="text-sm space-y-1">
        {Array.from(new Map(user.liked_by.map(v => [v.id, v])).values()).map((liked_by, i) => (
          <li
            key={i}
            className="justify-between flex items-center gap-2 cursor-pointer"
          >
            <span
              onClick={() => navigate(`/profile/${liked_by.username}`)}
              className="hover:underline"
            >
              {liked_by.username}
            </span>
            {showMessage && <MailOpen
              className="h-4 w-4 text-blue-500 hover:text-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/conversations?user=${liked_by.username}`);
              }}
            />}
          </li>
        ))}
      </ul>
    ),
    // matches: <p>{user.liked_by} matches (placeholder) 💘</p>,
    views: (
      <ul className="text-sm space-y-1">
        {Array.from(new Map(user.views.map(v => [v.id, v])).values()).map((viewer, i) => (
          <li
            key={i}
            className="justify-between flex items-center gap-2 cursor-pointer"
          >
            <span
              onClick={() => navigate(`/profile/${viewer.username}`)}
              className="hover:underline"
            >
              {viewer.username}
            </span>
            {showMessage && <MailOpen
              className="h-4 w-4 text-blue-500 hover:text-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/conversations?user=${viewer.username}`);
              }}
            />}
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
              className="justify-between flex items-center gap-2 cursor-pointer"
            >
              <span
                onClick={() => navigate(`/profile/${visitor.username}`)}
                className="hover:underline"
              >
                {visitor.username}
              </span>
              {showMessage && <MailOpen
                className="h-4 w-4 text-blue-500 hover:text-blue-700"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/conversations?user=${visitor.username}`);
                }}
              />}
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
          value={user.likes.length}
          color="text-pink-600 dark:text-pink-400"
          onClick={() => handleClick('likes')}
        />
        <StatItem
          label="Likes Received"
          value={user.liked_by.length}
          color="text-pink-600 dark:text-pink-400"
          onClick={() => handleClick('liked_by')}
        />
        {/* <StatItem
          label="Match"
          value={user.liked_by.length}
          color="text-pink-600 dark:text-pink-400"
          onClick={() => handleClick('matches')}
        /> */}
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


