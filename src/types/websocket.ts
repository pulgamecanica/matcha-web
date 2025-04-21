import { Notification } from './notification';
import { Message } from './message';

export type WSIncomingMessage =
  | { type: 'notification'; payload: Notification }
  | { type: 'message'; payload: Message }
  | { type: 'typing'; payload: { from: number; connection_id: number } };

export type WSOutgoingMessage =
  | { type: 'typing'; payload: { to_user_id: number } }
  | { type: 'message'; payload: { to_user_id: number; content: string } }
  | { type: 'ping' };

export type WSIncomingPayloadMap = {
  notification: Notification;
  message: Message;
  typing: { from: number; connection_id: number };
};
