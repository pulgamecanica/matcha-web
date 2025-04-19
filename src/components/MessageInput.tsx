import { useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

export function MessageInput({ connectionId }: { connectionId: number }) {
  const { sendMessage } = useWebSocket();
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage({ type: 'message', payload: { connection_id: connectionId, content: text } });
    setText('');
  };

  const handleTyping = () => {
    sendMessage({ type: 'typing', payload: { connection_id: connectionId } });
  };

  return (
    <div className="border-t px-4 py-3 flex items-center gap-2 dark:border-gray-700">
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleTyping}
        className="flex-1 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
}
