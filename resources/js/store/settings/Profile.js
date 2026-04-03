import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const ProfileSlice = createSlice({
    name: 'profile',
    initialState: {

        profile: null,
        viewedProfile: null,
        allProfiles: [],
        blockedUsers: [],
        isBlocked: false,
        hasBlockedThisUser: false,
        loading: false,
        error: null,
    },

    reducers: {

        setProfile: (state, action) => {
            state.profile = action.payload;
            state.error = null;
        },
        setViewedProfile: (state, action) => {
            state.viewedProfile = action.payload;
        },
        setAllProfiles: (state, action) => {
            state.allProfiles = action.payload;
        },
        setBlockedUsers: (state, action) => {
            state.blockedUsers = action.payload;
        },
        setIsBlocked: (state, action) => {
            state.isBlocked = action.payload;
        },
        setHasBlockedThisUser: (state, action) => {
            state.hasBlockedThisUser = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearViewedProfile: (state) => {
            state.viewedProfile = null;
        },
        removeFromBlockedUsers: (state, action) => {
            state.blockedUsers = state.blockedUsers.filter(
                user => user.id !== action.payload
            );
        },

        clearProfile: (state) => {
            state.profile = null;
            state.viewedProfile = null;
            state.isBlocked = false;
            state.hasBlockedThisUser = false;
            state.error = null;
        },
    },
});


const ProfilePersistConfig = {
    key: 'profile',
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['profile', 'allProfiles', 'viewedProfile', 'blockedUsers'],
   blacklist: ['loading', 'error', 'isBlocked', 'hasBlockedThisUser'],
};

export const persistedProfileReducer = persistReducer(
    ProfilePersistConfig,
    ProfileSlice.reducer
);

export const {
    setProfile,
    setViewedProfile,
    setAllProfiles,
    setBlockedUsers,
    setIsBlocked,
    setHasBlockedThisUser,
    setLoading,
    setError,
    clearViewedProfile,
    removeFromBlockedUsers,
    clearProfile,
} = ProfileSlice.actions;

export default persistedProfileReducer;