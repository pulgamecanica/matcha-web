import { ConversationItem } from '@/components/ConversationItem';
import { LucideSearch } from 'lucide-react';
import { useState } from 'react';

export function ConversationPanel({
  user,
  conversations,
  onSelectUser,
  activeUsername,
  isUserTyping
}: {
  user: any;
  conversations: any[];
  onSelectUser: (username: string) => void;
  activeUsername: string | null;
  isUserTyping: (username: string) => boolean;
}) {
  const [search, setSearch] = useState('');

  const filtered = conversations.filter((c) =>
    c.user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-72 border-r dark:border-gray-500 bg-gray-100 dark:bg-gray-800 flex flex-col">
      <div className="p-4 flex items-center gap-2 border-b dark:border-gray-500">
        <img
          src={user.profile_picture_url || '/default.png'}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="text-sm font-semibold">{user.username}</div>
      </div>

      <div className="px-2 py-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-2 py-1.5 text-sm rounded bg-white dark:bg-gray-700 border dark:border-gray-500"
          />
          <LucideSearch className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <hr className='dark:border-gray-500' />
      <div className="overflow-y-auto flex-1">
        {filtered.map((conv) => (
          <ConversationItem
            key={conv.user.username}
            user={conv.user}
            lastMessage={conv.messages.at(-1)}
            isActive={conv.user.username === activeUsername}
            isTyping={isUserTyping(conv.user.username)}
            onClick={() => onSelectUser(conv.user.username)}
          />
        ))}
      </div>
    </div>
  );
}
