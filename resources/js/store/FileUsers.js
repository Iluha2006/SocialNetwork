import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
const filesSlice = createSlice({
    name: 'files',
    initialState: {
        mediaFiles: [],
        loading: false,
        error: null
    },
    reducers: {
        setMediaFiles: (state, action) => {
            state.mediaFiles = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearFiles: (state) => {
            state.mediaFiles = [];
            state.error = null;
        }
    }
});

export const { setMediaFiles, setLoading, setError, clearFiles } = filesSlice.actions;

export const fetchChatFiles = (userId) => async (dispatch, getState) => {
    try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const token = getState().user.token;
        const response = await axios.get(`/files/${userId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });



        if (response.data.success && response.data.files) {
            dispatch(setMediaFiles(response.data.files));
        }
        return { success: true, data: response.data };

    } catch (error) {
        console.error('Error fetching files:', error);
        const errorMsg = error.response?.data?.error || 'Ошибка загрузки файлов';
        dispatch(setError(errorMsg));
        return { success: false, error: errorMsg };
    } finally {
        dispatch(setLoading(false));
    }
};

const FilePersistConfig = {
    key: 'files',
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: [
            'mediaFiles',


    ],
    blacklist: []
};

export const persistedFilesReducer = persistReducer(FilePersistConfig, filesSlice.reducer);

export default filesSlice.reducer;