
import React, { useEffect, useState, useRef, useMemo, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import ChatHeader from '../../../layout/ChatMessages/ChatHeader';
import MessageInput from '../../../UI/Message/MessageInput';

import { useLoadConversationMessagesQuery } from '../../../api/modules/conversations';
import { useGetAllProfilesQuery } from '../../../api/modules/profileApi';
import { useEditMessageMutation } from '../../../api/modules/messages';
import { getConversationAudio } from "../../../store/Files/AudioMessage";
import { selectSelectedBackgroundByChatId } from "../../../store/Files/BacroundImages";
import { initChatTheme, selectChatTheme } from "../../../store/Theme/chatThemeSlice";
import { applyChatTheme } from "../../../components/ThemeChat/chatThemes";
import useMessageSocket from "../../../hooks/Socket/useMessageSocket";
import DeleteMessageButton from "../DeleteMessage/DeleteMessageButton";
import useMessageDeletion from "../../../hooks/useMessageDeletion";
import getFileIcon from "../../../utils/getFileIcon";
import BlockedChatView from "../../../UI/Message/BlockedChatView";
import { findProfileById } from "../../../utils/MessageChat/findProfile";

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23e0e0e0%22/%3E%3Ctext x=%2250%22 y=%2258%22 text-anchor=%22middle%22 font-size=%2240%22 fill=%22%23999%22%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E";

const handleAvatarError = (e) => {
    if (e.target.src === DEFAULT_AVATAR) return;
    e.target.src = DEFAULT_AVATAR;
};

const formatMessageTime = (message) => {
    const raw = message.timestamp || message.created_at;
    const dateStr = typeof raw === 'string' && !raw.endsWith('Z') && !raw.includes('+') ? raw + 'Z' : raw;
    return new Date(dateStr).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

const MessageItem = memo(({ message, isMyMessage, senderProfile, isSelected, isBlocked, onClick, onDeleteSuccess, isEditing, editingText, onEditChange, onEditSave, onEditCancel, onEditStart }) => {
    const msgType = message.type || 'text';
    const editInputRef = useRef(null);

    useEffect(() => {
        if (isEditing && editInputRef.current) {
            editInputRef.current.focus();
            editInputRef.current.selectionStart = editInputRef.current.value.length;
        }
    }, [isEditing]);

    const handleEditKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onEditSave();
        } else if (e.key === 'Escape') {
            onEditCancel();
        }
    };

    return (
        <div
            className={`message-bubble mb-4 flex ${isMyMessage ? "justify-end" : "justify-start"} ${isSelected ? "selected" : ""}`}
            onClick={onClick}
        >
            {!isMyMessage && (
                <img
                    src={senderProfile?.avatar || DEFAULT_AVATAR}
                    alt="Аватар"
                    className="message-sender-avatar w-8 h-8 rounded-full object-cover mr-2 mt-1"
                    onError={handleAvatarError}
                />
            )}

            <div className={`max-w-[75%] ${isMyMessage ? "items-end" : "items-start"}`}>
                {!isMyMessage && senderProfile?.name && (
                    <div className="message-sender text-xs mb-1 ml-1"
                        style={{ color: 'var(--chat-secondary, #6c757d)' }}
                    >
                        {senderProfile.name}
                    </div>
                )}

                <div
                    className="message-content p-3 rounded-2xl"
                    style={{
                        background: isMyMessage
                            ? 'var(--chat-my-message-gradient, linear-gradient(135deg, #007bff 0%, #0056b3 100%))'
                            : 'var(--chat-their-message-gradient, linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%))',
                        color: isMyMessage
                            ? 'var(--chat-my-message-text, #ffffff)'
                            : 'var(--chat-text, #212529)',
                        borderBottomRightRadius: isMyMessage ? '4px' : '16px',
                        borderBottomLeftRadius: isMyMessage ? '16px' : '4px',
                    }}
                >
                    {msgType === "text" && (
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
                                        download={message.file_name || message.file.split('/').pop()}
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 hover:underline"
                                        style={{ color: 'var(--chat-primary, #007bff)' }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <span>{getFileIcon(message.file)}</span>
                                        <span className="text-sm truncate">{message.file_name || message.file.split('/').pop()}</span>
                                    </a>
                                </div>
                            )}
                            {message.content && (
                                isEditing ? (
                                    <textarea
                                        ref={editInputRef}
                                        className="message-edit-input"
                                        value={editingText}
                                        onChange={(e) => onEditChange(e.target.value)}
                                        onKeyDown={handleEditKeyDown}
                                        onBlur={onEditSave}
                                        onClick={(e) => e.stopPropagation()}
                                        rows={1}
                                        style={{
                                            color: isMyMessage
                                                ? 'var(--chat-my-message-text, #ffffff)'
                                                : 'var(--chat-text, #212529)',
                                        }}
                                    />
                                ) : (
                                    <div className="message-text whitespace-pre-wrap break-words">
                                        {message.content}
                                        {message.edited && (
                                            <span className="message-edited-flag text-[10px] opacity-60 ml-1">(ред.)</span>
                                        )}
                                    </div>
                                )
                            )}
                        </>
                    )}
                </div>

                <div className={`message-time text-xs mt-1 ${isMyMessage ? "text-right mr-1" : "ml-1"}`}
                    style={{ color: 'var(--chat-secondary, #6c757d)' }}
                >
                    {formatMessageTime(message)}
                </div>

                {isMyMessage && isSelected && (
                    <div className="message-actions-row flex items-center gap-1 mt-1" style={{ justifyContent: isMyMessage ? 'flex-end' : 'flex-start' }}>
                        {!isEditing && msgType === 'text' && message.content && (
                            <button
                                className="edit-message-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEditStart();
                                }}
                                title="Редактировать"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                </svg>
                            </button>
                        )}
                        <DeleteMessageButton
                            messageId={message.id}
                            messageType={msgType}
                            senderId={message.sender_id ?? message.senderId}
                            receiverId={message.receiverId}
                            onDeleteSuccess={onDeleteSuccess}
                        />
                    </div>
                )}
            </div>
        </div>
    );
});

const MessageUser = memo(() => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userId } = useParams();
    const messagesEndRef = useRef(null);
    const { onlineUsers } = useSelector((state) => state.online);
    const { user } = useSelector((state) => state.user);
    const { viewedProfile } = useSelector((state) => state.profile);
    const allProfilesFromSlice = useSelector((state) => state.profile.allProfiles);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const { handleDeleteMessage } = useMessageDeletion(userId);
    const [editMessage] = useEditMessageMutation();

    const isBlocked = viewedProfile?.is_blocked || false;
    const hasBlockedThisUser = viewedProfile?.has_blocked_this_user || false;

    const {
        data: allProfilesData,
        isLoading: isProfilesLoading,
        isError: isProfilesError,
    } = useGetAllProfilesQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const {
        data: messagesData,
        isLoading,
        isError,
        refetch,
    } = useLoadConversationMessagesQuery(userId, {
        skip: !userId,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    const messages = messagesData?.messages || messagesData || [];

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

    const canSendMessages = useMemo(() => {
        return !isBlocked && !hasBlockedThisUser && !!user;
    }, [isBlocked, hasBlockedThisUser, user]);

    const handleProfileClick = useCallback(() => {
        navigate(`/profile/${userId}`);
    }, [navigate, userId]);

    const handleMessageClick = useCallback((message) => {
        if ((message.sender_id ?? message.senderId) === user?.id) {
            setSelectedMessage((prev) => {
                if (prev?.id === message.id) {
                    setShowDeleteButton(false);
                    return null;
                }
                setShowDeleteButton(true);
                return message;
            });
        } else {
            setSelectedMessage(null);
            setShowDeleteButton(false);
        }
    }, [user?.id]);

    const handleDeleteSuccess = useCallback(async (messageData) => {
        const { messageId, messageType, senderId, receiverId } = messageData;
        const result = await handleDeleteMessage(messageId, messageType, senderId, receiverId);
        if (result?.success) {
            setSelectedMessage(null);
            setShowDeleteButton(false);
        }
    }, [handleDeleteMessage]);

    const handleEditStart = useCallback(() => {
        if (selectedMessage) {
            setEditingMessageId(selectedMessage.id);
            setEditingText(selectedMessage.content || '');
        }
    }, [selectedMessage]);

    const handleEditSave = useCallback(async () => {
        if (!editingMessageId || !editingText.trim()) {
            setEditingMessageId(null);
            setEditingText('');
            return;
        }
        const trimmed = editingText.trim();
        if (trimmed === selectedMessage?.content) {
            setEditingMessageId(null);
            setEditingText('');
            return;
        }
        await editMessage({ messageId: editingMessageId, content: trimmed });
        setEditingMessageId(null);
        setEditingText('');
        setSelectedMessage(null);
        setShowDeleteButton(false);
    }, [editingMessageId, editingText, selectedMessage, editMessage]);

    const handleEditCancel = useCallback(() => {
        setEditingMessageId(null);
        setEditingText('');
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectedMessage && !event.target.closest(".message-bubble")) {
                setSelectedMessage(null);
                setShowDeleteButton(false);
                setEditingMessageId(null);
                setEditingText('');
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedMessage]);

    const allMessages = useMemo(() => {
        return messages || [];
    }, [messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [allMessages]);

    useEffect(() => {
        if (userId && user?.id) {
            dispatch(getConversationAudio(parseInt(userId)));
        }
    }, [dispatch, userId, user?.id]);

    const chatId = useMemo(() => {
        return [user?.id, parseInt(userId)].sort().join('-');
    }, [user?.id, userId]);

    const currentChatTheme = useSelector(state => selectChatTheme(state, chatId));

    useEffect(() => {
        if (chatId) {
            dispatch(initChatTheme({ chatId }));
        }
    }, [chatId, dispatch]);

    useEffect(() => {
        if (currentChatTheme) {
            applyChatTheme(currentChatTheme);
        }
    }, [currentChatTheme]);

    const selectedBackground = useSelector((state) =>
        selectSelectedBackgroundByChatId(state, chatId)
    );

    const messagesListStyle = useMemo(() => {
        const style = {
            backgroundImage: 'var(--chat-background-gradient)',
        };
        if (selectedBackground) {
            style.backgroundImage = `url(${selectedBackground})`;
            style.backgroundSize = 'cover';
            style.backgroundPosition = 'center';
            style.backgroundRepeat = 'no-repeat';
        }
        return style;
    }, [selectedBackground]);

    const handleAudioSendComplete = useCallback(() => {
        dispatch(getConversationAudio(parseInt(userId)));
    }, [dispatch, userId]);

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
        <div className="w-full md:max-w-[600px] lg:max-w-3xl xl:max-w-5xl 2xl:max-w-[1000px] mx-auto h-screen max-h-screen flex flex-col rounded-2xl shadow-lg transition-colors relative"
            style={{ background: 'var(--chat-background, #ffffff)' }}
        >
            <ChatHeader
                recipient={recipientProfile}
                isOnline={isRecipientOnline}
                isBlocked={isBlocked || hasBlockedThisUser}
                onProfileClick={handleProfileClick}
            />

            <div style={messagesListStyle} className="messages-list flex-1 overflow-y-auto p-4">
                {allMessages.length === 0 ? (
                    <div className="no-messages flex flex-col items-center justify-center h-full"
                        style={{ color: 'var(--chat-text, #6c757d)' }}
                    >
                        <p className="text-lg">Нет сообщений</p>
                        <span className="text-sm">Начните общение первым!</span>
                    </div>
                ) : (
                    allMessages.map((message) => {
                        const isMyMessage = Number(message.sender_id ?? message.senderId) === Number(user?.id);
                        const senderProfile = isMyMessage
                            ? user
                            : message.sender ?? recipientProfile;
                        const isSelected = selectedMessage?.id === message.id;

                        return (
                            <MessageItem
                                key={message.id}
                                message={{ ...message, receiverId: userId }}
                                isMyMessage={isMyMessage}
                                senderProfile={senderProfile}
                                isSelected={isSelected}
                                isBlocked={isBlocked}
                                onClick={() => handleMessageClick(message)}
                                onDeleteSuccess={handleDeleteSuccess}
                                isEditing={editingMessageId === message.id}
                                editingText={editingMessageId === message.id ? editingText : ''}
                                onEditChange={setEditingText}
                                onEditSave={handleEditSave}
                                onEditCancel={handleEditCancel}
                                onEditStart={handleEditStart}
                            />
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {canSendMessages ? (
                <MessageInput
                    receiverId={userId}
                    currentUserId={user?.id}
                    onAudioSendComplete={handleAudioSendComplete}
                />
            ) : (
                <div className="input-area flex items-center justify-center p-4 border-t"
                    style={{
                        borderColor: 'var(--chat-border, #dee2e6)',
                        background: 'var(--chat-message-bg, #f8f9fa)',
                        color: 'var(--chat-text, #6c757d)'
                    }}
                >
                    <div className="flex items-center gap-2">
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
});

export default MessageUser;