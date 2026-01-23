import { useCallback, useEffect } from 'react';
import { useWebRTC } from './useWebRTC';
import { handleOffer } from '../../WebRTC/CreateAnswer';
import { useSelector } from 'react-redux';

export const useCallAnswer = (onIncomingCall) => {
    const {
        peerConnectionRef,
        createPeerConnection,
        getLocalStream,
    } = useWebRTC();

    const { user } = useSelector(state => state.user);

    useEffect(() => {





        const channel = window.Echo.private(`call.${user.id}`);


        channel.listen('incoming.call', async (data) => {
            try {

                if (onIncomingCall) {
                    onIncomingCall(data);
                }
            } catch (error) {
                console.error('Error handling incoming call:', error);
            }
        });


        channel.listen('webrtc.offer', async (data) => {
            try {


                peerConnectionRef.current = createPeerConnection();



                const localStream = await getLocalStream();

                await handleOffer(
                    peerConnectionRef,
                    data.offer,
                    data.from,
                    user.id,
                    localStream
                );



            } catch (error) {
                console.error('❌ Error handling WebRTC offer:', error);
            }
        });


        channel.listen('webrtc.ice-candidate', (data) => {
            if (peerConnectionRef.current && data.from) {

                peerConnectionRef.current.addIceCandidate(
                    new RTCIceCandidate(data.candidate)
                ).catch(error => {
                    console.error('Error adding ICE candidate:', error);
                });
            }
        });



        return () => {
            channel.stopListening('incoming.call');
            channel.stopListening('webrtc.offer');
            channel.stopListening('webrtc.ice-candidate');
        };
    }, [user, onIncomingCall, createPeerConnection, getLocalStream]);

    return {};
};
