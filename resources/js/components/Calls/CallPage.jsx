import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { endCall, setCallStatus, acceptCall } from '../../store/CallStore';
import { useOfferCall } from './useOfferCall';
import { useCallAnswer } from './useCallAnswer';
import { useWebRTC } from './useWebRTC';
import './CallPage.css';

const CallPage = () => {
    const { callId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.user);
    const { profile } = useSelector(state => state.profile);
    const { currentCall, incomingCall, callStatus } = useSelector(state => state.calls);
    const { allProfiles } = useSelector((state) => state.profile);

    const [callTime, setCallTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeaker, setIsSpeaker] = useState(false);

    const localAudioRef = useRef(null);
    const remoteAudioRef = useRef(null);
    const timerRef = useRef(null);

    const { startCall } = useOfferCall();
    const { peerConnectionRef, localStreamRef, remoteStreamRef, cleanup } = useWebRTC();


    const receiverId = currentCall?.receiver_id || currentCall?.caller_id;


    const getOtherUserId = useCallback(() => {
        if (!currentCall || !user) return null;

        return currentCall.caller_id === user.id
            ? currentCall.receiver_id
            : currentCall.caller_id;
    }, [currentCall, user]);


    const recipientProfile = useMemo(() => {
        const otherUserId = getOtherUserId();
        if (!otherUserId || !allProfiles || allProfiles.length === 0) return null;

        return allProfiles.find((profile) => profile.id === parseInt(otherUserId));
    }, [allProfiles, getOtherUserId]);

    const handleIncomingCall = useCallback((data) => {
        console.log('Incoming call:', data);
    }, []);

    useCallAnswer(handleIncomingCall);

    useEffect(() => {
        const initializeCall = async () => {
            if (callId && user && receiverId) {
                if (callStatus === 'initiated' || callStatus === 'ongoing') {
                    await startCall(receiverId);
                }
            }
        };

        initializeCall();
    }, [callId, user, callStatus, receiverId, startCall]);

    useEffect(() => {
        if (localAudioRef.current && localStreamRef.current) {
            localAudioRef.current.srcObject = localStreamRef.current;
        }

        if (remoteAudioRef.current && remoteStreamRef.current) {
            remoteAudioRef.current.srcObject = remoteStreamRef.current;
        }
    }, [localStreamRef.current, remoteStreamRef.current]);

    useEffect(() => {
        if (callStatus === 'ongoing') {
            timerRef.current = setInterval(() => {
                setCallTime(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [callStatus]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const timeAudio = mins.toString().padStart(2, '0');
        const second = secs.toString().padStart(2, '0');
        return `${timeAudio}:${second}`;
    };

    const handleAcceptCall = async () => {
        try {
            if (incomingCall) {
                await dispatch(acceptCall(incomingCall.call_id));
                setCallStatus('ongoing');
            }
        } catch (error) {
            console.error('Error accepting call:', error);
        }
    };

    const handleEndCall = async () => {
        try {
            if (callId) {
                await dispatch(endCall(callId));
            }
            navigate('/home');
        } catch (error) {
            console.error('Error ending call:', error);
            navigate('/');
        }
    };

    const handleRejectCall = async () => {
        try {
            if (incomingCall) {
                await dispatch(rejectCall(incomingCall.call_id));
            }
            cleanup();
            navigate('/');
        } catch (error) {
            console.error('Error rejecting call:', error);
            cleanup();
            navigate('/');
        }
    };





    const getCallStatusText = () => {
        switch (callStatus) {
            case 'initiated':
                return 'Установка соединения...';
            case 'ringing':
                return 'Вызов...';
            case 'ongoing':
                return `Время: ${formatTime(callTime)}`;
            case 'ended':
                return 'Звонок завершен';
            default:
                return 'Установка соединения'

        }
    };


    const displayName = recipientProfile ? recipientProfile.name : (profile?.name || 'Пользователь');
    const displayAvatar = recipientProfile
        ? (recipientProfile.avatar || "https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13")
        : (profile?.avatar || "https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13");

    return (
        <div className="call-page">
            <audio
                ref={localAudioRef}
                autoPlay
                muted
                className="local-audio"
            />
            <audio
                ref={remoteAudioRef}
                autoPlay
                className="remote-audio"
            />

            <div className="call-container">
                <div className="call-header">
                    <h1 className="call-title">
                        {incomingCall ? 'Входящий звонок' : 'Исходящий звонок'}
                    </h1>
                    <div className="call-status">
                        {getCallStatusText()}
                    </div>
                </div>

                <div className="call-info">
                    <div className="caller-info">

                         <img width="140"  height="140" src={displayAvatar}  />

                        <div className="caller-name">
                            {displayName}
                        </div>

                    </div>
                </div>


                <div className="call-indicators">
                    <div className={`indicator ${isMuted ? 'active' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-mic" viewBox="0 0 16 16">
                            <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
                            <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3"/>
                        </svg>
                        {isMuted && <span className="indicator-text">Микрофон выключен</span>}
                    </div>
                    <div className="call-indicators">

                    <div className={`indicator ${isSpeaker ? 'active' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-volume-up-fill" viewBox="0 0 16 16">
  <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z"/>
  <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z"/>
  <path d="M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06"/>
</svg>
<button
                                className="control-btn end-call-btn"
                                onClick={handleEndCall}
                            >
                                <span className="btn-text">Завершить</span>
                            </button>
                    </div>
                </div>
                </div>

         </div>
        </div>
    );
};

export default CallPage;