import React, { useState, useCallback, memo, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { removeAudioConversation } from '../../store/Files/AudioMessage';
import {
    useFetchChatListQuery,
    useDeleteChatMutation
} from '../../api/modules/chatApi';

const DEFAULT_AVATAR = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23e0e0e0%22/%3E%3Ctext x=%2250%22 y=%2258%22 text-anchor=%22middle%22 font-size=%2240%22 fill=%22%23999%22%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E';

const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const toUTCDate = (ts) => {
        const s = typeof ts === 'string' ? ts : String(ts);
        return new Date(s && !s.endsWith('Z') && !s.includes('+') ? s + 'Z' : s);
    };
    const date = toUTCDate(timestamp);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date >= today) {
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
    } else if (date >= yesterday) {
        return 'Вчера';
    } else {
        return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
};

const DeleteConfirmModal = memo(({ chatId, onConfirm, onCancel }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="rounded-lg p-6 max-w-sm mx-4" style={{ backgroundColor: 'rgba(1, 14, 24, 0.946)' }}>
            <p className="text-white mb-4">Вы уверены, что хотите удалить этот чат?</p>
            <div className="flex gap-3">
                <button
                    className="flex-1 cursor-pointer bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                    onClick={() => onConfirm(chatId)}
                >
                    Да
                </button>
                <button
                    className="flex-1 bg-gray-600 cursor-pointer text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={onCancel}
                >
                    Отмена
                </button>
            </div>
        </div>
    </div>
));

const ChatItem = memo(({ chat, isOnline, otherUserProfile, lastMessageText, lastMessageTime, deleteMode, showConfirm, onChatClick, onDeleteClick, onConfirmDelete, onCancelDelete }) => {
    return (
        <div
            className={`bg-gray-800 rounded-lg p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-gray-700 ${
                deleteMode ? 'opacity-70' : ''
            }`}
            onClick={() => onChatClick(chat.id)}
        >
            <div className="relative">
                <img
                    src={otherUserProfile?.avatar || DEFAULT_AVATAR}
                    alt="Аватар"
                    className="w-12 h-12 rounded-full object-cover"
                />
                {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <div className="text-white font-medium truncate">
                        {otherUserProfile?.name || chat.name}
                    </div>
                    {isOnline && <span className="text-green-500 text-xs font-medium">online</span>}
                </div>
                <div className="text-gray-400 text-sm truncate">
                    {lastMessageText}
                </div>
            </div>

            <div className="flex flex-col items-end gap-1">
                {lastMessageTime && (
                    <div className="text-gray-500 text-xs">
                        {formatTime(lastMessageTime)}
                    </div>
                )}
            </div>

            {deleteMode && (
                <div
                    className="p-2 text-red-500 hover:text-red-400 transition-colors"
                    onClick={(e) => onDeleteClick(chat.id, e)}
                    title="Удалить чат"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                </div>
            )}

            {showConfirm && (
                <DeleteConfirmModal
                    chatId={chat.id}
                    onConfirm={onConfirmDelete}
                    onCancel={onCancelDelete}
                />
            )}
        </div>
    );
});

const ChatList = memo(() => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        data: chats = [],
        isLoading: chatsLoading,
    } = useFetchChatListQuery();

    const [deleteChatMutation] = useDeleteChatMutation();

    const user = useSelector(state => state.user.user);
    const conversations = useSelector(state => state.chat.conversations);
    const allProfiles = useSelector(state => state.profile.allProfiles);
    const onlineUsers = useSelector(state => state.online.onlineUsers);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [deleteMode, setDeleteMode] = useState(false);

    const profileMap = useMemo(() => {
        const map = new Map();
        if (allProfiles) {
            for (const profile of allProfiles) {
                map.set(profile.id, profile);
            }
        }
        return map;
    }, [allProfiles]);

    const onlineSet = useMemo(() => {
        const set = new Set();
        if (onlineUsers) {
            for (const u of onlineUsers) {
                if (u.online_status === 'online') set.add(u.id);
            }
        }
        return set;
    }, [onlineUsers]);

    const handleChatClick = useCallback((userId) => {
        if (deleteMode) return;
        navigate(`/messages/${userId}`);
    }, [deleteMode, navigate]);

    const handleDeleteChat = useCallback((otherUserId, event) => {
        event.stopPropagation();
        setShowDeleteConfirm(otherUserId);
    }, []);

    const confirmDelete = useCallback(async (otherUserId) => {
        try {
            await deleteChatMutation(otherUserId).unwrap();
            const conversationKey = [user.id, otherUserId].sort().join('-');
            dispatch(removeAudioConversation(conversationKey));
            setShowDeleteConfirm(null);
        } catch (error) {
            console.error('Ошибка удаления чата:', error);
        }
    }, [deleteChatMutation, user?.id, dispatch]);

    const cancelDelete = useCallback(() => setShowDeleteConfirm(null), []);

    const toggleDeleteMode = useCallback(() => {
        setDeleteMode((prev) => !prev);
        setShowDeleteConfirm(null);
    }, []);

    if (chatsLoading) {
        return (
            <div className="w-full max-w-2xl mx-auto p-4 bg-gray-900 rounded-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Мои чаты</h2>
                <div className="text-white text-center py-8">Загрузка чатов...</div>
            </div>
        );
    }

    return (
        <div className="
    w-full
    md:max-w-[600px]
    lg:max-w-3xl
    xl:max-w-5xl
    2xl:max-w-[1000px]
    mx-auto
    min-h-screen
    p-4
    md:p-6
    lg:p-8
    bg-[rgb(1,14,24)]
    md:rounded-lg
   ">
            <h2 className="text-xl font-semibold text-white mb-4">Мои чаты</h2>
            <div className="space-y-4">
                <button
                    className="bg-orange-800 text-amber-50 px-4 py-2 rounded-lg font-medium transition-colors"
                    onClick={toggleDeleteMode}
                >
                    {deleteMode ? 'Отменить удаление' : 'Удалить чат'}
                </button>

                {chats?.length > 0 ? (
                    chats.map((chat) => {
                        const otherUserProfile = profileMap.get(chat.id);
                        const isOnline = onlineSet.has(chat.id);
                        const lastMessageText = chat.last_message?.content || 'Нет сообщений';
                        const lastMessageTime = chat.last_message?.created_at || null;

                        return (
                            <ChatItem
                                key={chat.id}
                                chat={chat}
                                isOnline={isOnline}
                                otherUserProfile={otherUserProfile}
                                lastMessageText={lastMessageText}
                                lastMessageTime={lastMessageTime}
                                deleteMode={deleteMode}
                                showConfirm={showDeleteConfirm === chat.id}
                                onChatClick={handleChatClick}
                                onDeleteClick={handleDeleteChat}
                                onConfirmDelete={confirmDelete}
                                onCancelDelete={cancelDelete}
                            />
                        );
                    })
                ) : (
                    <div className="text-center py-8 bg-gray-800 rounded-lg">
                        <p className="text-white text-lg mb-2">У вас пока нет чатов</p>
                        <span className="text-gray-400">Начните общение с другими пользователями!</span>
                    </div>
                )}
            </div>
        </div>
    );
});

export default ChatList;