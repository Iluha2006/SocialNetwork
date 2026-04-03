import { useCallback, useEffect } from 'react';
import { handleOffer } from '../../WebRTC/CreateAnswer';
import { useSelector } from 'react-redux';
import { usePeerConnection } from './usePeerConnection';

export const useCallAnswer = (onIncomingCall) => {
    const { peerConnectionRef, createPeerConnection, getLocalStream } = usePeerConnection();
    const { user } = useSelector(state => state.user);

    useEffect(() => {
        if (!user?.id) return;

        const channel = window.Echo.private(`user.${user.id}`);
        const offerHandler = async (data) => {
            try {
                if (onIncomingCall) onIncomingCall(data);

                peerConnectionRef.current = createPeerConnection();
                const localStream = await getLocalStream();

                const { answer } = await handleOffer(
                    peerConnectionRef,
                    data.offer,
                    data.from,
                    user.id,
                    localStream
                );

                // 📡 Отправка answer обратно
                window.Echo.private(`user.${data.from}`)
                    .whisper('webrtc.answer', {
                        answer: answer,
                        from: user.id
                    });

            } catch (error) {
                console.error('❌ Error handling WebRTC offer:', error);
            }
        };

        // 📡 Обработка ICE кандидатов
        const iceHandler = (data) => {
            if (peerConnectionRef.current) {
                peerConnectionRef.current.addIceCandidate(
                    new RTCIceCandidate(data.candidate)
                ).catch(err => console.error('ICE error:', err));
            }
        };

        channel.listen('webrtc.offer', offerHandler)
               .listen('webrtc.ice-candidate', iceHandler);

        return () => {
            channel.stopListening('webrtc.offer', offerHandler)
                   .stopListening('webrtc.ice-candidate', iceHandler);
        };
    }, [user?.id, onIncomingCall, createPeerConnection, getLocalStream]);

    return {useCallAnswer};
};