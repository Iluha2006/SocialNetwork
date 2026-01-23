import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChatFiles, clearFiles } from '../../../store/FileUsers';
import './MediaFilesModal.css';

const MediaFilesModal = (props) => {

const {
    isOpen,
     onClose,
     userId
}=props;

    const dispatch = useDispatch();

    const { mediaFiles, loading, error } = useSelector(state => state.files);
    const { user } = useSelector(state => state.user);

    useEffect(() => {
        if (isOpen && userId) {
            dispatch(fetchChatFiles(userId));
        }
    }, [isOpen, userId, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearFiles());
        };
    }, [dispatch]);


    const filesOnly = mediaFiles?.filter(file => file.file && !file.images) || [];

    const handleFileClick = (file) => {
        if (file?.file) {
            window.open(file.file, '_blank');
        }
    };

    const getFileExtension = (file) => {
        return file.file.split('.').pop().toLowerCase();
    };

    const getFileType = (file) => {


        if (file.file) {
            const extension = getFileExtension(file);
            if (['pdf'].includes(extension)) return 'pdf';
            if (['doc', 'docx'].includes(extension)) return 'doc';
            if (['xls', 'xlsx'].includes(extension)) return 'xls';
            if (['ppt', 'pptx'].includes(extension)) return 'ppt';
            if (['txt'].includes(extension)) return 'txt';
            if (['zip', 'rar', '7z'].includes(extension)) return 'zip';
            if (['mp4', 'avi', 'mov', 'mkv'].includes(extension)) return 'video';

        }
        return file;
    };

    const getFileIcon = (fileType, file) => {
        const extension = getFileExtension(file);

        switch(fileType) {
            case 'pdf':
                return <img width='40' height='40' src='https://avatars.mds.yandex.net/i?id=dce9f320cfc5621bd3d680c2c9bc5cdd155f59b0-2479991-images-thumbs&n=13' alt="PDF"/>;
            case 'doc': case 'docx':
                return <img width='40' height='40' src='https://logos-world.net/wp-content/uploads/2020/03/Microsoft-Word-Logo-2013-2019.png' alt="Word"/>;
            case 'txt':
                return '📃';
            case 'zip': case 'rar':
                return <img width='40' height='40' src='https://commeng.ru/catalog/step-img/4380843.png' alt="Archive"/>;
            case 'xls': case 'xlsx':
                return <img width='40' height='40' src='https://avatars.mds.yandex.net/i?id=1b76e7c9f46fe80899d1b4822fa6b72eff459dab-10122172-images-thumbs&n=13' alt="Excel"/>;
            case 'ppt': case 'pptx':
                return '📑';
            case 'video':
                return '🎬';
            default:
                return '📎';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Неизвестная дата';
        }
    };

    const getFileName = (file) => {
        if (!file || !file.file) return 'Файл';
        return file.file.split('/').pop() || 'Файл';
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="media-files-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">

                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="modal-content">
                    {loading && (
                        <div className="loading">Загрузка файлов...</div>
                    )}

                    {error && (
                        <div className="error-message">
                            Ошибка: {error}
                            <button
                                onClick={() => userId && dispatch(fetchChatFiles(userId))}
                                className="retry-button"
                            >
                                Попробовать снова
                            </button>
                        </div>
                    )}

                    {!loading && !error && filesOnly.length === 0 && (
                        <div className="empty-state">
                            📁 Нет отправленных файлов в этом чате
                        </div>
                    )}

                    {!loading && !error && filesOnly.length > 0 && (
                        <div className="files-grid">
                            {filesOnly.map((file) => {
                                const fileType = getFileType(file);


                                return (
                                    <div
                                        key={file?.id || Math.random()}
                                        className="file-item"
                                        onClick={() => handleFileClick(file)}
                                    >
                                        <div className="file-preview">
                                            <div className="file-icon">
                                                {getFileIcon(fileType, file)}
                                            </div>
                                        </div>

                                        <div className="file-info">
                                            <div className="file-name" title={getFileName(file)}>
                                                {getFileName(file)}
                                            </div>
                                            <div className="file-meta">

                                                <span className="date">
                                                    {formatDate(file?.created_at)}
                                                </span>
                                            </div>
                                            {file?.content && (
                                                <div className="file-content" title={file.content}>
                                                    {file.content.length > 50
                                                        ? file.content.substring(0, 50) + '...'
                                                        : file.content
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MediaFilesModal;