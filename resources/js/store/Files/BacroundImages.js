import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
const backgroundSlice = createSlice({
    name: 'background',
    initialState: {
        backgrounds: {},
        selectedBackgrounds: {},
        loading: false,
        error: null
    },
    reducers: {
        setBackgroundImage: (state, action) => {
            const { userId, imageUrl } = action.payload;
            state.backgrounds[userId] = imageUrl;
        },
        setSelectedBackground: (state, action) => {
            const { chatId, backgroundUrl } = action.payload;
            state.selectedBackgrounds[chatId] = backgroundUrl;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearSelectedBackground: (state, action) => {
            const chatId = action.payload;
            delete state.selectedBackgrounds[chatId];
        },
        clearError: (state) => {
            state.error = null;
        },
        clearBackground: (state, action) => {
            const userId = action.payload;
            delete state.backgrounds[userId];
        },
        clearAllBackgrounds: (state) => {
            state.backgrounds = {};
        }
    }
});


const backgroundPersistConfig = {
    key: 'background',
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['backgrounds' , 'selectedBackgrounds'],
    blacklist: ['loading', 'error']
};

export const persistedBackgroundReducer = persistReducer(
    backgroundPersistConfig,
    backgroundSlice.reducer
);

export const loadBackground = (userId, token) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const response = await axios.get(`/chat-background/${userId}`, {
            headers: {   'Accept': 'application/json',
                'Content-Type': 'application/json' }
        });

        if (response.data.success && response.data.path_image) {
            dispatch(setBackgroundImage({
                userId,
                imageUrl: response.data.path_image
            }));
        }

        return response.data;
    } catch (error) {
        dispatch(setError('Нет сохраненного фона или ошибка загрузки'));
        console.log('Ошибка загрузки фона:', error);
    } finally {
        dispatch(setLoading(false));
    }
};

export const uploadBackground = (file, userId, token) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const formData = new FormData();
        formData.append('chat_background', file);
        formData.append('user_id', userId.toString());

        const response = await axios.post('/chat-background', formData, {
            headers: {
             'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });

        if (response.data.success) {
            dispatch(setBackgroundImage({
                userId,
                imageUrl: response.data.path_image
            }));
        }

        return response.data;
    } catch (error) {
        let errorMessage = 'Ошибка загрузки изображения';
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.response?.data?.errors) {
            errorMessage = Object.values(error.response.data.errors).flat().join(', ');
        }
        dispatch(setError(errorMessage));
        throw error;
    }
};

export const deleteBackground = (userId, token) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const response = await axios.delete(`/chat-background/${userId}`, {
            headers: {   'Accept': 'application/json',
                'Content-Type': 'application/json' }
        });

        if (response.data.success) {
            dispatch(clearSelectedBackground(userId));
        }

        return response.data;
    } catch (error) {
        dispatch(setError('Ошибка удаления фона'));
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

export const selectSelectedBackgroundByChatId = (state, chatId) =>
    state.background.selectedBackgrounds[chatId] || '';
export const selectSelectedBackground = (state) =>
    state.background.selectedBackground;
export const selectBackgroundByUserId = (state, userId) =>
    state.background.backgrounds[userId] ;

export const selectAllBackgrounds = (state) =>
    state.background.backgrounds;

export const {
    setBackgroundImage,
    setSelectedBackground,
    setLoading,
    setError,
    clearSelectedBackground,
    clearError,
    clearBackground,
    clearAllBackgrounds
} = backgroundSlice.actions;

export default backgroundSlice.reducer;
