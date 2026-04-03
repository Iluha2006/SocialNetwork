
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    useGetProfileQuery,
    useUpdateProfileMutation
} from '../../api/modules/profileApi';
import { setProfile } from '../../store/settings/Profile';

export const useProfileForm = () => {
    const dispatch = useDispatch();


    const user = useSelector(state => state.user?.user);
    const profileFromSlice = useSelector(state => state.profile?.profile);

    const {
        data: profileData,
        isLoading: isQueryLoading,
        isError: isQueryError,
        error: queryError,
        refetch
    } = useGetProfileQuery(user?.id, {
        skip: !user?.id,
        refetchOnMountOrArgChange: true,
    });

    const [updateProfileMutation, {
        isLoading: isUpdating,
        isError: isUpdateError,
        error: updateError
    }] = useUpdateProfileMutation();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: ''
    });
    const [localError, setLocalError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const profile = profileData || profileFromSlice;
    const isLoading = isQueryLoading;


    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                email: profile.email || '',
                bio: profile.bio || ''
            });
        }
    }, [profile]);

    useEffect(() => {
        if (isQueryError) {
            setLocalError(queryError?.data?.message || 'Ошибка загрузки профиля');
        }
    }, [isQueryError, queryError]);

    useEffect(() => {
        if (isUpdateError) {
            setLocalError(updateError?.data?.message || 'Ошибка при сохранении');
        }
    }, [isUpdateError, updateError]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        clearMessages();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearMessages();

        if (!formData.name.trim()) {
            setLocalError('Имя обязательно для заполнения');
            return;
        }

        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            setLocalError('Введите корректный email адрес');
            return;
        }

        try {
            const updateData = {
                userId: user?.id,
                name: formData.name.trim(),
                email: formData.email.trim(),
                bio: formData.bio.trim()
            };

            const result = await updateProfileMutation(updateData).unwrap();

            setSuccessMessage('Профиль успешно обновлен');
            setIsEditing(false);

            if (result) {
                dispatch(setProfile(result));
            }

            return { success: true, data: result };

        } catch (error) {
            console.error('Update error:', error);
            const errorMessage = error?.data?.message || 'Произошла ошибка при сохранении, попробуйте позже';
            setLocalError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const handleCancel = () => {
        setFormData({
            name: profile?.name || '',
            email: profile?.email || '',
            bio: profile?.bio || ''
        });
        setIsEditing(false);
        clearMessages();
    };

    const handleEdit = () => {
        setIsEditing(true);
        clearMessages();
    };

    const clearMessages = () => {
        setLocalError('');
        setSuccessMessage('');
    };

    const refetchProfile = () => {
        if (user?.id) {
            refetch();
        }
    };

    return {

        profile,
        formData,
        isEditing,
        isLoading,
        isUpdating,
        localError,
        successMessage,
        user,

        // Статусы
        isQueryError,
        isUpdateError,

        // Методы
        handleInputChange,
        handleSubmit,
        handleCancel,
        handleEdit,
        refetchProfile,
        clearMessages,

        setIsEditing,
        setFormData,
        setLocalError,
        setSuccessMessage,
    };
};