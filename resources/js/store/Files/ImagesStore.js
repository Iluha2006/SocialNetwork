import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
const ImagesSlice = createSlice({
    name: 'images',
    initialState: {
  userImages:{ },
  imagesLoading:false
    },
    reducers: {
        setUserImages: (state, action) => {
            const { userId, images } = action.payload;
            state.userImages[userId] = images;
          },
          setImagesLoading: (state, action) => {
            state.imagesLoading = action.payload;
          },
          removeUserImage: (state, action) => {
            const { userId, imageId } = action.payload;
            if (state.userImages[userId]) {
              state.userImages[userId] = state.userImages[userId].filter(
                img => img.id !== imageId
              );
            }
          },
    }
});

export const {
setImagesLoading,
setUserImages,
removeUserImage
} = ImagesSlice.actions;

export const deleteUserImage = (imageId, userId) => async (dispatch, getState) => {
    try {
      const token = getState().user.token;
      await axios.delete(`/images/${imageId}`, {
        headers: {
        'Accept': 'application/json',
                'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      dispatch(removeUserImage({ userId, imageId }));
      return { success: true };
    } catch (err) {
      let errorMsg = 'Ошибка удаления изображения';

      if (err.response) {
        errorMsg = err.response.data.error || errorMsg;
      } else if (err.request) {
        errorMsg = 'Ошибка сети. Проверьте соединение.';
      } else {
        errorMsg = err.message || errorMsg;
      }

      dispatch(setImagesError(errorMsg));
      return { success: false, error: errorMsg };
    }
  };
export const fetchUserImages = (userId) => async (dispatch, getState) => {
    try {
        dispatch(setImagesLoading(true));
        const token = getState().user.token;
        const response = await axios.get(`/images/${userId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });


        if (response.data && Array.isArray(response.data)) {
            dispatch(setUserImages({ userId, images: response.data }));
            return { success: true, images: response.data };
        } else {
            throw new Error('Некорректный формат данных изображений');
        }
    } catch (err) {
        console.error('Ошибка загрузки изображений:', err);
        let errorMsg = 'Ошибка загрузки изображений';


        return { success: false, error: errorMsg };
    } finally {
        dispatch(setImagesLoading(false));
    }
};
const ImagesPersistConfig = {
    key: 'images',
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: [
      'userImages'

    ],
    blacklist: []
};

export const persistedImagesReducer = persistReducer(ImagesPersistConfig, ImagesSlice.reducer);

export default ImagesSlice.reducer;
