import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    endCall,
    setCallStatus,
    clearCall,
} from '../../store/Call/CallStore';
import { usePeerConnection } from '../../hooks/Calls/usePeerConnection';
import './CallPage.css';
import ringtoneMp3 from '../../AudioMusic/Дора - Втюрилась (hitmos.fm).mp3';

const CallPage = () => {
    const { callId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.user);
    const { currentCall, callStatus } = useSelector(state => state.calls);

    const {
        peerConnectionRef,
        localStreamRef,
        remoteStreamRef,
        cleanup,
        toggleMute,
        toggleSpeaker,
        isMuted,
        isSpeaker
    } = usePeerConnection();

    const [callTime, setCallTime] = useState(0);
    const localAudioRef = useRef(null);
    const remoteAudioRef = useRef(null);
    const timerRef = useRef(null);

    const getOtherUser = useCallback(() => {
        if (!currentCall) return null;
        const isCaller = (currentCall.caller_id || currentCall.callerId) === user?.id;
        return {
            id: isCaller ? (currentCall.receiver_id || currentCall.receiverId) : (currentCall.caller_id || currentCall.callerId),
            name: isCaller ? (currentCall.receiver_name || currentCall.receiverName) : (currentCall.caller_name || currentCall.callerName),
            avatar: isCaller ? (currentCall.receiver_avatar || currentCall.receiverAvatar) : (currentCall.caller_avatar || currentCall.callerAvatar),
        };
    }, [currentCall, user?.id]);

    const otherUser = getOtherUser();

    const handleEndCall = async () => {
        try {
            if (callId) {
                await dispatch(endCall(callId));
            }
            cleanup();
            dispatch(clearCall());
            navigate('/home');
        } catch (error) {
            console.error('End call error:', error);
        }
    };

    useEffect(() => {
        if (callStatus === 'ongoing') {
            timerRef.current = setInterval(() => {
                setCallTime(t => t + 1);
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [callStatus]);

    useEffect(() => {
        if (localAudioRef.current && localStreamRef.current) {
            localAudioRef.current.srcObject = localStreamRef.current;
        }
        if (remoteAudioRef.current && remoteStreamRef.current) {
            remoteAudioRef.current.srcObject = remoteStreamRef.current;
        }
    }, [localStreamRef.current, remoteStreamRef.current]);

    useEffect(() => {
        return () => {
            cleanup();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const ringingRef = useRef(null);

    useEffect(() => {
        if (callStatus === 'ongoing' || !callId) {
            if (ringingRef.current) {
                ringingRef.current.pause();
                ringingRef.current = null;
            }
            return;
        }

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
    }, [callStatus, callId]);

    const isRinging = callStatus !== 'ongoing' || !currentCall;

    const userName = otherUser?.name || 'Пользователь';
    const userAvatar = otherUser?.avatar || '/default-avatar.png';
    const userInitial = userName.charAt(0).toUpperCase();

    if (isRinging) {
        return (
            <div className="call-page">
                <div className="call-container">
                    <div className="call-avatar-ring">
                        <div className="call-avatar-pulse" />
                        <div className="call-avatar-pulse delay-1" />
                        <div className="call-avatar-pulse delay-2" />
                        <img
                            src={userAvatar}
                            alt={userName}
                            className="call-avatar-img"
                        />
                    </div>
                    <div className="call-user-name">{userName}</div>
                    <div className="call-status-text">Звоним...</div>
                    <div className="call-controls">
                        <button
                            onClick={handleEndCall}
                            className="call-btn call-btn-end"
                            title="Завершить звонок"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                                <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
                            </svg>
                            <span className="call-btn-label">Завершить</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="call-page">
            <audio ref={localAudioRef} autoPlay muted className="hidden" />
            <audio ref={remoteAudioRef} autoPlay className="hidden" />

            <div className="call-container call-active">
                <div className="call-avatar-ring">
                    <div className="call-avatar-pulse active" />
                    <img
                        src={userAvatar}
                        alt={userName}
                        className="call-avatar-img"
                    />
                </div>
                <div className="call-user-name">{userName}</div>
                <div className="call-status-text call-timer">{formatTime(callTime)}</div>
                <div className="call-controls">
                    <button
                        onClick={toggleMute}
                        className={`call-btn ${isMuted ? 'call-btn-active' : 'call-btn-mute'}`}
                        title={isMuted ? 'Включить микрофон' : 'Выключить микрофон'}
                    >
                        {isMuted ? (
                            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                                <path d="M10.8 4.9c0-.66.54-1.2 1.2-1.2s1.2.54 1.2 1.2l-.01 3.91L15 10.6V5c0-1.66-1.34-3-3-3-1.54 0-2.79 1.16-2.96 2.65l1.76 1.76V4.9zM19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-.66-.54-1.2-1.2-1.2s-1.2.54-1.2 1.2v1.76l2.38 2.41zM4.27 3L3 4.27l7.01 7.01V17c0 .66.54 1.2 1.2 1.2s1.2-.54 1.2-1.2v-3.73L16.73 18 18 16.73 4.27 3z"/>
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                            </svg>
                        )}
                        <span className="call-btn-label">{isMuted ? 'Включить' : 'Мут'}</span>
                    </button>
                    <button
                        onClick={handleEndCall}
                        className="call-btn call-btn-end"
                        title="Завершить звонок"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                            <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
                        </svg>
                        <span className="call-btn-label">Завершить</span>
                    </button>
                    <button
                        onClick={toggleSpeaker}
                        className={`call-btn ${isSpeaker ? 'call-btn-active' : 'call-btn-speaker'}`}
                        title={isSpeaker ? 'Переключить на наушники' : 'Переключить на динамик'}
                    >
                        {isSpeaker ? (
                            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                            </svg>
                        )}
                        <span className="call-btn-label">{isSpeaker ? 'Динамик' : 'Наушники'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallPage;
