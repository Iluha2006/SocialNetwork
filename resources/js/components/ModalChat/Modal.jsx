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
        <div className='relative inline-block'>

            <svg
                onClick={openModal}
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="currentColor"
                className="bi bi-three-dots-vertical cursor-pointer text-gray-200 p-1 rounded-full transition-all duration-300 hover:bg-red-400 hover:bg-opacity-35 sm:hover:bg-opacity-35"
                viewBox="0 0 16 16"
            >
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
            </svg>


            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 animate-fadeIn"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-lg sm:rounded-xl shadow-xl max-w-xs sm:max-w-sm w-full animate-slideUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='p-0'>
                            {showDeleteConfirm ? (

                                <div className="p-4 sm:p-6">
                                    <div className="text-center">
                                        <p className="text-gray-800 mb-4 sm:mb-6 text-sm sm:text-base">
                                            Вы уверены, что хотите очистить историю чата?
                                        </p>
                                        <div className="flex gap-2 sm:gap-3 justify-center">
                                            <button
                                                className="px-4 sm:px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                onClick={confirmDelete}
                                                disabled={isDeleting}
                                            >
                                                {isDeleting && (
                                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                )}
                                                {isDeleting ? 'Удаление...' : 'Да'}
                                            </button>
                                            <button
                                                className="px-4 sm:px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm sm:text-base disabled:opacity-50"
                                                onClick={cancelDelete}
                                                disabled={isDeleting}
                                            >
                                                Отмена
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : showAudioMessages ? (

                                <div className="w-full max-h-70vh sm:max-h-80vh flex flex-col">
                                    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                                        <button
                                            className="bg-none border-none text-blue-600 text-sm sm:text-base cursor-pointer px-2 sm:px-3 py-1 rounded transition-colors hover:bg-gray-200"
                                            onClick={() => setShowAudioMessages(false)}
                                        >
                                            ← Назад
                                        </button>
                                        <h3 className="text-gray-800 text-base sm:text-lg font-semibold m-0">Голосовые сообщения</h3>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                                        <AudioMessageItem otherUserId={otherUserId} />
                                    </div>
                                </div>
                            ) : (

                                <ul className='list-none m-0 p-0'>
                                    <li className="border-b border-gray-100">
                                        <div className="bg-[rgba(1,14,24,0.946)] w-full px-4 sm:px-5 py-3 sm:py-4 border-none text-left cursor-pointer text-xs sm:text-sm text-gray-200 transition-all duration-300 flex items-center gap-2 sm:gap-2.5 hover:bg-red-800 hover:pl-5 sm:hover:pl-6">
                                            <ThemeChats />
                                            <span>Темы чата</span>
                                        </div>
                                    </li>
                                    <li className="border-b border-gray-100">
                                        <button
                                            onClick={handleFilesClick}
                                            className="bg-[rgba(1,14,24,0.946)] w-full px-4 sm:px-5 py-3 sm:py-4 border-none text-left cursor-pointer text-xs sm:text-sm text-gray-200 transition-all duration-300 flex items-center gap-2 sm:gap-2.5 hover:bg-red-800 hover:pl-5 sm:hover:pl-6"
                                        >
                                            📄 Файлы
                                        </button>
                                    </li>
                                    <li className="border-b border-gray-100">
                                        <button
                                            onClick={handleAudioClick}
                                            className="bg-[rgba(1,14,24,0.946)] w-full px-4 sm:px-5 py-3 sm:py-4 border-none text-left cursor-pointer text-xs sm:text-sm text-gray-200 transition-all duration-300 flex items-center gap-2 sm:gap-2.5 hover:bg-red-800 hover:pl-5 sm:hover:pl-6"
                                        >
                                            🎵 Голосовые сообщения
                                        </button>
                                    </li>
                                    <li className="border-b border-gray-100">
                                        <button
                                            onClick={handleMediaClick}
                                            className="bg-[rgba(1,14,24,0.946)] w-full px-4 sm:px-5 py-3 sm:py-4 border-none text-left cursor-pointer text-xs sm:text-sm text-gray-200 transition-all duration-300 flex items-center gap-2 sm:gap-2.5 hover:bg-red-800 hover:pl-5 sm:hover:pl-6"
                                        >
                                            🖼️ Медиа
                                        </button>
                                    </li>
                                    <li className="border-b border-gray-100">
                                        <button
                                            onClick={handleDeleteClick}
                                            className="bg-[rgba(1,14,24,0.946)] w-full px-4 sm:px-5 py-3 sm:py-4 border-none text-left cursor-pointer text-xs sm:text-sm text-red-400 transition-all duration-300 flex items-center gap-2 sm:gap-2.5 hover:bg-red-800 hover:pl-5 sm:hover:pl-6 disabled:opacity-50"
                                            disabled={isDeleting}
                                        >
                                            🗑️ Очистить историю
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <MediaFilesModal isOpen={showMediaFiles} onClose={closeMediaFiles} userId={otherUserId} />
            <Media isOpen={showMedia} onClose={closeMedia} userId={otherUserId} />
        </div>
    );
};

export default Modal;
