import { useEffect, useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Message } from '@/types/message';
import { fetchMessagesFrom } from '@/api/message';

export function useChat(connectionId: number, currentUsername: string, targetUsername: string) {
  const { sendMessage, registerHandler } = useWebSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  useEffect(() => {
    fetchMessagesFrom(targetUsername).then(setMessages);
  }, [targetUsername]);

  const sendChatMessage = (content: string) => {
    sendMessage({
      type: 'message',
      payload: { connection_id: connectionId, content },
    });
  };

  const sendTypingSignal = () => {
    sendMessage({ type: 'typing', payload: { connection_id: connectionId } });
  };

  useEffect(() => {
    registerHandler('message', (msg: Message) => {
      if (msg.connection_id === connectionId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    registerHandler('typing', ({ connection_id, username }) => {
      if (connection_id === connectionId && username !== currentUsername) {
        setTypingUser(username);
        setTimeout(() => setTypingUser(null), 1500); // clear after 1.5s
      }
    });
  }, [connectionId, registerHandler, currentUsername]);

  return {
    messages,
    typingUser,
    sendChatMessage,
    sendTypingSignal,
  };
}
