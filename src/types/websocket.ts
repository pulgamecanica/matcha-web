import { Notification } from '@/types/notification';
import { Message } from '@/types/message';

export type WSIncomingMessage =
  | { type: 'notification'; payload: Notification }
  | { type: 'message'; payload: Message }
  | { type: 'typing'; payload: { from: number; connection_id: number } };

export type WSOutgoingMessage =
  | { type: 'typing'; payload: { connection_id: number; } }
  | { type: 'message'; payload: { connection_id: number; content: string } }
  | { type: 'ping' };
