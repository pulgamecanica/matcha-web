import { useState } from 'react';
import axios from '@/api/axios';
import toast from 'react-hot-toast';
import { RelationshipStatusType } from '@api/relationshipStatus';
import { useMessages } from '@/hooks/useMessages';
import { PublicUser } from '@/types/user';

type PublicProfileActionsProps = {
  user: PublicUser;
  relationship: RelationshipStatusType;
};

export function PublicProfileActions({ user, relationship}: PublicProfileActionsProps) {
  const { liked, likedBy, matched, connected, blocked, refresh } = relationship;
  const { startConversationWith, removeConversationWith } = useMessages();
  const username = user.username;
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeToggle = async () => {
    setIsLoading(true);
    try {
      if (liked) {
        await axios.delete('/me/like', { data: { username } });
        toast.success('Unliked');
      } else {
        await axios.post('/me/like', { username });
        toast.success('Liked!');
      }
    } catch {
      toast.error('Failed to update like');
    } finally {
      await refresh();
      setIsLoading(false);
    }
  };

  const handleBlock = async () => {
    setIsLoading(true);
    try {
      await axios.post('/me/block', { username });
      toast.success('User blocked');
    } catch {
      toast.error('Failed to block');
    } finally {
      await refresh();
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await axios.post('/me/connect', { username });
      startConversationWith(user);
      toast.success('Connected!');
    } catch {
      toast.error('Failed to connect');
    } finally {
      await refresh();
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await axios.delete('/me/connect', { data: { username } });
      removeConversationWith(user);
      toast.success('Disconnected');
    } catch {
      toast.error('Failed to disconnect');
    } finally {
      await refresh();
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full mt-6 space-y-4">
      {/* 🩷 Match Label */}
      {matched ? (
        <div className="text-center">
          <span className="text-pink-500 font-semibold text-lg animate-bounce">
            💖 It's a Match!
          </span>
        </div>
      ) :
        (likedBy && (
          <div className="text-center">
            <span className="text-pink-500 font-semibold text-lg animate-bounce">
              ❤️ likes you!
            </span>
          </div>
        ))}

      {/* 🤝 Core Actions */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          disabled={isLoading}
          onClick={handleLikeToggle}
          className="px-4 py-2 rounded-md text-white bg-pink-600 hover:bg-pink-700 disabled:opacity-50"
        >
          {liked ? '💔 Unlike' : '❤️ Like'}
        </button>

        {matched && !connected && (
          <button
            disabled={isLoading}
            onClick={handleConnect}
            className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            🔗 Connect
          </button>
        )}

        {connected && (
          <button
            disabled={isLoading}
            onClick={handleDisconnect}
            className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700 disabled:opacity-50"
          >
            ❌ Disconnect
          </button>
        )}
      </div>

      {/* 🔒 Secondary Actions */}
      <div className="flex flex-wrap justify-center gap-3">
        {connected && (
          <button
            onClick={() => toast('📅 Date modal coming soon')}
            className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            📅 Propose Date
          </button>
        )}

        {!blocked && (
          <button
            disabled={isLoading}
            onClick={handleBlock}
            className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            🚫 Block
          </button>
        )}
      </div>
    </div>
  );
}