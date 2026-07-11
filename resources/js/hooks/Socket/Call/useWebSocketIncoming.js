

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIncomingCall, setCallStatus } from '../../../store/Call/CallStore';
import { getEcho } from '../../../echo';

export const useWebSocketIncoming = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const channelRef = useRef(null);

    useEffect(() => {
        const echo = getEcho();
        if (!echo || !user?.id) return;

        const channel = echo.private(`call.${user.id}`);
        channelRef.current = channel;

        channel.listen('.incoming.call', (data) => {
            if (data.caller_id === user.id) return;

            dispatch(setIncomingCall({
                callId: data.call_id,
                caller_id: data.caller_id,
                receiver_id: data.receiver_id,
                call_type: data.call_type,
                offer: data.sdp_offer,             
                caller_name: data.caller?.name,
                caller_avatar: data.caller?.avatar,
                created_at: data.created_at
            }));
            dispatch(setCallStatus('ringing'));
        });

        return () => {
            channel.stopListening('.incoming.call');
        };
    }, [user?.id, dispatch]);

    return null;
};