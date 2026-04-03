import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';

const onlineUsersSlice = createSlice({
    name: 'online',
    initialState: {
        onlineUsers: [],
        loading: false,
        error: null
    },
    reducers: {
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        addOnlineUser: (state, action) => {
            const user = action.payload;
            const existingUserIndex = state.onlineUsers.findIndex(u => u.id === user.id);

            if (existingUserIndex === -1)
            {
                state.onlineUsers.push(user);
            }
             else
             {
                state.onlineUsers[existingUserIndex] = user;
            }
        },
        removeOnlineUser: (state, action) => {
            const userId = action.payload;
            state.onlineUsers = state.onlineUsers.filter(user => user.id !== userId);
        }
    }
});

export const { setOnlineUsers, setLoading, setError, addOnlineUser, removeOnlineUser } = onlineUsersSlice.actions;

export const fetchOnlineUsers = () => async (dispatch, getState) => {
    try {
        dispatch(setLoading(true));
        const token = getState().user.token;

        const response = await axios.get('/online-status/users', {
            headers: {
           //     'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        dispatch(setOnlineUsers(response.data.online_users));
    } catch (error) {
        console.error('Ошибка загрузки онлайн пользователей:', error);
        dispatch(setError(error.response?.data?.message || 'Ошибка загрузки онлайн пользователей'));
    }
};

export const setUserOnline = () => async (dispatch, getState) => {
    try {
        const token = getState().user.token;

        await axios.post('/online-status/online', {}, {
            headers: {
              //  'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
    } catch (error) {
        console.error('Ошибка установки онлайн статуса:', error);
    }
};

export const setUserOffline = () => async (dispatch, getState) => {
    try {
        const token = getState().user.token;

        await axios.post('/online-status/offline', {}, {
            headers: {
              //  'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
    } catch (error) {
        console.error('Ошибка установки оффлайн статуса:', error);
    }
};

export default onlineUsersSlice.reducer;
