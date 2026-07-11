import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setCallStatus, rejectCall, clearCall, endCall } from '../../store/Call/CallStore';
import { useAnswerCall } from '../../hooks/Calls/useAnswerCall';
import ringtoneMp3 from '../../AudioMusic/Дора - Втюрилась (hitmos.fm).mp3';

const CallNotification = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.user);
    const { incomingCall, currentCall, callStatus } = useSelector(state => state.calls);

    const { acceptCall: acceptWebRTC } = useAnswerCall();
    const ringingRef = useRef(null);
    const ringingIntervalRef = useRef(null);

    const isOutgoing = currentCall && callStatus === 'ringing' && !incomingCall;
    const isIncoming = incomingCall && callStatus === 'ringing';
    const hasActiveCall = (isOutgoing || isIncoming) && !!user;

    useEffect(() => {
        if (!hasActiveCall) return;

        const audio = new Audio(ringtoneMp3);
        audio.loop = true;
        audio.volume = 0.5;
        ringingRef.current = audio;

        audio.play().catch(() => {
            const onInteraction = () => {
                audio.play().catch(() => {});
                document.removeEventListener('click', onInteraction);
                document.removeEventListener('touchstart', onInteraction);
            };
            document.addEventListener('click', onInteraction);
            document.addEventListener('touchstart', onInteraction);
        });

        return () => {
            if (ringingRef.current) {
                ringingRef.current.pause();
                ringingRef.current = null;
            }
        };
    }, [hasActiveCall]);

    if (!hasActiveCall) {
        return null;
    }

    const handleAccept = async () => {
        try {
            const answer = await acceptWebRTC(
                incomingCall.callId,
                incomingCall.caller_id,
                incomingCall.offer
            );

            await axios.post(
                `/calls/accept/${incomingCall.callId}`,
                { sdp_answer: answer },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                }
            );

            dispatch(setCallStatus('ongoing'));
            dispatch(clearCall());
            navigate(`/call/${incomingCall.callId}`, { replace: true });

        } catch (error) {
            console.error('Accept error:', error);

            const message = error.response?.data?.error ||
                           error.message ||
                           'Не удалось принять звонок';
            alert(message);
        }
    };

    const handleReject = async () => {
        try {
            await dispatch(rejectCall(incomingCall.callId));
            dispatch(clearCall());
        } catch (error) {
            console.error('Reject error:', error);
        }
    };

    const handleCancel = async () => {
        try {
            await dispatch(endCall(currentCall.call_id));
            dispatch(clearCall());
            navigate('/home');
        } catch (error) {
            console.error('Cancel error:', error);
        }
    };

    if (isIncoming) {
        return (
            <div className="fixed top-0 left-0 right-0 z-9999 bg-white dark:bg-gray-800 shadow-2xl border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <img
                            src={incomingCall.caller_avatar || '/default-avatar.png'}
                            alt={incomingCall.caller_name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/50"
                        />
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Входящий звонок</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {incomingCall.caller_name || 'Пользователь'}
                            </p>
                            <p className="text-xs text-gray-400">
                                {incomingCall.call_type === 'video' ? 'Видео' : 'Аудио'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleReject}
                            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                        >
                            Отклонить
                        </button>
                        <button
                            onClick={handleAccept}
                            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                        >
                            Принять
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-white dark:bg-gray-800 shadow-2xl border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img
                        src={(currentCall.receiver_avatar || currentCall.caller_avatar) || '/default-avatar.png'}
                        alt={currentCall.receiver_name || currentCall.caller_name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/50"
                    />
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Исходящий звонок</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {currentCall.receiver_name || currentCall.caller_name || 'Пользователь'}
                        </p>
                        <p className="text-xs text-gray-400">
                            {currentCall.call_type === 'video' ? 'Видео' : 'Аудио'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                    >
                        Отменить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallNotification;
