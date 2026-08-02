
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileForm } from '../../../hooks/SettingsProfile/useProfileForm';

const PersonalProfile = () => {
    const navigate = useNavigate();
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
        <div className="
            w-full
            max-w-96
            md:max-w-lg
            lg:max-w-2xl
            xl:max-w-3xl
            2xl:max-w-4xl
            mx-auto
            p-4
            sm:p-6
            md:p-8
            rounded-2xl
            md:rounded-3xl
            bg-[rgba(1,14,24,0.946)]
            min-h-screen
            my-4
            md:my-8
        ">
            <div className="flex items-center justify-center gap-3 py-20 text-white/70">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-lg">Загрузка профиля...</span>
            </div>
        </div>
    );

    return (
        <div className="
            w-full
            max-w-96
            md:max-w-lg
            lg:max-w-2xl
            xl:max-w-3xl
            2xl:max-w-4xl
            mx-auto
            p-4
            sm:p-6
            md:p-8
            rounded-2xl
            md:rounded-3xl
            bg-[rgba(1,14,24,0.946)]
            min-h-screen
            my-4
            md:my-8
        ">
            <button
                className="
                    mb-6
                    px-4
                    py-2
                    bg-white/10
                    hover:bg-white/20
                    backdrop-blur-sm
                    text-white
                    rounded-xl
                    transition-all
                    duration-200
                    flex
                    items-center
                    gap-2
                    hover:gap-3
                    active:scale-95
                "
                onClick={() => navigate(-1)}
            >
                ← Назад
            </button>

            <div className="text-center mb-8 md:mb-10 pb-6 border-b border-white/10">
                <h1 className="
                    text-3xl
                    md:text-4xl
                    font-light
                    text-white
                    mb-3
                    tracking-tight
                ">
                    Личная информация
                </h1>
                <p className="
                    text-white/80
                    text-base
                    md:text-lg
                    max-w-md
                    mx-auto
                ">
                    Управление вашими личными данными
                </p>
            </div>

            {localError && (
                <div className="
                    mb-6
                    p-4
                    bg-red-500/10
                    border-l-4
                    border-red-500
                    text-red-300
                    rounded-r-lg
                ">
                    {localError}
                </div>
            )}

            {successMessage && (
                <div className="
                    mb-6
                    p-4
                    bg-green-500/10
                    border-l-4
                    border-green-500
                    text-green-300
                    rounded-r-lg
                ">
                    {successMessage}
                </div>
            )}

            <div className="mt-5">
                {!isEditing ? (
                    <div className="space-y-6">
                        <div className="
                            bg-white/5
                            backdrop-blur-sm
                            p-6
                            md:p-8
                            rounded-2xl
                            border
                            border-white/10
                        ">
                            <div className="space-y-5">
                                <div className="
                                    flex
                                    flex-col
                                    sm:flex-row
                                    sm:justify-between
                                    sm:items-center
                                    py-4
                                    border-b
                                    border-white/10
                                    gap-2
                                ">
                                    <label className="
                                        font-semibold
                                        text-white/90
                                        text-base
                                    ">
                                        Имя пользователя:
                                    </label>
                                    <span className="
                                        text-white
                                        font-medium
                                        text-lg
                                    ">
                                        {profile?.name}
                                    </span>
                                </div>

                                <div className="
                                    flex
                                    flex-col
                                    sm:flex-row
                                    sm:justify-between
                                    sm:items-center
                                    py-4
                                    gap-2
                                ">
                                    <label className="
                                        font-semibold
                                        text-white/90
                                        text-base
                                    ">
                                        О себе:
                                    </label>
                                    <span className="
                                        text-white
                                        font-medium
                                        text-lg
                                        text-right
                                        max-w-md
                                    ">
                                        {profile?.bio || 'Не указано'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleEdit}
                            className="
                                w-full
                                md:w-auto
                                px-8
                                py-3.5
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                font-medium
                                rounded-xl
                                transition-all
                                duration-200
                                hover:shadow-lg
                                hover:shadow-blue-500/25
                                active:scale-95
                            "
                        >
                            Редактировать профиль
                        </button>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="
                            bg-white/5
                            backdrop-blur-sm
                            p-6
                            md:p-8
                            rounded-2xl
                            border
                            border-white/10
                        "
                    >
                        <div className="space-y-6">
                            <div>
                                <label className="
                                    block
                                    mb-2
                                    font-medium
                                    text-white
                                ">
                                    Имя пользователя *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        bg-white/10
                                        border
                                        border-white/20
                                        rounded-xl
                                        text-white
                                        placeholder-white/50
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                        focus:border-transparent
                                        transition-all
                                        duration-200
                                    "
                                    placeholder="Введите ваше имя"
                                    required
                                />
                            </div>

                            <div>
                                <label className="
                                    block
                                    mb-2
                                    font-medium
                                    text-white
                                ">
                                    О себе
                                </label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        bg-white/10
                                        border
                                        border-white/20
                                        rounded-xl
                                        text-white
                                        placeholder-white/50
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                        focus:border-transparent
                                        transition-all
                                        duration-200
                                        resize-y
                                        min-h-[120px]
                                    "
                                    placeholder="Расскажите о себе..."
                                />
                            </div>
                        </div>

                        <div className="
                            mt-8
                            flex
                            flex-col
                            sm:flex-row
                            gap-3
                        ">
                            <button
                                type="submit"
                                className="
                                    flex-1
                                    px-6
                                    py-3.5
                                    bg-blue-600
                                    hover:bg-blue-700
                                    disabled:bg-blue-800/50
                                    disabled:cursor-not-allowed
                                    text-white
                                    font-medium
                                    rounded-xl
                                    transition-all
                                    duration-200
                                    hover:shadow-lg
                                    hover:shadow-blue-500/25
                                    active:scale-95
                                    disabled:active:scale-100
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                "
                                disabled={!formData.name.trim() || isUpdating}
                            >
                                {isUpdating ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Сохранение...
                                    </>
                                ) : 'Сохранить изменения'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="
                                    flex-1
                                    px-6
                                    py-3.5
                                    bg-white/10
                                    hover:bg-white/20
                                    disabled:bg-white/5
                                    disabled:cursor-not-allowed
                                    text-white
                                    font-medium
                                    rounded-xl
                                    transition-all
                                    duration-200
                                    hover:shadow-lg
                                    active:scale-95
                                    disabled:active:scale-100
                                "
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