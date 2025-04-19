// useMessages.ts
import { useEffect, useMemo, useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { fetchAllMessages } from '@/api/message';
import { Conversation } from '@/types/conversation';
import toast from 'react-hot-toast';
import { Message } from '@/types/message';

export function useMessages() {
  const { registerHandler } = useWebSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<number, boolean>>({});
  
  useEffect(() => {
    fetchAllMessages()
      .then(setConversations)
      .catch((e) => toast.error(`Failed to load messages: ${e}`));
  }, []);

  useEffect(() => {
    registerHandler('message', (msg: Message) => {
      fetchAllMessages()
        .then(setConversations)
        .catch(() => toast.error(`Failed to load messages + ${msg}`));
    });

    registerHandler('typing', ({ from }: { from: number }) => {
      setTypingUsers((prev) => ({ ...prev, [from]: true }));
      setTimeout(() => {
        setTypingUsers((prev) => {
          const updated = { ...prev };
          delete updated[from];
          return updated;
        });
      }, 1500);
    });
  }, [registerHandler]);

  const appendMessageToConversation = (username: string, msg: Message) => {
    setConversations((prev) => {
      const updated = [...prev];
      const convo = updated.find((c) => c.user.username === username);
      if (convo && !convo.messages.some((m) => m.id === msg.id)) {
        convo.messages = [...convo.messages, msg];
      }
      return [...updated];
    });
  };

  const isUserTyping = useMemo(() => {
    return (id: number) => Boolean(typingUsers[id]);
  }, [typingUsers]);

  return {
    conversations,
    isUserTyping,
    appendMessageToConversation
  };
}
