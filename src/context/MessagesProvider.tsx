import {
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { useWebSocket } from '@hooks/useWebSocket';
import { fetchAllMessages } from '@api/messages';
import { fetchConnections } from '@api/connections';
import { Conversation } from '@/types/conversation';
import { Message } from '@/types/message';
import { PublicUser } from '@/types/user';
import { MessagesContext } from '@context/MessagesContext';
import toast from 'react-hot-toast';


export function MessagesProvider({ children }: { children: ReactNode }) {
  const { registerHandler } = useWebSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<number, boolean>>({});
  const [connections, setConnections] = useState<PublicUser[]>([]);

  useEffect(() => {
    fetchAllMessages()
      .then(setConversations)
      .catch((e) => toast.error(`Failed to load messages: ${e}`));
    fetchConnections()
      .then(setConnections)
      .catch((e) => toast.error(`Failed to load connections: ${e}`));
  }, []);

  useEffect(() => {
    registerHandler('message', (msg: Message) => {
      fetchAllMessages()
        .then(setConversations)
        .catch(() => toast.error(`Failed to reload on new message ${msg}`));
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
      return updated;
    });
  };

  const isUserTyping = useMemo(() => {
    return (id: number) => Boolean(typingUsers[id]);
  }, [typingUsers]);

  const startConversationWith = (user: PublicUser) => {
    setConversations((prev) => {
      const exists = prev.some((c) => c.user.username === user.username);
      if (exists) return prev;
  
      const newConvo: Conversation = {
        user,
        messages: [],
      };
  
      return [newConvo, ...prev];
    });
  };
  

  return (
    <MessagesContext.Provider
      value={{
        conversations,
        connections,
        isUserTyping,
        appendMessageToConversation,
        startConversationWith
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}