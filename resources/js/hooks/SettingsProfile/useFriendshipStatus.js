import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    checkAndSetFriendshipStatus,
    fetchFriendRequests,
    sendFriendRequest
} from '../../store/Friends/FriendList';

export const useFriendshipStatus = (profile, currentUser) => {
    const dispatch = useDispatch();
    const { outgoingRequests } = useSelector(state => state.friends);

    const [friendshipStatus, setFriendshipStatus] = useState('not_friends');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    const calculateStatusFromRequests = useCallback(() => {
        if (!profile?.user_id || !outgoingRequests) return null;

        const outgoingRequest = outgoingRequests.find(r =>
            r.receiver_id === profile.user_id && r.status === 'pending'
        );

        return outgoingRequest ? 'request_sent' : null;
    }, [profile?.user_id, outgoingRequests]);


    const checkStatus = useCallback(async () => {
        if (!profile || !currentUser) return;

        const fromRequests = calculateStatusFromRequests();
        if (fromRequests) {
            setFriendshipStatus(fromRequests);
            return;
        }

        setIsLoading(true);
        try {
            const result = await dispatch(
                checkAndSetFriendshipStatus(currentUser.id, profile.user_id)
            );
            if (result.success) {
                setFriendshipStatus(result.status);
            }
        } catch (err) {
            console.error('Error checking friendship:', err);
            setError(err.message || 'Не удалось проверить статус дружбы');
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, profile, currentUser, calculateStatusFromRequests]);

    const sendRequest = useCallback(async () => {
        if (!profile || !currentUser || friendshipStatus !== 'not_friends') {
            return { success: false, error: 'Невозможно отправить заявку' };
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await dispatch(sendFriendRequest({
                sender_id: currentUser.id,
                receiver_id: profile.user_id
            }));

            if (result.success) {
                setFriendshipStatus('request_sent');
                dispatch(fetchFriendRequests(currentUser.id));
            }
            return result;
        } catch (err) {
            console.error('Error sending friend request:', err);
            setError(err.message || 'Ошибка отправки заявки');
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, profile, currentUser, friendshipStatus]);


    useEffect(() => {
        if (profile && currentUser) {
            checkStatus();
        }
    }, [profile, currentUser, checkStatus]);

    return {
        friendshipStatus,
        isLoading,
        error,
        checkStatus,
        sendRequest,
        setFriendshipStatus,
    };
};