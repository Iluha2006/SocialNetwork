
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


import { useProfilePrivacy } from '../../../hooks/SettingsProfile/useProfilePrivacy';
import { useFriendshipStatus } from '../../../hooks/SettingsProfile/useFriendshipStatus';

import BlockedView from '../../../UI/States/UserProfile/BlockedView';

import ErrorMessage from '../../../UI/States/UserProfile/ErrorMessage';

import LoadingSpinner from '../../../UI/States/UserProfile/LoadingSpinner';

import NotFoundMessage from '../../../UI/States/UserProfile/NotFoundMessage';
import PrivateProfileView from '../../../UI/States/UserProfile/PrivateProfileView';

import UserImages from './UserImages';
import { useGetProfileQuery, useBlockUserMutation, useUnblockUserMutation } from '../../../api/modules/profileApi';
import { setViewedProfile, setIsBlocked, setHasBlockedThisUser } from '../../../store/settings/Profile';
import ProfileDetail from '../../SettingsProfile/ModalDetail/ProfileDetail';
import FriendButton from '../../../UI/Button/UserProfile/FriendButton';
import MessageButton from '../../../UI/Button/UserProfile/MessageButton';
import BlockButton from '../../../UI/Button/UserProfile/BlockButton';

const UserProfile = () => {
    const navigate = useNavigate();
    const { userId } = useParams();

    const currentUser = useSelector(state => state.user.user);
    const { onlineUsers } = useSelector(state => state.online);




    const {
         data: profileResponse, 
        isLoading: isProfileLoading,
        error: profileError,
        refetch: refetchProfile
    } = useGetProfileQuery(userId, {
        skip: !userId,
        
    });
  
     const profile = profileResponse?.profile;
    const isBlocked = profile?.is_blocked || false;
    const hasBlockedThisUser = profile?.has_blocked_this_user || false;

const getUserId = () => {
    return profile?.id 
        || profileResponse?.data?.id 
        || profileResponse?.id;
};
    const {
        privacyInfo,
        isLoading: isPrivacyLoading,
        error: privacyError,
        refetch: refetchPrivacy
    } = useProfilePrivacy(userId);
    const { friends } = useSelector(state => state.friends);
    const {
        friendshipStatus,
        isLoading: isFriendshipLoading,
        error: friendshipError,
        sendRequest,
        checkStatus: refetchFriendship
    } = useFriendshipStatus(profile || currentUser, currentUser);

    const totalFriends = friends?.length || 0;
    const [blockUserMutation] = useBlockUserMutation();
    const [unblockUserMutation] = useUnblockUserMutation();

    const isLoading = isProfileLoading || isPrivacyLoading || isFriendshipLoading;





   const handleBlockToggle = async () => {
    if (!profile?.user_id || !currentUser) return;

    try {
        if (!hasBlockedThisUser) {
            
            await blockUserMutation(profile.id).unwrap();
        } else {
           
            await unblockUserMutation(profile.id).unwrap();
        }
        refetchProfile();
        refetchPrivacy();
    } catch (err) {
        console.error('Block toggle error:', err);
        
    }
};

    const handleAddFriend = async () => {
        if (friendshipStatus !== 'not_friends') return;

        const result = await sendRequest();

        if (!result.success) {
            console.error(result.error || 'Произошла ошибка');
        }
    };



    const handleViewProfile = (friendId) => {
        navigate(`/profile/${friendId}`);
    };

    const handleViewAllFriends = () => {
        navigate(`/friends/${userId}`);
    };


    if (isLoading) {
        return <LoadingSpinner text="Загрузка профиля" />;
    }

if (profileError) {
    return (
        <ErrorMessage
            message={profileError?.data?.message || profileError?.message || privacyError || friendshipError || 'Ошибка загрузки профиля'}
            onRetry={() => {
                refetchProfile();
                refetchPrivacy();
                refetchFriendship();
            }}
        />
    );
}

    if (!profile) {
        return <NotFoundMessage onBack={() => navigate('/')} />;
    }

    if (isBlocked) {
        return <BlockedView />;
    }


    if (!privacyInfo.canViewProfile) {
        return (
            <PrivateProfileView
                message={privacyInfo.message}
                visibility={privacyInfo.profileVisibility}
            />
        );
    }
    return (
        <div className="flex flex-col lg:flex-row gap-5 max-w-7xl mx-auto px-1 py-5 md:px-5 min-h-screen box-border">

            <div className="flex-1 min-w-0">
                <div className="rounded-xl p-4 mb-5 shadow-lg " style={{ backgroundColor: 'rgba(1, 14, 24, 0.946)' }}>



                    <div className="flex flex-col md:flex-row p-6 md:p-8 gap-6 md:gap-8 border-b border-gray-700 relative">

                        <div className="flex justify-center md:justify-start relative">
                            <img
                                src={profile?.avatar || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23e0e0e0%22/%3E%3Ctext x=%2250%22 y=%2258%22 text-anchor=%22middle%22 font-size=%2240%22 fill=%22%23999%22%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E'}
                                className="w-48 h-48 md:w-52 md:h-52 lg:w-56 lg:h-56 rounded-full object-cover border-4 border-white shadow-lg ring-3 ring-blue-500"
                                alt="Аватар профиля"
                            />
                            {onlineUsers.some(u => u.id === parseInt(userId) && u.online_status === 'online') && (
                                <span className="absolute bottom-4 right-4 w-5 h-5 bg-green-500 border-3 border-[rgba(1,14,24,0.946)] rounded-full"></span>
                            )}
                        </div>


                        <div className="flex flex-col gap-3 mt-5 items-center md:items-start w-full md:w-auto">
                            {profile && (
                             <>
                             <FriendButton
                                 friendshipStatus={friendshipStatus}
                                 isLoading={isFriendshipLoading}
                                 disabled={['friends', 'request_sent', 'request_received'].includes(friendshipStatus)}
                                 onClick={handleAddFriend}
                                 className="w-full"
                             />

                             <MessageButton
                                 recipientId={getUserId()}
                                 recipientName={profile.name}
                                 disabled={false}
                                 className="w-full"
                             />

                             <BlockButton
                                 isBlocked={hasBlockedThisUser}
                                 disabled={false}
                                 onClick={handleBlockToggle}
                                 className="w-full"
                             />
                         </>
                            )}
                            <ProfileDetail userId={ getUserId () } />
                        </div>



    <div className="flex-1 mt-3 text-center md:text-left">
        <h3 className="text-xl font-semibold text-white mb-4">Информация об аккаунте</h3>
        <div className="space-y-2">
            <div className="flex items-center text-lg text-white">
                <strong className="text-gray-300 font-medium min-w-32">ID пользователя:</strong>
            { getUserId( )}
            </div>
            <div className="flex items-center text-lg text-white">
                <strong className="text-white font-semibold text-xl min-w-32">
                    {profile.name}
                </strong>
            </div>
            <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${onlineUsers.some(u => u.id === parseInt(userId) && u.online_status === 'online') ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span className={`text-sm ${onlineUsers.some(u => u.id === parseInt(userId) && u.online_status === 'online') ? 'text-green-400' : 'text-gray-400'}`}>
                    {onlineUsers.some(u => u.id === parseInt(userId) && u.online_status === 'online') ? 'В сети' : 'Не в сети'}
                </span>
            </div>

        </div>
    </div>

                    </div>
                </div>
                {privacyInfo.canViewImages ? (
                    <div className="p-2 md:p-5">
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
                                        src={friend.avatar || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23e0e0e0%22/%3E%3Ctext x=%2250%22 y=%2258%22 text-anchor=%22middle%22 font-size=%2240%22 fill=%22%23999%22%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E'}
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