import {
  createContext,
} from 'react';
import { Conversation } from '@/types/conversation';
import { Message } from '@/types/message';
import { PublicUser } from '@/types/user';


type MessagesContextType = {
  conversations: Conversation[];
  isUserTyping: (id: number) => boolean;
  appendMessageToConversation: (username: string, msg: Message) => void;
  startConversationWith: (user: PublicUser) => void;
  removeConversationWith: (user: PublicUser) => void;
  refetchAllMessages: () => Promise<void>;
};

export const MessagesContext = createContext<MessagesContextType | undefined>(undefined);