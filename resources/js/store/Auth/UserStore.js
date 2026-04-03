import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
    user: null,
    isAuthenticated: false,
    token: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAuthData(state, action) {
            console.log('setAuthData called with:', action.payload);
            state.user = action.payload.user;

            state.isAuthenticated = true;
            state.error = null;
        },
        clearAuth(state) {
            state.user = null;

            state.isAuthenticated = false;
            state.error = null;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
    },
});

export const { setAuthData, clearAuth, setLoading, setError } = userSlice.actions;

//const authPersistConfig = {
 //   key: 'user',
  //  storage,
 //   whitelist: ['user', 'isAuthenticated'],
 //   blacklist: ['loading', 'error'],
//};

//export const persistedAuthReducer = persistReducer(authPersistConfig, userSlice.reducer);
export default userSlice.reducer;