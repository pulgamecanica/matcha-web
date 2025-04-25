import { useCallback, useEffect, useState } from 'react';
import axios from '@/api/axios';
import { PublicUser } from '@/types/user';

export function RelationshipStatus(username: string, currentUsername: string) {
  const [liked, setLiked] = useState(false);
  const [likedBy, setLikedBy] = useState(false);
  const [matched, setMatched] = useState(false);
  const [connected, setConnected] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [matches, setMatchList] = useState<PublicUser[]>([]);

  const refresh = useCallback(async () => {
    if (!username || username === currentUsername) return;

    try {
      const [likes, likedByList, matches, connections, blockedUsers, matchList] = await Promise.all([
        axios.get('/me/likes'),
        axios.get('/me/liked_by'),
        axios.get('/me/matches'),
        axios.get('/me/connections'),
        axios.get('/me/blocked'),
        axios.get('/me/matches'),

      ]);
      setLiked((likes as unknown as PublicUser[]).some((u) => u.username === username));
      setLikedBy((likedByList as unknown as PublicUser[]).some((u) => u.username === username));
      setMatched((matches as unknown as PublicUser[]).some((u) => u.username === username));
      setConnected((connections as unknown as PublicUser[]).some((u) => u.username === username));
      setBlocked((blockedUsers as unknown as string[]).some((u) => u === username));
      setMatchList(matchList as unknown as PublicUser[]);
    } catch (e) {
      console.error('Failed to fetch relationship status', e);
    }
  }, [username, currentUsername]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { liked, likedBy, matched, connected, blocked, refresh, matches };
}