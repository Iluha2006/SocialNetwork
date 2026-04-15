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


            if (privacyResult.error) {

                if (privacyResult.error.status === 403) {
                    const errorData = privacyResult.error.data;
                    setPrivacyInfo({
                        canViewProfile: false,
                        canViewFriends: false,
                        canViewImages: false,
                        message: errorData?.message || 'Доступ ограничен',
                        profileVisibility: errorData?.profile_visibility || 'private'
                    });
                } else {

                    setError(privacyResult.error.message || 'Ошибка загрузки');
                }
                setIsLoading(false);
                return;
            }


            const responseData = privacyResult.data;


            if (responseData?.success === false) {
                setPrivacyInfo({
                    canViewProfile: false,
                    canViewFriends: false,
                    canViewImages: false,
                    message: responseData.message,
                    profileVisibility: responseData.profile_visibility
                });
                setIsLoading(false);
                return;
            }


            const friendsPrivacy = await dispatch(checkFriendsPrivacy(parseInt(userId)));
            if (friendsPrivacy.error?.status === 403) {
                setPrivacyInfo(prev => ({
                    ...prev,
                    canViewFriends: false,
                    friendsVisible: friendsPrivacy.error.data?.friends_visible
                }));
            } else if (friendsPrivacy.data?.success !== false) {
                dispatch(fetchFriends(parseInt(userId)));
                setPrivacyInfo(prev => ({ ...prev, canViewFriends: true }));
            }

            const imagesPrivacy = await dispatch(checkImagesPrivacy(parseInt(userId)));
            setPrivacyInfo(prev => ({
                ...prev,
                canViewImages: !(imagesPrivacy.error?.status === 403)
            }));

        } catch (err) {
            console.error('Privacy fetch error:', err);
            setError(err.message || 'Неизвестная ошибка');
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, userId, fetchFriends]);

    useEffect(() => {
        fetchPrivacyData();
    }, [fetchPrivacyData]);

    return {
        privacyInfo,
        isLoading,
        error,
        refetch: fetchPrivacyData,
        friendsCount: friends?.length || 0,
    };
};