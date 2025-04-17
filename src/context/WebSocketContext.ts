/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext } from 'react';
import { WSOutgoingMessage } from '@/types/websocket';

type WebSocketContextType = {
  sendMessage: (msg: WSOutgoingMessage) => void;
  registerHandler: (type: string, handler: (data: any) => void) => void;
  ready: boolean;
};

export const WebSocketContext = createContext<WebSocketContextType>({
  sendMessage: () => {},
  registerHandler: () => {},
  ready: false,
});


