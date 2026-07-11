// src/hooks/Calls/useWebSocketCallReject.js

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCallError, clearCall } from '../../../store/Call/CallStore';
import { getEcho } from '../../../echo';

export const useWebSocketCallReject = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const channelRef = useRef(null);

    useEffect(() => {
        const echo = getEcho();
        if (!echo || !user?.id) return;

        const channel = echo.private(`call-reject.${user.id}`);
        channelRef.current = channel;

        channel.listen('.call.rejected', (data) => {
            dispatch(setCallError('Звонок отклонён'));
            dispatch(clearCall());
        });

        return () => {
            channel.stopListening('.call.rejected');
        };
    }, [user?.id, dispatch]);

    return null;
};