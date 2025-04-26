import { useEffect, useRef, useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket'; // your custom hook
import { PhoneIcon } from 'lucide-react';

type Props = {
    toUserId: number;
};

export function VoiceCall({ toUserId }: Props) {
    const { sendMessage, registerHandler, ready } = useWebSocket();
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    const [inCall, setInCall] = useState(false);

    useEffect(() => {
        if (!ready) return;

        // Handle incoming WebRTC Offer (Receiver's side)
        registerHandler('webrtc-offer', async ({ from_user_id, offer }) => {
            const pc = createPeerConnection(from_user_id);

            // Set the remote offer received from the caller
            await pc.setRemoteDescription(new RTCSessionDescription(offer));

            // Get the local media stream
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localStreamRef.current = stream;
            stream.getTracks().forEach(track => pc.addTrack(track, stream));

            // Create an answer and send it back to the caller
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            // Send the answer to the caller
            sendMessage({
                type: 'webrtc-answer',
                payload: { to_user_id: from_user_id, answer }
            });

            setInCall(true);
        });

        // Handle incoming WebRTC Answer (Caller side receives answer)
        registerHandler('webrtc-answer', async ({ answer }) => {
            const pc = pcRef.current;
            if (pc) {
                // Set the remote description with the received answer
                await pc.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });

        // Handle incoming ICE Candidate
        registerHandler('webrtc-ice-candidate', async ({ candidate }) => {
            const pc = pcRef.current;
            if (pc) {
                // Add the ICE candidate to the peer connection
                console.log('Received ICE candidate:', candidate);
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

    }, [ready]);

    // Create a new PeerConnection
    const createPeerConnection = (targetUserId: number) => {
        const pc = new RTCPeerConnection();

        // Send ICE candidates to the target user
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendMessage({
                    type: 'webrtc-ice-candidate',
                    payload: {
                        to_user_id: targetUserId, // Send to the correct user
                        candidate: event.candidate.toJSON(),
                    },
                });
            }
        };

        // Handle receiving remote tracks (audio from the other user)
        pc.ontrack = (event) => {
            console.log('Received remote track:', event.streams[0]);
            const audio = new Audio();
            audio.srcObject = event.streams[0];
            audio.play();
        };

        pcRef.current = pc;
        return pc;
    };

    // Start the call (Caller side)
    const startCall = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = stream;

        const pc = createPeerConnection(toUserId);
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        // Create an offer and send it to the receiver
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // Send the offer to the target user (callee)
        sendMessage({
            type: 'webrtc-offer',
            payload: { to_user_id: toUserId, offer }
        });

        setInCall(true);
    };

    // End the call
    const endCall = () => {
        pcRef.current?.close();
        pcRef.current = null;
        localStreamRef.current?.getTracks().forEach(track => track.stop());
        setInCall(false);
    };

    return (
        <div className="">
            {inCall ? (
                <button type='button' onClick={endCall} className="bg-red-500 px-4 py-2 rounded">
                    <PhoneIcon fontSize="small" />
                </button>
            ) : (
                <button type='button' onClick={startCall} className="bg-green-500 px-4 py-2 rounded">
                    <PhoneIcon fontSize="small" />
                </button>
            )}
        </div>
    );
}

