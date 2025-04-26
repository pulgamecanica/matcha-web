import { Notification } from './notification';
import { Message } from './message';

export type WSIncomingMessage =
  | { type: 'notification'; payload: Notification }
  | { type: 'message'; payload: Message }
  | { type: 'typing'; payload: { from: number; connection_id: number } }
  | { type: 'webrtc-offer'; payload: { from_user_id: number; offer: RTCSessionDescriptionInit } }
  | { type: 'webrtc-answer'; payload: { from_user_id: number; answer: RTCSessionDescriptionInit } }
  | { type: 'webrtc-ice-candidate'; payload: { from_user_id: number; candidate: RTCIceCandidateInit } }

export type WSOutgoingMessage =
  | { type: 'typing'; payload: { to_user_id: number } }
  | { type: 'message'; payload: { to_user_id: number; content: string } }
  | { type: 'ping' }
  | { type: 'webrtc-offer'; payload: { to_user_id: number; offer: RTCSessionDescriptionInit } }
  | { type: 'webrtc-answer'; payload: { to_user_id: number; answer: RTCSessionDescriptionInit } }
  | { type: 'webrtc-ice-candidate'; payload: { to_user_id: number; candidate: RTCIceCandidateInit } }

  export type WSIncomingPayloadMap = {
    notification: Notification;
    message: Message;
    typing: { from: number; connection_id: number };
    "webrtc-offer": { from_user_id: number; offer: RTCSessionDescriptionInit };
    "webrtc-answer": { from_user_id: number; answer: RTCSessionDescriptionInit };
    "webrtc-ice-candidate": { from_user_id: number; candidate: RTCIceCandidateInit };
  };