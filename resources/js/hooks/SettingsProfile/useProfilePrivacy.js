// hooks/useProfilePrivacy.js
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    checkProfilePrivacy,
    checkFriendsPrivacy,
    checkImagesPrivacy
} from '../../store/settings/PrivateProfile';
import { fetchFriends } from '../../store/Friends/FriendList';

export const useProfilePrivacy = (userId) => {
    const dispatch = useDispatch();
    const { friends } = useSelector(state => state.friends);

    const [privacyInfo, setPrivacyInfo] = useState({
        canViewProfile: true,
        canViewFriends: true,
        canViewImages: true,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPrivacyData = useCallback(async () => {
        if (!userId || isNaN(parseInt(userId))) return;

        setIsLoading(true);
        setError(null);

        try {

            const privacyResult = await dispatch(checkProfilePrivacy(parseInt(userId)));

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


            const friendsPrivacy = await dispatch(checkFriendsPrivacy(parseInt(userId)));
            if (friendsPrivacy.success === false) {
                setPrivacyInfo(prev => ({
                    ...prev,
                    canViewFriends: false,
                    friendsVisible: friendsPrivacy.friends_visible
                }));
            } else {
                dispatch(fetchFriends(parseInt(userId)));
                setPrivacyInfo(prev => ({ ...prev, canViewFriends: true }));
            }

            const imagesPrivacy = await dispatch(checkImagesPrivacy(parseInt(userId)));
            setPrivacyInfo(prev => ({
                ...prev,
                canViewImages: imagesPrivacy.success !== false
            }));

        } catch (err) {
            console.error('Error fetching privacy:', err);
            setError(err.message || 'Ошибка загрузки настроек приватности');
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, userId]);


    useEffect(() => {
        fetchPrivacyData();
    }, [fetchPrivacyData]);


    return {
        privacyInfo,
        isLoading,
        error,
        refetch: fetchPrivacyData,
        friendsCount: friends.length,
    };
};