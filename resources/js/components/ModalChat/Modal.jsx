import React, { useState } from 'react';
import { useSelector } from 'react-redux';


import { useDeleteChatMutation } from '../../api/modules/chatApi';

import ThemeChats from '../ThemeChat/ThemeChats';
import MediaFilesModal from '../ThemeChat/FilesThemes/MediaFilesModal';
import Media from '../ThemeChat/FilesThemes/Media';
import AudioMessageItem from '../AudioMessageChat/AudioMessageItem '

const Modal = ({ otherUserId }) => {
    const { user } = useSelector(state => state.user);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showMediaFiles, setShowMediaFiles] = useState(false);
    const [showMedia, setShowMedia] = useState(false);
    const [showAudioMessages, setShowAudioMessages] = useState(false);
    const [showThemes, setShowThemes] = useState(false);


    const [deleteChatMutation,  { isLoading: isDeleting }] = useDeleteChatMutation();

    const openModal = (e) => {
        e?.stopPropagation();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setShowDeleteConfirm(false);
        setShowAudioMessages(false);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setShowDeleteConfirm(true);
    };

    const handleFilesClick = (e) => {
        e?.stopPropagation();
        if (otherUserId) {
            setShowMediaFiles(true);
            closeModal();
        }
    };

    const handleAudioClick = (e) => {
        e?.stopPropagation();
        if (otherUserId) {
            setShowAudioMessages(true);
        }
    };

    const handleMediaClick = (e) => {
        e?.stopPropagation();
        if (otherUserId) {
            setShowMedia(true);
            closeModal();
        }
    };

    const closeMediaFiles = () => setShowMediaFiles(false);
    const closeMedia = () => setShowMedia(false);


    const confirmDelete = async (e) => {
        e?.stopPropagation();
        if (!otherUserId) return;

        try {

            await deleteChatMutation(otherUserId);

            closeModal();
        } catch (err) {

            console.error('Error deleting chat:', err);
            alert(err.data?.message || 'Ошибка при удалении чата');
        }
    };

    const cancelDelete = (e) => {
        e?.stopPropagation();
        setShowDeleteConfirm(false);
    };

    if (!user) {
        console.log('No user found');
        return null;
    }

    return (
        <>
            <svg
                onClick={openModal}
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="currentColor"
                className="bi bi-three-dots-vertical cursor-pointer text-gray-200 p-1 rounded-full transition-all duration-300 hover:bg-red-400 hover:bg-opacity-35"
                viewBox="0 0 16 16"
            >
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
            </svg>

            {isModalOpen && (
                <div
                    className="absolute inset-0 z-50 flex items-center justify-center"
                    onClick={closeModal}
                >
                    <div
                        className={`bg-[rgba(1,14,24,0.96)] rounded-xl shadow-2xl shadow-black/40 border border-white/10 overflow-hidden animate-fadeIn transition-all duration-200 ${showThemes ? 'w-[340px] sm:w-[380px]' : 'w-64 sm:w-72'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {showDeleteConfirm ? (
                            <div className="p-5">
                                <p className="text-gray-200 text-sm text-center mb-5">
                                    Вы уверены, что хотите очистить историю чата?
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 cursor-pointer border-none"
                                        onClick={confirmDelete}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? 'Удаление...' : 'Да'}
                                    </button>
                                    <button
                                        className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium disabled:opacity-50 cursor-pointer border-none"
                                        onClick={cancelDelete}
                                        disabled={isDeleting}
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        ) : showAudioMessages ? (
                            <div className="max-h-80 flex flex-col">
                                <div className="flex items-center gap-2 p-3 border-b border-white/10">
                                    <button
                                        className="bg-transparent border-none text-blue-400 text-sm cursor-pointer px-2 py-1 rounded hover:bg-white/10 transition-colors"
                                        onClick={() => setShowAudioMessages(false)}
                                    >
                                        ← Назад
                                    </button>
                                    <h3 className="text-gray-200 text-sm font-semibold m-0">Голосовые сообщения</h3>
                                </div>
                                <div className="flex-1 overflow-y-auto p-3">
                                    <AudioMessageItem otherUserId={otherUserId} />
                                </div>
                            </div>
                        ) : showThemes ? (
                            <ThemeChats onBack={() => setShowThemes(false)} />
                        ) : (
                            <ul className="list-none m-0 p-0">
                                <li className="border-b border-white/5">
                                    <button
                                        onClick={() => setShowThemes(true)}
                                        className="w-full px-4 py-3 text-left text-sm text-gray-200 flex items-center gap-2.5 hover:bg-red-800 hover:pl-5 transition-all cursor-pointer border-none bg-transparent"
                                    >
                                        🎨 Темы чата
                                    </button>
                                </li>
                                <li className="border-b border-white/5">
                                    <button
                                        onClick={handleFilesClick}
                                        className="w-full px-4 py-3 text-left text-sm text-gray-200 flex items-center gap-2.5 hover:bg-red-800 hover:pl-5 transition-all cursor-pointer border-none bg-transparent"
                                    >
                                        📄 Файлы
                                    </button>
                                </li>
                                
                                <li className="border-b border-white/5">
                                    <button
                                        onClick={handleMediaClick}
                                        className="w-full px-4 py-3 text-left text-sm text-gray-200 flex items-center gap-2.5 hover:bg-red-800 hover:pl-5 transition-all cursor-pointer border-none bg-transparent"
                                    >
                                        🖼️ Медиа
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={handleDeleteClick}
                                        className="w-full px-4 py-3 text-left text-sm text-red-400 flex items-center gap-2.5 hover:bg-red-800 hover:pl-5 transition-all cursor-pointer border-none bg-transparent disabled:opacity-50"
                                        disabled={isDeleting}
                                    >
                                        🗑️ Очистить историю
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            )}

            <MediaFilesModal isOpen={showMediaFiles} onClose={closeMediaFiles} userId={otherUserId} />
            <Media isOpen={showMedia} onClose={closeMedia} userId={otherUserId} />
        </>
    );
};

export default Modal;