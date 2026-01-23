import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const ProfileSlice = createSlice({
    name: 'profile',
    initialState: {
        token:null,
        blockedUsers: [],
        profile:null,
        isBlocked: false,
        imagesLoading: false,
        hasBlockedThisUser: false,
        loading: false,
        imagesError: null,
        allProfiles: [],
        viewedProfile: null,
        error: null
    },

    reducers: {
        setAllProfiles: (state, action) => {
            state.allProfiles = action.payload;
        },

        setLoading(state, action) {
            state.loading = action.payload;
        },
        setProfile(state, action) {
            state.profile = action.payload;
        },
        setViewedProfile(state, action) {
            state.viewedProfile = action.payload;
        },
        setIsBlocked(state, action) {
            state.isBlocked = action.payload;
        },
        clearViewedProfile(state) {
            state.viewedProfile = null;
        },
        setHasBlockedThisUser(state, action) {
            state.hasBlockedThisUser = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
    setMessagesLoading: (state, action) => {
        state.loading = action.payload;
    },

    setMessagesError: (state, action) => {
        state.error = action.payload;
    },

    setBlockedUsers: (state, action) => {
        state.blockedUsers = action.payload;
    },
    setBlockedUsersLoading: (state, action) => {
        state.blockedUsersLoading = action.payload;
    },
    setBlockedUsersError: (state, action) => {
        state.blockedUsersError = action.payload;
    },
    removeFromBlockedUsers: (state, action) => {
        state.blockedUsers = state.blockedUsers.filter(
            user => user.id !== action.payload
        );
    }
    }
});
export const updateProfile = (profileData) => async (dispatch, getState) => {
    try {
        dispatch(setLoading(true));
        const token = getState().user.token;
        const currentUser = getState().user.user;

        const userId = profileData.id || currentUser?.id;

        const response = await axios.put(`/profile/update/${userId}`, profileData, {
            headers: {
              //  'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                 'Accept':'application/json',

            },
            withCredentials:true
        });

        if (response.data) {
            dispatch(setProfile(response.data));
        }

        return response.data;
    } catch (err) {
        dispatch(setError(err.response?.data?.message ));
        throw err;
    } finally {
        dispatch(setLoading(false));
    }
};

export const fetchBlockedUsers = () => async (dispatch, getState) => {
    try {
        dispatch(setBlockedUsersLoading(true));
        dispatch(setBlockedUsersError(null));

        const response = await axios.get('/blocked-users', {
            withCredentials: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (response.data.success) {
            dispatch(setBlockedUsers(response.data.blocked_users));
        } else {
            throw new Error(response.data.message || 'Ошибка загрузки черного списка');
        }

        return response.data.blocked_users;

    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Ошибка загрузки черного списка';
        dispatch(setBlockedUsersError(message));
        throw error;
    } finally {
        dispatch(setBlockedUsersLoading(false));
    }
};

export const blockUser = (userId) => async (dispatch, getState) => {
    try {

        await axios.post(`/profile/${userId}/block`, {}, {
            withCredentials: true,
            headers: { 'Accept': 'application/json' }
        });

        dispatch(fetchProfile(userId));
    } catch (err) {
        console.error('Ошибка блокировки:', err);
        throw err;
    }
};

export const unblockUser = (userId) => async (dispatch, getState) => {
    try {
        await axios.post(`/profile/${userId}/unblock`, {}, {
            withCredentials: true,
            headers: { 'Accept': 'application/json' }
        });

        dispatch(fetchProfile(userId));
    } catch (err) {
        console.error('Ошибка разблокировки:', err);
        throw err;
    }
};
export const fetchProfile = (userId) => async (dispatch, getState) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`/profile/${userId}`, {
            withCredentials: true,
            headers: { 'Accept': 'application/json' }
        });

        const currentUserId = getState().user.user?.id;
        const data = response.data;

        if (userId == currentUserId) {
            dispatch(setProfile(data));
        } else {
            dispatch(setViewedProfile(data));
            dispatch(setIsBlocked(data.is_blocked || false));
            dispatch(setHasBlockedThisUser(data.has_blocked_this_user || false));
        }
    } catch (err) {
        dispatch(setError(err.response?.data?.message || 'Ошибка загрузки профиля'));
    } finally {
        dispatch(setLoading(false));
    }
};


export const fetchAllProfiles = () => async (dispatch, getState) => {
    try {
        dispatch(setLoading(true));

        const response = await axios.get('/profile', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });


        console.log('Profiles response:', response.data);


        if (Array.isArray(response.data)) {
            dispatch(setAllProfiles(response.data));
        }

        else if (response.data.data && Array.isArray(response.data.data)) {
            dispatch(setAllProfiles(response.data.data));
        }
        else if (response.data.profiles && Array.isArray(response.data.profiles)) {
            dispatch(setAllProfiles(response.data.profiles));
        }
        else {

            dispatch(setAllProfiles([]));
            console.warn('Unexpected profiles format:', response.data);
        }

    }
    catch (err) {
        dispatch(setError(err.response?.data?.message || 'Ошибка загрузки профилей'));

        dispatch(setAllProfiles([]));
    } finally {
        dispatch(setLoading(false));
    }
};


export const fetchProfileImages=(userId)=> async ( dispatch ,getState)=>{

    try {

        const token = getState().user.token;
        const response = await axios.get(`/images/${userId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials:true
        });
    dispatch(setImagesProfile(response.data.user.id));

    } catch (error) {
        dispatch(setMessagesError(error.response?.data?.message || 'Ошибка загрузки сообщений'));
    } finally {
        dispatch(setMessagesLoading(false));
    }

}

const ProfilePersistConfig = {
    key: 'profile',
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['profile', 'allProfiles', 'viewedProfile'],
    blacklist: ['imagesLoading', 'imagesError']
};

export const persistedProfileReducer =
persistReducer(ProfilePersistConfig, ProfileSlice.reducer);

export const {
 setAllProfiles,
 setHasBlockedThisUser,
 setLoading ,
 setIsBlocked,
 setBlockedUsers,
    setBlockedUsersLoading,
    setBlockedUsersError,
    removeFromBlockedUsers,
 setError,
 setMessagesError,
 setMessagesLoading,
 setProfile,
 setViewedProfile,
 clearViewedProfile
} = ProfileSlice.actions;

export default ProfileSlice.reducer;