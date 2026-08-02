import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { normalizeMediaUrl, DEFAULT_AVATAR } from '../../../utils/mediaUrl';
import './Avatar.css';

const Avatar = () => {
    const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);
    const [uploadLoading, setUploadLoading] = useState(false);
    const fileInputRef = useRef(null);

    const dispatch = useDispatch();
    const { user, profile, token } = useSelector(state => state.user);

    useEffect(() => {
        const savedAvatar = localStorage.getItem(`user_avatar_${user?.id}`);
        const savedUrl = savedAvatar ? normalizeMediaUrl(savedAvatar) : null;
        if (savedUrl && !savedUrl.startsWith('data:') && savedUrl !== savedAvatar) {
            localStorage.setItem(`user_avatar_${user?.id}`, savedUrl);
        }
        if (savedUrl) {
            setAvatarUrl(savedUrl);
        } else if (profile?.avatar) {
            const normalized = normalizeMediaUrl(profile.avatar);
            setAvatarUrl(normalized);
            localStorage.setItem(`user_avatar_${user?.id}`, normalized);
        } else {
            setAvatarUrl(DEFAULT_AVATAR);
        }
    }, [profile, user?.id]);

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            alert('Пожалуйста, выберите изображение!');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Файл слишком большой! Максимальный размер 5MB.');
            return;
        }

        setUploadLoading(true);

        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await axios.post('/profile/avatar', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true
            });

            if (response.data.success) {
                const normalized = normalizeMediaUrl(response.data.avatar);
                setAvatarUrl(normalized);
                localStorage.setItem(`user_avatar_${user?.id}`, normalized);
            }
        } catch (err) {
            alert('Ошибка при загрузке аватарки');
        } finally {
            setUploadLoading(false);
        }
    };

    return (
        <div className="avatar-upload">
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                disabled={uploadLoading}
            />
            <div className="avatar-preview" onClick={triggerFileInput}>
                <img
                    src={avatarUrl}
                    alt="Аватар"
                    className="preview-image"
                    onError={(e) => {
                        if (e.target.src === DEFAULT_AVATAR) return;
                        console.error('Error loading avatar, setting default');
                        e.target.src = DEFAULT_AVATAR;
                    }}
                />
                {uploadLoading && <div className="upload-overlay">Загрузка...</div>}
            </div>
        </div>
    );
};

export default Avatar;