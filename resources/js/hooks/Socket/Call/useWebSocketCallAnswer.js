

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentCall, setCallStatus } from '../../../store/Call/CallStore';
import { getEcho } from '../../../echo';

export const useWebSocketCallAnswer = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const channelRef = useRef(null);

    useEffect(() => {
        const echo = getEcho();
        if (!echo || !user?.id) return;

        const channel = echo.private(`call-accept.${user.id}`);
        channelRef.current = channel;

        channel.listen('.call.accepted', (data) => {
         
            dispatch(setCurrentCall({
                callId: data.call_id,
                caller_id: data.caller_id,
                receiver_id: data.receiver_id,
                call_type: data.call_type,
                sdp_answer: data.sdp_answer,       
                receiver_name: data.receiver?.name,
                receiver_avatar: data.receiver?.avatar,
                started_at: data.accepted_at
            }));
            dispatch(setCallStatus('ongoing'));
        });

        return () => {
            channel.stopListening('.call.accepted');
        };
    }, [user?.id, dispatch]);

    return null;
};