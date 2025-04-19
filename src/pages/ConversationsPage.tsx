import { useMessages } from '@/hooks/useMessages';
import { useUserMe } from '@/hooks/useUserMe';
import { useState } from 'react';
import { ChatWindow } from '@/components/ChatWindow';
import { ConversationPanel } from '@/components/ConversationPanel';

export default function ConversationsPage() {
  const { user } = useUserMe();
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const { conversations, activeConversation, isUserTyping } = useMessages(selectedUsername ?? undefined);

  if (!user) {
    return (
      <div className='flex h-screen w-screen items-center justify-center'>
        "Fetching all messages..."
      </div>
    )
  }
  return (
    <div className="flex h-screen rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-900">
      <ConversationPanel
        user={user}
        conversations={conversations}
        onSelectUser={setSelectedUsername}
        activeUsername={selectedUsername}
        isUserTyping={isUserTyping}
      />
      <div className="flex-1 flex flex-col me-20">
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            currentUser={user}
            isTyping={isUserTyping(activeConversation.user.id)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">Select a conversation</div>
        )}
      </div>
    </div>
  );
}
