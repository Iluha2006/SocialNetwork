import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
  privacySettings: null,
  loading: false,
  error: null,
  lastUpdated: null
};

const PrivateProfileSlice = createSlice({
  name: 'privateProfile',
  initialState,
  reducers: {
    setPrivacySettings: (state, action) => {
      state.privacySettings = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPrivacyState: (state) => {
      return initialState;
    }
  }
});

export const {
  setPrivacySettings,
  setLoading,
  setError,
  clearError,
  resetPrivacyState
} = PrivateProfileSlice.actions;


export const fetchPrivacySettings = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());


    const response = await axios.get('/privacy-settings', {
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });


    const settings = response.data.settings || response.data;

    dispatch(setPrivacySettings(settings));
    dispatch(setLoading(false));

    return settings;
  } catch (error) {
    const message = error.response?.data?.message || 'Ошибка загрузки настроек приватности';
    dispatch(setError(message));
    dispatch(setLoading(false));
    throw error;
  }
};


export const updatePrivacySettings = (settings) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());

    const response = await axios.post('/privacy-settings', settings, {
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const updatedSettings = response.data.settings || response.data;

    dispatch(setPrivacySettings(updatedSettings));
    dispatch(setLoading(false));

    return updatedSettings;
  } catch (error) {
    const message = error.response?.data?.message || 'Ошибка обновления настроек';
    console.error('Ошибка проверки приватности профиля:', error.response?.data || error.message);
    dispatch(setError(message));
    dispatch(setLoading(false));
    throw error;
  }
};
export const checkProfilePrivacy = (userId) => async (dispatch, getState) => {
    try {
      const response = await axios.get(`/profile/${userId}/privacy-check`, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      return response.data;
    } catch (error) {
        console.error('Ошибка проверки приватности профиля:', error.response?.data || error.message);
      if (error.response?.status === 403) {
        return {
          success: false,
          can_view_profile: false,
          message: error.response.data.message,
          profile_visibility: error.response.data.profile_visibility
        };
      }
      throw error;
    }
  };

  export const checkFriendsPrivacy = (userId) => async (dispatch) => {
    try {
      const response = await axios.get(`/profile/${userId}/friends/privacy`, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        return {
          success: false,
          can_view_friends: false,
          message: error.response.data.message,
          friends_visible: error.response.data.friends_visible
        };
      }
      throw error;
    }
  };

  export const checkImagesPrivacy = (userId) => async (dispatch) => {
    try {
      const response = await axios.get(`/profile/${userId}/images/privacy`, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      return response.data;
    } catch (error) {
     
      if (error.response?.status === 403) {
        return {
          success: false,
          can_view_images: false,
          message: error.response.data.message,
          images_visible: error.response.data.images_visible
        };
      }
      return {
        success: false,
        can_view_images: false,
        message: 'Ошибка проверки приватности изображений'
      };
    }
  };
const persistConfig = {
  key: 'privateProfile',
  storage,
  whitelist: ['privacySettings'],

};

export const persistedPrivateProfileReducer = persistReducer(
  persistConfig,
  PrivateProfileSlice.reducer
);

export default PrivateProfileSlice.reducer;