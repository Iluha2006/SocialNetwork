import { useCallback } from 'react';
import { useWebRTC } from './useWebRTC'
import { createOffer } from '../../WebRTC/CreateOffer';
import { useSelector } from 'react-redux';

export const useOfferCall = () => {
    const {
        peerConnectionRef,
        createPeerConnection,
        getLocalStream,
    } = useWebRTC();

    const { user } = useSelector(state => state.user);

    const startCall = useCallback(async (receiverId) => {
        try {





            peerConnectionRef.current = createPeerConnection();


            const localStream = await getLocalStream();


            const offer = await createOffer(peerConnectionRef, receiverId, user.id, localStream);


            window.Echo.private(`user.${user.id}`)
                .listen('webrtc.answer', async (data) => {
                    if (data.from === receiverId) {

                        try {
                            await peerConnectionRef.current.setRemoteDescription(
                                new RTCSessionDescription(data.answer)
                            );

                        } catch (error) {
                            console.error('Error setting remote description:', error);
                        }
                    }
                })
                .listen('webrtc.ice-candidate', (data) => {
                    if (data.from === receiverId && peerConnectionRef.current) {

                        peerConnectionRef.current.addIceCandidate(
                            new RTCIceCandidate(data.candidate)
                        ).catch(error => {
                            console.error('Error adding ICE candidate:', error);
                        });
                    }
                });


            return { success: true, offer };

        } catch (error) {
            console.error('❌ Error starting call:', error);
            throw error;
        }
    }, [user?.id, createPeerConnection, getLocalStream]);

    return { startCall };
};
