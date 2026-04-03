import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIncomingCall, setCallStatus, clearCall, setCallError } from '../../store/Call/CallStore';

export const useWebSocketCalls = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const channelsRef = useRef([]);

    useEffect(() => {
        if (!window.Echo || !user?.id) return;

        const cleanup = () => {
            channelsRef.current.forEach(ch => ch?.stopListening?.());
            channelsRef.current = [];
        };
        cleanup();

        try {

            const incomingChannel = window.Echo.private(`call.${user.id}`);
            incomingChannel.listen('.incoming.call', (data) => {
                console.log('📥 Incoming call:', data);
                dispatch(setIncomingCall({
                    callId: data.call_id,
                    caller: data.caller,
                    callType: data.call_type,
                    sdpOffer: data.sdp_offer,
                    createdAt: data.created_at
                }));
            });
            channelsRef.current.push(incomingChannel);

            const acceptChannel = window.Echo.private(`call-accept.${user.id}`);
            acceptChannel.listen('.call.accepted', (data) => {
                dispatch(setCallStatus('ongoing'));
            });
            channelsRef.current.push(acceptChannel);


            const rejectChannel = window.Echo.private(`call-reject.${user.id}`);
            rejectChannel.listen('.call.rejected', () => {
                dispatch(setCallError('Звонок отклонён'));
                dispatch(clearCall());
            });
            channelsRef.current.push(rejectChannel);

            const endChannel = window.Echo.private(`call-end.${user.id}`);
            endChannel.listen('.call.ended', () => {
                dispatch(setCallStatus('ended'));
                dispatch(clearCall());
            });
            channelsRef.current.push(endChannel);

        } catch (error) {
            console.error('❌ WebSocket setup error:', error);
        }

        return cleanup;
    }, [user?.id, dispatch]);

    return null;
};