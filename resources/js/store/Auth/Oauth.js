import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    provider: null,
    oauthData: null
};

const oauthSlice = createSlice({
    name: 'oauth',
    initialState,
    reducers: {
        setOAuthUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = action.payload;
            state.error = null;
        },
        setOAuthLoading: (state, action) => {
            state.loading = action.payload;
        },
        setOAuthError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setOAuthProvider: (state, action) => {
            state.provider = action.payload;
        },
        setOAuthData: (state, action) => {
            state.oauthData = action.payload;
        },
        clearOAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            state.loading = false;
            state.provider = null;
            state.oauthData = null;
        }
    },
});



export const {
    setOAuthUser,
    setOAuthLoading,
    setOAuthError,
    setOAuthProvider,
    setOAuthData,
    clearOAuth
} = oauthSlice.actions;

export default  oauthSlice.reducer;