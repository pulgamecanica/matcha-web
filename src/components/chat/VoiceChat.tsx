import { useEffect, useRef } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { PhoneIcon, PhoneOffIcon } from 'lucide-react';
import { CallIncomingModal } from './CallIncomingModal';
import { useMessages } from '@/hooks/useMessages';

type Props = {
  toUserId: number;
  username: string;
};

export function VoiceChat({ toUserId, username }: Props) {
  const { sendMessage } = useWebSocket();
  const {
    incomingCall,
    callStatus,
    setCallStatus,
    setIncomingCall,
    remoteAnswer,
    iceCandidates,
  } = useMessages();

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!remoteAnswer || !pcRef.current) return;
    pcRef.current.setRemoteDescription(new RTCSessionDescription(remoteAnswer));
    setCallStatus('connected');
  }, [remoteAnswer]);

  useEffect(() => {
    if (!pcRef.current || !iceCandidates?.length) return;
    iceCandidates.forEach((candidate) => {
      pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }, [iceCandidates]);

  const createPeerConnection = (targetUserId: number) => {
    const pc = new RTCPeerConnection();

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendMessage({
          type: 'call:ice-candidate',
          payload: {
            to_user_id: targetUserId,
            candidate: event.candidate.toJSON(),
          },
        });
      }
    };

    pc.ontrack = (event) => {
      const audio = new Audio();
      audio.srcObject = event.streams[0];
      audio.play().catch(() => {
        console.warn("User gesture required to play audio.");
      });
    };

    pcRef.current = pc;
    return pc;
  };

  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;

    const pc = createPeerConnection(toUserId);
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    sendMessage({ type: 'call:offer', payload: { to_user_id: toUserId, offer } });

    setCallStatus('calling');

    setTimeout(() => {
      if (callStatus === 'calling') {
        setCallStatus('unavailable');
        endCall();
      }
    }, 15000);
  };

  const acceptCall = async () => {
    if (!incomingCall) return;

    const pc = createPeerConnection(incomingCall.from_user_id);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    sendMessage({
      type: 'call:answer',
      payload: { to_user_id: incomingCall.from_user_id, answer },
    });

    setCallStatus('connected');
    setIncomingCall(null);
  };

  const declineCall = () => {
    if (incomingCall) {
      sendMessage({ type: 'call:decline', payload: { to_user_id: incomingCall.from_user_id } });
    }
    setCallStatus('declined');
    setIncomingCall(null);
  };

  const endCall = () => {
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;

    if (callStatus === 'connected' || callStatus === 'calling') {
      sendMessage({ type: 'call:end', payload: { to_user_id: toUserId } });
    }

    setCallStatus('ended');
    setIncomingCall(null);
  };

  return (
    <div className="flex items-center gap-2">
      {callStatus !== 'idle' && (
        <span className="text-sm text-gray-400">
          {callStatus === 'calling' && 'Calling...'}
          {callStatus === 'incoming' && 'Incoming call...'}
          {callStatus === 'connected' && 'Connected ✅'}
          {callStatus === 'declined' && 'Declined ❌'}
          {callStatus === 'unavailable' && 'No response ❌'}
          {callStatus === 'ended' && 'Call ended.'}
        </span>
      )}

      {callStatus === 'incoming' && incomingCall && (
        <CallIncomingModal
          callerUsername={username}
          onAccept={acceptCall}
          onDecline={declineCall}
        />
      )}

      {callStatus === 'connected' || callStatus === 'calling' ? (
        <button onClick={endCall} className="bg-red-500 px-4 py-2 rounded text-white">
          <PhoneOffIcon size={16} />
        </button>
      ) : (
        <button onClick={startCall} className="bg-green-500 px-4 py-2 rounded text-white">
          <PhoneIcon size={16} />
        </button>
      )}
    </div>
  );
}
