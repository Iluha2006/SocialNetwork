import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import './Avatar.css';

const Avatar = () => {
    const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23e0e0e0%22/%3E%3Ctext x=%2250%22 y=%2258%22 text-anchor=%22middle%22 font-size=%2240%22 fill=%22%23999%22%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E';
    const [avatarUrl, setAvatarUrl] = useState(defaultAvatar);
    const [uploadLoading, setUploadLoading] = useState(false);
    const fileInputRef = useRef(null);

    const dispatch = useDispatch();
    const { user, profile, token } = useSelector(state => state.user);

    useEffect(() => {
        const savedAvatar = localStorage.getItem(`user_avatar_${user?.id}`);
        if (savedAvatar) {
            setAvatarUrl(savedAvatar);
        } else if (profile?.avatar) {
            setAvatarUrl(profile.avatar);
            localStorage.setItem(`user_avatar_${user?.id}`, profile.avatar);
        } else {
            setAvatarUrl(defaultAvatar);
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
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (response.data.success) {
                setAvatarUrl(response.data.avatar);
                localStorage.setItem(`user_avatar_${user?.id}`, response.data.avatar);
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
                        if (e.target.src === defaultAvatar) return;
                        console.error('Error loading avatar, setting default');
                        e.target.src = defaultAvatar;
                    }}
                />
                {uploadLoading && <div className="upload-overlay">Загрузка...</div>}
            </div>
        </div>
    );
};

export default Avatar;