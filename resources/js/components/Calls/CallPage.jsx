
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    endCall,
    setCallStatus,
    acceptCall,
    rejectCall,
    clearCall
} from '../../store/Call/CallStore';
import { useCallAnswer } from '../../hooks/Calls/useAnswerCall';
import { usePeerConnection } from '../../hooks/Calls/usePeerConnection';

import './CallPage.css';

const CallPage = () => {
    const { callId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux state
    const { user } = useSelector(state => state.user);
    const { profile } = useSelector(state => state.profile);
    const { currentCall, incomingCall, callStatus } = useSelector(state => state.calls);
    const { allProfiles } = useSelector(state => state.profile);

    // Local state
    const [callTime, setCallTime] = useState(0);
    const localAudioRef = useRef(null);
    const remoteAudioRef = useRef(null);
    const timerRef = useRef(null);

    // WebRTC hooks
    const {
        peerConnectionRef,
        localStreamRef,
        remoteStreamRef,
        cleanup
    } = usePeerConnection();



    // Определяем собеседника
    const getOtherUserId = useCallback(() => {
        if (!currentCall && !incomingCall) return null;
        const call = currentCall || incomingCall;
        return call.caller_id === user?.id ? call.receiver_id : call.caller_id;
    }, [currentCall, incomingCall, user?.id]);

    const recipientProfile = useMemo(() => {
        const otherUserId = getOtherUserId();
        return allProfiles?.find(p => p.id === parseInt(otherUserId)) || profile;
    }, [allProfiles, profile, getOtherUserId]);

    // 🎯 Обработка входящего звонка (если мы — получатель)
    const handleCallAccepted = useCallback(({ peerConnection, localStream }) => {
        dispatch(setCallStatus('ongoing'));
        // Здесь можно обновить UI или отправить аналитику
    }, [dispatch]);

    // Активируем useCallAnswer ТОЛЬКО если есть входящий звонок и мы ещё не ответили
    useCallAnswer({
        incomingCall: callStatus === 'ringing' ? incomingCall : null,
        onCallAccepted: handleCallAccepted
    });

    // Подключение аудио-элементов к стримам
    useEffect(() => {
        if (localAudioRef.current && localStreamRef.current) {
            localAudioRef.current.srcObject = localStreamRef.current;
        }
        if (remoteAudioRef.current && remoteStreamRef.current) {
            remoteAudioRef.current.srcObject = remoteStreamRef.current;
        }
    }, [localStreamRef.current, remoteStreamRef.current]);

    // Таймер звонка
    useEffect(() => {
        if (callStatus === 'ongoing') {
            timerRef.current = setInterval(() => setCallTime(t => t + 1), 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [callStatus]);

    // Действия
    const handleEndCall = async () => {
        try {
            if (callId) await dispatch(endCall(callId));
            cleanup();
            dispatch(clearCall());
            navigate('/home');
        } catch (error) {
            console.error('End call error:', error);
        }
    };

    const handleRejectCall = async () => {
        try {
            if (incomingCall?.callId) {
                await dispatch(rejectCall(incomingCall.callId));
            }
            cleanup();
            dispatch(clearCall());
            navigate('/');
        } catch (error) {
            console.error('Reject call error:', error);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const getStatusText = () => {
        const statuses = {
            'initiated': 'Соединение...',
            'ringing': 'Вызов...',
            'ongoing': `⏱ ${formatTime(callTime)}`,
            'ended': 'Звонок завершён'
        };
        return statuses[callStatus] || 'Подключение...';
    };

    // UI
    const isIncoming = !!incomingCall && callStatus === 'ringing';
    const displayName = recipientProfile?.name || 'Пользователь';
    const displayAvatar = recipientProfile?.avatar || '/default-avatar.png';

    return (
        <div className="call-page">
            {/* Аудио-элементы */}
            <audio ref={localAudioRef} autoPlay muted className="hidden" />
            <audio ref={remoteAudioRef} autoPlay className="hidden" />

            <div className="call-container">
                {/* Заголовок */}
                <div className="call-header">
                    <h1>{isIncoming ? '📥 Входящий звонок' : '📤 Исходящий звонок'}</h1>
                    <div className="call-status">{getStatusText()}</div>
                </div>

                {/* Информация о собеседнике */}
                <div className="call-info">
                    <img src={displayAvatar} alt={displayName} width="140" height="140" />
                    <div className="caller-name">{displayName}</div>
                </div>

                {/* Кнопки управления */}
                <div className="call-controls">
                    <button
                        onClick={toggleMute}
                        className={`control-btn ${isMuted ? 'active' : ''}`}
                        aria-pressed={isMuted}
                    >
                        {isMuted ? '🔇' : '🎤'} {isMuted ? 'Включить' : 'Выкл. микрофон'}
                    </button>

                    <button
                        onClick={toggleSpeaker}
                        className={`control-btn ${isSpeaker ? 'active' : ''}`}
                    >
                        {isSpeaker ? '🔊' : '🔈'} {isSpeaker ? 'Динамик' : 'Наушники'}
                    </button>

                    <button onClick={handleEndCall} className="control-btn end-call-btn">
                        🔴 Завершить
                    </button>
                </div>


                {isIncoming && (
                    <div className="incoming-actions">
                        <button onClick={handleRejectCall} className="reject-btn">
                            ❌ Отклонить
                        </button>
                        <button
                            onClick={() => dispatch(acceptCall(incomingCall.callId))}
                            className="accept-btn"
                        >
                            ✅ Принять
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CallPage;