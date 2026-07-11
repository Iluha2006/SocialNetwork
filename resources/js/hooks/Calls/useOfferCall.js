
import { useCallback } from 'react';
import { usePeerConnection } from './usePeerConnection';
import { createOffer } from '../../WebRTC/CreateOffer';

export const useOfferCall = () => {
    const { peerConnectionRef, createPeerConnection, getLocalStream } = usePeerConnection();

    const startCall = useCallback(async (receiverId, callId) => {
        try {
            peerConnectionRef.current = createPeerConnection();
            const localStream = await getLocalStream();

            const offer = await createOffer(peerConnectionRef, localStream);

            return {
                success: true,
                offer,
                cleanup: () => {
                    if (peerConnectionRef.current) {
                        peerConnectionRef.current.onicecandidate = null;
                        peerConnectionRef.current.close();
                    }
                }
            };
        } catch (error) {
            if (peerConnectionRef.current) {
                peerConnectionRef.current.onicecandidate = null;
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
            console.error('Error starting call:', error);
            throw error;
        }
    }, [createPeerConnection, getLocalStream, peerConnectionRef]);

    return { startCall };
};