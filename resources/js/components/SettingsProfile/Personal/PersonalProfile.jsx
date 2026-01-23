import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile, updateProfile } from '../../../store/Profile';

const PersonalProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector(state => state.profile);
  const user = useSelector(state => state.user.user);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: ''
  });
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProfile(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (localError) setLocalError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');

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
        name: formData.name.trim(),
        email: formData.email.trim(),
        bio: formData.bio.trim()
      };

      const result = await dispatch(updateProfile(updateData));

      if (result) {
        setSuccessMessage('Профиль успешно обновлен');
        setIsEditing(false);
        dispatch(fetchProfile(user.id));
      }
    } catch (error) {
      setLocalError(error.response?.data?.message || 'Произошла ошибка при сохранении');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      bio: profile?.bio || ''
    });
    setIsEditing(false);
    setLocalError('');
    setSuccessMessage('');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setLocalError('');
    setSuccessMessage('');
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-white">Загрузка профиля...</div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center p-10">
      Ошибка: {error}
    </div>
  );

  if (!profile) return (
    <div className="text-white text-center p-10">
      Профиль не найден
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-gray-900 rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white">Личная информация</h1>
      </div>

      {localError && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 text-red-300 rounded-lg">
          {localError}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-900/30 border border-green-700 text-green-300 rounded-lg">
          {successMessage}
        </div>
      )}

      <div className="mt-5">
        {!isEditing ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <label className="font-semibold text-gray-300 min-w-[150px]">Имя пользователя:</label>
                <span className="text-gray-200 font-medium">{profile.name}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <label className="font-semibold text-gray-300 min-w-[150px]">Email:</label>
                <span className="text-gray-200 font-medium">{profile.email || 'Не указан'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <label className="font-semibold text-gray-300 min-w-[150px]">О себе:</label>
                <span className="text-gray-200 font-medium">{profile.bio || 'Не указан'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <label className="font-semibold text-gray-300 min-w-[150px]">Дата регистрации:</label>
                <span className="text-gray-200 font-medium">
                  {profile.created_at ? new Date(profile.created_at).toLocaleDateString('ru-RU') : 'Не указана'}
                </span>
              </div>
            </div>

            <button
              onClick={handleEdit}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Редактировать профиль
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="flex flex-col space-y-2">
                <label htmlFor="name" className="font-semibold text-gray-300">
                  Имя пользователя *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите ваше имя"
                  required
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="email" className="font-semibold text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите ваш email"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="bio" className="font-semibold text-gray-300">
                  О себе
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                  placeholder="Информация о себе"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!formData.name.trim()}
              >
                Сохранить изменения
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-lg transition-colors duration-200"
              >
                Отмена
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PersonalProfile;