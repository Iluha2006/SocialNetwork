
import React from 'react';
import { useProfileForm } from '../../../hooks/SettingsProfile/useProfileForm';

const PersonalProfile = () => {
    const {
        profile,
        formData,
        user,
        isEditing,
        isLoading,
        isUpdating,
        localError,
        successMessage,
        handleInputChange,
        handleSubmit,
        handleCancel,
        handleEdit
    } = useProfileForm();

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="text-white">Загрузка профиля...</div>
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
                                <span className="text-gray-200 font-medium">{user?.name}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-700">
                                <label className="font-semibold text-gray-300 min-w-[150px]">Email:</label>
                                <span className="text-gray-200 font-medium">{user?.email}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-700">
                                <label className="font-semibold text-gray-300 min-w-[150px]">О себе:</label>
                                <span className="text-gray-200 font-medium">{user?.bio || 'Не указано'}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-700">
                                <label className="font-semibold text-gray-300 min-w-[150px]">Дата регистрации:</label>
                                <span className="text-gray-200 font-medium">
                                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('ru-RU') : 'Не указана'}
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
                                disabled={!formData.name.trim() || isUpdating}
                            >
                                {isUpdating ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Сохранение...
                                    </span>
                                ) : 'Сохранить изменения'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-lg transition-colors duration-200"
                                disabled={isUpdating}
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