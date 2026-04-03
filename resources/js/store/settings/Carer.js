import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
const carerSlice = createSlice({
    name: 'carer',
    initialState: {
        carers: [],
        userCarer: null,
        loading: false,
        error: null,
        successMessage: ''
    },
    reducers: {
        setCarers: (state, action) => {
            state.carers = action.payload;
        },
        setUserCarer: (state, action) => {
            state.userCarer = action.payload;
        },
        addCarer: (state, action) => {
            state.carers.push(action.payload);

            if (action.payload.user_id === state.userCarer?.user_id) {
                state.userCarer = action.payload;
            }
        },
        updateCarer: (state, action) => {
            const index = state.items.findIndex(carer => carer.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }


            if (state.userCarer && state.userCarer.id === action.payload.id) {
                state.userCarer = action.payload;
            }
        },
        removeCarer: (state, action) => {
            state.carers = state.carers.filter(carer => carer.id !== action.payload);


            if (state.userCarer && state.userCarer.id === action.payload) {
                state.userCarer = null;
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setSuccessMessage: (state, action) => {
            state.successMessage = action.payload;
        },
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = '';
        },
        clearCarers: (state) => {
            state.carers = [];
            state.userCarer = null;
        }
    }
});

// Thunk actions для Carer API
export const fetchCarers = (userId) => async (dispatch, getState) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearMessages());

        const token = getState().user.token;
        const response = await axios.get(`/api/carers/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        dispatch(setCarers(response.data));
        dispatch(setLoading(false));
        return response.data;
    } catch (error) {
        dispatch(setError(error.response?.data?.message || 'Ошибка загрузки информации об опыте работы'));
        dispatch(setLoading(false));
        throw error;
    }
};

export const fetchCurrentUserCarer = () => async (dispatch, getState) => {
    try {
        dispatch(setLoading(true));
        const user = getState().user.user;

        if (!user) {
            dispatch(setLoading(false));
            return;
        }

        const token = getState().user.token;
        const response = await axios.get(`/api/carers/${user.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            withCredentials: true
        });


        if (response.data.length > 0) {
            dispatch(setUserCarer(response.data[0]));
        }

        dispatch(setLoading(false));
        return response.data;
    } catch (error) {
        dispatch(setLoading(false));

        console.log('No carer found for user');
    }
};

export const createCarer = (carerData) => async (dispatch, getState) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearMessages());

        const token = getState().user.token;
        const response = await axios.post('/api/create-carers', carerData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        dispatch(addCarer(response.data));
        dispatch(setUserCarer(response.data));
        dispatch(setSuccessMessage('Информация об опыте работы успешно добавлена'));
        dispatch(setLoading(false));
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Ошибка создания информации об опыте работы';
        dispatch(setError(errorMsg));
        dispatch(setLoading(false));
        throw error;
    }
};

export const updateCarerById = (id, carerData) => async (dispatch, getState) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearMessages());

        const token = getState().user.token;
        const response = await axios.put(`/api/update-carers/${id}`, carerData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        dispatch(updateCarer(response.data));
        dispatch(setUserCarer(response.data));
        dispatch(setSuccessMessage('Информация об опыте работы успешно обновлена'));
        dispatch(setLoading(false));
        return response.data;
    } catch (error) {
        dispatch(setError(error.response?.data?.message || 'Ошибка обновления информации об опыте работы'));
        dispatch(setLoading(false));
        throw error;
    }
};


/*
export const deleteCarer = (id) => async (dispatch, getState) => {
    try {
        dispatch(setLoading(true));
        dispatch(clearMessages());

        const token = getState().user.token;
        await axios.delete(`/api/carers/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        });

        dispatch(removeCarer(id));
        dispatch(setSuccessMessage('Информация об опыте работы удалена'));
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setError(error.response?.data?.message || 'Ошибка удаления информации об опыте работы'));
        dispatch(setLoading(false));
        throw error;
    }
};
*/
const persistConfig = {
    key: 'carer',
    storage,

    whitelist: [' userCarer', 'profile', 'carers'],
    blacklist: [],
};

export const persistedCarerProfileReducer = persistReducer(
    persistConfig,
     carerSlice.reducer
  );
export const {
    setCarers,
    setUserCarer,
    addCarer,
    updateCarer,
    removeCarer,
    setLoading,
    setError,
    setSuccessMessage,
    clearMessages,
    clearCarers
} = carerSlice.actions;

export default carerSlice.reducer;