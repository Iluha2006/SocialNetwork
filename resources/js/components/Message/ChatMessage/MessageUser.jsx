
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";


import ChatHeader from '../../../layout/ChatMessages/ChatHeader';
import MessageInput from '../../../UI/Message/MessageInput';


import { useGetAllProfilesQuery } from '../../../api/modules/profileApi';
import { useSendMessageMutation } from '../../../api/modules/messages';
import { getConversationAudio } from "../../../store/Files/AudioMessage";
import { selectSelectedBackgroundByChatId } from "../../../store/Files/BacroundImages";
import useMessageSocket from "../../../hooks/Socket/useMessageSocket";
import DeleteMessageButton from "../DeleteMessage/DeleteMessageButton";
import useMessageDeletion from "../../../hooks/useMessageDeletion";
import getFileIcon from "../../../utils/getFileIcon";
import BlockedChatView from "../../../UI/Message/BlockedChatView";
import { findProfileById } from "../../../utils/MessageChat/findProfile";
import { combineAndSortMessages } from "../../../utils/MessageChat/combineMessages";


const MessageUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userId } = useParams();
    const messagesEndRef = useRef(null);


    const { onlineUsers } = useSelector((state) => state.online);
    const { user } = useSelector((state) => state.user);
    const { conversations } = useSelector((state) => state.chat);
    const { viewedProfile } = useSelector((state) => state.profile);
    const { allProfiles: allProfilesFromSlice } = useSelector((state) => state.profile);
    const { AudioConversations } = useSelector((state) => state.audio);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const { handleDeleteMessage } = useMessageDeletion(userId);
    const [sendMessageMutation] = useSendMessageMutation();
    const [newMessage, setNewMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSending, setIsSending] = useState(false);

    const isBlocked = viewedProfile?.is_blocked || false;
    const hasBlockedThisUser = viewedProfile?.has_blocked_this_user || false;

    const {
        data: allProfilesData,
        isLoading: isProfilesLoading,
        isError: isProfilesError,
    } = useGetAllProfilesQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const allProfiles = useMemo(() => {
        return allProfilesData || allProfilesFromSlice || [];
    }, [allProfilesData, allProfilesFromSlice]);


    useMessageSocket(userId);


    const recipientProfile = useMemo(() => findProfileById(allProfiles, userId), [allProfiles, userId]);

    const isRecipientOnline = useMemo(() => {
        return onlineUsers.some(
            (onlineUser) =>
                onlineUser.id === parseInt(userId) && onlineUser.online_status
        );
    }, [onlineUsers, userId]);


    const handleProfileClick = useCallback(() => {
        navigate(`/profile/${userId}`);
    }, [navigate, userId]);




    const canSendMessages = useMemo(() => {
        return !isBlocked && !hasBlockedThisUser && !!user;
    }, [isBlocked, hasBlockedThisUser, user]);

    const handleSendMessage = useCallback(async () => {
        if (!canSendMessages || !user || !recipientProfile) return;
        if (!newMessage.trim() && !selectedImage && !selectedFile) return;

        setIsSending(true);
        try {
            await sendMessageMutation({
                receiverId: parseInt(userId),
                content: newMessage.trim(),
                image: selectedImage,
                file: selectedFile,
                senderId: user.id,
            }).unwrap();


            setNewMessage("");
            setSelectedImage(null);
            setSelectedFile(null);
        } catch (error) {
            console.error("Ошибка отправки:", error);
        } finally {
            setIsSending(false);
        }
    }, [canSendMessages, user, recipientProfile, userId, newMessage, selectedImage, selectedFile, sendMessageMutation]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);




    const handleMessageClick = useCallback((message) => {
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
    }, [user?.id, selectedMessage]);

    const handleDeleteSuccess = useCallback(async (messageData) => {
        const { messageId, messageType, senderId, receiverId } = messageData;
        const result = await handleDeleteMessage(messageId, messageType, senderId, receiverId);
        if (result?.success) {
            setSelectedMessage(null);
            setShowDeleteButton(false);
        }
    }, [handleDeleteMessage]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectedMessage && !event.target.closest(".message-bubble")) {
                setSelectedMessage(null);
                setShowDeleteButton(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedMessage]);

    const allMessages = useMemo(() =>
        combineAndSortMessages(conversations, AudioConversations, user?.id, userId),
        [conversations, AudioConversations, user?.id, userId]
      );


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [allMessages]);


    useEffect(() => {
        if (userId && user?.id) {
            dispatch(getConversationAudio(parseInt(userId)));
        }
    }, [dispatch, userId, user?.id]);


    const chatId = [user?.id, parseInt(userId)];
    const selectedBackground = useSelector((state) =>
        selectSelectedBackgroundByChatId(state, chatId)
    );
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
        return {};
    }, [selectedBackground]);


    const handleAudioSendComplete = useCallback(() => {
        dispatch(getConversationAudio(parseInt(userId)));
    }, [dispatch, userId]);


    const handleImageSelect = useCallback((file) => {
        setSelectedImage(file);
        setSelectedFile(null);
    }, []);

    const handleFileSelect = useCallback((file) => {
        setSelectedFile(file);
        setSelectedImage(null);
    }, []);


    if (isProfilesLoading) return <div className="loading">Загрузка...</div>;
    if (isProfilesError) return <div className="error">Ошибка загрузки профилей</div>;

    if (isBlocked) {
        return (
            <BlockedChatView
                recipient={recipientProfile}
                isOnline={isRecipientOnline}
                message={hasBlockedThisUser
                    ? 'Вы заблокировали этого пользователя'
                    : 'Этот пользователь ограничил вам доступ к переписке'
                }
                onNavigateHome={() => navigate('/')}
            />
        );
    }


    return (
        <div className="w-full max-w-lg mx-auto my-2.5 flex flex-col h-[900px] bg-white dark:bg-gray-900 rounded-2xl shadow-lg transition-colors">

            <ChatHeader
                recipient={recipientProfile}
                isOnline={isRecipientOnline}
                isBlocked={isBlocked || hasBlockedThisUser}
                onProfileClick={handleProfileClick}
            />


            <div style={messagesListStyle} className="messages-list flex-1 overflow-y-auto p-4">
                {allMessages.length === 0 ? (
                    <div className="no-messages flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        <p className="text-lg">Нет сообщений</p>
                        <span className="text-sm">Начните общение первым!</span>
                    </div>
                ) : (
                    allMessages.map((message) => {
                        const isMyMessage = message.senderId === user?.id;
                        const senderProfile = isMyMessage ? user : recipientProfile;
                        const isSelected = selectedMessage?.id === message.id;

                        return (
                            <div
                                key={message.id}
                                className={`message-bubble mb-4 flex ${isMyMessage ? "justify-end" : "justify-start"} ${isSelected ? "selected ring-2 ring-blue-500 rounded-lg" : ""}`}
                                onClick={() => handleMessageClick(message)}
                            >
                                {!isMyMessage && (
                                    <img
                                        src={senderProfile?.avatar || "https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13"}
                                        alt="Аватар"
                                        className="message-sender-avatar w-8 h-8 rounded-full object-cover mr-2 mt-1"
                                        onError={(e) => {
                                            e.target.src = "https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13";
                                        }}
                                    />
                                )}

                                <div className={`max-w-[75%] ${isMyMessage ? "items-end" : "items-start"}`}>
                                    {!isMyMessage && senderProfile?.name && (
                                        <div className="message-sender text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">
                                            {senderProfile.name}
                                        </div>
                                    )}

                                    <div className={`message-content p-3 rounded-2xl ${
                                        isMyMessage
                                            ? "bg-blue-500 text-white rounded-br-none"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none"
                                    }`}>
                                        {message.type === "text" && (
                                            <>
                                                {message.images && (
                                                    <div className="message-image-container mb-2">
                                                        <img
                                                            src={message.images}
                                                            alt="Прикрепленное изображение"
                                                            className="message-image max-w-full rounded-lg cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                window.open(message.images, "_blank");
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                {message.file && (
                                                    <div className="message-files mb-2">
                                                        <a
                                                            href={message.file}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <span dangerouslySetInnerHTML={{ __html: getFileIcon(message.file) }} />
                                                            <span className="text-sm truncate">{message.file.split('/').pop()}</span>
                                                        </a>
                                                    </div>
                                                )}
                                                {message.content && (
                                                    <div className="message-text whitespace-pre-wrap break-words">
                                                        {message.content}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {message.type === "audio" && (
                                            <div className="audio-message-container min-w-[200px]">
                                                <div className="audio-message-header text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                     Голосовое сообщение
                                                </div>
                                                <audio
                                                    controls
                                                    src={message.audio_message}
                                                    className="audio-player w-full"
                                                    preload="metadata"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className={`message-time text-xs text-gray-400 mt-1 ${isMyMessage ? "text-right mr-1" : "ml-1"}`}>
                                        {new Date(message.timestamp * 1000).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        })}
                                    </div>

                                    {isMyMessage && isSelected && (
                                        <DeleteMessageButton
                                            messageId={message.id}
                                            messageType={message.type}
                                            senderId={message.senderId}
                                            receiverId={parseInt(userId)}
                                            onDeleteSuccess={handleDeleteSuccess}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>


            {canSendMessages ? (
                <MessageInput
                    receiverId={userId}
                    currentUserId={user?.id}
                    onSend={handleSendMessage}
                    message={newMessage}
                    onMessageChange={setNewMessage}
                    onKeyPress={handleKeyPress}
                    selectedImage={selectedImage}
                    selectedFile={selectedFile}
                    onImageSelect={handleImageSelect}
                    onFileSelect={handleFileSelect}
                    onRemoveImage={() => setSelectedImage(null)}
                    onRemoveFile={() => setSelectedFile(null)}
                    isSending={isSending}
                    onAudioSendComplete={handleAudioSendComplete}
                />
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