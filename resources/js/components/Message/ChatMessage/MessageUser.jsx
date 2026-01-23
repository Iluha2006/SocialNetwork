import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getEcho } from '../../../echo';
import getFileIcon from "./getFile";
import {
    sendMessage,
    addMessage,
} from "../../../store/UserStore";
import AudioRTC from "../../AudioMessageChat/AudioRTC";
import { fetchAllProfiles } from "../../../store/Profile";
import { deleteAudioMessage, getConversationAudio } from "../../../store/AudioMessage";
import ImageUpload from "../../ImageChat/ImageUpload";
import FileUpload from "../../ChatFile/FileUpload";
import CallButton from "../../Calls/CallButton";
import "./MessageUser.css";
import { selectSelectedBackgroundByChatId } from "../../../store/BacroundImages";
import Modal from "../../ModalChat/Modal";
import useWebSocket from "../Socket/useWebSocket";
import DeleteMessageButton from "../DeleteMessage/DeleteMessageButton";
import useMessageDeletion from "../DeleteMessage/useMessageDeletion";

const MessageUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userId } = useParams();
    const messagesEndRef = useRef(null);

    const { onlineUsers } = useSelector((state) => state.online);
    const { user, loading, error, conversations, token } = useSelector(
        (state) => state.user
    );

    const { viewedProfile } = useSelector((state) => state.profile);
    const isBlocked = viewedProfile?.is_blocked || false;
    const hasBlockedThisUser = viewedProfile?.has_blocked_this_user || false;

    const {
        handleDeleteMessage,
    } = useMessageDeletion(userId);

    const { allProfiles } = useSelector((state) => state.profile);
    const { AudioConversations } = useSelector((state) => state.audio);
    const [isRecordingAudio, setIsRecordingAudio] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [audioMode, setAudioMode] = useState(false);
    const chatId = [user?.id, parseInt(userId)];

    const selectedBackground = useSelector((state) =>
        selectSelectedBackgroundByChatId(state, chatId)
    );
    useWebSocket(userId);

    const canSendMessages = useMemo(() => {

        if (isBlocked || hasBlockedThisUser || !user) {
            return false;
        }
        return true;
    }, [isBlocked, hasBlockedThisUser, user]);

    const allMessages = useMemo(() => {
        if (!user?.id || !userId) return [];

        const conversationKey = [user.id, parseInt(userId)].sort().join('-');

        const textMessages = conversations[conversationKey]?.messages || [];
        const audioMessages =
            AudioConversations[conversationKey]?.messages || [];

        const combinedMessages = [
            ...textMessages.map((msg) => ({
                ...msg,
                type: "text",
                id: msg.id,
                senderId: msg.senderId,
                timestamp:
                    msg.timestamp || new Date(msg.created_at).getTime() / 1000,
                created_at: msg.created_at,
            })), ...audioMessages.map((msg) => ({
                ...msg,
                type: "audio",
                id: msg.id,
                senderId: msg.sender_id,
                timestamp: new Date(msg.created_at).getTime() / 1000,
                created_at: msg.created_at,
            })),
        ];

        const sortedMessages = combinedMessages.sort( (a, b) => a.timestamp - b.timestamp);

        return sortedMessages;
    }, [conversations, AudioConversations, user?.id, userId]);

    useEffect(() => {
        if (userId && user?.id) {
            dispatch(getConversationAudio(parseInt(userId)));
        }
    }, [dispatch, userId, user?.id]);

    const messagesListStyle = useMemo(() => {
        if (selectedBackground) {
            return {
                backgroundImage: `url(${selectedBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity: "0.85",
            };
        }
        return {

        };
    }, [selectedBackground]);


    const recipientProfile = useMemo(() => {

        const profilesArray = Array.isArray(allProfiles) ? allProfiles : [];


        const profile = profilesArray.find((profile) =>
            profile.user_id === parseInt(userId) || profile.id === parseInt(userId)
        );


        return profile;
    }, [allProfiles, userId]);

    const isRecipientOnline = useMemo(() => {
        return onlineUsers.some(
            (onlineUser) =>
                onlineUser.id === parseInt(userId) && onlineUser.online_status
        );
    }, [onlineUsers, userId]);

    useEffect(() => {
        dispatch(fetchAllProfiles());
    }, [dispatch]);

    useEffect(() => {
        scrollToBottom();
    }, [allMessages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleImageSelect = (file) => {
        setSelectedImage(file);
        setSelectedFile(null);
    };

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        setSelectedImage(null);
    };

    useEffect(() => {
        if (!user?.id || !userId) return;

        const echo = getEcho();
        const ids = [user.id, pareInt(userId)].sort();
        const channelName = `chat.${ids[0]}.${ids[1]}`;

        console.log('Подключаюсь к каналу:', channelName);

        try {
            const channel = echo.private(channelName);

            channel.listen('.private-message', (event) => {
                console.log('📨 Получено WebSocket сообщение:', event);

                const message = event.message || event;

                const isRelevant =
                    (message.sender_id === user.id && message.receiver_id === parseInt(userId)) ||
                    (message.sender_id === parseInt(userId) && message.receiver_id === user.id);

                if (isRelevant) {
                    dispatch(
                        addMessage({
                            id: message.id,
                            senderId: message.sender_id,
                            receiverId: message.receiver_id,
                            content: message.content,
                            images: message.images,
                            file: message.file,
                            timestamp: new Date(message.created_at).getTime() / 1000,
                        })
                    );
                }
            });

        } catch (error) {
            console.error(' Ошибка при настройке WebSocket:', error);
        }
    }, [user?.id, userId, dispatch]);

    const handleSendMessage = async () => {

        if (!canSendMessages) {
            alert("Вы не можете отправлять сообщения этому пользователю");
            return;
        }

        if ((!newMessage.trim() && !selectedImage && !selectedFile) || !user || !recipientProfile) {
            return;
        }

        setIsSending(true);

        const messageData = {
            receiverId: parseInt(userId),
            content: newMessage.trim(),
            image: selectedImage,
            file: selectedFile,
        };

        console.log('Отправляю сообщение:', messageData);

        try {
            const result = await dispatch(sendMessage(messageData));

            console.log('Результат отправки:', result);

            if (result?.success) {
                setNewMessage("");
                setSelectedImage(null);
                setSelectedFile(null);
            }

        } catch (error) {
            console.error("Исключение при отправке:", error);

        } finally {
            setIsSending(false);
        }
    };

    const handleMessageClick = (message) => {
        if (message.senderId === user?.id) {
            if (selectedMessage?.id === message.id) {
                setSelectedMessage(null);
                setShowDeleteButton(false);
            } else {
                setSelectedMessage(message);
                setShowDeleteButton(true);
            }
        } else {
            setSelectedMessage(null);
            setShowDeleteButton(false);
        }
    };

    const handleDeleteSuccess = async (messageData) => {
        const { messageId, messageType, senderId, receiverId } = messageData;
        const result = await handleDeleteMessage(
            messageId,
            messageType,
            senderId,
            receiverId
        );

        if (result?.success) {
            setSelectedMessage(null);
            setShowDeleteButton(false);
        }
    };



    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };




    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectedMessage && !event.target.closest(".message-bubble")) {
                setSelectedMessage(null);
                setShowDeleteButton(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [selectedMessage]);

    const handleAudioSendComplete = () => {
        dispatch(getConversationAudio(parseInt(userId)));
        setAudioMode(false);
    };

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;

    if (isBlocked) {
        return (
            <div className="w-full max-w-lg mx-auto my-2.5 flex flex-col h-[900px] bg-white dark:bg-gray-900 rounded-2xl shadow-lg transition-colors">
                <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl gap-2.5 text-amber-50">
                    <Modal otherUserId={parseInt(userId)} />
                    <CallButton userId={userId} userName={recipientProfile?.name} />
                    {recipientProfile && (
                        <div className="recipient-info">
                            <div>
                                <span>
                                    {isRecipientOnline ? "В сети" : "не в сети"}
                                </span>
                            </div>
                            <img
                                src={
                                    recipientProfile.avatar ||
                                    "https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13"
                                }
                                alt="Аватар"
                                className="recipient-avatar"
                                onClick={() => navigate(`/profile/${userId}`)}
                                onError={(e) => {
                                    e.target.src =
                                        "https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13";
                                }}
                            />
                            <div className="recipient-details">
                                <h3>{recipientProfile.name}</h3>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center">
                        <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded mb-4">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
                                    Доступ ограничен
                                </h3>
                            </div>
                            <p className="text-red-600 dark:text-red-400 mt-2">
                                Этот пользователь ограничил вам доступ к переписке
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Вернуться на главную
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg mx-auto my-2.5 flex flex-col h-[900px] bg-white dark:bg-gray-900 rounded-2xl shadow-lg transition-colors">
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl gap-2.5 text-amber-50">
                <Modal otherUserId={parseInt(userId)} />
                <CallButton userId={userId} userName={recipientProfile?.name} />
                {recipientProfile && (
                    <div className="recipient-info">
                        <div>
                            <span>
                                {isRecipientOnline ? "В сети" : "не в сети"}
                            </span>
                        </div>
                        <img
                            src={
                                recipientProfile.avatar ||
                                "https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13"
                            }
                            alt="Аватар"
                            className="recipient-avatar"
                            onClick={() => navigate(`/profile/${userId}`)}
                            onError={(e) => {
                                e.target.src =
                                    "https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13";
                            }}
                        />
                        <div className="recipient-details">
                            <h3>{recipientProfile.name}</h3>
                        </div>
                    </div>
                )}
            </div>

            <div style={messagesListStyle} className="messages-list">
                {allMessages.length === 0 ? (
                    <div className="no-messages">
                        <p>Нет сообщений</p>
                        <span>Начните общение первым!</span>
                    </div>
                ) : (
                    allMessages.map((message) => {
                        const isMyMessage = message.senderId === user?.id;
                        const senderProfile = isMyMessage
                            ? user
                            : recipientProfile;
                        const isSelected = selectedMessage?.id === message.id;

                        return (
                            <div
                                key={message.id}
                                className={`message-bubble ${isMyMessage ? "my-message" : "their-message"
                        } ${isSelected ? "selected" : ""
                                    }`}
                                onClick={() => handleMessageClick(message)}
                            >
                                {!isMyMessage && (
                                    <img
                                        src={
                                            senderProfile?.avatar ||
                                            "https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13"
                                        }
                                        alt="Аватар"
                                        className="message-sender-avatar"
                                        onError={(e) => {
                                            e.target.src =
                                                "https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13";
                                        }}
                                    />
                                )}
                                {!isMyMessage && (
                                    <div className="message-sender">
                                        {senderProfile?.name}
                                    </div>
                                )}

                                {message.type === "text" && (
                                    <>
                                        {message.images && (
                                            <div className="message-image-container">
                                                <img
                                                    src={message.images}
                                                    alt="Прикрепленное изображение"
                                                    className="message-image"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(
                                                            message.images,
                                                            "_blank"
                                                        );
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {message.file && (
                                            <div className="message-files">
                                                <div className="message-file">
                                                    <a
                                                        href={message.file}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        <span
                                                            className="file-icon"
                                                            dangerouslySetInnerHTML={{ __html: getFileIcon(message.file) }}
                                                        />
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {message.content && (
                                            <div className="message-content">
                                                {message.content}
                                            </div>
                                        )}
                                    </>
                                )}

                                {message.type === "audio" && (
                                    <div className="audio-message-container">
                                        <div className="audio-message-header">
                                            <span className="audio-label">
                                                Голосовое сообщение
                                            </span>
                                        </div>
                                        <audio
                                            controls
                                            src={message.audio_message}
                                            className="audio-player"
                                            preload="metadata"
                                        />
                                    </div>
                                )}

                                {isMyMessage && isSelected && (
                                    <DeleteMessageButton
                                        messageId={message.id}
                                        messageType={message.type}
                                        senderId={message.senderId}
                                        receiverId={parseInt(userId)}
                                        onDeleteSuccess={handleDeleteSuccess}

                                    />
                                )}
                                <div className="message-time">
                                    {(() => {
                                        const date = new Date(
                                            message.timestamp * 1000
                                        );
                                        return date.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        });
                                    })()}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>


            {canSendMessages ? (
                <div className="input-area flex items-center p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 gap-2">
                    <div className="flex items-center gap-1">
                        <ImageUpload
                            onImageSelect={handleImageSelect}
                            disabled={isSending || audioMode}
                        />
                        <FileUpload
                            onFileSelect={handleFileSelect}
                            disabled={isSending || audioMode}
                        />
                        <AudioRTC
                            receiverId={parseInt(userId)}
                            compact={false}
                            onSendComplete={handleAudioSendComplete}
                            onRecordingStateChange={setIsRecordingAudio}
                        />
                    </div>

                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Введите сообщение..."
                            className="w-full sm:w-60 px-4 py-3 relative right-30 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                            disabled={isSending}
                        />
                    </div>

                    <button
                        onClick={handleSendMessage}
                        disabled={(!newMessage.trim() && !selectedImage && !selectedFile) || isSending}
                        className={`
                            p-3 rounded-full transition-all duration-200 relative right-30
                            ${(!newMessage.trim() && !selectedImage && !selectedFile) || isSending
                                ? ' dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                : ' from-blue-500 to-purple-600  hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer'
                            }
                        `}
                        title="Отправить сообщение"
                    >
                        {isSending ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                className="transform rotate-45"
                            >
                                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                            </svg>
                        )}
                    </button>

                    {(selectedImage || selectedFile) && (
                        <div className="absolute -top-20 left-0 right-0 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mx-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {selectedImage && (
                                        <div className="flex items-center gap-2">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                                                <img
                                                    src={URL.createObjectURL(selectedImage)}
                                                    alt="Предпросмотр"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    onClick={() => setSelectedImage(null)}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[100px]">
                                                {selectedImage.name}
                                            </span>
                                        </div>
                                    )}

                                    {selectedFile && (
                                        <div className="flex items-center gap-2">
                                            <div className="relative w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                <span className="text-2xl">📎</span>
                                                <button
                                                    onClick={() => setSelectedFile(null)}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[100px]">
                                                {selectedFile.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Файл готов к отправке
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            ) : (

                <div className="input-area flex items-center justify-center p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-sm">
                            {hasBlockedThisUser
                                ? "Вы заблокировали этого пользователя"
                                : "Вы не можете отправлять сообщения этому пользователю"}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageUser;
