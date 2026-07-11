// src/store/PostUser/likesSlice.js
import { createSlice } from '@reduxjs/toolkit';

// ✅ Структура: { [userId]: { [postId]: boolean } }
// Храним ТОЛЬКО персональное состояние "лайкнул ли я"
const initialState = {};

const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    // Устанавливаем, лайкнул ли текущий пользователь этот пост
    setUserLiked: (state, action) => {
      const { userId, postId, liked } = action.payload;
      if (!userId) return;
      
      if (!state[userId]) state[userId] = {};
      state[userId][postId] = !!liked;
    },

    // Оптимистичное переключение (мгновенный отклик)
    toggleUserLiked: (state, action) => {
      const { userId, postId } = action.payload;
      if (!userId) return;
      
      if (!state[userId]) state[userId] = {};
      state[userId][postId] = !state[userId][postId];
    },

    // Очистка состояния "лайков" для пользователя (при логауте)
    clearUserLiked: (state, action) => {
      const userId = action.payload;
      if (userId) {
        delete state[userId];
      }
    },
  },
});

export const { setUserLiked, toggleUserLiked, clearUserLiked } = likesSlice.actions;
export default likesSlice.reducer;