import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    checkProfilePrivacy,
    checkFriendsPrivacy,
    checkImagesPrivacy
} from '../../../store/PrivateProfile';
import UserImages from './UserImages';

import { fetchProfile, unblockUser, blockUser } from '../../../store/Profile';
import { sendFriendRequest, fetchFriendRequests, fetchFriends, checkAndSetFriendshipStatus } from '../../../store/FriendList';
import ProfileDetail from '../../SettingsProfile/ModalDetail/ProfileDetail';

const UserProfile = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const dispatch = useDispatch();

    const currentUser = useSelector(state => state.user.user);


    const { viewedProfile, loading, error, isBlocked, hasBlockedThisUser } = useSelector(state => state.profile);
    const { friends, friendsLoading, outgoingRequests } = useSelector(state => state.friends);

    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState('');
    const [friendshipStatus, setFriendshipStatus] = useState('not_friends');

    const profile = viewedProfile;

    const [privacyInfo, setPrivacyInfo] = useState({
        canViewProfile: true,
        canViewFriends: true,
        canViewImages: true,
    });

    useEffect(() => {
        if (userId && !isNaN(parseInt(userId))) {
            const fetchData = async () => {

                const privacyResult = await dispatch(checkProfilePrivacy(parseInt(userId)));
                console.log('Profile privacy result:', privacyResult);


                if (!privacyResult.success) {
                    setPrivacyInfo({
                        canViewProfile: false,
                        canViewFriends: false,
                        canViewImages: false,
                        message: privacyResult.message,
                        profileVisibility: privacyResult.profile_visibility
                    });
                    return;
                }


                dispatch(fetchProfile(parseInt(userId)));


                const friendsPrivacy = await dispatch(checkFriendsPrivacy(parseInt(userId)));
                console.log('Friends privacy result:', friendsPrivacy);

                if (friendsPrivacy.success === false) {
                    setPrivacyInfo(prev => ({
                        ...prev,
                        canViewFriends: false,
                        friendsVisible: friendsPrivacy.friends_visible
                    }));
                } else {
                    dispatch(fetchFriends(parseInt(userId)));
                    setPrivacyInfo(prev => ({
                        ...prev,
                        canViewFriends: true
                    }));
                }


                const imagesPrivacy = await dispatch(checkImagesPrivacy(parseInt(userId)));
                console.log('Images privacy result:', imagesPrivacy);

                setPrivacyInfo(prev => ({
                    ...prev,
                    canViewImages: imagesPrivacy.success !== false
                }));
            };

            fetchData();
        }
    }, [dispatch, userId]);






    useEffect(() => {
        if (profile && currentUser) {
            const outgoingRequest = outgoingRequests.find(r =>
                r.receiver_id === profile.user_id && r.status === 'pending'
            );

            if (outgoingRequest) {
                setFriendshipStatus('request_sent');
            } else {
                dispatch(checkAndSetFriendshipStatus(currentUser.id, profile.user_id))
                    .then(result => {
                        if (result.success) {
                            setFriendshipStatus(result.status);
                        }
                    });
            }
        }
    }, [profile, currentUser, outgoingRequests, dispatch]);

    const totalFriends = friends.length;

    const handleBlockToggle = async () => {
        if (!profile || !currentUser) return;

        try {
            if (!hasBlockedThisUser) {


                await dispatch(blockUser(profile.user_id));

            }
            else {
                await dispatch(unblockUser(profile.user_id));

            }
        } catch (err) {
            setLocalError('Не удалось изменить статус блокировки');
        }
    };


    const handleAddFriend = async () => {
        if (profile && currentUser && friendshipStatus === 'not_friends') {
            setIsLoading(true);
            setLocalError('');
            try {
                const result = await dispatch(sendFriendRequest({
                    sender_id: currentUser.id,
                    receiver_id: profile.user_id
                }));

                if (result.success) {
                    setFriendshipStatus('request_sent');
                    dispatch(fetchFriendRequests(currentUser.id));
                } else {
                    setLocalError(result.error);
                }
            } catch (error) {
                console.error('Ошибка:', error);
                setLocalError('Произошла непредвиденная ошибка');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleMessage = () => {
        if (profile) {
            navigate(`/messages/${profile.user_id}`);
        }
    };

    const handleViewProfile = (friendId) => {
        navigate(`/profile/${friendId}`);
    };

    const handleViewAllFriends = () => {
        navigate(`/friends/${userId}`);
    };

    const getFriendButtonText = () => {
        switch (friendshipStatus) {
            case 'friends':
                return 'В друзьях';
            case 'request_sent':
                return 'Заявка отправлена';
            case 'request_received':
                return 'Ответить на заявку';
            case 'not_friends':
            default:
                return 'Добавить в друзья';
        }
    };

    const isFriendButtonDisabled = () => {
        return friendshipStatus === 'friends' ||
            friendshipStatus === 'request_sent' ||
            friendshipStatus === 'request_received' ||
            isLoading;
    };



    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-white">Загрузка профиля...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-5">
                <div className="bg-red-900 bg-opacity-20 border-l-4 border-red-500 text-red-300 p-4 rounded">
                    <p className="font-semibold">Ошибка:</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="max-w-7xl mx-auto p-5">
                <div className="text-center py-10">
                    <p className="text-white text-xl">Профиль не найден</p>
                </div>
            </div>
        );
    }
    if (isBlocked) {

        return (
            <div className="max-w-2xl mx-auto p-8 mt-10 text-center">
                <div className="bg-gray-800 rounded-xl p-8 border border-red-500/30">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-24 w-24 mx-auto text-red-500 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-white mb-3">Доступ ограничен</h2>
                    <p className="text-gray-400">
                        Вы не можете просматривать этот профиль, так как владелец ограничил вам доступ.
                    </p>
                </div>
            </div>
        );
    }


    if (totalFriends === 0) {
        <div className="text-center py-8 text-gray-500">
            <svg
                className="w-12 h-12 mx-auto text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
            <p>Пока нет друзей</p>
        </div>
    }

    if (!privacyInfo.canViewProfile) {
        return (
            <div className="max-w-2xl mx-auto p-8 mt-10 text-center">
                <div className="bg-gray-800 rounded-xl p-8 border border-yellow-500/30">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-24 w-24 mx-auto text-yellow-500 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-white mb-3">Профиль скрыт</h2>
                    <p className="text-gray-400">
                        {privacyInfo.message}
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-col lg:flex-row gap-5 max-w-7xl mx-auto p-5 min-h-screen box-border">

            <div className="flex-1 min-w-0">
                <div className="rounded-xl p-4 mb-5 shadow-lg " style={{ backgroundColor: 'rgba(1, 14, 24, 0.946)' }}>

                    {localError && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-5 rounded">
                            {localError}
                        </div>
                    )}


                    <div className="flex flex-col md:flex-row p-8 gap-8 border-b border-gray-700 relative">

                        <div className="flex-1">
                            <img
                                src={profile?.avatar || 'https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13'}
                                className="w-36 h-36 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg ring-3 ring-blue-500"
                                alt="Аватар профиля"
                            />
                        </div>


                        <div className="flex flex-col gap-3 mt-5">
                            {currentUser && profile && currentUser.id !== profile.user_id && (
                                <>
                                    <button
                                        className={`px-5 py-2.5 border-none rounded-lg text-sm font-medium cursor-pointer transition-all min-w-40 disabled:opacity-60 disabled:cursor-not-allowed ${friendshipStatus === 'friends'
                                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                                : friendshipStatus === 'pending'
                                                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                                    : friendshipStatus === 'received'
                                                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                            }`}
                                        onClick={handleAddFriend}
                                        disabled={isFriendButtonDisabled()}
                                    >
                                        {getFriendButtonText()}
                                    </button>

                                    <button
                                        onClick={handleMessage}
                                        className="px-5 py-2.5 bg-gray-200 text-gray-700 border-none rounded-lg text-sm font-medium cursor-pointer transition-all min-w-40 hover:bg-gray-300"
                                    >
                                        Сообщение
                                    </button>


                                    <button
                                        onClick={handleBlockToggle}
                                        className={`px-5 py-2.5 border-none rounded-lg text-sm font-medium cursor-pointer transition-all min-w-40 ${hasBlockedThisUser
                                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                                : 'bg-gray-500 hover:bg-gray-600 text-white'
                                            }`}
                                    >
                                        {hasBlockedThisUser ? 'Разблокировать' : 'Заблокировать'}
                                    </button>
                                </>
                            )}
                            <ProfileDetail userId={profile?.user_id} />
                        </div>


                        {profile?.user && (
                            <div className="flex-1 mt-3">
                                <h3 className="text-xl font-semibold text-white mb-4">Информация об аккаунте</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center text-lg text-white">
                                        <strong className="text-gray-300 font-medium min-w-32">ID пользователя:</strong>
                                        {profile.user.id}
                                    </div>
                                    <div className="flex items-center text-lg text-white">
                                        <strong className="text-white font-semibold text-xl min-w-32">{profile.user.name}</strong>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {privacyInfo.canViewImages ? (
                    <div className="p-5">
                        <UserImages userId={parseInt(userId)} />
                    </div>
                ) : (
                    <div className="p-5 text-center">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-400">Владелец профиля скрыл фотографии</p>
                        </div>
                    </div>
                )}

            </div>

            <div className="w-full lg:w-80 ">
                <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: 'rgba(1, 14, 24, 0.946)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-white m-0">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                className="bi bi-people-fill text-blue-500"
                                viewBox="0 0 16 16"
                            >
                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                            </svg>
                            Друзья
                        </h3>
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {totalFriends}
                        </span>
                    </div>


                    {privacyInfo.canViewFriends ? (

                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {friends.slice(0, 9).map(friend => (
                                <div
                                    key={friend.id}
                                    className="flex flex-col items-center cursor-pointer text-center transition-transform hover:-translate-y-1"
                                    onClick={() => handleViewProfile(friend.user_id || friend.id)}
                                    title={friend.name}
                                >
                                    <img
                                        src={friend.avatar || 'https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13'}
                                        alt={friend.name}
                                        className="w-16 h-16 md:w-18 md:h-18 rounded-full object-cover border-2 border-gray-200 mb-1.5"
                                    />
                                    <span className="text-xs text-blue-700 font-medium leading-tight max-w-16 truncate">
                                        {friend.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) :

                        (
                            <div className="text-center py-8 text-gray-500">
                                <svg
                                    className="w-12 h-12 mx-auto text-gray-400 mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                <p>Список друзей скрыт</p>
                            </div>
                        )}



                    {totalFriends > 9 && (
                        <button
                            className="w-full py-2.5 border-none rounded-lg bg-gray-100 text-gray-600 text-sm cursor-pointer transition-colors hover:bg-gray-200"
                            onClick={handleViewAllFriends}
                        >
                            Показать всех друзей ({totalFriends})
                        </button>
                    )}


                </div>
            </div>
        </div>

    );
};

export default UserProfile;