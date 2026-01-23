// src/hooks/useCallWebSocket.js
import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { websocketService } from '../services/websocketService';
import {
    setIncomingCall,
    setCallStatus,
    clearIncomingCall,
    setCurrentCall
} from '../store/CallStore';

export const useCallWebSocket = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const subscriptionsRef = useRef([]);



    const handleCallAccepted = useCallback((data) => {
        console.log('Handling call accepted:', data);
        dispatch(setCallStatus('ongoing'));
        // Здесь можно установить SDP answer для WebRTC
        // updatePeerConnectionWithAnswer(data.sdp_answer);
    }, [dispatch]);

    // Обработка отклонения звонка
    const handleCallRejected = useCallback((data) => {
        console.log('Handling call rejected:', data);
        dispatch(setCallStatus('rejected'));
        dispatch(clearIncomingCall());
        // Показать уведомление
        alert('Звонок отклонен');
    }, [dispatch]);

    // Обработка завершения звонка
    const handleCallEnded = useCallback((data) => {
        console.log('Handling call ended:', data);
        dispatch(setCallStatus('ended'));
        dispatch(setCurrentCall(null));
        dispatch(clearIncomingCall());
        // Показать уведомление
        alert('Звонок завершен');
    }, [dispatch]);

    // Подписка на WebSocket события
    const subscribeToCallEvents = useCallback(() => {
        if (!user?.id) return;

        console.log('Subscribing to call events for user:', user.id);

        // Отписка от старых подписок
        unsubscribeFromCallEvents();

        // Подписка на события
        subscriptionsRef.current = [
            websocketService.subscribeToIncomingCalls(user.id, handleIncomingCall),
            websocketService.subscribeToCallAccepted(user.id, handleCallAccepted),
            websocketService.subscribeToCallRejected(user.id, handleCallRejected),
            websocketService.subscribeToCallEnded(user.id, handleCallEnded)
        ];

        console.log('Subscriptions created:', subscriptionsRef.current);
    }, [user?.id, handleIncomingCall, handleCallAccepted, handleCallRejected, handleCallEnded]);

    // Отписка от событий
    const unsubscribeFromCallEvents = useCallback(() => {
        console.log('Unsubscribing from call events');
        subscriptionsRef.current.forEach(subscription => {
            if (subscription && typeof subscription.stop === 'function') {
                subscription.stop();
            }
        });
        subscriptionsRef.current = [];

        if (user?.id) {
            websocketService.unsubscribeAll(user.id);
        }
    }, [user?.id]);

    // Инициализация подписок
    useEffect(() => {
        if (user?.id) {
            subscribeToCallEvents();
        }

        return () => {
            unsubscribeFromCallEvents();
        };
    }, [user?.id, subscribeToCallEvents, unsubscribeFromCallEvents]);

    // Функции для управления звонками
    const initiateCall = useCallback(async (receiverId, callType = 'audio') => {
        try {
            const response = await window.axios.post('/api/calls/initiate', {
                receiver_id: receiverId,
                call_type: callType
            });

            return response.data;
        } catch (error) {
            console.error('Error initiating call:', error);
            throw error;
        }
    }, []);

    const acceptCall = useCallback(async (callId, sdpAnswer) => {
        try {
            const response = await window.axios.post(`/api/calls/${callId}/accept`, {
                sdp_answer: sdpAnswer
            });

            // Отправить SDP answer через WebSocket
            await websocketService.sendSdpAnswer(callId, sdpAnswer);

            return response.data;
        } catch (error) {
            console.error('Error accepting call:', error);
            throw error;
        }
    }, []);

    const rejectCall = useCallback(async (callId) => {
        try {
            const response = await window.axios.post(`/api/calls/${callId}/reject`);
            return response.data;
        } catch (error) {
            console.error('Error rejecting call:', error);
            throw error;
        }
    }, []);

    const endCall = useCallback(async (callId) => {
        try {
            const response = await window.axios.post(`/api/calls/${callId}/end`);
            return response.data;
        } catch (error) {
            console.error('Error ending call:', error);
            throw error;
        }
    }, []);

    return {
        subscribeToCallEvents,
        unsubscribeFromCallEvents,
        initiateCall,
        acceptCall,
        rejectCall,
        endCall,
        handleIncomingCall,
        handleCallAccepted,
        handleCallRejected,
        handleCallEnded
    };
};