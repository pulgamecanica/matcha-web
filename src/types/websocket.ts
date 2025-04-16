import { Notification } from '@/types/notification';

export type WSIncomingMessage =
  | {
      type: 'notification';
      payload: Notification;
    };
    
export type WSOutgoingMessage =
  | { type: 'typing'; to: number }
  | { type: 'ping' };