import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import axios from 'axios';
import './ImageUpload.css';

const ImagesUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { token, user } = useSelector(state => state.user);
    const userId = user?.id;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {

            if (!file.type.startsWith('image/')) {
                setError('Пожалуйста, выберите изображение');
                return;
            }


            if (file.size > 2 * 1024 * 1024) {
                setError('Размер файла не должен превышать 2MB');
                return;
            }

            setSelectedFile(file);
            setError('');

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setError('');

        const fileInput = document.getElementById('avatar-upload');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            setError('Пожалуйста, выберите файл');
            return;
        }

        if (!userId) {
            setError('Ошибка: ID пользователя не найден');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('profile_images', selectedFile);


            const response = await axios.post('/images/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });

            if (response.data.success) {
                setSelectedFile(null);
                setPreviewUrl('');
                alert('Фото успешно загружено!');
                window.location.reload();
            }

        } catch (err) {
            console.error('Upload error:', err);

            if (err.response?.data?.errors) {
                setError(Object.values(err.response.data.errors).flat().join(', '));
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Ошибка загрузки изображения');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="prof-upload-container">
            {!previewUrl ? (
                <div className="upload-placeholder">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
                    </svg>
                    <p>Вы ещё не добавили фото</p>
                </div>
            ) : null}

            <form onSubmit={handleSubmit} className="avatar-upload-form">
                <div className="file-input-container">
                    <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input"
                        disabled={loading}
                    />
                    <label htmlFor="avatar-upload" className="file-input-label">
                        {loading ? 'Загрузка...' : 'Выбрать фото'}
                    </label>
                </div>

                {previewUrl && (
                    <div className="image-preview">
                        <img src={previewUrl} />

                           <svg onClick={handleRemoveImage} xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
</svg>

                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {selectedFile && (
                    <button
                        type="submit"
                        disabled={loading}
                        className="upload-button"
                    >
                        {loading ? 'Загрузка...' : 'Загрузить фото'}
                    </button>
                )}
            </form>

            {loading && (
                <div className="loading-text">
                    Загрузка...
                </div>
            )}
        </div>
    );
};

export default ImagesUpload;
