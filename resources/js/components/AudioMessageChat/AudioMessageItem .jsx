import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getConversationAudio } from '../../store/AudioMessage';
import "./Audio.css"

const AudioMessageItem = ({ otherUserId }) => {
    const dispatch = useDispatch();
    const { conversations, loading } = useSelector(state => state.audio);
    const { user } = useSelector(state => state.user);
    const audioRefs = useRef({});

    useEffect(() => {
        if (user?.id && otherUserId) {
            dispatch(getConversationAudio(otherUserId));
        }
    }, [dispatch, user?.id, otherUserId]);

    const getCurrentConversation = () => {
        const conversationKey = [user.id, parseInt(otherUserId)].sort().join('-');
        return conversations[conversationKey] || { messages: [] };
    };

    const currentConversation = getCurrentConversation();

    // Функция для форматирования времени
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        if (isToday) {
            return date.toLocaleString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else {
            return date.toLocaleString('ru-RU', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
                Загрузка аудио сообщений...
            </div>
        );
    }

    return (
        <div className="audio-messages-container">
            {currentConversation.messages.length > 0 ? (
                currentConversation.messages.map((message, index) => (
                    <div
                        key={message.id}
                        className="audio-message-item"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="audio-player-container">
                            <div className="audio-message-info">
                                <span className={`audio-sender ${message.sender_id === user?.id ? 'my-audio' : 'their-audio'}`}>
                                    {message.sender_id === user?.id ? 'Вы' : 'Собеседник'}
                                </span>
                                <span className="audio-time">
                                    {formatTime(message.created_at)}
                                </span>
                            </div>
                            <audio
                                ref={el => audioRefs.current[message.id] = el}
                                controls
                                src={message.audio_message}
                                className="audio-player"
                                preload="metadata"
                                onPlay={(e) => {
                                    // Останавливаем другие аудио при воспроизведении нового
                                    Object.values(audioRefs.current).forEach(audio => {
                                        if (audio && audio !== e.target) {
                                            audio.pause();
                                        }
                                    });
                                }}
                            >
                                Ваш браузер не поддерживает аудио элементы.
                            </audio>
                        </div>
                    </div>
                ))
            ) : (
                <div className="no-audio-messages">
                    🎵 В этом чате пока нет голосовых сообщений
                </div>
            )}
        </div>
    );
};

export default AudioMessageItem;