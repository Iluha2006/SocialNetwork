import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './ImageUpload.css';

const ImageChat = (props) => {

const {
    onImageSelect,
     previewUrl,
      forChatBackground=false ,
      onBackgroundSet
}=props

    const fileInputRef = useRef(null);
    const { token, user } = useSelector(state => state.user);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (previewUrl === null && fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [previewUrl]);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            alert('Пожалуйста, выберите изображение');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('Размер изображения не должен превышать 2MB');
            return;
        }

        if (forChatBackground) {
            await setChatBackground(file);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if (onImageSelect) {
                onImageSelect(file, e.target.result);
            }
        };
        reader.readAsDataURL(file);
        if (onImageSelect) {
            onImageSelect(file);
        }
    };

    const setChatBackground = async (file) => {
        if (!file) {
            setError('Пожалуйста, выберите файл');
            return;
        }

        if (!user?.id) {
            setError('Ошибка: ID пользователя не найден');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('chat_background', file);
            formData.append('user_id', user.id);

            const response = await axios.post('/api/chat-background', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                alert('Фон чата успешно установлен!');


                const imageUrl = response.data.image_url || response.data.path_image;


                document.body.style.backgroundImage = `url(${imageUrl})`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundAttachment = 'fixed';

                // Сохраняем в localStorage
                localStorage.setItem('chatBackground', imageUrl);

                // Вызываем callback для родительского компонента
                if (onBackgroundSet) {
                    onBackgroundSet(imageUrl);
                }
            }

        } catch (err) {
            console.error('Upload error:', err);
            if (err.response?.data?.errors) {
                setError(Object.values(err.response.data.errors).flat().join(', '));
            } else {
                setError('Ошибка загрузки изображения');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = () => {
        if (forChatBackground) {

            document.body.style.backgroundImage = '';
            localStorage.removeItem('chatBackground');


            if (onBackgroundSet) {
                onBackgroundSet('');
            }
        } else if (onImageSelect) {
            onImageSelect(null);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="image-container">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                style={{ display: 'none' }}
            />

            {forChatBackground ? (
                <div className="chat-background-controls">
                    <button
                        onClick={handleClick}
                        disabled={loading}
                        className="chat-background-btn"
                    >
                        {loading ? 'Загрузка...' : '📁 Выбрать изображение'}
                    </button>
                    <button
                        onClick={handleRemoveImage}
                        className="remove-background-btn"
                        title="Удалить фон"
                    >
                        ❌
                    </button>
                </div>
            ) : (

                <svg  onClick={handleClick} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-camera" viewBox="0 0 16 16">
  <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/>
  <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
</svg>

            )}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default ImageChat;
