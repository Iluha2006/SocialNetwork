import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts } from '../../../store/settings/ContactUsers';
import { fetchCarers } from '../../../store/settings/Carer';
import { useGetProfileQuery } from '../../../api/modules/profileApi';
const ProfileDetail = (props) => {
  const { userId } = props;
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const profileFromSlice = useSelector(state => state.profile.profile);
  const { contact, loading, error } = useSelector(state => state.contacts);
  const { carers=[], loading: carersLoading, error: carersError } = useSelector(state => state.carers);
  const [modalOpen, setModalOpen] = useState(false);
  const profileBio = profileFromSlice?.bio;
  const targetUserId = userId || user?.id;
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileQueryError,
    refetch
  } = useGetProfileQuery(userId || user?.id, {
    skip: !(userId || user?.id),
    refetchOnMountOrArgChange: true,
  });
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  useEffect(() => {
    if (targetUserId) {
      dispatch(fetchContacts(targetUserId));
      dispatch(fetchCarers(targetUserId));

    }
  }, [dispatch, targetUserId]);

  if (error) return <div className="text-red-500 p-4">Ошибка: {error}</div>;

  const hasContacts = contact && contact.length > 0;
  const userContacts = hasContacts ? contact[0] : null;
  const hasCarers = carers && carers.length > 0;

  return (
    <div className="relative">
      <button
        onClick={toggleModal}
        className="text-blue-500 hover:text-blue-600 cursor-pointer text-sm mt-3.5 mr-35 bg-transparent border-none"
      >
        Подробнее
      </button>

      {modalOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50 p-5"
          onClick={toggleModal}
        >
          <div
            className="bg-gray-900 rounded-xl w-full max-w-2xl shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Личная информация</h2>
              <button
                className="text-gray-400 hover:text-white hover:bg-gray-700 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                onClick={toggleModal}
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Контактная информация</h3>
                {hasContacts ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-800">
                      <strong className="text-gray-300 font-semibold min-w-20">Город:</strong>
                      <span className="text-gray-200 font-medium">{userContacts.city || 'Не указан'}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-800">
                      <strong className="text-gray-300 font-semibold min-w-20">Телефон:</strong>
                      <span className="text-gray-200 font-medium">{userContacts.phone || 'Не указан'}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-800">
  <strong className="text-gray-300 font-semibold min-w-20">О себе</strong>
  <span className="text-gray-200 font-medium">
    {profileBio || userContacts?.bio || 'Не указан'}
  </span>
</div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>Контактная информация не заполнена</p>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Опыт работы</h3>

                {carersLoading ? (
                  <div className="flex items-center justify-center py-8 space-x-3">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-300">Загрузка опыта работы...</span>
                  </div>
                ) : carersError ? (
                  <div className="text-red-400 p-4 bg-red-900/20 rounded-lg">
                    Ошибка: {carersError}
                  </div>
                ) : hasCarers ? (
                  <div className="space-y-6">
                    {carers.map((carer, index) => (
                      <div key={carer.id || index} className="space-y-4">
                        <div className="space-y-3">
                          {carer.place_work && (
                            <div className="space-y-1">
                              <strong className="text-gray-300 font-semibold block">Место работы</strong>
                              <span className="text-gray-200 text-lg font-medium">{carer.place_work}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3 pl-4 border-l-2 border-gray-700">
                          {carer.position && (
                            <div className="space-y-1">
                              <strong className="text-gray-300 font-semibold block">Должность</strong>
                              <p className="text-gray-200">{carer.position || 'Должность не указана'}</p>
                            </div>
                          )}

                          {carer.work_experience && (
                            <div className="space-y-1">
                              <strong className="text-gray-300 font-semibold block">Опыт и обязанности:</strong>
                              <p className="text-gray-200">{carer.work_experience}</p>
                            </div>
                          )}

                          {carer.skills_work && (
                            <div className="space-y-1">
                              <strong className="text-gray-300 font-semibold block">Ключевые навыки:</strong>
                              <p className="text-gray-200">{carer.skills_work}</p>
                            </div>
                          )}
                        </div>

                        {index < carers.length - 1 && (
                          <hr className="border-gray-700 my-4" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>Информация об опыте работы не заполнена</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetail;
