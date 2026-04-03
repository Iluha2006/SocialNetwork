import { useCallback } from 'react';

import { createOffer } from '../../WebRTC/CreateOffer';
import { useSelector } from 'react-redux';
import { usePeerConnection } from './usePeerConnection';

export const useOfferCall = () => {
    const { peerConnectionRef, createPeerConnection, getLocalStream } = usePeerConnection();
    const { user } = useSelector(state => state.user);

    const startCall = useCallback(async (receiverId) => {
        try {
            peerConnectionRef.current = createPeerConnection();
            const localStream = await getLocalStream();
            const offer = await createOffer(peerConnectionRef, receiverId, user.id, localStream);


            window.Echo.private(`user.${receiverId}`)
                .whisper('webrtc.offer', {
                   offer:{
                    offer: offer,
                    from: user.id,
                    call_type: 'audio'
                   }
                });


            const answerHandler = (data) => {
                if (data.from === receiverId && peerConnectionRef.current) {
                    peerConnectionRef.current.setRemoteDescription(
                        new RTCSessionDescription(data.answer)
                    );
                }
            };

            const iceHandler = (data) => {
                if (data.from === receiverId && peerConnectionRef.current) {
                    peerConnectionRef.current.addIceCandidate(
                        new RTCIceCandidate(data.candidate)
                    );
                }
            };

            window.Echo.private(`user.${user.id}`)
                .listen('webrtc.answer', answerHandler)
                .listen('webrtc.ice-candidate', iceHandler);


            return {
                success: true,
                offer,
                cleanup: () => {
                    window.Echo.private(`user.${user.id}`)
                        .stopListening('webrtc.answer', answerHandler)
                        .stopListening('webrtc.ice-candidate', iceHandler);
                }
            };
        } catch (error) {
            console.error('❌ Error starting call:', error);
            throw error;
        }
    }, [user?.id, createPeerConnection, getLocalStream]);

    return { startCall };
};