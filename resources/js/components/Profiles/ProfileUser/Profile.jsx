import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../AvatarProfile/AvatarProfile';
import ProfileDetail from '../../../components/SettingsProfile/ModalDetail/ProfileDetail';
import { useGetProfileQuery } from '../../../api/modules/profileApi';
import ErrorProfile from '../../../UI/Profile/ErrorProfile';
const Profile = () => {
    const authUser = useSelector(state => state.user?.user);

    const {
        data: profileResponse,
        isLoading,
        error,
   
    } = useGetProfileQuery(authUser?.id, {
        skip: !authUser?.id,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    })



    const profile = profileResponse?.profile;
const getUserName = () => {
        return profile?.name 
            || authUser?.name 
            || 'Пользователь';
    };
    console.log("профиль", profile)

  const getRegistrationDate = () => {
        const dateSource = profile?.created_at;
        return dateSource
            ? new Date(dateSource).toLocaleDateString('ru-RU')
            : 'Не указана';
    };


    const isAnyLoading = isLoading;
    if (isAnyLoading) return (
        <div className="flex justify-center items-center min-h-[60vh] p-8 text-white">
            <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Загрузка...
            </div>
        </div>
    );

    if (error) {
        return <ErrorProfile  message="Ошибка профиля" />;
    }

    return (
        <div className="w-full mx-auto mt-4 mb-8 px-1 py-4 sm:p-9 md:p-9 rounded-2xl md:rounded-3xl bg-[rgba(1,14,24,0.946)] text-white shadow-xl">
            <div className="w-full flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 mb-8 pb-8 border-b border-white/10">

                <div className="w-full md:w-auto flex justify-center md:block">
                    <div className="relative inline-block">
                        <Avatar />
                        <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                </div>

                <div className="w-full flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 w-full">
                        {getUserName()}
                    </h1>

                    <div className="w-full max-w-md mx-auto md:mx-0">
                        <p className="text-base md:text-lg text-white/70 mb-4">
                            Дата регистрации: {getRegistrationDate()}
                        </p>
                        <strong className="text-gray-300 font-semibold min-w-20">О себе: </strong>
  <span className="text-gray-200 font-medium">
    {profile.bio || 'Не указан'}
  </span>

                        <div className="flex justify-center md:justify-start">
                            <ProfileDetail />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
