// src/context/WebSocketContext.tsx
import {
  WSOutgoingMessage,
  WSIncomingMessage,
  WSIncomingPayloadMap,
} from '@/types/websocket';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useUserMe } from '@hooks/useUserMe';
import { Handler, WebSocketContext } from '@context/WebSocketContext';

const baseURL = import.meta.env.VITE_API_BASE || 'localhost:9292';

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const { user } = useUserMe();
  const wsRef = useRef<WebSocket | null>(null);
  const [ready, setReady] = useState(false);


  const handlers: Partial<{
    [K in keyof WSIncomingPayloadMap]: Handler<WSIncomingPayloadMap[K]>[];
  }> = {};

  const registerHandler = <K extends keyof WSIncomingPayloadMap>(
    type: K,
    handler: Handler<WSIncomingPayloadMap[K]>
  ) => {
    if (!handlers[type]) handlers[type] = [];
    handlers[type]!.push(handler);
  };

  const sendMessage = (msg: WSOutgoingMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  };

  useEffect(() => {
    if (!token || !isAuthenticated || !user) return;

    const ws = new WebSocket(`ws://${baseURL}/ws?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setReady(true);
      console.log('🔌 WebSocket connected');
    };

    ws.onclose = () => {
      setReady(false);
      console.log('❌ WebSocket disconnected');
    };

    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data) as WSIncomingMessage;
      switch (parsed.type) {
        case 'message':
          handlers.message?.forEach((h) => h(parsed.payload));
          break;
        case 'notification':
          handlers.notification?.forEach((h) => h(parsed.payload));
          break;
        case 'typing':
          handlers.typing?.forEach((h) => h(parsed.payload));
          break;
        default:
          console.warn('Unknown WebSocket message type.');
      }
    };

    return () => {
      ws.close();
    };
  }, [token, isAuthenticated, user, handlers.message, handlers.notification, handlers.typing]);

  return (
    <WebSocketContext.Provider value={{ sendMessage, registerHandler, ready }}>
      {children}
    </WebSocketContext.Provider>
  );
}
