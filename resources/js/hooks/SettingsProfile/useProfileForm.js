import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../api/modules/profileApi';
import { setProfile } from '../../store/settings/Profile';
import { validateProfile } from '../../utils/validators/profile';

export const useProfileForm = () => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user?.user?.id);

  const { data: profileData, isLoading: isQueryLoading, refetch } = useGetProfileQuery(userId, {
    skip: !userId,
  });

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', bio: '' });
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({ status: 'idle', message: '' });

  const profile = profileData?.profile;


  useEffect(() => {
    if (profile && !isEditing) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || ''
      });
    }
  }, [profile, isEditing]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
   
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!userId) return;

    const trimmed = {
      name: formData.name.trim(),
      bio: formData.bio.trim()
    };

    const validationErrors = validateProfile(trimmed);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFeedback({ status: 'error', message: 'Проверьте правильность заполнения полей' });
      return;
    }

    try {
      const result = await updateProfile({ userId, ...trimmed }).unwrap();
      dispatch(setProfile(result));
      setFeedback({ status: 'success', message: 'Профиль успешно обновлен' });
      setIsEditing(false);
    } catch (err) {
      setFeedback({ 
        status: 'error', 
        message: err?.data?.message || 'Ошибка сервера. Попробуйте позже' 
      });
    }
  }, [userId, formData, updateProfile, dispatch]);

  const handleCancel = useCallback(() => {
    setFormData({ name: profile?.name || '', bio: profile?.bio || '' });
    setIsEditing(false);
    setErrors({});
    setFeedback({ status: 'idle', message: '' });
  }, [profile]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setErrors({});
    setFeedback({ status: 'idle', message: '' });
  }, []);

  return {
    profile,
    formData,
    errors,
    feedback,
    isEditing,
    isLoading: isQueryLoading || isUpdating,
    handleInputChange,
    handleSubmit,
    handleCancel,
    handleEdit,
    refetch,
  };
};