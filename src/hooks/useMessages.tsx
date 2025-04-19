import { useEffect, useMemo, useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { fetchAllMessages, fetchMessagesFrom } from '@/api/message';
import { Conversation } from '@/types/conversation';
import toast from 'react-hot-toast';

export function useMessages(activeUsername?: string) {
  const { registerHandler } = useWebSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const convs = await fetchAllMessages();
        setConversations(convs);
      } catch (e) {
        toast.error(`Failed to load messages: ${e}`);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!activeUsername) return;
      try {
        const conv = await fetchMessagesFrom(activeUsername);
        setActiveConversation(conv);
      } catch (e) {
        toast.error(`Failed to load message from ${activeUsername}: ${e}`);
      }
    };

    load();
  }, [activeUsername]);

  useEffect(() => {
    registerHandler('message', (msg) => {
      setConversations((prev) => {
        const updated = [...prev];
        const convo = updated.find(c => c.user.username === msg.sender_username);
        if (convo) {
          convo.messages.push(msg);
        } else {
          // optionally: fetchMessagesFrom(msg.sender_username) and add a new conversation
        }
        return updated.sort((a, b) => {
          const aTime = new Date(a.messages[a.messages.length -1]?.created_at || 0).getTime();
          const bTime = new Date(b.messages[b.messages.length -1]?.created_at || 0).getTime();
          return bTime - aTime;
        });
      });

      if (activeConversation?.user.username === msg.sender_username) {
        setActiveConversation((prev) =>
          prev ? { ...prev, messages: [...prev.messages, msg] } : null
        );
      }
    });

    registerHandler('typing', (payload) => {
      const userId = Number(payload.from);

      setTypingUsers((prev) => ({
        ...prev,
        [userId]: true
      }));

      setTimeout(() => {
        setTypingUsers((prev) => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
      }, 1500);
    });
  }, [activeConversation, registerHandler]);

  const isUserTyping = useMemo(() => {
    return (id: number) => Boolean(typingUsers[id]);
  }, [typingUsers]);

  return {
    conversations,
    activeConversation,
    isUserTyping,
  };
}
