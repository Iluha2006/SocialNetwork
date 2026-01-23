import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../../../store/Profile';
import Avatar from '../AvatarProfile/AvatarProfile';
import ProfileDetail from '../../../components/SettingsProfile/ModalDetail/ProfileDetail';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const profile = useSelector(state => state.profile.profile);
  const loading = useSelector(state => state.profile.loading);
  const error = useSelector(state => state.profile.error);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated && user && user.id) {
      dispatch(fetchProfile(user.id));
    }
  }, [dispatch, user, isAuthenticated]);

  if (loading) return (
    <div className="
      flex
      justify-center
      items-center
      min-h-[60vh]
      p-8
      text-white
    ">
      <div className="
        flex
        items-center
        gap-3
      ">
        <div className="
          w-6
          h-6
          border-2
          border-white/30
          border-t-white
          rounded-full
          animate-spin
        "></div>
        Загрузка...
      </div>
    </div>
  );

  if (error) return (
    <div className="
      flex
      justify-center
      items-center
      min-h-[60vh]
      p-8
      text-red-400
    ">
      Ошибка: {error}
    </div>
  );

  return (
    <div className="
      w-full
      max-w-4xl
      mx-auto
      mt-4
      mb-8
      p-4
      sm:p-6
      md:p-8
      rounded-2xl
      md:rounded-3xl
      bg-[rgba(1,14,24,0.946)]
      text-white
      shadow-xl
    ">
      <div className="
        w-full
        flex
        flex-col
        md:flex-row
        items-center
        md:items-start
        gap-6
        md:gap-8
        mb-8
        pb-8
        border-b
        border-white/10
      ">
        {/* Аватар */}
        <div className="
          w-full
          md:w-auto
          flex
          justify-center
          md:block
        ">
          <Avatar />
        </div>

        {/* Информация профиля */}
        <div className="
          w-full
          flex-1
          flex
          flex-col
          items-center
          md:items-start
          text-center
          md:text-left
        ">
          <h1 className="
            text-2xl
            sm:text-3xl
            md:text-4xl
            font-bold
            text-white
            mb-4
            w-full
          ">
            {profile?.name }
          </h1>

          <div className="
            w-full
            max-w-md
            mx-auto
            md:mx-0
          ">
            <p className="
              text-base
              md:text-lg
              text-white/70
              mb-4
            ">
              Дата регистрации: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('ru-RU') : 'Не указана'}
            </p>

            <div className="
              flex
              justify-center
              md:justify-start
            ">
              <ProfileDetaiil />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;