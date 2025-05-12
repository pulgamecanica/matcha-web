import { useMessages } from '@/hooks/useMessages';
import { useUserMe } from '@/hooks/useUserMe';
import { useEffect, useState } from 'react';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ConversationPanel } from '@/components/chat/ConversationPanel';
import { Conversation } from '@/types/conversation';
import { useSearchParams } from 'react-router-dom';
import { useRef } from 'react';

export function ConversationsPage() {
  const { user } = useUserMe();
  const { conversations, isUserTyping, appendMessageToConversation } = useMessages();
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [searchParams] = useSearchParams();
  const initialUsername = searchParams.get('user');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsPanelVisible(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectUser = (username: string) => {
    setSelectedUsername(username);
    if (window.innerWidth < 768) {
      setIsPanelVisible(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        window.innerWidth < 768
      ) {
        setIsPanelVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (initialUsername) {
      setSelectedUsername(initialUsername);
    }
  }, [initialUsername]);
  
  useEffect(() => {
    setActiveConversation(conversations.find((c) => c.user.username === selectedUsername) || null);
  }, [conversations, selectedUsername]);

  const handleSendLocalMessage = (content: string) => {
    if (!activeConversation || !user) return;

    appendMessageToConversation(activeConversation.user.username, {
      id: Date.now(),
      connection_id: activeConversation.messages[activeConversation.messages.length -1]?.connection_id ?? -1,
      sender_id: user.id,
      sender_username: user.username,
      content,
      created_at: new Date().toISOString(),
    });
  };

  if (!user) {
    return (
      <div className='flex h-screen w-screen items-center justify-center'>
        "Fetching all messages..."
      </div>
    )
  }
  return (
    <>
      {!isPanelVisible && (
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-50 p-2 bg-gray-300 dark:bg-gray-700 rounded-full md:hidden"
          onClick={() => setIsPanelVisible(true)}
        >
          ➤
        </button>
      )}

      <div className="flex h-screen shadow-md overflow-hidden bg-gray-200 dark:bg-gray-800">
        <div
          ref={panelRef}
          className={`absolute z-[100] flex md:static h-full w-64 transition-transform duration-300 ease-in-out ${isPanelVisible ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <ConversationPanel
            onSelectUser={handleSelectUser}
            activeUsername={selectedUsername}
          />
        </div>
        <div className="flex-1 flex flex-col me-20 bg-white dark:bg-gray-900">
          {activeConversation ? (
            <ChatWindow
              conversation={activeConversation}
              currentUser={user}
              isTyping={isUserTyping(activeConversation.user.id)}
              onSendLocalMessage={handleSendLocalMessage}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">Select a conversation</div>
          )}
        </div>
    </div>
    </>
  );
}
