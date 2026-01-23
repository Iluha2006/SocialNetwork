import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const FriendSlice = createSlice({
    name: 'friends',
    initialState: {
        friends: [],
        friendRequests: [],
        sentRequests: [],
        friendsLoading: false,
        loading: false,
        friendsError: null,
        incomingRequests: [],
        outgoingRequests: [],
        friendshipStatuses: {},
    },

    reducers: {


        addSentRequest: (state, action) => {
            state.sentRequests.push(action.payload);
            state.sentRequests=action.payload;
        },
        setFriendshipStatus: (state, action) => {
            const { profileId, otherProfileId, status } = action.payload;
            const statusKey = `${profileId}-${otherProfileId}`;
            state.friendshipStatuses[statusKey] = status;
        },
        setFriendsLoading: (state, action) => {
            state.friendsLoading = action.payload;
        },
        setFriendsError: (state, action) => {
            state.friendsError = action.payload;
        },
        setFriends: (state, action) => {
            state.friends = action.payload;
        },
        setIncomingRequests: (state, action) => {
            state.incomingRequests = action.payload;
        },
        setOutgoingRequests: (state, action) => {
            state.outgoingRequests = action.payload;
        },
        addFriend: (state, action) => {
            state.friends.push(action.payload);
        },
        removeFriend: (state, action) => {
            state.friends = state.friends.filter(friend => friend.id !== action.payload);
        },
        addOutgoingRequest: (state, action) => {
            state.outgoingRequests.push(action.payload);
        },
        removeRequest: (state, action) => {
            state.incomingRequests = state.incomingRequests.filter(req => req.id !== action.payload);
            state.outgoingRequests = state.outgoingRequests.filter(req => req.id !== action.payload);
        },



    }
});
export const rejectFriendRequest = (requestId) => async (dispatch,getState) => {
    try {
        dispatch(setFriendsLoading(true));

        const token = getState().user.token;
        await axios.post(`/friend/reject/${requestId}`, {}, {
            headers: {
            //    'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        dispatch(removeRequest(requestId));
        return { success: true };
    } catch (error) {
        const errorMsg = error.response?.data?.error || 'Ошибка отклонения заявки';
        dispatch(setFriendsError(errorMsg));
        return { success: false, error: errorMsg };
    } finally {
        dispatch(setFriendsLoading(false));
    }
};

export const fetchFriends = (profileId) => async (dispatch,getState) => {
    try {
        dispatch(setFriendsLoading(true));
        const token = getState().user.token;
        const response = await axios.get(`/friends/${profileId}`, {
            headers: {
            //    'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            withCredentials: true
        });
        dispatch(setFriends(response.data));
    } catch (error) {
        dispatch(setFriendsError(error.response?.data?.error || 'Ошибка загрузки друзей'));
    }
    finally {
        dispatch(setFriendsLoading(false));
    }
};

export const fetchFriendRequests = (profileId) => async (dispatch,getState) => {
    try {
        dispatch(setFriendsLoading(true));
        const token = getState().user.token;
        const response = await axios.get(`/friend/${profileId}`, {
            headers: {
              //  'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            withCredentials: true
        });
        dispatch(setIncomingRequests(response.data.incoming));
        dispatch(setOutgoingRequests(response.data.outgoing));
    } catch (error) {
        dispatch(setFriendsError(error.response?.data?.error || 'Ошибка загрузки заявок'));
    }
    finally {
        dispatch(setFriendsLoading(false));
    }
};
export const sendFriendRequest = (requestData) => async (dispatch, getState) => {
    try {
        dispatch(setFriendsLoading(true));
        const token = getState().user.token;
        const response = await axios.post('/friend/send', requestData, {
            headers: {
            //    'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            withCredentials: true
        });

        dispatch(addOutgoingRequest(response.data));
        dispatch(fetchFriendRequests(requestData.sender_id));

        return { success: true, data: response.data };
    } catch (error) {

        let errorMsg = 'Ошибка отправки заявки';
        if (error.response) {
            errorMsg = error.response.data.message ||
                      error.response.data.error ||
                      `Ошибка ${error.response.status}`;
        } else if (error.request) {
            errorMsg = 'Нет ответа от сервера';
        }

        dispatch(setFriendsError(errorMsg));

        return { success: false, error: errorMsg };
    } finally {
        dispatch(setFriendsLoading(false));
    }
};

export const acceptFriendRequest = (requestId) => async (dispatch,getState) => {
    try {
        dispatch(setFriendsLoading(true));
        const token = getState().user.token;
        await axios.post(`/friend/accept/${requestId}`, {}, {
            headers: {
           //     'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        dispatch(removeRequest(requestId));
        return { success: true };
    } catch (error) {
        const errorMsg = error.response?.data?.error || 'Ошибка принятия заявки';
        dispatch(setFriendsError(errorMsg));
        return { success: false, error: errorMsg };
    }
    finally
    {
        dispatch(setFriendsLoading(false));
    }
};

export const deleteFriend = (userId, friendId) => async (dispatch,getState) => {
    try
    {
        dispatch(setFriendsLoading(true));
        const token = getState().user.token;
        await axios.delete(`/friends/${userId}/${friendId}`, {
            headers: {
             //   'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        dispatch(removeFriend(friendId));
        return { success: true };
    }
    catch (error)
    {
        const errorMsg = error.response?.data?.error || 'Ошибка удаления друга';
        dispatch(setFriendsError(errorMsg));
        return { success: false, error: errorMsg };
    }
    finally
    {
        dispatch(setFriendsLoading(false));
    }
};



export const checkAndSetFriendshipStatus = (profileId, otherProfileId) => async (dispatch, getState) => {
    try {
        const token = getState().user.token;
        const response = await axios.get(`/friends/status/${profileId}/${otherProfileId}`, {
            headers: {
           //     'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        dispatch(setFriendshipStatus({
            profileId,
            otherProfileId,
            status: response.data.status }));

        return { success: true, status: response.data.status };
    } catch (error) {
        const errorMsg = error.response?.data?.error || 'Ошибка проверки статуса дружбы';
        return { success: false, error: errorMsg };
    }
};


const FriendPersistConfig = {
    key: 'friends',
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: [
            'friends',
            'friendRequests',
            'friendshipStatuses',
            'friendshipStatuses',
            'sentRequests',
            'incomingRequests',
            'outgoingRequests',

    ],
    blacklist: ['friendsLoading', 'friendsError']
};

export const persistedFriendReducer = persistReducer(FriendPersistConfig, FriendSlice.reducer);

export const {
    addSentRequest,
    setFriends,
    setFriendsError,
    setFriendsLoading,
    setIncomingRequests,
    setOutgoingRequests,
    removeFriend,
    removeRequest,
    addFriend,
    addOutgoingRequest,
setFriendshipStatus
} = FriendSlice.actions;

export default FriendSlice.reducer;
