import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    initiateCall,
    setIncomingCall,
    setCallStatus,
    clearCall,
    setCallError
} from '../../store/CallStore';
import { useOfferCall } from './useOfferCall';
import './CallButton.css';

const CallButton = ({ userId, userName }) => {
    const dispatch = useDispatch();
    const { currentCall } = useSelector((state) => state.calls);
    const { user } = useSelector(state => state.user);
    const [isCalling, setIsCalling] = useState(false);
    const { startCall } = useOfferCall();

    const channelsRef = useRef([]);

    useEffect(() => {
        // Проверяем, что Echo инициализирован
        if (!window.Echo || !user?.id) {
            console.warn('Echo not initialized or user not logged in');
            return;
        }

        console.log('Setting up WebSocket listeners for user:', user.id);

        // Отписка от старых каналов
        const cleanupChannels = () => {
            channelsRef.current.forEach(channel => {
                if (channel && typeof channel.stopListening === 'function') {
                    channel.stopListening();
                }
            });
            channelsRef.current = [];
        };

        cleanupChannels();

        try {
            // 1. Подписка на входящие звонки
            window.Echo.private(`call.${user.id}`)
                .listen('.incoming.call', (data) => {
                    console.log('Incoming call received:', data);
                    dispatch(setIncomingCall({
                        callId: data.call_id,
                        caller: data.caller,
                        callType: data.call_type,
                        sdpOffer: data.sdp_offer,
                        createdAt: data.created_at
                    }));
                });

            // 2. Подписка на принятие звонка
            window.Echo.private(`call-accept.${user.id}`)
                .listen('.call.accepted', (data) => {
                    console.log('Call accepted:', data);
                    if (currentCall && currentCall.id === data.call_id) {
                        dispatch(setCallStatus('ongoing'));
                    }
                });

            // 3. Подписка на отклонение звонка
            window.Echo.private(`call-reject.${user.id}`)
                .listen('.call.rejected', (data) => {
                    console.log('Call rejected:', data);
                    dispatch(setCallError('Звонок отклонен'));
                    dispatch(clearCall());
                    setIsCalling(false);
                });

            // 4. Подписка на завершение звонка
            window.Echo.private(`call-end.${user.id}`)
                .listen('.call.ended', (data) => {
                    console.log('Call ended:', data);
                    dispatch(setCallStatus('ended'));
                    dispatch(clearCall());
                    setIsCalling(false);
                });

        } catch (error) {
            console.error('Error setting up WebSocket channels:', error);
        }

        return () => {
            cleanupChannels();
        };
    }, [user?.id, dispatch, currentCall]);

    const handleCall = async (callType) => {
        if (!user || !userId) {
            alert('Пользователь не авторизован');
            return;
        }

        setIsCalling(true);
        try {
            const offerResult = await startCall(userId);

            if (offerResult.success && offerResult.offer) {
                const result = await dispatch(initiateCall({
                    receiver_id: parseInt(userId),
                    call_type: callType,
                    caller_id: user.id,
                    receiver_name: userName,
                    sdp_offer: offerResult.offer
                }));

                if (result.payload && result.payload.call_id) {
                    window.location.href = `/call/${result.payload.call_id}`;
                } else {
                    const errorMsg = result.payload?.error || result.error || 'Ошибка при создании звонка';

                    if (result.payload?.existing_call_id) {
                        window.location.href = `/call/${result.payload.existing_call_id}`;
                    } else {
                        alert(errorMsg);
                    }
                }
            } else {
                console.error('❌ Failed to create WebRTC offer');
                alert('Не удалось создать WebRTC предложение');
            }
        } catch (error) {
            console.error('💥 Call error:', error);
            alert('Ошибка при совершении звонка: ' + error.message);
        } finally {
            setIsCalling(false);
        }
    };

    const handleAudioCall = () => handleCall('audio');

    return (
        <div className="call-button-container">
            <svg
                onClick={handleAudioCall}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
                style={{ cursor: 'pointer' }}
            >
                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
            </svg>
            {isCalling && <span style={{ marginLeft: '5px' }}>...</span>}
        </div>
    );
};

export default CallButton;