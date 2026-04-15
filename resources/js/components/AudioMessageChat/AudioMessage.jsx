import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAudioMessage, sendMessageAudio } from '../../store/Files/AudioMessage';
import { createOffer } from '../../WebRTC/CreateOffer';
import { handleOffer } from '../../WebRTC/CreateAnswer';
import { handleIceCandidate } from '../../WebRTC/IceCandidateAction';
import { getEcho } from '../../echo';

const AudioMessage = ({ receiverId, compact = false, onSendComplete, onRecordingStateChange }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioURL, setAudioURL] = useState('');
    const [audioConnection, setAudioConnection] = useState('');

    const timerRef = useRef(null);
    const isMountedRef = useRef(true);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const isSendingRef = useRef(false);

    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);

    useEffect(() => {
        initializePeerConnection();
        return () => {
            cleanup();
        };
    }, []);

    const initializePeerConnection = () => {
        try {
            const configuration = {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            };

            peerConnectionRef.current = new RTCPeerConnection(configuration);

            peerConnectionRef.current.onicecandidate = (event) => {
                if (event.candidate && user?.id) {
                    handleIceCandidate(
                        event.candidate,
                        receiverId,
                        user.id
                    );
                }
            };

            peerConnectionRef.current.ontrack = (event) => {
                if (event.streams && event.streams[0]) {
                    const audioElement = new Audio();
                    audioElement.srcObject = event.streams[0];
                    audioElement.play().catch(e => {
                        console.warn('Cannot play real-time audio:', e);
                    });
                }
            };

            peerConnectionRef.current.onconnectionstatechange = () => {
                const state = peerConnectionRef.current.connectionState;
                switch(state) {
                    case 'connected':
                        setAudioConnection('Соединение установлено')
                        break;
                    case 'disconnected':
                        setAudioConnection('Соединение прервано');
                        break;
                    case 'closed':
                        setAudioConnection('Соединение закрыто');
                        break;
                }
            };

        } catch (error) {
            setError('Ошибка инициализации аудиосоединения');
        }
    };

    const startRecording = async () => {
        try {
            setError(null);
            audioChunksRef.current = [];

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    noiseSuppression: true,
                    echoCancellation: true,
                    autoGainControl: true
                }
            });

            stream.getTracks().forEach(track => {
                peerConnectionRef.current.addTrack(track, stream);
            });

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            mediaRecorderRef.current = mediaRecorder;
            localStreamRef.current = stream;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);

                setAudioBlob(audioBlob);
                setAudioURL(audioUrl);

                if (localStreamRef.current) {
                    localStreamRef.current.getTracks().forEach(track => track.stop());
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
            startTimer();

            onRecordingStateChange?.(true);
            await createOffer(peerConnectionRef, receiverId, user.id, stream);

        } catch (error) {
            console.error('Error starting recording:', error);
            setError('Ошибка доступа к микрофону');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            stopTimer();

            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                initializePeerConnection();
            }
            onRecordingStateChange?.(true);
            setError('⏹️ Запись остановлена');
            setTimeout(() => setError(null), 2000);
        }
    };

    const sendAudioMessage = async () => {
        if (isSendingRef.current || !audioBlob) return;

        isSendingRef.current = true;
        setLoading(true);
        setError(null);

        try {
            const audioFile = new File([audioBlob], `audio_message_${Date.now()}.webm`, {
                type: 'audio/webm'
            });

            const result = await dispatch(sendMessageAudio({
                audio_mess: audioFile,
                receiver_id: parseInt(receiverId)
            }));

            if (result?.payload?.success || result?.payload?.data) {
                setAudioBlob(null);
                setAudioURL('');
                setRecordingTime(0);
                onSendComplete?.();
                setError('Аудио отправлено');
            }

            onRecordingStateChange?.(false);
        } catch (error) {
            console.error('Error sending audio:', error);
            setError(error.message || 'Ошибка отправки аудио');
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
                isSendingRef.current = false;
            }
        }
    };

    const cancelRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
        }

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            initializePeerConnection();
        }

        setAudioBlob(null);
        setAudioURL('');
        setIsRecording(false);
        stopTimer();
        setRecordingTime(0);
        setTimeout(() => setError(null), 2000);
    };

    const handleIncomingOffer = async (offer) => {
        await handleOffer(peerConnectionRef, offer, receiverId, user.id);
    };

    const handleIncomingAnswer = async (answer) => {
        await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(answer)
        );
    };

    const handleIncomingIceCandidate = async (candidate) => {
        await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(candidate)
        );
    };

    useEffect(() => {
        const echo = getEcho();
        const channel = echo.private(`user.${user.id}`);

        channel.listen('.audio.message.sent', (event) => {
            const isMessageAudio =
                (event.sender_id === parseInt(user.id) && event.receiver_id === parseInt(receiverId)) ||
                (event.receiver_id === parseInt(user.id) && event.sender_id === parseInt(receiverId));

            if (isMessageAudio) {
                dispatch(addAudioMessage({
                    id: event.id,
                    sender_id: event.sender_id,
                    receiver_id: event.receiver_id,
                    audio_message: event.audio_message,
                    created_at: new Date(event.created_at).getTime() / 1000,
                }));
            }
        });

        channel.listen('.webrtc.offer', (event) => {
            if (event.from === parseInt(receiverId)) {
                handleIncomingOffer(event.offer);
            }
        });

        channel.listen('.webrtc.answer', (event) => {
            if (event.from === parseInt(receiverId)) {
                handleIncomingAnswer(event.answer);
            }
        });

        channel.listen('.webrtc.ice-candidate', (event) => {
            if (event.from === parseInt(receiverId)) {
                handleIncomingIceCandidate(event.candidate);
            }
        });

        return () => {
            channel.stopListening('.audio.message.sent');
            channel.stopListening('.webrtc.offer');
            channel.stopListening('.webrtc.answer');
            channel.stopListening('.webrtc.ice-candidate');
        };
    }, [user?.id, receiverId, dispatch]);

    const cleanup = () => {
        isMountedRef.current = false;
        if (timerRef.current) clearInterval(timerRef.current);
        if (peerConnectionRef.current) peerConnectionRef.current.close();
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        if (audioURL) {
            URL.revokeObjectURL(audioURL);
        }
    };

    const startTimer = () => {
        if (timerRef.current)
            clearInterval(timerRef.current);
        setRecordingTime(0);
        timerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="sm:w-45">

            {!isRecording && !audioURL && (
                <button
                    onClick={startRecording}
                    disabled={loading}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                    title="Записать голосовое сообщение"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                        <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"/>
                    </svg>
                </button>
            )}


            {isRecording && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-96 max-w-full mx-4">

                        <div className="flex justify-center items-center h-32 mb-6">
                            <div className="flex items-end h-20 space-x-1">
                                {[...Array(8)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-3 bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-lg visualizer-bar"
                                        style={{
                                            animationDelay: `${i * 0.1}s`,
                                            height: `${20 + Math.random() * 60}%`
                                        }}
                                    />
                                ))}
                            </div>
                        </div>


                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {formatTime(recordingTime)}
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Идет запись голосового сообщения...
                            </p>
                            {audioConnection && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {audioConnection}
                                </p>
                            )}
                        </div>


                        <div className="flex justify-center">
                            <button
                                onClick={stopRecording}
                                className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    className="mr-2"
                                >
                                    <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/>
                                </svg>
                                Остановить запись
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {audioURL && !isRecording && (
                <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-96 max-w-full mx-4">

                        <div className="mb-6">
                            <div className="text-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                    Прослушайте запись
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Длительность: {formatTime(recordingTime)}
                                </p>
                            </div>
                            <audio
                                controls
                                src={audioURL}
                                className="w-full rounded-lg"
                            />
                        </div>


                        <div className="flex space-x-4">
                            <button
                                onClick={sendAudioMessage}
                                disabled={loading}
                                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Отправка...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                            className="mr-2"
                                        >
                                            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                                        </svg>
                                        <span>Отправить</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={cancelRecording}
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                Отмена
                            </button>
                        </div>


                        {error && (
                            <div className={`mt-4 p-3 rounded-lg text-center text-sm ${
                                error.includes('✅')
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AudioMessage;
