/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { useAuth } from '@/hooks/useAuth';
import { WSOutgoingMessage } from '@/types/websocket';
import { useUserMe } from '@/hooks/useUserMe';
import { WebSocketContext } from '@/context/WebSocketContext';

const handlers: Record<string, ((payload: any) => void)[]> = {};

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const { user } = useUserMe();
  const wsRef = useRef<WebSocket | null>(null);
  const [ready, setReady] = useState(false);

  const sendMessage = (msg: WSOutgoingMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  };

  const registerHandler = (type: string, handler: (data: any) => void) => {
    if (!handlers[type]) handlers[type] = [];
    handlers[type].push(handler);
  };

  useEffect(() => {
    if (!token || !isAuthenticated || !user) return;

    const ws = new WebSocket(`ws://localhost:9292/ws?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setReady(true);
      console.log('🔌 WebSocket connected');
    };

    ws.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      handlers[type]?.forEach((h) => h(payload));
    };

    ws.onclose = () => {
      setReady(false);
      console.log('❌ WebSocket closed');
    };

    return () => {
      ws.close();
    };
  }, [token, isAuthenticated, user]);

  return (
    <WebSocketContext.Provider value={{ sendMessage, registerHandler, ready }}>
      {children}
    </WebSocketContext.Provider>
  );
}
