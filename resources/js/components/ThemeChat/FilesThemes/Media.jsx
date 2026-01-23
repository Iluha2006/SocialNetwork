import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChatFiles, clearFiles } from '../../../store/FileUsers';
import './ImgesMedia.css';

const Media = (props) => {


const {
    isOpen, onClose, userId
}=props

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

    const imagesOnly = mediaFiles?.filter(file => file.images && !file.file) || [];

    const handleImageClick = (file) => {
        if (file?.images) {
            window.open(file.images, '_blank');
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

    // Добавьте этот useEffect для отладки
    useEffect(() => {
        console.log('Media modal isOpen:', isOpen);
        console.log('Images count:', imagesOnly.length);
    }, [isOpen, imagesOnly.length]);

    if (!isOpen) return null; // Важно: не рендерить если не открыто

    return (
        <div className="images-overl" onClick={onClose}>
            <div className="images-modal" onClick={(e) => e.stopPropagation()}>
                <div className="header-images">
                    <h3>Медиа в чате</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="images-content">
                    {loading && (
                        <div className="loading">Загрузка изображений...</div>
                    )}

                    {error && (
                        <div className="error">
                            Ошибка загрузки: {error}
                        </div>
                    )}

                    {!loading && !error && imagesOnly.length === 0 && (
                        <div className="empty-images">
                            🖼️ Нет отправленных изображений в этом чате
                        </div>
                    )}

                    {!loading && !error && imagesOnly.length > 0 && (
                        <div className="images-grid">
                            {imagesOnly.map((file) => (
                                <div
                                    key={file?.id || Math.random()}
                                    className="images-item"
                                    onClick={() => handleImageClick(file)}
                                >
                                    <div className="images-prev">
                                        <img
                                            src={file?.images}
                                            alt="Из чата"
                                            className="image-media"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-image.jpg';
                                            }}
                                        />
                                    </div>
                                    <div className="images-meta">
                                        <span className="images-date">
                                            {formatDate(file?.created_at)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Media;