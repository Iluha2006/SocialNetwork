import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { removeAudioConversation } from '../../store/Files/AudioMessage';
import {
    useFetchChatListQuery,
    useDeleteChatMutation
} from '../../api/modules/chatApi';

const ChatList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        data: chats = [],
        isLoading: chatsLoading,
        refetch: refetchChats
    } = useFetchChatListQuery();

    const [deleteChatMutation] = useDeleteChatMutation();

    const { user } = useSelector(state => state.user);
    const { conversations } = useSelector(state => state.chat);
    const { AudioConversations } = useSelector(state => state.audio);
    const { allProfiles } = useSelector(state => state.profile);
    const { onlineUsers } = useSelector(state => state.online);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [deleteMode, setDeleteMode] = useState(false);

    const getOtherUserProfile = (otherUserId) => {
        return allProfiles.find(profile => profile.id === otherUserId);
    };

    const isUserOnline = (userId) => {
        return onlineUsers.some(onlineUser => onlineUser.id === userId && onlineUser.online_status);
    };

    const getLastMessageText = (chat) => {
        if (!chat) return 'Нет сообщений';
        if (chat.last_message?.content) return chat.last_message.content;
        if (chat.content) return chat.content;

        const currentUserId = user?.id;
        if (currentUserId) {
            const conversationKey = [currentUserId, chat.id].sort().join('-');
            const conversation = conversations[conversationKey];
            const audioConversation = AudioConversations[conversationKey];

            if (conversation?.messages?.length > 0) {
                const last = conversation.messages[conversation.messages.length - 1];
                if (last.images) return 'Изображение';
                if (last.file) return 'Файл';
                return last.content || 'Сообщение';
            }
            if (audioConversation?.messages?.length > 0) {
                return 'Голосовое сообщение';
            }
        }
        return 'Нет сообщений';
    };

    const getLastMessageTime = (chat) => {
        if (chat.last_message?.created_at) return chat.last_message.created_at;
        const currentUserId = user?.id;
        if (currentUserId) {
            const key = [currentUserId, chat.id].sort().join('-');
            const conv = conversations[key];
            if (conv?.lastMessage) return conv.lastMessage.timestamp * 1000;
        }
        return null;
    };

    const handleChatClick = (userId) => {
        if (deleteMode) return;
        navigate(`/messages/${userId}`);
    };

    // 🎯 Удаление чата через RTK Query
    const handleDeleteChat = async (otherUserId, event) => {
        event.stopPropagation();
        setShowDeleteConfirm(otherUserId);
    };

    const confirmDelete = async (otherUserId) => {
        try {
            // Вызываем мутацию RTK Query
            await deleteChatMutation(otherUserId).unwrap();

            // Дополнительно очищаем аудио-кэш (если нужно)
            const conversationKey = [user.id, otherUserId].sort().join('-');
            dispatch(removeAudioConversation(conversationKey));

            setShowDeleteConfirm(null);
            // Список чатов обновится автоматически благодаря invalidatesTags
        } catch (error) {
            console.error('Ошибка удаления чата:', error);
            // Можно показать toast/error пользователю
        }
    };

    const cancelDelete = () => setShowDeleteConfirm(null);
    const toggleDeleteMode = () => {
        setDeleteMode(!deleteMode);
        setShowDeleteConfirm(null);
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        let date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
        if (isNaN(date.getTime())) return '';

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date >= today) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        } else if (date >= yesterday) {
            return 'Вчера';
        } else {
            return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
    };

    // Loading state от RTK Query
    if (chatsLoading) {
        return (
            <div className="w-full max-w-2xl mx-auto p-4 bg-gray-900 rounded-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Мои чаты</h2>
                <div className="text-white text-center py-8">Загрузка чатов...</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4 rounded-lg" style={{ backgroundColor: 'rgba(1, 14, 24, 0.946)' }}>
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
                        const otherUserProfile = getOtherUserProfile(chat.id);
                        const isOnline = isUserOnline(chat.id);
                        const lastMessageTime = getLastMessageTime(chat);

                        return (
                            <div
                                key={chat.id}
                                className={`bg-gray-800 rounded-lg p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-gray-700 ${
                                    deleteMode ? 'opacity-70' : ''
                                }`}
                                onClick={() => handleChatClick(chat.id)}
                            >
                                <div className="relative">
                                    <img
                                        src={otherUserProfile?.avatar || 'https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13'}
                                        alt="Аватар"
                                        className="w-12 h-12 rounded-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13';
                                        }}
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
                                        {getLastMessageText(chat)}
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
                                        onClick={(e) => handleDeleteChat(chat.id, e)}
                                        title="Удалить чат"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                        </svg>
                                    </div>
                                )}

                                {showDeleteConfirm === chat.id && (
                                    <div className="fixed inset-0 flex items-center justify-center z-50">
                                        <div className="rounded-lg p-6 max-w-sm mx-4" style={{ backgroundColor: 'rgba(1, 14, 24, 0.946)' }}>
                                            <p className="text-white mb-4">Вы уверены, что хотите удалить этот чат?</p>
                                            <div className="flex gap-3">
                                                <button
                                                    className="flex-1 cursor-pointer bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                                                    onClick={() => confirmDelete(chat.id)}
                                                >
                                                    Да
                                                </button>
                                                <button
                                                    className="flex-1 bg-gray-600 cursor-pointer text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                                    onClick={cancelDelete}
                                                >
                                                    Отмена
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
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
};

export default ChatList;