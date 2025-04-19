import { MessageInput } from '@/components/MessageInput';
import { TypingIndicator } from '@/components/TypingIndicator';

export function ChatWindow({
  conversation,
  currentUser,
  isTyping
}: {
  conversation: any;
  currentUser: any;
  isTyping: boolean;
}) {
  return (
    <div className="flex flex-col h-full border-e  dark:border-gray-500">
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {conversation.messages.map((msg: any) => {
          const isMine = msg.sender_id === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              title={new Date(msg.created_at).toLocaleString()} // Tooltip on hover
            >
              <div
                className={`relative group max-w-xs px-3 py-2 rounded-md text-sm break-words ${
                  isMine
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-black dark:bg-gray-700 dark:text-white'
                }`}
              >
                {msg.content}
                <span className="absolute -bottom-4 right-1 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        {isTyping && <TypingIndicator />}
      </div>
      <MessageInput connectionId={conversation.messages.at(-1)?.connection_id} senderId={conversation.user.id} />
    </div>
  );
}
